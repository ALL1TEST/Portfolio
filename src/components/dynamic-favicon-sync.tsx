'use client';

import { useEffect } from 'react';

export function updateBrowserFavicon(url: string) {
  if (typeof document === 'undefined' || !url) return;

  const versionedUrl = url.includes('?') ? `${url}&v=${Date.now()}` : `${url}?v=${Date.now()}`;

  // Find or create icon links
  const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];
  rels.forEach((rel) => {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = versionedUrl;
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
