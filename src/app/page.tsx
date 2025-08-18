'use client';

import { useState, useEffect } from 'react';

export default function SprintNameGenerator() {
  const [sprintNumber, setSprintNumber] = useState('');
  const [sprintName, setSprintName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyAnimation, setCopyAnimation] = useState(false);
  const [isDark, setIsDark] = useState(false);

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
    setSprintName('');

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

      setSprintName(data.sprintName);
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sprintName);
      setCopied(true);
      setCopyAnimation(true);
      setTimeout(() => setCopyAnimation(false), 300);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = sprintName;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setCopyAnimation(true);
      setTimeout(() => setCopyAnimation(false), 300);
      setTimeout(() => setCopied(false), 2000);
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

          {/* Result Section */}
          {sprintName && (
            <div className='text-center'>
              <div className='mb-4'>
                <h2 className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300'>
                  Your Sprint Name:
                </h2>
                <div className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 transition-colors duration-300'>
                  <h3 className='text-2xl md:text-3xl font-bold text-green-800 dark:text-green-300 mb-2 break-words transition-colors duration-300'>
                    {sprintName}
                  </h3>
                  <p className='text-green-600 dark:text-green-400 text-sm transition-colors duration-300'>
                    Sprint {sprintNumber}
                  </p>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                  copyAnimation ? 'copy-animation' : ''
                } ${
                  copied
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='text-center mt-6'>
          <p className='text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300'>
            Made with ❤️ and 🤖
          </p>
        </div>
      </div>
    </div>
  );
}
