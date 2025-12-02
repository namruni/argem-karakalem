import React, { useState } from 'react';
import { Key, Lock } from 'lucide-react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim().length > 0) {
      onSave(inputKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 max-w-md w-full shadow-2xl rounded-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
            <Lock className="w-8 h-8 text-gray-800 dark:text-gray-200" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-center mb-2">ARGEM Giriş</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
            Eğitim ve Uygulama Merkezi sanatsal çizim aracı. Devam etmek için API anahtarınızı giriniz.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Gemini API Key"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!inputKey}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 font-medium text-sm tracking-wide hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity uppercase"
          >
            Sisteme Giriş Yap
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2"
          >
            API Anahtarı Al
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
