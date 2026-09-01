import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vouchId, type } = body;

    if (!vouchId || !type) {
      return NextResponse.json({ error: 'vouchId and type required' }, { status: 400 });
    }

    const newReaction = await db.reaction.create({
      data: {
        vouchId,
        type,
      },
    });

    const reactionCounts = await db.reaction.groupBy({
      by: ['type'],
      where: { vouchId },
      _count: { type: true },
    });

    return NextResponse.json({ success: true, reaction: newReaction, counts: reactionCounts });
  } catch (error) {
    console.error('Error adding reaction:', error);
    return NextResponse.json({ error: 'Failed to add reaction' }, { status: 500 });
  }
}
