import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag, revalidatePath } from '@/lib/revalidate';

export const GET = publicRoute(async () => {
  const data = await prisma.education.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(data);
});

export const POST = withAuth(async (req: Request) => {
  const body = await req.json();
  const res = await prisma.education.create({ data: body });
  revalidateTag('resume');
  revalidatePath('/resume');
  revalidatePath('/certificates');
  revalidatePath('/dashboard/education');
  return NextResponse.json(res);
});

export const PUT = withAuth(async (req: Request) => {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const res = await prisma.education.update({ where: { id: body.id }, data: body });
  revalidateTag('resume');
  revalidatePath('/resume');
  revalidatePath('/certificates');
  revalidatePath('/dashboard/education');
  return NextResponse.json(res);
});

export const DELETE = withAuth(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await prisma.education.delete({ where: { id } });
  revalidateTag('resume');
  revalidatePath('/resume');
  revalidatePath('/certificates');
  revalidatePath('/dashboard/education');
  return NextResponse.json({ success: true });
});
