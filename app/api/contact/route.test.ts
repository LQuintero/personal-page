import { NextRequest } from 'next/server';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { checkRateLimit } = vi.hoisted(() => ({ checkRateLimit: vi.fn() }));
const { sendEmail } = vi.hoisted(() => ({ sendEmail: vi.fn() }));

vi.mock('@/server/utils/rateLimiter', () => ({ checkRateLimit }));
vi.mock('@/server/services/email.service', () => ({ sendEmail }));

const { POST } = await import('./route');

const allowedRateLimit = {
  success: true,
  limit: 5,
  remaining: 4,
  reset: Date.now() + 10 * 60 * 1000,
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
  });
});
