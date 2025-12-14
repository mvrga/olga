'use client';

import Link from 'next/link';
import { LogIn, UserPlus, Home, Activity, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { clearEvents, getEvents, type EventItem } from '@/lib/api';

export function DevNav() {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    let t: any;
    const fetcher = async () => {
      try {
        const res = await getEvents();
        setEvents(res.events || []);
      } catch {}
      t = setTimeout(fetcher, 2000);
    };
    fetcher();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-200 p-3 space-y-2 md:min-w-[220px]">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap"
        >
          <Home className="size-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
        >
          <LogIn className="size-4" />
          <span>Login</span>
        </Link>
        <Link
          href="/bem-vindo"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
        >
          <UserPlus className="size-4" />
          <span>Cadastro</span>
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          <Activity className="size-4" />
          <span>Eventos ({events.length})</span>
        </button>

        {open && (
          <div className="bg-gray-50 border rounded-xl max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between p-2 sticky top-0 bg-gray-100 rounded-t-xl">
              <span className="text-xs text-gray-600">Tempo real</span>
              <button
                onClick={async () => {
                  try { await clearEvents(); setEvents([]); } catch {}
                }}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
                title="Limpar"
              >
                <Trash2 className="size-3" /> Limpar
              </button>
            </div>
            <ul className="divide-y">
              {events.slice().reverse().map((e, idx) => (
                <li key={idx} className="p-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{e.type}</span>
                    <span className="text-[10px] text-gray-500">{new Date(e.time).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-gray-700 mt-0.5">{e.message}</p>
                </li>
              ))}
              {events.length === 0 && (
                <li className="p-3 text-xs text-gray-500">Sem eventos ainda</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
