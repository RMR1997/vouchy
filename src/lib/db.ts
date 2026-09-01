import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && tursoAuthToken) {
    try {
      const libsql = createClient({
        url: tursoUrl.startsWith('libsql:') ? tursoUrl.replace('libsql:', 'https:') : tursoUrl,
        authToken: tursoAuthToken,
      });
      const adapter = new PrismaLibSql(libsql as any);
      return new PrismaClient({ adapter: adapter as any });
    } catch (err) {
      console.error('Failed to initialize Turso LibSQL adapter:', err);
    }
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
