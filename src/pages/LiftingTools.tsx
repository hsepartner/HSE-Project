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

// Lifting Accessory interface
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
}

// Sample data for lifting accessories
const SAMPLE_LIFTING_ACCESSORIES: LiftingAccessory[] = [
  {
    id: "LA-00124",
    accessoryName: "Wire Rope Sling",
    accessoryId: "WRS-0044",
    accessoryType: "sling",
    manufacturer: "Crosby",
    modelNumber: "G-2160",
    safeWorkingLoad: "3T",
    sizeDimensions: "Ø16mm x 3m",
    weight: "2.5 kg",
    purchaseDate: new Date("2024-02-15"),
    vendor: "SafeLift Equipment",
    condition: "new",
    assignedLocation: "Main Store",
    assignedTo: "Lifting Team",
    certificateNo: "TPI-LA-2024-100",
    certificateIssueDate: new Date("2024-03-01"),
    certificateExpiryDate: new Date("2025-03-01"),
    nextInspectionDue: new Date("2024-09-01"),
    inspectionFrequency: "6 months",
    lastInspectionDate: new Date("2024-03-01"),
    inspectionStatus: "passed",
    remarks: "Regular inspection required",
    safetyCertified: true,
    inspectorName: "Ahmed Hassan",
    storageLocation: "Site B",
    safetyColorCode: "green",
    status: "inspection",
    image: ""
  },
  {
    id: "LA-00125",
    accessoryName: "D-Shackle",
    accessoryId: "DSH-0045",
    accessoryType: "shackle",
    manufacturer: "Green Pin",
    modelNumber: "G-4163",
    safeWorkingLoad: "4.75T",
    sizeDimensions: "Ø19mm",
    weight: "0.6 kg",
    purchaseDate: new Date("2024-01-20"),
    vendor: "TechLift Supplies",
    condition: "new",
    assignedLocation: "Crane No. 2",
    assignedTo: "Lifting Team",
    certificateNo: "TPI-LA-2024-101",
    certificateIssueDate: new Date("2024-02-01"),
    certificateExpiryDate: new Date("2025-02-01"),
    nextInspectionDue: new Date("2024-11-01"),
    inspectionFrequency: "6 months",
    lastInspectionDate: new Date("2024-05-01"),
    inspectionStatus: "passed",
    remarks: "No issues reported",
    safetyCertified: true,
    inspectorName: "Khalid Omar",
    storageLocation: "Tool Cabinet 1",
    safetyColorCode: "blue",
    status: "active",
    image: ""
  }
];

const LiftingTools = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  
  // State management
  const [activeTab, setActiveTab] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAccessory, setSelectedAccessory] = useState<LiftingAccessory | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [accessories, setAccessories] = useState<LiftingAccessory[]>(SAMPLE_LIFTING_ACCESSORIES);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LiftingAccessory, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
    image: ""
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

  // Handlers for view and edit
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
      image: ""
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
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const stats = {
    total: accessories.length,
    active: accessories.filter(a => a.status === 'active').length,
    inspection: accessories.filter(a => a.status === 'inspection').length,
    dueInspection: accessories.filter(a => 
      a.nextInspectionDue && new Date(a.nextInspectionDue) <= new Date()
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
                    {isRTL ? "نموذج بيانات ملحق الرفع" : "Lifting Accessory Bio-Data Entry"}
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
                        image: ""
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
                    {isRTL ? "حفظ ملحق الرفع" : "Save Lifting Accessory"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                      </div>
                    </div>
                    
                    <div className="space-y-4">                      <h3 className="font-semibold">{isRTL ? "حالة التشغيل" : "Operational Status"}</h3>
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
              <CardContent>                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 mb-2" />
                    <span>{isRTL ? "تقرير الفحص الدوري" : "Periodic Inspection Report"}</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Clock className="h-6 w-6 mb-2" />
                    <span>{isRTL ? "تقرير الفحص المستحق" : "Due Inspection Report"}</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
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
              <DialogTitle>{isRTL ? "معاينة الصورة" : "Image Preview"} </DialogTitle>
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
      </div>
    </DashboardLayout>
  );
};

export default LiftingTools;