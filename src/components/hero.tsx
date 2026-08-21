import Link from 'next/link';
import { SlideFillButton } from '@/components/ui/slide-fill-button';
import { HeroEffects } from './hero-effects';
import { getProfile } from '@/lib/data-fetching';

export async function Hero() {
  const profile = await getProfile();

  const fullName = profile?.fullName ?? 'ABDELLAH AIT-SI';
  const parts = fullName.split(' ');
  const firstName = parts[0] || 'ABDELLAH';
  const lastName = parts.slice(1).join(' ') || 'AIT-SI';

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <HeroEffects />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          aria-label={`${fullName} - ${profile?.brandName ?? 'CodeVirtox'} Full Stack Developer`}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-none"
        >
          <span>{firstName}</span>
          <br />
          <span className="text-brand">
            {lastName}
          </span>
        </h1>

        <div className="mt-6">
          <p className="text-lg sm:text-xl md:text-2xl font-light text-white/80 tracking-wide">
            {profile?.professionalTitle?.split('|').map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="text-brand mx-3">|</span>}
                {part.trim()}
              </span>
            )) || 'Full Stack Developer | AI & Automation'}
          </p>
        </div>

        <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base text-muted-text leading-relaxed">
          {profile?.shortBio ?? 'I build modern web applications, scalable backend systems, and automation solutions that help turn ideas into reliable digital products.'}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/projects">
            <SlideFillButton
              label="View My Work"
              variant="primary"
            />
          </Link>

          <Link href="/contact">
            <SlideFillButton
              label="Contact Me"
              variant="secondary"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
