import type { Metadata } from 'next';
import { SiteLayout } from '@/components/site-layout';
import { Hero } from '@/components/hero';
import { TechMarquee } from '@/components/tech-marquee';
import { AchievementStats } from '@/components/achievement-stats';
import { AboutPreview } from '@/components/about-preview';
import { FeaturedProjects } from '@/components/featured-projects';
import { getProfile } from '@/lib/data-fetching';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const fullName = profile?.fullName ?? 'Abdellah Ait-Si';
  const brandName = profile?.brandName ?? 'CodeVirtox';
  const title = `${brandName} | ${fullName} - Full Stack Developer Portfolio`;
  const description =
    profile?.shortBio ??
    'CodeVirtox is the personal developer portfolio and professional brand of Abdellah Ait-Si. Explore full-stack web applications, AI automation tools, certificates, and technical skills.';

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: 'https://www.codevirtox.dev',
    },
    openGraph: {
      title,
      description,
      url: 'https://www.codevirtox.dev',
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

export default function Home() {
  return (
    <SiteLayout>
      <Hero />
      <TechMarquee />
      <AchievementStats />
      <AboutPreview />
      <FeaturedProjects />
    </SiteLayout>
  );
}

