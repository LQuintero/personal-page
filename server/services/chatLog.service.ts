import type { Redis } from '@upstash/redis';
import { getRedisClientOrNull } from '@/server/utils/redis';

const CHAT_LOG_KEY = 'chat:log';
const CHAT_LOG_MAX_ENTRIES = 500;

// Lazy so importing this module never throws when Upstash env vars are
// missing (the normal state in local dev, where logging just no-ops —
// same degradation as rate limiting).
let redis: Redis | null | undefined;
function getRedis(): Redis | null {
  if (redis === undefined) {
    redis = getRedisClientOrNull();
  }
  return redis;
}

export type ChatLogEntry = {
  ts: string; // ISO timestamp
  question: string;
  answered: boolean;
};

/**
 * True when the reply is one of the canned "I can't answer that" responses:
 * the fallback mandated by chat/system-prompt.md for knowledge gaps and
 * deny-list questions, or the empty-reply fallback in
 * chatAssistant.service.ts. Substring match, since the model may append to
 * the canned phrasing.
 */
export function isNoAnswerResponse(reply: string): boolean {
  return (
    reply.includes("I'm not sure about that one") ||
    reply.includes("I don't have an answer for that one")
  );
}

export async function logChatMessage(entry: ChatLogEntry): Promise<void> {
  try {
    const client = getRedis();
    if (!client) return;

    await client
      .pipeline()
      .lpush(CHAT_LOG_KEY, JSON.stringify(entry))
      .ltrim(CHAT_LOG_KEY, 0, CHAT_LOG_MAX_ENTRIES - 1)
      .exec();
  } catch {
    // Logging must never break the chat — swallow and move on.
  }
}
