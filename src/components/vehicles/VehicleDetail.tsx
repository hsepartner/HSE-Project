import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clipboard, History, MapPin, User, Tag, Edit, Save, X, Upload, FileText, Eye, ArrowLeft, Truck, CheckCircle2, Clock } from "lucide-react";
import { CategoryBadge } from "@/components/status/CategoryBadge";
import { StatusBadge } from "@/components/status/StatusBadge";
import { ComplianceMeter } from "@/components/status/ComplianceMeter";
import { DocumentList } from "@/components/equipment/DocumentList";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicle";
import type { VehicleDailyInspection, VehicleMonthlyInspection } from "@/types/vehicleInspection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehicleDailyChecklistDialog } from "./VehicleDailyChecklistDialog";
import { MonthlyInspectionDialog } from "./VehicleMonthlyInspectionDialog";

// Mock data for history and maintenance
const mockHistory = [
  { id: 1, date: "2024-03-01", event: "Inspection completed", by: "Inspector A" },
  { id: 2, date: "2024-02-15", event: "Assigned to John Doe", by: "System" },
  { id: 3, date: "2024-01-10", event: "Status changed to Active", by: "Admin" },
];

const mockMaintenance = [
  { id: 1, date: "2024-04-10", action: "Oil Change", by: "Tech B", status: "Completed" },
  { id: 2, date: "2024-03-20", action: "Filter Replacement", by: "Tech C", status: "Completed" },
  { id: 3, date: "2024-02-05", action: "Scheduled Maintenance", by: "Tech D", status: "Scheduled" },
];

function getDaysUntilNextInspection(nextInspectionDate: string | undefined): number {
  if (!nextInspectionDate) return 0;
  const today = new Date();
  const inspectionDate = new Date(nextInspectionDate);
  const diffTime = inspectionDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

interface VehicleDetailProps {
  vehicle: Vehicle;
  className?: string;
  onBack?: () => void;
  onUpdateInspection?: (inspection: VehicleDailyInspection | VehicleMonthlyInspection) => Promise<void>;
}

export function VehicleDetail({ vehicle, className, onBack, onUpdateInspection }: VehicleDetailProps) {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState(vehicle);
  const [newNote, setNewNote] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isDailyChecklistOpen, setIsDailyChecklistOpen] = useState(false);
  const [isMonthlyChecklistOpen, setIsMonthlyChecklistOpen] = useState(false);
  const daysToInspection = getDaysUntilNextInspection(vehicle.nextInspectionDate);

  // Check if there's a daily inspection for today
  const today = new Date().toISOString().split('T')[0];
  const todaysInspection = vehicle.dailyInspections?.find(
    inspection => inspection.date.split('T')[0] === today
  );
  const hasPassedTodaysInspection = todaysInspection?.status === 'completed';

  // Check monthly inspection status
  const lastMonthlyInspection = vehicle.monthlyInspections?.[0];
  const isMonthlyInspectionDue = !lastMonthlyInspection || 
    new Date(lastMonthlyInspection.nextInspectionDate) <= new Date();

  const handleInspectionSubmit = async (inspection: VehicleDailyInspection | VehicleMonthlyInspection) => {
    if (onUpdateInspection) {
      await onUpdateInspection(inspection);
    }
  };

  const documentStatuses = {
    verified: vehicle.documents.filter(doc => doc.status === 'verified').length,
    pending: vehicle.documents.filter(doc => doc.status === 'pending').length,
    rejected: vehicle.documents.filter(doc => doc.status === 'rejected').length,
  };

  const documentStatusData = [
    { name: isRTL ? "موثق" : "Verified", value: documentStatuses.verified, color: 'var(--status-valid)' },
    { name: isRTL ? "معلق" : "Pending", value: documentStatuses.pending, color: 'var(--status-warning)' },
    { name: isRTL ? "مرفوض" : "Rejected", value: documentStatuses.rejected, color: 'var(--status-expired)' },
  ].filter(entry => entry.value > 0);

  const handleSave = () => {
    setIsEditing(false);
    // Implement save logic here
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Add note logic here
      setNewNote("");
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle document upload
    const file = event.target.files?.[0];
    // Implement upload logic
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Back Button and Edit Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isRTL ? "رجوع" : "Back"}
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">{vehicle.name}</h1>
            <p className="text-muted-foreground">{vehicle.model} • {vehicle.plateNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {isRTL ? "حفظ" : "Save"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              {isRTL ? "تعديل" : "Edit"}
            </Button>
          )}
        </div>
      </div>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "ملاحظات الفحص" : "Inspection Notes"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder={isRTL ? "أضف ملاحظة..." : "Add a note..."}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddNote}>
                {isRTL ? "إضافة" : "Add"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Vehicle Information */}
        <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-2">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              {isRTL ? "معلومات المركبة" : "Vehicle Information"}
            </CardTitle>
            <CardDescription>
              {isRTL ? "التفاصيل الأساسية للمركبة" : "Basic vehicle details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{isRTL ? "النوع:" : "Type:"}</span>
                  <p className="font-medium">{vehicle.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{isRTL ? "الطراز:" : "Model:"}</span>
                  <p className="font-medium">{vehicle.model}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{isRTL ? "رقم اللوحة:" : "Plate Number:"}</span>
                  <p className="font-medium">{vehicle.plateNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{isRTL ? "الموقع:" : "Location:"}</span>
                  <p className="font-medium">{vehicle.location}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <CategoryBadge category={vehicle.category} size="sm" />
                <StatusBadge status={vehicle.status} size="sm" />
              </div>
              <ComplianceMeter
                score={vehicle.complianceScore}
                daysToNextInspection={daysToInspection}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents Section */}
        <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {isRTL ? "المستندات" : "Documents"}
            </CardTitle>
            <CardDescription>
              {isRTL ? "الوثائق والشهادات" : "Documents and certificates"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {vehicle.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">{doc.expiryDate}</p>
                  </div>
                  <StatusBadge status={doc.status as any} size="sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assignment Information */}
        <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-2">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {isRTL ? "معلومات التخصيص" : "Assignment Information"}
            </CardTitle>
            <CardDescription>
              {isRTL ? "تفاصيل المشغل والمشروع" : "Operator and project details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{isRTL ? "المشغل:" : "Operator:"}</span>
                  <p className="font-medium">{vehicle.assignedTo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{isRTL ? "المشروع:" : "Project:"}</span>
                  <p className="font-medium">{vehicle.project}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily and Monthly Inspection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Inspection Card */}
        <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {isRTL ? "الفحص اليومي" : "Daily Inspection"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                {hasPassedTodaysInspection ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600 mb-1" />
                    <span className="text-sm font-medium text-green-600">
                      {isRTL ? "تم إجراء الفحص اليوم" : "Inspection completed today"}
                    </span>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 text-yellow-600 mb-1" />
                    <span className="text-sm font-medium text-yellow-600">
                      {isRTL ? "لم يتم إجراء الفحص اليوم" : "Inspection needed today"}
                    </span>
                  </>
                )}
              </div>
              <Button 
                variant={hasPassedTodaysInspection ? "outline" : "default"}
                onClick={() => setIsDailyChecklistOpen(true)}
              >
                {hasPassedTodaysInspection ? (
                  isRTL ? "عرض التفاصيل" : "View Details"
                ) : (
                  isRTL ? "بدء الفحص" : "Start Inspection"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Technical Inspection Card */}
        <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {isRTL ? "الفحص الفني الشهري" : "Monthly Technical Inspection"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                {isMonthlyInspectionDue ? (
                  <>
                    <Clock className="h-5 w-5 text-yellow-600 mb-1" />
                    <span className="text-sm font-medium text-yellow-600">
                      {isRTL ? "الفحص الشهري مطلوب" : "Monthly inspection needed"}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600 mb-1" />
                    <span className="text-sm text-green-600 font-medium">
                      {isRTL ? "الفحص الشهري حديث" : "Monthly inspection up to date"}
                    </span>
                  </>
                )}
              </div>
              <Button 
                variant="default"
                onClick={() => setIsMonthlyChecklistOpen(true)}
              >
                {isRTL ? "بدء الفحص الفني" : "Start Technical Inspection"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid grid-cols-4 gap-2 p-1 bg-muted rounded-lg">
          <TabsTrigger value="documents">
            {isRTL ? "الوثائق" : "Documents"}
          </TabsTrigger>
          <TabsTrigger value="inspections">
            {isRTL ? "سجل الفحوصات" : "Inspection History"}
          </TabsTrigger>
          <TabsTrigger value="history">
            {isRTL ? "السجل" : "History"}
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            {isRTL ? "الصيانة" : "Maintenance"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <DocumentList documents={vehicle.documents} />
        </TabsContent>

        <TabsContent value="inspections" className="mt-6">
          <div className="space-y-6">
            {/* Daily Inspections Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {isRTL ? "الفحوصات اليومية" : "Daily Inspections"}
              </h3>
              <div className="space-y-4">
                {vehicle.dailyInspections?.map(inspection => (
                  <div key={inspection.date} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <span className="font-medium">
                        {isRTL ? "الفحص اليومي" : "Daily Inspection"}
                      </span>
                      <div className="text-muted-foreground">
                        {isRTL ? "بواسطة: " : "By: "}{inspection.driverName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? "المسافة: " : "Mileage: "}{inspection.mileage} km
                      </div>
                    </div>
                    <div className="text-right">
                      <div>{new Date(inspection.date).toLocaleDateString()}</div>
                      <Badge variant={inspection.status === 'completed' ? "default" : "secondary"}>
                        {inspection.status === 'completed' 
                          ? (isRTL ? "مكتمل" : "Completed")
                          : (isRTL ? "غير مكتمل" : "Incomplete")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Inspections Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {isRTL ? "الفحوصات الشهرية" : "Monthly Inspections"}
              </h3>
              <div className="space-y-4">
                {vehicle.monthlyInspections?.map(inspection => (
                  <div key={inspection.date} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <span className="font-medium">
                        {isRTL ? "الفحص الفني الشهري" : "Technical Inspection"}
                      </span>
                      <div className="text-muted-foreground">
                        {isRTL ? "بواسطة: " : "By: "}{inspection.technicianName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? "المسافة: " : "Mileage: "}{inspection.mileage} km
                      </div>
                    </div>
                    <div className="text-right">
                      <div>{new Date(inspection.date).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? "الفحص القادم: " : "Next: "}
                        {new Date(inspection.nextInspectionDate).toLocaleDateString()}
                      </div>
                      <Badge variant={inspection.status === 'completed' ? "default" : "secondary"}>
                        {inspection.status === 'completed' 
                          ? (isRTL ? "مكتمل" : "Completed")
                          : (isRTL ? "غير مكتمل" : "Incomplete")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">            {mockHistory.map((event) => (
              <div key={event.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-medium">{event.event}</div>
                  <div className="text-sm text-muted-foreground">By: {event.by}</div>
                </div>
                <div className="text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <div className="space-y-4">            {mockMaintenance.map((maintenance) => (
              <div key={maintenance.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-medium">{maintenance.action}</div>
                  <div className="text-sm text-muted-foreground">By: {maintenance.by}</div>
                </div>
                <div className="text-right">
                  <div>{new Date(maintenance.date).toLocaleDateString()}</div>
                  <Badge variant="outline">{maintenance.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Document View Modal */}
      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedDocument?.fileUrl && (
            <div className="aspect-[16/9] w-full">
              <iframe
                src={selectedDocument.fileUrl}
                className="w-full h-full border-0"
                title={selectedDocument.name}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add inspection dialogs */}
      <VehicleDailyChecklistDialog 
        vehicle={vehicle}
        open={isDailyChecklistOpen}
        onOpenChange={setIsDailyChecklistOpen}
        onSubmit={handleInspectionSubmit}
      />
      
      <MonthlyInspectionDialog
        vehicle={vehicle}
        open={isMonthlyChecklistOpen}
        onOpenChange={setIsMonthlyChecklistOpen}
        onSubmit={handleInspectionSubmit}
      />
    </div>
  );
}
