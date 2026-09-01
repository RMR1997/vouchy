import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setSessionUser, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, username, email, password } = await request.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const cleanUsername = username.toLowerCase().trim();
    if (!/^[a-z0-9-]{3,30}$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: 'Username must be 3-30 characters (letters, numbers, hyphens)' },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ username: cleanUsername }, { email: email.toLowerCase() }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email is already taken' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await db.user.create({
      data: {
        name,
        username: cleanUsername,
        email: email.toLowerCase(),
        passwordHash,
        avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${cleanUsername}`,
        bio: 'Just created my Vouchy profile! Leave me a vouch ✨',
        settings: {
          create: {
            theme: 'lavender',
            layout: 'masonry',
            background: 'pattern',
            pattern: 'dots',
          },
        },
      },
    });

    await setSessionUser(newUser.id);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
