'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function StatusContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('id');
  
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWaitlist = async () => {
    try {
      const res = await fetch('/api/waitlist');
      const data = await res.json();
      setWaitlist(data.waitlist || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
    const interval = setInterval(fetchWaitlist, 3000);
    return () => clearInterval(interval);
  }, []);

  const myItem = waitlist.find((item) => item.id === ticketId);
  const waitingList = waitlist.filter((item) => item.status === 'waiting');
  const myIndex = waitingList.findIndex((item) => item.id === ticketId);
  const currentInService = waitlist.find((item) => item.status === 'in-service');

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading queue status...</div>;
  }

  if (!myItem) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-red-400">Ticket not found or finished.</p>
        <a href="/" className="inline-block bg-slate-800 text-slate-200 px-4 py-2 rounded-lg">Return to Join Page</a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 py-4">
      {myItem.status === 'in-service' ? (
        <div className="bg-emerald-500/20 border-2 border-emerald-500 rounded-2xl p-6 text-center animate-pulse">
          <span className="text-4xl mb-2 block">🔔</span>
          <h2 className="text-2xl font-black text-emerald-400">IT'S YOUR TURN!</h2>
          <p className="text-slate-200 mt-1">Please head over to the photographer now.</p>
        </div>
      ) : myItem.status === 'completed' ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-slate-300">Session Completed 🎉</h2>
          <p className="text-slate-400 text-sm mt-1">Thank you for visiting!</p>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="text-slate-400 text-xs font-semibold tracking-wide uppercase">Your Queue Ticket</div>
          <div className="text-6xl font-black text-amber-400 font-mono">#{myItem.id}</div>
          <div className="text-slate-200 font-medium">{myItem.name}</div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/60">
            <div className="bg-slate-900/60 p-3 rounded-xl">
              <div className="text-xs text-slate-400">People Ahead</div>
              <div className="text-2xl font-bold text-slate-100">{myIndex !== -1 ? myIndex : 0}</div>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl">
              <div className="text-xs text-slate-400">Est. Wait</div>
              <div className="text-2xl font-bold text-slate-100">~{(myIndex !== -1 ? myIndex : 0) * 10} min</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex justify-between items-center">
        <div>
          <span className="text-xs text-slate-400 block">Currently Shooting</span>
          <span className="font-semibold text-amber-300">
            {currentInService ? `#${currentInService.id} - ${currentInService.name}` : 'None'}
          </span>
        </div>
        <span className="px-2.5 py-1 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-medium">
          Now Active
        </span>
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading...</div>}>
      <StatusContent />
    </Suspense>
  );
}
