import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
  const connectionString = process.env.DATABASE_URL || '';
  console.log('Testing connection to:', connectionString.replace(/:[^:@]*@/, ':***@'));
  
  const prisma = new PrismaClient();

  try {
    const res = await prisma.$queryRaw`SELECT NOW()`;
    console.log('Connected successfully. DB Time:', res);
  } catch (err) {
    console.error('Connection error', err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
