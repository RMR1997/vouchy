import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Preset pastel card colors for playful wall
export const PASTEL_CARD_COLORS = [
  'bg-[#FDF2F8] border-[#FBCFE8] text-[#831843]', // Pink pastel
  'bg-[#F0F9FF] border-[#BAE6FD] text-[#0C4A6E]', // Blue pastel
  'bg-[#F0FDF4] border-[#A7F3D0] text-[#064E3B]', // Mint pastel
  'bg-[#FEFCE8] border-[#FEF08A] text-[#713F12]', // Yellow pastel
  'bg-[#FAF5FF] border-[#E9D5FF] text-[#581C87]', // Lavender pastel
  'bg-[#FFF1F2] border-[#FECDD3] text-[#881337]', // Coral pastel
];

// Preset subtle rotations
export const ROTATIONS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-0'];

export function getRandomPastel(index: number) {
  return PASTEL_CARD_COLORS[index % PASTEL_CARD_COLORS.length];
}

export function getRandomRotation(index: number) {
  return ROTATIONS[index % ROTATIONS.length];
}

export function formatDate(dateInput: Date | string) {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function getCardColorStyles(cardColor?: string) {
  switch (cardColor) {
    case 'pink':
      return 'bg-pink-100/95 border-pink-300 text-pink-950';
    case 'rose':
      return 'bg-rose-100/95 border-rose-300 text-rose-950';
    case 'purple':
      return 'bg-purple-100/95 border-purple-300 text-purple-950';
    case 'sky':
      return 'bg-sky-100/95 border-sky-300 text-sky-950';
    case 'mint':
      return 'bg-emerald-100/95 border-emerald-300 text-emerald-950';
    case 'amber':
      return 'bg-amber-100/95 border-amber-300 text-amber-950';
    case 'dark':
      return 'bg-gray-900/95 border-gray-800 text-white';
    case 'white':
    default:
      return 'bg-white/90 border-black/5 text-gray-900';
  }
}
