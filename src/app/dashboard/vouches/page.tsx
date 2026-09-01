import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { VouchManagementClient } from './VouchManagementClient';

export const dynamic = 'force-dynamic';

export default async function VouchesPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  const vouches = await db.vouch.findMany({
    where: { profileId: user.id },
    include: { reactions: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          Your Vouches 💌
        </h2>
        <p className="text-xs font-bold text-gray-500 mt-1">
          Review, approve, hide, or delete vouches submitted to your profile.
        </p>
      </div>

      <VouchManagementClient initialVouches={JSON.parse(JSON.stringify(vouches))} />
    </div>
  );
}
