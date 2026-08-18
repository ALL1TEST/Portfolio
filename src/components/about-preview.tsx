import Image from 'next/image';
import Link from 'next/link';
import { SlideFillButton } from '@/components/ui/slide-fill-button';
import { SectionHeading } from './section-heading';
import { ScrollReveal } from './scroll-reveal';
import { getProfile } from '@/lib/data-fetching';

// Default cards used when profile data is empty
const DEFAULT_CARDS = [
  {
    number: '01',
    title: 'Build & Develop',
    description:
      'Creating modern, responsive, and scalable web applications using technologies such as React, Laravel, Next.js, and MySQL.',
  },
  {
    number: '02',
    title: 'AI & Automation',
    description:
      'Building intelligent workflows and automation solutions that simplify repetitive tasks and improve productivity.',
  },
  {
    number: '03',
    title: 'Learn & Improve',
    description:
      'Continuously exploring new technologies, improving my skills, and building better digital products.',
  },
] as const;

export async function AboutPreview() {
  const profile = await getProfile();

  // Build cards: when profile exists use its data (filter out empty cards);
  // when no profile exists use hardcoded defaults
  const allCards = profile
    ? [
        { number: '01', title: profile.aboutCard1Title || '', description: profile.aboutCard1Description || '' },
        { number: '02', title: profile.aboutCard2Title || '', description: profile.aboutCard2Description || '' },
        { number: '03', title: profile.aboutCard3Title || '', description: profile.aboutCard3Description || '' },
      ].filter((c) => c.title.trim() !== '')
    : DEFAULT_CARDS.map((c) => ({ ...c }));

  // Re-number cards after filtering
  const valueCards = allCards.map((c, i) => ({ ...c, number: String(i + 1).padStart(2, '0') }));

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Who I Am" align="center" />

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Profile Image ── */}
          <ScrollReveal direction="left">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-surface rounded-2xl border border-stroke/50 overflow-hidden shadow-[inset_0_0_60px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center">
                {profile?.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={profile?.fullName || 'Abdellah Ait-Si'}
                    fill
                    sizes="(max-width: 768px) 100vw, 448px"
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-dark/50 text-muted-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                )}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_80px_rgba(0,0,0,0.6),inset_0_0_30px_rgba(0,0,0,0.4),inset_0_-20px_40px_rgba(255,57,0,0.08)] pointer-events-none" />
              </div>
            </div>
          </ScrollReveal>

          {/* ── Content Side ── */}
          <div>
            {/* Intro Label */}
            <ScrollReveal direction="right" delay={0.1}>
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                A bit about me
              </span>
            </ScrollReveal>

            {/* Intro Paragraph — from profile data, only show if non-empty */}
            {(profile?.aboutText || !profile) && (
              <ScrollReveal direction="right" delay={0.15}>
                <p className="text-base lg:text-lg text-muted-text leading-relaxed whitespace-pre-line">
                  {profile?.aboutText || 'I\'m a Full-Stack Developer focused on building modern, scalable web applications and intelligent automation solutions. I enjoy turning complex ideas into clean, efficient, and user-friendly digital experiences.'}
                </p>
              </ScrollReveal>
            )}

            {/* Value Cards */}
            <div className="mt-8 space-y-4">
              {valueCards.map((card, i) => (
                <ScrollReveal key={card.number} direction="right" delay={0.2 + i * 0.1}>
                  <div className="group relative flex gap-4 p-4 bg-surface/50 border border-stroke/30 rounded-xl transition-colors duration-300 hover:border-stroke/60 hover:bg-surface/70">
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-brand/40 transition-all duration-300 group-hover:bg-brand group-hover:top-2 group-hover:bottom-2" />

                    {/* Number */}
                    <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-brand/10 text-brand font-bold text-sm tracking-tight transition-colors duration-300 group-hover:bg-brand/15">
                      {card.number}
                    </span>

                    {/* Content */}
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-text/80">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* CTA Button */}
            <ScrollReveal direction="right" delay={0.5}>
              <div className="mt-8">
                <Link href="/resume">
                  <SlideFillButton
                    label="Learn More"
                    variant="secondary"
                  />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
