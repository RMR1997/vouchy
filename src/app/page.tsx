'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Star, Heart, ArrowRight, Share2, MessageCircle, ShieldCheck, Zap, Smile } from 'lucide-react';
import { FloatingStickers } from '@/components/FloatingStickers';

const HERO_TESTIMONIALS = [
  {
    stars: 5,
    text: "Honestly one of the nicest people I've worked with.",
    author: "Andi Pratama",
    rotation: "-rotate-3",
    bgColor: "bg-[#FDF2F8] border-[#FBCFE8]",
    textColor: "text-[#831843]",
    position: "top-4 -left-6 sm:-left-12",
  },
  {
    stars: 5,
    text: "Bro always comes through when you need help 😂",
    author: "Sarah Chen",
    rotation: "rotate-3",
    bgColor: "bg-[#FEFCE8] border-[#FEF08A]",
    textColor: "text-[#713F12]",
    position: "top-28 -right-6 sm:-right-12",
  },
  {
    stars: 5,
    text: "10/10 would work with again.",
    author: "Maya Lin",
    rotation: "-rotate-2",
    bgColor: "bg-[#F0FDF4] border-[#A7F3D0]",
    textColor: "text-[#064E3B]",
    position: "bottom-6 -left-4 sm:-left-8",
  },
];

interface FeaturedProfile {
  name: string;
  username: string;
  title: string;
  rating: string;
  vouchCount: number;
  avatar: string;
  color: string;
}

export default function HomePage() {
  const [featuredProfiles, setFeaturedProfiles] = React.useState<FeaturedProfile[]>([]);

  React.useEffect(() => {
    fetch('/api/featured')
      .then((res) => res.json())
      .then((data) => {
        if (data.profiles && data.profiles.length > 0) {
          setFeaturedProfiles(data.profiles);
        }
      })
      .catch((err) => console.error('Failed to load featured profiles:', err));
  }, []);
  return (
    <div className="relative overflow-hidden">
      {/* Animated background stickers */}
      <FloatingStickers />

      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vouchy-purple-100 border border-vouchy-purple-200 text-vouchy-purple-800 text-xs sm:text-sm font-extrabold mb-6 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-vouchy-purple-600 animate-spin" />
          <span>Your profile. Your people. Their words.</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] max-w-4xl mx-auto"
        >
          Let people vouch for you.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-vouchy-purple-600 via-vouchy-pink-500 to-amber-500 inline-block animate-pulse">
            ✨
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Create your own little corner on the internet and collect messages, memories, compliments, and testimonials from the people who know you.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            disabled
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-vouchy-purple-300 text-white font-extrabold text-lg cursor-not-allowed opacity-90 flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Create my Vouchy</span>
            <span className="text-xs font-black uppercase bg-vouchy-purple-700 text-white px-2.5 py-1 rounded-full">
              Soon 🔒
            </span>
          </button>

          <Link
            href="/discover"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-extrabold text-lg border-2 border-gray-200 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            Explore Vouchies
          </Link>
        </motion.div>

        {/* Hero Visual Card Stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 relative max-w-2xl mx-auto"
        >
          {/* Main Central Profile Card Mockup */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-vouchy-purple-200 shadow-playful-lg text-left relative z-20">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Rajabi Profile Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-vouchy-purple-400"
              />
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  Rajabi <span className="text-sm">🚀</span>
                </h3>
                <p className="text-xs font-bold text-gray-500">@rajabi</p>
                <div className="flex items-center gap-1 mt-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-flex border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 from 24 Vouches</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-700 font-medium">
              Technical Consultant • Tech Enthusiast • Always building something 🚀
            </p>
          </div>

          {/* Floating Testimonial Cards around Main Card */}
          {HERO_TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className={`absolute z-30 hidden sm:block p-4 rounded-2xl border-2 shadow-md max-w-xs ${item.position} ${item.rotation} ${item.bgColor} ${item.textColor}`}
            >
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: item.stars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs font-bold leading-snug">{item.text}</p>
              <p className="text-[10px] font-extrabold opacity-75 mt-2">— {item.author}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ---------------- 2. HOW IT WORKS SECTION ---------------- */}
      <section className="py-20 bg-white/70 border-y border-black/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-extrabold text-vouchy-purple-600 uppercase tracking-widest bg-vouchy-purple-100 px-3 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
            How Vouchy Works 🎨
          </h2>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#FAF8F5] p-8 rounded-3xl border-2 border-vouchy-purple-100 shadow-sm text-left hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-vouchy-purple-200 text-vouchy-purple-800 flex items-center justify-center font-black text-lg mb-6">
                01
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Create your Vouchy</h3>
              <p className="text-sm text-gray-600 mt-2 font-medium leading-relaxed">
                Make your own cute profile page in seconds. Customize your layout, colors, and background patterns.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF8F5] p-8 rounded-3xl border-2 border-vouchy-mint-200 shadow-sm text-left hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-vouchy-mint-200 text-vouchy-mint-800 flex items-center justify-center font-black text-lg mb-6">
                02
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Share your link</h3>
              <p className="text-sm text-gray-600 mt-2 font-medium leading-relaxed">
                Send your Vouchy URL or QR code to friends, coworkers, clients, or your community.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF8F5] p-8 rounded-3xl border-2 border-vouchy-pink-200 shadow-sm text-left hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-vouchy-pink-200 text-vouchy-pink-800 flex items-center justify-center font-black text-lg mb-6">
                03
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Collect Vouches</h3>
              <p className="text-sm text-gray-600 mt-2 font-medium leading-relaxed">
                Let people leave something nice for you with ratings, memories, and interactive emoji reactions!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. FEATURED VOUCHIES SECTION ---------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        <span className="text-xs font-extrabold text-vouchy-purple-600 uppercase tracking-widest bg-vouchy-purple-100 px-3 py-1 rounded-full">
          Featured Profiles
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
          Explore Vouchies ✨
        </h2>
        <p className="text-gray-600 font-medium mt-2 max-w-md mx-auto">
          See how people present themselves through what others say about them.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProfiles.map((profile) => (
            <Link
              key={profile.username}
              href={`/${profile.username}`}
              className={`p-6 rounded-3xl border-2 shadow-sm transition-all hover:scale-105 hover:-rotate-1 text-left flex flex-col justify-between ${profile.color}`}
            >
              <div>
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-black/10 shadow-xs mb-4"
                />
                <h3 className="text-lg font-extrabold text-gray-900">{profile.name}</h3>
                <p className="text-xs font-bold text-gray-500">@{profile.username}</p>
                <p className="text-xs font-semibold text-gray-700 mt-2">{profile.title}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-700 bg-white/80 px-2.5 py-1 rounded-full border border-black/5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {profile.rating}
                </span>
                <span className="text-xs font-extrabold text-gray-700">
                  {profile.vouchCount} Vouches
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- 4. WHY VOUCHY? SECTION ---------------- */}
      <section className="py-20 bg-[#3B0764] text-white relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-black text-amber-900 uppercase tracking-widest bg-vouchy-yellow-100 px-4 py-1.5 rounded-full shadow-xs">
            Why Vouchy?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight text-white">
            Not another boring profile page. <span className="text-vouchy-pink-200">💜</span>
          </h2>
          <p className="text-vouchy-purple-100 font-semibold text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Vouchy is a playful place where people showcase who they are through the authentic words of friends, colleagues, and customers.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-vouchy-purple-200 shadow-md text-gray-900 hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Smile className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Always Positive</h3>
              <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">
                Built for compliments, gratitude, and genuine memories that make someone’s day brighter.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-vouchy-purple-200 shadow-md text-gray-900 hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Full Moderation</h3>
              <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">
                You stay in control. Approve, hide, or manage every vouch before it appears publicly on your wall.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-vouchy-purple-200 shadow-md text-gray-900 hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-800 flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Playful & Cute</h3>
              <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">
                Pastel cards, floating stickers, tilt animations, and emoji reactions make exploring fun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. FINAL CTA SECTION ---------------- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center z-10">
        <div className="bg-gradient-to-br from-vouchy-purple-100 via-vouchy-pink-50 to-vouchy-yellow-50 p-10 sm:p-16 rounded-5xl border-4 border-vouchy-purple-200 shadow-playful-lg">
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Ready to get vouched? 💜
          </h2>
          <p className="text-gray-600 font-semibold mt-3 text-lg">
            Create your profile in 30 seconds and let people vouch for you.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              disabled
              className="px-10 py-5 rounded-2xl bg-vouchy-purple-300 text-white font-extrabold text-xl cursor-not-allowed opacity-90 flex items-center gap-3 shadow-xs"
            >
              <span>Create your Vouchy</span>
              <span className="text-xs font-black uppercase bg-vouchy-purple-700 text-white px-3 py-1 rounded-full">
                Coming Soon 🔒
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
