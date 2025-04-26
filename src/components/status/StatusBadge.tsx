
import { ExpiryStatus, STATUS_CONFIG, getStatusFromDays } from "@/types/status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status?: ExpiryStatus;
  daysToExpiry?: number | null;
  className?: string;
  showLabel?: boolean;
}

export function StatusBadge({
  status,
  daysToExpiry,
  className,
  showLabel = true,
}: StatusBadgeProps) {
  // If daysToExpiry is provided, use it to determine status
  const resolvedStatus = daysToExpiry !== undefined 
    ? getStatusFromDays(daysToExpiry) 
    : status || 'inactive';
  
  const config = STATUS_CONFIG[resolvedStatus];
  
  // Use a mapping function instead of string interpolation
  const getStatusClasses = (status: ExpiryStatus) => {
    switch (status) {
      case 'expired':
        return 'bg-status-expired text-status-expired-foreground';
      case 'urgent':
        return 'bg-status-urgent text-status-urgent-foreground';
      case 'warning':
        return 'bg-status-warning text-status-warning-foreground';
      case 'valid':
        return 'bg-status-valid text-status-valid-foreground';
      case 'inactive':
      default:
        return 'bg-status-inactive text-status-inactive-foreground';
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        getStatusClasses(resolvedStatus),
        className
      )}
    >
      {showLabel ? config.label : null}
    </div>
  );
}
