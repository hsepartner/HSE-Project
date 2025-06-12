import { ExpiryStatus, STATUS_CONFIG, getStatusFromDays } from "@/types/status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status?: ExpiryStatus;
  daysToExpiry?: number | null;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function StatusBadge({
  status,
  daysToExpiry,
  className,
  showLabel = true,
  size = 'md'
}: StatusBadgeProps) {
  // If daysToExpiry is provided, use it to determine status
  const resolvedStatus = daysToExpiry !== undefined 
    ? getStatusFromDays(daysToExpiry) 
    : (status || 'inactive');
  
  const config = STATUS_CONFIG[resolvedStatus];
  
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          'bg-status-expired text-status-expired-foreground': resolvedStatus === 'expired',
          'bg-status-urgent text-status-urgent-foreground': resolvedStatus === 'urgent',
          'bg-status-warning text-status-warning-foreground': resolvedStatus === 'warning',
          'bg-status-valid text-status-valid-foreground': resolvedStatus === 'valid',
          'bg-status-inactive text-status-inactive-foreground': resolvedStatus === 'inactive',
          'px-2 py-0.5 text-[10px]': size === 'sm',
          'px-2.5 py-1': size === 'md',
        },
        className
      )}
    >
      {showLabel && config?.label}
    </div>
  );
}
