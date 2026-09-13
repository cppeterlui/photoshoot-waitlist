'use client';
import { useState } from 'react';
import { Play, Bell, UserCheck, X } from 'lucide-react';

export default function AdminDashboard() {
  const [queue, setQueue] = useState([
    { id: 'T-1001', name: 'Samantha L.', phone: '403-555-0100', partySize: 2, status: 'in-session' },
    { id: 'T-1002', name: 'Alex Wong', phone: '403-555-0199', partySize: 1, status: 'waiting' },
    { id: 'T-1003', name: 'David & Family', phone: '403-555-0211', partySize: 4, status: 'waiting' },
  ]);

  const callNext = () => {
    const nextItem = queue.find(q => q.status === 'waiting');
    if (!nextItem) return;

    setQueue(queue.map(item => {
      if (item.status === 'in-session') return { ...item, status: 'completed' };
      if (item.id === nextItem.id) return { ...item, status: 'in-session' };
      return item;
    }));
  };

  const markCompleted = (id) => {
    setQueue(queue.map(item => item.id === id ? { ...item, status: 'completed' } : item));
  };

  const removeGuest = (id) => {
    setQueue(queue.filter(item => item.id !== id));
  };

  const currentGuest = queue.find(q => q.status === 'in-session');

  return (
    <main className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Studio Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Manage queue and call guests into studio</p>
        </div>
        <button
          onClick={callNext}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center space-x-2 text-lg"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Call Next Guest</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Currently Shooting Panel */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">In Studio Now</h2>
            {currentGuest ? (
              <div className="text-center py-4">
                <span className="text-4xl font-black text-indigo-600">{currentGuest.id}</span>
                <p className="text-xl font-bold text-slate-800 mt-2">{currentGuest.name}</p>
                <p className="text-sm text-slate-500">{currentGuest.phone}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                  Party of {currentGuest.partySize}
                </span>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>No active session</p>
              </div>
            )}
          </div>
          {currentGuest && (
            <button
              onClick={() => markCompleted(currentGuest.id)}
              className="w-full py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold rounded-xl text-sm transition flex items-center justify-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Finish Session</span>
            </button>
          )}
        </div>

        {/* Queue List Panel */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Waiting List ({queue.filter(q => q.status === 'waiting').length})</h2>
          <div className="space-y-3">
            {queue.filter(q => q.status === 'waiting').map((guest) => (
              <div key={guest.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                <div>
                  <p className="font-bold text-slate-800">{guest.id} - {guest.name}</p>
                  <p className="text-xs text-slate-500">{guest.phone} • {guest.partySize} person(s)</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    title="Send SMS Notify"
                    onClick={() => alert(`Notified ${guest.name} via SMS!`)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  <button
                    title="Remove from queue"
                    onClick={() => removeGuest(guest.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
