import { NextRequest, NextResponse } from 'next/server';
import { getChatReply } from '@/server/services/chatAssistant.service';
import { isNoAnswerResponse, logChatMessage } from '@/server/services/chatLog.service';
import { handleError } from '@/server/utils/errorHandler';
import {
  checkChatDailyLimit,
  checkChatRateLimit,
  rateLimitHeaders,
  retryAfterSeconds,
  type RateLimitResult,
} from '@/server/utils/rateLimiter';
import { chatDailyLimitMessage } from '@/shared/formatRetryAfter';
import { validateChatRequest } from '@/shared/validators/chat.validator';

export const maxDuration = 20;

function rateLimited(result: RateLimitResult, error: string, scope: 'ip' | 'site') {
  const retryAfter = retryAfterSeconds(result);
  return NextResponse.json(
    { ok: false, error, retryAfter, scope },
    {
      status: 429,
      headers: {
        ...rateLimitHeaders(result),
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await checkChatRateLimit(request);

    if (!rateLimitResult.success) {
      return rateLimited(
        rateLimitResult,
        'Too many messages. Please try again in a few minutes.',
        'ip'
      );
    }

    const body = await request.json();

    const validation = validateChatRequest(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { ok: false, error: firstError.message },
        { status: 400 }
      );
    }

    // After the per-IP window and validation. A blocked address, or a body
    // that will not call the model, must not spend the shared daily budget.
    const dailyLimitResult = await checkChatDailyLimit(request);

    if (!dailyLimitResult.success) {
      return rateLimited(
        dailyLimitResult,
        chatDailyLimitMessage(retryAfterSeconds(dailyLimitResult)),
        'site'
      );
    }

    const { messages } = validation.data;

    const { reply } = await getChatReply(messages);

    // Log the question and whether it got a real answer — the canned
    // "I'm not sure" responses reveal gaps worth adding to chat/facts.md.
    // logChatMessage swallows its own errors, so awaiting is safe.
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    await logChatMessage({
      ts: new Date().toISOString(),
      question: lastUserMessage?.content ?? '',
      answered: !isNoAnswerResponse(reply),
    });

    return NextResponse.json(
      { ok: true, reply },
      { headers: rateLimitHeaders(rateLimitResult) }
    );
  } catch (err) {
    const { message: errorMessage } = handleError(err, 'Chat API');
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}
