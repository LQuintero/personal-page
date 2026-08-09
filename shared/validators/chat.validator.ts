import { z } from 'zod';

// User messages are capped at 600 (also enforced in the client input).
// Assistant replies can be longer — with the max_tokens cap in
// chatAssistant.service.ts (300), a reply can still run to ~1200 chars,
// and replies get echoed back in conversation history.
const MAX_USER_CHARS = 600;
const MAX_ASSISTANT_CHARS = 2500;

export const chatMessageSchema = z
  .object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1, 'Message cannot be empty').trim(),
  })
  .superRefine((message, ctx) => {
    const max =
      message.role === 'assistant' ? MAX_ASSISTANT_CHARS : MAX_USER_CHARS;
    if (message.content.length > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: max,
        type: 'string',
        inclusive: true,
        origin: 'string',
        message:
          message.role === 'assistant'
            ? 'Assistant message is too long'
            : 'Message must be less than 600 characters',
        path: ['content'],
      });
    }
  });

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, 'At least one message is required')
    .max(12, 'Conversation is too long, refresh to start over'),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequestData = z.infer<typeof chatRequestSchema>;

export const validateChatRequest = (data: unknown) => {
  return chatRequestSchema.safeParse(data);
};
