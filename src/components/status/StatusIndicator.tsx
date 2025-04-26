
import { ExpiryStatus, STATUS_CONFIG, getStatusFromDays } from "@/types/status";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status?: ExpiryStatus;
  daysToExpiry?: number | null;
  className?: string;
  showDescription?: boolean;
  showDays?: boolean;
  label?: string;
}

export function StatusIndicator({
  status,
  daysToExpiry,
  className,
  showDescription = true,
  showDays = true,
  label,
}: StatusIndicatorProps) {
  // If daysToExpiry is provided, use it to determine status
  const resolvedStatus = daysToExpiry !== undefined 
    ? getStatusFromDays(daysToExpiry) 
    : status || 'inactive';
  
  const config = STATUS_CONFIG[resolvedStatus];

  // Generate the appropriate message based on days to expiry
  const getDaysMessage = () => {
    if (daysToExpiry === null) return 'Not applicable';
    if (daysToExpiry < 0) return `Expired ${Math.abs(daysToExpiry)} days ago`;
    if (daysToExpiry === 0) return 'Expires today';
    return `Expires in ${daysToExpiry} ${daysToExpiry === 1 ? 'day' : 'days'}`;
  };

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <div className="flex items-center space-x-2">
        <div className={cn(
          "w-3 h-3 rounded-full",
          `bg-${config.color}`
        )} />
        <span className="font-medium">{label || config.label}</span>
      </div>
      
      {showDescription && (
        <p className="text-sm text-muted-foreground ml-5">
          {config.description}
        </p>
      )}
      
      {showDays && daysToExpiry !== undefined && (
        <p className={cn(
          "text-sm ml-5", 
          resolvedStatus === 'expired' ? `text-${config.color}` : "text-muted-foreground"
        )}>
          {getDaysMessage()}
        </p>
      )}
    </div>
  );
}
