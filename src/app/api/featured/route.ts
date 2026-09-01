import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const users = await db.user.findMany({
      take: 4,
      include: {
        vouches: {
          where: { status: 'APPROVED' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const featured = users.map((u) => {
      const total = u.vouches.length;
      const avg =
        total > 0
          ? (u.vouches.reduce((acc, v) => acc + v.rating, 0) / total).toFixed(1)
          : '5.0';

      return {
        name: u.name,
        username: u.username,
        title: u.jobTitle || 'Technical Consultant 🚀',
        rating: avg,
        vouchCount: total,
        avatar: u.avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${u.username}`,
        color: 'bg-[#FAF5FF] border-[#E9D5FF]',
      };
    });

    return NextResponse.json({ profiles: featured });
  } catch (error) {
    return NextResponse.json({ profiles: [] }, { status: 500 });
  }
}
