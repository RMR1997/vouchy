import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client/http';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && tursoAuthToken) {
    try {
      const client = createClient({
        url: tursoUrl.startsWith('libsql:') ? tursoUrl.replace('libsql:', 'https:') : tursoUrl,
        authToken: tursoAuthToken,
      });

      // Custom Lightweight LibSQL Driver Adapter for Prisma v5 Serverless
      const driverAdapter: any = {
        provider: 'sqlite',
        adapterName: '@prisma/adapter-libsql',
        async queryRaw(query: { sql: string; args: any[] }) {
          try {
            const res = await client.execute({ sql: query.sql, args: query.args || [] });
            const rows = res.rows.map((r: any) =>
              res.columns.map((c: string) => {
                const val = r[c];
                if (val === null || val === undefined) return null;
                return val;
              })
            );
            return {
              ok: true,
              value: {
                columnNames: res.columns,
                columnTypes: res.columns.map(() => 'Text'),
                rows,
              },
            };
          } catch (err: any) {
            return { ok: false, error: { kind: 'GenericJs', id: 0 } };
          }
        },
        async executeRaw(query: { sql: string; args: any[] }) {
          try {
            const res = await client.execute({ sql: query.sql, args: query.args || [] });
            return { ok: true, value: res.rowsAffected };
          } catch (err: any) {
            return { ok: false, error: { kind: 'GenericJs', id: 0 } };
          }
        },
        async transactionContext() {
          return { ok: true, value: this };
        },
      };

      return new PrismaClient({ adapter: driverAdapter });
    } catch (err) {
      console.error('Failed to initialize Turso LibSQL adapter, falling back to SQLite:', err);
    }
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
