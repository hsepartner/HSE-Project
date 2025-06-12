import { Vehicle } from "@/types/vehicle";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/status/CategoryBadge";
import { cn } from "@/lib/utils";
import { Truck } from "lucide-react";

interface VehicleCategoryCardProps {
  vehicles: Vehicle[];
  vehicleType: string;
  category: string;
  image?: string;
  onClick: () => void;
  className?: string;
}

export function VehicleCategoryCard({
  vehicles,
  vehicleType,
  category,
  image,
  onClick,
  className
}: VehicleCategoryCardProps) {
  const activeCount = vehicles.filter(v => v.status === 'active').length;
  const totalCount = vehicles.length;

  return (
    <Card
      className={cn("cursor-pointer hover:shadow-md transition-shadow duration-200", className)}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 flex items-center gap-4">
            {/* Image Container */}
            <div className="relative">
              <div className="w-14 h-14 bg-muted rounded-lg border shadow-sm p-2 flex items-center justify-center">
                {image ? (
                  <img
                    src={image}
                    alt={vehicleType}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <Truck className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              {/* Active Status Indicator */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-background rounded-full border flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-status-valid"></div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-1">{vehicleType}</h3>
              <CategoryBadge category={category as any} size="sm" />
            </div>
          </div>

          {/* Status Count */}
          <div className="text-sm text-muted-foreground">
            {activeCount}/{totalCount}
          </div>
        </div>

        {/* Vehicle Count Statistics */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground flex items-center justify-between">
            <span>Active</span>
            <span className="font-medium text-foreground">{activeCount}</span>
          </div>
          <div className="mt-2 bg-muted/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-status-valid rounded-full transition-all duration-500"
              style={{ width: `${(activeCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
