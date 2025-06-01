// components/equipment/EquipmentCategoryCard.tsx
import { Equipment } from "@/types/equipment";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "./CategoryBadge";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface EquipmentCategoryCardProps {
  equipment: Equipment[];
  equipmentType: string;
  category: string;
  image?: string;
  onClick: () => void;
  className?: string;
}

export function EquipmentCategoryCard({
  equipment,
  equipmentType,
  category,
  image,
  onClick,
  className
}: EquipmentCategoryCardProps) {
  const count = equipment.length;

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/30",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Quantity Badge */}
          <div className="relative">
            <Badge 
              className="absolute -top-2 -left-2 bg-green-500 hover:bg-green-500 text-white min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-bold z-10"
            >
              {count}
            </Badge>
            
            {/* Equipment Image/Icon */}
            <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-muted border">
              {image ? (
                <img
                  src={image}
                  alt={equipmentType}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <LucideIcons.Package className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Equipment Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-1">{equipmentType}</h3>
            <CategoryBadge category={category as any} size="sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}