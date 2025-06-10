import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  X,
  Image as ImageIcon
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

// Enhanced Equipment interface
interface PowerTool {
  id: string;
  name: string;
  toolId: string;
  type: string;
  manufacturer: string;
  model: string;
  powerRating: string;
  toolSize: string;
  weight: string;
  purchaseDate: Date | null;
  vendor: string;
  condition: 'new' | 'good' | 'maintenance' | 'damaged';
  location: string;
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

const PowerToolsRegistry = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [tools, setTools] = useState<PowerTool[]>([
    {
      id: "PT-00123",
      name: "Angle Grinder",
      toolId: "PT-00123",
      type: "electric",
      manufacturer: "bosch",
      model: "GWS 750-100",
      powerRating: "750W",
      toolSize: "4\" disc",
      weight: "2.5 kg",
      purchaseDate: new Date("2023-02-14"),
      vendor: "Al-Futtaim Tools",
      condition: "good",
      location: "Workshop A",
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
      name: "Hammer Drill",
      toolId: "PT-00124",
      type: "battery",
      manufacturer: "makita",
      model: "DCD996",
      powerRating: "18V",
      toolSize: "13mm chuck",
      weight: "1.8 kg",
      purchaseDate: new Date("2023-03-20"),
      vendor: "Al Madina Hardware",
      condition: "new",
      location: "Site A",
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
      name: "Impact Wrench",
      toolId: "PT-00125",
      type: "pneumatic",
      manufacturer: "dewalt",
      model: "HR2470",
      powerRating: "2.5 HP",
      toolSize: "1/2\" drive",
      weight: "3.2 kg",
      purchaseDate: new Date("2023-01-01"),
      vendor: "Al-Futtaim Tools",
      condition: "maintenance",
      location: "Project Falcon",
      assignedTo: "Store Keeper",
      certificateNo: "2025-04-9875",
      certificateIssueDate: new Date("2024-04-30"),
      certificateExpiryDate: new Date("2025-04-30"),
      nextCalibrationDue: new Date("2024-12-25"),
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
  ]);
  
  // Form state
  const [formData, setFormData] = useState<Partial<PowerTool>>({
    id: "",
    name: "",
    toolId: "",
    type: "",
    manufacturer: "",
    model: "",
    powerRating: "",
    toolSize: "",
    weight: "",
    purchaseDate: null,
    vendor: "",
    condition: "new",
    location: "",
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
    image: ""
  });
  
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PowerTool, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form validation
  const validateForm = () => {
    const errors: Partial<Record<keyof PowerTool, string>> = {};
    
    if (!formData.name) errors.name = isRTL ? "اسم الأداة مطلوب" : "Tool Name is required";
    if (!formData.toolId) errors.toolId = isRTL ? "رقم الأداة مطلوب" : "Tool ID is required";
    if (!formData.type) errors.type = isRTL ? "نوع الأداة مطلوب" : "Tool Type is required";
    if (!formData.manufacturer) errors.manufacturer = isRTL ? "الشركة المصنعة مطلوبة" : "Manufacturer is required";
    if (!formData.condition) errors.condition = isRTL ? "حالة الأداة مطلوبة" : "Tool Condition is required";
    if (!formData.location) errors.location = isRTL ? "الموقع المخصص مطلوب" : "Assigned Location is required";
    if (!formData.assignedTo) errors.assignedTo = isRTL ? "التخصيص إلى مطلوب" : "Assigned To is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return "bg-green-100 text-green-800";
      case 'maintenance': return "bg-yellow-100 text-yellow-800";
      case 'inactive': return "bg-red-100 text-red-800";
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

  const handleInputChange = (field: keyof PowerTool, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Update handleImageUpload section to include preview functionality
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: isRTL ? "خطأ" : "Error",
          description: isRTL ? "حجم الصورة يتجاوز 10 ميغابايت" : "Image size exceeds 10MB",
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

  // Add image preview dialog state
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Add image preview handler
  const handleImagePreview = (imageUrl: string | undefined, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowImageDialog(true);
    }
  };

  const handleSaveTool = () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: isRTL ? "خطأ في النموذج" : "Form Error",
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
      });
      return;
    }

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

    // Reset form
    setFormData({
      id: "",
      name: "",
      toolId: "",
      type: "",
      manufacturer: "",
      model: "",
      powerRating: "",
      toolSize: "",
      weight: "",
      purchaseDate: null,
      vendor: "",
      condition: "new",
      location: "",
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
      image: ""
    });
    setImagePreview(null);
    setIsModalOpen(false);
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = searchTerm === "" || 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.toolId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || tool.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

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

  // Statistics
  const stats = {
    total: tools.length,
    active: tools.filter(t => t.status === 'active').length,
    maintenance: tools.filter(t => t.status === 'maintenance').length,
    dueCalibration: tools.filter(t => 
      t.nextCalibrationDue && new Date(t.nextCalibrationDue) <= new Date()
    ).length
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isRTL ? "سجل الأدوات الكهربائية" : "Power Tools Registry"}
              </h1>
              <p className="text-gray-600 mt-1">
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
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
                  <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      {isRTL ? "نموذج بيانات الأداة الكهربائية" : "Power Tool Bio-Data Entry"}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-lg p-1 mb-6">
                      <TabsTrigger value="basic" className="text-sm font-medium">
                        {isRTL ? "المعلومات الأساسية" : "Basic Info"}
                      </TabsTrigger>
                      <TabsTrigger value="technical" className="text-sm font-medium">
                        {isRTL ? "المواصفات الفنية" : "Technical"}
                      </TabsTrigger>
                      <TabsTrigger value="certification" className="text-sm font-medium">
                        {isRTL ? "الشهادات" : "Certification"}
                      </TabsTrigger>
                      <TabsTrigger value="assignment" className="text-sm font-medium">
                        {isRTL ? "التخصيص" : "Assignment"}
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="toolName" className="text-sm font-medium text-gray-700">
                            {isRTL ? "اسم الأداة *" : "Tool Name *"}
                          </Label>
                          <Input
                            id="toolName"
                            placeholder={isRTL ? "مثال: صاروخ زاوية، مثقاب مطرقة" : "e.g., Angle Grinder, Hammer Drill"}
                            value={formData.name || ""}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={formErrors.name ? "border-red-500" : ""}
                          />
                          {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                          <Label htmlFor="toolId" className="text-sm font-medium text-gray-700">
                            {isRTL ? "رقم الأداة / الرقم التسلسلي *" : "Tool ID / Serial Number *"}
                          </Label>
                          <Input
                            id="toolId"
                            placeholder={isRTL ? "مثال: PT-00123, SN-87654321" : "e.g., PT-00123, SN-87654321"}
                            value={formData.toolId || ""}
                            onChange={(e) => handleInputChange('toolId', e.target.value)}
                            className={formErrors.toolId ? "border-red-500" : ""}
                          />
                          {formErrors.toolId && <p className="text-red-500 text-xs mt-1">{formErrors.toolId}</p>}
                        </div>
                        <div>
                          <Label htmlFor="toolType" className="text-sm font-medium text-gray-700">
                            {isRTL ? "نوع الأداة *" : "Tool Type *"}
                          </Label>
                          <Select value={formData.type || ""} onValueChange={(value) => handleInputChange('type', value)}>
                            <SelectTrigger className={formErrors.type ? "border-red-500" : ""}>
                              <SelectValue placeholder={isRTL ? "اختر نوع الأداة" : "Select tool type"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="electric">{isRTL ? "كهربائية" : "Electric"}</SelectItem>
                              <SelectItem value="battery">{isRTL ? "تعمل بالبطارية" : "Battery-Operated"}</SelectItem>
                              <SelectItem value="pneumatic">{isRTL ? "هوائية" : "Pneumatic"}</SelectItem>
                              <SelectItem value="manual">{isRTL ? "يدوية" : "Manual"}</SelectItem>
                            </SelectContent>
                          </Select>
                          {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}
                        </div>
                        <div>
                          <Label htmlFor="manufacturer" className="text-sm font-medium text-gray-700">
                            {isRTL ? "الشركة المصنعة *" : "Manufacturer *"}
                          </Label>
                          <Select value={formData.manufacturer || ""} onValueChange={(value) => handleInputChange('manufacturer', value)}>
                            <SelectTrigger className={formErrors.manufacturer ? "border-red-500" : ""}>
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
                          {formErrors.manufacturer && <p className="text-red-500 text-xs mt-1">{formErrors.manufacturer}</p>}
                        </div>
                        <div>
                          <Label htmlFor="modelNumber" className="text-sm font-medium text-gray-700">
                            {isRTL ? "رقم الطراز" : "Model Number"}
                          </Label>
                          <Input
                            id="modelNumber"
                            placeholder={isRTL ? "مثال: GWS 750-100, DCD996" : "e.g., GWS 750-100, DCD996"}
                            value={formData.model || ""}
                            onChange={(e) => handleInputChange('model', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="condition" className="text-sm font-medium text-gray-700">
                            {isRTL ? "حالة الأداة *" : "Tool Condition *"}
                          </Label>
                          <Select value={formData.condition || ""} onValueChange={(value) => handleInputChange('condition', value)}>
                            <SelectTrigger className={formErrors.condition ? "border-red-500" : ""}>
                              <SelectValue placeholder={isRTL ? "اختر الحالة" : "Select condition"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">{isRTL ? "جديدة" : "New"}</SelectItem>
                              <SelectItem value="good">{isRTL ? "جيدة" : "Good"}</SelectItem>
                              <SelectItem value="maintenance">{isRTL ? "تحتاج صيانة" : "Requires Maintenance"}</SelectItem>
                              <SelectItem value="damaged">{isRTL ? "معطلة" : "Damaged"}</SelectItem>
                            </SelectContent>
                          </Select>
                          {formErrors.condition && <p className="text-red-500 text-xs mt-1">{formErrors.condition}</p>}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="purchaseDate" className="text-sm font-medium text-gray-700">
                            {isRTL ? "تاريخ الشراء" : "Date of Purchase"}
                          </Label>
                          <DatePicker
                            date={formData.purchaseDate}
                            onDateChange={(date) => handleInputChange('purchaseDate', date)}
                            placeholder={isRTL ? "اختر تاريخ الشراء" : "Select purchase date"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="vendor" className="text-sm font-medium text-gray-700">
                            {isRTL ? "المورد / البائع" : "Vendor / Supplier"}
                          </Label>
                          <Input
                            id="vendor"
                            placeholder={isRTL ? "مثال: الفطيم للأدوات، أجهزة المدينة" : "e.g., Al-Futtaim Tools, Al Madina Hardware"}
                            value={formData.vendor || ""}
                            onChange={(e) => handleInputChange('vendor', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="toolPhoto" className="text-sm font-medium text-gray-700">
                          {isRTL ? "صورة الأداة (اختيارية)" : "Tool Photo (Optional)"}
                        </Label>
                        <div className="mt-2">
                          {imagePreview ? (
                            <div className="relative w-full h-48 border-2 border-gray-300 rounded-md overflow-hidden">
                              <img src={imagePreview} alt="Tool Preview" className="w-full h-full object-cover" />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={removeImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <div className="space-y-1 text-center">
                                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                  <span>{isRTL ? "رفع صورة" : "Upload a photo"}</span>
                                  <p className="pl-1">{isRTL ? "أو اسحب وأفلت" : "or drag and drop"}</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                              </div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="technical" className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="powerRating" className="text-sm font-medium text-gray-700">
                            {isRTL ? "الطاقة التقييمية" : "Power Rating"}
                          </Label>
                          <Input
                            id="powerRating"
                            placeholder={isRTL ? "مثال: 750 واط، 18 فولت، 2.5 حصان" : "e.g., 750W, 18V, 2.5 HP"}
                            value={formData.powerRating || ""}
                            onChange={(e) => handleInputChange('powerRating', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="toolSize" className="text-sm font-medium text-gray-700">
                            {isRTL ? "حجم الأداة/السعة" : "Tool Size/Capacity"}
                          </Label>
                          <Input
                            id="toolSize"
                            placeholder={isRTL ? "مثال: قرص 4 بوصة، ظرف 13 ملم، محرك 1/2 بوصة" : "e.g., 4\" disc, 13mm chuck, 1/2\" drive"}
                            value={formData.toolSize || ""}
                            onChange={(e) => handleInputChange('toolSize', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                            {isRTL ? "الوزن" : "Weight"}
                          </Label>
                          <Input
                            id="weight"
                            placeholder={isRTL ? "مثال: 2.5 كجم، 4.8 رطل" : "e.g., 2.5 kg, 4.8 lbs"}
                            value={formData.weight || ""}
                            onChange={(e) => handleInputChange('weight', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="safetyAccessories" className="text-sm font-medium text-gray-700">
                            {isRTL ? "الملحقات الأمنية المطلوبة" : "Safety Accessories Required"}
                          </Label>
                          <Input
                            id="safetyAccessories"
                            placeholder={isRTL ? "مثال: قفازات، نظارات واقية، حماية الأذن" : "e.g., Gloves, Goggles, Ear Protection"}
                            value={formData.safetyAccessories || ""}
                            onChange={(e) => handleInputChange('safetyAccessories', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <Label htmlFor="inspectionFrequency" className="text-sm font-medium text-gray-700">
                            {isRTL ? "تكرار الفحص" : "Inspection Frequency"}
                          </Label>
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
                          <Label htmlFor="lastInspectionDate" className="text-sm font-medium text-gray-700">
                            {isRTL ? "تاريخ الفحص الأخير" : "Last Inspection Date"}
                          </Label>
                          <DatePicker
                            date={formData.lastInspectionDate}
                            onDateChange={(date) => handleInputChange('lastInspectionDate', date)}
                            placeholder={isRTL ? "اختر تاريخ الفحص" : "Select inspection date"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="inspectionStatus" className="text-sm font-medium text-gray-700">
                            {isRTL ? "حالة الفحص" : "Inspection Status"}
                          </Label>
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
                        <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">
                          {isRTL ? "ملاحظات" : "Remarks"}
                        </Label>
                        <Textarea
                          id="remarks"
                          placeholder={isRTL ? "مثال: يجب استبدال الشفرة، بطارية احتياطية منخفضة" : "e.g., Blade to be replaced, Battery backup low"}
                          value={formData.remarks || ""}
                          onChange={(e) => handleInputChange('remarks', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="certification" className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="certificateNo" className="text-sm font-medium text-gray-700">
                            {isRTL ? "رقم شهادة الطرف الثالث" : "Third-Party Certificate No."}
                          </Label>
                          <Input
                            id="certificateNo"
                            placeholder={isRTL ? "مثال: TPI-POW-9876" : "e.g., TPI-POW-9876"}
                            value={formData.certificateNo || ""}
                            onChange={(e) => handleInputChange('certificateNo', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="nextCalibrationDue" className="text-sm font-medium text-gray-700">
                            {isRTL ? "المعايرة التالية المستحقة" : "Next Calibration Due"}
                          </Label>
                          <DatePicker
                            date={formData.nextCalibrationDue}
                            onDateChange={(date) => handleInputChange('nextCalibrationDue', date)}
                            placeholder={isRTL ? "اختر تاريخ المعايرة" : "Select calibration date"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="certificateIssueDate" className="text-sm font-medium text-gray-700">
                            {isRTL ? "تاريخ إصدار الشهادة" : "Certificate Issue Date"}
                          </Label>
                          <DatePicker
                            date={formData.certificateIssueDate}
                            onDateChange={(date) => handleInputChange('certificateIssueDate', date)}
                            placeholder={isRTL ? "اختر تاريخ الإصدار" : "Select issue date"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="certificateExpiryDate" className="text-sm font-medium text-gray-700">
                            {isRTL ? "تاريخ انتهاء الشهادة" : "Certificate Expiry Date"}
                          </Label>
                          <DatePicker
                            date={formData.certificateExpiryDate}
                            onDateChange={(date) => handleInputChange('certificateExpiryDate', date)}
                            placeholder={isRTL ? "اختر تاريخ الانتهاء" : "Select expiry date"}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="assignment" className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                            {isRTL ? "الموقع المخصص *" : "Assigned Location *"}
                          </Label>
                          <Input
                            id="location"
                            placeholder={isRTL ? "مثال: ورشة، موقع أ، مشروع فالكون" : "e.g., Workshop, Site A, Project Falcon"}
                            value={formData.location || ""}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className={formErrors.location ? "border-red-500" : ""}
                          />
                          {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                        </div>
                        <div>
                          <Label htmlFor="assignedTo" className="text-sm font-medium text-gray-700">
                            {isRTL ? "مخصص لـ (شخص/قسم) *" : "Assigned To (Person/Dept) *"}
                          </Label>
                          <Input
                            id="assignedTo"
                            placeholder={isRTL ? "مثال: السيد علي، قسم الميكانيكا، أمين المخزن" : "e.g., Mr. Ali / Mechanical Dept / Store Keeper"}
                            value={formData.assignedTo || ""}
                            onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                            className={formErrors.assignedTo ? "border-red-500" : ""}
                          />
                          {formErrors.assignedTo && <p className="text-red-500 text-xs mt-1">{formErrors.assignedTo}</p>}
                        </div>
                        <div>
                          <Label htmlFor="storageLocation" className="text-sm font-medium text-gray-700">
                            {isRTL ? "موقع التخزين" : "Storage Location"}
                          </Label>
                          <Input
                            id="storageLocation"
                            placeholder={isRTL ? "مثال: خزانة الأدوات 2، غرفة التخزين ب" : "e.g., Tool Cabinet 2, Store Room B"}
                            value={formData.storageLocation || ""}
                            onChange={(e) => handleInputChange('storageLocation', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="operatorLicenseRequired" className="text-sm font-medium text-gray-700">
                            {isRTL ? "مطلوب رخصة المشغل" : "Operator License Required"}
                          </Label>
                          <Select
                            value={formData.operatorLicenseRequired ? "yes" : "no"} 
                            onValueChange={(value) => handleInputChange('operatorLicenseRequired', value === "yes")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={isRTL ? "اختر المتطلبات" : "Select requirement"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">{isRTL ? "نعم" : "Yes"}</SelectItem>
                              <SelectItem value="no">{isRTL ? "لا" : "No"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="operatorName" className="text-sm font-medium text-gray-700">
                            {isRTL ? "اسم المشغل (إذا تم تخصيصه)" : "Operator Name (if assigned)"}
                          </Label>
                          <Input
                            id="operatorName"
                            placeholder={isRTL ? "مثال: جاويد إقبال" : "e.g., Javed Iqbal"}
                            value={formData.operatorName || ""}
                            onChange={(e) => handleInputChange('operatorName', e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsModalOpen(false);
                        setFormData({
                          id: "",
                          name: "",
                          toolId: "",
                          type: "",
                          manufacturer: "",
                          model: "",
                          powerRating: "",
                          toolSize: "",
                          weight: "",
                          purchaseDate: null,
                          vendor: "",
                          condition: "new",
                          location: "",
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
                          image: ""
                        });
                        setImagePreview(null);
                        setFormErrors({});
                      }}
                    >
                      {isRTL ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={handleSaveTool}
                      className="bg-primary text-white hover:bg-primary-600"
                    >
                      {isRTL ? "حفظ الأداة الكهربائية" : "Save Power Tool"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={isRTL ? "البحث حسب اسم الأداة، الرقم، أو الشركة المصنعة..." : "Search by tool name, ID, or manufacturer..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={isRTL ? "تصفية حسب الحالة" : "Filter by status"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? "كل الحالات" : "All Status"}</SelectItem>
                    <SelectItem value="active">{isRTL ? "نشطة" : "Active"}</SelectItem>
                    <SelectItem value="maintenance">{isRTL ? "صيانة" : "Maintenance"}</SelectItem>
                    <SelectItem value="inactive">{isRTL ? "غير نشطة" : "Inactive"}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  {isRTL ? "المزيد من الفلاتر" : "More Filters"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tools List */}
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "جرد الأدوات الكهربائية" : "Power Tools Inventory"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                <tbody>
                  {filteredTools.map((tool) => (
                    <tr key={tool.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={(e) => handleImagePreview(tool.image, e)}
                          >
                            {tool.image ? (
                              <img 
                                src={tool.image} 
                                alt={tool.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{tool.name}</div>
                            <div className="text-sm text-gray-500">ID: {tool.id}</div>
                            <div className="text-sm text-gray-500">{tool.manufacturer} {tool.model}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <Badge variant="outline" className="mb-2">{tool.type}</Badge>
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
                            {tool.location}
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
                            <span className="ml-1">
                              {isRTL ? 
                                (tool.condition === "new" ? "جديدة" : 
                                 tool.condition === "good" ? "جيدة" : 
                                 tool.condition === "maintenance" ? "تحتاج صيانة" : "معطلة") 
                                : tool.condition.charAt(0).toUpperCase() + tool.condition.slice(1)}
                            </span>
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
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
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

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{isRTL ? "إنشاء التقارير" : "Generate Reports"}</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
            <CheckCircle className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{isRTL ? "قائمة الفحص" : "Inspection Checklist"}</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
            <AlertTriangle className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{isRTL ? "صيانة مستحقة" : "Maintenance Due"}</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
            <Upload className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{isRTL ? "استيراد مجمع" : "Bulk Import"}</span>
          </Button>
        </div>
      </div>

      {/* Add Image Preview Dialog */}
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
  );
};

export default PowerToolsRegistry;