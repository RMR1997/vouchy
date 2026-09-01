import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Star, Search, Sparkles } from 'lucide-react';
import { DiscoverClient } from './DiscoverClient';

export default async function DiscoverPage() {
  const users = await db.user.findMany({
    include: {
      vouches: {
        where: { status: 'APPROVED' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formattedUsers = users.map((u) => {
    const total = u.vouches.length;
    const avg =
      total > 0
        ? (u.vouches.reduce((acc, v) => acc + v.rating, 0) / total).toFixed(1)
        : '5.0';
    return {
      id: u.id,
      name: u.name,
      username: u.username,
      avatar: u.avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${u.username}`,
      jobTitle: u.jobTitle || 'Vouchy Creator',
      bio: u.bio || '',
      rating: avg,
      vouchCount: total,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-extrabold text-vouchy-purple-600 uppercase tracking-widest bg-vouchy-purple-100 px-3 py-1 rounded-full">
          Community Directory
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3">
          Discover Vouchies ✨
        </h1>
        <p className="text-gray-600 font-semibold mt-2">
          Explore profiles and leave nice words for inspiring people.
        </p>
      </div>

      <DiscoverClient users={formattedUsers} />
    </div>
  );
}
