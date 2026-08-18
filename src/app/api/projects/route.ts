import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all projects (public)
export const GET = publicRoute(async () => {
  const projects = await prisma.project.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(projects);
});

// POST - Create project (admin)
export const POST = withAuth(async (req: Request) => {
  try {
    const body = await req.json();
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug,
        shortDescription: body.shortDescription,
        fullDescription: body.fullDescription || '',
        technologies: JSON.stringify(body.technologies || []),
        startDate: body.startDate,
        endDate: body.endDate || '',
        location: body.location || 'Oulad Teima, Morocco',
        projectImage: body.projectImage || '',
        githubUrl: body.githubUrl || '',
        liveDemoUrl: body.liveDemoUrl || '',
        featured: body.featured || false,
        displayOrder: body.displayOrder || 0,
      },
    });
    const { revalidateTag, revalidatePath } = await import('next/cache');
    revalidateTag('projects');
    revalidatePath('/projects');
    revalidatePath('/');
    revalidatePath('/dashboard/projects');

    return NextResponse.json(project);
  } catch (error: any) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});

// PUT - Update project
export const PUT = withAuth(async (req: Request) => {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const project = await prisma.project.update({
      where: { id: body.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
        ...(body.fullDescription !== undefined && { fullDescription: body.fullDescription }),
        ...(body.technologies !== undefined && { technologies: JSON.stringify(body.technologies) }),
        ...(body.startDate !== undefined && { startDate: body.startDate }),
        ...(body.endDate !== undefined && { endDate: body.endDate }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.projectImage !== undefined && { projectImage: body.projectImage }),
        ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl }),
        ...(body.liveDemoUrl !== undefined && { liveDemoUrl: body.liveDemoUrl }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
      },
    });

    const { revalidateTag, revalidatePath } = await import('next/cache');
    revalidateTag('projects');
    revalidatePath('/projects');
    revalidatePath('/');
    revalidatePath('/dashboard/projects');

    return NextResponse.json(project);
  } catch (error: any) {
    console.error('Projects PUT error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});

// DELETE - Delete project
export const DELETE = withAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.project.delete({ where: { id } });

    const { revalidateTag, revalidatePath } = await import('next/cache');
    revalidateTag('projects');
    revalidatePath('/projects');
    revalidatePath('/');
    revalidatePath('/dashboard/projects');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Projects DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});
