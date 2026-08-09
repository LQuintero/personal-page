import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limiter configuration for contact form API
 * Limits: 5 requests per 10 minutes per IP address
 */
let rateLimiter: Ratelimit | null = null;

/**
 * Rate limiter configuration for the chat widget API. Chat is a
 * conversation, not a single submission, so this is intentionally more
 * generous than the contact form: 20 messages per 5 minutes per IP. Uses a
 * distinct Upstash prefix so it never shares a bucket with contact-form
 * rate limiting.
 */
let chatRateLimiter: Ratelimit | null = null;

let hasWarnedAboutMissingConfig = false;

function getRedisClientOrNull(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables are required in production'
      );
    }
    if (!hasWarnedAboutMissingConfig) {
      console.warn(
        '⚠️  Rate limiting disabled: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN not set'
      );
      hasWarnedAboutMissingConfig = true;
    }
    return null;
  }

  return new Redis({ url, token });
}

function getRateLimiter(): Ratelimit | null {
  if (!rateLimiter) {
    const redis = getRedisClientOrNull();
    if (!redis) return null;

    rateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'), // 5 requests per 10 minutes
      analytics: true,
      prefix: 'ratelimit:contact',
    });
  }

  return rateLimiter;
}

function getChatRateLimiter(): Ratelimit | null {
  if (!chatRateLimiter) {
    const redis = getRedisClientOrNull();
    if (!redis) return null;

    chatRateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '5 m'), // 20 messages per 5 minutes
      analytics: true,
      prefix: 'ratelimit:chat',
    });
  }

  return chatRateLimiter;
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

/**
 * Checks if the request should be rate limited (contact form: 5 / 10 min)
 * @param request - The incoming request
 * @returns Object with success status and rate limit info
 */
export async function checkRateLimit(request: Request): Promise<RateLimitResult> {
  const limiter = getRateLimiter();

  // If rate limiting is not configured (development), allow all requests
  if (!limiter) {
    return {
      success: true,
      limit: 5,
      remaining: 5,
      reset: Date.now() + 10 * 60 * 1000, // 10 minutes from now
    };
  }

  const identifier = getClientIP(request);
  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Checks if the request should be rate limited (chat widget: 20 / 5 min)
 * @param request - The incoming request
 * @returns Object with success status and rate limit info
 */
export async function checkChatRateLimit(request: Request): Promise<RateLimitResult> {
  const limiter = getChatRateLimiter();

  if (!limiter) {
    return {
      success: true,
      limit: 20,
      remaining: 20,
      reset: Date.now() + 5 * 60 * 1000,
    };
  }

  const identifier = getClientIP(request);
  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
