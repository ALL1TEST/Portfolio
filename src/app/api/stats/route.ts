import { withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = withAuth(async () => {
  const [projectsCount, certificatesCount, skillsCount, unreadMessages] = await Promise.all([
    prisma.project.count(),
    prisma.certificate.count(),
    prisma.skill.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);
  const [recentProjects, recentMessages] = await Promise.all([
    prisma.project.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);
  return NextResponse.json({
    projectsCount, certificatesCount, skillsCount, unreadMessages,
    recentProjects, recentMessages,
  });
});
