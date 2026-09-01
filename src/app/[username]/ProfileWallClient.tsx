'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VouchCard } from '@/components/VouchCard';
import { LeaveVouchModal } from '@/components/LeaveVouchModal';
import { Sparkles, MessageCircle, Heart, Share2, ArrowUpDown, Clock } from 'lucide-react';
import Link from 'next/link';

interface Reaction {
  id: string;
  type: string;
}

interface Vouch {
  id: string;
  authorName: string;
  authorAvatar?: string | null;
  message: string;
  rating: number;
  relationship?: string;
  isAnonymous: boolean;
  cardColor?: string | null;
  proofImage?: string | null;
  createdAt: Date | string;
  reactions?: Reaction[];
}

interface ProfileWallClientProps {
  profileId: string;
  profileName: string;
  wallTitle?: string | null;
  initialVouches: Vouch[];
  layout?: string;
}

export const ProfileWallClient: React.FC<ProfileWallClientProps> = ({
  profileId,
  profileName,
  wallTitle,
  initialVouches,
  layout = 'masonry',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vouches, setVouches] = useState<Vouch[]>(initialVouches);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');

  const handleVouchSubmitted = () => {
    setIsModalOpen(false);
  };

  const sortedVouches = [...vouches].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();

    if (sortBy === 'oldest') {
      return timeA - timeB;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    // Default newest
    return timeB - timeA;
  });

  const getLayoutGridClass = () => {
    if (layout === 'clean') {
      return 'grid grid-cols-1 md:grid-cols-2 gap-6';
    }
    if (layout === 'cozy') {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5';
    }
    // Masonry / default
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
  };

  return (
    <div className="relative pb-24">
      {/* Wall Header Title & Sort Controls */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap border-b border-black/5 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2 break-words">
            {wallTitle || `What people say about ${profileName} 💬`}
          </h2>
          <p className="text-xs font-bold text-gray-500 mt-1">
            {vouches.length} {vouches.length === 1 ? 'Vouch' : 'Vouches'} on this wall
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Sort Filter Selector */}
          <div className="flex items-center gap-1.5 bg-white/90 px-3 py-2 rounded-2xl border border-gray-200 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-vouchy-purple-600 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer"
            >
              <option value="newest">🕒 Terbaru (Newest First)</option>
              <option value="oldest">⏳ Terlama (Oldest First)</option>
              <option value="rating">⭐ Rating Tertinggi (Highest Rated)</option>
            </select>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 rounded-2xl bg-vouchy-purple-600 hover:bg-vouchy-purple-700 text-white font-extrabold text-xs shadow-playful-lg shadow-vouchy-purple-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-vouchy-yellow-200" />
            <span>Leave a Vouch ✨</span>
          </button>
        </div>
      </div>

      {/* Vouch Cards Wall */}
      {sortedVouches.length > 0 ? (
        <div className={getLayoutGridClass()}>
          {sortedVouches.map((vouch, idx) => (
            <VouchCard
              key={vouch.id}
              id={vouch.id}
              authorName={vouch.authorName}
              authorAvatar={vouch.authorAvatar}
              message={vouch.message}
              rating={vouch.rating}
              isAnonymous={vouch.isAnonymous}
              createdAt={vouch.createdAt}
              reactions={vouch.reactions}
              colorStyle={vouch.cardColor || undefined}
              proofImage={vouch.proofImage}
              index={idx}
            />
          ))}
        </div>
      ) : (
        /* Playful Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-md rounded-4xl p-8 sm:p-12 border-3 border-dashed border-vouchy-purple-200 text-center max-w-md mx-auto my-8 shadow-sm"
        >
          <div className="relative w-20 h-20 mx-auto mb-4">
            <img
              src="/Avatar%20Vouchy/bubu%202.jpg"
              alt="Empty wall avatar"
              className="w-20 h-20 rounded-full object-cover border-4 border-vouchy-purple-200 shadow-md animate-bounce"
            />
            <span className="absolute -bottom-1 -right-1 text-2xl">💌</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">
            Belum ada vouch di sini! ✨
          </h3>
          <p className="text-xs sm:text-sm font-bold text-gray-600 mt-2 leading-relaxed">
            Yuk jadi orang pertama yang memberikan kata-kata manis & testimonial terbaik untuk <span className="text-vouchy-purple-700 font-extrabold">{profileName}</span>! 💖
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-vouchy-purple-600 text-white font-extrabold text-xs shadow-md shadow-vouchy-purple-200 hover:bg-vouchy-purple-700 transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-vouchy-yellow-200" />
              <span>Beri Vouch Pertama ✨</span>
            </button>
            <Link
              href="/dashboard/share"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-vouchy-purple-50 border border-vouchy-purple-200 text-vouchy-purple-800 font-extrabold text-xs hover:bg-vouchy-purple-100 transition flex items-center justify-center gap-1"
            >
              <span>Bagikan Link 🔗</span>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Floating Sticky Mobile / Desktop CTA Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-4 rounded-full bg-vouchy-purple-600 hover:bg-vouchy-purple-700 text-white font-black text-base shadow-playful-lg shadow-vouchy-purple-400 border-2 border-white flex items-center gap-2.5"
        >
          <Sparkles className="w-5 h-5 text-vouchy-yellow-200 animate-spin" />
          <span>✨ Leave a Vouch</span>
        </motion.button>
      </div>

      {/* Leave Vouch Modal */}
      <LeaveVouchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profileId={profileId}
        profileName={profileName}
        onVouchSubmitted={handleVouchSubmitted}
      />
    </div>
  );
};
