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
                if (c === 'isAnonymous') return Boolean(val);
                if (typeof val === 'number') return val;
                if (typeof val === 'boolean') return val;
                if (['createdAt', 'updatedAt', 'approvedAt'].includes(c) && typeof val === 'string') {
                  return new Date(val.includes('T') ? val : val.replace(' ', 'T') + 'Z').toISOString();
                }
                return String(val);
              })
            );
            return {
              ok: true,
              value: {
                columnNames: res.columns,
                columnTypes: res.columns.map((c: string) => {
                  if (['rating', 'count'].includes(c.toLowerCase())) return 0; // Int32
                  if (c === 'isAnonymous') return 5; // Boolean
                  if (['createdAt', 'updatedAt', 'approvedAt'].includes(c)) return 10; // DateTime
                  return 7; // Text
                }),
                rows,
              },
            };
          } catch (err: any) {
            console.error('LibSQL Query Error:', err);
            return { ok: false, error: { kind: 'GenericJs', id: 0 } };
          }
        },
        async executeRaw(query: { sql: string; args: any[] }) {
          try {
            const res = await client.execute({ sql: query.sql, args: query.args || [] });
            return { ok: true, value: res.rowsAffected };
          } catch (err: any) {
            console.error('LibSQL Execute Error:', err);
            return { ok: false, error: { kind: 'GenericJs', id: 0 } };
          }
        },
        async transactionContext() {
          return { ok: true, value: this };
        },
      };

      return new PrismaClient({ adapter: driverAdapter });
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
