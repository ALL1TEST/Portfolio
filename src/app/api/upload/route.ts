import { withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = [
  // Images
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  // PDFs
  'application/pdf',
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const POST = withAuth(async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images and PDFs are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || (file.type === 'application/pdf' ? '.pdf' : '.png');
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    // Determine subdirectory based on file type or category
    const category = (formData.get('category') as string) || '';
    let subDir: string;
    if (category === 'profile') {
      subDir = 'profile';
    } else if (file.type === 'application/pdf') {
      subDir = 'certificates';
    } else {
      subDir = 'projects';
    }
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${subDir}/${uniqueName}`;

    return NextResponse.json({ url, name: file.name, size: file.size, type: file.type });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
});
