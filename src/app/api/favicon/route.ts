import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const profile = await prisma.profile.findFirst({
      select: { logoUrl: true, updatedAt: true },
    });

    const targetUrl = profile?.logoUrl || '/logo.png';

    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      return NextResponse.redirect(targetUrl, {
        status: 307,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
        },
      });
    }

    const { origin } = new URL(req.url);
    return NextResponse.redirect(new URL('/logo.png', origin), {
      status: 307,
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    const { origin } = new URL(req.url);
    return NextResponse.redirect(new URL('/logo.png', origin), 307);
  }
}
