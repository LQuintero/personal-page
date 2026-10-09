import { NextRequest } from 'next/server';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { checkRateLimit, checkContactDailyLimit } = vi.hoisted(() => ({
  checkRateLimit: vi.fn(),
  checkContactDailyLimit: vi.fn(),
}));
const { sendEmail } = vi.hoisted(() => ({ sendEmail: vi.fn() }));

vi.mock('@/server/utils/rateLimiter', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/server/utils/rateLimiter')>();
  return { ...actual, checkRateLimit, checkContactDailyLimit };
});
vi.mock('@/server/services/email.service', () => ({ sendEmail }));

const { POST } = await import('./route');

const allowedRateLimit = {
  success: true,
  limit: 5,
  remaining: 4,
  reset: Date.now() + 10 * 60 * 1000,
};

const allowedDailyLimit = {
  success: true,
  limit: 30,
  remaining: 29,
  reset: Date.now() + 24 * 60 * 60 * 1000,
};

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/contact', () => {
  const originalFrom = process.env.RESEND_FROM_EMAIL;
  const originalTo = process.env.RESEND_TO_EMAIL;

  beforeEach(() => {
    process.env.RESEND_FROM_EMAIL = 'me@example.com';
    process.env.RESEND_TO_EMAIL = 'inbox@example.com';
    checkRateLimit.mockResolvedValue(allowedRateLimit);
    checkContactDailyLimit.mockResolvedValue(allowedDailyLimit);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    process.env.RESEND_FROM_EMAIL = originalFrom;
    process.env.RESEND_TO_EMAIL = originalTo;
  });

  it('returns 429 when the rate limit has been exceeded', async () => {
    checkRateLimit.mockResolvedValue({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Date.now() + 60_000,
    });

    const response = await POST(
      makeRequest({ name: 'Ada', email: 'ada@example.com', message: 'Hello there, world!' })
    );
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.ok).toBe(false);
    expect(data.scope).toBe('ip');
    expect(sendEmail).not.toHaveBeenCalled();
    expect(checkContactDailyLimit).not.toHaveBeenCalled();
  });

  it('returns 429 when the daily cap has been exceeded', async () => {
    checkContactDailyLimit.mockResolvedValue({
      success: false,
      limit: 30,
      remaining: 0,
      reset: Date.now() + 2 * 60 * 60 * 1000,
    });

    const response = await POST(
      makeRequest({ name: 'Ada', email: 'ada@example.com', message: 'Hello there, world!' })
    );
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.ok).toBe(false);
    expect(data.scope).toBe('site');
    expect(data.error).toBe('Too many requests today. Please try again in 2 hours.');
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 with the failing field when validation fails', async () => {
    checkRateLimit.mockResolvedValue(allowedRateLimit);

    const response = await POST(
      makeRequest({ name: 'Ada', email: 'not-an-email', message: 'Hello there, world!' })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.ok).toBe(false);
    expect(data.field).toBe('email');
    expect(sendEmail).not.toHaveBeenCalled();
    expect(checkContactDailyLimit).not.toHaveBeenCalled();
  });

  it('sends the email and returns 200 on a valid submission', async () => {
    checkRateLimit.mockResolvedValue(allowedRateLimit);
    sendEmail.mockResolvedValue({ success: true });

    const response = await POST(
      makeRequest({ name: 'Ada', email: 'ada@example.com', message: 'Hello there, world!' })
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'me@example.com',
        to: 'inbox@example.com',
        replyTo: 'ada@example.com',
      })
    );
    expect(checkContactDailyLimit).toHaveBeenCalledTimes(1);
  });

  it('does not spend the daily cap when the body is not JSON', async () => {
    const response = await POST(
      new NextRequest('http://localhost/api/contact', {
        method: 'POST',
        body: 'not-json',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(response.status).toBe(500);
    expect(checkContactDailyLimit).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('does not spend the daily cap when email is not configured', async () => {
    delete process.env.RESEND_FROM_EMAIL;

    const response = await POST(
      makeRequest({ name: 'Ada', email: 'ada@example.com', message: 'Hello there, world!' })
    );

    expect(response.status).toBe(500);
    expect(checkContactDailyLimit).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
