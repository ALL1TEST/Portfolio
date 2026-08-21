import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag, revalidatePath } from '@/lib/revalidate';

// GET all projects (public)
export const GET = publicRoute(async () => {
  const projects = await prisma.project.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(projects);
});

// Helper to generate a slug that does not collide with other projects in the DB
async function generateUniqueSlug(titleOrSlug: string, currentId?: string): Promise<string> {
  const baseSlug = (titleOrSlug || 'project')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'project';

  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.project.findFirst({
      where: {
        slug: uniqueSlug,
        ...(currentId ? { NOT: { id: currentId } } : {}),
      },
    });

    if (!existing) return uniqueSlug;

    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
}

function formatTechnologies(raw: unknown): string {
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return JSON.stringify(parsed);
    } catch {
      // not valid JSON, fall through
    }
    return raw;
  }
  return JSON.stringify(Array.isArray(raw) ? raw : []);
}

// POST - Create new project
export const POST = withAuth(async (req: Request) => {
  try {
    const body = await req.json();

    const title = body.title || 'Untitled Project';
    const rawSlug = (body.slug && body.slug.trim()) ? body.slug : title;
    const slug = await generateUniqueSlug(rawSlug);

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        shortDescription: body.shortDescription || '',
        fullDescription: body.fullDescription || '',
        technologies: formatTechnologies(body.technologies),
        startDate: body.startDate || '',
        endDate: body.endDate || '',
        location: body.location || 'Oulad Teima, Morocco',
        projectImage: body.projectImage || '',
        githubUrl: body.githubUrl || '',
        liveDemoUrl: body.liveDemoUrl || '',
        featured: body.featured || false,
        displayOrder: body.displayOrder || 0,
      },
    });
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

    let updatedSlug: string | undefined = undefined;
    if (body.slug !== undefined || body.title !== undefined) {
      const rawSlug = (body.slug !== undefined && body.slug.trim()) ? body.slug : (body.title || '');
      if (rawSlug) {
        updatedSlug = await generateUniqueSlug(rawSlug, body.id);
      }
    }

    const project = await prisma.project.update({
      where: { id: body.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(updatedSlug !== undefined && { slug: updatedSlug }),
        ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
        ...(body.fullDescription !== undefined && { fullDescription: body.fullDescription }),
        ...(body.technologies !== undefined && { technologies: formatTechnologies(body.technologies) }),
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
