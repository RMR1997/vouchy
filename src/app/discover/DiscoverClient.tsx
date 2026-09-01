'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Star } from 'lucide-react';
import { getRandomPastel, getRandomRotation } from '@/lib/utils';

interface DiscoverUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  jobTitle: string;
  bio: string;
  rating: string;
  vouchCount: number;
}

interface DiscoverClientProps {
  users: DiscoverUser[];
}

export const DiscoverClient: React.FC<DiscoverClientProps> = ({ users }) => {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search Input */}
      <div className="max-w-md mx-auto mb-10 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, username, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-vouchy-purple-100 shadow-sm focus:border-vouchy-purple-500 focus:ring-2 focus:ring-vouchy-purple-200 outline-none transition font-medium text-sm"
        />
      </div>

      {/* Profile Cards Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredUsers.map((user, idx) => {
            const cardPastel = getRandomPastel(idx);
            const cardRotation = getRandomRotation(idx);
            return (
              <Link
                key={user.id}
                href={`/${user.username}`}
                className={`p-6 rounded-3xl border-2 shadow-sm transition-all duration-300 hover:scale-105 flex flex-col justify-between ${cardPastel} ${cardRotation}`}
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-black/10 shadow-xs"
                    />
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900">{user.name}</h3>
                      <p className="text-xs font-bold text-gray-500">@{user.username}</p>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-gray-700 bg-white/60 px-3 py-1 rounded-full inline-block border border-black/5">
                    {user.jobTitle}
                  </p>

                  {user.bio && (
                    <p className="text-xs text-gray-600 font-medium mt-3 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-black/5 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-800 bg-white/80 px-2.5 py-1 rounded-full border border-black/5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {user.rating}
                  </span>
                  <span className="text-xs font-extrabold text-gray-700">
                    {user.vouchCount} Vouches
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-2">🔍</p>
          <p className="text-lg font-bold text-gray-800">No Vouchies match "{search}"</p>
          <p className="text-xs text-gray-500 mt-1">Try searching for something else!</p>
        </div>
      )}
    </div>
  );
};
