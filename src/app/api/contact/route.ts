import { withAuth, publicRoute } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - list messages (admin)
export const GET = withAuth(async () => {
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(messages);
});

// POST - submit from public form
export const POST = publicRoute(async (req: Request) => {
  const body = await req.json();
  const { name, email, subject, message } = body;
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: 'Message too short' }, { status: 400 });
  }
  const msg = await db.contactMessage.create({ data: { name, email, subject, message } });
  return NextResponse.json(msg);
});

// PUT - mark as read
export const PUT = withAuth(async (req: Request) => {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const msg = await db.contactMessage.update({
    where: { id: body.id },
    data: { ...(body.read !== undefined && { read: body.read }) },
  });
  return NextResponse.json(msg);
});

// DELETE
export const DELETE = withAuth(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await db.contactMessage.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
