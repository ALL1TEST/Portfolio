import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, a reset token has been generated.',
        token: null,
      });
    }

    // Generate reset token (32 bytes hex = 64 chars)
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await db.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    return NextResponse.json({
      message: 'Reset token generated successfully.',
      token: resetToken,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
