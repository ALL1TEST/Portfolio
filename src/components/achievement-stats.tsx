import { ScrollReveal } from './scroll-reveal';
import { getProfile } from '@/lib/data-fetching';

// Defaults used only when no profile exists at all
const DEFAULT_STATS = [
  { value: '6+', label: 'Certificates' },
  { value: '14+', label: 'Projects' },
  { value: '8+', label: 'Technologies' },
];

export async function AchievementStats() {
  const profile = await getProfile();

  // When profile exists, use its stat fields; filter out empty ones.
  // When no profile, use hardcoded defaults.
  const stats = profile
    ? [
        { value: profile.stat1Value, label: profile.stat1Label },
        { value: profile.stat2Value, label: profile.stat2Label },
        { value: profile.stat3Value, label: profile.stat3Label },
      ].filter((s) => s.value?.trim() !== '' || s.label?.trim() !== '')
    : DEFAULT_STATS;

  if (stats.length === 0) return null;

  return (
    <section className="relative py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-4 sm:gap-8 ${stats.length <= 3 ? 'grid-cols-3' : `grid-cols-${Math.min(stats.length, 4)}`}`}>
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label || index} delay={index * 0.1} direction="up">
              <div className="relative flex flex-col items-center text-center py-8 lg:py-10 px-4 transition-transform duration-300 hover:-translate-y-0.5">
                {index > 0 && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-stroke/40 hidden sm:block" />
                )}

                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-none">
                  {stat.value}
                </span>
                <span className="mt-2 text-xs sm:text-sm font-medium text-muted-text uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
