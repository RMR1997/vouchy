'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Sparkles, Menu, X, Compass, LayoutDashboard, LogOut, User } from 'lucide-react';

interface AuthUser {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
}

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null))
      .finally(() => setLoadingUser(false));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: null }),
      });
      setCurrentUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF8F5]/80 border-b border-black/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-vouchy-purple-600 via-vouchy-purple-500 to-vouchy-pink-300 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-vouchy-purple-200 group-hover:rotate-6 transition-transform">
            ✨
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-gray-900 flex items-center gap-1">
              Vouchy
              <span className="w-2 h-2 rounded-full bg-vouchy-purple-500 inline-block"></span>
            </span>
            <span className="text-[10px] font-bold text-vouchy-purple-600 -mt-1 hidden sm:inline-block">
              Your people. Their words.
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-700">
          <Link href="/discover" className="flex items-center gap-1.5 hover:text-vouchy-purple-600 transition">
            <Compass className="w-4 h-4 text-vouchy-purple-500" />
            Explore Vouchies
          </Link>
          <Link href="/rajabi" className="flex items-center gap-1 hover:text-vouchy-purple-600 transition">
            <span>Demo Wall (@rajabi)</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-vouchy-purple-600 transition">
            <LayoutDashboard className="w-4 h-4 text-vouchy-purple-500" />
            Dashboard
          </Link>
        </div>

        {/* Right Action buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loadingUser ? (
            /* Subtle Loading Skeleton Placeholder to prevent button flicker */
            <div className="w-20 h-8 rounded-xl bg-vouchy-purple-100/60 animate-pulse" />
          ) : currentUser ? (
            /* Logged In State */
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-vouchy-purple-50 hover:bg-vouchy-purple-100 border border-vouchy-purple-200 transition"
              >
                <img
                  src={
                    currentUser.avatar ||
                    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${currentUser.username}`
                  }
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-vouchy-purple-300"
                />
                <span className="text-xs font-extrabold text-vouchy-purple-900">
                  @{currentUser.username}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs border border-rose-200 transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            /* Unauthenticated State */
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-vouchy-purple-600 text-white font-extrabold text-sm hover:bg-vouchy-purple-700 shadow-xs transition"
            >
              Log In
            </Link>
          )}

          {/* Create my Vouchy Disabled Button */}
          <button
            disabled
            className="px-5 py-2.5 rounded-2xl bg-vouchy-purple-300 text-white font-extrabold text-sm opacity-90 cursor-not-allowed flex items-center gap-2 shadow-xs"
            title="Public registration is coming soon!"
          >
            <span>Create my Vouchy</span>
            <span className="text-[10px] font-black uppercase bg-vouchy-purple-700 text-white px-2 py-0.5 rounded-full">
              Soon 🔒
            </span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-[#FAF8F5] border-b border-gray-200 space-y-3 animate-pop">
          <Link
            href="/discover"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-gray-800 hover:text-vouchy-purple-600"
          >
            Explore Vouchies ✨
          </Link>
          <Link
            href="/rajabi"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-gray-800 hover:text-vouchy-purple-600"
          >
            View Demo Profile (@rajabi)
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-gray-800 hover:text-vouchy-purple-600"
          >
            Owner Dashboard 🏠
          </Link>

          <div className="pt-2 border-t border-gray-200 space-y-2">
            {loadingUser ? (
              <div className="w-full h-9 rounded-2xl bg-vouchy-purple-100/60 animate-pulse" />
            ) : currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-2 rounded-2xl bg-vouchy-purple-50 flex items-center gap-2 border border-vouchy-purple-200">
                  <img
                    src={
                      currentUser.avatar ||
                      `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${currentUser.username}`
                    }
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-black text-gray-900">{currentUser.name}</p>
                    <p className="text-[10px] text-vouchy-purple-700 font-bold">@{currentUser.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 rounded-2xl bg-rose-600 text-white font-extrabold text-center block text-sm"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-vouchy-purple-600 text-white font-extrabold text-center block text-sm shadow-xs"
              >
                Log In
              </Link>
            )}

            <button
              disabled
              className="w-full py-3 rounded-2xl bg-vouchy-purple-300 text-white font-extrabold text-center block cursor-not-allowed opacity-90 text-sm"
            >
              Create my Vouchy <span className="text-[10px] bg-vouchy-purple-700 px-2 py-0.5 rounded-full ml-1 font-black">SOON 🔒</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
