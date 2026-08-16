'use client';

import { useState, useEffect, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RadialRevealButton from '@/components/ui/radial-reveal-button';
import { Loader2, ArrowRight, ArrowLeft, KeyRound, ShieldCheck, Mail } from 'lucide-react';

type View = 'login' | 'forgot-email' | 'forgot-reset';

export default function LoginPage() {
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const router = useRouter();
  const [profile, setProfile] = useState<{ logoUrl?: string; brandName?: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch {
        // Silently fail
      }
    };
    fetchProfile();
  }, []);

  const resetFormState = useCallback(() => {
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setResetToken('');
    setLoading(false);
  }, []);

  const switchView = useCallback((newView: View) => {
    resetFormState();
    setView(newView);
  }, [resetFormState]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials');
      } else {
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Check for reset token in URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        setResetToken(token);
        setView('forgot-reset');
      }
    }
  }, []);

  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Something went wrong');
        return;
      }

      if (data.success || data.message) {
        // Email sent successfully
        toast.success('If an account exists, a reset link has been sent to your email.');
        // Don't transition immediately, clear email and switch to login view
        setTimeout(() => {
          switchView('login');
        }, 3000);
      } else {
        toast.error('Failed to send reset link.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to reset password.');
        return;
      }

      toast.success('Password reset successfully! You can now sign in.');
      switchView('login');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  const direction = view === 'forgot-reset' ? 1 : view === 'login' ? -1 : 1;

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/3 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand header — centered logo */}
        <div className="flex justify-center mb-8">
          {(profile ? profile.logoUrl : '/logo.png') && (
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              src={profile ? profile.logoUrl : '/logo.png'}
              alt="Logo"
              className="object-contain h-16 w-auto"
            />
          )}
        </div>

        {/* Animated card container */}
        <div className="bg-surface border border-stroke rounded-xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {/* ────── LOGIN VIEW ────── */}
            {view === 'login' && (
              <motion.div
                key="login"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="p-6"
              >
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@codevirtox.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-dark border-stroke text-white placeholder:text-muted-text focus:border-brand focus:ring-brand/20"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-white">
                        Password
                      </Label>
                      <button
                        type="button"
                        onClick={() => switchView('forgot-email')}
                        className="text-xs text-brand hover:text-brand-light transition-colors duration-200"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-dark border-stroke text-white placeholder:text-muted-text focus:border-brand focus:ring-brand/20"
                      disabled={loading}
                    />
                  </div>

                  <div className="w-full flex justify-center pt-2">
                    {loading ? (
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      <RadialRevealButton
                        type="submit"
                        label="Sign In"
                        font={{
                          fontFamily: 'Inter',
                          fontWeight: 100,
                          fontSize: 16,
                          lineHeight: '1.5em',
                          letterSpacing: '0.05em',
                          textAlign: 'center',
                        }}
                        padding="12px 48px 12px 48px"
                        rounded={100}
                        style={{ width: '100%' }}
                        transition={{
                          type: 'tween',
                          ease: [0.6, -0.28, 0.735, 0.045],
                          delay: 0.45,
                          duration: 0.4,
                        }}
                      />
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {/* ────── FORGOT PASSWORD — EMAIL STEP ────── */}
            {view === 'forgot-email' && (
              <motion.div
                key="forgot-email"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Forgot Password</h2>
                    <p className="text-xs text-muted-text">Enter your email to reset your password</p>
                  </div>
                </div>

                <form onSubmit={handleForgotEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="text-sm font-medium text-white">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="admin@codevirtox.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-dark border-stroke text-white placeholder:text-muted-text focus:border-brand focus:ring-brand/20 pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand hover:bg-brand-light text-white font-medium h-11 relative overflow-hidden transition-all duration-300 group/btn"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </span>
                      <span className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/10 transition-colors duration-300" />
                    </Button>
                  </motion.div>
                </form>

                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-muted-text hover:text-white transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              </motion.div>
            )}

            {/* ────── FORGOT PASSWORD — RESET STEP ────── */}
            {view === 'forgot-reset' && (
              <motion.div
                key="forgot-reset"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Set New Password</h2>
                    <p className="text-xs text-muted-text">Create a strong password for your account</p>
                  </div>
                </div>

                {/* Info banner */}
                <div className="mb-5 p-3 rounded-lg bg-brand/5 border border-brand/20">
                  <p className="text-xs text-brand/80 leading-relaxed">
                    <span className="font-medium text-brand">Account verified.</span> Enter your new password below. The reset link expires in 30 minutes.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-sm font-medium text-white">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-dark border-stroke text-white placeholder:text-muted-text focus:border-brand focus:ring-brand/20"
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-text/60">Minimum 6 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-white">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-dark border-stroke text-white placeholder:text-muted-text focus:border-brand focus:ring-brand/20"
                      disabled={loading}
                    />
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-xs text-red-400">Passwords do not match</p>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      type="submit"
                      disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                      className="w-full bg-brand hover:bg-brand-light text-white font-medium h-11 relative overflow-hidden transition-all duration-300 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Resetting...
                          </>
                        ) : (
                          <>
                            Reset Password
                            <ShieldCheck className="w-4 h-4" />
                          </>
                        )}
                      </span>
                      <span className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/10 transition-colors duration-300" />
                    </Button>
                  </motion.div>
                </form>

                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-muted-text hover:text-white transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center text-muted-text text-xs mt-6"
          >
            {view === 'login' && 'Secured admin access'}
            {view === 'forgot-email' && 'Enter your account email to proceed'}
            {view === 'forgot-reset' && 'Set a new password for your account'}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
