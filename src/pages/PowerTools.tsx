import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  AlertCircle, 
  AlertTriangle, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Clock, 
  Download, 
  Edit, 
  Plus, 
  Share2, 
  Clipboard, 
  CalendarCheck,
  X,
  Camera,
  Wrench,
  Lightbulb,
  FileText,
  Eye,
  Search,
  Filter,
  ImageIcon,
  MapPin,
  User,
  ScrollText,
  ClipboardList,
} from 'lucide-react';
import { PowerToolDailyChecklistDialog } from '@/components/power-tools/PowerToolDailyChecklistDialog';
import { PowerToolMonthlyInspectionDialog } from '@/components/power-tools/PowerToolMonthlyInspectionDialog';
import { EquipmentMaintenanceLogModal } from '@/components/equipment/EquipmentMaintenanceLogModal';
import { ServiceReportModal } from '@/components/equipment/ServiceReportModal';
import { SAMPLE_POWER_TOOLS } from '@/data/sample-power-tools';
import type { DailyInspection, MonthlyInspection } from '@/types/inspection';
import type { PowerTool } from '@/types/power-tools';
import type { Equipment } from '@/types/equipment'; // Import Equipment type

// ShareToolModal component
const ShareToolModal = ({
  open,
  onOpenChange,
  tool,
  onShare,
  loading,
  isRTL,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: PowerTool | null;
  onShare: (data: { email?: string; link?: string }) => void;
  loading: boolean;
  isRTL: boolean;
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [shareMethod, setShareMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    if (tool) {
      setShareLink(`https://example.com/tool/${tool.id}`);
    }
  }, [tool]);

  const handleShare = () => {
    if (shareMethod === "email" && !email.trim()) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى إدخال بريد إلكتروني صالح" : "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    onShare(shareMethod === "email" ? { email } : { link: shareLink });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isRTL ? "مشاركة الأداة" : "Share Tool"}
          </DialogTitle>
          <DialogDescription>
            {isRTL
              ? "شارك تفاصيل الأداة عبر البريد الإلكتروني أو رابط."
              : "Share tool details via email or a link."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="share-method">
              {isRTL ? "طريقة المشاركة" : "Share Method"}
            </Label>
            <Select
              value={shareMethod}
              onValueChange={setShareMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? "اختر طريقة" : "Select method"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">{isRTL ? "بريد إلكتروني" : "Email"}</SelectItem>
                <SelectItem value="link">{isRTL ? "رابط" : "Link"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {shareMethod === "email" ? (
            <div className="grid gap-2">
              <Label htmlFor="email">{isRTL ? "البريد الإلكتروني" : "Email Address"}</Label>
              <Input
                id="email"
                type="email"
                placeholder={isRTL ? "أدخل البريد الإلكتروني" : "Enter email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="share-link">{isRTL ? "رابط المشاركة" : "Shareable Link"}</Label>
              <Input
                id="share-link"
                value={shareLink}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  toast({
                    title: isRTL ? "تم النسخ" : "Copied",
                    description: isRTL ? "تم نسخ الرابط إلى الحافظة" : "Link copied to clipboard",
                  });
                }}
              >
                {isRTL ? "نسخ الرابط" : "Copy Link"}
              </Button>
            </div>
          )}

          {tool && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">{tool.toolName}</p>
              <p className="text-xs text-muted-foreground">{tool.toolId}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleShare} disabled={loading}>
            {loading ? (isRTL ? "جارٍ المشاركة..." : "Sharing...") : (isRTL ? "مشاركة" : "Share")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Move this function outside the component or into a proper scope
const getNextInspectionDate = (nextInspection: Date) => {
  return nextInspection.toLocaleDateString();
};

// Helper functions for inspection validation
const isInspectionDue = (tool: PowerTool) => {
  if (!tool.lastInspectionDate) return true;

  const today = new Date();
  const lastInspection = new Date(tool.lastInspectionDate);
  const daysSinceLastInspection = Math.floor((today.getTime() - lastInspection.getTime()) / (1000 * 60 * 60 * 24));

  switch (tool.inspectionFrequency) {
    case 'daily':
      return daysSinceLastInspection >= 1;
    case 'weekly':
      return daysSinceLastInspection >= 7;
    case 'monthly':
      return daysSinceLastInspection >= 30;
    case 'quarterly':
      return daysSinceLastInspection >= 90;
    default:
      return true;
  }
};

// Helper function to map PowerTool to Equipment
const mapPowerToolToEquipment = (tool: PowerTool): Equipment => {
  return {
    id: tool.id,
    name: tool.toolName,
    model: tool.modelNumber,
    serialNumber: tool.toolId,
    category: 'power-tool', // Assuming PowerTool always maps to 'power-tool' category
    status: tool.status === 'active' ? 'active' :
            tool.status === 'maintenance' ? 'maintenance' :
            'decommissioned', // This covers 'inactive'
    complianceScore: 100, // Default or calculate based on inspectionStatus if needed
    nextInspectionDate: tool.nextCalibrationDue?.toISOString() || '',
    purchaseDate: tool.purchaseDate?.toISOString() || '',
    documents: [], // PowerTool does not have documents directly
    notes: tool.remarks,
    assignedTo: tool.assignedTo,
    location: tool.assignedLocation,
    parentEquipmentId: undefined, // PowerTool doesn't have this, keep undefined
    image: tool.image,
    dailyInspections: tool.dailyInspections,
    monthlyInspections: tool.monthlyInspections,
  };
};

const PowerTools = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [dailyInspectionOpen, setDailyInspectionOpen] = useState(false);
  const [monthlyInspectionOpen, setMonthlyInspectionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTool, setSelectedTool] = useState<PowerTool | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [tools, setTools] = useState<PowerTool[]>(SAMPLE_POWER_TOOLS);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PowerTool, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState("Project A");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMaintenanceLogOpen, setIsMaintenanceLogOpen] = useState(false); // New state for maintenance log modal
  const [isServiceReportOpen, setIsServiceReportOpen] = useState(false); // New state for service report modal
  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([
    {
      equipmentInfo: {
        typeOfEquipment: "Angle Grinder",
        manufacturer: "DeWalt",
        serialNumber: "DW12345",
        location: "Workshop A",
        dateManufactured: "2022-01-15",
        dateInService: "2022-02-01",
      },
      maintenanceActivities: [
        {
          id: "ml-1-act-1",
          date: "2023-03-10",
          description: "Replaced carbon brushes, cleaned motor. Standard preventative maintenance.",
          performedBy: "Ahmed Khan",
          validatedBy: "Fatima Ali",
          dateOfValidation: "2023-03-11",
          nextActivityDue: "2024-03-10",
          remarks: "Tool operating smoothly after maintenance.",
        },
        {
          id: "ml-1-act-2",
          date: "2023-09-20",
          description: "Checked gear lubrication and replaced power cord due to wear.",
          performedBy: "Yousef Al-Mansoori",
          validatedBy: "Fatima Ali",
          dateOfValidation: "2023-09-21",
          nextActivityDue: "2024-09-20",
          remarks: "No unusual wear detected on gears. Cord replaced successfully.",
        },
      ],
      footer: {
        supervisorName: "Omar Abdullah",
        signatureDate: "2023-09-21",
        formReference: "EQML-001",
        revisionTracking: "Rev 1.0",
      },
    },
  ]); // State to hold maintenance logs
  const [serviceReports, setServiceReports] = useState<any[]>([
    {
      reportNumber: "SR-00123",
      customerDetails: {
        customerName: "Falcon Construction LLC",
        serviceLocation: "Project B Site Office",
      },
      equipmentDetails: {
        equipmentType: "Excavator",
        modelNumber: "CAT 320D",
        engineNumber: "C6.4ACERT",
        chassisSerialNumber: "ABCDEFG12345",
        serviceDate: "2023-11-05",
        warrantyStatus: "no_warranty",
      },
      serviceDetails: {
        natureOfComplaint: "Hydraulic leak from boom cylinder.",
        detailedServiceDescription: "Identified leak in boom cylinder seal. Replaced hydraulic cylinder seal kit and refilled hydraulic fluid. Tested for leaks, none observed.",
        partsUsed: [
          { id: "sr-1-part-1", name: "Boom Cylinder Seal Kit", quantity: 1, unitCost: 150.00 },
          { id: "sr-1-part-2", name: "Hydraulic Fluid (ISO VG 46)", quantity: 20, unitCost: 10.00 },
        ],
      },
      customerFeedback: "Excellent service, very quick response and professional repair.",
      signatures: {
        gmgtRepresentativeName: "Mohammed Jassim",
        gmgtSignatureDate: "2023-11-05",
        customerRepresentativeName: "Khalid Al-Hajri",
        customerSignatureDate: "2023-11-05",
      },
    },
  ]); // State to hold service reports
  
  // Form state for bio-data entry
  const [formData, setFormData] = useState<Partial<PowerTool>>({
    toolName: "",
    toolId: "",
    toolType: "",
    manufacturer: "",
    modelNumber: "",
    powerRating: "",
    toolSize: "",
    weight: "",
    purchaseDate: null,
    vendor: "",
    condition: "new",
    assignedLocation: "",
    assignedTo: "",
    certificateNo: "",
    certificateIssueDate: null,
    certificateExpiryDate: null,
    nextCalibrationDue: null,
    inspectionFrequency: "monthly",
    lastInspectionDate: null,
    inspectionStatus: "passed",
    remarks: "",
    operatorLicenseRequired: false,
    operatorName: "",
    storageLocation: "",
    safetyAccessories: "",
    status: "active",
    project: "Project A"
  });

  // New state variables for edit functionality
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTool, setEditingTool] = useState<PowerTool | null>(null);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "new": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "good": return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "maintenance": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "damaged": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Form validation
  const validateForm = () => {
    const errors: Partial<Record<keyof PowerTool, string>> = {};
    
    if (!formData.toolName) errors.toolName = isRTL ? "اسم الأداة مطلوب" : "Tool Name is required";
    if (!formData.toolId) errors.toolId = isRTL ? "رقم الأداة مطلوب" : "Tool ID is required";
    if (!formData.toolType) errors.toolType = isRTL ? "نوع الأداة مطلوب" : "Tool Type is required";
    if (!formData.manufacturer) errors.manufacturer = isRTL ? "الشركة المصنعة مطلوبة" : "Manufacturer is required";
    if (!formData.condition) errors.condition = isRTL ? "حالة الأداة مطلوبة" : "Tool Condition is required";
    if (!formData.assignedLocation) errors.assignedLocation = isRTL ? "الموقع المخصص مطلوب" : "Assigned Location is required";
    if (!formData.assignedTo) errors.assignedTo = isRTL ? "التخصيص إلى مطلوب" : "Assigned To is required";
    if (!formData.project) errors.project = isRTL ? "المشروع مطلوب" : "Project is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Image handling
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: isRTL ? "خطأ" : "Error",
          description: isRTL ? "حجم الصورة يتجاوز 10 ميغابايت" : "Image size exceeds 10MB",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        handleInputChange('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    handleInputChange('image', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Enhanced handleInputChange
  const handleInputChange = (field: keyof PowerTool, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // New handler functions for view and edit
  const handleViewTool = (tool: PowerTool, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTool(tool);
    setViewMode('detail');
    setActiveTab('detail');
    setIsEditMode(false);
  };

  const handleEditTool = (tool: PowerTool, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingTool(tool);
    setFormData(tool);
    setImagePreview(tool.image || null);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  const handleShareTool = (tool: PowerTool, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTool(tool);
    setIsShareModalOpen(true);
  };

  const handleShare = (shareData: { email?: string; link?: string }) => {
    setIsShareModalOpen(false);
    toast({
      title: isRTL ? "نجاح" : "Success",
      description: isRTL
        ? `تمت مشاركة الأداة بنجاح عبر ${shareData.email ? "البريد الإلكتروني" : "رابط"}`
        : `Tool shared successfully via ${shareData.email ? "email" : "link"}`,
    });
  };

  const handleSaveTool = () => {
    if (!validateForm()) {
      toast({
        title: isRTL ? "خطأ في النموذج" : "Form Error",
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode && editingTool) {
      // Update existing tool
      setTools(prev => prev.map(tool => 
        tool.id === editingTool.id ? { ...formData, id: tool.id } as PowerTool : tool
      ));
      toast({
        title: isRTL ? "نجاح" : "Success",
        description: isRTL ? "تم تحديث الأداة بنجاح" : "Tool updated successfully",
      });
    } else {
      // Add new tool
      const newTool: PowerTool = {
        ...formData,
        id: formData.toolId || `PT-${Math.random().toString(36).substr(2, 9)}`,
        status: formData.status || 'active',
        operatorLicenseRequired: formData.operatorLicenseRequired === true,
      } as PowerTool;

      setTools(prev => [...prev, newTool]);
      toast({
        title: isRTL ? "نجاح" : "Success",
        description: isRTL ? "تم إضافة الأداة بنجاح" : "Tool added successfully",
      });
    }

    // Reset form and state
    setFormData({
      toolName: "",
      toolId: "",
      toolType: "",
      manufacturer: "",
      modelNumber: "",
      powerRating: "",
      toolSize: "",
      weight: "",
      purchaseDate: null,
      vendor: "",
      condition: "new",
      assignedLocation: "",
      assignedTo: "",
      certificateNo: "",
      certificateIssueDate: null,
      certificateExpiryDate: null,
      nextCalibrationDue: null,
      inspectionFrequency: "monthly",
      lastInspectionDate: null,
      inspectionStatus: "passed",
      remarks: "",
      operatorLicenseRequired: false,
      operatorName: "",
      storageLocation: "",
      safetyAccessories: "",
      status: "active",
      project: "Project A"
    });
    setImagePreview(null);
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingTool(null);
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = searchTerm === "" || 
      tool.toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.toolId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || tool.status === filterStatus;
    const matchesProject = tool.project === selectedProject;
    
    return matchesSearch && matchesFilter && matchesProject;
  });

  // Statistics
  const stats = {
    total: filteredTools.length,
    active: filteredTools.filter(t => t.status === 'active').length,
    maintenance: filteredTools.filter(t => t.status === 'maintenance').length,
    dueCalibration: filteredTools.filter(t => 
      t.nextCalibrationDue && new Date(t.nextCalibrationDue) <= new Date()
    ).length,
    byType: filteredTools.reduce((acc, tool) => {
      acc[tool.toolType] = (acc[tool.toolType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    expiredCerts: filteredTools.filter(t => 
      t.certificateExpiryDate && new Date(t.certificateExpiryDate) <= new Date()
    ).length
  };

  const DatePicker = ({ date, onDateChange, placeholder }: {
    date: Date | null;
    onDateChange: (date: Date | undefined) => void;
    placeholder: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
  // Add image preview handler
  const handleImagePreview = (imageUrl: string | undefined, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowImageDialog(true);
    }
  };

  const handleDailyInspectionSubmit = async (inspection: DailyInspection) => {
    try {
      if (!selectedTool || !isInspectionDue(selectedTool)) {
        const nextDate = getNextRequiredInspectionDate(selectedTool!);
        toast({
          title: isRTL ? "تنبيه" : "Warning", 
          description: isRTL ? `الفحص التالي مستحق في ${nextDate}` : `Next inspection is due on ${nextDate}`,
          variant: "default"
        });
        return;
      }

      const updatedTools = tools.map(tool => {
        if (tool.id === selectedTool?.id) {
          const updatedInspection = {
            ...inspection,
            equipmentId: tool.id,
            toolName: tool.toolName,
            serialNumber: tool.toolId,
            manufacturer: tool.manufacturer,
            modelNumber: tool.modelNumber,
            operatorId: 'current-user-id',  
          };
          
          const updatedInspections = [...(tool.dailyInspections || []), updatedInspection];
          const failedItems = inspection.items.filter(item => item.status === 'failed').length;
          const notCheckedItems = inspection.items.filter(item => item.status === 'not-checked').length;
          
          const inspectionStatus: 'passed' | 'needs-service' | 'failed' = notCheckedItems > 0 ? 'needs-service' :
                                 failedItems > 0 ? 'failed' : 'passed';

          return {
            ...tool,
            dailyInspections: updatedInspections,
            lastInspectionDate: new Date(),
            inspectionStatus
          };
        }
        return tool;
      });

      setTools(updatedTools);
      setDailyInspectionOpen(false);
      toast({
        title: isRTL ? "نجاح" : "Success",
        description: isRTL ? "تم حفظ الفحص اليومي بنجاح" : "Daily inspection saved successfully",
      });
    } catch (error) {
      console.error('Error saving daily inspection:', error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "حدث خطأ أثناء حفظ الفحص" : "Error saving inspection",
        variant: "destructive"
      });
    }
  };  const handleMonthlyInspectionSubmit = async (inspection: MonthlyInspection) => {
    try {
      // Validate if inspection is due
      if (!selectedTool || !isInspectionDue(selectedTool)) {
        const nextDate = getNextRequiredInspectionDate(selectedTool!);
        toast({
          title: isRTL ? "تنبيه" : "Warning",
          description: isRTL 
            ? `الفحص التالي مستحق في ${nextDate}`
            : `Next inspection is due on ${nextDate}`,
          variant: "default"
        });
        return;
      }

      // Update the tool with the new monthly inspection
      const updatedTools = tools.map(tool => {
        if (tool.id === selectedTool?.id) {
          const monthlyInspections = tool.monthlyInspections || [];
          // Add the new inspection with tool details
          const updatedInspection = {
            ...inspection,
            equipmentId: tool.id,
            toolName: tool.toolName,
            serialNumber: tool.toolId,
            manufacturer: tool.manufacturer,
            modelNumber: tool.modelNumber,
            technicianName: 'Current Technician', // This should come from auth context
            technicianId: 'current-user-id', // This should come from auth context
          };
          
          const updatedInspections = [...monthlyInspections, updatedInspection];

          // Determine inspection status based on results
          const failedItems = inspection.items.filter(item => item.status === 'failed').length;
          const notCheckedItems = inspection.items.filter(item => item.status === 'not-checked').length;
          
          let inspectionStatus: 'passed' | 'needs-service' | 'failed';
          if (notCheckedItems > 0) {
            inspectionStatus = 'needs-service';
          } else if (failedItems > 0) {
            inspectionStatus = 'failed';
          } else {
            inspectionStatus = 'passed';
          }

          // Update tool with inspection results and dates
          return {
            ...tool,
            monthlyInspections: updatedInspections,
            lastInspectionDate: new Date(),
            nextCalibrationDue: new Date(inspection.nextInspectionDate),
            inspectionStatus
          };
        }
        return tool;
      });
      setTools(updatedTools);
      setMonthlyInspectionOpen(false);
      toast({
        title: isRTL ? "نجاح" : "Success",
        description: isRTL ? "تم حفظ الفحص الشهري بنجاح" : "Monthly inspection saved successfully",
      });
    } catch (error) {
      console.error('Error saving monthly inspection:', error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "حدث خطأ أثناء حفظ الفحص" : "Error saving inspection",
        variant: "destructive"
      });
    }
  };

  const handleMaintenanceLogSubmit = (data: any) => {
    console.log("Maintenance Log Submitted:", data);
    setMaintenanceLogs(prevLogs => [data, ...prevLogs]);
    toast({
      title: isRTL ? "نجاح" : "Success",
      description: isRTL ? "تم حفظ سجل الصيانة بنجاح." : "Maintenance log saved successfully.",
    });
    setIsMaintenanceLogOpen(false);
  };

  const handleServiceReportSubmit = (data: any) => {
    console.log("Service Report Submitted:", data);
    setServiceReports(prevReports => [data, ...prevReports]);
    toast({
      title: isRTL ? "نجاح" : "Success",
      description: isRTL ? "تم حفظ تقرير الخدمة بنجاح." : "Service report saved successfully.",
    });
    setIsServiceReportOpen(false);
  };

  // Helper functions for inspection validation
  const isInspectionDue = (tool: PowerTool) => {
    if (!tool.lastInspectionDate) return true;

    const today = new Date();
    const lastInspection = new Date(tool.lastInspectionDate);
    const daysSinceLastInspection = Math.floor((today.getTime() - lastInspection.getTime()) / (1000 * 60 * 60 * 24));

    switch (tool.inspectionFrequency) {
      case 'daily':
        return daysSinceLastInspection >= 1;
      case 'weekly':
        return daysSinceLastInspection >= 7;
      case 'monthly':
        return daysSinceLastInspection >= 30;
      case 'quarterly':
        return daysSinceLastInspection >= 90;
      default:
        return true;
    }
  };

  const getNextRequiredInspectionDate = (tool: PowerTool) => {
    if (!tool.lastInspectionDate) return 'Immediate inspection required';

    const lastInspection = new Date(tool.lastInspectionDate);
    let nextInspection: Date;

    switch (tool.inspectionFrequency) {
      case 'daily':
        nextInspection = new Date(lastInspection.setDate(lastInspection.getDate() + 1));
        break;
      case 'weekly':
        nextInspection = new Date(lastInspection.setDate(lastInspection.getDate() + 7));
        break;
      case 'monthly':
        nextInspection = new Date(lastInspection.setMonth(lastInspection.getMonth() + 1));
        break;
      case 'quarterly':
        nextInspection = new Date(lastInspection.setMonth(lastInspection.getMonth() + 3));
        break;
      default:
        return 'Invalid inspection frequency';
    }

    return nextInspection.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? "سجل الأدوات الكهربائية" : "Power Tools Registry"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL
                ? "إدارة ومراقبة جميع الأدوات الكهربائية والوثائق المرتبطة بها"
                : "Manage and monitor all power tools and associated documentation"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {isRTL ? "تصدير" : "Export"}
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {isRTL ? "إضافة أداة كهربائية" : "Add Power Tool"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {isEditMode
                      ? (isRTL ? "تعديل الأداة الكهربائية" : "Edit Power Tool")
                      : (isRTL ? "نموذج بيانات الأداة الكهربائية" : "Power Tool Bio-Data Entry")}
                  </DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">{isRTL ? "المعلومات الأساسية" : "Basic Info"}</TabsTrigger>
                    <TabsTrigger value="technical">{isRTL ? "المواصفات الفنية" : "Technical"}</TabsTrigger>
                    <TabsTrigger value="certification">{isRTL ? "الشهادات" : "Certification"}</TabsTrigger>
                    <TabsTrigger value="assignment">{isRTL ? "التخصيص" : "Assignment"}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="toolName">{isRTL ? "اسم الأداة *" : "Tool Name *"}</Label>
                        <Input
                          id="toolName"
                          placeholder={isRTL ? "مثال: صاروخ زاوية، مثقاب مطرقة" : "e.g., Angle Grinder, Hammer Drill"}
                          value={formData.toolName || ""}
                          onChange={(e) => handleInputChange('toolName', e.target.value)}
                        />
                        {formErrors.toolName && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.toolName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="toolId">{isRTL ? "رقم الأداة مطلوب" : "Tool ID is required"}</Label>
                        <Input
                          id="toolId"
                          placeholder={isRTL ? "مثال: PT-00123, SN-87654321" : "e.g., PT-00123, SN-87654321"}
                          value={formData.toolId || ""}
                          onChange={(e) => handleInputChange('toolId', e.target.value)}
                        />
                        {formErrors.toolId && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.toolId}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="toolType">{isRTL ? "نوع الأداة *" : "Tool Type *"}</Label>
                        <Select value={formData.toolType || ""} onValueChange={(value) => handleInputChange('toolType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? "اختر نوع الأداة" : "Select tool type"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electric">
                              {isRTL ? "كهربائي" : "Electric"}
                            </SelectItem>
                            <SelectItem value="battery">
                              {isRTL ? "بطارية" : "Battery"}
                            </SelectItem>
                            <SelectItem value="pneumatic">
                              {isRTL ? "هوائي" : "Pneumatic"}
                            </SelectItem>
                            <SelectItem value="hydraulic">
                              {isRTL ? "هيدروليكي" : "Hydraulic"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.toolType && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.toolType}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="manufacturer">{isRTL ? "الشركة المصنعة *" : "Manufacturer *"}</Label>
                        <Select value={formData.manufacturer || ""} onValueChange={(value) => handleInputChange('manufacturer', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? "اختر الشركة المصنعة" : "Select manufacturer"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dewalt">
                              {isRTL ? "ديوالت" : "DeWalt"}
                            </SelectItem>
                            <SelectItem value="makita">
                              {isRTL ? "ماكيتا" : "Makita"}
                            </SelectItem>
                            <SelectItem value="bosch">
                              {isRTL ? "بوش" : "Bosch"}
                            </SelectItem>
                            <SelectItem value="milwaukee">
                              {isRTL ? "ميلواكي" : "Milwaukee"}
                            </SelectItem>
                            <SelectItem value="hilti">
                              {isRTL ? "هيلتي" : "Hilti"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.manufacturer && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.manufacturer}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="modelNumber">{isRTL ? "رقم الطراز" : "Model Number"}</Label>
                        <Input
                          id="modelNumber"
                          placeholder={isRTL ? "مثال: GWS 750-100, DCD996" : "e.g., GWS 750-100, DCD996"}
                          value={formData.modelNumber || ""}
                          onChange={(e) => handleInputChange('modelNumber', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="condition">{isRTL ? "حالة الأداة *" : "Tool Condition *"}</Label>
                        <Select value={formData.condition || ""} onValueChange={(value) => handleInputChange('condition', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? "اختر الحالة" : "Select condition"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">{isRTL ? "جديدة" : "New"}</SelectItem>
                            <SelectItem value="good">{isRTL ? "جيدة" : "Good"}</SelectItem>
                            <SelectItem value="maintenance">{isRTL ? "تحتاج صيانة" : "Requires Maintenance"}</SelectItem>
                            <SelectItem value="damaged">{isRTL ? "معطلة" : "Damaged"}</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.condition && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.condition}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="purchaseDate">{isRTL ? "تاريخ الشراء" : "Date of Purchase"}</Label>
                        <DatePicker
                          date={formData.purchaseDate}
                          onDateChange={(date) => handleInputChange('purchaseDate', date)}
                          placeholder={isRTL ? "اختر تاريخ الشراء" : "Select purchase date"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="vendor">{isRTL ? "المورد / البائع" : "Vendor / Supplier"}</Label>
                        <Input
                          id="vendor"
                          placeholder={isRTL ? "مثال: الفطيم للأدوات، أجهزة المدينة" : "e.g., Al-Futtaim Tools, Al Madina Hardware"}
                          value={formData.vendor || ""}
                          onChange={(e) => handleInputChange('vendor', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="project">{isRTL ? "المشروع *" : "Project *"}</Label>
                      <Select
                        value={formData.project || ""}
                        onValueChange={(value) => handleInputChange('project', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isRTL ? "اختر المشروع" : "Select project"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Project A">Project A</SelectItem>
                          <SelectItem value="Project B">Project B</SelectItem>
                          <SelectItem value="Project C">Project C</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.project && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.project}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="toolPhoto">{isRTL ? "صورة الأداة (اختيارية)" : "Tool Photo (Optional)"}</Label>
                      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          {imagePreview ? (
                            <div className="relative">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="mx-auto h-32 w-32 object-cover rounded"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 rounded-full"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeImage();
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Camera className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                                >
                                  <span>{isRTL ? "رفع صورة" : "Upload a photo"}</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    ref={fileInputRef}
                                  />
                                </label>
                                <p className="pl-1">{isRTL ? "أو اسحب وأفلت" : "or drag and drop"}</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF {isRTL ? "حتى 10 ميجابايت" : "up to 10MB"}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="technical" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="powerRating">{isRTL ? "الطاقة التقييمية" : "Power Rating"}</Label>
                        <Input
                          id="powerRating"
                          placeholder={isRTL ? "مثال: 750 واط، 18 فولت، 2.5 حصان" : "e.g., 750W, 18V, 2.5 HP"}
                          value={formData.powerRating || ""}
                          onChange={(e) => handleInputChange('powerRating', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="toolSize">{isRTL ? "حجم الأداة/السعة" : "Tool Size/Capacity"}</Label>
                        <Input
                          id="toolSize"
                          placeholder={isRTL ? "مثال: قرص 4 بوصة، ظرف 13 ملم، محرك 1/2 بوصة" : "e.g., 4\" disc, 13mm chuck, 1/2\" drive"}
                          value={formData.toolSize || ""}
                          onChange={(e) => handleInputChange('toolSize', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">{isRTL ? "الوزن" : "Weight"}</Label>
                        <Input
                          id="weight"
                          placeholder={isRTL ? "مثال: 2.5 كجم، 4.8 رطل" : "e.g., 2.5 kg, 4.8 lbs"}
                          value={formData.weight || ""}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="safetyAccessories">{isRTL ? "الملحقات الأمنية المطلوبة" : "Safety Accessories Required"}</Label>
                        <Input
                          id="safetyAccessories"
                          placeholder={isRTL ? "مثال: قفازات، نظارات واقية، حماية الأذن" : "e.g., Gloves, Goggles, Ear Protection"}
                          value={formData.safetyAccessories || ""}
                          onChange={(e) => handleInputChange('safetyAccessories', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="inspectionFrequency">{isRTL ? "تكرار الفحص" : "Inspection Frequency"}</Label>
                        <Select value={formData.inspectionFrequency || ""} onValueChange={(value) => handleInputChange('inspectionFrequency', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? "اختر التكرار" : "Select frequency"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">{isRTL ? "يومي" : "Daily"}</SelectItem>
                            <SelectItem value="weekly">{isRTL ? "أسبوعي" : "Weekly"}</SelectItem>
                            <SelectItem value="monthly">{isRTL ? "شهري" : "Monthly"}</SelectItem>
                            <SelectItem value="quarterly">{isRTL ? "ربع سنوي" : "Quarterly"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="lastInspectionDate">{isRTL ? "تاريخ الفحص الأخير" : "Last Inspection Date"}</Label>
                        <DatePicker
                          date={formData.lastInspectionDate}
                          onDateChange={(date) => handleInputChange('lastInspectionDate', date)}
                          placeholder={isRTL ? "اختر تاريخ الفحص" : "Select inspection date"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="inspectionStatus">{isRTL ? "حالة الفحص" : "Inspection Status"}</Label>
                        <Select value={formData.inspectionStatus || ""} onValueChange={(value) => handleInputChange('inspectionStatus', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? "اختر الحالة" : "Select status"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passed">{isRTL ? "نجح" : "Passed"}</SelectItem>
                            <SelectItem value="needs-service">{isRTL ? "يحتاج إلى صيانة" : "Needs Service"}</SelectItem>
                            <SelectItem value="failed">{isRTL ? "فشل" : "Failed"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="remarks">{isRTL ? "ملاحظات" : "Remarks"}</Label>
                      <Textarea
                        id="remarks"
                        placeholder={isRTL ? "مثال: يجب استبدال الشفرة، بطارية احتياطية منخفضة" : "e.g., Blade to be replaced, Battery backup low"}
                        value={formData.remarks || ""}
                        onChange={(e) => handleInputChange('remarks', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="certification" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="certificateNo">{isRTL ? "رقم شهادة الطرف الثالث" : "Third-Party Certificate No."}</Label>
                        <Input
                          id="certificateNo"
                          placeholder={isRTL ? "مثال: TPI-POW-9876" : "e.g., TPI-POW-9876"}
                          value={formData.certificateNo || ""}
                          onChange={(e) => handleInputChange('certificateNo', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nextCalibrationDue">{isRTL ? "المعايرة التالية المستحقة" : "Next Calibration Due"}</Label>
                        <DatePicker
                          date={formData.nextCalibrationDue}
                          onDateChange={(date) => handleInputChange('nextCalibrationDue', date)}
                          placeholder={isRTL ? "اختر تاريخ المعايرة" : "Select calibration date"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="certificateIssueDate">{isRTL ? "تاريخ إصدار الشهادة" : "Certificate Issue Date"}</Label>
                        <DatePicker
                          date={formData.certificateIssueDate}
                          onDateChange={(date) => handleInputChange('certificateIssueDate', date)}
                          placeholder={isRTL ? "اختر تاريخ الإصدار" : "Select issue date"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="certificateExpiryDate">{isRTL ? "تاريخ انتهاء الشهادة" : "Certificate Expiry Date"}</Label>
                        <DatePicker
                          date={formData.certificateExpiryDate}
                          onDateChange={(date) => handleInputChange('certificateExpiryDate', date)}
                          placeholder={isRTL ? "اختر تاريخ الانتهاء" : "Select expiry date"}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="assignment" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="assignedLocation">{isRTL ? "الموقع المخصص *" : "Assigned Location *"}</Label>
                        <Input
                          id="assignedLocation"
                          placeholder={isRTL ? "مثال: ورشة عمل، موقع أ، مشروع فالكون" : "e.g., Workshop, Site A, Project Falcon"}
                          value={formData.assignedLocation || ""}
                          onChange={(e) => handleInputChange('assignedLocation', e.target.value)}
                        />
                        {formErrors.assignedLocation && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.assignedLocation}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="assignedTo">{isRTL ? "مخصص لـ (شخص/قسم) *" : "Assigned To (Person/Dept) *"}</Label>
                        <Input
                          id="assignedTo"
                          placeholder={isRTL ? "مثال: السيد علي / قسم الميكانيكا / أمين المخزن" : "e.g., Mr. Ali / Mechanical Dept / Store Keeper"}
                          value={formData.assignedTo || ""}
                          onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                        />
                        {formErrors.assignedTo && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.assignedTo}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="storageLocation">{isRTL ? "موقع التخزين" : "Storage Location"}</Label>
                        <Input
                          id="storageLocation"
                          placeholder={isRTL ? "مثال: خزانة الأدوات 2، غرفة التخزين ب" : "e.g., Tool Cabinet 2, Store Room B"}
                          value={formData.storageLocation || ""}
                          onChange={(e) => handleInputChange('storageLocation', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="operatorLicenseRequired">{isRTL ? "مطلوب رخصة المشغل" : "Operator License Required"}</Label>
                        <Select value={formData.operatorLicenseRequired ? "yes" : "no"} onValueChange={(value) => handleInputChange('operatorLicenseRequired', value === "yes")}>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? "اختر المتطلبات" : "Select requirement"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">{isRTL ? "نعم" : "Yes"}</SelectItem>
                            <SelectItem value="no">{isRTL ? "لا" : "No"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="operatorName">{isRTL ? "اسم المشغل (إذا تم تخصيصه)" : "Operator Name (if assigned)"}</Label>
                      <Input
                        id="operatorName"
                        placeholder={isRTL ? "مثال: جاويد إقبال" : "e.g., Javed Iqbal"}
                        value={formData.operatorName || ""}
                        onChange={(e) => handleInputChange('operatorName', e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => {
                    setIsModalOpen(false);
                    setFormData({
                      toolName: "",
                      toolId: "",
                      toolType: "",
                      manufacturer: "",
                      modelNumber: "",
                      powerRating: "",
                      toolSize: "",
                      weight: "",
                      purchaseDate: null,
                      vendor: "",
                      condition: "new",
                      assignedLocation: "",
                      assignedTo: "",
                      certificateNo: "",
                      certificateIssueDate: null,
                      certificateExpiryDate: null,
                      nextCalibrationDue: null,
                      inspectionFrequency: "monthly",
                      lastInspectionDate: null,
                      inspectionStatus: "passed",
                      remarks: "",
                      operatorLicenseRequired: false,
                      operatorName: "",
                      storageLocation: "",
                      safetyAccessories: "",
                      status: "active",
                      project: "Project A"
                    });
                    setImagePreview(null);
                    setIsEditMode(false);
                    setEditingTool(null);
                  }}>
                    {isRTL ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button onClick={handleSaveTool}>
                    {isEditMode
                      ? (isRTL ? "تحديث الأداة" : "Update Tool")
                      : (isRTL ? "حفظ الأداة الكهربائية" : "Save Power Tool")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Project Tabs */}
        <Tabs
          value={selectedProject}
          onValueChange={setSelectedProject}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
            <TabsTrigger
              value="Project A"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              Project A
            </TabsTrigger>
            <TabsTrigger
              value="Project B"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              Project B
            </TabsTrigger>
            <TabsTrigger
              value="Project C"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              Project C
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي الأدوات" : "Total Tools"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? "في المشروع الحالي" : "in current project"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "نشطة" : "Active"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {Math.round((stats.active / stats.total || 1) * 100)}% {isRTL ? "نشط" : "active"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "صيانة" : "Maintenance"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.maintenance}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {Math.round((stats.maintenance / stats.total || 1) * 100)}% {isRTL ? "صيانة" : "maintenance"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "معايرة مستحقة" : "Due Calibration"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.dueCalibration}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? "الأدوات التي تحتاج إلى معايرة" : "tools needing calibration"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm text-gray-600">
                  {isRTL ? "توزيع نوع الأداة" : "Tool Type Distribution"}
                </h3>
              </div>
              <div className="space-y-2">
                {Object.entries(stats.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm">{type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(count / stats.total || 1) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm text-gray-600">
                  {isRTL ? "حالة الشهادات" : "Certificate Status"}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {isRTL ? "شهادات صالحة" : "Valid Certificates"}
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.total - stats.expiredCerts}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {isRTL ? "شهادات منتهية" : "Expired Certificates"}
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.expiredCerts}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="rounded-full bg-primary/10 p-3 shrink-0">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {isRTL ? "نصائح سريعة" : "Quick Tips"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isRTL
                    ? "تعرف على كيفية إدارة سجل الأدوات الكهربائية بفعالية"
                    : "Learn how to manage the power tools registry effectively"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "قم بتحديث حالة الأدوات الكهربائية بانتظام"
                        : "Regularly update power tool status"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">2</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "تأكد من توثيق جميع الفحوصات"
                        : "Ensure all inspections are documented"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">3</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "راقب تواريخ انتهاء الشهادات"
                        : "Monitor certificate expiry dates"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>{isRTL ? "نظرة عامة على الأدوات الكهربائية" : "Power Tools Overview"}</CardTitle>
        <CardDescription>
          {isRTL ? "إدارة ومراقبة الأدوات الكهربائية" : "Manage and monitor your power tools"}
        </CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

      {/* Angle Grinder */}
      <div
        className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => {
          setSearchTerm("grinder");
          setActiveTab("list");
        }}
      >
        <div className="p-2">
          <div className="aspect-square relative">
            <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
              {filteredTools.filter(t => t.toolName.toLowerCase().includes("grinder")).length}
            </div>
            <img
              src="/images/Angle Grinder.jpg"
              alt="Angle Grinder"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <div className="pt-2 text-center">
            <h3 className="text-sm font-medium truncate">Angle Grinder</h3>
          </div>
        </div>
      </div>

      {/* Table Saw */}
      <div
        className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => {
          setSearchTerm("table saw");
          setActiveTab("list");
        }}
      >
        <div className="p-2">
          <div className="aspect-square relative">
            <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
              {filteredTools.filter(t => t.toolName.toLowerCase().includes("table saw")).length}
            </div>
            <img
              src="/images/Table Saw.jpg"
              alt="Table Saw"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <div className="pt-2 text-center">
            <h3 className="text-sm font-medium truncate">Table Saw</h3>
          </div>
        </div>
      </div>

      {/* Circular Saw */}
      <div
        className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => {
          setSearchTerm("circular saw");
          setActiveTab("list");
        }}
      >
        <div className="p-2">
          <div className="aspect-square relative">
            <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
              {filteredTools.filter(t => t.toolName.toLowerCase().includes("circular saw")).length}
            </div>
            <img
              src="/images/circular saw.jpg"
              alt="Circular Saw"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <div className="pt-2 text-center">
            <h3 className="text-sm font-medium truncate">Circular Saw</h3>
          </div>
        </div>
      </div>

      {/* Reciprocating Saw */}
      <div
        className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => {
          setSearchTerm("reciprocating");
          setActiveTab("list");
        }}
      >
        <div className="p-2">
          <div className="aspect-square relative">
            <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
              {filteredTools.filter(t => t.toolName.toLowerCase().includes("reciprocating")).length}
            </div>
            <img
              src="/images/Reciprocating Saw.jpg"
              alt="Reciprocating Saw"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <div className="pt-2 text-center">
            <h3 className="text-sm font-medium truncate">Reciprocating Saw</h3>
          </div>
        </div>
           </div>

      {/* Jigsaw */}
      <div
        className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => {
          setSearchTerm("jigsaw");
          setActiveTab("list");
        }}
      >
        <div className="p-2">
          <div className="aspect-square relative">
            <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
              {filteredTools.filter(t => t.toolName.toLowerCase().includes("jigsaw")).length}
            </div>
            <img
              src="/images/jigsaw.jpeg"
              alt="Jigsaw"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <div className="pt-2 text-center">
            <h3 className="text-sm font-medium truncate">Jigsaw</h3>
          </div>
        </div>
      </div>

    </div>
  </CardContent>
</Card>



        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-2 p-1 bg-muted rounded-lg">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {isRTL ? "قائمة الأدوات" : "Tool List"}
            </TabsTrigger>
            <TabsTrigger value="detail" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {isRTL ? "التفاصيل" : "Details"}
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {isRTL ? "التقارير" : "Reports"}
            </TabsTrigger>
            <TabsTrigger value="maintenance-service-reports" className="flex items-center gap-2 text-wrap">
              <ClipboardList className="h-4 w-4" />
              {isRTL ? "تقارير الصيانة/الخدمة" : "Maintenance/Service Reports"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>{isRTL ? "جرد الأدوات الكهربائية" : "Power Tools Inventory"}</CardTitle>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={isRTL ? "بحث..." : "Search..."}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[130px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                        <SelectItem value="active">{isRTL ? "نشط" : "Active"}</SelectItem>
                        <SelectItem value="maintenance">{isRTL ? "صيانة" : "Maintenance"}</SelectItem>
                        <SelectItem value="inactive">{isRTL ? "غير نشط" : "Inactive"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                          {isRTL ? "تفاصيل الأداة" : "Tool Details"}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                          {isRTL ? "النوع والمواصفات" : "Type & Specs"}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                          {isRTL ? "الموقع والتخصيص" : "Location & Assignment"}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                          {isRTL ? "الحالة" : "Status & Condition"}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                          {isRTL ? "الشهادات" : "Certification"}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                          {isRTL ? "الإجراءات" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredTools.map((tool) => (
                        <tr 
                          key={tool.toolId} 
                          className="group transition-colors hover:bg-gray-50/50 cursor-pointer"
                          onClick={() => handleViewTool(tool)}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={(e) => handleImagePreview(tool.image, e)}
                              >
                                {tool.image ? (
                                  <img 
                                    src={tool.image}
                                    alt={tool.toolName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{tool.toolName}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                  <span>ID: {tool.toolId}</span>
                                  <span className="text-gray-300">•</span>
                                  <span>{tool.manufacturer}</span>
                                                               </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <Badge variant="outline" className="mb-2">{tool.toolType}</Badge>                              <div className="text-sm text-gray-600">
                                {isRTL ? "آخر فحص: " : "Last Inspection: "} 
                                {tool.lastInspectionDate ? format(tool.lastInspectionDate, "PPP") : "-"}
                                {isInspectionDue(tool) && (
                                  <Badge variant="default" className="ml-2">
                                    {isRTL ? "فحص مستحق" : "Inspection Due"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="flex items-center text-sm text-gray-900 mb-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {tool.assignedLocation}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <User className="h-4 w-4 mr-1" />
                                {tool.assignedTo}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <Badge className={`mb-2 ${getStatusColor(tool.status)}`}>
                                {isRTL ? 
                                  (tool.status === "active" ? "نشطة" : 
                                   tool.status === "maintenance" ? "صيانة" : "غير نشطة") 
                                  : tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                              </Badge>
                              <div className="flex items-center text-sm text-gray-600">
                                {getConditionIcon(tool.condition)}
                                <span className="ml-1">{tool.condition}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <div className="text-gray-600">
                                {isRTL ? "تاريخ الانتهاء: " : "Expires: "} 
                                {tool.certificateExpiryDate ? format(tool.certificateExpiryDate, "PPP") : "-"}
                              </div>
                              <Badge 
                                variant={tool.certificateExpiryDate && new Date(tool.certificateExpiryDate) > new Date() ? "default" : "destructive"} 
                                className="text-xs mt-1"
                              >
                                {tool.certificateExpiryDate && new Date(tool.certificateExpiryDate) > new Date() ? 
                                  (isRTL ? "صالحة" : "Valid") : 
                                  (isRTL ? "منتهية" : "Expired")}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => handleViewTool(tool, e)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => handleEditTool(tool, e)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => handleShareTool(tool, e)}
                              >
                                <Share2 className="h-4 w-4" />
                                                           </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detail" className="mt-6">
            {selectedTool ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedTool.toolName}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">ID: {selectedTool.toolId}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDailyInspectionOpen(true)}
                      >
                        <Clipboard className="h-4 w-4 mr-2" />
                        {isRTL ? "الفحص اليومي" : "Daily Check"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMonthlyInspectionOpen(true)}
                      >
                        <CalendarCheck className="h-4 w-4 mr-2" />
                        {isRTL ? "الفحص الشهري" : "Monthly Check"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMaintenanceLogOpen(true)}
                      >
                        <ScrollText className="h-4 w-4 mr-2" />
                        {isRTL ? "سجل الصيانة" : "Maintenance Log"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsServiceReportOpen(true)}
                      >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        {isRTL ? "تقرير الخدمة" : "Service Report"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleShareTool(selectedTool, e)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        {isRTL ? "مشاركة" : "Share"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleEditTool(selectedTool, e)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {isRTL ? "تعديل" : "Edit"}
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setViewMode('list');
                        setActiveTab('list');
                        setSelectedTool(null);
                      }}>
                        {isRTL ? "عودة إلى القائمة" : "Back to List"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">{isRTL ? "المعلومات الأساسية" : "Basic Information"}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{isRTL ? "النوع" : "Type"}</Label>
                          <p className="text-sm mt-1">{selectedTool.toolType}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "الشركة المصنعة" : "Manufacturer"}</Label>
                          <p className="text-sm mt-1">{selectedTool.manufacturer}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "رقم الطراز" : "Model Number"}</Label>
                          <p className="text-sm mt-1">{selectedTool.modelNumber}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "القدرة" : "Power Rating"}</Label>
                          <p className="text-sm mt-1">{selectedTool.powerRating}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "المشروع" : "Project"}</Label>
                          <p className="text-sm mt-1">{selectedTool.project}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">{isRTL ? "حالة التشغيل" : "Operational Status"}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{isRTL ? "الحالة" : "Status"}</Label>
                          <Badge className={`mt-1 ${getStatusColor(selectedTool.status)}`}>
                            {selectedTool.status}
                          </Badge>
                        </div>
                        <div>
                          <Label>{isRTL ? "الموقع" : "Location"}</Label>
                          <p className="text-sm mt-1">{selectedTool.assignedLocation}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "المشغل" : "Operator"}</Label>
                          <p className="text-sm mt-1">{selectedTool.operatorName || '-'}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "آخر فحص" : "Last Inspection"}</Label>
                          <p className="text-sm mt-1">
                            {selectedTool.lastInspectionDate 
                              ? format(selectedTool.lastInspectionDate, "PPP")
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  {isRTL ? "يرجى اختيار أداة لعرض تفاصيلها" : "Please select a tool to view its details"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? "إنشاء التقارير" : "Generate Reports"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 mb-2" />
                    <span>{isRTL ? "تقرير الفحص الدوري" : "Periodic Inspection Report"}</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Clock className="h-6 w-6 mb-2" />
                    <span>{isRTL ? "تقرير المعايرة" : "Calibration Report"}</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    <span>{isRTL ? "تقرير الصيانة" : "Maintenance Report"}</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <User className="h-6 w-6 mb-2" />
                    <span>{isRTL ? "تقرير المشغلين" : "Operators Report"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance-service-reports" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{isRTL ? "سجلات الصيانة وتقارير الخدمة" : "Maintenance Logs & Service Reports"}</CardTitle>
                  <Button variant="outline" onClick={() => {
                    setMaintenanceLogs([]);
                    setServiceReports([]);
                    toast({
                      title: isRTL ? "تم المسح" : "Cleared",
                      description: isRTL ? "تم مسح جميع سجلات الصيانة وتقارير الخدمة." : "All maintenance logs and service reports have been cleared.",
                    });
                  }}>
                    {isRTL ? "مسح السجلات" : "Clear Logs"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="maintenance-logs" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 gap-2 p-1 bg-muted rounded-lg mb-4">
                    <TabsTrigger value="maintenance-logs">{isRTL ? "سجلات الصيانة" : "Maintenance Logs"}</TabsTrigger>
                    <TabsTrigger value="service-reports">{isRTL ? "تقارير الخدمة" : "Service Reports"}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="maintenance-logs">
                    {maintenanceLogs.length > 0 ? (
                      <div className="space-y-4">
                        {maintenanceLogs.map((log, index) => (
                          <Card key={index} className="border-l-4 border-blue-500">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-lg flex items-center">
                                <ClipboardList className="h-5 w-5 mr-2 text-blue-600" />
                                {isRTL ? "سجل الصيانة" : "Maintenance Log"} #{index + 1}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-sm">
                              <p><strong>{isRTL ? "المعدات:" : "Equipment:"}</strong> {log.equipmentInfo.typeOfEquipment}</p>
                              <p><strong>{isRTL ? "الرقم التسلسلي:" : "Serial Number:"}</strong> {log.equipmentInfo.serialNumber}</p>
                              <p><strong>{isRTL ? "الموقع:" : "Location:"}</strong> {log.equipmentInfo.location}</p>
                              <h4 className="font-semibold mt-3 mb-2">{isRTL ? "الأنشطة:" : "Activities:"}</h4>
                              <div className="space-y-2">
                                {log.maintenanceActivities.map((activity: any, actIndex: number) => (
                                  <div key={actIndex} className="border-t pt-2">
                                    <p><strong>{isRTL ? "التاريخ:" : "Date:"}</strong> {format(new Date(activity.date), "PPP")}</p>
                                    <p><strong>{isRTL ? "الوصف:" : "Description:"}</strong> {activity.description}</p>
                                    <p><strong>{isRTL ? "تم بواسطة:" : "Performed By:"}</strong> {activity.performedBy}</p>
                                    {activity.nextActivityDue && <p><strong>{isRTL ? "التالي المستحق:" : "Next Due:"}</strong> {format(new Date(activity.nextActivityDue), "PPP")}</p>}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">{isRTL ? "لا توجد سجلات صيانة متاحة." : "No maintenance logs available."}</p>
                    )}
                  </TabsContent>

                  <TabsContent value="service-reports">
                    {serviceReports.length > 0 ? (
                      <div className="space-y-4">
                        {serviceReports.map((report, index) => (
                          <Card key={index} className="border-l-4 border-green-500">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-lg flex items-center">
                                <ClipboardList className="h-5 w-5 mr-2 text-green-600" />
                                {isRTL ? "تقرير الخدمة" : "Service Report"} #{report.reportNumber}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-sm">
                              <p><strong>{isRTL ? "العميل:" : "Customer:"}</strong> {report.customerDetails.customerName}</p>
                              <p><strong>{isRTL ? "الموقع:" : "Location:"}</strong> {report.customerDetails.serviceLocation}</p>
                              <p><strong>{isRTL ? "تاريخ الخدمة:" : "Service Date:"}</strong> {format(new Date(report.equipmentDetails.serviceDate), "PPP")}</p>
                              <p><strong>{isRTL ? "الشكوى:" : "Complaint:"}</strong> {report.serviceDetails.natureOfComplaint}</p>
                              <p><strong>{isRTL ? "الوصف:" : "Description:"}</strong> {report.serviceDetails.detailedServiceDescription}</p>
                              {report.serviceDetails.partsUsed.length > 0 && (
                                <>
                                  <h4 className="font-semibold mt-3 mb-2">{isRTL ? "الأجزاء المستخدمة:" : "Parts Used:"}</h4>
                                  <ul className="list-disc pl-5">
                                    {report.serviceDetails.partsUsed.map((part: any, partIndex: number) => (
                                      <li key={partIndex}>{part.name} ({part.quantity} x {part.unitCost})</li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">{isRTL ? "لا توجد تقارير خدمة متاحة." : "No service reports available."}</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Image Preview Dialog */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent className="max-w-3xl h-auto">
            <DialogHeader>
              <DialogTitle>{isRTL ? "معاينة الصورة" : "Image Preview"}</DialogTitle>
            </DialogHeader>
            <div role="img" aria-label="Tool preview">
              {selectedImage && (
                <div className="relative aspect-video">
                  <img
                    src={selectedImage}
                    alt="Tool preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Share Tool Modal */}
        <ShareToolModal
          open={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          tool={selectedTool}
          onShare={handleShare}
          loading={false}
          isRTL={isRTL}
        />

        {selectedTool && (
          <>
            <PowerToolDailyChecklistDialog
              powerTool={selectedTool}
              open={dailyInspectionOpen}
              onOpenChange={setDailyInspectionOpen}
              onSubmit={handleDailyInspectionSubmit}
            />
            <PowerToolMonthlyInspectionDialog
              powerTool={selectedTool}
              open={monthlyInspectionOpen}
              onOpenChange={setMonthlyInspectionOpen}
              onSubmit={handleMonthlyInspectionSubmit}
            />
            <EquipmentMaintenanceLogModal
              open={isMaintenanceLogOpen}
              onOpenChange={setIsMaintenanceLogOpen}
              onSubmit={handleMaintenanceLogSubmit}
              equipment={selectedTool ? mapPowerToolToEquipment(selectedTool) : null}
              loading={false}
            />
            <ServiceReportModal
              open={isServiceReportOpen}
              onOpenChange={setIsServiceReportOpen}
              onSubmit={handleServiceReportSubmit}
              equipment={selectedTool ? mapPowerToolToEquipment(selectedTool) : null}
              loading={false}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PowerTools;