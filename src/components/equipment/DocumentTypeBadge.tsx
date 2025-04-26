
import { DocumentType, DOCUMENT_TYPE_CONFIG } from "@/types/equipment";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface DocumentTypeBadgeProps {
  type: DocumentType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

export function DocumentTypeBadge({
  type,
  size = 'md',
  showIcon = true,
  className,
  onClick
}: DocumentTypeBadgeProps) {
  const config = DOCUMENT_TYPE_CONFIG[type];
  
  // Get the icon name
  const iconName = config.icon;
  
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
        onClick && "cursor-pointer hover:bg-opacity-20",
        className
      )}
      onClick={onClick}
    >
      <span className="flex items-center gap-1.5">
        {showIcon && iconName && (
          (() => {
            // Type assertion to ensure iconName is a valid key
            const iconKey = iconName as keyof typeof LucideIcons;
            // Get the icon component
            const IconComponent = LucideIcons[iconKey] as React.ElementType;
            // Only render if the component exists
            return IconComponent ? <IconComponent className="h-3.5 w-3.5" /> : null;
          })()
        )}
        {config.label}
      </span>
    </div>
  );
}
