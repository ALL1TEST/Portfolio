'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Instagram } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
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
                className="inline-flex items-baseline mb-4 group/flogo"
              >
                <span className="text-xl font-bold text-white tracking-[-0.02em]">
                  Code
                </span>
                <span className="text-xl font-bold tracking-[-0.02em] text-brand drop-shadow-[0_0_8px_rgba(255,57,0,0.35)] transition-all duration-300 group-hover/flogo:drop-shadow-[0_0_14px_rgba(255,57,0,0.55)]">
                  Virtox
                </span>
                <span className="text-xl font-bold tracking-[-0.02em] text-brand/80 drop-shadow-[0_0_8px_rgba(255,57,0,0.35)] transition-all duration-300 group-hover/flogo:drop-shadow-[0_0_14px_rgba(255,57,0,0.55)]">
                  .
                </span>
              </Link>
              <p className="text-sm text-muted-text leading-relaxed max-w-xs">
                Full Stack Developer building modern web applications and smart
                automated solutions.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="https://github.com/CodeVirtox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-stroke/50 text-muted-text hover:text-white hover:border-brand/50 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/abdellahaitsi-dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-stroke/50 text-muted-text hover:text-white hover:border-brand/50 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
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
            © {new Date().getFullYear()} Abdellah Ait-Si. All rights reserved.
          </p>
          <p className="text-xs text-muted-text">
            Designed & Built by CodeVirtox
          </p>
        </div>
      </div>
    </footer>
  );
}
