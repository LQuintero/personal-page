/**
 * Server-side error handling for API routes: log the full error, return a
 * message that's safe to send to the client.
 *
 * The services deliberately throw wrapped, generic errors ("Email service
 * failed to send message", etc.) after logging their own details, so there
 * is no per-category message mapping here — in production the client always
 * gets one generic message, and the real details live in the server logs.
 */

const GENERIC_ERROR_MESSAGE = 'An error occurred. Please try again later.';

/**
 * Logs error details server-side and returns a client-safe message.
 * In development the real message is returned to ease debugging.
 */
export function handleError(error: unknown, context = 'API'): { message: string } {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      context,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      environment: process.env.NODE_ENV,
    })
  );

  if (process.env.NODE_ENV === 'development') {
    return { message: error instanceof Error ? error.message : String(error) };
  }

  return { message: GENERIC_ERROR_MESSAGE };
}
