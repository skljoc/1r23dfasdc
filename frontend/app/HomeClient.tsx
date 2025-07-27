"use client";
import axios from 'axios';
import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import CandidateCard from './components/CandidateCard';
import ResultsBar from './components/ResultsBar';
import Toast from './components/Toast';

const TEXT = {
  mk: {
    title: 'Гласај за својот кандидат',
    liveResults: 'Резултати во живо',
    candidate: (id: number) => `Кандидат ${id}`,
    voted: 'Гласавте',
    vote: 'Гласај',
    signIn: 'Најави се со Google за да гласаш',
    voteFailed: 'Гласањето не успеа',
  },
  en: {
    title: 'Vote for Your Candidate',
    liveResults: 'Live Results',
    candidate: (id: number) => `Candidate ${id}`,
    voted: 'You have voted',
    vote: 'Vote',
    signIn: 'Sign in with Google to Vote',
    voteFailed: 'Vote failed',
  },
};

export default function HomeClient({ candidates }: { candidates: any[] }) {
  const { data: session } = useSession();
  const [voted, setVoted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [lang, setLang] = useState<'mk' | 'en'>('mk');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lang');
      if (stored === 'en' || stored === 'mk') setLang(stored);
    }
    (async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setFingerprint(result.visitorId);
      const userId = (session?.user as any)?.id;
      if (userId && result.visitorId) {
        const key = `voted_${userId}_${result.visitorId}`;
        const storedVote = localStorage.getItem(key);
        if (storedVote) setVoted(storedVote);
      }
    })();
    fetchResults();
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [session]);

  async function fetchResults() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';
      const res = await axios.get(`${apiUrl}/api/vote/results`);
      setResults(res.data);
    } catch {
      setResults([]);
    }
  }

  const handleVote = async (candidateId: number) => {
    setError(null);
    try {
      const userId = (session?.user as any)?.id;
      if (!userId || !fingerprint) return;
      const key = `voted_${userId}_${fingerprint}`;
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';
      await axios.post(`${apiUrl}/api/vote`, {
        google_user_id: userId,
        candidate_id: candidateId,
        ip_address: '',
        user_agent: navigator.userAgent,
        browser: '',
        os: '',
        device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        country: '',
        device_fingerprint: fingerprint,
      });
      setVoted(candidateId.toString());
      localStorage.setItem(key, candidateId.toString());
      fetchResults();
    } catch (e: any) {
      if (e?.response?.status === 409) {
        const userId = (session?.user as any)?.id;
        if (userId && fingerprint) {
          const key = `voted_${userId}_${fingerprint}`;
          setVoted(candidateId.toString());
          localStorage.setItem(key, candidateId.toString());
        }
      } else {
        setError(TEXT[lang].voteFailed);
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-2 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 overflow-x-hidden transition-colors duration-500">
      <Toast error={error} />
      <div className="w-full max-w-full sm:max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-10 tracking-tight text-gray-900 dark:text-white drop-shadow-lg animate-fade-in">
          {TEXT[lang].title}
        </h1>
        {/* Candidates: 1 column on mobile, 2 on small screens, 3 on desktop */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
          {candidates.map((c: any) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              voted={voted}
              onVote={session ? () => handleVote(c.id) : () => signIn('google')}
              isVoted={voted && c.id.toString() === voted}
              session={session}
              lang={lang}
              text={TEXT[lang]}
            />
          ))}
        </div>
        {/* ResultsBar always visible, responsive */}
        <div className="overflow-x-auto w-full">
          <ResultsBar results={results} candidates={candidates} lang={lang} text={TEXT[lang]} />
        </div>
      </div>
    </main>
  );
} 