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

    // Validate required fields with sanitized error messages
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { ok: false, error: 'All fields are required. Please fill in your name, email, and message.' },
        { status: 400 }
      );
    }

    // Basic email validation (additional validation can be added with zod)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Prevent excessively long inputs that might cause issues
    if (name.length > 100 || email.length > 254 || message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: 'One or more fields exceed the maximum length allowed.' },
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

