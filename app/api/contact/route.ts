import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/server/services/email.service';
import { handleError } from '@/server/utils/errorHandler';
import { checkRateLimit } from '@/server/utils/rateLimiter';
import { validateContactForm } from '@/shared/validators/contact.validator';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit before processing the request
    const rateLimitResult = await checkRateLimit(request);
    
    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);
      return NextResponse.json(
        {
          ok: false,
          error: 'Too many requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
            'Retry-After': retryAfter.toString(),
          },
        }
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

    await sendEmail({
      from: fromEmail,
      to: recipientEmail,
      replyTo: email,
      subject: `New message from ${name || 'someone fancy'}`,
      text: message,
    });

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
        },
      }
    );
  } catch (err) {
    const { message: errorMessage } = handleError(err, 'Contact API');
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}

