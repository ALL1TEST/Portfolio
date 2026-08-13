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

  // Create projects
  const projects = [
    {
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
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log(`✅ ${projects.length} projects created`);

  // Create certificates
  const certificates = [
    {
      title: 'PHP Essential Training',
      issuer: 'LinkedIn Learning',
      issueDate: 'April 2025',
      skills: JSON.stringify(['PHP', 'Back-End Web Development']),
      certificateImage: '',
      credentialUrl: '',
      displayOrder: 1,
    },
    {
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
    await db.certificate.create({ data: c });
  }
  console.log(`✅ ${certificates.length} certificates created`);

  // Create skills
  const skills = [
    { name: 'JavaScript', category: 'Programming', icon: 'Code2', displayOrder: 1 },
    { name: 'PHP', category: 'Programming', icon: 'Code2', displayOrder: 2 },
    { name: 'Python', category: 'Programming', icon: 'Code2', displayOrder: 3 },
    { name: 'SQL', category: 'Programming', icon: 'Code2', displayOrder: 4 },
    { name: 'HTML', category: 'Web', icon: 'Globe', displayOrder: 1 },
    { name: 'CSS', category: 'Web', icon: 'Globe', displayOrder: 2 },
    { name: 'React', category: 'Web', icon: 'Globe', displayOrder: 3 },
    { name: 'Next.js', category: 'Web', icon: 'Globe', displayOrder: 4 },
    { name: 'Tailwind CSS', category: 'Web', icon: 'Globe', displayOrder: 5 },
    { name: 'Laravel', category: 'Back-end', icon: 'Server', displayOrder: 1 },
    { name: 'Node.js', category: 'Back-end', icon: 'Server', displayOrder: 2 },
    { name: 'MySQL', category: 'Databases', icon: 'Database', displayOrder: 1 },
    { name: 'MongoDB', category: 'Databases', icon: 'Database', displayOrder: 2 },
    { name: 'AI Tools', category: 'AI & Automation', icon: 'Brain', displayOrder: 1 },
    { name: 'Workflow Automation', category: 'AI & Automation', icon: 'Brain', displayOrder: 2 },
    { name: 'API Integration', category: 'AI & Automation', icon: 'Brain', displayOrder: 3 },
    { name: 'WordPress', category: 'CMS', icon: 'Layout', displayOrder: 1 },
    { name: 'Elementor', category: 'CMS', icon: 'Layout', displayOrder: 2 },
    { name: 'Git', category: 'Tools & Cloud', icon: 'Cloud', displayOrder: 1 },
    { name: 'GitHub', category: 'Tools & Cloud', icon: 'Cloud', displayOrder: 2 },
    { name: 'Docker', category: 'Tools & Cloud', icon: 'Cloud', displayOrder: 3 },
    { name: 'VS Code', category: 'Tools & Cloud', icon: 'Cloud', displayOrder: 4 },
    { name: 'Oracle Cloud', category: 'Tools & Cloud', icon: 'Cloud', displayOrder: 5 },
    { name: 'Web Optimization', category: 'SEO', icon: 'Search', displayOrder: 1 },
  ];

  for (const s of skills) {
    await db.skill.create({ data: s });
  }
  console.log(`✅ ${skills.length} skills created`);

  // Create education
  const education = [
    {
      degree: 'Diplôme de Technicien Spécialisé',
      field: 'Développement Digital',
      institution: 'OFPPT',
      location: 'Oulad Teima',
      year: '2024',
      displayOrder: 1,
    },
    {
      degree: 'Baccalauréat',
      field: 'Sciences de la Vie et de la Terre',
      institution: 'Lycée Qualifiant Al Araar',
      location: 'Essaouira',
      year: '2020 – 2021',
      displayOrder: 2,
    },
  ];

  for (const e of education) {
    await db.education.create({ data: e });
  }
  console.log(`✅ ${education.length} education entries created`);

  // Create experience
  const experiences = [
    {
      title: 'DentClinic',
      description: 'Development of a dental clinic management application.',
      technologies: JSON.stringify(['Laravel', 'PHP', 'MySQL', 'FilamentPHP']),
      startDate: 'May 2026',
      endDate: 'June 2026',
      location: 'Oulad Teima, Morocco',
      displayOrder: 1,
    },
    {
      title: 'CRUD Étudiant',
      description: 'Development of a student management application.',
      technologies: JSON.stringify(['PHP', 'MySQL', 'HTML', 'CSS']),
      startDate: 'April 2025',
      endDate: 'May 2025',
      location: 'Oulad Teima, Morocco',
      displayOrder: 2,
    },
    {
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
    await db.experience.create({ data: exp });
  }
  console.log(`✅ ${experiences.length} experience entries created`);

  // Create languages
  const languages = [
    { name: 'Arabic', level: 'Native', displayOrder: 1 },
    { name: 'Amazigh', level: 'Native', displayOrder: 2 },
    { name: 'French', level: 'Intermediate', displayOrder: 3 },
    { name: 'English', level: 'Technical', displayOrder: 4 },
  ];

  for (const l of languages) {
    await db.language.create({ data: l });
  }
  console.log(`✅ ${languages.length} languages created`);

  // Create soft skills
  const softSkills = [
    { name: 'Project Management', icon: 'Calendar', displayOrder: 1 },
    { name: 'Teamwork', icon: 'Users', displayOrder: 2 },
    { name: 'Adaptability', icon: 'RefreshCw', displayOrder: 3 },
    { name: 'Problem Solving', icon: 'Lightbulb', displayOrder: 4 },
  ];

  for (const s of softSkills) {
    await db.softSkill.create({ data: s });
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
