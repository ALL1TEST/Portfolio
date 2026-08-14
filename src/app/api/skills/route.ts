import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = publicRoute(async () => {
  const skills = await db.skill.findMany({ orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }] });
  return NextResponse.json(skills);
});

export const POST = withAuth(async (req: Request) => {
  const body = await req.json();
  const skill = await db.skill.create({
    data: { name: body.name, category: body.category, icon: body.icon || '', displayOrder: body.displayOrder || 0 },
  });
  return NextResponse.json(skill);
});

export const PUT = withAuth(async (req: Request) => {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const skill = await db.skill.update({
    where: { id: body.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.icon !== undefined && { icon: body.icon }),
      ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
    },
  });
  return NextResponse.json(skill);
});

export const DELETE = withAuth(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await db.skill.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
