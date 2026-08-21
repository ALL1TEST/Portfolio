import type { Metadata } from 'next';
import { SiteLayout } from '@/components/site-layout';
import { CertificatesSection } from '@/components/certificates-section';
import { EducationSection } from '@/components/education-section';
import { getProfile } from '@/lib/data-fetching';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const fullName = profile?.fullName ?? 'Abdellah Ait-Si';
  const brandName = profile?.brandName ?? 'CodeVirtox';
  const title = `Certificates & Credentials | ${brandName} - ${fullName}`;
  const description =
    profile?.certificatesPageDescription ||
    `Professional software development certifications, database credentials, and academic education completed by ${fullName} at ${brandName}.`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      `${brandName} Certificates`,
      `${fullName} Certificates`,
      'Full Stack Developer Certifications',
      'Web Development Credentials',
      'Database Certifications',
      'Software Engineering Training',
    ],
    alternates: {
      canonical: 'https://www.codevirtox.dev/certificates',
    },
    openGraph: {
      title,
      description,
      url: 'https://www.codevirtox.dev/certificates',
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

export default function CertificatesPage() {
  return (
    <SiteLayout>
      <CertificatesSection />
      <EducationSection />
    </SiteLayout>
  );
}

