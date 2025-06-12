import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clipboard, History, MapPin, User, Tag, Edit, Save, X, Upload, FileText, Eye, ArrowLeft, Truck } from "lucide-react";
import { CategoryBadge } from "@/components/status/CategoryBadge";
import { StatusBadge } from "@/components/status/StatusBadge";
import { ComplianceMeter } from "@/components/status/ComplianceMeter";
import { DocumentList } from "@/components/equipment/DocumentList";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicle";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
}

export function VehicleDetail({ vehicle, className, onBack }: VehicleDetailProps) {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState(vehicle);
  const [newNote, setNewNote] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const daysToInspection = getDaysUntilNextInspection(vehicle.nextInspectionDate);

  // Add mock data inside the component
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

      {/* Tabs Section */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
          <TabsTrigger value="documents">
            {isRTL ? "الوثائق" : "Documents"}
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
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {mockHistory.map((record) => (
                  <div key={record.id} className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{record.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.date} • {record.by}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {mockMaintenance.map((record) => (
                  <div key={record.id} className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{record.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.date} • {record.by} • {record.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
}
