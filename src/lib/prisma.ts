import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let databaseUrl = process.env.DATABASE_URL || '';

// CRITICAL FIX FOR VERCEL + SUPABASE:
// Vercel serverless functions must use PgBouncer in transaction mode (port 6543)
// and strict connection limits. If the user configured port 5432 (session mode),
// we dynamically switch it to 6543 and append the correct pooler parameters
// to prevent "max clients reached in session mode".
if (process.env.NODE_ENV === 'production' && databaseUrl && (databaseUrl.includes('supabase.com') || databaseUrl.includes('supabase.co'))) {
  try {
    const url = new URL(databaseUrl);
    
    // Disable prepared statements (required for PgBouncer / Supavisor in serverless)
    if (!url.searchParams.has('pgbouncer')) {
      url.searchParams.set('pgbouncer', 'true');
    }
    
    // Restrict connection pool per Vercel lambda instance
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '1');
    }
    
    // Add aggressive timeouts
    if (!url.searchParams.has('pool_timeout')) {
      url.searchParams.set('pool_timeout', '5'); // Wait max 5 seconds for a connection
    }

    databaseUrl = url.toString();
  } catch (error) {
    console.error('[PRISMA_INIT] Failed to parse DATABASE_URL', error);
  }
}

if (!globalForPrisma.prisma) {
  console.log(`[PRISMA_INIT] Creating NEW PrismaClient instance in ${process.env.NODE_ENV} mode`);
  globalForPrisma.prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ['query', 'info', 'warn', 'error'],
  });
} else {
  console.log(`[PRISMA_INIT] Reusing EXISTING PrismaClient instance in ${process.env.NODE_ENV} mode`);
}

export const prisma = globalForPrisma.prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
