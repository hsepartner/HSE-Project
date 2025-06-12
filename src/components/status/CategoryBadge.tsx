import { cn } from "@/lib/utils";
import type { VehicleCategory } from "@/types/vehicle";
import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  category: VehicleCategory;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const categoryColors = {
  light: "bg-blue-50 text-blue-700 border-blue-200",
  heavy: "bg-orange-50 text-orange-700 border-orange-200",
  commercial: "bg-purple-50 text-purple-700 border-purple-200",
};

export function CategoryBadge({ category, size = "md", className }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        categoryColors[category],
        sizeClasses[size],
        className
      )}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  );
}
