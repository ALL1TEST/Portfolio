import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = publicRoute(async () => {
  const data = await db.experience.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(data);
});

export const POST = withAuth(async (req: Request) => {
  const body = await req.json();
  return NextResponse.json(await db.experience.create({
    data: { ...body, technologies: JSON.stringify(body.technologies || []) },
  }));
});

export const PUT = withAuth(async (req: Request) => {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  return NextResponse.json(await db.experience.update({
    where: { id: body.id },
    data: { ...body, technologies: JSON.stringify(body.technologies || []) },
  }));
});

export const DELETE = withAuth(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await db.experience.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
