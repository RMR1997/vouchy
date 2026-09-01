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
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

                  {/* Relationship selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Relationship
                    </label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-vouchy-purple-500 focus:ring-2 focus:ring-vouchy-purple-200 outline-none transition font-medium bg-white"
                    >
                      {RELATIONSHIPS.map((rel) => (
                        <option key={rel} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                  </div>

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
