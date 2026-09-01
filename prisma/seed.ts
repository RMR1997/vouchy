import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Vouchy database safely (no data overwrite)...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Rajabi Profile (Upsert so custom updates are preserved)
  const rajabi = await prisma.user.upsert({
    where: { username: 'rajabi' },
    update: {},
    create: {
      email: 'rajabi@vouchy.app',
      username: 'rajabi',
      name: 'Rajabi',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Technical Consultant • Tech Enthusiast • Always building something 🚀',
      location: 'Jakarta, Indonesia',
      jobTitle: 'Technical Consultant',
      socialLinks: {
        create: [
          { platform: 'linkedin', url: 'https://linkedin.com/in/rajabi' },
          { platform: 'github', url: 'https://github.com/rajabi' },
          { platform: 'instagram', url: 'https://instagram.com/rajabi' },
          { platform: 'website', url: 'https://rajabi.dev' },
        ],
      },
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

  // 2. Haydaycici Profile (Upsert so custom updates are preserved)
  const haydaycici = await prisma.user.upsert({
    where: { username: 'haydaycici' },
    update: {},
    create: {
      email: 'haydaycici@vouchy.app',
      username: 'haydaycici',
      name: 'Cici',
      passwordHash,
      avatar: '/Avatar%20Vouchy/bubu%202.jpg',
      bio: 'Content Creator & Creative Mind ✨ • Spreading good vibes & sweet memories 💕',
      location: 'Jakarta, Indonesia',
      jobTitle: 'Content Creator',
      socialLinks: {
        create: [
          { platform: 'instagram', url: 'https://instagram.com/haydaycici' },
          { platform: 'tiktok', url: 'https://tiktok.com/@haydaycici' },
        ],
      },
      settings: {
        create: {
          theme: 'bubblegum',
          layout: 'cozy',
          background: 'pattern',
          pattern: 'hearts',
        },
      },
    },
  });

  console.log('✅ Seed safe check completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
