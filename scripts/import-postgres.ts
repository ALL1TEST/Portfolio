import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importData() {
  console.log('Importing data to PostgreSQL...');

  if (!fs.existsSync('backup-data.json')) {
    console.error('No backup-data.json found. Run export first.');
    process.exit(1);
  }

  const file = fs.readFileSync('backup-data.json', 'utf8');
  const data = JSON.parse(file);

  // Helper to insert data
  const insertMany = async (modelDelegate: any, items: any[]) => {
    if (items && items.length > 0) {
      await modelDelegate.createMany({
        data: items,
        skipDuplicates: true, // Prevents errors if rerun
      });
    }
  };

  try {
    await insertMany(prisma.user, data.users);
    await insertMany(prisma.profile, data.profiles);
    await insertMany(prisma.project, data.projects);
    await insertMany(prisma.certificate, data.certificates);
    await insertMany(prisma.skill, data.skills);
    await insertMany(prisma.education, data.education);
    await insertMany(prisma.experience, data.experience);
    await insertMany(prisma.language, data.languages);
    await insertMany(prisma.softSkill, data.softSkills);
    await insertMany(prisma.contactMessage, data.contactMessages);
    await insertMany(prisma.appSettings, data.appSettings);

    console.log('✅ Data imported successfully!');
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    await prisma.$disconnect();
  }
}

importData().catch((e) => {
  console.error(e);
  process.exit(1);
});
