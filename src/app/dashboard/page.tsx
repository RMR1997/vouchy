import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Star, Mail, Heart, Eye, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { VouchCard } from '@/components/VouchCard';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  // Fetch metrics
  const totalVouches = await db.vouch.count({
    where: { profileId: user.id },
  });

  const approvedVouches = await db.vouch.findMany({
    where: { profileId: user.id, status: 'APPROVED' },
    include: { reactions: true },
  });

  const pendingVouches = await db.vouch.findMany({
    where: { profileId: user.id, status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });

  const totalReactions = approvedVouches.reduce(
    (acc, v) => acc + v.reactions.length,
    0
  );

  const avgRating =
    approvedVouches.length > 0
      ? (
          approvedVouches.reduce((acc, v) => acc + v.rating, 0) /
          approvedVouches.length
        ).toFixed(1)
      : '5.0';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-vouchy-purple-600 via-vouchy-purple-500 to-vouchy-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-playful-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/20">
            Welcome back 👋
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            Hey {user.name}! Your Vouch Wall is looking great.
          </h2>
          <p className="text-sm font-medium text-vouchy-purple-100 mt-1">
            Let's manage your incoming vouches and customize your profile appearance.
          </p>
        </div>

        <Link
          href={`/${user.username}`}
          target="_blank"
          className="px-6 py-3.5 rounded-2xl bg-white text-vouchy-purple-900 font-extrabold text-sm shadow-md hover:bg-vouchy-purple-50 transition shrink-0"
        >
          View Public Wall ✨
        </Link>
      </div>

      {/* Pending Vouch Alert Banner */}
      {pendingVouches.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
              💌
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-900">
                You have {pendingVouches.length} pending {pendingVouches.length === 1 ? 'vouch' : 'vouches'} waiting for approval!
              </h3>
              <p className="text-xs text-amber-700 font-medium">
                Review and publish them so they appear on your public wall.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/vouches?tab=pending"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs transition shrink-0"
          >
            Review Now →
          </Link>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border-2 border-vouchy-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Profile Views</span>
            <span className="text-xl">👀</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900">1,284</p>
          <p className="text-[11px] font-bold text-emerald-600 mt-1">↑ +14% this week</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border-2 border-vouchy-pink-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Vouches</span>
            <span className="text-xl">💌</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900">{totalVouches}</p>
          <p className="text-[11px] font-bold text-vouchy-purple-600 mt-1">
            {approvedVouches.length} approved
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border-2 border-vouchy-yellow-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Rating</span>
            <span className="text-xl">⭐</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900">{avgRating}</p>
          <p className="text-[11px] font-bold text-amber-600 mt-1">From approved vouches</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border-2 border-vouchy-mint-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reactions</span>
            <span className="text-xl">❤️</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900">{totalReactions}</p>
          <p className="text-[11px] font-bold text-emerald-600 mt-1">From community clicks</p>
        </div>
      </div>

      {/* Recent Approved Vouches Preview */}
      <div className="bg-white rounded-3xl p-6 border-2 border-vouchy-purple-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <span>Recent Wall Vouches</span>
            <span className="text-xs font-bold bg-vouchy-purple-100 text-vouchy-purple-800 px-2.5 py-0.5 rounded-full">
              Live
            </span>
          </h3>

          <Link
            href="/dashboard/vouches"
            className="text-xs font-extrabold text-vouchy-purple-600 hover:text-vouchy-purple-800 flex items-center gap-1"
          >
            <span>Manage All ({totalVouches})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {approvedVouches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {approvedVouches.slice(0, 2).map((vouch, idx) => (
              <VouchCard
                key={vouch.id}
                id={vouch.id}
                authorName={vouch.authorName}
                authorAvatar={vouch.authorAvatar}
                message={vouch.message}
                rating={vouch.rating}
                relationship={vouch.relationship}
                isAnonymous={vouch.isAnonymous}
                createdAt={vouch.createdAt}
                reactions={vouch.reactions}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 font-medium">No approved vouches yet.</p>
        )}
      </div>
    </div>
  );
}
