'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [groupSize, setGroupSize] = useState('1');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'JOIN', name, phone, groupSize }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('userTicketId', data.item.id);
        router.push(`/status?id=${data.item.id}`);
      } else {
        alert(data.error || 'Failed to join waitlist');
      }
    } catch (err) {
      alert('Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-8 py-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-50">Join Photoshoot Queue</h2>
        <p className="text-slate-400 text-sm">Enter your details below to hold your spot in line.</p>
      </div>

      <form onSubmit={handleJoin} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Wong"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number (Optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="For turn notification"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Group Size</label>
          <select
            value={groupSize}
            onChange={(e) => setGroupSize(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {[1, 2, 3, 4, 5, 6, '7+'].map((num) => (
              <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg transition duration-200"
        >
          {loading ? 'Joining...' : 'Get Ticket & Line Up'}
        </button>
      </form>
    </div>
  );
}
