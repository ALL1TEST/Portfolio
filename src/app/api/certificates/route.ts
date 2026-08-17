import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = publicRoute(async () => {
  const certificates = await db.certificate.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(certificates);
});

export const POST = withAuth(async (req: Request) => {
  try {
    const body = await req.json();
    const cert = await db.certificate.create({
      data: {
        title: body.title,
        issuer: body.issuer,
        issueDate: body.issueDate,
        skills: JSON.stringify(body.skills || []),
        certificateImage: body.certificateImage || '',
        credentialUrl: body.credentialUrl || '',
        credentialId: body.credentialId || '',
        category: body.category || '',
        displayOrder: body.displayOrder || 0,
      },
    });
    return NextResponse.json(cert);
  } catch (error: any) {
    console.error('Certificates POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});

export const PUT = withAuth(async (req: Request) => {
  try {
    const body = await req.json();

    // Batch reorder: expects { reorder: [{ id, displayOrder }] }
    if (body.reorder && Array.isArray(body.reorder)) {
      await Promise.all(
        body.reorder.map((item: { id: string; displayOrder: number }) =>
          db.certificate.update({ where: { id: item.id }, data: { displayOrder: item.displayOrder } })
        )
      );
      return NextResponse.json({ success: true });
    }

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
        ...(body.credentialId !== undefined && { credentialId: body.credentialId }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
      },
    });
    return NextResponse.json(cert);
  } catch (error: any) {
    console.error('Certificates PUT error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await db.certificate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Certificates DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});
