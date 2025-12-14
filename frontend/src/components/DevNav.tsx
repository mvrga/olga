'use client';

import Link from 'next/link';
import { LogIn, UserPlus, Home } from 'lucide-react';

export function DevNav() {
  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-200 p-3 space-y-2 md:min-w-[180px]">
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
      </div>
    </div>
  );
}