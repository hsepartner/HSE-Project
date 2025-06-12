import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle,CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/components/ui/use-toast";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  CalendarCheck,
  Upload, 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  MapPin, 
  FileText, 
  Settings, 
  Camera,
  Lightbulb,
  Video,
  Eye,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Share2
} from "lucide-react";
import { format } from "date-fns";
import { LiftingAccessoryDailyChecklistDialog } from "@/components/lifting-tools/LiftingAccessoryDailyChecklistDialog";
import { LiftingAccessoryMonthlyInspectionDialog } from "@/components/lifting-tools/LiftingAccessoryMonthlyInspectionDialog";

// Lifting Accessory interface with project field
interface LiftingAccessory {
  id: string;
  accessoryName: string;
  accessoryId: string;
  accessoryType: string;
  manufacturer: string;
  modelNumber: string;
  safeWorkingLoad: string;
  sizeDimensions: string;
  weight: string;
  purchaseDate: Date | null;
  vendor: string;
  condition: 'new' | 'good' | 'maintenance' | 'damaged';
  assignedLocation: string;
  assignedTo: string;
  certificateNo: string;
  certificateIssueDate: Date | null;
  certificateExpiryDate: Date | null;
  nextInspectionDue: Date | null;
  inspectionFrequency: '3 months' | '6 months' | '1 year';
  lastInspectionDate: Date | null;
  inspectionStatus: 'passed' | 'needs-service' | 'failed';
  remarks: string;
  safetyCertified: boolean;
  inspectorName: string;
  storageLocation: string;
  safetyColorCode: string;
  status: 'active' | 'inspection' | 'inactive';
  image?: string;
  project: string;
}

// Sample data for lifting accessories
const SAMPLE_LIFTING_ACCESSORIES: LiftingAccessory[] = [
  {
    id: "LA-00124",
    accessoryName: "Electric Chain Hoist",
    accessoryId: "ECH-001",
    accessoryType: "hoist",
    manufacturer: "KITO",
    modelNumber: "ER2-003S",
    safeWorkingLoad: "2T",
    sizeDimensions: "480 x 310 x 345mm",
    weight: "45 kg",
    purchaseDate: new Date("2024-01-15"),
    vendor: "Industrial Equipment Co.",
    condition: "new",
    assignedLocation: "Workshop Bay 1",
    assignedTo: "Maintenance Team",
    certificateNo: "CERT-ECH-2024-001",
    certificateIssueDate: new Date("2024-01-20"),
    certificateExpiryDate: new Date("2025-01-20"),
    nextInspectionDue: new Date("2024-07-20"),
    inspectionFrequency: "6 months",
    lastInspectionDate: new Date("2024-01-20"),
    inspectionStatus: "passed",
    remarks: "Regular maintenance required every 500 operating hours",
    safetyCertified: true,
    inspectorName: "Mohammed Saleem",
    storageLocation: "Main Workshop",
    safetyColorCode: "green",
    status: "active",
    image: "/images/Electric chain hoist.jpg",
    project: "Project A"
  },
  {
    id: "LA-00125",
    accessoryName: "Lever Hoist",
    accessoryId: "LH-002",
    accessoryType: "hoist",
    manufacturer: "Yale",
    modelNumber: "YL-500",
    safeWorkingLoad: "500kg",
    sizeDimensions: "280 x 150 x 160mm",
    weight: "3.8 kg",
    purchaseDate: new Date("2024-02-01"),
    vendor: "Safety Lift Equipment",
    condition: "new",
    assignedLocation: "Storage Area B",
    assignedTo: "Rigging Team",
    certificateNo: "CERT-LH-2024-002",
    certificateIssueDate: new Date("2024-02-05"),
    certificateExpiryDate: new Date("2025-02-05"),
    nextInspectionDue: new Date("2024-08-05"),
    inspectionFrequency: "6 months",
    lastInspectionDate: new Date("2024-02-05"),
    inspectionStatus: "passed",
    remarks: "Annual load testing required",
    safetyCertified: true,
    inspectorName: "Ahmad Khan",
    storageLocation: "Tool Room 2",
    safetyColorCode: "blue",
    status: "active",
    image: "/images/Lever Hoist.jpg",
    project: "Project A"
  },
  {
    id: "LA-00126",
    accessoryName: "Hydraulic Jack",
    accessoryId: "HJ-003",
    accessoryType: "jack",
    manufacturer: "Powerbuilt",
    modelNumber: "HJ-20T",
    safeWorkingLoad: "20T",
    sizeDimensions: "250 x 150 x 160mm",
    weight: "12.5 kg",
    purchaseDate: new Date("2024-03-10"),
    vendor: "Heavy Equipment Solutions",
    condition: "new",
    assignedLocation: "Maintenance Bay",
    assignedTo: "Service Team",
    certificateNo: "CERT-HJ-2024-003",
    certificateIssueDate: new Date("2024-03-15"),
    certificateExpiryDate: new Date("2025-03-15"),
    nextInspectionDue: new Date("2024-09-15"),
    inspectionFrequency: "6 months",
    lastInspectionDate: new Date("2024-03-15"),
    inspectionStatus: "passed",
    remarks: "Check hydraulic oil level monthly",
    safetyCertified: true,
    inspectorName: "Rashid Ali",
    storageLocation: "Equipment Room",
    safetyColorCode: "yellow",
    status: "active",
    image: "/images/Hydraulic Jack.jpg",
    project: "Project B"
  },
  {
    id: "LA-00127",
    accessoryName: "Hydraulic Lifting Table",
    accessoryId: "HLT-004",
    accessoryType: "lifting-table",
    manufacturer: "Bishamon",
    modelNumber: "EX-1000",
    safeWorkingLoad: "1000kg",
    sizeDimensions: "1220 x 610mm",
    weight: "125 kg",
    purchaseDate: new Date("2024-04-01"),
    vendor: "Industrial Solutions Co.",
    condition: "new",
    assignedLocation: "Assembly Area",
    assignedTo: "Production Team",
    certificateNo: "CERT-HLT-2024-004",
    certificateIssueDate: new Date("2024-04-05"),
    certificateExpiryDate: new Date("2025-04-05"),
    nextInspectionDue: new Date("2024-10-05"),
    inspectionFrequency: "6 months",
    lastInspectionDate: new Date("2024-04-05"),
    inspectionStatus: "passed",
    remarks: "Weekly cleaning and lubrication required",
    safetyCertified: true,
    inspectorName: "Farhan Ahmed",
    storageLocation: "Workshop Area 3",
    safetyColorCode: "green",
    status: "active",
    image: "/images/Hydraulic Lifting Table.jpg",
    project: "Project B"
  },
  {
    id: "LA-00128",
    accessoryName: "Hand Winch",
    accessoryId: "HW-005",
    accessoryType: "winch",
    manufacturer: "Tractel",
    modelNumber: "T-508D",
    safeWorkingLoad: "800kg",
    sizeDimensions: "320 x 200 x 180mm",
    weight: "5.6 kg",
    purchaseDate: new Date("2024-05-01"),
    vendor: "Lifting Gear Direct",
    condition: "new",
    assignedLocation: "Site C",
    assignedTo: "Installation Team",
    certificateNo: "CERT-HW-2024-005",
    certificateIssueDate: new Date("2024-05-05"),
    certificateExpiryDate: new Date("2025-05-05"),
    nextInspectionDue: new Date("2024-11-05"),
    inspectionFrequency: "6 months",
    lastInspectionDate: new Date("2024-05-05"),
    inspectionStatus: "passed",
    remarks: "Monthly cable inspection required",
    safetyCertified: true,
    inspectorName: "Hassan Ibrahim",
    storageLocation: "Tool Storage C",
    safetyColorCode: "blue",
    status: "active",
    image: "/images/handwinch.jpg",
    project: "Project C"
  }
];

// ShareAccessoryModal component
const ShareAccessoryModal = ({
  open,
  onOpenChange,
  accessory,
  onShare,
  loading,
  isRTL,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessory: LiftingAccessory | null;
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
    if (accessory) {
      setShareLink(`https://example.com/accessory/${accessory.id}`);
    }
  }, [accessory]);

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
            {isRTL ? "مشاركة ملحق الرفع" : "Share Lifting Accessory"}
          </DialogTitle>
          <DialogDescription>
            {isRTL
              ? "شارك تفاصيل ملحق الرفع عبر البريد الإلكتروني أو رابط."
              : "Share lifting accessory details via email or a link."}
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
                onClick={(e) => e.target.select()}
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

          {accessory && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">{accessory.accessoryName}</p>
              <p className="text-xs text-muted-foreground">{accessory.accessoryId}</p>
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

const LiftingTools = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAccessory, setSelectedAccessory] = useState<LiftingAccessory | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [accessories, setAccessories] = useState<LiftingAccessory[]>(SAMPLE_LIFTING_ACCESSORIES);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LiftingAccessory, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState("Project A");
  const [dailyInspectionOpen, setDailyInspectionOpen] = useState(false);
  const [monthlyInspectionOpen, setMonthlyInspectionOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state for bio-data entry
  const [formData, setFormData] = useState<Partial<LiftingAccessory>>({
    accessoryName: "",
    accessoryId: "",
    accessoryType: "",
    manufacturer: "",
    modelNumber: "",
    safeWorkingLoad: "",
    sizeDimensions: "",
    weight: "",
    purchaseDate: null,
    vendor: "",
    condition: "new",
    assignedLocation: "",
    assignedTo: "",
    certificateNo: "",
    certificateIssueDate: null,
    certificateExpiryDate: null,
    nextInspectionDue: null,
    inspectionFrequency: "6 months",
    lastInspectionDate: null,
    inspectionStatus: "passed",
    remarks: "",
    safetyCertified: false,
    inspectorName: "",
    storageLocation: "",
    safetyColorCode: "",
    status: "active",
    image: "",
    project: "Project A"
  });

  // State for edit functionality
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<LiftingAccessory | null>(null);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inspection": return "bg-yellow-100 text-yellow-800";
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
    const errors: Partial<Record<keyof LiftingAccessory, string>> = {};
    
    if (!formData.accessoryName) errors.accessoryName = isRTL ? "اسم الملحق مطلوب" : "Accessory Name is required";
    if (!formData.accessoryId) errors.accessoryId = isRTL ? "رقم الملحق مطلوب" : "Accessory ID is required";
    if (!formData.accessoryType) errors.accessoryType = isRTL ? "نوع الملحق مطلوب" : "Accessory Type is required";
    if (!formData.manufacturer) errors.manufacturer = isRTL ? "الشركة المصنعة مطلوبة" : "Manufacturer is required";
    if (!formData.condition) errors.condition = isRTL ? "حالة الملحق مطلوبة" : "Accessory Condition is required";
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

  // Handle input change
  const handleInputChange = (field: keyof LiftingAccessory, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handlers for view, edit, and share
  const handleViewAccessory = (accessory: LiftingAccessory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedAccessory(accessory);
    setViewMode('detail');
    setActiveTab('detail');
    setIsEditMode(false);
  };

  const handleEditAccessory = (accessory: LiftingAccessory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingAccessory(accessory);
    setFormData(accessory);
    setImagePreview(accessory.image || null);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  const handleShareAccessory = (accessory: LiftingAccessory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedAccessory(accessory);
    setIsShareModalOpen(true);
  };

  const handleShare = (shareData: { email?: string; link?: string }) => {
    setIsShareModalOpen(false);
    toast({
      title: isRTL ? "نجاح" : "Success",
      description: isRTL
        ? `تمت مشاركة ملحق الرفع بنجاح عبر ${shareData.email ? "البريد الإلكتروني" : "رابط"}`
        : `Lifting accessory shared successfully via ${shareData.email ? "email" : "link"}`,
    });
  };

  const handleSaveAccessory = () => {
    if (!validateForm()) {
      toast({
        title: isRTL ? "خطأ في النموذج" : "Form Error",
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode && editingAccessory) {
      // Update existing accessory
      setAccessories(prev => prev.map(acc => 
        acc.id === editingAccessory.id ? { ...formData, id: acc.id } as LiftingAccessory : acc
      ));
      toast({
        title: isRTL ? "نجاح" : "Success",
        description: isRTL ? "تم تحديث الملحق بنجاح" : "Accessory updated successfully",
      });
    } else {
      // Add new accessory
      const newAccessory: LiftingAccessory = {
        ...formData,
        id: formData.accessoryId || `LA-${Math.random().toString(36).substr(2, 9)}`,
        status: formData.status || 'active',
        safetyCertified: formData.safetyCertified === true,
      } as LiftingAccessory;

      setAccessories(prev => [...prev, newAccessory]);
      toast({
        title: isRTL ? "نجاح" : "Success",
        description: isRTL ? "تم إضافة الملحق بنجاح" : "Accessory added successfully",
      });
    }

    // Reset form and state
    setFormData({
      accessoryName: "",
      accessoryId: "",
      accessoryType: "",
      manufacturer: "",
      modelNumber: "",
      safeWorkingLoad: "",
      sizeDimensions: "",
      weight: "",
      purchaseDate: null,
      vendor: "",
      condition: "new",
      assignedLocation: "",
      assignedTo: "",
      certificateNo: "",
      certificateIssueDate: null,
      certificateExpiryDate: null,
      nextInspectionDue: null,
      inspectionFrequency: "6 months",
      lastInspectionDate: null,
      inspectionStatus: "passed",
      remarks: "",
      safetyCertified: false,
      inspectorName: "",
      storageLocation: "",
      safetyColorCode: "",
      status: "active",
      image: "",
      project: "Project A"
    });
    setImagePreview(null);
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingAccessory(null);
  };

  const filteredAccessories = accessories.filter(accessory => {
    const matchesSearch = searchTerm === "" || 
      accessory.accessoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.accessoryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || accessory.status === filterStatus;
    const matchesProject = accessory.project === selectedProject;
    
    return matchesSearch && matchesFilter && matchesProject;
  });

  // Statistics
  const stats = {
    total: filteredAccessories.length,
    active: filteredAccessories.filter(a => a.status === 'active').length,
    inspection: filteredAccessories.filter(a => a.status === 'inspection').length,
    dueInspection: filteredAccessories.filter(a => 
      a.nextInspectionDue && new Date(a.nextInspectionDue) <= new Date()
    ).length,
    byType: filteredAccessories.reduce((acc, accessory) => {
      acc[accessory.accessoryType] = (acc[accessory.accessoryType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    expiredCerts: filteredAccessories.filter(a => 
      a.certificateExpiryDate && new Date(a.certificateExpiryDate) <= new Date()
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
          <CalendarIcon className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
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

  // Image preview handler
  const handleImagePreview = (imageUrl: string | undefined, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowImageDialog(true);
    }
  };

  // Daily Inspection handler
  const handleDailyInspectionSubmit = async (inspection: DailyInspection) => {
    try {
      // Update the accessory with inspection results
      const updatedAccessories = accessories.map(acc => {
        if (acc.id === selectedAccessory?.id) {
          return {
            ...acc,
            dailyInspections: [...(acc.dailyInspections || []), inspection],
            lastInspectionDate: new Date(),
            inspectionStatus: getInspectionStatus(inspection)
          };
        }
        return acc;
      });
      
      setAccessories(updatedAccessories);
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
  };

  // Monthly Inspection handler
  const handleMonthlyInspectionSubmit = async (inspection: MonthlyInspection) => {
    try {
      // Update the accessory with inspection results
      const updatedAccessories = accessories.map(acc => {
        if (acc.id === selectedAccessory?.id) {
          return {
            ...acc,
            monthlyInspections: [...(acc.monthlyInspections || []), inspection],
            lastInspectionDate: new Date(),
            nextInspectionDue: new Date(inspection.nextInspectionDate),
            inspectionStatus: getInspectionStatus(inspection)
          };
        }
        return acc;
      });
      
      setAccessories(updatedAccessories);
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

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? "سجل ملحقات الرفع" : "Lifting Accessories Registry"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL
                ? "إدارة ومراقبة جميع ملحقات الرفع والوثائق المرتبطة بها"
                : "Manage and monitor all lifting accessories and associated documentation"}
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
                  {isRTL ? "إضافة ملحق رفع" : "Add Lifting Accessory"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {isEditMode
                      ? (isRTL ? "تعديل ملحق الرفع" : "Edit Lifting Accessory")
                      : (isRTL ? "نموذج بيانات ملحق الرفع" : "Lifting Accessory Bio-Data Entry")}
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
                        <Label htmlFor="accessoryName">{isRTL ? "اسم الملحق *" : "Accessory Name *"}</Label>
                        <Input
                          id="accessoryName"
                          placeholder={isRTL ? "مثال: سلسلة رفع، حبل شبكي" : "e.g., Chain Sling, Web Sling"}
                          value={formData.accessoryName || ""}
                          onChange={(e) => handleInputChange('accessoryName', e.target.value)}
                          className={formErrors.accessoryName ? "border-red-500" : ""}
                        />
                        {formErrors.accessoryName && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.accessoryName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="accessoryId">{isRTL ? "رقم الملحق / الرقم التسلسلي *" : "Accessory ID / Serial Number *"}</Label>
                        <Input
                          id="accessoryId"
                          placeholder={isRTL ? "مثال: LA-00123, SCL-0009" : "e.g., LA-00123, SCL-0009"}
                          value={formData.accessoryId || ""}
                          onChange={(e) => handleInputChange('accessoryId', e.target.value)}
                          className={formErrors.accessoryId ? "border-red-500" : ""}
                        />
                        {formErrors.accessoryId && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.accessoryId}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="accessoryType">{isRTL ? "نوع الملحق *" : "Accessory Type *"}</Label>
                        <Select value={formData.accessoryType || ""} onValueChange={(value) => handleInputChange('accessoryType', value)}>
                          <SelectTrigger className={formErrors.accessoryType ? "border-red-500" : ""}>
                            <SelectValue placeholder={isRTL ? "اختر نوع الملحق" : "Select accessory type"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sling">{isRTL ? "حبل" : "Sling"}</SelectItem>
                            <SelectItem value="shackle">{isRTL ? "مشبك" : "Shackle"}</SelectItem>
                            <SelectItem value="hook">{isRTL ? "خطاف" : "Hook"}</SelectItem>
                            <SelectItem value="eyebolt">{isRTL ? "برغي عين" : "Eyebolt"}</SelectItem>
                            <SelectItem value="hoist">{isRTL ? "رافعة" : "Hoist"}</SelectItem>
                            <SelectItem value="jack">{isRTL ? "جاك" : "Jack"}</SelectItem>
                            <SelectItem value="winch">{isRTL ? "ونش" : "Winch"}</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.accessoryType && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.accessoryType}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="manufacturer">{isRTL ? "الشركة المصنعة *" : "Manufacturer *"}</Label>
                        <Select value={formData.manufacturer || ""} onValueChange={(value) => handleInputChange('manufacturer', value)}>
                          <SelectTrigger className={formErrors.manufacturer ? "border-red-500" : ""}>
                            <SelectValue placeholder={isRTL ? "اختر الشركة المصنعة" : "Select manufacturer"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Crosby">Crosby</SelectItem>
                            <SelectItem value="Yoke">Yoke</SelectItem>
                            <SelectItem value="Green Pin">Green Pin</SelectItem>
                            <SelectItem value="Gunnebo">Gunnebo</SelectItem>
                            <SelectItem value="KITO">KITO</SelectItem>
                            <SelectItem value="Yale">Yale</SelectItem>
                            <SelectItem value="Powerbuilt">Powerbuilt</SelectItem>
                            <SelectItem value="Bishamon">Bishamon</SelectItem>
                            <SelectItem value="Tractel">Tractel</SelectItem>
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
                          placeholder={isRTL ? "مثال: CSL-200, WS-325" : "e.g., CSL-200, WS-325"}
                          value={formData.modelNumber || ""}
                          onChange={(e) => handleInputChange('modelNumber', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="condition">{isRTL ? "حالة الملحق *" : "Accessory Condition *"}</Label>
                        <Select value={formData.condition || ""} onValueChange={(value) => handleInputChange('condition', value)}>
                          <SelectTrigger className={formErrors.condition ? "border-red-500" : ""}>
                            <SelectValue placeholder={isRTL ? "اختر الحالة" : "Select condition"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">{isRTL ? "جديد" : "New"}</SelectItem>
                            <SelectItem value="good">{isRTL ? "جيد" : "Good"}</SelectItem>
                            <SelectItem value="maintenance">{isRTL ? "يحتاج صيانة" : "Requires Maintenance"}</SelectItem>
                            <SelectItem value="damaged">{isRTL ? "تالف" : "Damaged"}</SelectItem>
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
                          placeholder={isRTL ? "مثال: تك ليفت، ليفت برو" : "e.g., TechLift Supplies, LiftPro Equipment"}
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
                        <SelectTrigger className={formErrors.project ? "border-red-500" : ""}>
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
                      <Label htmlFor="accessoryPhoto">{isRTL ? "صورة الملحق (اختيارية)" : "Accessory Photo (Optional)"}</Label>
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
                        <Label htmlFor="safeWorkingLoad">{isRTL ? "الحمولة الآمنة" : "Safe Working Load (SWL)"}</Label>
                        <Input
                          id="safeWorkingLoad"
                          placeholder={isRTL ? "مثال: 2 طن، 3.25 طن" : "e.g., 2T, 3.25T"}
                          value={formData.safeWorkingLoad || ""}
                          onChange={(e) => handleInputChange('safeWorkingLoad', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sizeDimensions">{isRTL ? "الحجم/الأبعاد" : "Size/Dimensions"}</Label>
                        <Input
                          id="sizeDimensions"
                          placeholder={isRTL ? "مثال: 2 متر، Ø19 ملم" : "e.g., 2 meters, Ø19mm"}
                          value={formData.sizeDimensions || ""}
                          onChange={(e) => handleInputChange('sizeDimensions', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">{isRTL ? "الوزن" : "Weight"}</Label>
                        <Input
                          id="weight"
                          placeholder={isRTL ? "مثال: 5.8 كجم، 0.6 كجم" : "e.g., 5.8 kg, 0.6 kg"}
                          value={formData.weight || ""}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="safetyColorCode">{isRTL ? "كود اللون الأمني" : "Safety Color Code"}</Label>
                        <Select value={formData.safetyColorCode || ""} onValueChange={(value) => handleInputChange('safetyColorCode', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? "اختر كود اللون" : "Select color code"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">{isRTL ? "أزرق" : "Blue"}</SelectItem>
                            <SelectItem value="green">{isRTL ? "أخضر" : "Green"}</SelectItem>
                            <SelectItem value="yellow">{isRTL ? "أصفر" : "Yellow"}</SelectItem>
                            <SelectItem value="red">{isRTL ? "أحمر" : "Red"}</SelectItem>
                          </SelectContent>
                        </Select>
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
                            <SelectItem value="3 months">{isRTL ? "3 أشهر" : "3 Months"}</SelectItem>
                            <SelectItem value="6 months">{isRTL ? "6 أشهر" : "6 Months"}</SelectItem>
                            <SelectItem value="1 year">{isRTL ? "سنة واحدة" : "1 Year"}</SelectItem>
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
                        placeholder={isRTL ? "مثال: تآكل طفيف، صيانة دورية" : "e.g., Slight abrasion, regular maintenance"}
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
                          placeholder={isRTL ? "مثال: TPI-LA-2024-099" : "e.g., TPI-LA-2024-099"}
                          value={formData.certificateNo || ""}
                          onChange={(e) => handleInputChange('certificateNo', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nextInspectionDue">{isRTL ? "الفحص التالي المستحق" : "Next Inspection Due"}</Label>
                        <DatePicker
                          date={formData.nextInspectionDue}
                          onDateChange={(date) => handleInputChange('nextInspectionDue', date)}
                          placeholder={isRTL ? "اختر تاريخ الفحص" : "Select inspection date"}
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
                          placeholder={isRTL ? "مثال: المخزن الرئيسي، ورشة العمل" : "e.g., Main Store, Workshop Bay 3"}
                          value={formData.assignedLocation || ""}
                          onChange={(e) => handleInputChange('assignedLocation', e.target.value)}
                          className={formErrors.assignedLocation ? "border-red-500" : ""}
                        />
                        {formErrors.assignedLocation && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.assignedLocation}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="assignedTo">{isRTL ? "مخصص لـ (شخص/قسم) *" : "Assigned To (Person/Dept) *"}</Label>
                        <Input
                          id="assignedTo"
                          placeholder={isRTL ? "مثال: فريق الرفع، قسم الميكانيكا" : "e.g., Rigging Crew, Mechanical Dept"}
                          value={formData.assignedTo || ""}
                          onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                          className={formErrors.assignedTo ? "border-red-500" : ""}
                        />
                        {formErrors.assignedTo && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.assignedTo}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="storageLocation">{isRTL ? "موقع التخزين" : "Storage Location"}</Label>
                        <Input
                          id="storageLocation"
                          placeholder={isRTL ? "مثال: الموقع أ، خزانة الأدوات 1" : "e.g., Site A, Tool Cabinet 1"}
                          value={formData.storageLocation || ""}
                          onChange={(e) => handleInputChange('storageLocation', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="safetyCertified">{isRTL ? "مصدق على السلامة" : "Safety Certified"}</Label>
                        <Select value={formData.safetyCertified ? "yes" : "no"} onValueChange={(value) => handleInputChange('safetyCertified', value === "yes")}>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? "اختر الحالة" : "Select status"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">{isRTL ? "نعم" : "Yes"}</SelectItem>
                            <SelectItem value="no">{isRTL ? "لا" : "No"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="inspectorName">{isRTL ? "اسم المفتش (إذا تم تخصيصه)" : "Inspector Name (if assigned)"}</Label>
                      <Input
                        id="inspectorName"
                        placeholder={isRTL ? "مثال: محمد علي" : "e.g., Mohammed Ali"}
                        value={formData.inspectorName || ""}
                        onChange={(e) => handleInputChange('inspectorName', e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData({
                        accessoryName: "",
                        accessoryId: "",
                        accessoryType: "",
                        manufacturer: "",
                        modelNumber: "",
                        safeWorkingLoad: "",
                        sizeDimensions: "",
                        weight: "",
                        purchaseDate: null,
                        vendor: "",
                        condition: "new",
                        assignedLocation: "",
                        assignedTo: "",
                        certificateNo: "",
                        certificateIssueDate: null,
                        certificateExpiryDate: null,
                        nextInspectionDue: null,
                        inspectionFrequency: "6 months",
                        lastInspectionDate: null,
                        inspectionStatus: "passed",
                        remarks: "",
                        safetyCertified: false,
                        inspectorName: "",
                        storageLocation: "",
                        safetyColorCode: "",
                        status: "active",
                        image: "",
                        project: "Project A"
                      });
                      setImagePreview(null);
                      setFormErrors({});
                      setIsEditMode(false);
                      setEditingAccessory(null);
                    }}
                  >
                    {isRTL ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button onClick={handleSaveAccessory}>
                    {isEditMode
                      ? (isRTL ? "تحديث الملحق" : "Update Accessory")
                      : (isRTL ? "حفظ ملحق الرفع" : "Save Lifting Accessory")}
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
                    {isRTL ? "إجمالي الملحقات" : "Total Accessories"}
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
                    {isRTL ? "تحت الفحص" : "Inspection"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inspection}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {Math.round((stats.inspection / stats.total || 1) * 100)}% {isRTL ? "فحص" : "inspection"}
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
                    {isRTL ? "فحص مستحق" : "Due Inspection"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.dueInspection}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? "الملحقات التي تحتاج إلى فحص" : "accessories needing inspection"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm text-gray-600">
                  {isRTL ? "توزيع نوع الملحق" : "Accessory Type Distribution"}
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

        {/* Lifting Tools Overview Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{isRTL ? "نظرة عامة على ملحقات الرفع" : "Lifting Accessories Overview"}</CardTitle>
                <CardDescription>
                  {isRTL ? "إدارة ومراقبة ملحقات الرفع" : "Manage and monitor your lifting accessories"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

              {/* Electric Chain Hoist */}
              <div
                className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setSearchTerm("chain hoist");
                  setActiveTab("list");
                }}
              >
                <div className="p-2">
                  <div className="aspect-square relative">
                    <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {filteredAccessories.filter(t => t.accessoryName.toLowerCase().includes("chain hoist")).length}
                    </div>
                    <img
                      src="/images/Electric chain hoist.jpg"
                      alt="Electric Chain Hoist"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="pt-2 text-center">
                    <h3 className="text-sm font-medium truncate">Electric Chain Hoist</h3>
                  </div>
                </div>
              </div>

              {/* Lever Hoist */}
              <div
                className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setSearchTerm("lever hoist");
                  setActiveTab("list");
                }}
              >
                <div className="p-2">
                  <div className="aspect-square relative">
                    <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {filteredAccessories.filter(t => t.accessoryName.toLowerCase().includes("lever hoist")).length}
                    </div>
                    <img
                      src="/images/Lever Hoist.jpg"
                      alt="Lever Hoist"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="pt-2 text-center">
                    <h3 className="text-sm font-medium truncate">Lever Hoist</h3>
                  </div>
                </div>
              </div>

              {/* Hydraulic Jack */}
              <div
                className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setSearchTerm("hydraulic jack");
                  setActiveTab("list");
                }}
              >
                <div className="p-2">
                  <div className="aspect-square relative">
                    <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {filteredAccessories.filter(t => t.accessoryName.toLowerCase().includes("hydraulic jack")).length}
                    </div>
                    <img
                      src="/images/Hydraulic Jack.jpg"
                      alt="Hydraulic Jack"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="pt-2 text-center">
                    <h3 className="text-sm font-medium truncate">Hydraulic Jack</h3>
                  </div>
                </div>
              </div>

              {/* Hydraulic Lifting Table */}
              <div
                className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setSearchTerm("lifting table");
                  setActiveTab("list");
                }}
              >
                <div className="p-2">
                  <div className="aspect-square relative">
                    <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {filteredAccessories.filter(t => t.accessoryName.toLowerCase().includes("lifting table")).length}
                    </div>
                    <img
                      src="/images/Hydraulic Lifting Table.jpg"
                      alt="Hydraulic Lifting Table"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="pt-2 text-center">
                    <h3 className="text-sm font-medium truncate">Hydraulic Lifting Table</h3>
                  </div>
                </div>
              </div>

              {/* Hand Winch */}
              <div
                className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setSearchTerm("hand winch");
                  setActiveTab("list");
                }}
              >
                <div className="p-2">
                  <div className="aspect-square relative">
                    <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {filteredAccessories.filter(t => t.accessoryName.toLowerCase().includes("hand winch")).length}
                    </div>
                    <img
                      src="/images/handwinch.jpg"
                      alt="Hand Winch"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="pt-2 text-center">
                    <h3 className="text-sm font-medium truncate">Hand Winch</h3>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

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
                    ? "تعرف على كيفية إدارة سجل ملحقات الرفع بفعالية"
                    : "Learn how to manage the lifting accessories registry effectively"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "قم بتحديث حالة ملحقات الرفع بانتظام"
                        : "Regularly update lifting accessory status"}
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
        

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {isRTL ? "قائمة الملحقات" : "Accessory List"}
            </TabsTrigger>
            <TabsTrigger value="detail" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {isRTL ? "التفاصيل" : "Details"}
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {isRTL ? "التقارير" : "Reports"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>{isRTL ? "جرد ملحقات الرفع" : "Lifting Accessories Inventory"}</CardTitle>
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
                        <SelectItem value="inspection">{isRTL ? "تحت الفحص" : "Inspection"}</SelectItem>
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
                          {isRTL ? "تفاصيل الملحق" : "Accessory Details"}
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
                      {filteredAccessories.map((accessory) => (
                        <tr 
                          key={accessory.accessoryId} 
                          className="group transition-colors hover:bg-gray-50/50 cursor-pointer"
                          onClick={() => handleViewAccessory(accessory)}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={(e) => handleImagePreview(accessory.image, e)}
                              >
                                {accessory.image ? (
                                  <img 
                                    src={accessory.image} 
                                    alt={accessory.accessoryName} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{accessory.accessoryName}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                  <span>ID: {accessory.accessoryId}</span>
                                  <span className="text-gray-300">•</span>
                                  <span>{accessory.manufacturer}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <Badge variant="outline" className="mb-2">{accessory.accessoryType}</Badge>
                              <div className="text-sm text-gray-600">
                                {isRTL ? "آخر فحص: " : "Last Inspection: "} 
                                {accessory.lastInspectionDate ? format(accessory.lastInspectionDate, "PPP") : "-"}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="flex items-center text-sm text-gray-900 mb-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {accessory.assignedLocation}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <User className="h-4 w-4 mr-1" />
                                {accessory.assignedTo}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <Badge className={`mb-2 ${getStatusColor(accessory.status)}`}>
                                {isRTL ? 
                                  (accessory.status === "active" ? "نشط" : 
                                   accessory.status === "inspection" ? "تحت الفحص" : "غير نشط") 
                                  : accessory.status.charAt(0).toUpperCase() + accessory.status.slice(1)}
                              </Badge>
                              <div className="flex items-center text-sm text-gray-600">
                                {getConditionIcon(accessory.condition)}
                                <span className="ml-1">
                                  {isRTL ? 
                                    (accessory.condition === "new" ? "جديد" : 
                                     accessory.condition === "good" ? "جيد" : 
                                     accessory.condition === "maintenance" ? "يحتاج صيانة" : "تالف") 
                                    : accessory.condition.charAt(0).toUpperCase() + accessory.condition.slice(1)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <div className="text-gray-600">
                                {isRTL ? "تاريخ الانتهاء: " : "Expires: "} 
                                {accessory.certificateExpiryDate ? format(accessory.certificateExpiryDate, "PPP") : "-"}
                              </div>
                              <Badge 
                                variant={accessory.certificateExpiryDate && new Date(accessory.certificateExpiryDate) > new Date() ? "default" : "destructive"} 
                                className="text-xs mt-1"
                              >
                                {accessory.certificateExpiryDate && new Date(accessory.certificateExpiryDate) > new Date() ? 
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
                                onClick={(e) => handleViewAccessory(accessory, e)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => handleEditAccessory(accessory, e)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => handleShareAccessory(accessory, e)}
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
            {selectedAccessory ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedAccessory.accessoryName}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">ID: {selectedAccessory.accessoryId}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setDailyInspectionOpen(true)}
                      >
                        <CalendarCheck className="h-4 w-4 mr-2" />
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
                        onClick={(e) => handleShareAccessory(selectedAccessory, e)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        {isRTL ? "مشاركة" : "Share"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => handleEditAccessory(selectedAccessory, e)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {isRTL ? "تعديل" : "Edit"}
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setViewMode('list');
                        setActiveTab('list');
                        setSelectedAccessory(null);
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
                          <p className="text-sm mt-1">{selectedAccessory.accessoryType}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "الشركة المصنعة" : "Manufacturer"}</Label>
                          <p className="text-sm mt-1">{selectedAccessory.manufacturer}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "رقم الطراز" : "Model Number"}</Label>
                          <p className="text-sm mt-1">{selectedAccessory.modelNumber}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "الحمولة الآمنة" : "Safe Working Load"}</Label>
                          <p className="text-sm mt-1">{selectedAccessory.safeWorkingLoad}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "المشروع" : "Project"}</Label>
                          <p className="text-sm mt-1">{selectedAccessory.project}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">{isRTL ? "حالة التشغيل" : "Operational Status"}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{isRTL ? "الحالة" : "Status"}</Label>
                          <Badge className={`mt-1 ${getStatusColor(selectedAccessory.status)}`}>
                            {isRTL ? 
                              (selectedAccessory.status === "active" ? "نشط" : 
                               selectedAccessory.status === "inspection" ? "تحت الفحص" : "غير نشط") 
                              : selectedAccessory.status.charAt(0).toUpperCase() + selectedAccessory.status.slice(1)}
                          </Badge>
                        </div>
                        <div>
                          <Label>{isRTL ? "الموقع" : "Location"}</Label>
                          <p className="text-sm mt-1">{selectedAccessory.assignedLocation}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "المفتش" : "Inspector"}</Label>
                          <p className="text-sm mt-1">{selectedAccessory.inspectorName || '-'}</p>
                        </div>
                        <div>
                          <Label>{isRTL ? "آخر فحص" : "Last Inspection"}</Label>
                          <p className="text-sm mt-1">
                            {selectedAccessory.lastInspectionDate 
                              ? format(selectedAccessory.lastInspectionDate, "PPP")
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
                  {isRTL ? "يرجى اختيار ملحق لعرض تفاصيله" : "Please select an accessory to view its details"}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 mb-2" />
                    <span>{isRTL ? "تقرير الفحص الدوري" : "Periodic Inspection Report"}</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Clock className="h-6 w-6 mb-2" />
                    <span>{isRTL ? "تقرير الفحص المستحق" : "Due Inspection Report"}</span>
                  </Button>
                  <Button variant="outline" className="                  h-24 flex flex-col items-center justify-center">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    <span>{isRTL ? "تقرير الصيانة" : "Maintenance Report"}</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <User className="h-6 w-6 mb-2" />
                    <span>{isRTL ? "تقرير المفتشين" : "Inspectors Report"}</span>
                  </Button>
                </div>
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
            {selectedImage && (
              <div className="relative aspect-video">
                <img
                  src={selectedImage}
                  alt="Accessory preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Share Accessory Modal */}
        <ShareAccessoryModal
          open={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          accessory={selectedAccessory}
          onShare={handleShare}
          loading={false}
          isRTL={isRTL}
        />

        {/* Daily Inspection Dialog */}
        <LiftingAccessoryDailyChecklistDialog
          open={dailyInspectionOpen}
          onOpenChange={setDailyInspectionOpen}
          accessory={selectedAccessory!}
          onSubmit={handleDailyInspectionSubmit}
        />
        {/* Monthly Inspection Dialog */}
        <LiftingAccessoryMonthlyInspectionDialog
          open={monthlyInspectionOpen}
          onOpenChange={setMonthlyInspectionOpen}
          accessory={selectedAccessory!}
          onSubmit={handleMonthlyInspectionSubmit}
        />
      </div>
    </DashboardLayout>
  );
};

export default LiftingTools;