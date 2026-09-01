'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-4xl p-8 border-4 border-vouchy-purple-200 shadow-playful-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-vouchy-purple-600 text-white flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-md shadow-vouchy-purple-200">
            ✨
          </div>
          <h1 className="text-2xl font-black text-gray-900">Welcome back!</h1>
          <p className="text-xs text-gray-500 font-bold mt-1">
            Sign in to manage your Vouchy profile wall.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Username or Email
            </label>
            <input
              type="text"
              required
              placeholder="e.g. rajabi or rajabi@vouchy.app"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-vouchy-purple-500 focus:ring-2 focus:ring-vouchy-purple-200 outline-none transition font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-vouchy-purple-500 focus:ring-2 focus:ring-vouchy-purple-200 outline-none transition font-medium text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-vouchy-purple-600 hover:bg-vouchy-purple-700 text-white font-extrabold text-base shadow-md shadow-vouchy-purple-200 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In ✨'}
          </button>
        </form>



        <p className="text-center text-xs font-bold text-gray-500 mt-6">
          Don't have a Vouchy profile yet?{' '}
          <Link href="/signup" className="text-vouchy-purple-600 hover:underline">
            Sign up now →
          </Link>
        </p>
      </div>
    </div>
  );
}
