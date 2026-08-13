import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = publicRoute(async () => {
  const certificates = await db.certificate.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(certificates);
});

export const POST = withAuth(async (req: Request) => {
  const body = await req.json();
  const cert = await db.certificate.create({
    data: {
      title: body.title,
      issuer: body.issuer,
      issueDate: body.issueDate,
      skills: JSON.stringify(body.skills || []),
      certificateImage: body.certificateImage || '',
      credentialUrl: body.credentialUrl || '',
      displayOrder: body.displayOrder || 0,
    },
  });
  return NextResponse.json(cert);
});

export const PUT = withAuth(async (req: Request) => {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const cert = await db.certificate.update({
    where: { id: body.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.issuer !== undefined && { issuer: body.issuer }),
      ...(body.issueDate !== undefined && { issueDate: body.issueDate }),
      ...(body.skills !== undefined && { skills: JSON.stringify(body.skills) }),
      ...(body.certificateImage !== undefined && { certificateImage: body.certificateImage }),
      ...(body.credentialUrl !== undefined && { credentialUrl: body.credentialUrl }),
      ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
    },
  });
  return NextResponse.json(cert);
});

export const DELETE = withAuth(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await db.certificate.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
