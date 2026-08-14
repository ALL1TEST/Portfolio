import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const db = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Create admin user (password: admin123)
  const adminPassword = await hash('admin123', 12);
  const user = await db.user.upsert({
    where: { email: 'admin@codevirtox.com' },
    update: {},
    create: {
      email: 'admin@codevirtox.com',
      password: adminPassword,
      name: 'Abdellah Ait-Si',
    },
  });
  console.log('✅ Admin user created:', user.email);

  // Create profile
  const profile = await db.profile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      fullName: 'ABDELLAH AIT-SI',
      brandName: 'CodeVirtox',
      professionalTitle: 'Full Stack Developer | AI & Automation',
      shortBio: 'Building modern web applications and smart automated solutions. Specialized in React, Laravel, and crafting full-stack experiences that drive real impact.',
      aboutText: 'Développeur Full Stack spécialisé en React, Laravel et MySQL, passionné par la création d\'applications web modernes. Intéressé par l\'intelligence artificielle, l\'automatisation et le développement de solutions innovantes.',
      email: 'contact@codevirtox.com',
      phone: '+212 600-000-000',
      location: 'Oulad Teima, Morocco',
      githubUrl: '',
      linkedinUrl: '',
      profileImage: '',
      cvFile: '',
    },
  });
  console.log('✅ Profile created:', profile.brandName);

  // Create projects (upsert by slug — safe from duplicates)
  const projects = [
    {
      id: 'proj-dentclinic' as const,
      title: 'DentClinic',
      slug: 'dentclinic',
      shortDescription: 'Development of a complete dental clinic management application with comprehensive features for appointment management, patient records, and financial tracking.',
      fullDescription: 'A complete dental clinic management system featuring appointment scheduling, patient records management, administrative interfaces, process automation, and financial tracking.',
      technologies: JSON.stringify(['Laravel', 'PHP', 'MySQL', 'FilamentPHP']),
      startDate: 'May 2026',
      endDate: 'June 2026',
      location: 'Oulad Teima, Morocco',
      projectImage: '',
      githubUrl: '',
      liveDemoUrl: '',
      featured: true,
      displayOrder: 1,
    },
    {
      id: 'proj-crud-etudiant' as const,
      title: 'CRUD Étudiant',
      slug: 'crud-etudiant',
      shortDescription: 'Development of an application for managing student information with full CRUD operations and database management capabilities.',
      fullDescription: 'A student management application with complete CRUD operations for creating, viewing, updating, and deleting student records, with database management.',
      technologies: JSON.stringify(['PHP', 'MySQL', 'HTML', 'CSS']),
      startDate: 'April 2025',
      endDate: 'May 2025',
      location: 'Oulad Teima, Morocco',
      projectImage: '',
      githubUrl: '',
      liveDemoUrl: '',
      featured: false,
      displayOrder: 2,
    },
    {
      id: 'proj-library-mgmt' as const,
      title: 'Library Management System',
      slug: 'library-management-system',
      shortDescription: 'Development of an application for managing and organizing a collection of books with browsing and data interaction capabilities.',
      fullDescription: 'A library management application for browsing, organizing, and managing book data with interactive data features.',
      technologies: JSON.stringify(['JavaScript', 'HTML', 'CSS']),
      startDate: 'February 2023',
      endDate: 'March 2023',
      location: 'Oulad Teima, Morocco',
      projectImage: '',
      githubUrl: '',
      liveDemoUrl: '',
      featured: false,
      displayOrder: 3,
    },
  ];

  for (const p of projects) {
    await db.project.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }
  console.log(`✅ ${projects.length} projects created`);

  // Create certificates (upsert by stable ID — prevents duplicates)
  const certificates = [
    {
      id: 'cert-php-essential' as const,
      title: 'PHP Essential Training',
      issuer: 'LinkedIn Learning',
      issueDate: 'April 2025',
      skills: JSON.stringify(['PHP', 'Back-End Web Development']),
      certificateImage: '',
      credentialUrl: '',
      displayOrder: 1,
    },
    {
      id: 'cert-cybersecurity-foundations' as const,
      title: 'Foundations of Cybersecurity',
      issuer: 'Google',
      issueDate: 'May 2025',
      skills: JSON.stringify(['Cybersecurity', 'Network Security']),
      certificateImage: '',
      credentialUrl: '',
      displayOrder: 2,
    },
  ];

  for (const c of certificates) {
    await db.certificate.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    });
  }
  console.log(`✅ ${certificates.length} certificates created`);

  // Create skills (upsert by stable ID — prevents duplicates)
  const skills = [
    { id: 'skill-js' as const, name: 'JavaScript', category: 'Programming', icon: 'Code2', displayOrder: 1 },
    { id: 'skill-php' as const, name: 'PHP', category: 'Programming', icon: 'Code2', displayOrder: 2 },
    { id: 'skill-python' as const, name: 'Python', category: 'Programming', icon: 'Code2', displayOrder: 3 },
    { id: 'skill-sql' as const, name: 'SQL', category: 'Programming', icon: 'Code2', displayOrder: 4 },
    { id: 'skill-html' as const, name: 'HTML', category: 'Web', icon: 'Globe', displayOrder: 1 },
    { id: 'skill-css' as const, name: 'CSS', category: 'Web', icon: 'Globe', displayOrder: 2 },
    { id: 'skill-react' as const, name: 'React', category: 'Web', icon: 'Globe', displayOrder: 3 },
    { id: 'skill-nextjs' as const, name: 'Next.js', category: 'Web', icon: 'Globe', displayOrder: 4 },
    { id: 'skill-tailwind' as const, name: 'Tailwind CSS', category: 'Web', icon: 'Globe', displayOrder: 5 },
    { id: 'skill-laravel' as const, name: 'Laravel', category: 'Back-end', icon: 'Server', displayOrder: 1 },
    { id: 'skill-nodejs' as const, name: 'Node.js', category: 'Back-end', icon: 'Server', displayOrder: 2 },
    { id: 'skill-mysql' as const, name: 'MySQL', category: 'Databases', icon: 'Database', displayOrder: 1 },
    { id: 'skill-mongodb' as const, name: 'MongoDB', category: 'Databases', icon: 'Database', displayOrder: 2 },
    { id: 'skill-ai-tools' as const, name: 'AI Tools', category: 'AI & Automation', icon: 'Brain', displayOrder: 1 },
    { id: 'skill-workflow-auto' as const, name: 'Workflow Automation', category: 'AI & Automation', icon: 'Brain', displayOrder: 2 },
    { id: 'skill-api-integration' as const, name: 'API Integration', category: 'AI & Automation', icon: 'Brain', displayOrder: 3 },
    { id: 'skill-wordpress' as const, name: 'WordPress', category: 'CMS', icon: 'Layout', displayOrder: 1 },
    { id: 'skill-elementor' as const, name: 'Elementor', category: 'CMS', icon: 'Layout', displayOrder: 2 },
    { id: 'skill-git' as const, name: 'Git', category: 'Tools & Cloud', icon: 'Cloud', displayOrder: 1 },
    { id: 'skill-github' as const, name: 'GitHub', category: 'Tools & Cloud', icon: 'Cloud', displayOrder: 2 },
    { id: 'skill-docker' as const, name: 'Docker', category: 'Tools & Cloud', icon: 'Cloud', displayOrder: 3 },
    { id: 'skill-vscode' as const, name: 'VS Code', category: 'Tools & Cloud', icon: 'Cloud', displayOrder: 4 },
    { id: 'skill-oracle-cloud' as const, name: 'Oracle Cloud', category: 'Tools & Cloud', icon: 'Cloud', displayOrder: 5 },
    { id: 'skill-web-opt' as const, name: 'Web Optimization', category: 'SEO', icon: 'Search', displayOrder: 1 },
  ];

  for (const s of skills) {
    await db.skill.upsert({
      where: { id: s.id },
      update: {},
      create: s,
    });
  }
  console.log(`✅ ${skills.length} skills created`);

  // Create education (upsert by stable ID — prevents duplicates)
  const education = [
    {
      id: 'edu-1' as const,
      degree: 'Full Stack Development',
      field: 'Développement Digital',
      institution: 'Institut Spécialisé de Technologie Appliquée NTIC',
      location: 'Oulad Teima, Morocco',
      year: '2024 – Present',
      displayOrder: 1,
    },
    {
      id: 'edu-2' as const,
      degree: 'Software Engineering & Artificial Intelligence',
      field: '',
      institution: 'DEVMINDS',
      location: '',
      year: '2026',
      displayOrder: 2,
    },
  ];

  for (const e of education) {
    await db.education.upsert({
      where: { id: e.id },
      update: e,
      create: e,
    });
  }
  console.log(`✅ ${education.length} education entries created`);

  // Create experience (upsert by stable ID — prevents duplicates)
  const experiences = [
    {
      id: 'exp-dentclinic' as const,
      title: 'DentClinic',
      description: 'Development of a dental clinic management application.',
      technologies: JSON.stringify(['Laravel', 'PHP', 'MySQL', 'FilamentPHP']),
      startDate: 'May 2026',
      endDate: 'June 2026',
      location: 'Oulad Teima, Morocco',
      displayOrder: 1,
    },
    {
      id: 'exp-crud-etudiant' as const,
      title: 'CRUD Étudiant',
      description: 'Development of a student management application.',
      technologies: JSON.stringify(['PHP', 'MySQL', 'HTML', 'CSS']),
      startDate: 'April 2025',
      endDate: 'May 2025',
      location: 'Oulad Teima, Morocco',
      displayOrder: 2,
    },
    {
      id: 'exp-library-mgmt' as const,
      title: 'Library Management System',
      description: 'Development of a library management application.',
      technologies: JSON.stringify(['JavaScript', 'HTML', 'CSS']),
      startDate: 'February 2023',
      endDate: 'March 2023',
      location: 'Oulad Teima, Morocco',
      displayOrder: 3,
    },
  ];

  for (const exp of experiences) {
    await db.experience.upsert({
      where: { id: exp.id },
      update: {},
      create: exp,
    });
  }
  console.log(`✅ ${experiences.length} experience entries created`);

  // Create languages (upsert by stable ID — prevents duplicates)
  const languages = [
    { id: 'lang-arabic' as const, name: 'Arabic', level: 'Native', displayOrder: 1 },
    { id: 'lang-amazigh' as const, name: 'Amazigh', level: 'Native', displayOrder: 2 },
    { id: 'lang-french' as const, name: 'French', level: 'Intermediate', displayOrder: 3 },
    { id: 'lang-english' as const, name: 'English', level: 'Technical', displayOrder: 4 },
  ];

  for (const l of languages) {
    await db.language.upsert({
      where: { id: l.id },
      update: {},
      create: l,
    });
  }
  console.log(`✅ ${languages.length} languages created`);

  // Create soft skills (upsert by stable ID — prevents duplicates)
  const softSkills = [
    { id: 'ss-project-mgmt' as const, name: 'Project Management', icon: 'Calendar', displayOrder: 1 },
    { id: 'ss-teamwork' as const, name: 'Teamwork', icon: 'Users', displayOrder: 2 },
    { id: 'ss-adaptability' as const, name: 'Adaptability', icon: 'RefreshCw', displayOrder: 3 },
    { id: 'ss-problem-solving' as const, name: 'Problem Solving', icon: 'Lightbulb', displayOrder: 4 },
  ];

  for (const s of softSkills) {
    await db.softSkill.upsert({
      where: { id: s.id },
      update: {},
      create: s,
    });
  }
  console.log(`✅ ${softSkills.length} soft skills created`);

  console.log('🎉 Seeding complete!');
}

seed()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
