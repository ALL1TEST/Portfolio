import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let databaseUrl = process.env.DATABASE_URL || '';

if (process.env.NODE_ENV === 'production' && databaseUrl && (databaseUrl.includes('supabase.com') || databaseUrl.includes('supabase.co'))) {
  try {
    const url = new URL(databaseUrl);
    
    // Automatically switch to Supabase Transaction Pooler (port 6543) instead of Session Pooler (port 5432)
    // This avoids the "EMAXCONNSESSION: max clients reached in session mode" 15-connection limit during Vercel builds.
    if (url.port === '5432' && (url.hostname.includes('supabase.com') || url.hostname.includes('supabase.co'))) {
      url.port = '6543';
    }

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
      url.searchParams.set('pool_timeout', '5');
    }

    databaseUrl = url.toString();
  } catch (error) {
    console.error('[PRISMA_INIT] Failed to parse DATABASE_URL', error);
  }
}

if (!globalForPrisma.prisma) {
  try {
    const parsed = new URL(databaseUrl);
    const isPgbouncer = parsed.searchParams.get('pgbouncer') === 'true';
    const port = parsed.port || '5432';
    
    console.log('[PRISMA_CONFIG]');
    console.log(`runtime: ${process.env.NODE_ENV}`);
    console.log(`host: ${parsed.hostname}`);
    console.log(`port: ${port}`);
    console.log(`pool_mode: ${port === '6543' ? 'transaction' : 'session'}`);
    console.log(`connection_limit: ${parsed.searchParams.get('connection_limit') || 'default'}`);
    console.log(`pgbouncer: ${isPgbouncer}`);
    console.log(`prisma_version: 6.19.3`);
  } catch(e) {
    console.log('[PRISMA_CONFIG] Unable to parse URL for logging.');
  }

  globalForPrisma.prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ['query', 'info', 'warn', 'error'],
  });
}

export const prisma = globalForPrisma.prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
