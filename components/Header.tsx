import React from 'react';
import { Moon, Sun, PenTool } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  resetApp: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, resetApp }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo / Branding */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={resetApp}>
          <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-sm">
            <PenTool className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif font-bold text-lg leading-none tracking-tight">ARGEM</h1>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Araştırma Geliştirme Eğitim Merkezi
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
