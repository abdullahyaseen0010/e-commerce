'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils/cn';

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  /** Controlled value. Omit and use defaultValue for uncontrolled usage. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Custom listbox-style dropdown (for cases a native <select> can't
 * style consistently — e.g. sort/filter controls). Supports arrow-key
 * navigation, Home/End, Escape-to-close-and-refocus, and closes on
 * outside click.
 */
export function Dropdown({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  className,
}: DropdownProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  const selectedValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const currentIndex = options.findIndex((option) => option.value === selectedValue);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      listRef.current?.focus();
    }
    // Only re-run when open state flips — not on every value/options change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function closeAndRefocus() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function selectOption(option: DropdownOption) {
    if (option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onChange?.(option.value);
    closeAndRefocus();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      setIsOpen(true);
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setHighlightedIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (options[highlightedIndex]) selectOption(options[highlightedIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        closeAndRefocus();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)} ref={containerRef}>
      {label && (
        <span id={`${id}-label`} className="text-sm font-medium text-zinc-900">
          {label}
        </span>
      )}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${id}-label` : undefined}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-sm',
            'transition-colors duration-150 ease-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            error
              ? 'border-rose-400 focus-visible:ring-rose-500'
              : 'border-zinc-300 focus-visible:ring-violet-500',
            disabled && 'cursor-not-allowed bg-zinc-100 text-zinc-400'
          )}
        >
          <span className={cn('truncate', !selectedOption && 'text-zinc-400')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 flex-shrink-0 text-zinc-400 transition-transform duration-150',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={label ? `${id}-label` : undefined}
            onKeyDown={handleListKeyDown}
            className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg focus:outline-none"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === selectedValue}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  'flex cursor-pointer items-center justify-between px-3 py-2 text-sm',
                  option.disabled && 'cursor-not-allowed text-zinc-300',
                  !option.disabled && index === highlightedIndex && 'bg-violet-50 text-violet-700',
                  !option.disabled && index !== highlightedIndex && 'text-zinc-900'
                )}
              >
                {option.label}
                {option.value === selectedValue && <CheckIcon className="h-4 w-4 flex-shrink-0" />}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
