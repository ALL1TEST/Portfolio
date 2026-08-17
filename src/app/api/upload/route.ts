import { withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_TYPES = [
  // Images
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  // PDFs
  'application/pdf',
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// Initialize Supabase client for backend usage
// This uses the service role key which bypasses RLS and allows uploading to the bucket
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

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

    // Determine file extension
    let ext = '';
    const lastDotIndex = file.name.lastIndexOf('.');
    if (lastDotIndex !== -1 && lastDotIndex !== 0) {
      ext = file.name.substring(lastDotIndex);
    } else {
      ext = file.type === 'application/pdf' ? '.pdf' : '.png';
    }

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // Determine subdirectory based on file type or category
    const category = (formData.get('category') as string) || '';
    let subDir: string;
    if (category === 'profile') {
      subDir = 'profile';
    } else if (category === 'cv') {
      subDir = 'cv';
    } else if (file.type === 'application/pdf') {
      subDir = 'certificates';
    } else {
      subDir = 'projects';
    }

    const filePath = `${subDir}/${uniqueName}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Generate public URL
    const { data: publicUrlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return NextResponse.json({ 
      url: publicUrlData.publicUrl, 
      name: file.name, 
      size: file.size, 
      type: file.type 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
});
