import { Equipment, getDaysUntilNextInspection, EquipmentCategory, OperationalStatus } from "@/types/equipment";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryBadge } from "./CategoryBadge";
import { StatusBadge } from "./StatusBadge";
import { ComplianceMeter } from "./ComplianceMeter";
import { StatusPill } from "@/components/status/StatusPill";
import { getStatusFromDays } from "@/types/status";
import { Plus, Filter, Search, SortAsc, SortDesc, Share2, RotateCcw, MoreVertical } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import * as LucideIcons from "lucide-react";

interface EquipmentListProps {
  equipment: Equipment[];
  className?: string;
  onSelect?: (equipment: Equipment) => void;
}

export function EquipmentList({ equipment: initialEquipment, className, onSelect }: EquipmentListProps) {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const [equipment] = useState<Equipment[]>(initialEquipment);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<OperationalStatus | "all">("all");
  const [sortField, setSortField] = useState<keyof Equipment | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [shareInput, setShareInput] = useState("");

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

  const handleShare = (equipment: Equipment) => {
    console.log(`Sharing ${equipment.name} with: ${shareInput}`);
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
                {isRTL ? "سجل المعدات" : "Equipment Registry"}
              </h1>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-3 items-center w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={isRTL ? "البحث عن معدات..." : "Search equipment..."}
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
                onClick={() => setCategoryFilter("heavy")}
                className={cn(
                  "h-8 px-3 text-sm font-medium",
                  categoryFilter === "heavy"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                )}
              >
                {isRTL ? "المعدات الثقيلة" : "Heavy Equipment"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCategoryFilter("light")}
                className={cn(
                  "h-8 px-3 text-sm font-medium",
                  categoryFilter === "light"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                )}
              >
                {isRTL ? "المركبات الخفيفة" : "Light Vehicles"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCategoryFilter("power-tool")}
                className={cn(
                  "h-8 px-3 text-sm font-medium",
                  categoryFilter === "power-tool"
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                )}
              >
                {isRTL ? "الأدوات الكهربائية" : "Power Tools"}
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

        {/* Equipment Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50/80 border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-800">
              <div className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort("name")}>
                {isRTL ? "المعدات" : "Equipment"}
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
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((item) => {
                const daysToInspection = getDaysUntilNextInspection(item.nextInspectionDate);
                const status = getStatusFromDays(daysToInspection);

                return (
                  <div
                    key={item.id}
                    className="px-6 py-5 hover:bg-gray-50/50 transition-colors duration-150"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Equipment Info */}
                      <div className="col-span-4 flex items-center gap-4 cursor-pointer" onClick={() => onSelect?.(item)}>
                        <div className="flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-contain rounded-lg bg-gray-50 border border-gray-200 p-2"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <LucideIcons.Package className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 truncate text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {item.model} • {item.serialNumber}
                          </div>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="col-span-2" onClick={() => onSelect?.(item)}>
                        <CategoryBadge category={item.category} size="sm" />
                      </div>

                      {/* Status */}
                      <div className="col-span-2" onClick={() => onSelect?.(item)}>
                        <StatusBadge status={item.status} size="sm" />
                      </div>

                      {/* Compliance */}
                      <div className="col-span-3" onClick={() => onSelect?.(item)}>
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

                      {/* Actions - Always Visible */}
                      <div className="col-span-1 flex justify-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title={isRTL ? "مشاركة" : "Share"}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px] rounded-xl">
                            <DialogHeader className="pb-4">
                              <DialogTitle className="text-lg font-semibold text-gray-900">
                                {isRTL ? `مشاركة ${item.name}` : `Share ${item.name}`}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Input
                                    placeholder={isRTL ? "أدخل رمز المشروع / البريد الإلكتروني / الرابط" : "Enter Project Code / email / link"}
                                    value={shareInput}
                                    onChange={(e) => setShareInput(e.target.value)}
                                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                                <Button
                                  onClick={() => handleShare(item)}
                                  disabled={!shareInput}
                                  className="px-6 h-11 bg-blue-600 hover:bg-blue-700"
                                >
                                  {isRTL ? "مشاركة" : "Share"}
                                </Button>
                              </div>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
                  <p className="text-gray-500 text-sm">
                    {isRTL ? "لا توجد معدات تطابق معايير التصفية" : "Try adjusting your search or filter criteria"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Equipment Preview */}
        <Card className="border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <LucideIcons.Wrench className="h-5 w-5 text-white" />
              </div>
              {isRTL ? "معاينة المعدات الأخيرة" : "Recent Equipment Preview"}
            </CardTitle>
            <CardDescription className="text-gray-600 ml-13">
              {isRTL ? "نظرة سريعة على المعدات المضافة مؤخرًا" : "A quick look at recently added equipment"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <LucideIcons.Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {isRTL ? "شاحنة المرافق" : "Utility Truck"}
                  </h4>
                </div>
                <div className="bg-blue-50/80 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{isRTL ? "فورد F-450" : "Ford F-450"}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {isRTL ? "التالي: 2025-06-20" : "Next: 2025-06-20"}
                  </p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <LucideIcons.Battery className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {isRTL ? "مولد محمول" : "Portable Generator"}
                  </h4>
                </div>
                <div className="bg-blue-50/80 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{isRTL ? "هوندا EU7000" : "Honda EU7000"}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {isRTL ? "التالي: 2024-05-05" : "Next: 2024-05-05"}
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