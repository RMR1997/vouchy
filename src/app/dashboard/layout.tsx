import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  LayoutDashboard,
  Mail,
  User,
  Palette,
  Share2,
  Settings,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { DashboardSidebarNav } from './DashboardSidebarNav';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-vouchy-purple-100 text-vouchy-purple-600 flex items-center justify-center font-black text-2xl mx-auto mb-4">
          ✨
        </div>
        <h1 className="text-2xl font-black text-gray-900">Create your Vouchy Profile</h1>
        <p className="text-sm font-medium text-gray-600 mt-2">
          Sign up to get your own Vouchy profile wall, collect vouches, and customize your theme!
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            disabled
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-vouchy-purple-300 text-white font-extrabold text-sm cursor-not-allowed opacity-90 flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Create My Vouchy</span>
            <span className="text-[10px] font-black uppercase bg-vouchy-purple-700 text-white px-2 py-0.5 rounded-full">
              Soon 🔒
            </span>
          </button>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white border border-gray-300 text-gray-800 font-extrabold text-sm hover:bg-gray-50 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Count pending vouches
  const pendingCount = await db.vouch.count({
    where: { profileId: user.id, status: 'PENDING' },
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Dashboard Header */}
        <div className="bg-white rounded-3xl p-5 border-2 border-vouchy-purple-100 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.username}`}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-vouchy-purple-300"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-gray-900">{user.name}</h1>
                <span className="text-xs font-bold text-vouchy-purple-700 bg-vouchy-purple-100 px-2.5 py-0.5 rounded-full">
                  Owner
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                vouchy.app/{user.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${user.username}`}
              target="_blank"
              className="px-4 py-2 rounded-xl bg-vouchy-purple-50 text-vouchy-purple-700 font-extrabold text-xs hover:bg-vouchy-purple-100 border border-vouchy-purple-200 transition flex items-center gap-1.5"
            >
              <span>View Public Wall</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <DashboardSidebarNav pendingCount={pendingCount} username={user.username} />
          </div>

          {/* Main Tab Area */}
          <div className="md:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
