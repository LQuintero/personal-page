import { NextRequest, NextResponse } from 'next/server';
import { getChatReply } from '@/server/services/chatAssistant.service';
import { isNoAnswerResponse, logChatMessage } from '@/server/services/chatLog.service';
import { handleError } from '@/server/utils/errorHandler';
import {
  checkChatDailyLimit,
  checkChatRateLimit,
  rateLimitHeaders,
  type RateLimitResult,
} from '@/server/utils/rateLimiter';
import { validateChatRequest } from '@/shared/validators/chat.validator';

export const maxDuration = 20;

function rateLimited(result: RateLimitResult, error: string, scope: 'ip' | 'site') {
  const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
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

    // Checked after the per-IP window so one noisy address cannot burn
    // the shared daily allowance on requests that were already rejected.
    const dailyLimitResult = await checkChatDailyLimit(request);

    if (!dailyLimitResult.success) {
      return rateLimited(
        dailyLimitResult,
        'The assistant has reached its daily limit. Please try again tomorrow.',
        'site'
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
