import { cn } from '@/lib/utils/cn';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label; also shown as text when fullScreen is true. */
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

const SIZE_STYLES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
};

export function Loader({ size = 'md', label = 'Loading', fullScreen = false, className }: LoaderProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <span
        role="status"
        aria-label={label}
        className={cn('inline-block animate-spin rounded-full border-zinc-200 border-t-violet-600', SIZE_STYLES[size], className)}
      />
      {fullScreen && label && <span className="text-sm text-zinc-500">{label}</span>}
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
      {spinner}
    </div>
  );
}
