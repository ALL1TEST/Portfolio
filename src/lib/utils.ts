import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractStoragePath(url: string | null | undefined): string | null {
  if (!url) {
    console.log('[STORAGE_PATH] Value is null/empty');
    return null;
  }
  
  try {
    const parsed = new URL(url);
    console.log('[STORAGE_PATH] Detected format: full Supabase URL');
    const uploadsIndex = parsed.pathname.indexOf('/uploads/');
    if (uploadsIndex !== -1) {
      const extracted = decodeURIComponent(parsed.pathname.substring(uploadsIndex + '/uploads/'.length));
      console.log(`[STORAGE_PATH] Extracted path: ${extracted}`);
      return extracted;
    }
  } catch (e) {
    console.log('[STORAGE_PATH] Detected format: relative or unknown format');
  }
  
  const marker = '/uploads/';
  const index = url.indexOf(marker);
  if (index !== -1) {
    const pathWithQuery = url.substring(index + marker.length);
    const pathOnly = pathWithQuery.split('?')[0].split('#')[0];
    const extracted = decodeURIComponent(pathOnly);
    console.log(`[STORAGE_PATH] Extracted path via string manipulation: ${extracted}`);
    return extracted;
  }
  
  console.log('[STORAGE_PATH] Failed to extract path from URL');
  return null;
}
