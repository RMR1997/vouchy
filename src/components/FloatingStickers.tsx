'use client';

import React from 'react';
import { motion } from 'framer-motion';

const STICKERS = [
  { emoji: '⭐', className: 'top-10 left-[5%]', delay: 0 },
  { emoji: '❤️', className: 'top-28 right-[8%]', delay: 0.5 },
  { emoji: '✨', className: 'top-[40%] left-[3%]', delay: 1 },
  { emoji: '👋', className: 'bottom-20 left-[8%]', delay: 1.5 },
  { emoji: '💜', className: 'top-16 left-[20%]', delay: 0.2 },
  { emoji: '🎉', className: 'bottom-32 right-[5%]', delay: 0.8 },
  { emoji: '🚀', className: 'top-[35%] right-[4%]', delay: 1.2 },
  { emoji: '☁️', className: 'top-8 right-[25%]', delay: 1.8 },
];

export const FloatingStickers: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {STICKERS.map((sticker, idx) => (
        <motion.div
          key={idx}
          className={`absolute text-2xl md:text-3xl filter drop-shadow-sm ${sticker.className}`}
          initial={{ y: 0, rotate: 0 }}
          animate={{
            y: [-8, 8, -8],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 4 + (idx % 3),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: sticker.delay,
          }}
        >
          {sticker.emoji}
        </motion.div>
      ))}
    </div>
  );
};
