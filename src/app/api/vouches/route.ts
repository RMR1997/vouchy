import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const status = searchParams.get('status');

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const whereClause: any = { profileId: user.id };
    if (status) {
      whereClause.status = status;
    }

    const vouches = await db.vouch.findMany({
      where: whereClause,
      include: {
        reactions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ vouches });
  } catch (error) {
    console.error('Error fetching vouches:', error);
    return NextResponse.json({ error: 'Failed to fetch vouches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profileId, authorName, authorAvatar, message, rating, relationship, isAnonymous, cardColor } = body;

    if (!profileId || !authorName || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const vouch = await db.vouch.create({
      data: {
        profileId,
        authorName: isAnonymous ? 'Anonymous' : authorName,
        authorAvatar: isAnonymous ? null : authorAvatar,
        message,
        rating: Number(rating) || 5,
        relationship: relationship || 'Friend',
        isAnonymous: Boolean(isAnonymous),
        cardColor: cardColor || null,
        status: 'PENDING', // Default moderation status
      },
    });

    return NextResponse.json({ success: true, vouch });
  } catch (error) {
    console.error('Error submitting vouch:', error);
    return NextResponse.json({ error: 'Failed to submit vouch' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { vouchId, status } = body;

    if (!vouchId || !status) {
      return NextResponse.json({ error: 'Vouch ID and status required' }, { status: 400 });
    }

    if (!['APPROVED', 'HIDDEN', 'DELETED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    if (status === 'DELETED') {
      await db.vouch.delete({ where: { id: vouchId } });
      return NextResponse.json({ success: true, message: 'Vouch deleted' });
    }

    const updatedVouch = await db.vouch.update({
      where: { id: vouchId },
      data: {
        status,
        approvedAt: status === 'APPROVED' ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, vouch: updatedVouch });
  } catch (error) {
    console.error('Error updating vouch status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
