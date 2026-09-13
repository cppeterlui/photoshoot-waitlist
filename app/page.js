'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, UserPlus, CheckCircle } from 'lucide-react';

export default function Home() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState('1');
  const [joined, setJoined] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    const ticket = {
      id: "T-" + Math.floor(1000 + Math.random() * 9000),
      name,
      phone,
      partySize,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'waiting'
    };
    setJoined(ticket);
  };

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  return (
    <main className="max-w-md mx-auto p-4 min-h-screen flex flex-col justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Camera className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-800">PhotoBooth Lineup</h1>
        </div>

        {!joined ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Wong"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number (for SMS notification)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 403 555 0199"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Party Size</label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Join Waitlist</span>
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="inline-flex p-3 bg-green-100 rounded-full text-green-600 mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">You're in Line!</h2>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Ticket Code</p>
              <p className="text-3xl font-extrabold text-indigo-600">{joined.id}</p>
              <p className="text-sm font-medium text-slate-700 mt-1">{joined.name} ({joined.partySize} guests)</p>
            </div>
            <p className="text-sm text-slate-600">
              Check the Live Status board or wait for your call notification!
            </p>
            <div className="pt-2">
              <a
                href="/status"
                className="inline-block px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl text-sm"
              >
                View Live Queue
              </a>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Scan QR Code to Share</p>
          <div className="flex justify-center p-3 bg-white rounded-xl shadow-inner border border-slate-100 inline-block">
            <QRCodeSVG value={appUrl} size={130} />
          </div>
        </div>
      </div>
    </main>
  );
}
