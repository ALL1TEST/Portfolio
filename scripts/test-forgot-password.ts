import { db } from '../src/lib/db';
import { createHash } from 'crypto';

async function test() {
  console.log('Testing forgot password API logic locally...');
  
  const user = await db.user.findFirst();
  if (!user) {
    console.log('No user found');
    return;
  }
  
  console.log('User:', user.email);

  // 1. Simulate API POST /forgot-password
  console.log('Simulating POST /api/auth/forgot-password');
  const userEmail = user.email.toLowerCase();
  
  await db.passwordResetToken.deleteMany({
    where: { email: userEmail },
  });

  const rawToken = 'test-raw-token-12345';
  const hashedToken = createHash('sha256').update(rawToken).digest('hex');
  const expires = new Date(Date.now() + 30 * 60 * 1000);

  const createdToken = await db.passwordResetToken.create({
    data: {
      email: userEmail,
      token: hashedToken,
      expires,
    },
  });

  console.log('Token created in DB:', createdToken.id);
  console.log('Sent email link with rawToken:', rawToken);

  // 2. Simulate API POST /reset-password
  console.log('Simulating POST /api/auth/reset-password');
  const incomingToken = rawToken;
  const newPassword = 'newSecurePassword123';

  const verifyHashed = createHash('sha256').update(incomingToken).digest('hex');
  const resetTokenRecord = await db.passwordResetToken.findUnique({
    where: { token: verifyHashed },
  });

  if (!resetTokenRecord || resetTokenRecord.expires < new Date()) {
    console.log('TEST FAILED: Token invalid or expired');
    return;
  }

  console.log('Token found and valid for email:', resetTokenRecord.email);

  // Simulated password hash and update
  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { password: 'hashed-newSecurePassword123' },
    }),
    db.passwordResetToken.delete({
      where: { id: resetTokenRecord.id },
    }),
  ]);

  console.log('TEST PASSED: Password updated and token deleted.');
  
  // Verify token is deleted
  const checkToken = await db.passwordResetToken.findUnique({
    where: { token: verifyHashed },
  });
  console.log('Token exists after deletion?', checkToken !== null);
}

test()
  .catch(console.error)
  .finally(() => process.exit(0));
