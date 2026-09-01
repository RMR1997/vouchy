import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setSessionUser, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { usernameOrEmail, password } = await request.json();

    if (!usernameOrEmail || !password) {
      return NextResponse.json({ error: 'Username/email and password required' }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail.toLowerCase() },
          { email: usernameOrEmail.toLowerCase() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    await setSessionUser(user.id);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Failed to log in' }, { status: 500 });
  }
}
