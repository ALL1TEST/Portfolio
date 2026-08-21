import { DataProvider } from '@/lib/data-provider';
import { Navbar } from '@/components/navbar';
import { AnimatedBackground } from '@/components/animated-background';
import { Footer } from '@/components/footer';
import { getProfile, getProjects, getCertificates, getSkills, getResume } from '@/lib/data-fetching';

export async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Execute sequentially to prevent Prisma connection pool timeouts when connection_limit=1
  const profile = await getProfile();
  const projects = await getProjects();
  const certificates = await getCertificates();
  const skills = await getSkills();
  const resume = await getResume();

  const initialData = {
    profile,
    projects,
    certificates,
    skills,
    education: resume.education,
    experiences: resume.experience,
    languages: resume.languages,
    softSkills: resume.softSkills,
  };

  return (
    <DataProvider initialData={initialData}>
      <div className="relative min-h-screen bg-dark">
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer profile={profile} />
      </div>
    </DataProvider>
  );
}
