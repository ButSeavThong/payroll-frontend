import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const statusStyles = {
  default: 'bg-slate-100 text-slate-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const statusVariantMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  PAID: 'success',
  GENERATED: 'warning',
  ACTIVE: 'success',
  INACTIVE: 'danger',
  CHECKED_IN: 'info',
  CHECKED_OUT: 'warning',
  COMPLETED: 'success',
  ABSENT: 'danger',
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const v = variant || statusVariantMap[status] || 'default';
  
  const displayText = status
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <span className={cn('inline-block px-3 py-1 rounded-full text-xs font-medium', statusStyles[v])}>
      {displayText}
    </span>
  );
}
