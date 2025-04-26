
import { Equipment, getDaysUntilNextInspection } from "@/types/equipment";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CategoryBadge } from "./CategoryBadge";
import { StatusBadge } from "./StatusBadge";
import { ComplianceMeter } from "./ComplianceMeter";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileIcon } from "lucide-react";

interface EquipmentCardProps {
  equipment: Equipment;
  className?: string;
}

export function EquipmentCard({ equipment, className }: EquipmentCardProps) {
  const daysToInspection = getDaysUntilNextInspection(equipment.nextInspectionDate);
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-none">{equipment.name}</h3>
            <p className="text-sm text-muted-foreground">{equipment.model} • {equipment.serialNumber}</p>
          </div>
          <StatusBadge status={equipment.status} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CategoryBadge category={equipment.category} size="sm" />
            <span className="text-sm text-muted-foreground">
              {equipment.location || 'No location'}
            </span>
          </div>
          
          <ComplianceMeter 
            score={equipment.complianceScore} 
            daysToNextInspection={daysToInspection}
          />
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Purchased: {new Date(equipment.purchaseDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{equipment.documents.length} documents</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">Details</Button>
        <Button variant="outline" size="sm">Documents</Button>
      </CardFooter>
    </Card>
  );
}
