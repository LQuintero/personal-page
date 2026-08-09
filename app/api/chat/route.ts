import { NextRequest, NextResponse } from 'next/server';
import { getChatReply } from '@/server/services/chatAssistant.service';
import { handleError } from '@/server/utils/errorHandler';
import { checkChatRateLimit } from '@/server/utils/rateLimiter';
import { validateChatRequest } from '@/shared/validators/chat.validator';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit before processing the request
    const rateLimitResult = await checkChatRateLimit(request);

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);
      return NextResponse.json(
        {
          ok: false,
          error: 'Too many messages. Please try again in a few minutes.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }

    const body = await request.json();

    // Validate the request body using the shared Zod schema
    const validation = validateChatRequest(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { ok: false, error: firstError.message },
        { status: 400 }
      );
    }

    const { messages } = validation.data;

    const { reply } = await getChatReply(messages);

    return NextResponse.json(
      { ok: true, reply },
      {
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
        },
      }
    );
  } catch (err) {
    const { message: errorMessage } = handleError(err, 'Chat API');
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}
