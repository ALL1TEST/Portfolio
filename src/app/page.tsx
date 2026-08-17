import { SiteLayout } from '@/components/site-layout';
import { Hero } from '@/components/hero';
import { TechMarquee } from '@/components/tech-marquee';
import { AchievementStats } from '@/components/achievement-stats';
import { AboutPreview } from '@/components/about-preview';
import { FeaturedProjects } from '@/components/featured-projects';

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
