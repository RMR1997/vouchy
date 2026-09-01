import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FAF8F5] border-t border-black/5 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-vouchy-purple-600 text-white flex items-center justify-center font-bold text-sm">
              ✨
            </div>
            <span className="text-xl font-extrabold text-gray-900">Vouchy</span>
          </Link>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            Your profile. Your people. Their words. 💜
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-bold text-gray-600">
          <Link href="/discover" className="hover:text-vouchy-purple-600 transition">
            Explore
          </Link>
          <Link href="/dashboard" className="hover:text-vouchy-purple-600 transition">
            Dashboard
          </Link>
        </div>

        <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>for friendly humans everywhere</span>
        </div>
      </div>
    </footer>
  );
};
