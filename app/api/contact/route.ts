import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/server/services/email.service';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await sendEmail({
      from: `${name || 'Website Contact'} <${email}>`,
      to: process.env.RESEND_TO_EMAIL || 'lauraqdev@gmail.com',
      replyTo: email,
      subject: `New message from ${name || 'someone fancy'}`,
      text: message,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}

