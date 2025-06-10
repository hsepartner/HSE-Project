import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/hooks/use-language";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Filter, 
  Download, 
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
  Image as ImageIcon
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

// Enhanced Equipment interface with bio-data fields
interface PowerTool {
  id: string;
  toolName: string;
  toolId: string;
  toolType: string;
  manufacturer: string;
  modelNumber: string;
  powerRating: string;
  toolSize: string;
  weight: string;
  purchaseDate: Date | null;
  vendor: string;
  condition: 'new' | 'good' | 'maintenance' | 'damaged';
  assignedLocation: string;
  assignedTo: string;
  certificateNo: string;
  certificateIssueDate: Date | null;
  certificateExpiryDate: Date | null;
  nextCalibrationDue: Date | null;
  inspectionFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastInspectionDate: Date | null;
  inspectionStatus: 'passed' | 'needs-service' | 'failed';
  remarks: string;
  operatorLicenseRequired: boolean;
  operatorName: string;
  storageLocation: string;
  safetyAccessories: string;
  status: 'active' | 'maintenance' | 'inactive';
  image?: string;
}

// Sample data with enhanced bio-data
const SAMPLE_POWER_TOOLS: PowerTool[] = [
  {
    id: "PT-00123",
    toolName: "Angle Grinder",
    toolId: "PT-00123",
    toolType: "electric",
    manufacturer: "bosch",
    modelNumber: "GWS 750-100",
    powerRating: "750W",
    toolSize: "4\" disc",
    weight: "2.5 kg",
    purchaseDate: new Date("2023-02-14"),
    vendor: "Al-Futtaim Tools",
    condition: "good",
    assignedLocation: "Workshop A",
    assignedTo: "Mr. Ali",
    certificateNo: "TPI-POW-9876",
    certificateIssueDate: new Date("2024-06-01"),
    certificateExpiryDate: new Date("2025-05-31"),
    nextCalibrationDue: new Date("2025-01-01"),
    inspectionFrequency: "weekly",
    lastInspectionDate: new Date("2025-06-01"),
    inspectionStatus: "passed",
    remarks: "Blade to be replaced soon",
    operatorLicenseRequired: true,
    operatorName: "Javed Iqbal",
    storageLocation: "Tool Cabinet 2",
    safetyAccessories: "Gloves, Goggles, Ear Protection",
    status: "active"
  },
  {
    id: "PT-00124",
    toolName: "Hammer Drill",
    toolId: "PT-00124",
    toolType: "battery",
    manufacturer: "makita",
    modelNumber: "DCD996",
    powerRating: "18V",
    toolSize: "13mm chuck",
    weight: "1.8 kg",
    purchaseDate: new Date("2023-03-20"),
    vendor: "Al Madina Hardware",
    condition: "new",
    assignedLocation: "Site A",
    assignedTo: "Mechanical Dept",
    certificateNo: "TPI-POW-9877",
    certificateIssueDate: new Date("2024-07-15"),
    certificateExpiryDate: new Date("2025-07-15"),
    nextCalibrationDue: null,
    inspectionFrequency: "monthly",
    lastInspectionDate: new Date("2025-05-28"),
    inspectionStatus: "passed",
    remarks: "Battery backup excellent",
    operatorLicenseRequired: false,
    operatorName: "",
    storageLocation: "Store Room B",
    safetyAccessories: "Safety Glasses, Work Gloves",
    status: "active"
  },
  {
    id: "PT-00125",
    toolName: "Impact Wrench",
    toolId: "PT-00125",
    toolType: "pneumatic",
    manufacturer: "dewalt",
    modelNumber: "HR2470",
    powerRating: "2.5 HP",
    toolSize: "1/2\" drive",
    weight: "3.2 kg",
    purchaseDate: new Date("2023-01-10"),
    vendor: "Al-Futtaim Tools",
    condition: "maintenance",
    assignedLocation: "Project Falcon",
    assignedTo: "Store Keeper",
    certificateNo: "TPI-POW-9875",
    certificateIssueDate: new Date("2024-04-30"),
    certificateExpiryDate: new Date("2025-04-30"),
    nextCalibrationDue: new Date("2024-12-01"),
    inspectionFrequency: "weekly",
    lastInspectionDate: new Date("2025-05-20"),
    inspectionStatus: "needs-service",
    remarks: "Air hose connection loose, requires maintenance",
    operatorLicenseRequired: true,
    operatorName: "Ahmed Hassan",
    storageLocation: "Tool Cabinet 1",
    safetyAccessories: "Ear Protection, Safety Glasses",
    status: "maintenance"
  }
];

const PowerTools = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  
  // State management
  const [activeTab, setActiveTab] = useState("list"); // Changed default to list
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTool, setSelectedTool] = useState<PowerTool | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [tools, setTools] = useState<PowerTool[]>(SAMPLE_POWER_TOOLS);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PowerTool, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    status: "active"
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
    setIsModalOpen(true);
    setIsEditMode(true);
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
      status: "active"
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
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const stats = {
    total: tools.length,
    active: tools.filter(t => t.status === 'active').length,
    maintenance: tools.filter(t => t.status === 'maintenance').length,
    dueCalibration: tools.filter(t => 
      t.nextCalibrationDue && new Date(t.nextCalibrationDue) <= new Date()
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
                    {isRTL ? "نموذج بيانات الأداة الكهربائية" : "Power Tool Bio-Data Entry"}
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
                        <Label htmlFor="toolId">{isRTL ? "رقم الأداة / الرقم التسلسلي *" : "Tool ID / Serial Number *"}</Label>
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
                            <SelectItem value="electric">{isRTL ? "كهربائية" : "Electric"}</SelectItem>
                            <SelectItem value="battery">{isRTL ? "تعمل بالبطارية" : "Battery-Operated"}</SelectItem>
                            <SelectItem value="pneumatic">{isRTL ? "هوائية" : "Pneumatic"}</SelectItem>
                            <SelectItem value="manual">{isRTL ? "يدوية" : "Manual"}</SelectItem>
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
                            <SelectItem value="bosch">Bosch</SelectItem>
                            <SelectItem value="makita">Makita</SelectItem>
                            <SelectItem value="dewalt">DeWalt</SelectItem>
                            <SelectItem value="hilti">Hilti</SelectItem>
                            <SelectItem value="milwaukee">Milwaukee</SelectItem>
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
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    {isRTL ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button onClick={() => {
                    if (validateForm()) {
                      // Add logic to save the tool data here
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
                        status: "active"
                      });
                    }
                  }}>
                    {isRTL ? "حفظ الأداة الكهربائية" : "Save Power Tool"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي الأدوات" : "Total Tools"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}

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

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
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
                              <Badge variant="outline" className="mb-2">{tool.toolType}</Badge>
                              <div className="text-sm text-gray-600">
                                {isRTL ? "آخر فحص: " : "Last Inspection: "} 
                                {tool.lastInspectionDate ? format(tool.lastInspectionDate, "PPP") : "-"}
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
                    <Button variant="outline" onClick={() => setViewMode('list')}>
                      {isRTL ? "عودة إلى القائمة" : "Back to List"}
                    </Button>
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
                  alt="Tool preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PowerTools;