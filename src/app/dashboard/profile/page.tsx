import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { ProfileFormClient } from './ProfileFormClient';

export const dynamic = 'force-dynamic';

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          Profile Settings 👤
        </h2>
        <p className="text-xs font-bold text-gray-500 mt-1">
          Update your public profile details, bio, and social links.
        </p>
      </div>

      <ProfileFormClient initialUser={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
