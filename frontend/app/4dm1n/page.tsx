"use client";
import axios from 'axios';
import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ["#2563eb", "#22d3ee", "#f59e42", "#f43f5e", "#a78bfa", "#10b981", "#fbbf24"];

export default function AdminPage() {
  const { data: session } = useSession();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCandidate, setFilterCandidate] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterDevice, setFilterDevice] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [candRes, voteRes] = await Promise.all([
        axios.get(`${apiUrl}/api/candidates`),
        axios.get(`${apiUrl}/api/admin/votes`),
      ]);
      setCandidates(candRes.data);
      setVotes(voteRes.data);
    } catch {
      setError('Неуспешно вчитување на податоци');
    }
  }

  async function addCandidate() {
    setError(null); setSuccess(null);
    try {
      await axios.post(`${apiUrl}/api/candidates`, { name, photo_url: photoUrl });
      setName(''); setPhotoUrl(''); setSuccess('Кандидатот е додаден');
      fetchData();
    } catch { setError('Додавањето не успеа'); }
  }

  async function deleteCandidate(id: number) {
    setError(null); setSuccess(null);
    try {
      await axios.delete(`${apiUrl}/api/candidates/${id}`);
      setSuccess('Кандидатот е избришан');
      fetchData();
    } catch { setError('Бришењето не успеа'); }
  }

  async function exportCSV() {
    window.open(`${apiUrl}/api/admin/votes/export`, '_blank');
  }

  // Summary stats
  const totalVotes = votes.length;
  const uniqueVoters = new Set(votes.map((v: any) => v.google_user_id)).size;
  const deviceStats = votes.reduce((acc: any, v: any) => { acc[v.device_type] = (acc[v.device_type] || 0) + 1; return acc; }, {});

  // Bar chart data
  const votesPerCandidate = candidates.map((c: any) => ({
    name: c.name,
    votes: votes.filter((v: any) => v.candidate_id === c.id).length,
  }));

  // Filtering
  let filteredVotes = votes;
  if (search) {
    filteredVotes = filteredVotes.filter((v: any) =>
      v.google_user_id?.toLowerCase().includes(search.toLowerCase()) ||
      v.candidate_id?.toString().includes(search) ||
      v.ip_address?.includes(search) ||
      v.country?.toLowerCase().includes(search.toLowerCase()) ||
      v.device_fingerprint?.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (filterCandidate) {
    filteredVotes = filteredVotes.filter((v: any) => v.candidate_id === Number(filterCandidate));
  }
  if (filterCountry) {
    filteredVotes = filteredVotes.filter((v: any) => v.country === filterCountry);
  }
  if (filterDevice) {
    filteredVotes = filteredVotes.filter((v: any) => v.device_type === filterDevice);
  }

  // Unique filter values
  const countryOptions = Array.from(new Set(votes.map((v: any) => v.country).filter(Boolean)));
  const deviceOptions = Array.from(new Set(votes.map((v: any) => v.device_type).filter(Boolean)));

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center py-12 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8">Админ панел</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => signIn('google')}>Најави се со Google</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-8 bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight">Админ Контрола</h1>
      {/* Summary Stats (now at the top) */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold mb-2">{totalVotes}</div>
          <div className="text-gray-500">Вкупно гласови</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold mb-2">{uniqueVoters}</div>
          <div className="text-gray-500">Уникатни гласачи</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold mb-2">{Object.entries(deviceStats).map(([k, v]) => `${k}: ${v}`).join(' | ')}</div>
          <div className="text-gray-500">Типови уреди</div>
        </div>
      </div>
      {/* Candidates + Chart Row */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Candidates 1/3 */}
        <div className="col-span-1 bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Кандидати</h2>
          <div className="mb-4 flex gap-2">
            <input className="border px-2 py-1 rounded flex-1" placeholder="Име" value={name} onChange={e => setName(e.target.value)} />
            <input className="border px-2 py-1 rounded flex-1" placeholder="Фото URL" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} />
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={addCandidate}>Додај</button>
          </div>
          <ul className="space-y-3 overflow-y-auto max-h-40 pr-2">
            {candidates.map(c => (
              <li key={c.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
                <img src={c.photo_url} alt={c.name} className="w-10 h-10 rounded-full" />
                <span className="flex-1 font-medium">{c.name}</span>
                <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => deleteCandidate(c.id)}>Избриши</button>
              </li>
            ))}
          </ul>
        </div>
        {/* Chart 2/3 */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow p-6 flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-4">Гласови по кандидат</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={votesPerCandidate} margin={{ left: 10, right: 10 }}>
              <XAxis dataKey="name" fontSize={14} tick={{ fill: '#64748b' }} />
              <YAxis allowDecimals={false} fontSize={14} tick={{ fill: '#64748b' }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="votes">
                {votesPerCandidate.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Votes & Analytics Section (full width) */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow p-6 flex flex-col min-w-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <h2 className="text-xl font-semibold">Гласови и аналитика</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              className="border px-2 py-1 rounded"
              placeholder="Пребарај по корисник, кандидат, IP, држава, отпечаток..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="border px-2 py-1 rounded" value={filterCandidate} onChange={e => setFilterCandidate(e.target.value)}>
              <option value="">Сите кандидати</option>
              {candidates.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select className="border px-2 py-1 rounded" value={filterCountry} onChange={e => setFilterCountry(e.target.value)}>
              <option value="">Сите држави</option>
              {countryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select className="border px-2 py-1 rounded" value={filterDevice} onChange={e => setFilterDevice(e.target.value)}>
              <option value="">Сите уреди</option>
              {deviceOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={exportCSV}>Експортирај CSV</button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-100 max-h-[420px] overflow-y-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-2 font-semibold">ID</th>
                <th className="p-2 font-semibold">Google User ID</th>
                <th className="p-2 font-semibold">Кандидат</th>
                <th className="p-2 font-semibold">Време</th>
                <th className="p-2 font-semibold">IP</th>
                <th className="p-2 font-semibold">User Agent</th>
                <th className="p-2 font-semibold">Браузер</th>
                <th className="p-2 font-semibold">ОС</th>
                <th className="p-2 font-semibold">Уред</th>
                <th className="p-2 font-semibold">Држава</th>
                <th className="p-2 font-semibold">Отпечаток</th>
              </tr>
            </thead>
            <tbody>
              {filteredVotes.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-gray-400">Нема гласови.</td>
                </tr>
              )}
              {filteredVotes.map((v: any) => (
                <tr key={v.id} className="even:bg-gray-50 hover:bg-blue-50 transition">
                  <td className="p-2 text-center">{v.id}</td>
                  <td className="p-2 break-all max-w-xs" title={v.google_user_id}>{v.google_user_id}</td>
                  <td className="p-2 text-center">{candidates.find(c => c.id === v.candidate_id)?.name || v.candidate_id}</td>
                  <td className="p-2 text-center whitespace-nowrap">{new Date(v.timestamp).toLocaleString()}</td>
                  <td className="p-2 text-center" title={v.ip_address}>{v.ip_address}</td>
                  <td className="p-2 break-all max-w-xs" title={v.user_agent}>{v.user_agent?.slice(0, 32)}{v.user_agent?.length > 32 ? '…' : ''}</td>
                  <td className="p-2 text-center">{v.browser}</td>
                  <td className="p-2 text-center">{v.os}</td>
                  <td className="p-2 text-center">{v.device_type}</td>
                  <td className="p-2 text-center">{v.country}</td>
                  <td className="p-2 break-all max-w-xs" title={v.device_fingerprint}>{v.device_fingerprint?.slice(0, 12)}{v.device_fingerprint?.length > 12 ? '…' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {success && <div className="text-green-600 mt-4">{success}</div>}
    </main>
  );
}
