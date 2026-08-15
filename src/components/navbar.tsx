'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Instagram } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
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
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: -8, transition: { duration: 0.2 } },
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
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center min-w-0"
              >
                <Image
                  src="/uploads/codevirtox-logo.png"
                  alt="CodeVirtox"
                  width={320}
                  height={80}
                  className="h-10 lg:h-12 w-auto object-contain block"
                  style={{ maxWidth: '100%' }}
                  priority
                />
              </motion.div>
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
              className="absolute top-5 right-4 z-[65] w-10 h-10 flex items-center justify-center rounded-full text-white/50 hover:text-white transition-colors duration-300"
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Content */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-[60] flex flex-col justify-center h-full px-10 sm:px-14"
            >
              {/* Navigation items */}
              <nav className="flex flex-col">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.button
                      key={link.href}
                      variants={itemVariants}
                      onClick={() => handleNavClick(link.href)}
                      className={`group/item w-full text-left py-3.5 transition-all duration-300 origin-left ${
                        isActive
                          ? 'translate-x-0'
                          : 'translate-x-0 group-hover/item:translate-x-1'
                      }`}
                    >
                      <span className={`text-lg sm:text-xl font-medium tracking-[-0.01em] transition-all duration-300 inline-flex items-center gap-3 ${
                        isActive
                          ? 'text-brand'
                          : 'text-white/70 group-hover/item:text-white/95 group-hover/item:pl-1'
                      }`}>
                        <span className="relative">
                          {link.label}
                          {isActive && (
                            <motion.span
                              layoutId="mobile-nav-indicator"
                              className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-brand"
                              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            />
                          )}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Divider */}
              <motion.div
                variants={itemVariants}
                className="mt-12 mb-6 h-px bg-gradient-to-r from-transparent via-stroke/40 to-transparent"
              />

              {/* Social links */}
              <motion.div variants={itemVariants} className="flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-muted-text/50 hover:text-white/80 transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={16} strokeWidth={1.5} />
                  </a>
                ))}
              </motion.div>

              {/* Bottom branding */}
              <motion.div variants={itemVariants} className="mt-auto pb-8">
                <p className="text-[11px] text-muted-text/30 tracking-wider uppercase">
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
