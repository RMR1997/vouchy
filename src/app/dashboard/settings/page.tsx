import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { SettingsClient } from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          Account Settings ⚙️
        </h2>
        <p className="text-xs font-bold text-gray-500 mt-1">
          Manage account security, email, and preferences.
        </p>
      </div>

      <SettingsClient user={user} />
    </div>
  );
}
