import { NextResponse } from 'next/server';
import { setSessionUser, clearSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      await clearSessionUser();
      return NextResponse.json({ success: true, message: 'Logged out' });
    }

    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await setSessionUser(user.id);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error switching user:', error);
    return NextResponse.json({ error: 'Failed to switch user' }, { status: 500 });
  }
}
