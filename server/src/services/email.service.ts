import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export interface SendEmailParams {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}

export async function sendEmail({ from, to, replyTo, subject, text }: SendEmailParams) {
  try {
    await resend.emails.send({
      from,
      to,
      replyTo,
      subject,
      text,
    });
    return { success: true };
  } catch (error) {
    console.error('Email service error:', error);
    throw new Error('Failed to send email');
  }
}

