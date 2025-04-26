
import { ExpiryStatus, STATUS_CONFIG, getStatusFromDays } from "@/types/status";
import { cn } from "@/lib/utils";

interface StatusPillProps {
  status?: ExpiryStatus;
  daysToExpiry?: number | null;
  className?: string;
  showDays?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusPill({
  status,
  daysToExpiry,
  className,
  showDays = false,
  size = 'md',
}: StatusPillProps) {
  // If daysToExpiry is provided, use it to determine status
  const resolvedStatus = daysToExpiry !== undefined 
    ? getStatusFromDays(daysToExpiry) 
    : status || 'inactive';
  
  const config = STATUS_CONFIG[resolvedStatus];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium border",
        `bg-${config.color}/10 text-${config.color} border-${config.color}/20`,
        sizeClasses[size],
        className
      )}
    >
      <span className="flex items-center gap-1.5">
        <span className={cn("w-2 h-2 rounded-full", `bg-${config.color}`)} />
        {config.label}
        {showDays && daysToExpiry !== null && daysToExpiry > 0 && (
          <span className="text-muted-foreground text-xs font-normal">
            ({daysToExpiry} {daysToExpiry === 1 ? 'day' : 'days'})
          </span>
        )}
      </span>
    </div>
  );
}
