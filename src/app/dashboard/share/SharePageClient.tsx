'use client';

import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Check, Share2, Download, ExternalLink, Twitter, Linkedin, MessageCircle } from 'lucide-react';

interface SharePageClientProps {
  username: string;
  name: string;
}

export const SharePageClient: React.FC<SharePageClientProps> = ({ username, name }) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${username}`
    : `https://vouchy.app/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vouch for ${name} on Vouchy!`,
          text: `Check out ${name}'s Vouchy profile and leave a vouch!`,
          url: profileUrl,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      handleCopy();
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `vouchy-qr-${username}.png`;
      a.click();
    }
  };

  const shareText = encodeURIComponent(`Check out my Vouchy wall and leave me a vouch! 💜 ${profileUrl}`);

  return (
    <div className="space-y-8">
      {/* Main Share Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-vouchy-purple-100 shadow-playful-lg text-center max-w-xl mx-auto space-y-6">
        <div>
          <span className="text-4xl">🎉</span>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Your Vouchy is ready!
          </h3>
          <p className="text-sm font-semibold text-gray-600 mt-1">
            Put your Vouchy anywhere people can find you.
          </p>
        </div>

        {/* Copy Link Bar */}
        <div className="flex items-center gap-2 p-2 bg-vouchy-purple-50 rounded-2xl border border-vouchy-purple-200">
          <input
            type="text"
            readOnly
            value={profileUrl}
            className="w-full bg-transparent px-3 py-2 text-xs font-bold text-vouchy-purple-900 outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-vouchy-purple-600 hover:bg-vouchy-purple-700 text-white text-xs font-extrabold shadow-xs transition flex items-center gap-1.5 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={handleNativeShare}
            className="px-6 py-3 rounded-2xl bg-vouchy-purple-600 hover:bg-vouchy-purple-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Profile</span>
          </button>

          <button
            onClick={handleDownloadQR}
            className="px-6 py-3 rounded-2xl bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-800 font-extrabold text-xs shadow-xs transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-vouchy-purple-600" />
            <span>Download QR</span>
          </button>
        </div>

        {/* QR Code Canvas */}
        <div className="pt-6 border-t border-gray-100 flex flex-col items-center">
          <div ref={qrRef} className="p-4 bg-white rounded-2xl border-4 border-vouchy-purple-200 shadow-md inline-block">
            <QRCodeCanvas
              value={profileUrl}
              size={180}
              bgColor="#ffffff"
              fgColor="#6D28D9"
              level="H"
            />
          </div>
          <p className="text-xs font-bold text-gray-400 mt-3">
            Scan to open @{username}'s Vouchy wall
          </p>
        </div>
      </div>

      {/* Social Media One-click Share */}
      <div className="bg-white rounded-3xl p-6 border-2 border-vouchy-purple-100 text-center max-w-xl mx-auto">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
          One-Click Share to Socials
        </h4>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs transition flex items-center gap-2"
          >
            <Twitter className="w-4 h-4" />
            <span>Twitter / X</span>
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs transition flex items-center gap-2"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>

          <a
            href={`https://api.whatsapp.com/send?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
