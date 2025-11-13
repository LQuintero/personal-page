/**
 * Sanitizes error messages for client responses
 * Prevents leaking implementation details in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Safe error messages that can be exposed to clients
 */
const SAFE_ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Invalid input. Please check your information and try again.',
  EMAIL_SEND_ERROR: 'Failed to send message. Please try again later.',
  SERVER_ERROR: 'An error occurred. Please try again later.',
  RATE_LIMIT_ERROR: 'Too many requests. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
} as const;

/**
 * Checks if an error message is safe to expose to clients
 */
function isSafeErrorMessage(message: string): boolean {
  // Whitelist of safe error messages
  const safeMessages = Object.values(SAFE_ERROR_MESSAGES);
  return safeMessages.some(safeMsg => message === safeMsg);
}

/**
 * Sanitizes error messages for client responses
 * In development, returns more detailed errors for debugging
 * In production, returns generic, safe error messages
 */
export function sanitizeErrorMessage(error: unknown, context?: string): string {
  // In development, show more details for debugging
  if (isDevelopment) {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  // In production, return safe generic messages
  if (error instanceof Error) {
    // If it's already a safe message, return it
    if (isSafeErrorMessage(error.message)) {
      return error.message;
    }

    // Check for specific error types and return appropriate safe messages
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      return SAFE_ERROR_MESSAGES.VALIDATION_ERROR;
    }
    
    if (errorMessage.includes('email') || errorMessage.includes('resend')) {
      return SAFE_ERROR_MESSAGES.EMAIL_SEND_ERROR;
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
      return SAFE_ERROR_MESSAGES.RATE_LIMIT_ERROR;
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return SAFE_ERROR_MESSAGES.NETWORK_ERROR;
    }
  }

  // Default safe error message
  return SAFE_ERROR_MESSAGES.SERVER_ERROR;
}

/**
 * Logs error details server-side while returning sanitized message to client
 */
export function handleError(error: unknown, context?: string): {
  message: string;
  logDetails: unknown;
} {
  const sanitizedMessage = sanitizeErrorMessage(error, context);
  const logDetails = error instanceof Error 
    ? { message: error.message, stack: error.stack, context }
    : { error, context };

  // Log full error details server-side
  console.error(`[${context || 'API'}] Error:`, logDetails);

  return {
    message: sanitizedMessage,
    logDetails,
  };
}

