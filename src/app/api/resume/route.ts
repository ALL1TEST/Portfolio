import { publicRoute } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = publicRoute(async () => {
  const [education, experience, languages, softSkills, skills] = await Promise.all([
    prisma.education.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.experience.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.language.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.softSkill.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }] }),
  ]);
  return NextResponse.json({ education, experience, languages, softSkills, skills });
});
