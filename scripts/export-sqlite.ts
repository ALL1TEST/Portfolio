import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
  console.log('Exporting data from SQLite...');

  const data = {
    users: await prisma.user.findMany(),
    profiles: await prisma.profile.findMany(),
    projects: await prisma.project.findMany(),
    certificates: await prisma.certificate.findMany(),
    skills: await prisma.skill.findMany(),
    education: await prisma.education.findMany(),
    experience: await prisma.experience.findMany(),
    languages: await prisma.language.findMany(),
    softSkills: await prisma.softSkill.findMany(),
    contactMessages: await prisma.contactMessage.findMany(),
    appSettings: await prisma.appSettings.findMany(),
  };

  fs.writeFileSync('backup-data.json', JSON.stringify(data, null, 2));
  console.log('✅ Data exported successfully to backup-data.json');
  await prisma.$disconnect();
}

exportData().catch((e) => {
  console.error(e);
  process.exit(1);
});
