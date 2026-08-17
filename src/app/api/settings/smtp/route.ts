import { withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - fetch SMTP settings (password masked)
export const GET = withAuth(async () => {
  let settings = await prisma.appSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings) {
    settings = await prisma.appSettings.create({ data: { id: 'singleton' } });
  }
  const { smtpPass, ...safe } = settings;
  return NextResponse.json({ ...safe, hasPassword: !!smtpPass && smtpPass.length > 0 });
});

// PUT - save SMTP settings
export const PUT = withAuth(async (req: Request) => {
  const body = await req.json();
  const { smtpPass, hasPassword, ...rest } = body;

  const updateData: Record<string, unknown> = { ...rest };
  // Only update password if a new one was provided (not the masked placeholder)
  if (smtpPass && !smtpPass.startsWith('•')) {
    updateData.smtpPass = smtpPass;
  }

  const settings = await prisma.appSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...updateData },
    update: updateData,
  });

  const { smtpPass: _, ...safe } = settings;
  return NextResponse.json({ ...safe, hasPassword: !!settings.smtpPass && settings.smtpPass.length > 0 });
});
