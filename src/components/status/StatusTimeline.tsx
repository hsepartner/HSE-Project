
import { ExpiryStatus, getStatusFromDays } from "@/types/status";
import { cn } from "@/lib/utils";

interface StatusTimelineProps {
  totalDays: number;
  daysRemaining: number;
  className?: string;
}

export function StatusTimeline({
  totalDays,
  daysRemaining,
  className,
}: StatusTimelineProps) {
  // Calculate percentage and status
  const percentage = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100));
  const status = getStatusFromDays(daysRemaining);
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-xs">
        <span>Expires in {daysRemaining} days</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full",
            `bg-status-${status}`
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
