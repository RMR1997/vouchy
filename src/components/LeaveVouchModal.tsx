'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, Sparkles, CheckCircle2, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LeaveVouchModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  profileName: string;
  onVouchSubmitted?: () => void;
}

const RELATIONSHIPS = ['Friend', 'Coworker', 'Client', 'Classmate', 'Family', 'Other'];

const PRESET_AVATARS = [
  '/Avatar%20Vouchy/BUBU%201.jpg',
  '/Avatar%20Vouchy/DUDU%201.jpg',
  '/Avatar%20Vouchy/bubu%202.jpg',
  '/Avatar%20Vouchy/bubu%203.jpg',
  '/Avatar%20Vouchy/bubu%204.jpg',
  '/Avatar%20Vouchy/bubu%205.jpg',
  '/Avatar%20Vouchy/bubu%206.jpg',
  '/Avatar%20Vouchy/dudu%202.jpg',
  '/Avatar%20Vouchy/dudu%203.jpg',
  '/Avatar%20Vouchy/dudu%204.jpg',
  '/Avatar%20Vouchy/dudu%205.jpg',
  '/Avatar%20Vouchy/dudu6.jpg',
  '/Avatar%20Vouchy/dudu%207.jpg',
];

const VOUCH_CARD_COLORS = [
  { id: 'bg-[#FDF2F8] border-[#FBCFE8] text-[#831843]', name: 'Pink', emoji: '🎀', previewBg: '#FDF2F8', previewBorder: '#FBCFE8' },
  { id: 'bg-[#FFF1F2] border-[#FECDD3] text-[#881337]', name: 'Rose', emoji: '🌸', previewBg: '#FFF1F2', previewBorder: '#FECDD3' },
  { id: 'bg-[#FAF5FF] border-[#E9D5FF] text-[#581C87]', name: 'Lavender', emoji: '💜', previewBg: '#FAF5FF', previewBorder: '#E9D5FF' },
  { id: 'bg-[#F0F9FF] border-[#BAE6FD] text-[#0C4A6E]', name: 'Sky', emoji: '☁️', previewBg: '#F0F9FF', previewBorder: '#BAE6FD' },
  { id: 'bg-[#F0FDF4] border-[#A7F3D0] text-[#064E3B]', name: 'Mint', emoji: '🌿', previewBg: '#F0FDF4', previewBorder: '#A7F3D0' },
  { id: 'bg-[#FEFCE8] border-[#FEF08A] text-[#713F12]', name: 'Sunshine', emoji: '☀️', previewBg: '#FEFCE8', previewBorder: '#FEF08A' },
  { id: 'bg-[#FFF7ED] border-[#FFEDD5] text-[#9A3412]', name: 'Peach', emoji: '🍑', previewBg: '#FFF7ED', previewBorder: '#FFEDD5' },
  { id: 'bg-[#ECFEFF] border-[#A5F3FC] text-[#155E75]', name: 'Ocean', emoji: '🌊', previewBg: '#ECFEFF', previewBorder: '#A5F3FC' },
  { id: 'bg-[#EEF2FF] border-[#C7D2FE] text-[#3730A3]', name: 'Indigo', emoji: '🫐', previewBg: '#EEF2FF', previewBorder: '#C7D2FE' },
  { id: 'bg-[#F7FEE7] border-[#D9F99D] text-[#3F6212]', name: 'Matcha', emoji: '🍵', previewBg: '#F7FEE7', previewBorder: '#D9F99D' },
  { id: 'bg-[#FDF4FF] border-[#F5D0FE] text-[#701A75]', name: 'Plum', emoji: '🍇', previewBg: '#FDF4FF', previewBorder: '#F5D0FE' },
  { id: 'bg-[#FAF8F5] border-[#E5E7EB] text-[#111827]', name: 'Cream', emoji: '🍦', previewBg: '#FAF8F5', previewBorder: '#E5E7EB' },
  { id: 'bg-[#FFFFFF] border-[#E5E7EB] text-[#111827]', name: 'White', emoji: '🤍', previewBg: '#FFFFFF', previewBorder: '#E5E7EB' },
];

export const LeaveVouchModal: React.FC<LeaveVouchModalProps> = ({
  isOpen,
  onClose,
  profileId,
  profileName,
  onVouchSubmitted,
}) => {
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [relationship, setRelationship] = useState('Friend');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [cardColor, setCardColor] = useState(VOUCH_CARD_COLORS[0].id);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProof(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setProofImage(data.url);
      }
    } catch (err) {
      console.error('Failed to upload proof image:', err);
    } finally {
      setUploadingProof(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName && !isAnonymous) return;
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/vouches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          authorName: isAnonymous ? 'Anonymous' : authorName,
          authorAvatar: selectedAvatar,
          message,
          rating,
          relationship,
          isAnonymous,
          cardColor,
          proofImage,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        // Trigger celebratory confetti burst!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#FBCFE8', '#FEF08A', '#A7F3D0', '#7DD3FC'],
        });

        if (onVouchSubmitted) onVouchSubmitted();
      }
    } catch (err) {
      console.error('Error submitting vouch:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setMessage('');
    setAuthorName('');
    setRating(5);
    setProofImage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
          {/* Overlay click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-playful-lg z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="mb-6">
                  <span className="text-2xl">💌</span>
                  <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                    Leave a little something
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Write something nice for <span className="font-bold text-vouchy-purple-600">{profileName}</span>.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Rating ⭐
                    </label>
                    <div className="flex items-center gap-2 bg-vouchy-purple-50 p-3 rounded-2xl border border-vouchy-purple-100">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-auto text-sm font-extrabold text-vouchy-purple-700">
                        {rating}.0 / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-200">
                    <span className="text-sm font-bold text-gray-800">
                      Post anonymously 🎭
                    </span>
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-5 h-5 accent-vouchy-purple-600 rounded cursor-pointer"
                    />
                  </div>

                  {/* Name field (if not anonymous) */}
                  {!isAnonymous && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required={!isAnonymous}
                          placeholder="e.g. Andi Pratama"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-vouchy-purple-500 focus:ring-2 focus:ring-vouchy-purple-200 outline-none transition font-medium"
                        />
                      </div>

                      {/* Avatar Selection (Bubu & Dudu Presets Only) */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-gray-700 mb-1.5">
                          Choose Bubu & Dudu Avatar 🐻🐰
                        </label>

                        <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 max-w-full">
                          {PRESET_AVATARS.map((avatar, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedAvatar(avatar)}
                              className={`relative rounded-full p-0.5 transition shrink-0 ${
                                selectedAvatar === avatar
                                  ? 'ring-3 ring-vouchy-purple-500 scale-110 shadow-md'
                                  : 'opacity-80 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={avatar}
                                alt="Bubu & Dudu avatar"
                                className="w-10 h-10 rounded-full object-cover border border-black/10"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}



                  {/* Message field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Vouch / Testimonial / Compliment 💌
                    </label>
                    <textarea
                      required
                      rows={4}
                      maxLength={500}
                      placeholder="Say something nice! How do you know them? What makes them special?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-vouchy-purple-500 focus:ring-2 focus:ring-vouchy-purple-200 outline-none transition font-medium text-sm resize-none"
                    />
                    <p className="text-right text-xs text-gray-400 mt-1">
                      {message.length}/500
                    </p>
                  </div>

                  {/* Vouch Card Box Color Selection (Compact & Below Message Field) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Pilih Warna Kotak Vouch 🎨
                      </label>
                      <span className="text-[11px] font-black text-vouchy-purple-700 bg-vouchy-purple-50 px-2.5 py-0.5 rounded-full border border-vouchy-purple-100 flex items-center gap-1">
                        <span>{VOUCH_CARD_COLORS.find((c) => c.id === cardColor)?.emoji}</span>
                        <span>{VOUCH_CARD_COLORS.find((c) => c.id === cardColor)?.name}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      {VOUCH_CARD_COLORS.map((c) => {
                        const isSelected = cardColor === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setCardColor(c.id)}
                            title={`${c.name} ${c.emoji}`}
                            style={{ backgroundColor: c.previewBg, borderColor: c.previewBorder }}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all flex items-center justify-center text-xs shrink-0 ${
                              isSelected
                                ? 'ring-3 ring-vouchy-purple-600 scale-110 shadow-md z-10'
                                : 'opacity-85 hover:opacity-100 hover:scale-105'
                            }`}
                          >
                            {isSelected && <span className="text-[10px] font-black text-gray-900 drop-shadow-xs">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upload Screenshot Chat / Proof Image */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Upload Screenshot Chat / Bukti 📸 <span className="text-gray-400 font-normal lowercase">(opsional)</span>
                      </label>
                      {proofImage && (
                        <button
                          type="button"
                          onClick={() => setProofImage(null)}
                          className="text-[11px] font-extrabold text-rose-500 hover:underline"
                        >
                          Hapus Foto ✕
                        </button>
                      )}
                    </div>

                    {proofImage ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-vouchy-purple-200 group max-h-40">
                        <img
                          src={proofImage}
                          alt="Screenshot proof"
                          className="w-full h-40 object-cover rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setProofImage(null)}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-md"
                          >
                            Hapus Gambar ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-vouchy-purple-400 bg-gray-50/70 hover:bg-vouchy-purple-50/50 transition cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingProof}
                          className="hidden"
                        />
                        {uploadingProof ? (
                          <span className="text-xs font-extrabold text-vouchy-purple-600 animate-pulse py-1">
                            Mengunggah screenshot... ⏳
                          </span>
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full bg-vouchy-purple-100 text-vouchy-purple-700 flex items-center justify-center font-bold text-sm group-hover:scale-110 transition">
                              📷
                            </div>
                            <p className="text-xs font-bold text-gray-700">
                              Klik di sini untuk upload screenshot chat
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium">
                              PNG, JPG, WEBP (Maksimal 5MB)
                            </p>
                          </>
                        )}
                      </label>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-vouchy-purple-600 hover:bg-vouchy-purple-700 text-white font-extrabold text-base shadow-lg shadow-vouchy-purple-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending Vouch...' : 'Send Vouch 💜'}
                  </button>
                </form>
              </>
            ) : (
              /* Success View */
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                <h3 className="text-2xl font-extrabold text-gray-900">
                  🎉 Vouch sent!
                </h3>
                <p className="text-sm text-gray-600 mt-2 max-w-xs mx-auto">
                  Thanks for making someone's day a little brighter. Your vouch has been sent to{' '}
                  <span className="font-bold text-vouchy-purple-600">{profileName}</span> for moderation review!
                </p>

                <button
                  onClick={handleReset}
                  className="mt-6 px-6 py-3 rounded-2xl bg-vouchy-purple-600 text-white font-extrabold text-sm hover:bg-vouchy-purple-700 transition"
                >
                  Done ✨
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
