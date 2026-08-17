import { withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export const POST = withAuth(async () => {
  const settings = await prisma.appSettings.findUnique({ where: { id: 'singleton' } });
  const to = settings?.contactReceiverEmail || settings?.fromEmail || settings?.smtpUser;
  if (!to) {
    return NextResponse.json({ error: 'No receiver email configured' }, { status: 400 });
  }

  const result = await sendTestEmail(to);
  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to send test email' }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: `Test email sent to ${to}` });
});
