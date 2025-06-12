import { cn } from "@/lib/utils";
import { getStatusType } from "@/utils/date";

interface ComplianceMeterProps {
  score: number;
  daysToNextInspection: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusColors = {
  valid: "bg-green-500",
  warning: "bg-yellow-500",
  expired: "bg-red-500",
};

export function ComplianceMeter({
  score,
  daysToNextInspection,
  showLabel = true,
  size = "md",
  className,
}: ComplianceMeterProps) {
  const status = getStatusType(daysToNextInspection);

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Compliance Score</span>
          <span className="font-medium text-foreground">{score}%</span>
        </div>
      )}
      <div className={cn("w-full bg-muted/30 rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("h-full transition-all duration-500", statusColors[status])}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
