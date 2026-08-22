import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';
import { SlideFillButton } from '@/components/ui/slide-fill-button';
import { getProjects, getProfile } from '@/lib/data-fetching';
import { FeaturedProjectCard } from './featured-project-card';

export async function FeaturedProjects() {
  const projects = await getProjects();
  const profile = await getProfile();

  // Filter featured projects and sort by displayOrder
  const featuredProjects = projects
    .filter((p) => p.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Use profile data for section heading. When profile exists, use its values directly
  // (empty = intentionally cleared). When no profile, use defaults.
  const sectionTitle = profile ? (profile.featuredProjectsTitle || 'Featured Projects') : 'Featured Projects';
  const sectionDescription = profile
    ? (profile.featuredProjectsDescription || undefined)
    : 'A selection of projects showcasing my experience in full-stack development, web applications, automation, and problem-solving.';

  return (
    <section id="featured-projects" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Projects"
          labelStyle="skills"
          title={sectionTitle}
          description={sectionDescription}
        />

        {featuredProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-text">No featured projects yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {featuredProjects.map((project, index) => (
                <FeaturedProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {/* View All Projects CTA */}
            <ScrollReveal delay={0.3}>
              <div className="mt-12 lg:mt-16 text-center">
                <SlideFillButton
                  href="/projects"
                  label="View All Projects"
                  ariaLabel="View All Projects - Explore full portfolio of Abdellah Ait-Si"
                  variant="secondary"
                />
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </section>
  );
}
