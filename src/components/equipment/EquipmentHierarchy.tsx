import { Equipment } from "@/types/equipment";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { CategoryBadge } from "./CategoryBadge";
import { ChevronRight, ChevronDown, Wrench, Battery, Truck } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface EquipmentHierarchyProps {
  equipment: Equipment[];
  className?: string;
}

interface EquipmentNode {
  equipment: Equipment;
  children: EquipmentNode[];
  isOpen?: boolean;
}

export function EquipmentHierarchy({ equipment, className }: EquipmentHierarchyProps) {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';

  const buildHierarchy = (items: Equipment[]): EquipmentNode[] => {
    const itemMap = new Map<string, EquipmentNode>();
    const rootNodes: EquipmentNode[] = [];

    items.forEach(item => {
      itemMap.set(item.id, {
        equipment: item,
        children: [],
        isOpen: true
      });
    });

    items.forEach(item => {
      const node = itemMap.get(item.id);
      if (node) {
        if (item.parentEquipmentId && itemMap.has(item.parentEquipmentId)) {
          const parentNode = itemMap.get(item.parentEquipmentId);
          if (parentNode) {
            parentNode.children.push(node);
          }
        } else {
          rootNodes.push(node);
        }
      }
    });

    return rootNodes;
  };

  const [hierarchy, setHierarchy] = useState<EquipmentNode[]>(buildHierarchy(equipment));

  const toggleNode = (node: EquipmentNode) => {
    node.isOpen = !node.isOpen;
    setHierarchy([...hierarchy]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'heavy':
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'light':
        return <Truck className="h-4 w-4 text-green-500" />;
      case 'power-tool':
        return <Battery className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const renderNode = (node: EquipmentNode, level = 0) => {
    const { equipment: item, children, isOpen } = node;
    const hasChildren = children.length > 0;

    return (
      <div key={item.id} className="tree-node">
        <div
          className={cn(
            "flex items-center p-2 border-l-4 hover:bg-muted/50 cursor-pointer rounded-r-md",
            hasChildren ? "border-primary/40" : "border-transparent"
          )}
          style={{ paddingLeft: `${(level * 20) + 8}px` }}
          onClick={() => hasChildren && toggleNode(node)}
        >
          {hasChildren && (
            <div className="mr-1 text-muted-foreground">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          )}
          <div className="flex items-center space-x-2 flex-1">
            {getCategoryIcon(item.category)}
            <span className="font-medium">{item.name}</span>
            <span className="text-sm text-muted-foreground">{item.model}</span>
            <div className="flex-1"></div>
            <CategoryBadge category={item.category} size="sm" showIcon={false} />
            <StatusBadge status={item.status} size="sm" />
          </div>
        </div>
        {isOpen && hasChildren && (
          <div className="children">
            {children.map(childNode => renderNode(childNode, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            {isRTL ? "التسلسل الهرمي للمعدات" : "Equipment Hierarchy"}
          </CardTitle>
          <CardDescription>
            {isRTL ? "عرض منظم للمعدات حسب العلاقات الأبوية" : "Organized view of equipment by parent-child relationships"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <div className="tree">
            {hierarchy.length > 0 ? (
              hierarchy.map(node => renderNode(node))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {isRTL ? "لا توجد معدات متاحة" : "No equipment available"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hierarchy Preview */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            {isRTL ? "معاينة التسلسل الهرمي" : "Hierarchy Preview"}
          </CardTitle>
          <CardDescription>
            {isRTL ? "نظرة سريعة على العلاقات بين المعدات" : "A quick look at equipment relationships"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg bg-background p-4">
              <h4 className="font-medium text-sm mb-3 flex items-center">
                <Wrench size={16} className="mr-2 text-blue-600" />
                {isRTL ? "الحفار XL2000" : "Excavator XL2000"}
              </h4>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm font-medium">{isRTL ? "شاحنة المرافق (تابعة)" : "Utility Truck (Child)"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL ? "فورد F-450" : "Ford F-450"}
                </p>
              </div>
            </div>
            <div className="border rounded-lg bg-background p-4">
              <h4 className="font-medium text-sm mb-3 flex items-center">
                <Battery size={16} className="mr-2 text-orange-600" />
                {isRTL ? "مولد محمول" : "Portable Generator"}
              </h4>
              <div className="bg-orange-50 p-3 rounded-md">
                <p className="text-sm font-medium">{isRTL ? "منشار دائري (تابع)" : "Circular Saw (Child)"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL ? "ديوالت DCS577" : "DeWalt DCS577"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}