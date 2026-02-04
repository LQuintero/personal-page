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
    
    // Validate input to prevent any potential data leaks
    if (!from || !to || !subject) {
      throw new Error('Email validation failed: Missing required fields');
    }
    
    await client.emails.send({
      from,
      to,
      replyTo,
      subject,
      text,
    });
    return { success: true };
  } catch (error) {
    // Don't log the actual email content for privacy
    const logContext = {
      from: from?.split('@')[1] || 'unknown', // Only log domain, not full email
      to: to?.split('@')[1] || 'unknown',     // Only log domain, not full email
      hasSubject: !!subject,
      hasText: !!text,
    };
    
    // In production, this will be handled by the error handler in the API route
    // which will sanitize the error message appropriately
    if (process.env.NODE_ENV === 'development') {
      console.error('Email service error:', { error, context: logContext });
    }
    
    // Throw generic error - will be sanitized by error handler in API route
    throw new Error('Email service failed to send message');
  }
}

