"use client";
export default function ResultsClient({ results }: { results: any[] }) {
  return (
    <main className="min-h-screen flex flex-col items-center py-12">
      <h1 className="text-3xl font-bold mb-8">Live Results</h1>
      <div className="w-full max-w-md">
        {results.map((r: any) => (
          <div key={r.candidate_id} className="flex items-center mb-4">
            <span className="w-32 font-semibold">Candidate {r.candidate_id}</span>
            <div className="flex-1 bg-gray-200 rounded h-6 mx-2">
              <div
                className="bg-blue-500 h-6 rounded"
                style={{ width: `${r.votes * 10}%` }}
              ></div>
            </div>
            <span className="w-8 text-right">{r.votes}</span>
          </div>
        ))}
      </div>
    </main>
  );
} 