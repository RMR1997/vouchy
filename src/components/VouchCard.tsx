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
    </motion.div>
  );
};
