import { withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';

// POST - change account password
export const POST = withAuth(async (req: Request) => {
  const body = await req.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
  }

  const { getServerSession } = await import('next-auth');
  const { authOptions } = await import('@/lib/auth');
  const session = await getServerSession(authOptions);

  const userId = (session?.user as Record<string, unknown> | undefined)?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify current password
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.password) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const isValid = await compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }

  // Hash and update
  const hashed = await hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return NextResponse.json({ success: true });
});
