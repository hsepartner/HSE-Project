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
  MapPin, 
  FileText, 
  Settings, 
  Camera,
  X,
  Image as ImageIcon
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

// Lifting Accessory interface
interface LiftingAccessory {
  id: string;
  name: string;
  accessoryId: string;
  type: string;
  material: string;
  sizeSWL: string;
  lengthDiameter: string;
  manufacturer: string;
  countryOfOrigin: string;
  modelNumber: string;
  manufactureDate: Date | null;
  purchaseDate: Date | null;
  location: string;
  status: 'in-use' | 'in-storage' | 'under-inspection' | 'decommissioned';
  assignedTo: string;
  certNo: string;
  certAgency: string;
  certIssueDate: Date | null;
  certExpiryDate: Date | null;
  nextInspectionDue: Date | null;
  inspectionFrequency: '6 months' | '1 year';
  lastInspectionDate: Date | null;
  inspectionResult: 'passed' | 'rejected' | 'to-be-replaced';
  visualCondition: 'ok' | 'frayed' | 'bent' | 'corroded' | 'cracked';
  loadTestRecord: string;
  safetyColorCode: 'blue' | 'green' | 'yellow' | 'red';
  tagMarking: string;
  remarks: string;
  image?: string;
}

const LiftingToolsRegistry = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [accessories, setAccessories] = useState<LiftingAccessory[]>([
    {
      id: "LA-2024-001",
      name: "Chain Sling",
      accessoryId: "LA-2024-001",
      type: "Sling",
      material: "Alloy Steel",
      sizeSWL: "2T",
      lengthDiameter: "2 meters",
      manufacturer: "Crosby",
      countryOfOrigin: "USA",
      modelNumber: "CSL-200",
      manufactureDate: new Date("2024-01-10"),
      purchaseDate: new Date("2024-02-15"),
      location: "Main Store",
      status: "in-use",
      assignedTo: "Rigging Crew",
      certNo: "TPI-LA-2024-099",
      certAgency: "TUV",
      certIssueDate: new Date("2024-03-15"),
      certExpiryDate: new Date("2025-03-14"),
      nextInspectionDue: new Date("2025-01-15"),
      inspectionFrequency: "6 months",
      lastInspectionDate: new Date("2024-07-10"),
      inspectionResult: "passed",
      visualCondition: "ok",
      loadTestRecord: "Load tested at 2.5T on 2024-07-10",
      safetyColorCode: "yellow",
      tagMarking: "Engraved Tag: LA-001",
      remarks: "Good condition, regular maintenance required",
      image: ""
    },
    {
      id: "LA-2024-002",
      name: "Web Sling",
      accessoryId: "SCL-0009",
      type: "Sling",
      material: "Polyester",
      sizeSWL: "3.25T",
      lengthDiameter: "3 meters",
      manufacturer: "Yoke",
      countryOfOrigin: "India",
      modelNumber: "WS-325",
      manufactureDate: new Date("2023-12-20"),
      purchaseDate: new Date("2024-03-10"),
      location: "Workshop Bay 3",
      status: "under-inspection",
      assignedTo: "Mechanical Department",
      certNo: "TPI-LA-2024-100",
      certAgency: "SGS",
      certIssueDate: new Date("2024-04-01"),
      certExpiryDate: new Date("2025-04-01"),
      nextInspectionDue: new Date("2024-12-01"),
      inspectionFrequency: "1 year",
      lastInspectionDate: new Date("2024-06-15"),
      inspectionResult: "to-be-replaced",
      visualCondition: "frayed",
      loadTestRecord: "Load tested at 4T on 2024-06-15",
      safetyColorCode: "green",
      tagMarking: "Color Coded",
      remarks: "Slight abrasion detected, recommend replacement",
      image: ""
    }
  ]);

  // Form state
  const [formData, setFormData] = useState<Partial<LiftingAccessory>>({
    id: "",
    name: "",
    accessoryId: "",
    type: "",
    material: "",
    sizeSWL: "",
    lengthDiameter: "",
    manufacturer: "",
    countryOfOrigin: "",
    modelNumber: "",
    manufactureDate: null,
    purchaseDate: null,
    location: "",
    status: "in-use",
    assignedTo: "",
    certNo: "",
    certAgency: "",
    certIssueDate: null,
    certExpiryDate: null,
    nextInspectionDue: null,
    inspectionFrequency: "6 months",
    lastInspectionDate: null,
    inspectionResult: "passed",
    visualCondition: "ok",
    loadTestRecord: "",
    safetyColorCode: "blue",
    tagMarking: "",
    remarks: "",
    image: ""
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LiftingAccessory, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form validation
  const validateForm = () => {
    const errors: Partial<Record<keyof LiftingAccessory, string>> = {};
    
    if (!formData.name) errors.name = isRTL ? "اسم الملحق مطلوب" : "Accessory Name is required";
    if (!formData.accessoryId) errors.accessoryId = isRTL ? "رقم الملحق مطلوب" : "Accessory ID is required";
    if (!formData.type) errors.type = isRTL ? "نوع الملحق مطلوب" : "Accessory Type is required";
    if (!formData.material) errors.material = isRTL ? "المادة مطلوبة" : "Material is required";
    if (!formData.manufacturer) errors.manufacturer = isRTL ? "الشركة المصنعة مطلوبة" : "Manufacturer is required";
    if (!formData.location) errors.location = isRTL ? "الموقع المخصص مطلوب" : "Location is required";
    if (!formData.assignedTo) errors.assignedTo = isRTL ? "التخصيص إلى مطلوب" : "Assigned To is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-use': return "bg-green-100 text-green-800";
      case 'in-storage': return "bg-blue-100 text-blue-800";
      case 'under-inspection': return "bg-yellow-100 text-yellow-800";
      case 'decommissioned': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "ok": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "frayed": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "bent": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "corroded": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "cracked": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleInputChange = (field: keyof LiftingAccessory, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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

  const removeImage = () => {
    setImagePreview(null);
    handleInputChange('image', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePreview = (imageUrl: string | undefined, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowImageDialog(true);
    }
  };

  const handleSaveAccessory = () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: isRTL ? "خطأ في النموذج" : "Form Error",
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
      });
      return;
    }

    const newAccessory: LiftingAccessory = {
      ...formData,
      id: formData.accessoryId || `LA-${Math.random().toString(36).substr(2, 9)}`,
      status: formData.status || 'in-use',
    } as LiftingAccessory;

    setAccessories(prev => [...prev, newAccessory]);
    toast({
      title: isRTL ? "نجاح" : "Success",
      description: isRTL ? "تم إضافة الملحق بنجاح" : "Accessory added successfully",
    });

    // Reset form
    setFormData({
      id: "",
      name: "",
      accessoryId: "",
      type: "",
      material: "",
      sizeSWL: "",
      lengthDiameter: "",
      manufacturer: "",
      countryOfOrigin: "",
      modelNumber: "",
      manufactureDate: null,
      purchaseDate: null,
      location: "",
      status: "in-use",
      assignedTo: "",
      certNo: "",
      certAgency: "",
      certIssueDate: null,
      certExpiryDate: null,
      nextInspectionDue: null,
      inspectionFrequency: "6 months",
      lastInspectionDate: null,
      inspectionResult: "passed",
      visualCondition: "ok",
      loadTestRecord: "",
      safetyColorCode: "blue",
      tagMarking: "",
      remarks: "",
      image: ""
    });
    setImagePreview(null);
    setIsModalOpen(false);
  };

  const filteredAccessories = accessories.filter(accessory => {
    const matchesSearch = searchTerm === "" || 
      accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.accessoryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || accessory.status === filterStatus;
    
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
    total: accessories.length,
    inUse: accessories.filter(a => a.status === 'in-use').length,
    inStorage: accessories.filter(a => a.status === 'in-storage').length,
    dueInspection: accessories.filter(a => 
      a.nextInspectionDue && new Date(a.nextInspectionDue) <= new Date()
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
                {isRTL ? "سجل ملحقات الرفع" : "Lifting Accessories Registry"}
              </h1>
              <p className="text-gray-600 mt-1">
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
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
                  <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      {isRTL ? "نموذج بيانات ملحق الرفع" : "Lifting Accessory Bio-Data Entry"}
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
                          <Label htmlFor="accessoryName" className="text-sm font-medium text-gray-700">
                            {isRTL ? "اسم الملحق *" : "Accessory Name *"}
                          </Label>
                          <Input
                            id="accessoryName"
                            placeholder={isRTL ? "مثال: سلسلة رفع، حبل شبكي، مشبك D" : "e.g., Chain Sling, Web Sling, D-Shackle"}
                            value={formData.name || ""}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={formErrors.name ? "border-red-500" : ""}
                          />
                          {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                          <Label htmlFor="accessoryId" className="text-sm font-medium text-gray-700">
                            {isRTL ? "رقم الملحق / الرقم التسلسلي *" : "Accessory ID / Serial Number *"}
                          </Label>
                          <Input
                            id="accessoryId"
                            placeholder={isRTL ? "مثال: LA-2024-001, SCL-0009" : "e.g., LA-2024-001, SCL-0009"}
                            value={formData.accessoryId || ""}
                            onChange={(e) => handleInputChange('accessoryId', e.target.value)}
                            className={formErrors.accessoryId ? "border-red-500" : ""}
                          />
                          {formErrors.accessoryId && <p className="text-red-500 text-xs mt-1">{formErrors.accessoryId}</p>}
                        </div>
                        <div>
                          <Label htmlFor="accessoryType" className="text-sm font-medium text-gray-700">
                            {isRTL ? "نوع الملحق *" : "Accessory Type *"}
                          </Label>
                          <Select value={formData.type || ""} onValueChange={(value) => handleInputChange('type', value)}>
                            <SelectTrigger className={formErrors.type ? "border-red-500" : ""}>
                              <SelectValue placeholder={isRTL ? "اختر نوع الملحق" : "Select accessory type"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sling">{isRTL ? "حبل" : "Sling"}</SelectItem>
                              <SelectItem value="Shackle">{isRTL ? "مشبك" : "Shackle"}</SelectItem>
                              <SelectItem value="Hook">{isRTL ? "خطاف" : "Hook"}</SelectItem>
                              <SelectItem value="Eyebolt">{isRTL ? "برغي عين" : "Eyebolt"}</SelectItem>
                              <SelectItem value="Turnbuckle">{isRTL ? "مشبك شد" : "Turnbuckle"}</SelectItem>
                            </SelectContent>
                          </Select>
                          {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}
                        </div>
                        <div>
                          <Label htmlFor="material" className="text-sm font-medium text-gray-700">
                            {isRTL ? "المادة *" : "Material *"}
                          </Label>
                          <Select value={formData.material || ""} onValueChange={(value) => handleInputChange('material', value)}>
                            <SelectTrigger className={formErrors.material ? "border-red-500" : ""}>
                              <SelectValue placeholder={isRTL ? "اختر المادة" : "Select material"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Alloy Steel">{isRTL ? "فولاذ سبائكي" : "Alloy Steel"}</SelectItem>
                              <SelectItem value="Galvanized Steel">{isRTL ? "فولاذ مجلفن" : "Galvanized Steel"}</SelectItem>
                              <SelectItem value="Polyester">{isRTL ? "بوليستر" : "Polyester"}</SelectItem>
                              <SelectItem value="Stainless Steel">{isRTL ? "فولاذ مقاوم للصدأ" : "Stainless Steel"}</SelectItem>
                            </SelectContent>
                          </Select>
                          {formErrors.material && <p className="text-red-500 text-xs mt-1">{formErrors.material}</p>}
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
                              <SelectItem value="Crosby">Crosby</SelectItem>
                              <SelectItem value="Green Pin">Green Pin</SelectItem>
                              <SelectItem value="Yoke">Yoke</SelectItem>
                              <SelectItem value="Gunnebo">Gunnebo</SelectItem>
                              <SelectItem value="Usha Martin">Usha Martin</SelectItem>
                            </SelectContent>
                          </Select>
                          {formErrors.manufacturer && <p className="text-red-500 text-xs mt-1">{formErrors.manufacturer}</p>}
                        </div>
                        <div>
                          <Label htmlFor="countryOfOrigin" className="text-sm font-medium text-gray-700">
                            {isRTL ? "بلد المنشأ" : "Country of Origin"}
                          </Label>
                          <Input
                            id="countryOfOrigin"
                            placeholder={isRTL ? "مثال: ألمانيا، الهند، الولايات المتحدة" : "e.g., Germany, India, USA"}
                            value={formData.countryOfOrigin || ""}
                            onChange={(e) => handleInputChange('countryOfOrigin', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="manufactureDate" className="text-sm font-medium text-gray-700">
                            {isRTL ? "تاريخ الصنع" : "Date of Manufacture"}
                          </Label>
                          <DatePicker
                            date={formData.manufactureDate}
                            onDateChange={(date) => handleInputChange('manufactureDate', date)}
                            placeholder={isRTL ? "اختر تاريخ الصنع" : "Select manufacture date"}
                          />
                        </div>
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
                      </div>

                      <div>
                        <Label htmlFor="accessoryPhoto" className="text-sm font-medium text-gray-700">
                          {isRTL ? "صورة الملحق (اختيارية)" : "Accessory Photo (Optional)"}
                        </Label>
                        <div className="mt-2">
                          {imagePreview ? (
                            <div className="relative w-full h-48 border-2 border-gray-300 rounded-md overflow-hidden">
                              <img src={imagePreview} alt="Accessory Preview" className="w-full h-full object-cover" />
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
                          <Label htmlFor="sizeSWL" className="text-sm font-medium text-gray-700">
                            {isRTL ? "الحجم / الحمولة الآمنة (SWL)" : "Size / Safe Working Load (SWL)"}
                          </Label>
                          <Input
                            id="sizeSWL"
                            placeholder={isRTL ? "مثال: 10 ملم / 2 طن، 3.25 طن" : "e.g., 10 mm / 2T, 3.25T"}
                            value={formData.sizeSWL || ""}
                            onChange={(e) => handleInputChange('sizeSWL', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lengthDiameter" className="text-sm font-medium text-gray-700">
                            {isRTL ? "الطول / القطر" : "Length / Diameter"}
                          </Label>
                          <Input
                            id="lengthDiameter"
                            placeholder={isRTL ? "مثال: 2 متر، Ø12 ملم" : "e.g., 2 meters, Ø12mm"}
                            value={formData.lengthDiameter || ""}
                            onChange={(e) => handleInputChange('lengthDiameter', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="modelNumber" className="text-sm font-medium text-gray-700">
                            {isRTL ? "رقم الطراز" : "Model Number"}
                          </Label>
                          <Input
                            id="modelNumber"
                            placeholder={isRTL ? "مثال: GP325A, CM500" : "e.g., GP325A, CM500"}
                            value={formData.modelNumber || ""}
                            onChange={(e) => handleInputChange('modelNumber', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="safetyColorCode" className="text-sm font-medium text-gray-700">
                            {isRTL ? "كود اللون الأمني" : "Safety Color Code"}
                          </Label>
                          <Select value={formData.safetyColorCode || ""} onValueChange={(value) => handleInputChange('safetyColorCode', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder={isRTL ? "اختر كود اللون" : "Select color code"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blue">{isRTL ? "أزرق (يناير-مارس)" : "Blue (Jan-Mar)"}</SelectItem>
                              <SelectItem value="green">{isRTL ? "أخضر (أبريل-يونيو)" : "Green (Apr-Jun)"}</SelectItem>
                              <SelectItem value="yellow">{isRTL ? "أصفر (يوليو-سبتمبر)" : "Yellow (Jul-Sep)"}</SelectItem>
                              <SelectItem value="red">{isRTL ? "أحمر (أكتوبر-ديسمبر)" : "Red (Oct-Dec)"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="inspectionFrequency" className="text-sm font-medium text-gray-700">
                            {isRTL ? "تكرار الفحص" : "Inspection Frequency"}
                          </Label>
                          <Select value={formData.inspectionFrequency || ""} onValueChange={(value) => handleInputChange('inspectionFrequency', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder={isRTL ? "اختر التكرار" : "Select frequency"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6 months">{isRTL ? "6 أشهر" : "6 Months"}</SelectItem>
                              <SelectItem value="1 year">{isRTL ? "سنة واحدة" : "1 Year"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="inspectionResult" className="text-sm font-medium text-gray-700">
                            {isRTL ? "نتيجة الفحص" : " düzgün Inspection Result"}
                          </Label>
                          <Select value={formData.inspectionResult || ""} onValueChange={(value) => handleInputChange('inspectionResult', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder={isRTL ? "اختر النتيجة" : "Select result"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="passed">{isRTL ? "نجح" : "Passed"}</SelectItem>
                              <SelectItem value="rejected">{isRTL ? "مرفوض" : "Rejected"}</SelectItem>
                              <SelectItem value="to-be-replaced">{isRTL ? "يجب استبداله" : "To Be Replaced"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="visualCondition" className="text-sm font-medium text-gray-700">
                          {isRTL ? "الحالة البصرية" : "Visual Condition"}
                        </Label>
                        <Select value={formData.visualCondition || ""} onValueChange={(value) => handleInputChange('visualCondition', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? "اختر الحالة" : "Select condition"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ok">{isRTL ? "جيد" : "OK"}</SelectItem>
                            <SelectItem value="frayed">{isRTL ? "مهترئ" : "Frayed"}</SelectItem>
                            <SelectItem value="bent">{isRTL ? "منحني" : "Bent"}</SelectItem>
                            <SelectItem value="corroded">{isRTL ? "متآكل" : "Corroded"}</SelectItem>
                            <SelectItem value="cracked">{isRTL ? "متشقق" : "Cracked"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="loadTestRecord" className="text-sm font-medium text-gray-700">
                          {isRTL ? "سجل اختبار الحمولة" : "Load Test Record"}
                        </Label>
                        <Input
                          id="loadTestRecord"
                          placeholder={isRTL ? "مثال: تم اختبار الحمولة عند 2.5 طن في 2024-07-10" : "e.g., Load tested at 2.5T on 2024-07-10"}
                          value={formData.loadTestRecord || ""}
                          onChange={(e) => handleInputChange('loadTestRecord', e.target.value)}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="certification" className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="certNo" className="text-sm font-medium text-gray-700">
                            {isRTL ? "رقم شهادة الطرف الثالث" : "Third-Party Certificate No."}
                          </Label>
                          <Input
                            id="certNo"
                            placeholder={isRTL ? "مثال: TPI-LA-2024-099" : "e.g., TPI-LA-2024-099"}
                            value={formData.certNo || ""}
                            onChange={(e) => handleInputChange('certNo', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="certAgency" className="text-sm font-medium text-gray-700">
                            {isRTL ? "وكالة التصديق" : "Certification Agency"}
                          </Label>
                          <Select value={formData.certAgency || ""} onValueChange={(value) => handleInputChange('certAgency', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder={isRTL ? "اختر الوكالة" : "Select agency"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TUV">TUV</SelectItem>
                              <SelectItem value="BV">BV</SelectItem>
                              <SelectItem value="SGS">SGS</SelectItem>
                              <SelectItem value="DNV">DNV</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="certIssueDate" className="text-sm font-medium text-gray-700">
                            {isRTL ? "تاريخ إصدار الشهادة" : "Certificate Issue Date"}
                          </Label>
                          <DatePicker
                            date={formData.certIssueDate}
                            onDateChange={(date) => handleInputChange('certIssueDate', date)}
                            placeholder={isRTL ? "اختر تاريخ الإصدار" : "Select issue date"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="certExpiryDate" className="text-sm font-medium text-gray-700">
                            {isRTL ? "تاريخ انتهاء الشهادة" : "Certificate Expiry Date"}
                          </Label>
                          <DatePicker
                            date={formData.certExpiryDate}
                            onDateChange={(date) => handleInputChange('certExpiryDate', date)}
                            placeholder={isRTL ? "اختر تاريخ الانتهاء" : "Select expiry date"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="nextInspectionDue" className="text-sm font-medium text-gray-700">
                            {isRTL ? "الفحص التالي المستحق" : "Next Inspection Due"}
                          </Label>
                          <DatePicker
                            date={formData.nextInspectionDue}
                            onDateChange={(date) => handleInputChange('nextInspectionDue', date)}
                            placeholder={isRTL ? "اختر تاريخ الفحص" : "Select inspection date"}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="assignment" className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                            {isRTL ? "الموقع المخزن / المستخدم *" : "Location Stored / Used *"}
                          </Label>
                          <Input
                            id="location"
                            placeholder={isRTL ? "مثال: المخزن الرئيسي، ورشة العمل 3، الرافعة 2" : "e.g., Main Store, Workshop Bay 3, Crane No. 2"}
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
                            placeholder={isRTL ? "مثال: فريق الرفع، الموقع أ، قسم الميكانيكا" : "e.g., Rigging Crew, Site A, Mechanical Department"}
                            value={formData.assignedTo || ""}
                            onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                            className={formErrors.assignedTo ? "border-red-500" : ""}
                          />
                          {formErrors.assignedTo && <p className="text-red-500 text-xs mt-1">{formErrors.assignedTo}</p>}
                        </div>
                        <div>
                          <Label htmlFor="tagMarking" className="text-sm font-medium text-gray-700">
                            {isRTL ? "الوسم/العلامة" : "Tag/Marking"}
                          </Label>
                          <Input
                            id="tagMarking"
                            placeholder={isRTL ? "مثال: علامة محفورة: LA-001، ملصق QR" : "e.g., Engraved Tag: LA-001, QR Sticker"}
                            value={formData.tagMarking || ""}
                            onChange={(e) => handleInputChange('tagMarking', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">
                          {isRTL ? "ملاحظات" : "Remarks"}
                        </Label>
                        <Textarea
                          id="remarks"
                          placeholder={isRTL ? "مثال: حبل شبكي به تآكل طفيف، مستحق للفحص القادم" : "e.g., Web sling slight abrasion, due for next inspection"}
                          value={formData.remarks || ""}
                          onChange={(e) => handleInputChange('remarks', e.target.value)}
                          rows={3}
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
                          id: "",
                          name: "",
                          accessoryId: "",
                          type: "",
                          material: "",
                          sizeSWL: "",
                          lengthDiameter: "",
                          manufacturer: "",
                          countryOfOrigin: "",
                          modelNumber: "",
                          manufactureDate: null,
                          purchaseDate: null,
                          location: "",
                          status: "in-use",
                          assignedTo: "",
                          certNo: "",
                          certAgency: "",
                          certIssueDate: null,
                          certExpiryDate: null,
                          nextInspectionDue: null,
                          inspectionFrequency: "6 months",
                          lastInspectionDate: null,
                          inspectionResult: "passed",
                          visualCondition: "ok",
                          loadTestRecord: "",
                          safetyColorCode: "blue",
                          tagMarking: "",
                          remarks: "",
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
                      onClick={handleSaveAccessory}
                      className="bg-primary text-white hover:bg-primary-600"
                    >
                      {isRTL ? "حفظ ملحق الرفع" : "Save Lifting Accessory"}
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
                    {isRTL ? "إجمالي الملحقات" : "Total Accessories"}
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
                    {isRTL ? "في الاستخدام" : "In Use"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inUse}</p>
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
                    {isRTL ? "في التخزين" : "In Storage"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inStorage}</p>
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
                    placeholder={isRTL ? "البحث حسب اسم الملحق، الرقم، أو الشركة المصنعة..." : "Search by accessory name, ID, or manufacturer..."}
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
                    <SelectItem value="in-use">{isRTL ? "في الاستخدام" : "In Use"}</SelectItem>
                    <SelectItem value="in-storage">{isRTL ? "في التخزين" : "In Storage"}</SelectItem>
                    <SelectItem value="under-inspection">{isRTL ? "تحت الفحص" : "Under Inspection"}</SelectItem>
                    <SelectItem value="decommissioned">{isRTL ? "معطل" : "Decommissioned"}</SelectItem>
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

        {/* Accessories List */}
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "جرد ملحقات الرفع" : "Lifting Accessories Inventory"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                <tbody>
                  {filteredAccessories.map((accessory) => (
                    <tr key={accessory.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={(e) => handleImagePreview(accessory.image, e)}
                          >
                            {accessory.image ? (
                              <img 
                                src={accessory.image} 
                                alt={accessory.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{accessory.name}</div>
                            <div className="text-sm text-gray-500">ID: {accessory.id}</div>
                            <div className="text-sm text-gray-500">{accessory.manufacturer} {accessory.modelNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <Badge variant="outline" className="mb-2">{accessory.type}</Badge>
                          <div className="text-sm text-gray-600">
                            {isRTL ? "آخر فحص: " : "Last Inspection: "} 
                            {accessory.lastInspectionDate ? format(accessory.lastInspectionDate, "PPP") : "-"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {isRTL ? "الحمولة الآمنة: " : "SWL: "} {accessory.sizeSWL}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="flex items-center text-sm text-gray-900 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {accessory.location}
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
                              (accessory.status === "in-use" ? "في الاستخدام" : 
                               accessory.status === "in-storage" ? "في التخزين" : 
                               accessory.status === "under-inspection" ? "تحت الفحص" : "معطل") 
                              : accessory.status.charAt(0).toUpperCase() + accessory.status.slice(1)}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-600">
                            {getConditionIcon(accessory.visualCondition)}
                            <span className="ml-1">
                              {isRTL ? 
                                (accessory.visualCondition === "ok" ? "جيد" : 
                                 accessory.visualCondition === "frayed" ? "مهترئ" : 
                                 accessory.visualCondition === "bent" ? "منحني" : 
                                 accessory.visualCondition === "corroded" ? "متآكل" : "متشقق") 
                                : accessory.visualCondition.charAt(0).toUpperCase() + accessory.visualCondition.slice(1)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="text-gray-600">
                            {isRTL ? "تاريخ الانتهاء: " : "Expires: "} 
                            {accessory.certExpiryDate ? format(accessory.certExpiryDate, "PPP") : "-"}
                          </div>
                          <Badge 
                            variant={accessory.certExpiryDate && new Date(accessory.certExpiryDate) > new Date() ? "default" : "destructive"} 
                            className="text-xs mt-1"
                          >
                            {accessory.certExpiryDate && new Date(accessory.certExpiryDate) > new Date() ? 
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
            <span className="text-xs font-medium">{isRTL ? "فحص مستحق" : "Inspection Due"}</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
            <Upload className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{isRTL ? "استيراد مجمع" : "Bulk Import"}</span>
          </Button>
        </div>
      </div>

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
    </div>
  );
};

export default LiftingToolsRegistry;