'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2, User, Globe, Linkedin, Github, Instagram, Twitter, MessageCircle } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
}

interface UserProps {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  location: string | null;
  jobTitle: string | null;
  avatar: string | null;
  socialLinks: SocialLink[];
}

interface ProfileFormClientProps {
  initialUser: UserProps;
}

export const ProfileFormClient: React.FC<ProfileFormClientProps> = ({ initialUser }) => {
  const router = useRouter();
  const [name, setName] = useState(initialUser.name || '');
  const [bio, setBio] = useState(initialUser.bio || '');
  const [location, setLocation] = useState(initialUser.location || '');
  const [jobTitle, setJobTitle] = useState(initialUser.jobTitle || '');
  const [avatar, setAvatar] = useState(initialUser.avatar || '');

  // Social Links state
  const findUrl = (p: string) => initialUser.socialLinks.find((l) => l.platform === p)?.url || '';
  const [linkedin, setLinkedin] = useState(findUrl('linkedin'));
  const [github, setGithub] = useState(findUrl('github'));
  const [instagram, setInstagram] = useState(findUrl('instagram'));
  const [twitter, setTwitter] = useState(findUrl('twitter'));
  const [whatsapp, setWhatsapp] = useState(findUrl('whatsapp'));
  const [website, setWebsite] = useState(findUrl('website'));

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const socialLinks = [
      { platform: 'linkedin', url: linkedin },
      { platform: 'github', url: github },
      { platform: 'instagram', url: instagram },
      { platform: 'twitter', url: twitter },
      { platform: 'whatsapp', url: whatsapp },
      { platform: 'website', url: website },
    ].filter((l) => l.url.trim() !== '');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bio,
          location,
          jobTitle,
          avatar,
          socialLinks,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        router.refresh();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setAvatar(data.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-vouchy-purple-100 shadow-sm space-y-6">
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-2 text-emerald-800 text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Profile changes saved successfully! ✨</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-2 text-emerald-800 text-sm font-bold animate-pop">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>✅ Foto berhasil diunggah! Klik "Save Profile Settings ✨" di bawah untuk menyimpan perubahan.</span>
        </div>
      )}

      {/* Avatar Preview & File Upload */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
        <div className="relative group">
          <img
            src={avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${initialUser.username}`}
            alt="Avatar preview"
            className="w-24 h-24 rounded-full object-cover border-4 border-vouchy-purple-200 shadow-md"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white text-xs font-black animate-pulse">
              Uploading...
            </div>
          )}
        </div>

        <div className="flex-1 w-full space-y-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Profile Avatar Image
          </label>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* File Upload Button */}
            <label className={`px-6 py-3 rounded-2xl font-extrabold text-xs shadow-md cursor-pointer transition flex items-center justify-center gap-2 ${
              uploadSuccess
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-vouchy-purple-600 hover:bg-vouchy-purple-700 text-white shadow-vouchy-purple-200'
            }`}>
              <span>
                {uploading
                  ? '⏳ Uploading Photo...'
                  : uploadSuccess
                  ? '✅ Foto Berhasil Diunggah!'
                  : '📁 Upload Photo from Device'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-[11px] font-medium text-gray-400">
            Upload JPG, PNG, WEBP file directly from your phone or computer (max 5MB).
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-vouchy-purple-500 focus:ring-2 focus:ring-vouchy-purple-200 outline-none transition font-medium text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Job Title / Role
          </label>
          <input
            type="text"
            placeholder="e.g. Technical Consultant"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-vouchy-purple-500 focus:ring-2 focus:ring-vouchy-purple-200 outline-none transition font-medium text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Location
        </label>
        <input
          type="text"
          placeholder="e.g. Jakarta, Indonesia"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-vouchy-purple-500 focus:ring-2 focus:ring-vouchy-purple-200 outline-none transition font-medium text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Bio / Short Description
        </label>
        <textarea
          rows={3}
          maxLength={200}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-vouchy-purple-500 focus:ring-2 focus:ring-vouchy-purple-200 outline-none transition font-medium text-sm resize-none"
        />
      </div>

      {/* Social Links Section */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-extrabold text-gray-900 mb-3">Social Media & Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn URL
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-vouchy-purple-500 outline-none text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
              <Github className="w-3.5 h-3.5 text-gray-800" /> GitHub URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/username"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-vouchy-purple-500 outline-none text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5 text-pink-600" /> Instagram URL
            </label>
            <input
              type="url"
              placeholder="https://instagram.com/username"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-vouchy-purple-500 outline-none text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
              <Twitter className="w-3.5 h-3.5 text-sky-500" /> Twitter / X URL
            </label>
            <input
              type="url"
              placeholder="https://twitter.com/username"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-vouchy-purple-500 outline-none text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Link / Number
            </label>
            <input
              type="url"
              placeholder="https://wa.me/6281234567890"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-vouchy-purple-500 outline-none text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-600" /> Personal Website
            </label>
            <input
              type="url"
              placeholder="https://yourdomain.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-vouchy-purple-500 outline-none text-xs font-medium"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-8 py-3.5 rounded-2xl bg-vouchy-purple-600 hover:bg-vouchy-purple-700 text-white font-extrabold text-sm shadow-md shadow-vouchy-purple-200 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        <span>{saving ? 'Saving Changes...' : 'Save Profile Settings ✨'}</span>
      </button>
    </form>
  );
};
