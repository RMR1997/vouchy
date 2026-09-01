'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Sparkles, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-4xl p-8 sm:p-10 border-4 border-vouchy-purple-200 shadow-playful-lg text-center">
        {/* Playful Icon */}
        <div className="w-16 h-16 rounded-3xl bg-vouchy-purple-100 text-vouchy-purple-600 flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-vouchy-purple-200 animate-bounce">
          🚀
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vouchy-purple-100 border border-vouchy-purple-200 text-vouchy-purple-800 text-xs font-black mb-3">
          <Lock className="w-3.5 h-3.5 text-vouchy-purple-600" />
          <span>Private Beta Mode</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Registration Coming Soon! ✨
        </h1>

        <p className="text-sm font-semibold text-gray-600 mt-3 leading-relaxed">
          Public registration for Vouchy is currently paused while we prepare for launch. Stay tuned for our public release!
        </p>

        {/* Disabled Form Preview */}
        <div className="mt-6 p-4 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 text-left opacity-60 space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Full Name
            </label>
            <div className="h-9 bg-gray-200 rounded-xl mt-1 w-full"></div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Username
            </label>
            <div className="h-9 bg-gray-200 rounded-xl mt-1 w-full"></div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            disabled
            className="w-full py-4 rounded-2xl bg-vouchy-purple-300 text-white font-extrabold text-sm cursor-not-allowed opacity-90 shadow-xs flex items-center justify-center gap-2"
          >
            <span>Public Sign Up Closed</span>
            <span className="text-[10px] bg-vouchy-purple-700 px-2 py-0.5 rounded-full font-black">
              SOON 🔒
            </span>
          </button>

          <Link
            href="/login"
            className="w-full py-3.5 rounded-2xl bg-white border-2 border-vouchy-purple-200 text-vouchy-purple-700 font-extrabold text-sm hover:bg-vouchy-purple-50 transition block text-center"
          >
            Already have an account? Sign In →
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600 mt-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
