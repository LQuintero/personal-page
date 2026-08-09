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
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  clearChat: () => void;
  canSend: boolean;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  sendMessage: () => Promise<void>;
}

const MAX_INPUT_LENGTH = 600;
/** Matches chatRequestSchema max — ~6 full turns. */
export const MAX_CHAT_MESSAGES = 12;

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
  const [isOpen, setIsOpen] = useState(false);

  // History sent to the API — same shape as the display list here since
  // there's no canned greeting to exclude.
  const historyRef = useRef<ChatMessage[]>([]);
  // Bumped on clear so an in-flight reply cannot repopulate a wiped thread.
  const sessionRef = useRef(0);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const clearChat = useCallback(() => {
    sessionRef.current += 1;
    setMessages([]);
    historyRef.current = [];
    setInput('');
    setError(null);
    setIsLoading(false);
    setIsOpen(true);
  }, []);

  const canSend = !isLoading && messages.length < MAX_CHAT_MESSAGES;

  const sendMessage = useCallback(async () => {
    const text = input.trim().slice(0, MAX_INPUT_LENGTH);
    if (!text || isLoading || historyRef.current.length >= MAX_CHAT_MESSAGES) return;

    const session = sessionRef.current;
    setIsOpen(true);
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

      if (session !== sessionRef.current) return;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to get a reply');
      }

      const reply: string = data.reply;
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: reply }]);
      historyRef.current = [...historyRef.current, { role: 'assistant', content: reply }];
    } catch (err) {
      if (session !== sessionRef.current) return;
      // Use [here](/contact) so ChatBar can render a real Link (bare "/contact" stays plain text).
      const fallback =
        'Something went wrong on my end. Try again, or reach me directly [here](/contact).';
      const message = err instanceof Error && err.message ? err.message : fallback;
      setError(message);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', content: fallback },
      ]);
    } finally {
      if (session === sessionRef.current) {
        setIsLoading(false);
      }
    }
  }, [input, isLoading]);
  return {
    messages,
    hasStarted: messages.length > 0,
    isOpen,
    openChat,
    closeChat,
    clearChat,
    canSend,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
  };
};
