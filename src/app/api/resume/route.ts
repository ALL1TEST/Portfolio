import { publicRoute } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = publicRoute(async () => {
  const [education, experience, languages, softSkills, skills] = await Promise.all([
    db.education.findMany({ orderBy: { displayOrder: 'asc' } }),
    db.experience.findMany({ orderBy: { displayOrder: 'asc' } }),
    db.language.findMany({ orderBy: { displayOrder: 'asc' } }),
    db.softSkill.findMany({ orderBy: { displayOrder: 'asc' } }),
    db.skill.findMany({ orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }] }),
  ]);
  return NextResponse.json({ education, experience, languages, softSkills, skills });
});
