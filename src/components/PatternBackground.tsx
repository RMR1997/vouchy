'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PatternBackgroundProps {
  theme?: string; // lavender, sunshine, mint, sky, bubblegum, cream
  background?: string; // solid, gradient, pattern
  pattern?: string; // dots, stars, hearts, squiggles, clouds
  children: React.ReactNode;
  className?: string;
}

const THEME_CLASSES: Record<string, string> = {
  lavender: 'bg-[#FAF5FF]',
  sunshine: 'bg-[#FEFCE8]',
  mint: 'bg-[#F0FDF4]',
  sky: 'bg-[#F0F9FF]',
  bubblegum: 'bg-[#FDF2F8]',
  cream: 'bg-[#FAF8F5]',
};

const GRADIENT_CLASSES: Record<string, string> = {
  lavender: 'bg-gradient-to-br from-[#F3E8FF] via-[#FAF5FF] to-[#E9D5FF]',
  sunshine: 'bg-gradient-to-br from-[#FEF08A] via-[#FEFCE8] to-[#FDE047]',
  mint: 'bg-gradient-to-br from-[#DCFCE7] via-[#F0FDF4] to-[#A7F3D0]',
  sky: 'bg-gradient-to-br from-[#E0F2FE] via-[#F0F9FF] to-[#BAE6FD]',
  bubblegum: 'bg-gradient-to-br from-[#FCE7F3] via-[#FDF2F8] to-[#FBCFE8]',
  cream: 'bg-gradient-to-br from-[#FAF8F5] via-[#FFFDF9] to-[#F5EFE6]',
};

export const PatternBackground: React.FC<PatternBackgroundProps> = ({
  theme = 'lavender',
  background = 'pattern',
  pattern = 'dots',
  children,
  className,
}) => {
  const bgBase =
    background === 'gradient'
      ? GRADIENT_CLASSES[theme] || GRADIENT_CLASSES.lavender
      : THEME_CLASSES[theme] || THEME_CLASSES.lavender;

  const patternClass =
    background === 'pattern'
      ? `bg-pattern-${pattern}`
      : '';

  return (
    <div className={cn('min-h-screen w-full transition-colors duration-300', bgBase, patternClass, className)}>
      {children}
    </div>
  );
};
