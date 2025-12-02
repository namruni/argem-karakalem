import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ApiKeyModal from './components/ApiKeyModal';
import SketchGenerator from './components/SketchGenerator';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize Theme
  useEffect(() => {
    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const handleReset = () => {
    // Optional: clear input logic if needed, currently just reloads or resets state
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!apiKey && <ApiKeyModal onSave={setApiKey} />}
      
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        resetApp={handleReset}
      />

      <main className="flex-grow flex flex-col items-center justify-start bg-grid-pattern">
        {apiKey && <SketchGenerator apiKey={apiKey} />}
      </main>

      <footer className="w-full py-6 border-t border-gray-200 dark:border-zinc-800 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest">
          <span>ARGEM &copy; {new Date().getFullYear()}</span>
          <span>Google Gemini AI</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
