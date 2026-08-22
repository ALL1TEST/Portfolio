'use client';

import { useEffect } from 'react';

export function updateBrowserFavicon(url: string) {
  if (typeof document === 'undefined' || !url) return;

  const versionedUrl = url.includes('?') ? `${url}&v=${Date.now()}` : `${url}?v=${Date.now()}`;

  // Remove existing icon links to prevent stale/default icon caching
  const existingLinks = document.querySelectorAll<HTMLLinkElement>(
    'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
  );
  existingLinks.forEach((el) => el.remove());

  // Find or create fresh icon links
  const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];
  rels.forEach((rel) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = versionedUrl;
    document.head.appendChild(link);
  });
}

export function DynamicFaviconSync({ initialLogoUrl }: { initialLogoUrl?: string }) {
  useEffect(() => {
    if (initialLogoUrl) {
      updateBrowserFavicon(initialLogoUrl);
    }

    const handleLogoUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ logoUrl?: string }>;
      if (customEvent.detail?.logoUrl) {
        updateBrowserFavicon(customEvent.detail.logoUrl);
      }
    };

    window.addEventListener('logo-updated', handleLogoUpdate);
    return () => {
      window.removeEventListener('logo-updated', handleLogoUpdate);
    };
  }, [initialLogoUrl]);

  return null;
}
