import { withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = withAuth(async () => {
  let settings = await db.appSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings) {
    settings = await db.appSettings.create({ data: { id: 'singleton' } });
  }
  return NextResponse.json({
    contactEmailEnabled: settings.contactEmailEnabled,
    adminLoginEmailEnabled: settings.adminLoginEmailEnabled,
  });
});

export const PUT = withAuth(async (req: Request) => {
  const body = await req.json();
  const settings = await db.appSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...body },
    update: body,
  });
  return NextResponse.json({
    contactEmailEnabled: settings.contactEmailEnabled,
    adminLoginEmailEnabled: settings.adminLoginEmailEnabled,
  });
});
