import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { PatternBackground } from '@/components/PatternBackground';
import { ProfileWallClient } from './ProfileWallClient';
import { Globe, Linkedin, Github, Instagram, Twitter, MessageCircle, Star, Sparkles, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;

  // Fetch profile user and approved vouches
  const user = await db.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      socialLinks: true,
      settings: true,
      vouches: {
        where: { status: 'APPROVED' },
        include: { reactions: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    return (
      <PatternBackground theme="lavender" background="pattern" pattern="dots">
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-4">😵‍💫</div>
          <h1 className="text-3xl font-black text-gray-900">Oops! Profile not found</h1>
          <p className="text-gray-600 mt-2 font-medium max-w-sm">
            We couldn't find a Vouchy profile for @{username}. Maybe they haven't created one yet!
          </p>
          <Link
            href="/discover"
            className="mt-6 px-6 py-3 rounded-2xl bg-vouchy-purple-600 text-white font-extrabold text-sm shadow-md hover:bg-vouchy-purple-700 transition"
          >
            Explore Vouchies ✨
          </Link>
        </div>
      </PatternBackground>
    );
  }

  // Calculate statistics
  const totalVouches = user.vouches.length;
  const averageRating =
    totalVouches > 0
      ? (
          user.vouches.reduce((acc, v) => acc + v.rating, 0) / totalVouches
        ).toFixed(1)
      : '5.0';

  const theme = user.settings?.theme || 'lavender';
  const background = user.settings?.background || 'pattern';
  const pattern = user.settings?.pattern || 'dots';
  const layout = user.settings?.layout || 'masonry';

  return (
    <PatternBackground theme={theme} background={background} pattern={pattern}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Profile Header Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-4xl p-6 sm:p-10 border-4 border-black/5 shadow-playful-lg text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative overflow-hidden mb-12">
          {/* Avatar */}
          <div className="relative">
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.username}`
              }
              alt={user.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-vouchy-purple-200 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-vouchy-purple-600 text-white flex items-center justify-center text-sm font-extrabold shadow-sm border-2 border-white">
              ✨
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  {user.name}
                </h1>
                <p className="text-sm font-bold text-vouchy-purple-600 mt-0.5">
                  @{user.username}
                </p>
              </div>

              {/* Rating Badge */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl shadow-xs self-center sm:self-auto">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <div>
                  <p className="text-sm font-black text-amber-900 leading-none">
                    {averageRating} rating
                  </p>
                  <p className="text-[11px] font-bold text-amber-700 mt-0.5">
                    from {totalVouches} {totalVouches === 1 ? 'Vouch' : 'Vouches'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bio & Job Title */}
            <p className="text-base text-gray-800 font-semibold mt-3 max-w-2xl leading-relaxed">
              {user.bio || 'Welcome to my Vouchy wall! Leave me a vouch below ✨'}
            </p>

            {/* Location & Job Badge */}
            <div className="flex items-center gap-4 flex-wrap mt-3 text-xs font-bold text-gray-600">
              {user.jobTitle && (
                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border border-black/5">
                  <Briefcase className="w-3.5 h-3.5 text-vouchy-purple-500" />
                  {user.jobTitle}
                </span>
              )}
              {user.location && (
                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border border-black/5">
                  <MapPin className="w-3.5 h-3.5 text-vouchy-coral-400" />
                  {user.location}
                </span>
              )}
            </div>

            {/* Social Links */}
            {user.socialLinks.length > 0 && (
              <div className="flex items-center gap-2 mt-4 flex-wrap justify-center sm:justify-start">
                {user.socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vouchy-purple-50 text-vouchy-purple-700 text-xs font-bold hover:bg-vouchy-purple-100 border border-vouchy-purple-200 transition"
                  >
                    {link.platform === 'linkedin' && <Linkedin className="w-3.5 h-3.5 text-blue-600" />}
                    {link.platform === 'github' && <Github className="w-3.5 h-3.5 text-gray-800" />}
                    {link.platform === 'instagram' && <Instagram className="w-3.5 h-3.5 text-pink-600" />}
                    {link.platform === 'twitter' && <Twitter className="w-3.5 h-3.5 text-sky-500" />}
                    {link.platform === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    {link.platform === 'website' && <Globe className="w-3.5 h-3.5 text-indigo-600" />}
                    <span className="capitalize">{link.platform}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Client Interactive Vouch Wall */}
        <ProfileWallClient
          profileId={user.id}
          profileName={user.name}
          initialVouches={JSON.parse(JSON.stringify(user.vouches))}
          layout={layout}
        />
      </div>
    </PatternBackground>
  );
}
