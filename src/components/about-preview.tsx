'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SlideFillButton } from '@/components/ui/slide-fill-button';
import { SectionHeading } from './section-heading';
import { ScrollReveal } from './scroll-reveal';
import { useData } from '@/lib/data-provider';

export function AboutPreview() {
  const { profile } = useData();
  const router = useRouter();

  const title = profile?.professionalTitle?.split('|')[0]?.trim() || 'Full Stack';
  const specialty = profile?.professionalTitle?.split('|')[1]?.trim() || 'AI & Automation';

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Who I Am" align="center" />

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-surface rounded-2xl border border-stroke/50 overflow-hidden">
                <Image
                  src="/uploads/ABDELLAH.png"
                  alt="Abdellah Ait-Si"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </ScrollReveal>

          <div>
            <ScrollReveal direction="right" delay={0.1}>
              <p className="text-base lg:text-lg text-muted-text leading-relaxed">
                {profile?.aboutText || 'Développeur Full Stack spécialisé en React, Laravel et MySQL, passionné par la création d\'applications web modernes. Intéressé par l\'intelligence artificielle, l\'automatisation et le développement de solutions innovantes.'}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: 'Focus', value: title },
                  { label: 'Specialty', value: specialty },
                  { label: 'Experience', value: '3+ Years' },
                  { label: 'Location', value: profile?.location || 'Morocco' },
                ].map((item) => (
                  <div key={item.label} className="p-4 bg-surface/50 border border-stroke/30 rounded-xl">
                    <p className="text-xs font-medium text-muted-text uppercase tracking-wider">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <div className="mt-6">
              <SlideFillButton
                label="Learn More"
                variant="secondary"
                onClick={() => router.push('/resume')}
              />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
