import { revalidateTag as nextRevalidateTag, revalidatePath as nextRevalidatePath } from 'next/cache';

export function revalidateTag(tag: string) {
  try {
    (nextRevalidateTag as any)(tag);
  } catch (error) {
    console.error(`Failed to revalidate tag ${tag}:`, error);
  }
}

export function revalidatePath(path: string, type?: 'page' | 'layout') {
  try {
    if (type) {
      nextRevalidatePath(path, type);
    } else {
      nextRevalidatePath(path);
    }
  } catch (error) {
    console.error(`Failed to revalidate path ${path}:`, error);
  }
}
