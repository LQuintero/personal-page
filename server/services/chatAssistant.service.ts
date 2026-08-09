import { SYSTEM_PROMPT } from '@/server/generated/chatPrompt.generated';
import type { ChatMessage } from '@/shared/validators/chat.validator';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 500;

function getModel(): string {
  return process.env.CHAT_MODEL || DEFAULT_MODEL;
}

function getApiKey(): string {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  return apiKey;
}

export interface GetChatReplyResult {
  reply: string;
}

/**
 * Sends the visitor's conversation to the Anthropic API, grounded by the
 * bundled system prompt + facts pack (see chat/system-prompt.md and
 * chat/facts.md, compiled into server/generated/chatPrompt.generated.ts by
 * scripts/build-chat-prompt.mjs). The API key never reaches the browser —
 * this runs server-side only, inside app/api/chat/route.ts.
 */
export async function getChatReply(messages: ChatMessage[]): Promise<GetChatReplyResult> {
  try {
    const apiKey = getApiKey();

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: getModel(),
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: messages.map(({ role, content }) => ({ role, content })),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Anthropic API responded with ${response.status}`, {
        cause: errorBody,
      });
    }

    const data = await response.json();
    const reply = (data.content || [])
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n')
      .trim();

    return { reply: reply || "I don't have an answer for that one." };
  } catch (error) {
    console.error('Chat assistant service error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      cause: error instanceof Error ? error.cause : undefined,
      messageCount: messages.length,
    });

    throw new Error('Chat assistant service failed to generate a reply', { cause: error });
  }
}
