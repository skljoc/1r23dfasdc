import axios from 'axios';
import HomeClient from './HomeClient';

export default async function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';
  let candidates = [];
  try {
    const res = await axios.get(`${apiUrl}/api/candidates`);
    candidates = res.data;
  } catch {
    candidates = [];
  }
  return <HomeClient candidates={candidates} />;
}
