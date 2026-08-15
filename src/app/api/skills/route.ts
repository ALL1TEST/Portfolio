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

  // Batch reorder: expects { reorder: [{ id, displayOrder }] }
  if (body.reorder && Array.isArray(body.reorder)) {
    await Promise.all(
      body.reorder.map((item: { id: string; displayOrder: number }) =>
        db.skill.update({ where: { id: item.id }, data: { displayOrder: item.displayOrder } })
      )
    );
    return NextResponse.json({ success: true });
  }

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
  const category = searchParams.get('category');
  if (category) {
    const { count } = await db.skill.deleteMany({ where: { category } });
    return NextResponse.json({ success: true, deleted: count });
  }
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await db.skill.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
