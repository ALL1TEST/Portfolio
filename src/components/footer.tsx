'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Instagram } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useData } from '@/lib/data-provider';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  const { profile } = useData();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-stroke/30 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <ScrollReveal direction="up" delay={0}>
            <div>
              <Link
                href="/"
                className="flex items-center gap-2.5 mb-4 group/flogo min-w-0"
              >
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="object-contain h-10 w-auto lg:h-12 transition-transform duration-300 group-hover/flogo:scale-105"
                />
                <span className="text-xl lg:text-2xl font-medium tracking-tight text-white/90">
                  {profile?.brandName || 'CodeVirtox'}
                </span>
              </Link>
              <p className="text-sm text-muted-text leading-relaxed max-w-xs">
                {profile?.shortBio || 'Full Stack Developer building modern web applications and smart automated solutions.'}
              </p>
              <div className="flex items-center gap-3 mt-4">
                {profile?.githubUrl ? (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-stroke/50 text-muted-text hover:text-white hover:border-brand/50 transition-all"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                ) : (
                  <a href="https://github.com/CodeVirtox" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-stroke/50 text-muted-text hover:text-white hover:border-brand/50 transition-all" aria-label="GitHub">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile?.linkedinUrl ? (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-stroke/50 text-muted-text hover:text-white hover:border-brand/50 transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                ) : (
                  <a href="https://www.linkedin.com/in/abdellahaitsi-dev/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-stroke/50 text-muted-text hover:text-white hover:border-brand/50 transition-all" aria-label="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                <a
                  href="https://www.instagram.com/dev.abdellah/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-stroke/50 text-muted-text hover:text-white hover:border-brand/50 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Navigation */}
          <ScrollReveal direction="up" delay={0.1}>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-text mb-4">
                Navigation
              </h4>
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-muted-text hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </ScrollReveal>

          {/* Back to Top */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="flex flex-col items-start md:items-end justify-between h-full">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text mb-4">
                  Quick Action
                </p>
                <motion.button
                  onClick={scrollToTop}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-surface border border-stroke rounded-lg hover:border-brand/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
                  Back to Top
                </motion.button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stroke/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-text">
            © {new Date().getFullYear()} {profile?.fullName || 'Abdellah Ait-Si'}. All rights reserved.
          </p>
          <p className="text-xs text-muted-text">
            Designed & Built by {profile?.brandName || 'CodeVirtox'}
          </p>
        </div>
      </div>
    </footer>
  );
}
