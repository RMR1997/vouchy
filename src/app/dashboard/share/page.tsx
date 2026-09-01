import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { SharePageClient } from './SharePageClient';

export const dynamic = 'force-dynamic';

export default async function SharePage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          Share Your Vouchy 🎉
        </h2>
        <p className="text-xs font-bold text-gray-500 mt-1">
          Put your Vouchy link anywhere people can find you — bio, resume, LinkedIn, or Twitter!
        </p>
      </div>

      <SharePageClient username={user.username} name={user.name} />
    </div>
  );
}
