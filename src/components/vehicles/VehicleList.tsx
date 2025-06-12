import { useState } from "react";
import { 
  Search, 
  Filter, 
  RotateCcw,
  Plus,
  SortAsc,
  SortDesc,
  Share2,
  MoreVertical,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicles";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryBadge } from "../equipment/CategoryBadge";
import { StatusBadge } from "../equipment/StatusBadge";
import { ComplianceMeter } from "../equipment/ComplianceMeter";
import { StatusPill } from "@/components/status/StatusPill";
import { getDaysUntilNextInspection } from "@/types/equipment";
import { getStatusFromDays } from "@/types/status";

interface VehicleListProps {
  vehicles: Vehicle[];
  className?: string;
  onSelect?: (vehicle: Vehicle) => void;
}

export function VehicleList({ vehicles: initialVehicles, className, onSelect }: VehicleListProps) {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const [vehicles] = useState<Vehicle[]>(initialVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "light" | "heavy" | "commercial">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "maintenance" | "decommissioned">("all");
  const [sortField, setSortField] = useState<keyof Vehicle | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [shareInput, setShareInput] = useState("");

  const handleSort = (field: keyof Vehicle) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort vehicles
  const filteredVehicles = vehicles.filter((item) => {
    const searchString = `${item.name} ${item.model} ${item.plateNumber} ${item.location} ${item.assignedTo}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleShare = (vehicle: Vehicle) => {
    console.log(`Sharing ${vehicle.name} with: ${shareInput}`);
    setShareInput("");
  };

  return (
    <div className={cn("min-h-screen bg-gray-50/30 p-6", className)}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                {isRTL ? "سجل المركبات" : "Vehicles Registry"}
              </h1>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-3 items-center w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={isRTL ? "البحث عن مركبات..." : "Search vehicles..."}
                  className="pl-10 w-full lg:w-[320px] h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-11 px-4 border-gray-200 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="mt-6 space-y-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={categoryFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("all")}
                className={cn(
                  "h-8 px-3 text-sm font-medium",
                  categoryFilter === "all" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
              >
                {isRTL ? "جميع الفئات" : "All Categories"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCategoryFilter(categoryFilter === "heavy" ? "all" : "heavy")}
                className={cn(
                  "h-8 px-3 text-sm font-medium",
                  categoryFilter === "heavy"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                )}
              >
                {isRTL ? "شاحنات ثقيلة" : "Heavy Trucks"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCategoryFilter(categoryFilter === "light" ? "all" : "light")}
                className={cn(
                  "h-8 px-3 text-sm font-medium",
                  categoryFilter === "light"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                )}
              >
                {isRTL ? "شاحنات خفيفة" : "Light Trucks"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCategoryFilter(categoryFilter === "commercial" ? "all" : "commercial")}
                className={cn(
                  "h-8 px-3 text-sm font-medium",
                  categoryFilter === "commercial"
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                )}
              >
                {isRTL ? "مركبات تجارية" : "Commercial Vehicles"}
              </Button>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
                className={cn(
                  "h-8 px-3 text-sm font-medium",
                  statusFilter === "all" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
              >
                {isRTL ? "جميع الحالات" : "All Status"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
                className={cn(
                  "h-8 px-3 text-sm font-medium",
                  statusFilter === "active"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                )}
              >
                Active
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter(statusFilter === "maintenance" ? "all" : "maintenance")}
                className={cn(
                  "h-8 px-3 text-sm font-medium",
                  statusFilter === "maintenance"
                    ? "bg-yellow-600 text-white border-yellow-600"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                )}
              >
                Maintenance
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter(statusFilter === "decommissioned" ? "all" : "decommissioned")}
                className={cn(
                  "h-8 px-3 text-sm font-medium",
                  statusFilter === "decommissioned"
                    ? "bg-gray-600 text-white border-gray-600"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                )}
              >
                Decommissioned
              </Button>
            </div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50/80 border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-800">
              <div className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort("name")}>
                {isRTL ? "المركبة" : "Vehicle"}
                {sortField === "name" && (
                  <div className="text-blue-600">
                    {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </div>
                )}
              </div>
              <div className="col-span-2">{isRTL ? "الفئة" : "Category"}</div>
              <div className="col-span-2">{isRTL ? "الحالة" : "Status"}</div>
              <div className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort("complianceScore")}>
                {isRTL ? "الامتثال" : "Compliance"}
                {sortField === "complianceScore" && (
                  <div className="text-blue-600">
                    {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </div>
                )}
              </div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((item) => {
                const daysToInspection = getDaysUntilNextInspection(item.nextInspectionDate);
                const status = getStatusFromDays(daysToInspection);

                return (
                  <div
                    key={item.id}
                    className="px-6 py-5 hover:bg-gray-50/50 transition-colors duration-150"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Vehicle Info */}
                      <div 
                        className="col-span-4 flex items-center gap-4 cursor-pointer" 
                        onClick={() => onSelect?.(item)}
                      >
                        <div className="w-12 h-12 bg-white rounded-lg border shadow-sm p-1 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-contain"
                            />
                          ) : (
                            <Truck className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.model} • {item.plateNumber}
                          </div>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="col-span-2">
                        <CategoryBadge category={item.category} size="sm" />
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <StatusBadge status={item.status} size="sm" />
                      </div>

                      {/* Compliance */}
                      <div className="col-span-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">{item.complianceScore}%</span>
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

                      {/* Actions */}
                      <div className="col-span-1 text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{isRTL ? "مشاركة المركبة" : "Share Vehicle"}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.model} • {item.plateNumber}</p>
                              </div>
                              <Input
                                placeholder={isRTL ? "البريد الإلكتروني أو الاسم" : "Email or name"}
                                value={shareInput}
                                onChange={(e) => setShareInput(e.target.value)}
                              />
                              <Button onClick={() => handleShare(item)}>
                                {isRTL ? "مشاركة" : "Share"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                  <p className="text-gray-500 text-sm">
                    {isRTL ? "لا توجد مركبات تطابق معايير التصفية" : "Try adjusting your search or filter criteria"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Vehicles Preview */}
        <Card className="border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Truck className="h-5 w-5 text-white" />
              </div>
              {isRTL ? "معاينة المركبات الأخيرة" : "Recent Vehicles Preview"}
            </CardTitle>
            <CardDescription className="text-gray-600 ml-13">
              {isRTL ? "نظرة سريعة على أحدث المركبات المضافة" : "Quick overview of recently added vehicles"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {isRTL ? "شاحنة فولفو" : "Volvo Truck"}
                  </h4>
                </div>
                <div className="bg-blue-50/80 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{isRTL ? "فولفو FH16" : "Volvo FH16"}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {isRTL ? "التالي: 2025-08-15" : "Next: 2025-08-15"}
                  </p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {isRTL ? "شاحنة فورد" : "Ford Truck"}
                  </h4>
                </div>
                <div className="bg-blue-50/80 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{isRTL ? "فورد F-150" : "Ford F-150"}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {isRTL ? "التالي: 2024-09-20" : "Next: 2024-09-20"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
