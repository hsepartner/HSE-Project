
import { VendorCategory, VENDOR_CATEGORY_CONFIG } from "@/types/vendor";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface VendorCategoryBadgeProps {
  category: VendorCategory;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

export function VendorCategoryBadge({
  category,
  size = 'md',
  showIcon = true,
  className,
  onClick
}: VendorCategoryBadgeProps) {
  const config = VENDOR_CATEGORY_CONFIG[category];
  
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
            // Type assertion and check if the icon exists in LucideIcons
            if (typeof iconName === 'string' && iconName in LucideIcons) {
              const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
              return <IconComponent className="h-3.5 w-3.5" />;
            }
            return null;
          })()
        )}
        {config.label}
      </span>
    </div>
  );
}
