'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Auto-dismiss after this many ms. Pass 0 to require manual dismissal. */
  duration?: number;
}

interface ToastRecord {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { border: string; icon: ReactNode }> = {
  info: { border: 'border-l-sky-500', icon: <InfoIcon className="h-5 w-5 text-sky-500" /> },
  success: { border: 'border-l-emerald-500', icon: <CheckCircleIcon className="h-5 w-5 text-emerald-500" /> },
  warning: { border: 'border-l-amber-500', icon: <AlertTriangleIcon className="h-5 w-5 text-amber-500" /> },
  error: { border: 'border-l-rose-500', icon: <AlertTriangleIcon className="h-5 w-5 text-rose-500" /> },
};

/** Wrap the app (or a layout) in this once — e.g. in src/app/layout.tsx. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(({ title, description, variant = 'info', duration = 5000 }: ToastOptions) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end">
            {toasts.map((item) => (
              <ToastCard key={item.id} {...item} onDismiss={() => dismiss(item.id)} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

/** Call toast({ title, description, variant }) from any client component under ToastProvider. */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastCardProps extends ToastRecord {
  onDismiss: () => void;
}

function ToastCard({ title, description, variant, duration, onDismiss }: ToastCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(handleDismiss, duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  function handleDismiss() {
    setIsVisible(false);
    setTimeout(onDismiss, 150);
  }

  const { border, icon } = VARIANT_STYLES[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border-l-4 bg-white p-4 shadow-lg',
        'transition-all duration-150 ease-out',
        border,
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      )}
    >
      <div className="flex-shrink-0 pt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-900">{title}</p>
        {description && <p className="mt-0.5 text-sm text-zinc-500">{description}</p>}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="flex-shrink-0 rounded text-zinc-400 transition-colors duration-150 hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v4.5M10 6.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M8.68 3.5c.57-1 2.07-1 2.64 0l6.14 10.75c.57 1-.15 2.25-1.32 2.25H3.86c-1.17 0-1.89-1.25-1.32-2.25L8.68 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 8v3.25M10 13.75h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
