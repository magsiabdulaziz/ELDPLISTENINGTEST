/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ViewTab, GoogleUser } from '../types';
import { Moon, Sun, Award, Lock, LogOut } from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  answeredCount: number;
  totalQuestions: number;
  isSubmitted: boolean;
  googleUser?: GoogleUser | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  isDarkMode,
  onToggleTheme,
  answeredCount,
  totalQuestions,
  isSubmitted,
  googleUser,
  onSignOut,
}) => {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md sticky top-0 z-40 select-none">
      {/* Zone 1: Wordmark & Institution Branding */}
      <div className="flex items-center gap-3 min-w-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('test');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 hover:opacity-90 transition-opacity truncate"
        >
          Sukkur IBA University
        </a>
        <span className="hidden lg:inline-block text-xs text-zinc-400 dark:text-zinc-500 font-medium truncate">
          · Khairpur Campus · Mid Term Exam: Think 2 (Chapters 1–4)
        </span>
      </div>

      {/* Zone 2: Navigation tabs (Transcript & Vocabulary removed; Results only after submission) */}
      <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
        <button
          onClick={() => onTabChange('test')}
          className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
            currentTab === 'test'
              ? 'text-zinc-950 dark:text-white border-zinc-900 dark:border-white font-semibold'
              : 'border-transparent hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Questions ({answeredCount}/{totalQuestions})
        </button>

        <button
          onClick={() => onTabChange('answer-sheet')}
          className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
            currentTab === 'answer-sheet'
              ? 'text-zinc-950 dark:text-white border-zinc-900 dark:border-white font-semibold'
              : 'border-transparent hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Answer Sheet
        </button>

        {/* Results tab ONLY shown after final submission */}
        {isSubmitted && (
          <button
            onClick={() => onTabChange('results')}
            className={`transition-colors pb-0.5 border-b-2 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'results'
                ? 'text-emerald-700 dark:text-emerald-400 border-emerald-600 font-semibold'
                : 'border-transparent text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300'
            }`}
          >
            <Award size={14} />
            <span>Official Results</span>
          </button>
        )}
      </nav>

      {/* Zone 3: Google Account & Exam Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {googleUser && (
          <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs">
            {/* Google Multi-color G */}
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="font-medium text-zinc-800 dark:text-zinc-200 max-w-[90px] sm:max-w-[130px] truncate">
              {googleUser.name}
            </span>
          </div>
        )}

        {googleUser && onSignOut && (
          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg transition-colors cursor-pointer"
            title="Log out and return to Google sign-in page"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        )}

        {isSubmitted ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold">
            <Lock size={12} />
            <span className="hidden sm:inline">Finalized & Locked</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-semibold">
            <span>Mid Term</span>
          </div>
        )}

        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
};
