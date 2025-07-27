import axios from 'axios';
import ResultsClient from '../ResultsClient';

export default async function ResultsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';
  let results = [];
  try {
    const res = await axios.get(`${apiUrl}/api/vote/results`);
    results = res.data;
  } catch {
    results = [];
  }
  return <ResultsClient results={results} />;
} 