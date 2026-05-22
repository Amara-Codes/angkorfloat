"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const DarkModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  // useEffect runs only on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder to prevent layout shift
    return <div className="w-16 h-8 px-1"></div>;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`
        relative flex items-center w-16 h-8 px-1 rounded-full transition-colors duration-500
        ${isDark ? 'bg-custom-blue' : 'bg-custom-celadon'}
      `}
      aria-label="Toggle dark mode"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Cerchio Sinistro */}
        <div
          className={`
            absolute w-5 h-5 border-2 rounded-full transition-all duration-500 ease-in-out
            ${isDark ? 'translate-x-1 border-custom-celadon' : '-translate-x-3 border-custom-blue'}
          `}
        />

        {/* Cerchio Destro */}
        <div
          className={`
            absolute w-5 h-5 border-2 rounded-full transition-all duration-500 ease-in-out
            ${isDark ? '-translate-x-1 border-custom-celadon bg-custom-celadon mix-blend-difference' : 'translate-x-3 border-custom-blue'}
          `}
        />
      </div>
    </button>
  );
};

export default DarkModeToggle;