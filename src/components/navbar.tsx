'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Instagram } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/', num: '01' },
  { label: 'Projects', href: '/projects', num: '02' },
  { label: 'Certificates', href: '/certificates', num: '03' },
  { label: 'Resume', href: '/resume', num: '04' },
  { label: 'Contact', href: '/contact', num: '05' },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/CodeVirtox', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abdellahaitsi-dev/', icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/dev.abdellah/', icon: Instagram },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    const handler = () => setIsMobileMenuOpen(false);
    handler();
  }, [pathname]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const openMobileMenu = () => setIsMobileMenuOpen(true);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    closeMobileMenu();
    // Use router.push for client-side navigation after menu closes
    router.push(href);
  }, [closeMobileMenu, router]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delayChildren: 0.15, staggerChildren: 0.07 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-dark/80 backdrop-blur-xl border-b border-stroke/50'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Brand */}
            <Link href="/" className="relative z-10 group/logo" onClick={closeMobileMenu}>
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-baseline"
              >
                <span className="text-[1.35rem] lg:text-[1.6rem] font-bold text-white tracking-[-0.02em]">
                  Code
                </span>
                <span className="text-[1.35rem] lg:text-[1.6rem] font-bold tracking-[-0.02em] text-brand drop-shadow-[0_0_8px_rgba(255,57,0,0.35)] transition-all duration-300 group-hover/logo:drop-shadow-[0_0_14px_rgba(255,57,0,0.55)]">
                  Virtox
                </span>
                <span className="text-[1.35rem] lg:text-[1.6rem] font-bold tracking-[-0.02em] text-brand/80 drop-shadow-[0_0_8px_rgba(255,57,0,0.35)] transition-all duration-300 group-hover/logo:drop-shadow-[0_0_14px_rgba(255,57,0,0.55)]">
                  .
                </span>
              </motion.span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-gradient-to-r from-brand via-brand/60 to-transparent group-hover/logo:w-full transition-all duration-500 ease-out" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                      isActive
                        ? 'text-white'
                        : 'text-muted-text hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 bg-surface rounded-lg border border-stroke/50"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden relative z-[60] p-2.5 text-white rounded-lg hover:bg-surface/50 transition-colors duration-200"
              onClick={openMobileMenu}
              whileTap={{ scale: 0.9 }}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.8} />
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[55] md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-dark/90 backdrop-blur-2xl"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Close button — top right */}
            <button
              onClick={closeMobileMenu}
              className="absolute top-5 right-4 z-[65] w-11 h-11 flex items-center justify-center rounded-full border border-stroke/60 text-white/70 hover:text-white hover:border-brand/50 hover:bg-surface/50 transition-all duration-300"
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={1.8} />
            </button>

            {/* Content */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-[60] flex flex-col justify-center h-full px-8 sm:px-12"
            >
              {/* Navigation items */}
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.button
                      key={link.href}
                      variants={itemVariants}
                      onClick={() => handleNavClick(link.href)}
                      className={`group/item w-full text-left flex items-center gap-4 py-4 px-4 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-brand/10 border border-brand/20'
                          : 'border border-transparent hover:bg-surface/40 hover:border-stroke/30'
                      }`}
                    >
                      <span className={`text-xs font-mono tracking-wider transition-colors duration-300 ${
                        isActive ? 'text-brand' : 'text-muted-text/60 group-hover/item:text-muted-text'
                      }`}>
                        {link.num}
                      </span>
                      <span className={`text-2xl sm:text-3xl font-bold tracking-[-0.02em] transition-colors duration-300 ${
                        isActive
                          ? 'text-brand'
                          : 'text-white group-hover/item:text-brand/90'
                      }`}>
                        {link.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="mobile-nav-active"
                          className="ml-auto w-2 h-2 rounded-full bg-brand"
                          style={{ boxShadow: '0 0 8px rgba(255,57,0,0.5)' }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Divider */}
              <motion.div
                variants={itemVariants}
                className="mt-10 mb-8 h-px bg-gradient-to-r from-transparent via-stroke/50 to-transparent"
              />

              {/* Social links */}
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-stroke/50 text-muted-text hover:text-white hover:border-brand/50 hover:bg-brand/5 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={18} strokeWidth={1.6} />
                  </a>
                ))}
              </motion.div>

              {/* Bottom branding */}
              <motion.div variants={itemVariants} className="mt-auto pb-8">
                <p className="text-xs text-muted-text/40 tracking-wider uppercase">
                  © {new Date().getFullYear()} Abdellah Ait-Si
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
