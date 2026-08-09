import { useCallback, useRef, useState } from 'react';
import type { ChatMessage } from '@/shared/validators/chat.validator';

export interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface UseChatWidgetReturn {
  isOpen: boolean;
  toggleOpen: () => void;
  closeChat: () => void;
  messages: DisplayMessage[];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  sendMessage: () => Promise<void>;
}

const GREETING =
  "Hi, I'm an AI version of Laura. Ask me about my work at Reconstruct, Eco Pass, or what I'm looking for next.";

const MAX_INPUT_LENGTH = 600;

let messageIdCounter = 0;
function nextId(): string {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}`;
}

export const useChatWidget = (): UseChatWidgetReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { id: 'greeting', role: 'assistant', content: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History sent to the API. Excludes the client-only greeting since the
  // server's system prompt already establishes context.
  const historyRef = useRef<ChatMessage[]>([]);

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

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
        "Something went wrong on my end. Try again, or reach me directly at /contact.";
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
    isOpen,
    toggleOpen,
    closeChat,
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
  };
};
