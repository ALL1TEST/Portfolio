import { withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = withAuth(async () => {
  let settings = await prisma.appSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings) {
    settings = await prisma.appSettings.create({ data: { id: 'singleton' } });
  }
  return NextResponse.json({
    contactEmailEnabled: settings.contactEmailEnabled,
    adminLoginEmailEnabled: settings.adminLoginEmailEnabled,
  });
});

export const PUT = withAuth(async (req: Request) => {
  const body = await req.json();
  const settings = await prisma.appSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...body },
    update: body,
  });
  return NextResponse.json({
    contactEmailEnabled: settings.contactEmailEnabled,
    adminLoginEmailEnabled: settings.adminLoginEmailEnabled,
  });
});
