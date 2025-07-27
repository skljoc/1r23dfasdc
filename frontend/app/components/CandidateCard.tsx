
import React from 'react';

interface CandidateCardProps {
  candidate: any;
  voted: string | null;
  onVote: () => void;
  isVoted: boolean;
  session: any;
  lang: string;
  text: any;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, voted, onVote, isVoted, session, lang, text }) => {
  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col items-center justify-between min-h-[340px] max-w-xs mx-auto p-6 border transition hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400 relative w-full ${isVoted ? 'border-2 border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'}`}
      tabIndex={0}
      aria-pressed={isVoted}
    >
      <div className="flex flex-col items-center w-full">
        <div className="w-32 h-32 mb-6 flex items-center justify-center">
          <img
            src={candidate.photo_url}
            alt={candidate.name}
            className="w-32 h-32 object-cover rounded-full border-4 border-blue-100 group-hover:border-blue-400 dark:border-blue-900 dark:group-hover:border-blue-500 transition aspect-square shadow-lg"
          />
        </div>
        <div className="font-bold text-xl text-gray-900 dark:text-white mb-4 text-center drop-shadow-sm w-full break-words whitespace-normal">
          {candidate.name}
        </div>
      </div>
      <div className="w-full flex flex-col items-center mt-auto">
        {isVoted && (
          <span className="bg-blue-500 dark:bg-blue-600 text-white text-sm px-6 py-2 rounded-full shadow font-semibold animate-fade-in">
            {text.voted}
          </span>
        )}
        {!voted && (
          <button
            className="mt-2 px-6 py-2 rounded-lg bg-blue-600 dark:bg-blue-700 text-white font-semibold text-base shadow hover:bg-blue-700 dark:hover:bg-blue-800 transition w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onVote}
            aria-label={session ? text.vote : text.signIn}
          >
            {session ? text.vote : text.signIn}
          </button>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
