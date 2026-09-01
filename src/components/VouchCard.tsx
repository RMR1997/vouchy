'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, User, Heart, Sparkles, Flame } from 'lucide-react';
import { getRandomPastel, getRandomRotation, formatDate, cn } from '@/lib/utils';

interface Reaction {
  id: string;
  type: string;
}

interface VouchCardProps {
  id: string;
  authorName: string;
  authorAvatar?: string | null;
  message: string;
  rating: number;
  relationship?: string;
  isAnonymous: boolean;
  createdAt: Date | string;
  reactions?: Reaction[];
  proofImage?: string | null;
  index?: number;
  rotationStyle?: string;
  colorStyle?: string;
  className?: string;
}

const EMOJI_MAP: Record<string, string> = {
  HEART: '❤️',
  FLOWER: '🌸',
  RABBIT: '🐰',
  STRAWBERRY: '🍓',
  BLUEBERRY: '🫐',
};

const LEGACY_TYPE_MAP: Record<string, string> = {
  PURPLE_HEART: 'HEART',
  LAUGH: 'FLOWER',
  ROCKET: 'BLUEBERRY',
  CLAP: 'STRAWBERRY',
};

export const VouchCard: React.FC<VouchCardProps> = ({
  id,
  authorName,
  authorAvatar,
  message,
  rating,
  relationship,
  isAnonymous,
  createdAt,
  reactions = [],
  proofImage,
  index = 0,
  rotationStyle,
  colorStyle,
  className,
}) => {
  const pastelClass = colorStyle || getRandomPastel(index);
  const tiltClass = rotationStyle || getRandomRotation(index);

  // Group reaction counts
  const initialCounts = reactions.reduce((acc, r) => {
    const key = EMOJI_MAP[r.type] ? r.type : (LEGACY_TYPE_MAP[r.type] || 'HEART');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; type: string }[]>([]);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    setFormattedDate(formatDate(createdAt));
  }, [createdAt]);

  const handleAddReaction = async (type: string) => {
    // Instant optimistic update
    setCounts((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));

    // Trigger floating animation particle
    const animId = Date.now() + Math.random();
    setFloatingEmojis((prev) => [...prev, { id: animId, type }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== animId));
    }, 1000);

    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vouchId: id, type }),
      });
    } catch (err) {
      console.error('Failed to post reaction:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, rotate: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'relative rounded-3xl p-5 md:p-6 border-2 shadow-sm transition-all duration-300 flex flex-col justify-between overflow-hidden group',
        pastelClass,
        tiltClass,
        className
      )}
    >
      {/* Floating particles animation container */}
      <AnimatePresence>
        {floatingEmojis.map((anim) => (
          <motion.span
            key={anim.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute bottom-10 right-8 text-2xl pointer-events-none z-20"
          >
            {EMOJI_MAP[anim.type]}
          </motion.span>
        ))}
      </AnimatePresence>

      <div>
        {/* Top Header: Rating */}
        <div className="flex items-center justify-between mb-3 gap-2">
          {/* Star rating */}
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-black/5 text-sm font-semibold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-3.5 h-3.5',
                  i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                )}
              />
            ))}
            <span className="ml-1 text-xs text-gray-700 font-bold">{rating}.0</span>
          </div>
        </div>

        {/* Message body */}
        <p className="text-sm md:text-base font-medium leading-relaxed my-3 break-words whitespace-pre-line overflow-hidden max-w-full text-gray-900">
          "{message}"
        </p>

        {/* Screenshot Proof Attachment */}
        {proofImage && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-black/10 shadow-xs bg-black/5 relative group/proof">
            <img
              src={proofImage}
              alt="Vouch screenshot proof"
              className="w-full max-h-52 object-cover rounded-2xl cursor-pointer hover:scale-[1.01] transition-transform duration-200"
              onClick={() => setIsImageModalOpen(true)}
            />
            <div
              onClick={() => setIsImageModalOpen(true)}
              className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/80 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full cursor-pointer flex items-center gap-1 shadow-sm transition active:scale-95"
            >
              <span>🔍 Klik untuk perbesar</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Author details & Reaction bar */}
      <div className="mt-4 pt-3 border-t border-black/5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isAnonymous || !authorAvatar ? (
              <div className="w-8 h-8 rounded-full bg-vouchy-purple-200 text-vouchy-purple-700 flex items-center justify-center font-bold text-xs">
                🎭
              </div>
            ) : (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover border border-black/10 shadow-xs"
              />
            )}
            <div>
              <p className="text-xs font-bold text-gray-900">
                {isAnonymous ? 'Anonymous' : authorName}
              </p>
              <p suppressHydrationWarning className="text-[10px] text-gray-500">
                {formattedDate || formatDate(createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Reaction Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(EMOJI_MAP).map(([type, emoji]) => {
            const count = counts[type] || 0;
            return (
              <button
                key={type}
                onClick={() => handleAddReaction(type)}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all active:scale-95 hover:bg-white/90',
                  count > 0
                    ? 'bg-[#FFFFFF] shadow-xs text-gray-900 border border-black/10'
                    : 'bg-white/40 text-gray-600 border border-black/5 hover:bg-white/60'
                )}
                title={`React with ${emoji}`}
              >
                <span>{emoji}</span>
                {count > 0 && <span className="text-[11px] font-extrabold">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Image Preview Modal Popup */}
      <AnimatePresence>
        {isImageModalOpen && proofImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl bg-black/40 border border-white/20 flex flex-col items-center justify-center cursor-default"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white font-extrabold text-lg flex items-center justify-center transition backdrop-blur-xs border border-white/20 shadow-md active:scale-95"
              >
                ✕
              </button>

              {/* Full Image */}
              <img
                src={proofImage}
                alt="Screenshot proof full preview"
                className="w-full h-full max-h-[85vh] object-contain rounded-2xl"
              />

              {/* Footer info badge */}
              <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
                <span className="inline-block bg-black/60 backdrop-blur-md text-white/90 text-xs font-bold px-4 py-1.5 rounded-full border border-white/10 shadow-sm">
                  Media Bukti dari {isAnonymous ? 'Anonymous' : authorName} 📸
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
