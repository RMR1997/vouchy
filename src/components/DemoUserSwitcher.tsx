'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, Sparkles, ChevronDown } from 'lucide-react';

const DEMO_USERS = [
  { username: 'rajabi', name: 'Rajabi', role: 'Technical Consultant', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { username: 'sarahdesign', name: 'Sarah Chen', role: 'Product Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { username: 'andi', name: 'Andi Pratama', role: 'Software Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { username: 'maya', name: 'Maya Lin', role: 'Content Creator', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
];

export const DemoUserSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSwitch = async (username: string) => {
    try {
      await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      setIsOpen(false);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Failed to switch demo user:', err);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-vouchy-purple-100 border border-vouchy-purple-200 text-vouchy-purple-800 text-xs font-extrabold hover:bg-vouchy-purple-200 transition"
      >
        <Sparkles className="w-3.5 h-3.5 text-vouchy-purple-600 animate-spin" />
        <span>Demo Account Switcher</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-playful-lg border border-vouchy-purple-100 z-50 animate-pop">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-[11px] font-extrabold uppercase text-vouchy-purple-600 tracking-wider">
              Switch Active Demo Owner
            </p>
            <p className="text-xs text-gray-500">Test dashboard & moderation as:</p>
          </div>

          <div className="py-1 space-y-1">
            {DEMO_USERS.map((user) => (
              <button
                key={user.username}
                onClick={() => handleSwitch(user.username)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-vouchy-purple-50 text-left transition"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-vouchy-purple-200"
                />
                <div>
                  <p className="text-xs font-extrabold text-gray-900">{user.name}</p>
                  <p className="text-[10px] text-gray-500">@{user.username}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
