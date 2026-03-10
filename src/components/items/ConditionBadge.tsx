'use client';

import { cn } from '@/lib/utils';
import type { Condition } from '@/models/types';

interface ConditionBadgeProps {
  condition: Condition;
  size?: 'sm' | 'md';
  className?: string;
}

const conditionStyles: Record<Condition, { bg: string; text: string; label: string }> = {
  NEW: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'New',
  },
  LIKE_NEW: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    label: 'Like New',
  },
  GOOD: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Good',
  },
  FAIR: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Fair',
  },
  POOR: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Poor',
  },
};

export function ConditionBadge({
  condition,
  size = 'md',
  className,
}: ConditionBadgeProps) {
  const style = conditionStyles[condition];
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        style.bg,
        style.text,
        sizeClasses[size],
        className
      )}
    >
      {style.label}
    </span>
  );
}
