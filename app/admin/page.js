'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWaitlist = async () => {
    try {
      // Force direct fresh fetch from Supabase route without cache
      const res = await fetch('/api/waitlist', { cache: 'no-store' });
      const data = await res.json();
      setWaitlist(data.waitlist || []);
    } catch (e) {
      console.error('Failed to fetch waitlist:', e);
    }
  };

  useEffect(() => {
    fetchWaitlist();
    const interval = setInterval(fetchWaitlist, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCallNext = async () => {
    setLoading(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CALL_NEXT' }),
      });
      await fetchWaitlist();
    } catch (e) {
      alert('Failed to call next customer');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Remove this customer from queue?')) return;
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', id }),
      });
      await fetchWaitlist();
    } catch (e) {
      alert('Failed to remove customer');
    }
  };

  const activeCustomer = waitlist.find((item) => item.status === 'in-service');
  const waitingList = waitlist.filter((item) => item.status === 'waiting');

  return (
    <div className="space-y-8 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Photographer Admin Console</h2>
          <p className="text-slate-400 text-sm">Manage queue flow and call next customer in real-time.</p>
        </div>
        <button
          onClick={handleCallNext}
          disabled={loading || waitingList.length === 0}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition text-base cursor-pointer"
        >
          {loading ? 'Processing...' : '📢 CALL NEXT CUSTOMER'}
        </button>
      </div>

      {/* Currently In Shoot Studio Section */}
      <div className="bg-slate-800 border border-amber-500/40 rounded-2xl p-6 shadow-md">
        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-3">Currently In Shoot Studio</h3>
        {activeCustomer ? (
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-black text-slate-100">#{activeCustomer.id} - {activeCustomer.name}</div>
              <div className="text-sm text-slate-400 mt-1">
                Group: {activeCustomer.groupSize} person(s) | Phone: {activeCustomer.phone || 'N/A'} | Joined: {activeCustomer.joinedAt || 'Recently'}
              </div>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-4 py-1.5 rounded-full text-sm">
              In Progress
            </span>
          </div>
        ) : (
          <p className="text-slate-500 italic">No customer is currently in shoot studio.</p>
        )}
      </div>

      {/* Waiting Lineup Section */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-200 mb-4">Waiting Lineup ({waitingList.length})</h3>
        {waitingList.length === 0 ? (
          <p className="text-slate-500">Queue is empty.</p>
        ) : (
          <div className="space-y-3">
            {waitingList.map((item, index) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center space-x-4">
                  <span className="text-amber-400 font-mono font-bold text-xl">#{item.id}</span>
                  <div>
                    <div className="font-semibold text-slate-200">{item.name}</div>
                    <div className="text-xs text-slate-400">
                      Party of {item.groupSize} {item.phone ? `• ${item.phone}` : ''} • Joined {item.joinedAt || 'Recently'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                    Pos #{index + 1}
                  </span>
                  <button
                    onClick={() => handleCancel(item.id)}
                    className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
