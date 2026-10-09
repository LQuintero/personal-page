import { Ratelimit } from '@upstash/ratelimit';
import { getRedisClientOrNull } from '@/server/utils/redis';

type Duration = Parameters<typeof Ratelimit.slidingWindow>[1];

interface LimiterConfig {
  /** Upstash key prefix, so each feature gets its own bucket. */
  prefix: string;
  limit: number;
  window: Duration;
  windowMs: number;
  /**
   * When set, every request shares this bucket. Omit it to key by client IP.
   */
  identifier?: string;
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

/**
 * Whole-site daily cap: 200 messages per 24 hours, one shared bucket.
 *
 * The per-IP window does not bound the bill. Twenty messages per five
 * minutes is about 5,760 calls a day from a single address, and a new
 * address starts a new window. The bundled prompt is a few thousand
 * tokens; at Haiku 4.5 rates ($1 / million input tokens, $5 / million
 * output tokens, 300 output tokens max) a reply is on the order of a
 * cent, so one busy address is tens of dollars before anyone looks.
 * Two hundred replies is about $2.
 */
const CHAT_DAILY_LIMITER: LimiterConfig = {
  prefix: 'ratelimit:chat:daily',
  limit: 200,
  window: '1 d',
  windowMs: 24 * 60 * 60 * 1000,
  identifier: 'site',
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
 * Client IP for rate limiting.
 *
 * `x-vercel-forwarded-for` is the address Vercel sets. A visitor can send
 * `x-forwarded-for` themselves, and a proxy in front of Vercel can
 * overwrite it, so a limiter that prefers that header hands out a fresh
 * allowance for every made-up address. The other headers are only a
 * fallback for local development, where Vercel has not set one.
 */
export function getClientIP(request: Request): string {
  const vercelForwarded = request.headers.get('x-vercel-forwarded-for');
  if (vercelForwarded) {
    return vercelForwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // One shared bucket when no address is available, so missing headers
  // cannot each become their own unlimited key.
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

  const result = await limiter.limit(config.identifier ?? getClientIP(request));

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

/**
 * Site-wide daily cap for chat. This is the limit that bounds spend:
 * per-IP windows reset per address, and this one does not.
 */
export async function checkChatDailyLimit(request: Request): Promise<RateLimitResult> {
  return checkLimit(request, CHAT_DAILY_LIMITER);
}

/** Standard X-RateLimit-* response headers for a checked request. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
}
