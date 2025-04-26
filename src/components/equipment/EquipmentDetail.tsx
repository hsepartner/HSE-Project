import { Equipment, getDaysUntilNextInspection } from "@/types/equipment";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryBadge } from "./CategoryBadge";
import { StatusBadge } from "./StatusBadge";
import { ComplianceMeter } from "./ComplianceMeter";
import { DocumentList } from "./DocumentList";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Calendar, Clipboard, History, MapPin, User, Tag } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface EquipmentDetailProps {
  equipment: Equipment;
  className?: string;
}

export function EquipmentDetail({ equipment, className }: EquipmentDetailProps) {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const daysToInspection = getDaysUntilNextInspection(equipment.nextInspectionDate);

  const documentStatuses = {
    verified: equipment.documents.filter(doc => doc.status === 'verified').length,
    pending: equipment.documents.filter(doc => doc.status === 'pending').length,
    rejected: equipment.documents.filter(doc => doc.status === 'rejected').length,
  };

  const documentStatusData = [
    { name: isRTL ? "موثق" : "Verified", value: documentStatuses.verified, color: 'var(--status-valid)' },
    { name: isRTL ? "معلق" : "Pending", value: documentStatuses.pending, color: 'var(--status-warning)' },
    { name: isRTL ? "مرفوض" : "Rejected", value: documentStatuses.rejected, color: 'var(--status-expired)' },
  ].filter(entry => entry.value > 0);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">{equipment.name}</h1>
          <p className="text-muted-foreground">{equipment.model} • {equipment.serialNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <CategoryBadge category={equipment.category} />
          <StatusBadge status={equipment.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-2">
            <CardTitle className="text-base">{isRTL ? "تفاصيل المعدات" : "Equipment Details"}</CardTitle>
            <CardDescription>
              {isRTL ? "معلومات أساسية عن المعدات" : "Basic information about the equipment"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{isRTL ? "الرقم التسلسلي:" : "Serial Number:"}</span>
                <span className="text-sm font-medium">{equipment.serialNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{isRTL ? "تاريخ الشراء:" : "Purchase Date:"}</span>
                <span className="text-sm font-medium">
                  {new Date(equipment.purchaseDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{isRTL ? "الموقع:" : "Location:"}</span>
                <span className="text-sm font-medium">{equipment.location || (isRTL ? 'غير محدد' : 'Not specified')}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{isRTL ? "مخصص لـ:" : "Assigned To:"}</span>
                <span className="text-sm font-medium">{equipment.assignedTo || (isRTL ? 'غير مخصص' : 'Not assigned')}</span>
              </div>
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{isRTL ? "الفحص القادم:" : "Next Inspection:"}</span>
                <span className="text-sm font-medium">
                  {new Date(equipment.nextInspectionDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-2">
            <CardTitle className="text-base">{isRTL ? "حالة الامتثال" : "Compliance Status"}</CardTitle>
            <CardDescription>
              {isRTL ? "نظرة عامة على الامتثال" : "Overview of compliance status"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <ComplianceMeter
                score={equipment.complianceScore}
                daysToNextInspection={daysToInspection}
                size="lg"
              />
              <div className="text-sm">
                <Clipboard className="h-4 w-4 inline-block mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">{isRTL ? "ملاحظات:" : "Notes:"} </span>
                <span>{equipment.notes || (isRTL ? 'لا توجد ملاحظات متاحة' : 'No notes available')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-2">
            <CardTitle className="text-base">{isRTL ? "حالة الوثائق" : "Document Status"}</CardTitle>
            <CardDescription>
              {isRTL ? "توزيع حالات الوثائق" : "Distribution of document statuses"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {documentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center text-sm">
              <span className="text-muted-foreground">{isRTL ? "إجمالي الوثائق:" : "Total Documents:"} </span>
              <span className="font-medium">{equipment.documents.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
          <TabsTrigger
            value="documents"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
          >
            {isRTL ? "الوثائق" : "Documents"}
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
          >
            {isRTL ? "السجل" : "History"}
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
          >
            {isRTL ? "الصيانة" : "Maintenance"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="documents">
          <DocumentList documents={equipment.documents} />
        </TabsContent>
        <TabsContent value="history">
          <Card className="border-primary/20">
            <CardContent className="p-6 text-center text-muted-foreground">
              {isRTL ? "سيتم عرض سجل المعدات هنا" : "Equipment history will be displayed here"}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="maintenance">
          <Card className="border-primary/20">
            <CardContent className="p-6 text-center text-muted-foreground">
              {isRTL ? "سيتم عرض سجلات الصيانة هنا" : "Maintenance records will be displayed here"}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}