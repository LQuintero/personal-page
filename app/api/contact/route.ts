import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/server/services/email.service';
import { handleError } from '@/server/utils/errorHandler';
import { checkRateLimit } from '@/server/utils/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit before processing the request
    const rateLimitResult = await checkRateLimit(request);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recipientEmail = process.env.RESEND_TO_EMAIL || 'me@lauraq.co';

    await sendEmail({
      from: `Laura Q Web <${recipientEmail}>`,
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

