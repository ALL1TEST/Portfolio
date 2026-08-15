import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = publicRoute(async () => {
  const data = await db.experience.findMany({ orderBy: { displayOrder: 'asc' } });
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
  return NextResponse.json(await db.experience.create({
    data: { ...body, technologies: normalizeTechnologies(body.technologies) },
  }));
});

export const PUT = withAuth(async (req: Request) => {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  return NextResponse.json(await db.experience.update({
    where: { id: body.id },
    data: { ...body, technologies: normalizeTechnologies(body.technologies) },
  }));
});

export const DELETE = withAuth(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await db.experience.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
