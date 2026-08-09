import { Redis } from '@upstash/redis';

let hasWarnedAboutMissingConfig = false;

/**
 * Returns an Upstash Redis client, or null when the env vars aren't set.
 * Missing config is fatal in production but only a one-time warning in
 * development, where Redis-backed features (rate limiting, chat logging)
 * degrade to no-ops.
 */
export function getRedisClientOrNull(): Redis | null {
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
        '⚠️  Redis disabled (rate limiting, chat log): UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN not set'
      );
      hasWarnedAboutMissingConfig = true;
    }
    return null;
  }

  return new Redis({ url, token });
}
