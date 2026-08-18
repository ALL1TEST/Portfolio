import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = publicRoute(async () => {
  const data = await prisma.experience.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(data);
});

function normalizeTechnologies(raw: unknown): string {
  if (typeof raw === 'string') {
    try { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) return JSON.stringify(parsed); } catch { /* not JSON, keep as-is */ }
    return raw;
  }
  return JSON.stringify(Array.isArray(raw) ? raw : []);
}

export const POST = withAuth(async (req: Request) => {
  const body = await req.json();
  const res = await prisma.experience.create({
    data: { ...body, technologies: normalizeTechnologies(body.technologies) },
  });
  const { revalidateTag, revalidatePath } = await import('next/cache');
  revalidateTag('resume');
  revalidatePath('/resume');
  revalidatePath('/dashboard/resume');
  return NextResponse.json(res);
});

export const PUT = withAuth(async (req: Request) => {
  const body = await req.json();

  // Batch reorder: expects { reorder: [{ id, displayOrder }] }
  if (body.reorder && Array.isArray(body.reorder)) {
    await Promise.all(
      body.reorder.map((item: { id: string; displayOrder: number }) =>
        prisma.experience.update({ where: { id: item.id }, data: { displayOrder: item.displayOrder } })
      )
    );
    const { revalidateTag, revalidatePath } = await import('next/cache');
    revalidateTag('resume');
    revalidatePath('/resume');
    revalidatePath('/dashboard/resume');
    return NextResponse.json({ success: true });
  }

  if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const res = await prisma.experience.update({
    where: { id: body.id },
    data: { ...body, technologies: normalizeTechnologies(body.technologies) },
  });
  const { revalidateTag, revalidatePath } = await import('next/cache');
  revalidateTag('resume');
  revalidatePath('/resume');
  revalidatePath('/dashboard/resume');
  return NextResponse.json(res);
});

export const DELETE = withAuth(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await prisma.experience.delete({ where: { id } });
  const { revalidateTag, revalidatePath } = await import('next/cache');
  revalidateTag('resume');
  revalidatePath('/resume');
  revalidatePath('/dashboard/resume');
  return NextResponse.json({ success: true });
});
