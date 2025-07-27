import React from 'react';

interface ResultsBarProps {
  results: any[];
  candidates: any[];
  lang: string;
  text: any;
}

const ResultsBar: React.FC<ResultsBarProps> = ({ results, candidates, lang, text }) => {
  const maxVotes = Math.max(...results.map(r => Number(r.votes)), 1);
  return (
    <div className="mt-12 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center tracking-tight text-gray-800 dark:text-gray-100 drop-shadow">{text.liveResults}</h2>
      <div className="space-y-6">
        {results.map((r: any) => {
          const cand = candidates.find((c: any) => c.id === Number(r.candidate_id));
          const percent = Math.round((Number(r.votes) / maxVotes) * 100);
          return (
            <div key={r.candidate_id} className="flex items-center gap-4">
              <img src={cand?.photo_url} alt={cand?.name || text.candidate(r.candidate_id)} className="w-10 h-10 object-cover rounded-full border-2 border-blue-200 dark:border-blue-700 shadow" />
              <span className="w-32 truncate font-semibold text-gray-700 dark:text-gray-200">{cand?.name || text.candidate(r.candidate_id)}</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-5 relative overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-700 dark:to-blue-500 h-5 rounded-full transition-all duration-700" style={{ width: `${percent}%` }}></div>
                <span className="absolute right-3 top-0 text-xs text-gray-800 dark:text-gray-100 h-5 flex items-center font-bold">{r.votes}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsBar;
