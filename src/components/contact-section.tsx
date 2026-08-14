'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';
import { useData } from '@/lib/data-provider';

export function ContactSection() {
  const { profile } = useData();

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Contact"
          title="Let's Build Something Great Together."
          description="Have a project in mind or just want to connect? I'd love to hear from you."
        />

        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <div className="p-8 lg:p-12 bg-surface/50 border border-stroke/30 rounded-2xl text-center">
              <motion.p
                className="text-lg text-muted-text leading-relaxed mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Ready to bring your ideas to life? Reach out through any of my channels below.
              </motion.p>

              {/* Social Links */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                {profile?.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-muted-text bg-dark/50 border border-stroke/30 rounded-xl hover:border-brand/30 hover:text-white transition-all duration-300"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-muted-text bg-dark/50 border border-stroke/30 rounded-xl hover:border-brand/30 hover:text-white transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                )}
                <a
                  href={`mailto:${profile?.email || 'contact@codevirtox.com'}`}
                  className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-brand/10 border border-brand/20 rounded-xl hover:bg-brand hover:border-brand transition-all duration-300"
                >
                  <span>Email Me</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
