import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

async function runSql() {
  const prisma = new PrismaClient();
  try {
    const sql = fs.readFileSync('scripts/add-reset-token.sql', 'utf8');
    console.log('Read SQL file. Executing statements...');
    
    // Remove BOM
    const cleanSql = sql.replace(/^\uFEFF/, '');
    
    const statements = cleanSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt);
    }
    
    console.log('✅ Migration applied successfully via Prisma Client!');
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runSql();
