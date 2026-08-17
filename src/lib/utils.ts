import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractStoragePath(url: string | null | undefined): string | null {
  if (!url) return null;
  
  try {
    const parsed = new URL(url);
    const uploadsIndex = parsed.pathname.indexOf('/uploads/');
    if (uploadsIndex !== -1) {
      return decodeURIComponent(parsed.pathname.substring(uploadsIndex + '/uploads/'.length));
    }
  } catch (e) {
    // Ignore invalid URL errors, fall through to string parsing
  }
  
  const marker = '/uploads/';
  const index = url.indexOf(marker);
  if (index !== -1) {
    const pathWithQuery = url.substring(index + marker.length);
    const pathOnly = pathWithQuery.split('?')[0].split('#')[0];
    return decodeURIComponent(pathOnly);
  }
  
  return null;
}
