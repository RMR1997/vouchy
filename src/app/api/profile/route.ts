import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, location, jobTitle, avatar, socialLinks, settings } = body;

    // Update user info
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        bio: bio !== undefined ? bio : user.bio,
        location: location !== undefined ? location : user.location,
        jobTitle: jobTitle !== undefined ? jobTitle : user.jobTitle,
        avatar: avatar !== undefined ? avatar : user.avatar,
      },
    });

    // Update social links if provided
    if (socialLinks && Array.isArray(socialLinks)) {
      await db.socialLink.deleteMany({ where: { userId: user.id } });
      if (socialLinks.length > 0) {
        await db.socialLink.createMany({
          data: socialLinks.map((link: any) => ({
            userId: user.id,
            platform: link.platform,
            url: link.url,
          })),
        });
      }
    }

    // Update appearance settings if provided
    if (settings) {
      await db.profileSettings.upsert({
        where: { userId: user.id },
        update: {
          theme: settings.theme,
          layout: settings.layout,
          background: settings.background,
          pattern: settings.pattern,
        },
        create: {
          userId: user.id,
          theme: settings.theme || 'lavender',
          layout: settings.layout || 'masonry',
          background: settings.background || 'pattern',
          pattern: settings.pattern || 'dots',
        },
      });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
