import { Equipment, getDaysUntilNextInspection, EquipmentCategory, OperationalStatus } from "@/types/equipment";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CategoryBadge } from "./CategoryBadge";
import { StatusBadge } from "./StatusBadge";
import { ComplianceMeter } from "./ComplianceMeter";
import { StatusPill } from "@/components/status/StatusPill";
import { getStatusFromDays } from "@/types/status";
import { Plus, Filter, Search, SortAsc, SortDesc } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import * as LucideIcons from "lucide-react";

interface EquipmentListProps {
  equipment: Equipment[];
  className?: string;
  onSelect?: (equipment: Equipment) => void;
}

export function EquipmentList({ equipment: initialEquipment, className, onSelect }: EquipmentListProps) {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [equipment] = useState<Equipment[]>(initialEquipment);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<OperationalStatus | "all">("all");
  const [sortField, setSortField] = useState<keyof Equipment | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Equipment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEquipment = [...equipment].sort((a, b) => {
    if (!sortField) return 0;
    const valueA = a[sortField];
    const valueB = b[sortField];
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
    return 0;
  });

  const filteredEquipment = sortedEquipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 items-center">
          <h2 className="text-xl font-semibold">{isRTL ? "سجل المعدات" : "Equipment Registry"}</h2>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isRTL ? "البحث عن معدات..." : "Search equipment..."}
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label={isRTL ? "البحث عن معدات" : "Search equipment"}
            />
          </div>
          <Button variant="outline" size="icon" title={isRTL ? "تصفية" : "Filter"}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoryFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("all")}
        >
          {isRTL ? "جميع الفئات" : "All Categories"}
        </Button>
        <Button
          variant={categoryFilter === "heavy" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("heavy")}
          className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"
        >
          {isRTL ? "المعدات الثقيلة" : "Heavy Equipment"}
        </Button>
        <Button
          variant={categoryFilter === "light" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("light")}
          className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
        >
          {isRTL ? "المركبات الخفيفة" : "Light Vehicles"}
        </Button>
        <Button
          variant={categoryFilter === "power-tool" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("power-tool")}
          className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20"
        >
          {isRTL ? "الأدوات الكهربائية" : "Power Tools"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          {isRTL ? "جميع الحالات" : "All Status"}
        </Button>
        <StatusBadge
          status="active"
          size="sm"
          className={`cursor-pointer ${statusFilter === "active" ? "ring-2 ring-status-valid" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
        />
        <StatusBadge
          status="maintenance"
          size="sm"
          className={`cursor-pointer ${statusFilter === "maintenance" ? "ring-2 ring-status-warning" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "maintenance" ? "all" : "maintenance")}
        />
        <StatusBadge
          status="decommissioned"
          size="sm"
          className={`cursor-pointer ${statusFilter === "decommissioned" ? "ring-2 ring-status-inactive" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "decommissioned" ? "all" : "decommissioned")}
        />
      </div>

      <div className="rounded-md border bg-background overflow-x-auto">
        <div className="bg-muted/50 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center min-w-[600px] md:min-w-0">
          <div className="col-span-5 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("name")}>
            {isRTL ? "المعدات" : "Equipment"}
            {sortField === "name" && (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
          </div>
          <div className="col-span-2">{isRTL ? "الفئة" : "Category"}</div>
          <div className="col-span-2">{isRTL ? "الحالة" : "Status"}</div>
          <div className="col-span-3 flex items-center gap-2 cursor-pointer" onClick={() => handleSort("complianceScore")}>
            {isRTL ? "الامتثال" : "Compliance"}
            {sortField === "complianceScore" && (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
          </div>
        </div>
        <div className="divide-y">
          {filteredEquipment.length > 0 ? (
            filteredEquipment.map((item) => {
              const daysToInspection = getDaysUntilNextInspection(item.nextInspectionDate);
              const status = getStatusFromDays(daysToInspection);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "py-3 px-4 grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-2 items-center hover:bg-muted/50 cursor-pointer border-b md:border-0 rounded-lg md:rounded-none mb-2 md:mb-0 shadow-sm md:shadow-none transition-all",
                    `border-l-4 border-l-status-${status}`
                  )}
                  onClick={() => onSelect?.(item)}
                >
                  <div className="flex items-center gap-3 md:col-span-5">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded bg-white border p-1"
                      />
                    ) : (
                      <LucideIcons.Package className="w-8 h-8 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.model} • {item.serialNumber}
                      </div>
                    </div>
                  </div>
                  <div className="flex md:block gap-2 md:gap-0 md:col-span-2">
                    <CategoryBadge category={item.category} size="sm" />
                  </div>
                  <div className="flex md:block gap-2 md:gap-0 md:col-span-2">
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-3">
                    <div className="flex items-center justify-between mb-1">
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
              );
            })
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {isRTL ? "لا توجد معدات تطابق معايير التصفية" : "No equipment found matching your filters"}
            </div>
          )}
        </div>
      </div>

      {/* Recent Equipment Preview */}
      <Card className="mt-6 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LucideIcons.Wrench className="h-5 w-5 text-primary" />
            {isRTL ? "معاينة المعدات الأخيرة" : "Recent Equipment Preview"}
          </CardTitle>
          <CardDescription>
            {isRTL ? "نظرة سريعة على المعدات المضافة مؤخرًا" : "A quick look at recently added equipment"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg bg-background p-4">
              <h4 className="font-medium text-sm mb-3 flex items-center">
                <LucideIcons.Truck size={16} className="mr-2 text-blue-600" />
                {isRTL ? "شاحنة المرافق" : "Utility Truck"}
              </h4>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm font-medium">{isRTL ? "فورد F-450" : "Ford F-450"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL ? "التالي: 2025-06-20" : "Next: 2025-06-20"}
                </p>
              </div>
            </div>
            <div className="border rounded-lg bg-background p-4">
              <h4 className="font-medium text-sm mb-3 flex items-center">
                <LucideIcons.Battery size={16} className="mr-2 text-blue-600" />
                {isRTL ? "مولد محمول" : "Portable Generator"}
              </h4>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm font-medium">{isRTL ? "هوندا EU7000" : "Honda EU7000"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL ? "التالي: 2024-05-05" : "Next: 2024-05-05"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}