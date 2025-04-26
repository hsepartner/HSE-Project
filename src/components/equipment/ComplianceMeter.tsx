
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ExpiryStatus, getStatusFromDays } from "@/types/status";

interface ComplianceMeterProps {
  score: number;
  daysToNextInspection?: number | null;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ComplianceMeter({
  score,
  daysToNextInspection,
  className,
  showLabel = true,
  size = 'md',
}: ComplianceMeterProps) {
  // If days to next inspection is provided, use it to determine status
  const status = daysToNextInspection !== undefined && daysToNextInspection !== null 
    ? getStatusFromDays(daysToNextInspection) 
    : score >= 80 ? 'valid' : score >= 60 ? 'warning' : score >= 30 ? 'urgent' : 'expired';
  
  const getStatusColor = (status: ExpiryStatus) => {
    switch (status) {
      case 'valid': return 'bg-status-valid';
      case 'warning': return 'bg-status-warning';
      case 'urgent': return 'bg-status-urgent';
      case 'expired': return 'bg-status-expired';
      default: return 'bg-status-inactive';
    }
  };

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Compliance</span>
          <span className="font-medium">{score}%</span>
        </div>
      )}
      <div className={cn("w-full bg-secondary rounded-full overflow-hidden", sizeClasses[size])}>
        <div 
          className={cn("h-full rounded-full", getStatusColor(status))}
          style={{ width: `${score}%` }}
        />
      </div>
      {daysToNextInspection !== undefined && daysToNextInspection !== null && showLabel && (
        <div className="text-xs text-muted-foreground">
          Next inspection in {daysToNextInspection} days
        </div>
      )}
    </div>
  );
}
