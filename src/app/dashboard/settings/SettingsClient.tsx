'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldAlert, User, KeyRound } from 'lucide-react';

interface SettingsClientProps {
  user: any;
}

export const SettingsClient: React.FC<SettingsClientProps> = ({ user }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: null }),
      });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-vouchy-purple-100 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-vouchy-purple-600" />
          <span>Account Overview</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-gray-700 pt-2">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
              Username
            </span>
            <span className="text-sm font-extrabold text-gray-900">@{user.username}</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
              Email Address
            </span>
            <span className="text-sm font-extrabold text-gray-900">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-100 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-rose-700 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <span>Account Actions</span>
        </h3>

        <div className="flex items-center justify-between gap-4 pt-2">
          <div>
            <p className="text-sm font-extrabold text-gray-900">Log out of Vouchy</p>
            <p className="text-xs text-gray-500 font-medium">End your active browser session</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1.5 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
