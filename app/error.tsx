'use client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-4">
      <div className="max-w-md w-full bg-white dark:bg-[#121212] border border-transparent dark:border-white/10 rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          An unexpected error occurred.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#41b390] text-white rounded-md hover:bg-[#369d7a] transition-colors"
          type="button"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
