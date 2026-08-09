'use client';

const SUGGESTED_QUESTIONS = [
  'What has Laura built from 0→1?',
  "What's Laura's strongest technical work?",
  'How does Laura work across product, UX & engineering?',
] as const;

const styles = {
  list:
    'pointer-events-auto mt-2.5 mx-auto flex w-fit max-w-full list-none flex-wrap items-center justify-center gap-1.5 p-0',
  pill:
    'max-w-full rounded-full border border-black/15 dark:border-white/15 bg-transparent px-2 py-0.5 ' +
    'font-mono text-[10px] leading-tight text-black/50 dark:text-white/50 ' +
    'transition-[color,border-color] duration-150 ' +
    'hover:border-black/30 hover:text-gray-900 dark:hover:border-white/35 dark:hover:text-white ' +
    'focus-visible:border-black/30 focus-visible:text-gray-900 dark:focus-visible:border-white/35 dark:focus-visible:text-white ' +
    'focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40',
};

interface SuggestedQuestionsProps {
  disabled?: boolean;
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ disabled, onSelect }: SuggestedQuestionsProps) {
  return (
    <ul className={styles.list}>
      {SUGGESTED_QUESTIONS.map((question) => (
        <li key={question}>
          <button
            type="button"
            className={styles.pill}
            disabled={disabled}
            onClick={() => onSelect(question)}
          >
            {question}
          </button>
        </li>
      ))}
    </ul>
  );
}
