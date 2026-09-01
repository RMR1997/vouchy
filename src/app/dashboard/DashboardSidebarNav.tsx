'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Mail,
  User,
  Palette,
  Share2,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  pendingCount: number;
  username: string;
}

export const DashboardSidebarNav: React.FC<SidebarNavProps> = ({ pendingCount, username }) => {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, emoji: '🏠' },
    {
      label: 'Vouches',
      href: '/dashboard/vouches',
      icon: Mail,
      emoji: '💌',
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { label: 'Profile', href: '/dashboard/profile', icon: User, emoji: '👤' },
    { label: 'Appearance', href: '/dashboard/appearance', icon: Palette, emoji: '🎨' },
    { label: 'Share', href: '/dashboard/share', icon: Share2, emoji: '🔗' },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings, emoji: '⚙️' },
  ];

  return (
    <div className="bg-white rounded-3xl p-3 border-2 border-vouchy-purple-100 shadow-sm space-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all',
              isActive
                ? 'bg-vouchy-purple-600 text-white shadow-md shadow-vouchy-purple-200'
                : 'text-gray-700 hover:bg-vouchy-purple-50 hover:text-vouchy-purple-800'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{item.emoji}</span>
              <span>{item.label}</span>
            </div>

            {item.badge !== null && item.badge !== undefined && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-black',
                  isActive
                    ? 'bg-white text-vouchy-purple-800'
                    : 'bg-rose-500 text-white animate-pulse'
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};
