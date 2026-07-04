import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limiter configuration for contact form API
 * Limits: 5 requests per 10 minutes per IP address
 */
let rateLimiter: Ratelimit | null = null;
let hasWarnedAboutMissingConfig = false;

function getRateLimiter(): Ratelimit | null {
  // Check if rate limiting is enabled (Upstash credentials are set)
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables are required in production'
      );
    }
    // Development fallback: rate limiting disabled if Upstash is not configured
    if (!hasWarnedAboutMissingConfig) {
      console.warn(
        '⚠️  Rate limiting disabled: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN not set'
      );
      hasWarnedAboutMissingConfig = true;
    }
    return null;
  }

  if (!rateLimiter) {
    const redis = new Redis({
      url,
      token,
    });

    rateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'), // 5 requests per 10 minutes
      analytics: true,
    });
  }

  return rateLimiter;
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

/**
 * Checks if the request should be rate limited
 * @param request - The incoming request
 * @returns Object with success status and rate limit info
 */
export async function checkRateLimit(request: Request): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
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

