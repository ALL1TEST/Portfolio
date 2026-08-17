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

export const POST = withAuth(async (req: Request) => {
  try {
    // Initialize Supabase client for backend usage inside the request handler 
    // to avoid failing the Next.js build process when environment variables are not set locally.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

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
    let { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    // If bucket doesn't exist, try to create it and retry upload
    if (uploadError && (uploadError.message.includes('not found') || uploadError.message.includes('NoSuchBucket'))) {
      console.log('Bucket not found, attempting to create public bucket "uploads"...');
      const { error: createBucketError } = await supabase.storage.createBucket('uploads', {
        public: true,
      });
      
      if (createBucketError && !createBucketError.message.includes('already exists')) {
        console.error('Failed to create bucket:', createBucketError);
        return NextResponse.json({ error: 'Storage not initialized. Failed to create bucket: ' + createBucketError.message }, { status: 500 });
      }

      // Retry upload after bucket creation
      const retryUpload = await supabase.storage
        .from('uploads')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });
      uploadError = retryUpload.error;
    }

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message || 'Failed to upload to Supabase' }, { status: 500 });
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
