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

export interface CardColorStyle {
  className: string;
  style: React.CSSProperties;
  headingClass: string;
  subtextClass: string;
}

export function getCardColorDetails(cardColor?: string): CardColorStyle {
  switch (cardColor) {
    case 'pink':
      return {
        className: 'bg-pink-100 border-pink-300 text-pink-950',
        style: { backgroundColor: '#FCE7F3', borderColor: '#F472B6', color: '#500724' },
        headingClass: 'text-pink-950',
        subtextClass: 'text-pink-900',
      };
    case 'rose':
      return {
        className: 'bg-rose-100 border-rose-300 text-rose-950',
        style: { backgroundColor: '#FFE4E6', borderColor: '#FB7185', color: '#4C0519' },
        headingClass: 'text-rose-950',
        subtextClass: 'text-rose-900',
      };
    case 'purple':
      return {
        className: 'bg-purple-100 border-purple-300 text-purple-950',
        style: { backgroundColor: '#F3E8FF', borderColor: '#C084FC', color: '#3B0764' },
        headingClass: 'text-purple-950',
        subtextClass: 'text-purple-900',
      };
    case 'sky':
      return {
        className: 'bg-sky-100 border-sky-300 text-sky-950',
        style: { backgroundColor: '#E0F2FE', borderColor: '#38BDF8', color: '#082F49' },
        headingClass: 'text-sky-950',
        subtextClass: 'text-sky-900',
      };
    case 'mint':
      return {
        className: 'bg-emerald-100 border-emerald-300 text-emerald-950',
        style: { backgroundColor: '#D1FAE5', borderColor: '#34D399', color: '#022C22' },
        headingClass: 'text-emerald-950',
        subtextClass: 'text-emerald-900',
      };
    case 'amber':
      return {
        className: 'bg-amber-100 border-amber-300 text-amber-950',
        style: { backgroundColor: '#FEF3C7', borderColor: '#FBBF24', color: '#451A03' },
        headingClass: 'text-amber-950',
        subtextClass: 'text-amber-900',
      };
    case 'dark':
      return {
        className: 'bg-gray-900 border-gray-700 text-white',
        style: { backgroundColor: '#111827', borderColor: '#374151', color: '#FFFFFF' },
        headingClass: 'text-white',
        subtextClass: 'text-gray-200',
      };
    case 'white':
    default:
      return {
        className: 'bg-white border-black/10 text-gray-900',
        style: { backgroundColor: '#FFFFFF', borderColor: 'rgba(0, 0, 0, 0.1)', color: '#111827' },
        headingClass: 'text-gray-900',
        subtextClass: 'text-gray-800',
      };
  }
}

export function getCardColorStyles(cardColor?: string) {
  return getCardColorDetails(cardColor).className;
}
