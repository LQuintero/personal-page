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
  AUTH_ERROR: 'Authentication failed. Please try again.',
  FORBIDDEN_ERROR: 'Access denied.',
  NOT_FOUND_ERROR: 'Resource not found.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
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
    
    if (errorMessage.includes('validation') || errorMessage.includes('invalid') || errorMessage.includes('required')) {
      return SAFE_ERROR_MESSAGES.VALIDATION_ERROR;
    }
    
    if (errorMessage.includes('email') || errorMessage.includes('resend') || errorMessage.includes('smtp')) {
      return SAFE_ERROR_MESSAGES.EMAIL_SEND_ERROR;
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many') || errorMessage.includes('throttle')) {
      return SAFE_ERROR_MESSAGES.RATE_LIMIT_ERROR;
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
      return SAFE_ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    if (errorMessage.includes('auth') || errorMessage.includes('unauthorized') || errorMessage.includes('token')) {
      return SAFE_ERROR_MESSAGES.AUTH_ERROR;
    }
    
    if (errorMessage.includes('forbidden') || errorMessage.includes('access denied')) {
      return SAFE_ERROR_MESSAGES.FORBIDDEN_ERROR;
    }
    
    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      return SAFE_ERROR_MESSAGES.NOT_FOUND_ERROR;
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return SAFE_ERROR_MESSAGES.TIMEOUT_ERROR;
    }
  }

  // Default safe error message
  return SAFE_ERROR_MESSAGES.SERVER_ERROR;
}

/**
 * Production-safe logging function
 * In production, should be replaced with proper logging service (e.g., Sentry, LogRocket)
 */
function logError(error: unknown, context?: string, logDetails?: any) {
  if (isDevelopment) {
    console.error(`[${context || 'API'}] Error:`, logDetails);
  } else {
    // In production, use structured logging
    // Replace console.error with your logging service
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      context: context || 'API',
      message: error instanceof Error ? error.message : 'Unknown error',
      // Don't log stack traces in production for security
      ...(process.env.LOG_STACK_TRACES === 'true' && error instanceof Error && { stack: error.stack }),
      environment: process.env.NODE_ENV,
    }));
  }
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

  // Log full error details server-side with production-safe logging
  logError(error, context, logDetails);

  return {
    message: sanitizedMessage,
    logDetails,
  };
}

