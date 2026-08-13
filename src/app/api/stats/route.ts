import { withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = withAuth(async () => {
  const [projectsCount, certificatesCount, skillsCount, unreadMessages] = await Promise.all([
    db.project.count(),
    db.certificate.count(),
    db.skill.count(),
    db.contactMessage.count({ where: { read: false } }),
  ]);
  const [recentProjects, recentMessages] = await Promise.all([
    db.project.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    db.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);
  return NextResponse.json({
    projectsCount, certificatesCount, skillsCount, unreadMessages,
    recentProjects, recentMessages,
  });
});
