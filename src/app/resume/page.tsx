import type { Metadata } from 'next';
import { SiteLayout } from '@/components/site-layout';
import { ResumeSection } from '@/components/resume-section';
import { getProfile } from '@/lib/data-fetching';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const fullName = profile?.fullName ?? 'Abdellah Ait-Si';
  const brandName = profile?.brandName ?? 'CodeVirtox';
  const title = `Resume & Technical Skills | ${brandName} - ${fullName}`;
  const description =
    profile?.resumeIntro ||
    `Professional resume, technical skills (React, Next.js, Laravel, MySQL), work experience, and educational background of ${fullName} at ${brandName}.`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      `${fullName} Resume`,
      `${brandName} Resume`,
      'Full Stack Developer CV',
      'React Developer Resume',
      'Laravel Developer Resume',
      `${fullName} Experience`,
      'Software Engineer Skills',
    ],
    alternates: {
      canonical: 'https://www.codevirtox.dev/resume',
    },
    openGraph: {
      title,
      description,
      url: 'https://www.codevirtox.dev/resume',
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

export default function ResumePage() {
  return (
    <SiteLayout>
      <ResumeSection />
    </SiteLayout>
  );
}

