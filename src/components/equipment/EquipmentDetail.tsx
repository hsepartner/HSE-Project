import { useState, useEffect } from "react";
import { Equipment, getDaysUntilNextInspection } from "@/types/equipment";
import { DailyInspection, MonthlyInspection } from "@/types/inspection";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryBadge } from "./CategoryBadge";
import { StatusBadge } from "./StatusBadge";
import { ComplianceMeter } from "./ComplianceMeter";
import { DocumentList } from "./DocumentList";
import { DailyChecklistDialog } from "./DailyChecklistDialog";
import { MonthlyInspectionDialog } from "./MonthlyInspectionDialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { 
  Calendar, 
  Clipboard, 
  History, 
  MapPin, 
  User, 
  Settings, 
  Activity, 
  PenTool, 
  Tag, 
  Edit, 
  Save, 
  X, 
  Upload, 
  FileText, 
  MessageSquare,
  Eye, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Wrench,
  AlertTriangle,
  ScrollText,
  ClipboardList
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentType, DocumentStatus } from "@/types/equipment";

// Import new modals
import { EquipmentMaintenanceLogModal } from "./EquipmentMaintenanceLogModal";
import { ServiceReportModal } from "./ServiceReportModal";
import { useToast } from "@/components/ui/use-toast";
import QRCode from "react-qr-code";
import { DailyInspectionReportDialog } from "./DailyInspectionReportDialog";
import { MonthlyInspectionReportDialog } from "./MonthlyInspectionReportDialog";

interface EquipmentDetailProps {
  equipment: Equipment;
  className?: string;
  onBack?: () => void;
  onUpdateInspection?: (inspection: DailyInspection | MonthlyInspection) => Promise<void>;
}

export function EquipmentDetail({ 
  equipment, 
  className, 
  onBack,
  onUpdateInspection 
}: EquipmentDetailProps) {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [isEditing, setIsEditing] = useState(false);
  const [editedEquipment, setEditedEquipment] = useState(equipment);
  const [newNote, setNewNote] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isDailyChecklistOpen, setIsDailyChecklistOpen] = useState(false);
  const [isMonthlyChecklistOpen, setIsMonthlyChecklistOpen] = useState(false);
  // New state for maintenance log and service report modals
  const [isMaintenanceLogOpen, setIsMaintenanceLogOpen] = useState(false);
  const [isServiceReportOpen, setIsServiceReportOpen] = useState(false);
  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([]); // To store submitted maintenance logs
  const [serviceReports, setServiceReports] = useState<any[]>([]); // To store submitted service reports
  // State for QR code modal
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  // Add state for report dialogs
  const [selectedDailyInspection, setSelectedDailyInspection] = useState<DailyInspection | null>(null);
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
  const [selectedMonthlyInspection, setSelectedMonthlyInspection] = useState<MonthlyInspection | null>(null);
  const [isMonthlyReportOpen, setIsMonthlyReportOpen] = useState(false);
  // Add state for maintenance/service report dialogs
  const [selectedMaintenanceLog, setSelectedMaintenanceLog] = useState<any | null>(null);
  const [isMaintenanceLogReportOpen, setIsMaintenanceLogReportOpen] = useState(false);
  const [selectedServiceReport, setSelectedServiceReport] = useState<any | null>(null);
  const [isServiceReportDialogOpen, setIsServiceReportDialogOpen] = useState(false);

  const { toast } = useToast();

  const daysToInspection = getDaysUntilNextInspection(equipment.nextInspectionDate);

  // Check if there's a daily inspection for today
  const today = new Date().toISOString().split('T')[0];
  const todaysInspection = equipment.dailyInspections?.find(
    inspection => inspection.date.split('T')[0] === today
  );
  const hasPassedTodaysInspection = todaysInspection?.status === 'completed';

  // Check monthly inspection status
  const lastMonthlyInspection = equipment.monthlyInspections?.[0];
  const isMonthlyInspectionDue = !lastMonthlyInspection || 
    new Date(lastMonthlyInspection.nextInspectionDate) <= new Date();

  const handleInspectionSubmit = async (inspection: DailyInspection | MonthlyInspection) => {
    if (onUpdateInspection) {
      await onUpdateInspection(inspection);
    }
  };

  // Handlers for new modals
  const handleMaintenanceLogSubmit = async (data: any) => {
    console.log("Maintenance Log Submitted:", data);
    setMaintenanceLogs(prevLogs => [data, ...prevLogs]); // Add new log to the beginning
    toast({
      title: isRTL ? "نجاح" : "Success",
      description: isRTL ? "تم حفظ سجل الصيانة بنجاح." : "Maintenance log saved successfully.",
    });
    setIsMaintenanceLogOpen(false);
  };

  const handleServiceReportSubmit = async (data: any) => {
    console.log("Service Report Submitted:", data);
    setServiceReports(prevReports => [data, ...prevReports]); // Add new report to the beginning
    toast({
      title: isRTL ? "نجاح" : "Success",
      description: isRTL ? "تم حفظ تقرير الخدمة بنجاح." : "Service report saved successfully.",
    });
    setIsServiceReportOpen(false);
  };

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

  // --- Inject sample document if not present ---
  const sampleDocument = {
    id: "sample-vendor-pdf",
    name: "Vendor List Version 2.pdf",
    type: "manual" as DocumentType,
    status: "verified" as DocumentStatus,
    issueDate: "2024-01-01",
    expiryDate: "2025-01-01",
    issuedBy: "Vendor Department",
    fileUrl: "/lovable-uploads/Vendor List Version 2.pdf",
  };
  const documentsWithSample = equipment.documents.some(doc => doc.id === sampleDocument.id)
    ? equipment.documents
    : [sampleDocument, ...equipment.documents];
  // --- Mock history and maintenance data ---
  const mockHistory = [
    { date: "2024-03-01", event: "Inspection completed", by: "Inspector A" },
    { date: "2024-02-15", event: "Assigned to John Doe", by: "System" },
    { date: "2024-01-10", event: "Status changed to Active", by: "Admin" },
  ];
  const mockMaintenance = [
    { date: "2024-04-10", action: "Oil Change", by: "Tech B", status: "Completed" },
    { date: "2024-03-20", action: "Filter Replacement", by: "Tech C", status: "Completed" },
    { date: "2024-02-05", action: "Scheduled Maintenance", by: "Tech D", status: "Scheduled" },
  ];

  // Sample data for new modals (can be expanded)
  const sampleMaintenanceLogs = [
    {
      id: 'ml-001',
      equipmentInfo: {
        typeOfEquipment: 'Crawler Crane',
        manufacturer: 'Liebherr',
        serialNumber: 'LCC12345',
        location: 'Site A',
        dateManufactured: '2020-05-15',
        dateInService: '2020-06-01',
      },
      maintenanceActivities: [
        { id: 'ma-001', date: '2024-05-01', description: 'Monthly lubrication and fluid check', performedBy: 'John Doe', validatedBy: 'Jane Smith', dateOfValidation: '2024-05-02', nextActivityDue: '2024-06-01', remarks: 'All good' },
        { id: 'ma-002', date: '2023-11-01', description: '6-month major service', performedBy: 'Service Team A', validatedBy: 'Supervisor X', dateOfValidation: '2023-11-03', nextActivityDue: '2024-05-01', remarks: 'Replaced hydraulic filters' },
      ],
      footer: {
        supervisorName: 'Ahmed Al-Qahtani',
        signatureDate: '2024-05-02',
        formReference: 'EQML-001',
        revisionTracking: 'Rev 1.0',
      },
    },
  ];

  const sampleServiceReports = [
    {
      id: 'sr-001',
      reportNumber: 'SR-00123',
      customerDetails: {
        customerName: 'ABC Construction',
        serviceLocation: 'Project Site B',
      },
      equipmentDetails: {
        equipmentType: 'Excavator',
        modelNumber: 'CAT320',
        engineNumber: 'ENG789',
        chassisSerialNumber: 'EXC98765',
        serviceDate: '2024-04-20',
        warrantyStatus: 'no_warranty',
      },
      serviceDetails: {
        natureOfComplaint: 'Hydraulic leak from main pump',
        detailedServiceDescription: 'Identified worn seal in hydraulic pump. Replaced seal and refilled hydraulic fluid. Tested system for leaks, none found. Cleaned work area.',
        partsUsed: [
          { id: 'pu-001', name: 'Hydraulic Pump Seal Kit', quantity: 1, unitCost: 150.00 },
          { id: 'pu-002', name: 'Hydraulic Fluid (20L)', quantity: 2, unitCost: 80.00 },
        ],
      },
      customerFeedback: 'Service was prompt and effective. Issue resolved.',
      signatures: {
        gmgtRepresentativeName: 'Fatima Al-Hamad',
        gmgtSignatureDate: '2024-04-20',
        customerRepresentativeName: 'Mohammed Zaki',
        customerSignatureDate: '2024-04-20',
      },
    },
  ];

  // Initialize states with sample data if they are empty, ensuring they are not re-added on re-render
  useEffect(() => {
    if (maintenanceLogs.length === 0 && sampleMaintenanceLogs.length > 0) {
      setMaintenanceLogs(sampleMaintenanceLogs);
    }
    if (serviceReports.length === 0 && sampleServiceReports.length > 0) {
      setServiceReports(sampleServiceReports);
    }
  }, [maintenanceLogs.length, serviceReports.length]);

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false);
    // You would typically call an API to update the equipment
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
            <h1 className="text-2xl font-bold">{equipment.name}</h1>
            <p className="text-muted-foreground">{equipment.model} • {equipment.trafficPlateNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDailyChecklistOpen(true)}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            {isRTL ? "الفحص اليومي" : "Daily Inspection"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonthlyChecklistOpen(true)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {isRTL ? "الفحص الشهري" : "Monthly Inspection"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsMaintenanceLogOpen(true)}>
            <ScrollText className="h-4 w-4 mr-2" />
            {isRTL ? "سجل الصيانة" : "Maintenance Log"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsServiceReportOpen(true)}>
            <ClipboardList className="h-4 w-4 mr-2" />
            {isRTL ? "تقرير الخدمة" : "Service Report"}
          </Button>
          {/* QR Code Button */}
          <Button variant="outline" size="sm" onClick={() => setIsQrModalOpen(true)}>
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M7 17v1a3 3 0 0 0 3 3h1"/></svg>
            {isRTL ? "رمز QR" : "Generate QR Code"}
          </Button>
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
      {/* Remove Notes Section and Daily/Monthly Inspection Cards, add two buttons instead */}
      {/* Removed the old Daily/Monthly Inspection buttons section */}
     
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
                <span className="text-sm text-muted-foreground">{isRTL ? "رقم اللوحة:" : "Plate Number:"}</span>
                <span className="text-sm font-medium">{equipment.trafficPlateNumber}</span>
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

      

      {/* Rest of the existing content... */}
      
      {/* Update the History tab to include inspections */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
          <TabsTrigger value="documents">
            {isRTL ? "الوثائق" : "Documents"}
          </TabsTrigger>
          <TabsTrigger value="history">
            {isRTL ? "السجل" : "History"}
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            {isRTL ? "الصيانة / تقرير الخدمة" : "Maintenance/Service Report"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <DocumentList documents={documentsWithSample} />
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Daily Inspections Section */}
                <div>
                  <h3 className="font-medium text-lg mb-4">
                    {isRTL ? "سجل الفحص اليومي" : "Daily Inspection History"}
                  </h3>
                  <div className="space-y-2">
                    {equipment.dailyInspections?.slice(0, 5).map((inspection, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm border-b pb-2">
                        <div>
                          <span className="font-medium">
                            {isRTL ? "الفحص اليومي" : "Daily Inspection"}
                          </span>
                          <div className="text-muted-foreground">
                            {isRTL ? "بواسطة: " : "By: "}{inspection.operatorName}
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <div>{new Date(inspection.date).toLocaleDateString()}</div>
                          <Badge variant={inspection.status === 'completed' ? "default" : "secondary"}>
                            {inspection.status === 'completed' 
                              ? (isRTL ? "مكتمل" : "Completed")
                              : (isRTL ? "غير مكتمل" : "Incomplete")}
                          </Badge>
                          <Button
                            size="xs"
                            variant="outline"
                            className="mt-1"
                            onClick={() => {
                              setSelectedDailyInspection(inspection);
                              setIsDailyReportOpen(true);
                            }}
                          >
                            {isRTL ? "عرض التقرير" : "View Report"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Inspections Section */}
                <div>
                  <h3 className="font-medium text-lg mb-4">
                    {isRTL ? "سجل الفحص الفني" : "Technical Inspection History"}
                  </h3>
                  <div className="space-y-2">
                    {equipment.monthlyInspections?.slice(0, 5).map((inspection, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm border-b pb-2">
                        <div>
                          <span className="font-medium">
                            {isRTL ? "الفحص الفني" : "Technical Inspection"}
                          </span>
                          <div className="text-muted-foreground">
                            {isRTL ? "بواسطة: " : "By: "}{inspection.technicianName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {isRTL ? "الفحص القادم: " : "Next due: "}
                            {new Date(inspection.nextInspectionDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <div>{new Date(inspection.date).toLocaleDateString()}</div>
                          <Badge variant={inspection.status === 'completed' ? "default" : "secondary"}>
                            {inspection.status === 'completed'
                              ? (isRTL ? "مكتمل" : "Completed")
                              : (isRTL ? "غير مكتمل" : "Incomplete")}
                          </Badge>
                          <Button
                            size="xs"
                            variant="outline"
                            className="mt-1"
                            onClick={() => {
                              setSelectedMonthlyInspection(inspection);
                              setIsMonthlyReportOpen(true);
                            }}
                          >
                            {isRTL ? "عرض التقرير" : "View Report"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* General History Events */}
                <div>
                  <h3 className="font-medium text-lg mb-4">
                    {isRTL ? "السجل العام" : "General History"}
                  </h3>
                  <div className="space-y-2">
                    {mockHistory.map((h, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="font-medium">{h.event}</span>
                        <span className="text-muted-foreground">{h.date} — {h.by}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-2">
                {mockMaintenance.map((m, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-medium">{m.action}</span>
                    <span className="text-muted-foreground">{m.date} — {m.by} — {m.status}</span>
                  </div>
                ))}

                {/* Display Maintenance Logs */}
                {maintenanceLogs.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-base mb-3">{isRTL ? "سجلات الصيانة" : "Maintenance Logs"}</h4>
                    <div className="space-y-3">
                      {maintenanceLogs.map((log, logIdx) => (
                        <div key={log.id || `ml-${logIdx}`} className="border rounded-lg p-3 bg-white shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-sm">
                              {isRTL ? `سجل الصيانة لـ ${log.equipmentInfo?.typeOfEquipment || ''}` : `Maintenance Log for ${log.equipmentInfo?.typeOfEquipment || ''}`}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {log.footer?.signatureDate ? new Date(log.footer.signatureDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {isRTL ? "الأنشطة: " : "Activities: "}
                            {log.maintenanceActivities.map((act: any) => act.description).join('; ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {isRTL ? "بواسطة: " : "By: "}{log.footer?.supervisorName || 'N/A'}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => {
                              setSelectedMaintenanceLog(log);
                              setIsMaintenanceLogReportOpen(true);
                            }}
                          >
                            {isRTL ? "عرض التقرير" : "View Report"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Display Service Reports */}
                {serviceReports.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-base mb-3">{isRTL ? "تقارير الخدمة" : "Service Reports"}</h4>
                    <div className="space-y-3">
                      {serviceReports.map((report, reportIdx) => (
                        <div key={report.id || `sr-${reportIdx}`} className="border rounded-lg p-3 bg-white shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-sm">
                              {isRTL ? `تقرير الخدمة رقم ${report.reportNumber}` : `Service Report No. ${report.reportNumber}`}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {report.equipmentDetails?.serviceDate ? new Date(report.equipmentDetails.serviceDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {isRTL ? "الشكوى: " : "Complaint: "}{report.serviceDetails?.natureOfComplaint || 'N/A'}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {isRTL ? "الوصف: " : "Description: "}{report.serviceDetails?.detailedServiceDescription || 'N/A'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {isRTL ? "العميل: " : "Customer: "}{report.customerDetails?.customerName || 'N/A'}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => {
                              setSelectedServiceReport(report);
                              setIsServiceReportDialogOpen(true);
                            }}
                          >
                            {isRTL ? "عرض التقرير" : "View Report"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Inspection Dialogs */}
      <DailyChecklistDialog
        equipment={equipment}
        open={isDailyChecklistOpen}
        onOpenChange={setIsDailyChecklistOpen}
        onSubmit={handleInspectionSubmit}
      />
      
      <MonthlyInspectionDialog
        equipment={equipment}
        open={isMonthlyChecklistOpen}
        onOpenChange={setIsMonthlyChecklistOpen}
        onSubmit={handleInspectionSubmit}
      />

      {/* New Modals */}
      <EquipmentMaintenanceLogModal
        open={isMaintenanceLogOpen}
        onOpenChange={setIsMaintenanceLogOpen}
        equipment={equipment}
        onSubmit={handleMaintenanceLogSubmit}
        loading={false}
      />

      <ServiceReportModal
        open={isServiceReportOpen}
        onOpenChange={setIsServiceReportOpen}
        equipment={equipment}
        onSubmit={handleServiceReportSubmit}
        loading={false}
      />

      {/* Daily Inspection Report Dialog */}
      {selectedDailyInspection && (
        <DailyInspectionReportDialog
          open={isDailyReportOpen}
          onOpenChange={setIsDailyReportOpen}
          inspection={selectedDailyInspection}
          equipment={equipment}
          headerFields={{
            machinery: equipment.name,
            trafficPlateNumber: equipment.trafficPlateNumber || '',
            company: equipment.company || '',
            month: selectedDailyInspection.date ? new Date(selectedDailyInspection.date).toLocaleString('default', { month: 'long', year: 'numeric' }) : '',
            issueDate: selectedDailyInspection.date ? new Date(selectedDailyInspection.date).toISOString().split('T')[0] : '',
            project: equipment.project || '',
          }}
        />
      )}

      {/* Monthly Inspection Report Dialog */}
      {selectedMonthlyInspection && (
        <MonthlyInspectionReportDialog
          open={isMonthlyReportOpen}
          onOpenChange={setIsMonthlyReportOpen}
          inspection={selectedMonthlyInspection}
          equipment={equipment}
          headerFields={{
            project: equipment.project || '',
            subcontractor: equipment.subcontractor || '',
            chassisNo: equipment.chassisNo || '',
            driverName: selectedMonthlyInspection.driverName || '',
            inspectorName: selectedMonthlyInspection.technicianName || '',
          }}
        />
      )}

      {/* QR Code Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="flex flex-col items-center p-8">
          <DialogHeader>
            <DialogTitle>
              {isRTL ? "رمز الاستجابة السريعة للمعدة" : "Equipment QR Code"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center my-4">
            <QRCode value={equipment.trafficPlateNumber || equipment.id || equipment.name} size={180} />
            <div className="flex flex-col items-center mt-4">
              <div className="font-medium text-lg">{equipment.type || equipment.name}</div>
              <div className="text-base mt-1">
                {isRTL ? "رقم اللوحة: " : "Plate number: "}
                <span className="font-semibold">
                  {equipment.trafficPlateNumber || (isRTL ? "غير متوفر" : "N/A")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white px-6"
              onClick={() => setIsQrModalOpen(false)}
            >
              {isRTL ? "إغلاق" : "Close"}
            </Button>
            <Button
              variant="outline"
              className="border px-6"
              onClick={() => window.print()}
            >
              {isRTL ? "طباعة" : "Print"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Maintenance Log Report Dialog */}
      {selectedMaintenanceLog && (
  <Dialog open={isMaintenanceLogReportOpen} onOpenChange={setIsMaintenanceLogReportOpen}>
    <DialogContent className="w-[95vw] max-w-[1200px] h-[90vh] overflow-hidden rounded-lg shadow-lg bg-background border">
      {/* Header Section */}
      <DialogHeader className="pb-4 border-b border-border bg-card px-6 pt-6">
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-md">
              <Wrench className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isRTL ? "تقرير سجل الصيانة" : "Maintenance Log Report"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isRTL ? `تم في ${new Date(selectedMaintenanceLog.createdAt || Date.now()).toLocaleDateString('ar')}` : `Generated on ${new Date(selectedMaintenanceLog.createdAt || Date.now()).toLocaleDateString()}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
              {isRTL ? 'سجل صيانة' : 'Maintenance Log'}
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
        
        {/* Equipment Information Card */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-md">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {isRTL ? "معلومات المعدات" : "Equipment Information"}
            </h3>
          </div>
          
          {Object.keys(selectedMaintenanceLog.equipmentInfo || {}).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(selectedMaintenanceLog.equipmentInfo || {}).map(([key, value]) => (
                <div key={key} className="bg-muted p-4 rounded-md border border-border">
                  <div className="text-xs font-medium text-blue-500 uppercase tracking-wide mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground break-words">
                    {value || (isRTL ? 'غير محدد' : 'Not specified')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{isRTL ? 'لا توجد معلومات معدات متاحة' : 'No equipment information available'}</p>
            </div>
          )}
        </div>

        {/* Maintenance Activities Card */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500 rounded-md">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {isRTL ? "أنشطة الصيانة" : "Maintenance Activities"}
            </h3>
            <div className="ml-auto px-2 py-1 bg-status-valid text-status-valid-foreground rounded-full text-xs font-medium">
              {selectedMaintenanceLog.maintenanceActivities?.length || 0} {isRTL ? 'نشاط' : 'Activities'}
            </div>
          </div>
          
          {selectedMaintenanceLog.maintenanceActivities && selectedMaintenanceLog.maintenanceActivities.length > 0 ? (
            <div className="space-y-4">
              {selectedMaintenanceLog.maintenanceActivities.map((activity: any, index: number) => (
                <div key={activity.id || index} className="bg-muted p-4 rounded-md border border-border hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-card-foreground">
                      {isRTL ? `النشاط ${index + 1}` : `Activity ${index + 1}`}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(activity).map(([key, value]) => (
                      <div key={key} className="bg-background p-3 rounded-sm border border-border">
                        <div className="text-xs font-medium text-green-500 uppercase tracking-wide mb-1">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div className="text-sm text-foreground break-words">
                          {value || (isRTL ? 'غير محدد' : 'Not specified')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{isRTL ? 'لا توجد أنشطة صيانة مسجلة' : 'No maintenance activities recorded'}</p>
            </div>
          )}
        </div>

        {/* Signatures Card */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500 rounded-md">
              <PenTool className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {isRTL ? "التوقيعات والمراجعة" : "Signatures & Review"}
            </h3>
          </div>
          
          {Object.keys(selectedMaintenanceLog.footer || {}).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedMaintenanceLog.footer || {}).map(([key, value]) => (
                <div key={key} className="bg-muted p-4 rounded-md border border-border">
                  <div className="text-xs font-medium text-purple-500 uppercase tracking-wide mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground break-words">
                    {value || (isRTL ? 'غير محدد' : 'Not specified')}
                  </div>
                  {/* Signature line visual */}
                  <div className="mt-3 border-b-2 border-dashed border-border pb-2">
                    <div className="text-xs text-purple-500">{isRTL ? 'خط التوقيع' : 'Signature Line'}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <PenTool className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{isRTL ? 'لا توجد توقيعات متاحة' : 'No signatures available'}</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-md">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-blue-500 font-medium">{isRTL ? 'تاريخ السجل' : 'Log Date'}</div>
                <div className="text-lg font-bold text-card-foreground">
                  {new Date(selectedMaintenanceLog.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-md">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-green-500 font-medium">{isRTL ? 'الأنشطة المكتملة' : 'Activities Completed'}</div>
                <div className="text-lg font-bold text-card-foreground">
                  {selectedMaintenanceLog.maintenanceActivities?.length || 0}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-md">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-purple-500 font-medium">{isRTL ? 'المراجعين' : 'Reviewers'}</div>
                <div className="text-lg font-bold text-card-foreground">
                  {Object.keys(selectedMaintenanceLog.footer || {}).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex justify-end gap-3 p-6 border-t border-border bg-card">
        <Button 
          variant="outline" 
          onClick={() => setIsMaintenanceLogReportOpen(false)} 
          className="px-6 py-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
        >
          {isRTL ? "إغلاق" : "Close"}
        </Button>
        <Button 
          onClick={() => window.print()} 
          className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
        >
          <FileText className="h-4 w-4 mr-2" />
          {isRTL ? "طباعة التقرير" : "Print Report"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)}

      {/* Service Report Dialog */}
     {/* Service Report Dialog */}
{selectedServiceReport && (
  <Dialog open={isServiceReportDialogOpen} onOpenChange={setIsServiceReportDialogOpen}>
    <DialogContent className="w-[95vw] max-w-[1200px] h-[90vh] overflow-hidden rounded-lg shadow-lg bg-background border">
      {/* Header Section */}
      <DialogHeader className="pb-4 border-b border-border bg-card px-6 pt-6">
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-md">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isRTL ? "تقرير الخدمة" : "Service Report"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isRTL ? `تم في ${new Date(selectedServiceReport.createdAt || Date.now()).toLocaleDateString('ar')}` : `Generated on ${new Date(selectedServiceReport.createdAt || Date.now()).toLocaleDateString()}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
              {isRTL ? 'تقرير خدمة' : 'Service Report'}
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
        
        {/* Customer Details Card */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-md">
              <User className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {isRTL ? "تفاصيل العميل" : "Customer Details"}
            </h3>
          </div>
          
          {Object.keys(selectedServiceReport.customerDetails || {}).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(selectedServiceReport.customerDetails || {}).map(([key, value]) => (
                <div key={key} className="bg-muted p-4 rounded-md border border-border">
                  <div className="text-xs font-medium text-blue-500 uppercase tracking-wide mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground break-words">
                    {value || (isRTL ? 'غير محدد' : 'Not specified')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{isRTL ? 'لا توجد تفاصيل عميل متاحة' : 'No customer details available'}</p>
            </div>
          )}
        </div>

        {/* Equipment Details Card */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500 rounded-md">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {isRTL ? "تفاصيل المعدات" : "Equipment Details"}
            </h3>
          </div>
          
          {Object.keys(selectedServiceReport.equipmentDetails || {}).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(selectedServiceReport.equipmentDetails || {}).map(([key, value]) => (
                <div key={key} className="bg-muted p-4 rounded-md border border-border">
                  <div className="text-xs font-medium text-orange-500 uppercase tracking-wide mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground break-words">
                    {value || (isRTL ? 'غير محدد' : 'Not specified')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{isRTL ? 'لا توجد تفاصيل معدات متاحة' : 'No equipment details available'}</p>
            </div>
          )}
        </div>

        {/* Service Details Card */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500 rounded-md">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {isRTL ? "تفاصيل الخدمة" : "Service Details"}
            </h3>
          </div>
          
          {Object.keys(selectedServiceReport.serviceDetails || {}).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(selectedServiceReport.serviceDetails || {}).map(([key, value]) => (
                <div key={key} className="bg-muted p-4 rounded-md border border-border">
                  <div className="text-xs font-medium text-green-500 uppercase tracking-wide mb-2">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-sm text-foreground">
                    {Array.isArray(value) ? (
                      <div className="space-y-2">
                        {value.map((item, index) => (
                          <div key={index} className="bg-background p-3 rounded-sm border border-border">
                            <div className="font-medium text-xs text-green-500 mb-1">
                              {isRTL ? `العنصر ${index + 1}` : `Item ${index + 1}`}
                            </div>
                            <div className="text-sm">
                              {typeof item === 'object' ? (
                                <div className="space-y-1">
                                  {Object.entries(item).map(([k, v]) => (
                                    <div key={k} className="flex justify-between">
                                      <span className="font-medium text-muted-foreground">{k}:</span>
                                      <span className="text-foreground">{String(v)}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                String(item)
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-foreground break-words">
                        {value || (isRTL ? 'غير محدد' : 'Not specified')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{isRTL ? 'لا توجد تفاصيل خدمة متاحة' : 'No service details available'}</p>
            </div>
          )}
        </div>

        {/* Customer Feedback Card */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500 rounded-md">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {isRTL ? "ملاحظات العميل" : "Customer Feedback"}
            </h3>
          </div>
          
          {selectedServiceReport.customerFeedback ? (
            <div className="bg-muted p-4 rounded-md border border-border">
              <div className="text-sm text-foreground leading-relaxed">
                {selectedServiceReport.customerFeedback}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{isRTL ? 'لا توجد ملاحظات عميل متاحة' : 'No customer feedback available'}</p>
            </div>
          )}
        </div>

        {/* Signatures Card */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500 rounded-md">
              <PenTool className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {isRTL ? "التوقيعات" : "Signatures"}
            </h3>
          </div>
          
          {Object.keys(selectedServiceReport.signatures || {}).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedServiceReport.signatures || {}).map(([key, value]) => (
                <div key={key} className="bg-muted p-4 rounded-md border border-border">
                  <div className="text-xs font-medium text-purple-500 uppercase tracking-wide mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground break-words">
                    {value || (isRTL ? 'غير محدد' : 'Not specified')}
                  </div>
                  {/* Signature line visual */}
                  <div className="mt-3 border-b-2 border-dashed border-border pb-2">
                    <div className="text-xs text-purple-500">{isRTL ? 'خط التوقيع' : 'Signature Line'}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <PenTool className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{isRTL ? 'لا توجد توقيعات متاحة' : 'No signatures available'}</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-md">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-blue-500 font-medium">{isRTL ? 'تاريخ التقرير' : 'Report Date'}</div>
                <div className="text-lg font-bold text-card-foreground">
                  {new Date(selectedServiceReport.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-md">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-green-500 font-medium">{isRTL ? 'حالة الخدمة' : 'Service Status'}</div>
                <div className="text-lg font-bold text-card-foreground">
                  {isRTL ? 'مكتملة' : 'Completed'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-md">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-purple-500 font-medium">{isRTL ? 'الموقعين' : 'Signatories'}</div>
                <div className="text-lg font-bold text-card-foreground">
                  {Object.keys(selectedServiceReport.signatures || {}).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex justify-end gap-3 p-6 border-t border-border bg-card">
        <Button 
          variant="outline" 
          onClick={() => setIsServiceReportDialogOpen(false)} 
          className="px-6 py-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
        >
          {isRTL ? "إغلاق" : "Close"}
        </Button>
        <Button 
          onClick={() => window.print()} 
          className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
        >
          <FileText className="h-4 w-4 mr-2" />
          {isRTL ? "طباعة التقرير" : "Print Report"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)}
    </div>
  );
}