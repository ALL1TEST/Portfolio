import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hash } from 'bcryptjs';
import { createHash } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || typeof token !== 'string' || !token.trim()) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Hash the incoming raw token to compare with the database
    const hashedToken = createHash('sha256').update(token.trim()).digest('hex');

    // Find the valid token in the database
    const resetTokenRecord = await db.passwordResetToken.findUnique({
      where: {
        token: hashedToken,
      },
    });

    if (!resetTokenRecord || resetTokenRecord.expires < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new one.' },
        { status: 400 }
      );
    }

    // Ensure user still exists
    const user = await db.user.findUnique({
      where: { email: resetTokenRecord.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(password, 10);
    
    // Update user password and delete the reset token in a transaction
    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      db.passwordResetToken.delete({
        where: { id: resetTokenRecord.id },
      }),
    ]);

    return NextResponse.json({
      message: 'Password has been reset successfully. You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
