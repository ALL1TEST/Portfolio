import type { Metadata } from 'next';
import { SiteLayout } from '@/components/site-layout';
import { ContactSection } from '@/components/contact-section';
import { getProfile } from '@/lib/data-fetching';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const fullName = profile?.fullName ?? 'Abdellah Ait-Si';
  const brandName = profile?.brandName ?? 'CodeVirtox';
  const title = `Contact | ${brandName} - ${fullName}`;
  const description =
    profile?.contactPageDescription ||
    `Get in touch with ${fullName} at ${brandName} for full-stack web development, React and Laravel projects, and AI automation inquiries.`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      `Contact ${fullName}`,
      `Contact ${brandName}`,
      'Hire Full Stack Developer',
      'Web Developer Morocco Contact',
      'React Developer Contact',
      'Laravel Developer Contact',
    ],
    alternates: {
      canonical: 'https://www.codevirtox.dev/contact',
    },
    openGraph: {
      title,
      description,
      url: 'https://www.codevirtox.dev/contact',
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

export default function ContactPage() {
  return (
    <SiteLayout>
      <ContactSection />
    </SiteLayout>
  );
}

