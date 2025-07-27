"use client";
import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('mk');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lang');
      if (stored) setLang(stored);
    }
  }, []);
  const handleLang = (l: string) => {
    if (typeof window !== 'undefined') {
      if (l !== lang) {
        setLang(l);
        localStorage.setItem('lang', l);
        window.location.reload();
      }
    }
  };
  return (
    <SessionProvider>
      <header className="w-full flex justify-end items-center px-6 py-4">
        <div className="flex gap-2 items-center">
          <button
            className={`px-3 py-1 rounded ${lang === 'mk' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
            onClick={() => handleLang('mk')}
          >Македонски</button>
          <button
            className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
            onClick={() => handleLang('en')}
          >English</button>
        </div>
      </header>
      {children}
    </SessionProvider>
  );
}
