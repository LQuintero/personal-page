import { Ratelimit } from '@upstash/ratelimit';
import { getRedisClientOrNull } from '@/server/utils/redis';

type Duration = Parameters<typeof Ratelimit.slidingWindow>[1];

interface LimiterConfig {
  /** Upstash key prefix, so each feature gets its own bucket. */
  prefix: string;
  limit: number;
  window: Duration;
  windowMs: number;
}

/**
 * Contact form: 5 requests per 10 minutes per IP — a contact form is a
 * single submission, so this is deliberately tight.
 */
const CONTACT_LIMITER: LimiterConfig = {
  prefix: 'ratelimit:contact',
  limit: 5,
  window: '10 m',
  windowMs: 10 * 60 * 1000,
};

/**
 * Chat widget: 20 messages per 5 minutes per IP. Chat is a conversation,
 * not a single submission, so this is intentionally more generous than the
 * contact form. A distinct prefix means it never shares a bucket with
 * contact-form rate limiting.
 */
const CHAT_LIMITER: LimiterConfig = {
  prefix: 'ratelimit:chat',
  limit: 20,
  window: '5 m',
  windowMs: 5 * 60 * 1000,
};

const limiterCache = new Map<string, Ratelimit>();

function getLimiterOrNull(config: LimiterConfig): Ratelimit | null {
  const cached = limiterCache.get(config.prefix);
  if (cached) return cached;

  const redis = getRedisClientOrNull();
  if (!redis) return null;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.limit, config.window),
    analytics: true,
    prefix: config.prefix,
  });
  limiterCache.set(config.prefix, limiter);
  return limiter;
}

/**
 * Gets the client IP address from the request
 */
export function getClientIP(request: Request): string {
  // Try to get IP from various headers (for proxies, load balancers, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback: use a default identifier if IP cannot be determined
  // In production, this should rarely happen
  return 'unknown';
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

async function checkLimit(request: Request, config: LimiterConfig): Promise<RateLimitResult> {
  const limiter = getLimiterOrNull(config);

  // If rate limiting is not configured (development), allow all requests
  if (!limiter) {
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit,
      reset: Date.now() + config.windowMs,
    };
  }

  const result = await limiter.limit(getClientIP(request));

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/** Checks if the request should be rate limited (contact form: 5 / 10 min). */
export async function checkRateLimit(request: Request): Promise<RateLimitResult> {
  return checkLimit(request, CONTACT_LIMITER);
}

/** Checks if the request should be rate limited (chat widget: 20 / 5 min). */
export async function checkChatRateLimit(request: Request): Promise<RateLimitResult> {
  return checkLimit(request, CHAT_LIMITER);
}

/** Standard X-RateLimit-* response headers for a checked request. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
}
