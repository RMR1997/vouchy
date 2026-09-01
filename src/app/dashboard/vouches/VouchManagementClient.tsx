'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, EyeOff, Trash2, Clock, Check, ShieldAlert } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Reaction {
  id: string;
  type: string;
}

interface Vouch {
  id: string;
  authorName: string;
  authorAvatar?: string | null;
  message: string;
  rating: number;
  relationship?: string;
  isAnonymous: boolean;
  cardColor?: string | null;
  proofImage?: string | null;
  status: string; // PENDING, APPROVED, HIDDEN
  createdAt: Date | string;
  reactions?: Reaction[];
}

interface VouchManagementClientProps {
  initialVouches: Vouch[];
}

export const VouchManagementClient: React.FC<VouchManagementClientProps> = ({
  initialVouches,
}) => {
  const [vouches, setVouches] = useState<Vouch[]>(initialVouches);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'HIDDEN'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');
  const [vouchToDelete, setVouchToDelete] = useState<Vouch | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleUpdateStatus = async (vouchId: string, newStatus: string) => {
    // Optimistic UI update
    if (newStatus === 'DELETED') {
      setVouches((prev) => prev.filter((v) => v.id !== vouchId));
    } else {
      setVouches((prev) =>
        prev.map((v) => (v.id === vouchId ? { ...v, status: newStatus } : v))
      );
    }

    try {
      await fetch('/api/vouches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vouchId, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update vouch status:', err);
    }
  };

  const filteredVouches = vouches.filter((v) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return v.status === 'PENDING';
    if (activeTab === 'APPROVED') return v.status === 'APPROVED';
    if (activeTab === 'HIDDEN') return v.status === 'HIDDEN';
    return true;
  });

  const sortedFilteredVouches = [...filteredVouches].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();

    if (sortBy === 'oldest') {
      return timeA - timeB;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    // Default newest
    return timeB - timeA;
  });

  const counts = {
    ALL: vouches.length,
    PENDING: vouches.filter((v) => v.status === 'PENDING').length,
    APPROVED: vouches.filter((v) => v.status === 'APPROVED').length,
    HIDDEN: vouches.filter((v) => v.status === 'HIDDEN').length,
  };

  return (
    <div className="space-y-6">
      {/* Moderation Filter Tabs & Sort Control */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'HIDDEN'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const labelMap = {
              ALL: 'All',
              PENDING: 'Pending Review',
              APPROVED: 'Published',
              HIDDEN: 'Hidden',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-vouchy-purple-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{labelMap[tab]}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {counts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort Filter Selector */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs ml-auto">
          <span className="text-xs font-bold text-gray-500">Urutan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-xs font-extrabold text-gray-800 outline-none cursor-pointer"
          >
            <option value="newest">🕒 Terbaru (Newest First)</option>
            <option value="oldest">⏳ Terlama (Oldest First)</option>
            <option value="rating">⭐ Rating Tertinggi (Highest Rated)</option>
          </select>
        </div>
      </div>

      {/* Vouches Moderation List */}
      {sortedFilteredVouches.length > 0 ? (
        <div className="space-y-4">
          {sortedFilteredVouches.map((vouch) => (
            <div
              key={vouch.id}
              className="bg-white rounded-3xl p-5 border-2 border-vouchy-purple-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-vouchy-purple-300"
            >
              <div className="space-y-2 max-w-2xl">
                {/* Status Badge & Rating */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      vouch.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : vouch.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {vouch.status === 'APPROVED' && 'Published'}
                    {vouch.status === 'PENDING' && 'Pending Review'}
                    {vouch.status === 'HIDDEN' && 'Hidden'}
                  </span>

                  <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-xs font-bold text-amber-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{vouch.rating}.0</span>
                  </div>
                </div>

                {/* Vouch Message */}
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                  "{vouch.message}"
                </p>

                {/* Screenshot Proof Thumbnail */}
                {vouch.proofImage && (
                  <div className="mt-2">
                    <span className="text-[10px] font-bold text-gray-400 block mb-1">Bukti Screenshot Chat 📸:</span>
                    <img
                      src={vouch.proofImage}
                      alt="Proof screenshot"
                      className="w-32 h-20 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition"
                      onClick={() => setPreviewImage(vouch.proofImage!)}
                    />
                  </div>
                )}

                {/* Author info */}
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium pt-1">
                  <span>From <strong className="text-gray-900">{vouch.isAnonymous ? 'Anonymous' : vouch.authorName}</strong></span>
                  <span>•</span>
                  <span suppressHydrationWarning>{formatDate(vouch.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {vouch.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleUpdateStatus(vouch.id, 'APPROVED')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {vouch.status !== 'HIDDEN' && (
                  <button
                    onClick={() => handleUpdateStatus(vouch.id, 'HIDDEN')}
                    className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition flex items-center gap-1"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </button>
                )}

                <button
                  onClick={() => setVouchToDelete(vouch)}
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs border border-rose-200 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
          <p className="text-4xl mb-2">💌</p>
          <p className="text-base font-bold text-gray-800">
            No vouches found in {activeTab.toLowerCase()} category.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {vouchToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-xl border border-gray-100 animate-pop">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              🗑️
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">
              Hapus Vouch Ini?
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Apakah Anda yakin ingin menghapus vouch ini secara permanen? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVouchToDelete(null)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  handleUpdateStatus(vouchToDelete.id, 'DELETED');
                  setVouchToDelete(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-200 transition"
              >
                Ya, Hapus 🗑️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Image Modal Popup */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl bg-black/40 border border-white/20 flex flex-col items-center justify-center cursor-default"
            >
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white font-extrabold text-lg flex items-center justify-center transition border border-white/20 shadow-md active:scale-95"
              >
                ✕
              </button>
              <img
                src={previewImage}
                alt="Media proof full preview"
                className="w-full h-full max-h-[85vh] object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
