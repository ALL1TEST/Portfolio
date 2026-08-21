export interface JsonLdProfile {
  fullName?: string | null;
  brandName?: string | null;
  professionalTitle?: string | null;
  shortBio?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  logoUrl?: string | null;
  profileImage?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
}

export function generateRootJsonLd(profile: JsonLdProfile | null) {
  const baseUrl = 'https://www.codevirtox.dev';
  const fullName = profile?.fullName || 'Abdellah Ait-Si';
  const brandName = profile?.brandName || 'CodeVirtox';
  const logoUrl = profile?.logoUrl || `${baseUrl}/logo.png`;
  const profileImageUrl = profile?.profileImage || logoUrl;
  const description =
    profile?.shortBio ||
    'CodeVirtox is the personal developer portfolio and professional brand of Abdellah Ait-Si, a Full Stack Developer specializing in React, Next.js, Laravel, scalable web applications, and AI workflow automation.';

  const sameAs: string[] = [];
  if (profile?.githubUrl) sameAs.push(profile.githubUrl);
  if (profile?.linkedinUrl) sameAs.push(profile.linkedinUrl);
  if (profile?.twitterUrl) sameAs.push(profile.twitterUrl);
  if (profile?.instagramUrl) sameAs.push(profile.instagramUrl);

  const websiteSchema = {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: brandName,
    alternateName: [
      'Codevirtox',
      'CodeVirtox Portfolio',
      'CodeVirtox Developer Portfolio',
      `${fullName} Portfolio`,
      `${fullName} CodeVirtox`,
    ],
    description,
    inLanguage: 'en-US',
    publisher: {
      '@id': `${baseUrl}/#person`,
    },
  };

  const personSchema = {
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: fullName,
    alternateName: ['Abdellah Ait SI', 'Abdellah AitSi', 'CodeVirtox'],
    jobTitle: profile?.professionalTitle || 'Full Stack Web Developer | AI & Automation',
    url: baseUrl,
    image: profileImageUrl,
    description: `Abdellah Ait-Si is a Full Stack Developer and the creator of CodeVirtox, building modern web applications, scalable backend architectures with Laravel and React, and automated AI workflows.`,
    brand: {
      '@type': 'Brand',
      '@id': `${baseUrl}/#brand`,
      name: brandName,
      alternateName: ['Codevirtox'],
      url: baseUrl,
      logo: logoUrl,
    },
    knowsAbout: [
      'Full Stack Web Development',
      'React.js',
      'Next.js',
      'Laravel',
      'PHP',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'MySQL',
      'PostgreSQL',
      'Tailwind CSS',
      'AI Workflow Automation',
      'REST APIs',
      'Software Architecture',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile?.location?.split(',')[0]?.trim() || 'Oulad Teima',
      addressCountry: 'Morocco',
    },
    ...(sameAs.length > 0 && { sameAs }),
  };

  const profilePageSchema = {
    '@type': 'ProfilePage',
    '@id': `${baseUrl}/#profilepage`,
    url: baseUrl,
    name: `${brandName} | ${fullName} - Full Stack Developer Portfolio`,
    isPartOf: {
      '@id': `${baseUrl}/#website`,
    },
    about: {
      '@id': `${baseUrl}/#person`,
    },
    mainEntity: {
      '@id': `${baseUrl}/#person`,
    },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, personSchema, profilePageSchema],
  };
}
