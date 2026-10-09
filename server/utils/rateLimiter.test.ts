import { beforeEach, describe, expect, it, vi } from 'vitest';

const { limit, limiterOptions } = vi.hoisted(() => ({
  limit: vi.fn(),
  limiterOptions: [] as {
    analytics?: boolean;
    ephemeralCache?: false | Map<string, number>;
    prefix?: string;
  }[],
}));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class {
    static slidingWindow() {
      return 'sliding-window';
    }
    constructor(opts: {
      analytics?: boolean;
      ephemeralCache?: false | Map<string, number>;
      prefix?: string;
    }) {
      limiterOptions.push(opts);
    }
    limit(...args: unknown[]) {
      return limit(...args);
    }
  },
}));

vi.mock('@/server/utils/redis', () => ({
  getRedisClientOrNull: () => ({ mocked: true }),
}));

const { checkChatDailyLimit, checkChatRateLimit, checkContactDailyLimit, getClientIP } =
  await import('./rateLimiter');

function requestWith(headers: Record<string, string>) {
  return new Request('http://localhost/api/chat', { headers });
}

const allowed = {
  success: true,
  limit: 20,
  remaining: 19,
  reset: Date.now() + 60_000,
};

describe('getClientIP', () => {
  it('uses the address Vercel sets and ignores a spoofed x-forwarded-for', () => {
    const request = requestWith({
      'x-forwarded-for': '1.1.1.1',
      'x-real-ip': '2.2.2.2',
      'x-vercel-forwarded-for': '203.0.113.5, 76.76.21.21',
    });

    expect(getClientIP(request)).toBe('203.0.113.5');
  });

  it('falls back to x-real-ip, then x-forwarded-for, then one shared key', () => {
    expect(getClientIP(requestWith({ 'x-real-ip': '198.51.100.9' }))).toBe('198.51.100.9');
    expect(getClientIP(requestWith({ 'x-forwarded-for': '198.51.100.8, 10.0.0.1' }))).toBe(
      '198.51.100.8'
    );
    expect(getClientIP(requestWith({}))).toBe('unknown');
  });
});

describe('chat limits', () => {
  beforeEach(() => {
    limit.mockResolvedValue(allowed);
    limit.mockClear();
  });

  it('rate-limits a visitor by the Vercel address', async () => {
    const request = requestWith({
      'x-vercel-forwarded-for': '203.0.113.5',
      'x-forwarded-for': '1.1.1.1',
    });

    await checkChatRateLimit(request);

    expect(limit).toHaveBeenCalledWith('203.0.113.5');
  });

  it('counts every chat against one site-wide daily bucket', async () => {
    const request = requestWith({ 'x-vercel-forwarded-for': '203.0.113.5' });

    await checkChatDailyLimit(request);

    expect(limit).toHaveBeenCalledWith('site');
    expect(limit).not.toHaveBeenCalledWith('203.0.113.5');
  });
});

describe('contact limits', () => {
  beforeEach(() => {
    limit.mockResolvedValue(allowed);
    limit.mockClear();
  });

  it('counts every contact submission against one site-wide daily bucket', async () => {
    const request = requestWith({ 'x-vercel-forwarded-for': '203.0.113.5' });

    await checkContactDailyLimit(request);

    expect(limit).toHaveBeenCalledWith('site');
    expect(limit).not.toHaveBeenCalledWith('203.0.113.5');
  });

  it('does not cache denials in memory or send rate-limit analytics', async () => {
    await checkContactDailyLimit(requestWith({ 'x-vercel-forwarded-for': '203.0.113.5' }));

    expect(limiterOptions.length).toBeGreaterThan(0);
    expect(
      limiterOptions.every((opts) => opts.analytics === false && opts.ephemeralCache === false)
    ).toBe(true);
  });
});
