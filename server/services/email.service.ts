import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export interface SendEmailParams {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}

export async function sendEmail({ from, to, replyTo, subject, text }: SendEmailParams) {
  try {
    const client = getResendClient();
    await client.emails.send({
      from,
      to,
      replyTo,
      subject,
      text,
    });
    return { success: true };
  } catch (error) {
    // Log full error details server-side for debugging
    console.error('Email service error:', error);
    // Throw generic error - will be sanitized by error handler in API route
    throw new Error('Failed to send email');
  }
}

