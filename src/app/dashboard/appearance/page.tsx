import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { AppearanceCustomizerClient } from './AppearanceCustomizerClient';

export const dynamic = 'force-dynamic';

export default async function AppearancePage() {
  const user = await getCurrentUser();

  if (!user) return null;

  const settings = (await db.profileSettings.findUnique({
    where: { userId: user.id },
  })) || {
    theme: 'lavender',
    layout: 'masonry',
    background: 'pattern',
    pattern: 'dots',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          Profile Appearance 🎨
        </h2>
        <p className="text-xs font-bold text-gray-500 mt-1">
          Customize themes, layouts, background gradients, and patterns for your public wall.
        </p>
      </div>

      <AppearanceCustomizerClient
        initialSettings={JSON.parse(JSON.stringify(settings))}
        user={JSON.parse(JSON.stringify(user))}
      />
    </div>
  );
}
