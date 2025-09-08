'use client';

import { useState, useEffect } from 'react';

export default function SprintNameGenerator() {
  const [sprintNumber, setSprintNumber] = useState('');
  const [sprintNames, setSprintNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Sync initial toggle icon state after hydration
  useEffect(() => {
    try {
      const hasDark = document.documentElement.classList.contains('dark');
      setIsDark(hasDark);
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    try {
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  const generateSprintName = async () => {
    if (!sprintNumber || isNaN(Number(sprintNumber))) {
      setError('Please enter a valid sprint number');
      return;
    }

    setIsLoading(true);
    setError('');
    setSprintNames([]);

    try {
      const response = await fetch('/api/generate-sprint-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sprintNumber: Number(sprintNumber) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate sprint name');
      }

      if (Array.isArray(data.sprintNames)) {
        setSprintNames(data.sprintNames);
      } else if (typeof data.sprintName === 'string' && data.sprintName) {
        setSprintNames([data.sprintName]);
      } else {
        setSprintNames([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate sprint name'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      generateSprintName();
    }
  };

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    if (typeof index === 'number') {
      setCopiedIndex(index);
      setCopiedText(text);
      setTimeout(() => {
        setCopiedIndex(null);
        setCopiedText(null);
      }, 1500);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-300'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='mb-4 flex items-center justify-end'>
          <button
            onClick={toggleTheme}
            className='p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200'
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            type='button'
          >
            {isDark ? (
              <span className='material-symbols-outlined text-yellow-500'>
                light_mode
              </span>
            ) : (
              <span className='material-symbols-outlined text-slate-600'>
                dark_mode
              </span>
            )}
          </button>
        </div>

        <div className='text-center mb-6'>
          <h1 className='font-dynapuff text-4xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300'>
            Sprint Name Generator
          </h1>
          <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg transition-colors duration-300'>
            🏃‍♂️ Generate creative names for your agile sprints 💨
          </p>
        </div>

        {/* Main Card */}
        <div className='bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:py-6 md:px-4 border border-gray-200 dark:border-slate-600 transition-colors duration-300'>
          {/* Input Section */}
          <div className='mb-6'>
            <label
              htmlFor='sprintNumber'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300'
            >
              Sprint Number
            </label>
            <div className='flex flex-col sm:flex-row gap-3'>
              <input
                id='sprintNumber'
                type='number'
                value={sprintNumber}
                onChange={(e) => setSprintNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Enter sprint number'
                className='flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-slate-700'
                min='1'
                disabled={isLoading}
              />
              <button
                onClick={generateSprintName}
                disabled={isLoading || !sprintNumber}
                className='px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  </div>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-300'>
              <p className='text-red-700 dark:text-red-300 text-sm'>{error}</p>
            </div>
          )}

          {/* Result Section (multiple names) */}
          {sprintNames.length > 0 && (
            <div>
              <h2 className='text-center text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300'>
                Choose your preferred sprint name:
              </h2>

              <div className='space-y-3'>
                {sprintNames.map((name, index) => (
                  <div
                    key={name}
                    className='relative group bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 transition-colors duration-200 transform hover:shadow-lg hover:scale-[1.01] cursor-pointer'
                    onClick={() => copyToClipboard(name, index)}
                    role='button'
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        copyToClipboard(name, index);
                      }
                    }}
                  >
                    <div className='pr-10'>
                      <span className='block text-lg md:text-xl font-semibold text-green-800 dark:text-green-300 break-words transition-colors duration-300'>
                        {name}
                      </span>
                    </div>
                    {/* Right-side icon: copy on hover, check when copied */}
                    <div
                      className={
                        'pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transition-all duration-200 ' +
                        (copiedIndex === index
                          ? 'opacity-100 scale-110'
                          : 'opacity-0 group-hover:opacity-100 group-hover:scale-100')
                      }
                    >
                      {copiedIndex === index ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='w-5 h-5 text-green-600 dark:text-green-400 animate-pulse'
                          aria-hidden='true'
                        >
                          <path d='M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.5-1.5z' />
                        </svg>
                      ) : (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='w-5 h-5 text-slate-600 dark:text-slate-300'
                          aria-hidden='true'
                        >
                          <path d='M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z' />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className='text-center text-xs mt-2 text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-4 h-4 text-gray-500 dark:text-gray-400'
                  aria-hidden='true'
                >
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.52 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM11 11h2v6h-2v-6z' />
                </svg>
                <span>Tip: Click your preferred sprint name to copy.</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='text-center mt-6'>
          <p className='text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300'>
            Made with ❤️ and 🤖
          </p>
        </div>
        {/* Copied alert */}
        {copiedIndex !== null && (
          <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-md bg-green-600 text-white text-xs md:text-sm shadow-lg animate-bounce'>
            Copied!
          </div>
        )}
      </div>
    </div>
  );
}
