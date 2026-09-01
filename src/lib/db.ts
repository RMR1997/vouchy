import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/http';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DEFAULT_TURSO_URL = 'https://vouchy-rmr1997.aws-ap-northeast-1.turso.io';
const DEFAULT_TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODgyMzcxNjMsImlkIjoiMDFhMDViM2QtODYwMS03YmMxLTlmZDYtNDBkYmFmZDJhNWEzIiwia2lkIjoiZEFIaTJFaURMcTNpTVh0Y1YwbDQ0bjlQZl9JRHFPd3RKVG9KQWVXTG9TQSIsInJpZCI6ImI4Yzc5MTM0LTc3ZjItNGI2ZS1iNmYzLTRkZTg3NWU0MWZiMyJ9.aIPCmAi-apytBBZKo5Sbeq4TKcNxUpGJh-xd-RZiFkgJU-pYv92lwEAIAQoL0CismVdJNplSVGNTHDL7phUBAA';

function createPrismaClient() {
  const rawUrl = process.env.TURSO_DATABASE_URL || DEFAULT_TURSO_URL;
  const rawToken = process.env.TURSO_AUTH_TOKEN || DEFAULT_TURSO_TOKEN;

  try {
    let tursoUrl = rawUrl.replace(/^["']|["']$/g, '').trim();
    let tursoAuthToken = rawToken.replace(/^["']|["']$/g, '').trim();

    if (!tursoAuthToken || tursoAuthToken.includes('[SENSITIVE]')) {
      tursoAuthToken = DEFAULT_TURSO_TOKEN;
    }

    if (tursoUrl.startsWith('libsql:')) {
      tursoUrl = tursoUrl.replace('libsql:', 'https:');
    }

    const libsql = createClient({
      url: tursoUrl,
      authToken: tursoAuthToken,
    });

    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  } catch (err) {
    console.error('Failed to initialize Turso LibSQL adapter:', err);
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
