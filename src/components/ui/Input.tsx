'use client';

import { InputHTMLAttributes, ReactNode, forwardRef, useId, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_STYLES = {
  sm: 'h-9 text-sm',
  md: 'h-11 text-sm',
  lg: 'h-12 text-base',
};

/**
 * Text input with label/error/helper text wired up via aria-describedby.
 * type="password" automatically gets a show/hide toggle.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    helperText,
    leftIcon,
    size = 'md',
    type = 'text',
    id,
    className,
    disabled,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;
  const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-900">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 flex h-5 w-5 items-center justify-center text-zinc-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'w-full rounded-lg border bg-white px-3 text-zinc-900 placeholder:text-zinc-400',
            'transition-colors duration-150 ease-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            error
              ? 'border-rose-400 focus-visible:ring-rose-500'
              : 'border-zinc-300 focus-visible:ring-violet-500',
            disabled && 'cursor-not-allowed bg-zinc-100 text-zinc-400',
            leftIcon && 'pl-10',
            isPassword && 'pr-10',
            SIZE_STYLES[size],
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 flex h-5 w-5 items-center justify-center text-zinc-400 hover:text-zinc-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-rose-600">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-sm text-zinc-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

function EyeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-full w-full" aria-hidden="true">
      <path
        d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-full w-full" aria-hidden="true">
      <path
        d="M2.5 2.5l15 15M8.28 8.34a2.25 2.25 0 003.13 3.24M6.35 6.4C3.78 7.7 1.5 10 1.5 10s3 6 8.5 6c1.4 0 2.63-.4 3.68-.98M11.9 4.32c.55-.13 1.11-.2 1.6-.2 5.5 0 8.5 6 8.5 6-.35.7-1.14 1.98-2.4 3.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
