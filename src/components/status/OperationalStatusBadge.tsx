import { VehicleStatus, VEHICLE_STATUS_CONFIG } from "@/types/vehicle";
import { cn } from "@/lib/utils";

interface OperationalStatusBadgeProps {
  status: VehicleStatus;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function OperationalStatusBadge({
  status,
  className,
  showLabel = true,
  size = 'md'
}: OperationalStatusBadgeProps) {
  const config = VEHICLE_STATUS_CONFIG[status];
  
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          'bg-status-valid text-status-valid-foreground': status === 'active',
          'bg-status-warning text-status-warning-foreground': status === 'maintenance',
          'bg-status-inactive text-status-inactive-foreground': status === 'decommissioned',
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