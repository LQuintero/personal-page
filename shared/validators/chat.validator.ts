import { z } from 'zod';

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(600, 'Message must be less than 600 characters')
    .trim(),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema)
    .min(1, 'At least one message is required')
    .max(12, 'Conversation is too long, refresh to start over'),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequestData = z.infer<typeof chatRequestSchema>;

export const validateChatRequest = (data: unknown) => {
  return chatRequestSchema.safeParse(data);
};
