'use client';

import React, { Fragment, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { MAX_CHAT_MESSAGES, useChatBar } from '@/hooks/useChatBar';
import type { DisplayMessage } from '@/hooks/useChatBar';

// Style constants - update these in one place to change styles across the chat bar.
// Neutral tones use black/white at low opacity so they read correctly in both
// light mode (white/gradient background) and dark mode (near-black background),
// matching the site's existing prefers-color-scheme-driven theme. The accent
// stays #41b390 in both modes, matching ContactForm's send button.
const styles = {
  row:
    'flex items-center gap-2 rounded-full pl-5 pr-2 py-2 ' +
    'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 ' +
    'focus-within:border-[#41b390]/60 transition-colors',
  input:
    'flex-1 bg-transparent border-none outline-none text-sm ' +
    'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
  sendButton:
    'w-8 h-8 flex-shrink-0 rounded-full bg-[#41b390] text-white flex items-center justify-center ' +
    'hover:bg-[#369d7a] disabled:bg-[#41b390]/40 disabled:cursor-not-allowed transition-colors',
  bubbleAssistant:
    'max-w-[85%] bg-black/5 dark:bg-white/10 text-gray-900 dark:text-gray-100 text-sm rounded-lg rounded-bl-sm px-3 py-2',
  bubbleUser: 'max-w-[85%] bg-[#41b390] text-white text-sm rounded-lg rounded-br-sm px-3 py-2 ml-auto',
  footer: 'mt-2 text-xs text-gray-500 dark:text-gray-400 text-center',
  backdrop: 'fixed inset-0 z-50 bg-black/40 dark:bg-black/60',
  panel:
    'fixed z-50 left-1/2 top-1/2 w-[min(100%-1.5rem,28rem)] -translate-x-1/2 -translate-y-1/2 ' +
    'flex flex-col max-h-[min(70vh,32rem)] rounded-2xl border border-black/10 dark:border-white/10 ' +
    'bg-white dark:bg-[#121212] shadow-xl',
  panelHeader:
    'flex items-center justify-between gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10',
  panelTitle: 'text-sm font-medium text-gray-900 dark:text-gray-100',
  closeButton:
    'w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 ' +
    'hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-800 dark:hover:text-gray-100 transition-colors',
  thread: 'flex-1 min-h-0 overflow-y-auto space-y-2 px-4 py-3',
  panelComposer: 'px-4 py-3 border-t border-black/10 dark:border-white/10',
  panelFooter:
    'flex items-center justify-between gap-3 px-4 py-2.5 border-t border-black/10 dark:border-white/10 ' +
    'text-xs text-gray-500 dark:text-gray-400',
  clearButton:
    'underline hover:text-gray-700 dark:hover:text-gray-200 disabled:no-underline disabled:opacity-40 ' +
    'disabled:cursor-not-allowed',
  capNote: 'px-4 pb-2 text-xs text-gray-500 dark:text-gray-400',
};

/**
 * Strips stray markdown emphasis markers (**bold**, __bold__, *italic*,
 * _italic_) down to their plain text. The system prompt instructs the
 * model never to use markdown formatting other than the contact link, but
 * models don't always follow "don't format" instructions reliably —
 * especially on longer answers. Since the chat bubbles render plain text
 * (no markdown renderer), an unstripped "**Reconstruct**" would otherwise
 * show up as literal asterisks. This is a safety net, not the primary
 * fix — see chat/system-prompt.md's "Formatting" section for the actual
 * instruction this backs up.
 */
function stripStrayMarkdown(content: string): string {
  return content
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(?<![\w*])\*([^*\n]+)\*(?![\w*])/g, '$1')
    .replace(/(?<![\w_])_([^_\n]+)_(?![\w_])/g, '$1');
}

/** Renders "[/contact](/contact)"-style markdown links as real Next.js <Link>s. */
function renderMessageContent(rawContent: string, isUser: boolean) {
  const content = stripStrayMarkdown(rawContent);
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

function ComposerRow({
  input,
  setInput,
  canSend,
  isLoading,
  onSubmit,
  inputRef,
  inputId,
  placeholder,
  onFocus,
  readOnly = false,
}: {
  input: string;
  setInput: (value: string) => void;
  canSend: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  inputId?: string;
  placeholder: string;
  onFocus?: () => void;
  /** When true the field stays focusable (e.g. to reopen the modal) but cannot type. */
  readOnly?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className={styles.row}>
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        maxLength={600}
        disabled={isLoading}
        readOnly={readOnly}
        className={styles.input}
        aria-label="Ask Laura's AI a question"
      />
      <button
        type="submit"
        disabled={!canSend || !input.trim()}
        className={styles.sendButton}
        aria-label="Send"
      >
        <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
      </button>
    </form>
  );
}

const ChatBar: React.FC = () => {
  const {
    messages,
    hasStarted,
    isOpen,
    openChat,
    closeChat,
    clearChat,
    canSend,
    input,
    setInput,
    isLoading,
    sendMessage,
  } = useChatBar();

  const titleId = useId();
  const bottomRef = useRef<HTMLDivElement>(null);
  const modalInputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  // Prevents close→restore-focus on the hero input from immediately reopening.
  const skipHeroFocusOpenRef = useRef(false);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => {
      modalInputRef.current?.focus();
    }, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeChat();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      skipHeroFocusOpenRef.current = true;
      previouslyFocusedRef.current?.focus?.();
      window.setTimeout(() => {
        skipHeroFocusOpenRef.current = false;
      }, 0);
    };
  }, [isOpen, closeChat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage();
  };

  const atCap = messages.length >= MAX_CHAT_MESSAGES;
  const heroPlaceholder = hasStarted
    ? 'Ask a follow-up...'
    : 'Ask me anything about my work...';
  const modalPlaceholder = atCap
    ? 'Clear to continue'
    : hasStarted
      ? 'Ask a follow-up...'
      : 'Ask me anything about my work...';

  const modal =
    mounted &&
    isOpen &&
    createPortal(
      <>
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close chat"
          onClick={closeChat}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={styles.panel}
        >
          <div className={styles.panelHeader}>
            <h2 id={titleId} className={styles.panelTitle}>
              Chat with Laura
            </h2>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close"
              onClick={closeChat}
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
            </button>
          </div>

          <div className={styles.thread} role="log" aria-live="polite" aria-label="Chat with Laura">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {atCap && (
            <p className={styles.capNote}>Conversation full — clear to continue.</p>
          )}

          <div className={styles.panelComposer}>
            <ComposerRow
              input={input}
              setInput={setInput}
              canSend={canSend}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              inputRef={modalInputRef}
              placeholder={modalPlaceholder}
              readOnly={atCap}
            />
          </div>

          <div className={styles.panelFooter}>
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearChat}
              disabled={!hasStarted && !input}
            >
              Clear
            </button>
            <p>
              Prefer email?{' '}
              <Link
                href="/contact"
                className="underline hover:text-gray-700 dark:hover:text-gray-200"
                onClick={closeChat}
              >
                Get in touch
              </Link>
            </p>
          </div>
        </div>
      </>,
      document.body
    );

  return (
    <div>
      <ComposerRow
        input={input}
        setInput={setInput}
        canSend={canSend}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        placeholder={atCap ? 'Clear to continue' : heroPlaceholder}
        onFocus={() => {
          if (hasStarted && !skipHeroFocusOpenRef.current) openChat();
        }}
        readOnly={atCap}
      />

      <p className={styles.footer}>
        Prefer email?{' '}
        <Link
          href="/contact"
          className="underline hover:text-gray-700 dark:hover:text-gray-200"
        >
          Get in touch
        </Link>
      </p>

      {modal}
    </div>
  );
};

export default ChatBar;
