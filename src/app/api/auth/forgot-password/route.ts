import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes, createHash } from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

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

    const userEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, a reset link has been sent.',
      });
    }

    // Delete any existing reset tokens for this email to ensure single-use uniqueness
    await prisma.passwordResetToken.deleteMany({
      where: { email: userEmail },
    });

    // Generate raw reset token (32 bytes hex = 64 chars)
    const rawToken = randomBytes(32).toString('hex');
    
    // Hash the token using SHA-256 before storing it in the database
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store the hashed token
    await prisma.passwordResetToken.create({
      data: {
        email: userEmail,
        token: hashedToken,
        expires: resetTokenExpiry,
      },
    });

    // Determine the base URL for the reset link using the request origin
    const baseUrl = new URL(request.url).origin;
    const resetUrl = `${baseUrl}/login?token=${rawToken}`;

    // Send the email containing the raw token
    await sendPasswordResetEmail(userEmail, resetUrl);

    return NextResponse.json({
      message: 'If an account exists with this email, a reset link has been sent.',
      success: true
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
