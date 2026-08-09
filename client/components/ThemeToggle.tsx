'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  resolveTheme,
  toggleTheme,
  type Theme,
} from '@/lib/theme';

/** Minimal line-art sun: hollow circle + 8 short detached rays. */
function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M6.34 17.66l-1.41 1.41" />
      <path d="M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    const resolved = resolveTheme();
    applyTheme(resolved);
    setThemeState(resolved);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      if (getStoredTheme()) return;
      const next = getSystemTheme();
      applyTheme(next);
      setThemeState(next);
    };
    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, []);

  const handleToggle = () => {
    const current = theme ?? resolveTheme();
    setThemeState(toggleTheme(current));
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:text-[#41b390] focus-visible:outline-none focus-visible:text-[#41b390]"
    >
      {theme === null ? (
        <span className="h-4 w-4" aria-hidden="true" />
      ) : isDark ? (
        <SunIcon className="h-4 w-4" />
      ) : (
        <FontAwesomeIcon icon={faMoon} className="h-4 w-4" />
      )}
    </button>
  );
}
