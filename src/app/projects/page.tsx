import type { Metadata } from 'next';
import { SiteLayout } from '@/components/site-layout';
import { ProjectsSection } from '@/components/projects-section';
import { getProfile } from '@/lib/data-fetching';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const fullName = profile?.fullName ?? 'Abdellah Ait-Si';
  const brandName = profile?.brandName ?? 'CodeVirtox';
  const title = `Selected Projects | ${brandName} - ${fullName}`;
  const description =
    profile?.projectsPageDescription ||
    `Explore full-stack web applications, Laravel backend systems, React apps, and AI automation projects built by ${fullName} at ${brandName}.`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      `${brandName} Projects`,
      `${fullName} Projects`,
      'Full Stack Web Projects',
      'React Projects',
      'Next.js Portfolio',
      'Laravel Applications',
      'AI Automation Solutions',
      'Web Development Portfolio',
    ],
    alternates: {
      canonical: 'https://www.codevirtox.dev/projects',
    },
    openGraph: {
      title,
      description,
      url: 'https://www.codevirtox.dev/projects',
      siteName: brandName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function ProjectsPage() {
  return (
    <SiteLayout>
      <ProjectsSection />
    </SiteLayout>
  );
}

