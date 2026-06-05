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
    
    const { error: sendError } = await client.emails.send({
      from,
      to,
      replyTo,
      subject,
      text,
    });

    if (sendError) {
      throw new Error(sendError.message, { cause: sendError });
    }

    return { success: true };
  } catch (error) {
    const logContext = {
      from: from?.split('@')[1] || 'unknown',
      to: to?.split('@')[1] || 'unknown',
      hasSubject: !!subject,
      hasText: !!text,
    };

    console.error('Email service error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      cause: error instanceof Error ? error.cause : undefined,
      context: logContext,
    });

    throw new Error('Email service failed to send message', { cause: error });
  }
}

