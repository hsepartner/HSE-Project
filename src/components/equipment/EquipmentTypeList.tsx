// components/equipment/EquipmentTypeList.tsx
import { Equipment } from "@/types/equipment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { StatusBadge } from "./StatusBadge";
import { ComplianceMeter } from "./ComplianceMeter";
import { getDaysUntilNextInspection } from "@/types/equipment";
import { getStatusFromDays } from "@/types/status";
import { StatusPill } from "@/components/status/StatusPill";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface EquipmentTypeListProps {
  equipment: Equipment[];
  equipmentType: string;
  onBack: () => void;
  onSelectEquipment: (equipment: Equipment) => void;
  isRTL?: boolean;
}

export function EquipmentTypeList({
  equipment,
  equipmentType,
  onBack,
  onSelectEquipment,
  isRTL = false
}: EquipmentTypeListProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {isRTL ? "رجوع" : "Back"}
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{equipmentType}</h2>
          <p className="text-muted-foreground">
            {isRTL ? `${equipment.length} معدة` : `${equipment.length} items`}
          </p>
        </div>
      </div>

      {/* Equipment List */}
      <div className="space-y-3">
        {equipment.map((item) => {
          const daysToInspection = getDaysUntilNextInspection(item.nextInspectionDate);
          const status = getStatusFromDays(daysToInspection);

          return (
            <Card
              key={item.id}
              className={cn(
                "cursor-pointer hover:shadow-md transition-all duration-200 border-l-4",
                `border-l-status-${status}`
              )}
              onClick={() => onSelectEquipment(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Equipment Image */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-contain rounded bg-white border p-1"
                    />
                  ) : (
                    <LucideIcons.Package className="w-10 h-10 text-muted-foreground" />
                  )}

                  {/* Equipment Details */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.model} • {item.trafficPlateNumber}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <CategoryBadge category={item.category} size="sm" />
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? "المكان:" : "Location:"}
                      </p>
                      <p className="text-sm font-medium">
                        {item.location || (isRTL ? "غير محدد" : "Not specified")}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{item.complianceScore}%</span>
                        <StatusPill
                          daysToExpiry={daysToInspection}
                          size="sm"
                          showDays={true}
                        />
                      </div>
                      <ComplianceMeter
                        score={item.complianceScore}
                        daysToNextInspection={daysToInspection}
                        showLabel={false}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}