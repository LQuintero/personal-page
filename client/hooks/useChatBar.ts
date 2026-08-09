import { useCallback, useRef, useState } from 'react';
import type { ChatMessage } from '@/shared/validators/chat.validator';

export interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface UseChatBarReturn {
  messages: DisplayMessage[];
  hasStarted: boolean;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  sendMessage: () => Promise<void>;
}

const MAX_INPUT_LENGTH = 600;

let messageIdCounter = 0;
function nextId(): string {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}`;
}

export const useChatBar = (): UseChatBarReturn => {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History sent to the API — same shape as the display list here since
  // there's no canned greeting to exclude.
  const historyRef = useRef<ChatMessage[]>([]);

  const sendMessage = useCallback(async () => {
    const text = input.trim().slice(0, MAX_INPUT_LENGTH);
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { id: nextId(), role: 'user', content: text }]);
    historyRef.current = [...historyRef.current, { role: 'user', content: text }];
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyRef.current }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to get a reply');
      }

      const reply: string = data.reply;
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: reply }]);
      historyRef.current = [...historyRef.current, { role: 'assistant', content: reply }];
    } catch (err) {
      const fallback =
        'Something went wrong on my end. Try again, or reach me directly at /contact.';
      const message = err instanceof Error && err.message ? err.message : fallback;
      setError(message);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', content: fallback },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return {
    messages,
    hasStarted: messages.length > 0,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
  };
};
