'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// TODO: swap this stub for the real call once src/lib/api/auth.ts exists.
// Expected contract: resetPassword(token: string, newPassword: string): Promise<void>
async function resetPassword(token: string, newPassword: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (!token) {
    throw new Error('This reset link is missing its token.');
  }
  void newPassword;
  // Simulated success — replace with a real fetch/axios call to your auth endpoint.
  return;
}

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  const labels = ['Too short', 'Needs more', 'Getting there', 'Strong', 'Excellent'];
  return { score, label: labels[score] };
}

const INK = '#1C1C1A';
const PAPER = '#FAFAF8';
const MUTED = '#6B6B66';
const ACCENT = '#2F5233';
const BORDER = '#E4E3DC';
const ERROR = '#B3261E';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A11 11 0 0 1 12 5c7 0 11 7 11 7a17.7 17.7 0 0 1-3.4 4.2M6.5 6.7A17.5 17.5 0 0 0 1 12s4 7 11 7a10.6 10.6 0 0 0 4.2-.85" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === password;
  const passwordsMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-2xl border p-8 text-center" style={{ borderColor: BORDER, backgroundColor: '#FFFFFF' }}>
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: MUTED }}>
          Account recovery
        </p>
        <h1 className="mt-3 font-serif text-2xl" style={{ color: INK }}>
          This link isn&apos;t valid
        </h1>
        <p className="mt-3 text-sm leading-6" style={{ color: MUTED }}>
          Reset links expire after a while, or this one may have already been used. Request a new one to continue.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          Request a new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setStatus('error');
      setErrorMessage('Your password needs at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMessage("Those passwords don't match.");
      return;
    }

    setStatus('submitting');
    try {
      await resetPassword(token as string, password);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-md rounded-2xl border p-8 text-center" style={{ borderColor: BORDER, backgroundColor: '#FFFFFF' }}>
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
          Password updated
        </p>
        <h1 className="mt-3 font-serif text-2xl" style={{ color: INK }}>
          You&apos;re all set
        </h1>
        <p className="mt-3 text-sm leading-6" style={{ color: MUTED }}>
          Your password has been changed. Sign in with your new password to continue.
        </p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          Go to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border p-8" style={{ borderColor: BORDER, backgroundColor: '#FFFFFF' }}>
      <p className="text-xs uppercase tracking-[0.2em]" style={{ color: MUTED }}>
        Account recovery
      </p>
      <h1 className="mt-3 font-serif text-2xl" style={{ color: INK }}>
        Set a new password
      </h1>
      <p className="mt-2 text-sm leading-6" style={{ color: MUTED }}>
        Choose something you haven&apos;t used before on VISAC.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
        <div>
          <label htmlFor="password" className="block text-sm font-medium" style={{ color: INK }}>
            New password
          </label>
          <div className="relative mt-1.5">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-lg border bg-transparent px-3.5 pr-11 text-sm outline-none transition-colors focus:border-[#2F5233]"
              style={{ borderColor: BORDER, color: INK }}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: MUTED }}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-1 flex-1 rounded-full transition-colors"
                    style={{ backgroundColor: i < strength.score ? ACCENT : BORDER }}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs" style={{ color: MUTED }}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: INK }}>
            Confirm password
          </label>
          <div className="relative mt-1.5">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 w-full rounded-lg border bg-transparent px-3.5 pr-11 text-sm outline-none transition-colors"
              style={{ borderColor: passwordsMismatch ? ERROR : BORDER, color: INK }}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: MUTED }}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {passwordsMatch && (
            <p className="mt-1.5 text-xs" style={{ color: ACCENT }}>
              Passwords match.
            </p>
          )}
          {passwordsMismatch && (
            <p className="mt-1.5 text-xs" style={{ color: ERROR }}>
              Passwords don&apos;t match yet.
            </p>
          )}
        </div>

        <div aria-live="polite">
          {status === 'error' && errorMessage && (
            <p className="text-sm" style={{ color: ERROR }}>
              {errorMessage}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: ACCENT }}
        >
          {status === 'submitting' ? 'Updating password…' : 'Update password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: MUTED }}>
        Remembered it after all?{' '}
        <Link href="/login" className="font-medium underline" style={{ color: INK }}>
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="w-full max-w-md rounded-2xl border p-8" style={{ borderColor: BORDER, backgroundColor: '#FFFFFF' }}>
      <div className="h-3 w-28 animate-pulse rounded" style={{ backgroundColor: BORDER }} />
      <div className="mt-4 h-7 w-48 animate-pulse rounded" style={{ backgroundColor: BORDER }} />
      <div className="mt-6 h-11 w-full animate-pulse rounded-lg" style={{ backgroundColor: BORDER }} />
      <div className="mt-4 h-11 w-full animate-pulse rounded-lg" style={{ backgroundColor: BORDER }} />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16" style={{ backgroundColor: PAPER }}>
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
