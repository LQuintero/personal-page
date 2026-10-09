import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/server/services/email.service';
import { handleError } from '@/server/utils/errorHandler';
import {
  checkContactDailyLimit,
  checkRateLimit,
  rateLimitHeaders,
  retryAfterSeconds,
  type RateLimitResult,
} from '@/server/utils/rateLimiter';
import { contactDailyLimitMessage } from '@/shared/formatRetryAfter';
import { validateContactForm } from '@/shared/validators/contact.validator';

function rateLimited(result: RateLimitResult, error: string, scope: 'ip' | 'site') {
  const retryAfter = retryAfterSeconds(result);
  return NextResponse.json(
    { ok: false, error, retryAfter, scope },
    {
      status: 429,
      headers: {
        ...rateLimitHeaders(result),
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    // Per-address window first, so a blocked address cannot burn the daily cap.
    const rateLimitResult = await checkRateLimit(request);

    if (!rateLimitResult.success) {
      return rateLimited(
        rateLimitResult,
        'Too many requests. Please try again later.',
        'ip'
      );
    }

    const body = await request.json();

    // Validate the request body using Zod schema
    const validation = validateContactForm(body);
    
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { 
          ok: false, 
          error: firstError.message,
          field: firstError.path[0], // Include which field has the error
        },
        { status: 400 }
      );
    }

    const { name, email, message } = validation.data;

    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const recipientEmail = process.env.RESEND_TO_EMAIL;

    if (!fromEmail || !recipientEmail) {
      throw new Error('RESEND_FROM_EMAIL and RESEND_TO_EMAIL environment variables are required');
    }

    // After validation and config checks, so a rejected body cannot spend
    // the shared daily allowance. The per-IP window above still runs first.
    const dailyLimitResult = await checkContactDailyLimit(request);

    if (!dailyLimitResult.success) {
      return rateLimited(
        dailyLimitResult,
        contactDailyLimitMessage(retryAfterSeconds(dailyLimitResult)),
        'site'
      );
    }

    await sendEmail({
      from: fromEmail,
      to: recipientEmail,
      replyTo: email,
      subject: `New message from ${name || 'someone fancy'}`,
      text: message,
    });

    return NextResponse.json(
      { ok: true },
      { headers: rateLimitHeaders(rateLimitResult) }
    );
  } catch (err) {
    const { message: errorMessage } = handleError(err, 'Contact API');
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}

