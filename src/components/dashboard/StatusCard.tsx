
import { ExpiryStatus, STATUS_CONFIG } from "@/types/status";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: number | string;
  status: ExpiryStatus;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function StatusCard({
  title,
  value,
  status,
  icon: Icon,
  description,
  className,
}: StatusCardProps) {
  const statusConfig = STATUS_CONFIG[status];

  return (
    <div 
      className={cn(
        "rounded-lg border p-4 transition-shadow duration-200 hover:shadow-md",
        `border-${statusConfig.color}/30`,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          `bg-${statusConfig.color}/10 text-${statusConfig.color}`
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className={cn(
          "w-full h-1 rounded-full bg-secondary overflow-hidden"
        )}>
          <div 
            className={cn(
              "h-full",
              `bg-${statusConfig.color}`
            )}
            style={{ width: '60%' }} // This would be dynamic in a real implementation
          />
        </div>
      </div>
    </div>
  );
}
