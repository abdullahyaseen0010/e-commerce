import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Generic empty/zero-state block — pass contextual copy per use (empty cart, no results, etc). */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-200 px-6 py-16 text-center',
        className
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">{icon}</div>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
        {description && <p className="max-w-sm text-sm text-zinc-500">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
