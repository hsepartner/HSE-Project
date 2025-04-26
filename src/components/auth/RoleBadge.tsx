
import { UserRole, ROLE_CONFIG } from "@/types/auth";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RoleBadge({
  role,
  className,
  showLabel = true,
  size = 'md',
}: RoleBadgeProps) {
  const config = ROLE_CONFIG[role];
  
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
        {showLabel ? config.label : role}
      </span>
    </div>
  );
}
