import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

type HandlerFn = (req: Request) => Promise<NextResponse>;

export function withAuth(handler: HandlerFn): HandlerFn {
  return async (req: Request) => {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(req);
  };
}

export function publicRoute(handler: HandlerFn): HandlerFn {
  return async (req: Request) => handler(req);
}
