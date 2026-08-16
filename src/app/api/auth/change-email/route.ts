import { withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST - change account email
export const POST = withAuth(async (req: Request) => {
  const body = await req.json();
  const { currentEmail, newEmail } = body;

  if (!currentEmail || !newEmail) {
    return NextResponse.json({ error: 'Current and new email are required' }, { status: 400 });
  }

  const { getServerSession } = await import('next-auth');
  const { authOptions } = await import('@/lib/auth');
  const session = await getServerSession(authOptions);

  const userId = (session?.user as Record<string, unknown> | undefined)?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify current email matches
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || user.email !== currentEmail) {
    return NextResponse.json({ error: 'Current email is incorrect' }, { status: 400 });
  }

  // Check new email is different
  if (currentEmail === newEmail) {
    return NextResponse.json({ error: 'New email must be different' }, { status: 400 });
  }

  // Check new email is not already taken
  const existing = await db.user.findUnique({ where: { email: newEmail } });
  if (existing) {
    return NextResponse.json({ error: 'Email is already in use' }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: userId },
    data: { email: newEmail },
  });

  return NextResponse.json({ email: updated.email });
});
