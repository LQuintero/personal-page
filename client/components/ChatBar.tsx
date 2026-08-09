'use client';

import React, { Fragment, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useChatBar } from '@/hooks/useChatBar';
import type { DisplayMessage } from '@/hooks/useChatBar';

// Style constants - update these in one place to change styles across the chat bar.
// Neutral tones use black/white at low opacity so they read correctly in both
// light mode (white/gradient background) and dark mode (near-black background),
// matching the site's existing prefers-color-scheme-driven theme. The accent
// stays #41b390 in both modes, matching ContactForm's send button.
const styles = {
  row:
    'flex items-center gap-2 rounded-full pl-4 pr-1.5 py-1.5 ' +
    'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 ' +
    'focus-within:border-[#41b390]/60 transition-colors',
  input:
    'flex-1 bg-transparent border-none outline-none text-sm ' +
    'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
  sendButton:
    'w-7 h-7 flex-shrink-0 rounded-full bg-[#41b390] text-white flex items-center justify-center ' +
    'hover:bg-[#369d7a] disabled:bg-[#41b390]/40 disabled:cursor-not-allowed transition-colors',
  thread: 'mt-3 space-y-2',
  bubbleAssistant:
    'max-w-[85%] bg-black/5 dark:bg-white/10 text-gray-900 dark:text-gray-100 text-sm rounded-lg rounded-bl-sm px-3 py-2',
  bubbleUser: 'max-w-[85%] bg-[#41b390] text-white text-sm rounded-lg rounded-br-sm px-3 py-2 ml-auto',
  footer: 'mt-2 text-xs text-gray-500 dark:text-gray-400 text-center',
};

/** Renders "[/contact](/contact)"-style markdown links as real Next.js <Link>s. */
function renderMessageContent(content: string, isUser: boolean) {
  const linkPattern = /\[([^\]]+)\]\((\/[^\s)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={key++}>{content.slice(lastIndex, match.index)}</Fragment>);
    }
    parts.push(
      <Link
        key={key++}
        href={match[2]}
        className={isUser ? 'underline text-white' : 'underline text-[#2f8f71] dark:text-[#5ecda3]'}
      >
        {match[1]}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push(<Fragment key={key++}>{content.slice(lastIndex)}</Fragment>);
  }
  return parts;
}

function MessageBubble({ message }: { message: DisplayMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={isUser ? styles.bubbleUser : styles.bubbleAssistant}>
      {renderMessageContent(message.content, isUser)}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className={styles.bubbleAssistant}>
      <span className="inline-flex gap-1 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" />
      </span>
    </div>
  );
}

const ChatBar: React.FC = () => {
  const { messages, hasStarted, input, setInput, isLoading, sendMessage } = useChatBar();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasStarted) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading, hasStarted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.row}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={hasStarted ? 'Ask a follow-up' : "Ask Laura's AI anything"}
          maxLength={600}
          disabled={isLoading}
          className={styles.input}
          aria-label="Ask Laura's AI a question"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={styles.sendButton}
          aria-label="Send"
        >
          <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
        </button>
      </form>

      {hasStarted && (
        <div className={styles.thread} role="log" aria-live="polite" aria-label="Chat with Laura">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}

      <p className={styles.footer}>
        Prefer email? <Link href="/contact" className="underline hover:text-gray-700 dark:hover:text-gray-200">Get in touch</Link>
      </p>
    </div>
  );
};

export default ChatBar;
