import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag, revalidatePath } from '@/lib/revalidate';

export const GET = publicRoute(async () => {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }] });
  return NextResponse.json(skills);
});

export const POST = withAuth(async (req: Request) => {
  const body = await req.json();
  const skill = await prisma.skill.create({
    data: { name: body.name, category: body.category, icon: body.icon || '', displayOrder: body.displayOrder || 0 },
  });

  revalidateTag('skills');
  revalidatePath('/resume');
  revalidatePath('/');
  revalidatePath('/dashboard/skills');

  return NextResponse.json(skill);
});

export const PUT = withAuth(async (req: Request) => {
  const body = await req.json();

  // Batch reorder: expects { reorder: [{ id, displayOrder }] }
  if (body.reorder && Array.isArray(body.reorder)) {
    await Promise.all(
      body.reorder.map((item: { id: string; displayOrder: number }) =>
        prisma.skill.update({ where: { id: item.id }, data: { displayOrder: item.displayOrder } })
      )
    );

    revalidateTag('skills');
    revalidatePath('/resume');
    revalidatePath('/');
    revalidatePath('/dashboard/skills');

    return NextResponse.json({ success: true });
  }

  if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const skill = await prisma.skill.update({
    where: { id: body.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.icon !== undefined && { icon: body.icon }),
      ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
    },
  });

  revalidateTag('skills');
  revalidatePath('/resume');
  revalidatePath('/');
  revalidatePath('/dashboard/skills');

  return NextResponse.json(skill);
});

export const DELETE = withAuth(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const category = searchParams.get('category');
  if (category) {
    const { count } = await prisma.skill.deleteMany({ where: { category } });
    revalidateTag('skills');
    revalidatePath('/resume');
    revalidatePath('/');
    revalidatePath('/dashboard/skills');
    return NextResponse.json({ success: true, deleted: count });
  }
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await prisma.skill.delete({ where: { id } });

  revalidateTag('skills');
  revalidatePath('/resume');
  revalidatePath('/');
  revalidatePath('/dashboard/skills');

  return NextResponse.json({ success: true });
});
