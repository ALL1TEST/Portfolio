import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export const getProfile = unstable_cache(async () => {
  return await prisma.profile.findFirst();
}, ['global-profile'], { tags: ['profile'] });

export const getProjects = unstable_cache(async () => {
  return await prisma.project.findMany({
    orderBy: { displayOrder: 'asc' },
  });
}, ['global-projects'], { tags: ['projects'] });

export const getCertificates = unstable_cache(async () => {
  return await prisma.certificate.findMany({
    orderBy: { issueDate: 'desc' },
  });
}, ['global-certificates'], { tags: ['certificates'] });

export const getAppSettings = unstable_cache(async () => {
  return await prisma.appSettings.findUnique({ where: { id: 'singleton' } });
}, ['global-app-settings'], { tags: ['appSettings'] });

export const getSkills = unstable_cache(async () => {
  return await prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
  });
}, ['global-skills'], { tags: ['skills'] });

export const getResume = unstable_cache(async () => {
  const education = await prisma.education.findMany({ orderBy: { displayOrder: 'asc' } });
  const experience = await prisma.experience.findMany({ orderBy: { displayOrder: 'asc' } });
  const languages = await prisma.language.findMany({ orderBy: { displayOrder: 'asc' } });
  const softSkills = await prisma.softSkill.findMany({ orderBy: { displayOrder: 'asc' } });
  
  return {
    education,
    experience,
    languages,
    softSkills,
  };
}, ['global-resume'], { tags: ['resume'] });
