import { withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const POST = withAuth(async (req: Request) => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase environment variables are missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const body = await req.json();
    const filePath = body.filePath;
    
    console.log(`[DELETE_API] Received request to delete filePath: ${filePath}`);

    if (!filePath) {
      console.log('[DELETE_API] Error: File path is required');
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.storage
      .from('uploads')
      .remove([filePath]);

    if (error) {
      console.error('[DELETE_API] Supabase delete error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('[DELETE_API] Supabase response: success', data);

    return NextResponse.json({
      success: true,
      deleted: data,
    });

  } catch (error: any) {
    console.error('[DELETE_API] Catch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete file' },
      { status: 500 }
    );
  }
});
