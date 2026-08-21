import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag, revalidatePath } from '@/lib/revalidate';

export const GET = publicRoute(async () => {
  const certificates = await prisma.certificate.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(certificates);
});

export const POST = withAuth(async (req: Request) => {
  try {
    const body = await req.json();
    const cert = await prisma.certificate.create({
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

    revalidateTag('certificates');
    revalidatePath('/certificates');
    revalidatePath('/');
    revalidatePath('/dashboard/certificates');

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
          prisma.certificate.update({ where: { id: item.id }, data: { displayOrder: item.displayOrder } })
        )
      );
      revalidateTag('certificates');
      revalidatePath('/certificates');
      revalidatePath('/');
      revalidatePath('/dashboard/certificates');
      return NextResponse.json({ success: true });
    }

    if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const cert = await prisma.certificate.update({
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

    revalidateTag('certificates');
    revalidatePath('/certificates');
    revalidatePath('/');
    revalidatePath('/dashboard/certificates');

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
    await prisma.certificate.delete({ where: { id } });

    revalidateTag('certificates');
    revalidatePath('/certificates');
    revalidatePath('/');
    revalidatePath('/dashboard/certificates');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Certificates DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});
