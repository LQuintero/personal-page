'use client';

import React, { Fragment, useEffect, useId, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { MAX_CHAT_MESSAGES, useChatBar } from '@/client/hooks/useChatBar';
import type { DisplayMessage } from '@/client/hooks/useChatBar';

// Style constants - update these in one place to change styles across the chat bar.
// Neutral tones use black/white at low opacity so they read correctly in both
// light mode (white/gradient background) and dark mode (near-black background),
// matching the site's existing prefers-color-scheme-driven theme. The accent
// stays #41b390 in both modes, matching ContactForm's send button.
const styles = {
  // Fills the home chat slot; when the panel is open it grows into remaining
  // viewport height so only the transcript scrolls — never the page.
  root: 'w-full min-w-0 h-full min-h-0 flex flex-col',
  row:
    'pointer-events-auto flex shrink-0 items-center gap-2 min-w-0 w-full rounded-full pl-5 pr-2 py-2 ' +
    'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 ' +
    'focus-within:border-[#41b390]/60 transition-colors',
  // min-w-0 lets the flex child shrink below its content width — without it,
  // long typed text (or even the placeholder on narrow phones) forces the
  // composer row wider than the viewport and the page scrolls sideways.
  input:
    'flex-1 min-w-0 bg-transparent border-none outline-none text-sm ' +
    'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
  sendButton:
    'w-8 h-8 flex-shrink-0 rounded-full bg-[#41b390] text-white flex items-center justify-center ' +
    'hover:bg-[#369d7a] disabled:bg-[#41b390]/40 disabled:cursor-not-allowed transition-colors',
  bubbleAssistant:
    'max-w-[85%] min-w-0 break-words bg-black/5 dark:bg-white/10 text-gray-900 dark:text-gray-100 ' +
    'text-sm rounded-lg rounded-bl-sm px-3 py-2',
  bubbleUser:
    'max-w-[85%] min-w-0 break-words bg-[#41b390] text-white text-sm rounded-lg rounded-br-sm px-3 py-2 ml-auto',
  footer: 'pointer-events-auto mt-2 shrink-0 text-xs text-gray-500 dark:text-gray-400 text-center',
  panel:
    'pointer-events-auto mt-3 flex flex-1 min-h-0 flex-col overflow-hidden rounded-2xl ' +
    'border border-black/10 dark:border-white/10 ' +
    'bg-white/80 dark:bg-[#121212]/90 backdrop-blur-sm',
  panelHeader:
    'flex shrink-0 items-center justify-between gap-3 px-4 py-2.5 border-b border-black/10 dark:border-white/10',
  panelTitle: 'text-sm font-medium text-gray-900 dark:text-gray-100',
  collapseButton:
    'w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 ' +
    'hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-800 dark:hover:text-gray-100 transition-colors',
  thread: 'flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden space-y-2 px-4 py-3',
  panelFooter:
    'flex shrink-0 items-center justify-between gap-3 min-w-0 px-4 py-2.5 border-t border-black/10 dark:border-white/10 ' +
    'text-xs text-gray-500 dark:text-gray-400',
  clearButton:
    'underline hover:text-gray-700 dark:hover:text-gray-200 disabled:no-underline disabled:opacity-40 ' +
    'disabled:cursor-not-allowed',
  capNote: 'shrink-0 px-4 pb-2 text-xs text-gray-500 dark:text-gray-400',
  reopenHint:
    'pointer-events-auto mt-2 shrink-0 text-xs text-gray-500 dark:text-gray-400 text-center underline ' +
    'hover:text-gray-700 dark:hover:text-gray-200',
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeChat();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeChat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage();
  };

  const atCap = messages.length >= MAX_CHAT_MESSAGES;
  const placeholder = atCap
    ? 'Clear to continue'
    : hasStarted
      ? 'Ask a follow-up...'
      : "Ask Laura's AI";

  const showPanel = isOpen && hasStarted;
  const showCollapsedHint = hasStarted && !isOpen;

  return (
    <div className={styles.root}>
      <form onSubmit={handleSubmit} className={styles.row}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => {
            if (hasStarted) openChat();
          }}
          placeholder={placeholder}
          maxLength={600}
          disabled={isLoading}
          readOnly={atCap}
          className={styles.input}
          aria-label="Ask Laura's AI a question"
          aria-expanded={showPanel}
          aria-controls={showPanel ? titleId : undefined}
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

      {showPanel && (
        <div
          id={titleId}
          role="region"
          aria-label="Chat with Laura"
          className={styles.panel}
        >
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Chat with Laura</h2>
            <button
              type="button"
              className={styles.collapseButton}
              aria-label="Collapse chat"
              onClick={closeChat}
            >
              <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
            </button>
          </div>

          <div
            className={styles.thread}
            role="log"
            aria-live="polite"
            aria-label="Chat with Laura"
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {atCap && (
            <p className={styles.capNote}>Conversation full — clear to continue.</p>
          )}

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
              >
                Get in touch
              </Link>
            </p>
          </div>
        </div>
      )}

      {showCollapsedHint ? (
        <button type="button" className={styles.reopenHint} onClick={openChat}>
          Show conversation
        </button>
      ) : (
        !showPanel && (
          <p className={styles.footer}>
            Prefer email?{' '}
            <Link
              href="/contact"
              className="underline hover:text-gray-700 dark:hover:text-gray-200"
            >
              Get in touch
            </Link>
          </p>
        )
      )}
    </div>
  );
};

export default ChatBar;
