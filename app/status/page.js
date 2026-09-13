'use client';
import { useState } from 'react';
import { Clock, Users } from 'lucide-react';

export default function StatusPage() {
  const [queue, setQueue] = useState([
    { id: 'T-1001', name: 'Samantha L.', partySize: 2, status: 'in-session', calledAt: '5:02 PM' },
    { id: 'T-1002', name: 'Alex Wong', partySize: 1, status: 'waiting', joinedAt: '5:05 PM' },
    { id: 'T-1003', name: 'David & Family', partySize: 4, status: 'waiting', joinedAt: '5:07 PM' },
    { id: 'T-1004', name: 'Chris K.', partySize: 2, status: 'waiting', joinedAt: '5:10 PM' },
  ]);

  const currentlyServing = queue.find(q => q.status === 'in-session');
  const waitingList = queue.filter(q => q.status === 'waiting');

  return (
    <main className="max-w-2xl mx-auto p-4 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 space-y-6">
        <header className="border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Live Shoot Status</h1>
            <p className="text-xs text-slate-500">Real-time Waitlist Updates</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 font-semibold text-xs rounded-full animate-pulse">
            ● Live Updates
          </span>
        </header>

        {/* Current Active Shoot */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Currently In Studio</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Active</span>
          </div>
          {currentlyServing ? (
            <div>
              <p className="text-3xl font-extrabold">{currentlyServing.id}</p>
              <p className="text-lg font-medium opacity-90">{currentlyServing.name} ({currentlyServing.partySize} guests)</p>
            </div>
          ) : (
            <p className="text-lg font-medium opacity-80">Studio Ready - Awaiting Next Guest</p>
          )}
        </div>

        {/* Queue List */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Up Next in Line ({waitingList.length})</h2>
          <div className="space-y-3">
            {waitingList.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{item.id} - {item.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {item.partySize}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {item.joinedAt}</span>
                    </p>
                  </div>
                </div>
                {index === 0 && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    Next Up!
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
