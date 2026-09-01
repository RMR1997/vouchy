'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PatternBackground } from '@/components/PatternBackground';
import { VouchCard } from '@/components/VouchCard';
import { getCardColorDetails } from '@/lib/utils';
import { Check, Sparkles, LayoutGrid, Layers, Columns, Star } from 'lucide-react';

interface Settings {
  theme: string;
  cardColor?: string;
  layout: string;
  background: string;
  pattern: string;
}

interface AppearanceCustomizerClientProps {
  initialSettings: Settings;
  user: any;
}

const THEMES = [
  { id: 'lavender', label: 'Lavender 💜', color: 'bg-purple-200 border-purple-400' },
  { id: 'sunshine', label: 'Sunshine ☀️', color: 'bg-amber-200 border-amber-400' },
  { id: 'mint', label: 'Mint 🌿', color: 'bg-emerald-200 border-emerald-400' },
  { id: 'sky', label: 'Sky ☁️', color: 'bg-sky-200 border-sky-400' },
  { id: 'bubblegum', label: 'Bubblegum 🎀', color: 'bg-pink-200 border-pink-400' },
  { id: 'cream', label: 'Cream 🍦', color: 'bg-amber-100 border-amber-300' },
];

const CARD_COLORS = [
  { id: 'pink', label: 'Pink 🎀', color: 'bg-pink-100 border-pink-400 text-pink-900' },
  { id: 'rose', label: 'Rose 🌸', color: 'bg-rose-100 border-rose-400 text-rose-900' },
  { id: 'white', label: 'White Standard 🤍', color: 'bg-white border-gray-300 text-gray-900' },
  { id: 'purple', label: 'Lavender 💜', color: 'bg-purple-100 border-purple-400 text-purple-900' },
  { id: 'sky', label: 'Sky Blue ☁️', color: 'bg-sky-100 border-sky-400 text-sky-900' },
  { id: 'mint', label: 'Mint Green 🌿', color: 'bg-emerald-100 border-emerald-400 text-emerald-900' },
  { id: 'amber', label: 'Sunshine ☀️', color: 'bg-amber-100 border-amber-400 text-amber-900' },
  { id: 'dark', label: 'Dark Chic 🖤', color: 'bg-gray-900 border-gray-700 text-white' },
];

const LAYOUTS = [
  { id: 'cozy', label: 'Cozy Grid', description: 'Equal columns grid', icon: LayoutGrid },
  { id: 'masonry', label: 'Masonry', description: 'Dynamic staggered layout', icon: Layers },
  { id: 'clean', label: 'Clean Cards', description: 'Spacious 2-column view', icon: Columns },
];

const BACKGROUNDS = [
  { id: 'pattern', label: 'Pattern' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'solid', label: 'Solid Color' },
];

const PATTERNS = [
  { id: 'dots', label: 'Polka Dots' },
  { id: 'stars', label: 'Tiny Stars' },
  { id: 'hearts', label: 'Little Hearts' },
  { id: 'squiggles', label: 'Squiggles' },
  { id: 'clouds', label: 'Clouds' },
];

export const AppearanceCustomizerClient: React.FC<AppearanceCustomizerClientProps> = ({
  initialSettings,
  user,
}) => {
  const router = useRouter();
  const [theme, setTheme] = useState(initialSettings.theme || 'lavender');
  const [cardColor, setCardColor] = useState(initialSettings.cardColor || 'white');
  const [layout, setLayout] = useState(initialSettings.layout || 'masonry');
  const [background, setBackground] = useState(initialSettings.background || 'pattern');
  const [pattern, setPattern] = useState(initialSettings.pattern || 'dots');

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: { theme, cardColor, layout, background, pattern },
        }),
      });

      if (res.ok) {
        setSaveMessage('Appearance settings saved! ✨');
        router.refresh();
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save appearance:', err);
    } finally {
      setSaving(false);
    }
  };

  const cardDetails = getCardColorDetails(cardColor);

  return (
    <div className="space-y-8">
      {saveMessage && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-800 text-sm font-bold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Control Options */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-vouchy-purple-100 shadow-sm space-y-6">
        {/* Profile Card Color Picker */}
        <div>
          <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-1">
            Warna Kotak Profile Public Wall 📦✨
          </label>
          <p className="text-xs text-gray-500 font-semibold mb-3">
            Pilih warna latar belakang kartu profil utama Anda di halaman publik (termasuk opsi Pink 🎀):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CARD_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCardColor(c.id)}
                className={`p-3.5 rounded-2xl border-2 font-extrabold text-xs flex items-center justify-between transition ${
                  c.color
                } ${
                  cardColor === c.id
                    ? 'ring-4 ring-vouchy-purple-500 scale-105 shadow-md border-vouchy-purple-600'
                    : 'opacity-85 hover:opacity-100'
                }`}
              >
                <span>{c.label}</span>
                {cardColor === c.id && <Check className="w-4 h-4 text-vouchy-purple-700 shrink-0 ml-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Picker */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
            Theme Palette 🎨
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`p-3 rounded-2xl border-2 font-extrabold text-xs flex flex-col items-center gap-2 transition ${
                  t.color
                } ${
                  theme === t.id
                    ? 'ring-4 ring-vouchy-purple-500 scale-105 shadow-md'
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                <span>{t.label}</span>
                {theme === t.id && <Check className="w-4 h-4 text-vouchy-purple-700" />}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Picker */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
            Wall Layout Style 📐
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LAYOUTS.map((l) => {
              const Icon = l.icon;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLayout(l.id)}
                  className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition ${
                    layout === l.id
                      ? 'border-vouchy-purple-600 bg-vouchy-purple-50 ring-2 ring-vouchy-purple-200'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-6 h-6 text-vouchy-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">{l.label}</p>
                    <p className="text-xs text-gray-500 font-medium">{l.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Background Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Background Mode
            </label>
            <div className="flex items-center gap-2">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setBackground(bg.id)}
                  className={`flex-1 py-2.5 rounded-xl border font-extrabold text-xs transition ${
                    background === bg.id
                      ? 'bg-vouchy-purple-600 text-white border-vouchy-purple-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Style (if background === 'pattern') */}
          {background === 'pattern' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Pattern Style
              </label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-xs bg-white focus:border-vouchy-purple-500 outline-none"
              >
                {PATTERNS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-vouchy-purple-600 hover:bg-vouchy-purple-700 text-white font-extrabold text-sm shadow-md shadow-vouchy-purple-200 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-vouchy-yellow-200" />
            <span>{saving ? 'Saving...' : 'Save Appearance ✨'}</span>
          </button>

          <a
            href={`/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-vouchy-purple-50 hover:bg-vouchy-purple-100 text-vouchy-purple-800 border border-vouchy-purple-200 font-extrabold text-sm transition flex items-center gap-2"
          >
            <span>👁️ Lihat Dinding Publik Live</span>
          </a>
        </div>
      </div>

      {/* Live Real-time Profile Wall Preview */}
      <div className="border-2 border-vouchy-purple-200 rounded-4xl overflow-hidden shadow-playful-lg">
        <div className="bg-white px-6 py-3 border-b border-gray-200 flex items-center justify-between text-xs font-extrabold text-gray-500">
          <span>Live Wall & Profile Card Preview</span>
          <span className="text-vouchy-purple-600">vouchy.app/{user.username}</span>
        </div>

        <PatternBackground theme={theme} background={background} pattern={pattern} className="p-6 sm:p-8">
          <div className="max-w-md mx-auto space-y-6">
            {/* Live Profile Header Card Mockup */}
            <div
              style={cardDetails.style}
              className={`p-6 rounded-3xl border-4 shadow-lg text-center flex flex-col items-center gap-3 transition-all duration-300 ${cardDetails.className}`}
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.username}`}
                alt={user.name || 'User'}
                className="w-20 h-20 rounded-full object-cover border-4 border-vouchy-purple-200 shadow-md"
              />
              <div>
                <h3 className={`text-xl font-black ${cardDetails.headingClass}`}>{user.name || 'Your Name'}</h3>
                <p className="text-xs font-bold text-vouchy-purple-600 mt-0.5">@{user.username}</p>
                <div className="flex items-center justify-center gap-1 mt-1 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-0.5 rounded-full inline-flex">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>5.0 rating</span>
                </div>
              </div>
              <p className={`text-xs font-medium leading-relaxed ${cardDetails.subtextClass}`}>
                {user.bio || 'Hello Guys, Welcome to Vouchy!'}
              </p>
            </div>

            <VouchCard
              id="preview-card"
              authorName="Sarah Chen"
              authorAvatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
              message="Your profile card and wall look so aesthetic with this color scheme! 🚀"
              rating={5}
              isAnonymous={false}
              createdAt={new Date()}
              reactions={[{ id: 'r1', type: 'HEART' }, { id: 'r2', type: 'FLOWER' }, { id: 'r3', type: 'STRAWBERRY' }]}
            />
          </div>
        </PatternBackground>
      </div>
    </div>
  );
};
