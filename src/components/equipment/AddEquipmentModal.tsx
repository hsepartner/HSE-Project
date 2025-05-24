import React, { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  PlusCircle, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Download,
  Eye,
  Trash2
} from "lucide-react";

interface EquipmentType {
  name: string;
  image: string;
  category: string;
  id: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadProgress?: number;
  status: 'uploading' | 'completed' | 'error';
}

interface DocumentSection {
  id: string;
  title: string;
  titleAr: string;
  required: boolean;
  acceptedTypes: string[];
  maxSize: number; // in MB
  files: UploadedFile[];
  maxFiles: number;
}

interface FormData {
  name: string;
  model: string;
  serial: string;
  plateNumber: string;
  registrationExpiry: string;
  insuranceExpiry: string;
  thirdPartyExpiry: string;
  category: string;
  description: string;
  status: 'active' | 'maintenance' | 'stored';
  purchaseDate: string;
  purchasePrice: string;
  manufacturer: string;
  yearOfManufacture: string;
  operatingHours: string;
  fuelType: string;
  location: string;
  assignedOperator: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface AddEquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentTypes: EquipmentType[];
  selectedEquipmentType: string;
  setSelectedEquipmentType: (type: string) => void;
  loading: boolean;
  onSubmit: (data: FormData, documents: DocumentSection[]) => Promise<void>;
  isRTL: boolean;
  onCancel: () => void;
  onFileUpload?: (file: File, sectionId: string) => Promise<UploadedFile>;
  maxSteps?: number;
}

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  open,
  onOpenChange,
  equipmentTypes,
  selectedEquipmentType,
  setSelectedEquipmentType,
  loading,
  onSubmit,
  isRTL,
  onCancel,
  onFileUpload,
  maxSteps = 4,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    model: "",
    serial: "",
    plateNumber: "",
    registrationExpiry: "",
    insuranceExpiry: "",
    thirdPartyExpiry: "",
    category: "",
    description: "",
    status: "active",
    purchaseDate: "",
    purchasePrice: "",
    manufacturer: "",
    yearOfManufacture: "",
    operatingHours: "",
    fuelType: "",
    location: "",
    assignedOperator: "",
  });

  const [documentSections, setDocumentSections] = useState<DocumentSection[]>([
    {
      id: "registration",
      title: "Equipment Registration Card",
      titleAr: "بطاقة تسجيل المعدات",
      required: true,
      acceptedTypes: [".pdf", ".jpg", ".jpeg", ".png"],
      maxSize: 5,
      files: [],
      maxFiles: 3,
    },
    {
      id: "certificate",
      title: "3rd Party Certificate",
      titleAr: "شهادة طرف ثالث",
      required: true,
      acceptedTypes: [".pdf", ".jpg", ".jpeg", ".png"],
      maxSize: 5,
      files: [],
      maxFiles: 2,
    },
    {
      id: "undertaking",
      title: "Under Taking Letter",
      titleAr: "خطاب تعهد",
      required: false,
      acceptedTypes: [".pdf", ".doc", ".docx"],
      maxSize: 3,
      files: [],
      maxFiles: 1,
    },
    {
      id: "other",
      title: "Other Documents",
      titleAr: "وثائق أخرى",
      required: false,
      acceptedTypes: [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"],
      maxSize: 10,
      files: [],
      maxFiles: 5,
    },
    {
      id: "insurance",
      title: "Equipment Insurance",
      titleAr: "تأمين المعدات",
      required: true,
      acceptedTypes: [".pdf", ".jpg", ".jpeg", ".png"],
      maxSize: 5,
      files: [],
      maxFiles: 2,
    },
    {
      id: "photos",
      title: "Equipment Photos",
      titleAr: "صور المعدات",
      required: true,
      acceptedTypes: [".jpg", ".jpeg", ".png"],
      maxSize: 5,
      files: [],
      maxFiles: 10,
    },
  ]);

  const steps = [
    { 
      number: 1, 
      title: isRTL ? "اختيار المعدات" : "Select Equipment",
      description: isRTL ? "اختر نوع المعدات" : "Choose equipment type"
    },
    { 
      number: 2, 
      title: isRTL ? "رفع الوثائق" : "Upload Documents",
      description: isRTL ? "رفع الوثائق المطلوبة" : "Upload required documents"
    },
    { 
      number: 3, 
      title: isRTL ? "تفاصيل المعدات" : "Equipment Details",
      description: isRTL ? "ملء تفاصيل المعدات" : "Fill equipment details"
    },
    { 
      number: 4, 
      title: isRTL ? "المراجعة والتأكيد" : "Review & Confirm",
      description: isRTL ? "مراجعة المعلومات" : "Review information"
    },
  ].slice(0, maxSteps);

  // Validation functions
  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!selectedEquipmentType) {
      newErrors.equipmentType = isRTL ? "يرجى اختيار نوع المعدات" : "Please select equipment type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    documentSections.forEach(section => {
      if (section.required && section.files.length === 0) {
        newErrors[section.id] = isRTL 
          ? `${section.titleAr} مطلوب` 
          : `${section.title} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = isRTL ? "اسم المعدات مطلوب" : "Equipment name is required";
    }
    
    if (!formData.model.trim()) {
      newErrors.model = isRTL ? "الطراز مطلوب" : "Model is required";
    }
    
    if (!formData.serial.trim()) {
      newErrors.serial = isRTL ? "الرقم التسلسلي مطلوب" : "Serial number is required";
    }
    
    if (!formData.category) {
      newErrors.category = isRTL ? "الفئة مطلوبة" : "Category is required";
    }

    // Date validation
    const today = new Date().toISOString().split('T')[0];
    if (formData.registrationExpiry && formData.registrationExpiry < today) {
      newErrors.registrationExpiry = isRTL ? "تاريخ انتهاء التسجيل يجب أن يكون في المستقبل" : "Registration expiry must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File upload handlers
  const handleFileUpload = useCallback(async (files: FileList, sectionId: string) => {
    const section = documentSections.find(s => s.id === sectionId);
    if (!section) return;

    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      const isValidType = section.acceptedTypes.some(type => 
        file.name.toLowerCase().endsWith(type.toLowerCase())
      );
      
      if (!isValidType) {
        setErrors(prev => ({
          ...prev,
          [sectionId]: isRTL 
            ? `نوع الملف غير مدعوم. الأنواع المدعومة: ${section.acceptedTypes.join(', ')}`
            : `Unsupported file type. Supported types: ${section.acceptedTypes.join(', ')}`
        }));
        continue;
      }

      // Validate file size
      if (file.size > section.maxSize * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [sectionId]: isRTL 
            ? `حجم الملف كبير جداً. الحد الأقصى: ${section.maxSize}MB`
            : `File too large. Maximum size: ${section.maxSize}MB`
        }));
        continue;
      }

      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        uploadProgress: 0,
      };

      newFiles.push(uploadedFile);

      // Simulate upload or use actual upload function
      try {
        if (onFileUpload) {
          const result = await onFileUpload(file, sectionId);
          uploadedFile.status = 'completed';
          uploadedFile.url = result.url;
        } else {
          // Simulate upload progress
          uploadedFile.status = 'completed';
          uploadedFile.url = URL.createObjectURL(file);
        }
      } catch (error) {
        uploadedFile.status = 'error';
      }
    }

    setDocumentSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, files: [...section.files, ...newFiles].slice(0, section.maxFiles) }
        : section
    ));

    // Clear errors for this section if files were uploaded successfully
    if (newFiles.some(f => f.status === 'completed')) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[sectionId];
        return newErrors;
      });
    }
  }, [documentSections, onFileUpload, isRTL]);

  const removeFile = useCallback((sectionId: string, fileId: string) => {
    setDocumentSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, files: section.files.filter(f => f.id !== fileId) }
        : section
    ));
  }, []);

  // Navigation handlers
  const handleNext = () => {
    let isValid = true;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
    }

    if (isValid && currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({}); // Clear errors when going back
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData, documentSections);
      onOpenChange(false);
      // Reset form
      setCurrentStep(1);
      setFormData({
        name: "",
        model: "",
        serial: "",
        plateNumber: "",
        registrationExpiry: "",
        insuranceExpiry: "",
        thirdPartyExpiry: "",
        category: "",
        description: "",
        status: "active",
        purchaseDate: "",
        purchasePrice: "",
        manufacturer: "",
        yearOfManufacture: "",
        operatingHours: "",
        fuelType: "",
        location: "",
        assignedOperator: "",
      });
      setDocumentSections(prev => prev.map(section => ({ ...section, files: [] })));
      setSelectedEquipmentType("");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-fill form based on selected equipment type
  React.useEffect(() => {
    if (selectedEquipmentType) {
      const selectedType = equipmentTypes.find(type => type.name === selectedEquipmentType);
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          category: selectedType.category,
          name: selectedType.name,
        }));
      }
    }
  }, [selectedEquipmentType, equipmentTypes]);

  // Component renderers
  const renderStepIndicator = () => (
    <div className="flex items-center justify-end mb-6 gap-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
        <span>{isRTL ? "الخطوة" : "Step"} {currentStep} {isRTL ? "من" : "of"} {maxSteps}</span>
      </div>
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              currentStep > step.number
                ? "bg-green-500 text-white shadow-lg"
                : currentStep === step.number
                ? "bg-primary text-white shadow-lg ring-2 ring-primary/20"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {currentStep > step.number ? (
              <Check className="h-5 w-5" />
            ) : (
              step.number
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-2 transition-colors ${
              currentStep > step.number ? "bg-green-500" : "bg-gray-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderProgressBar = () => (
    <div className="mb-6">
      <Progress 
        value={(currentStep / maxSteps) * 100} 
        className="h-2"
      />
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">
          {isRTL ? "اختر نوع المعدات" : "Select the Equipment"}
        </h3>
        <p className="text-muted-foreground">
          {isRTL ? "اختر نوع المعدات التي تريد تسجيلها" : "Choose the type of equipment you want to register"}
        </p>
      </div>
      
      {errors.equipmentType && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.equipmentType}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {equipmentTypes.map((type, index) => (
          <div
            key={type.id}
            className={`relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedEquipmentType === type.name
                ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                : "border-gray-200 hover:border-primary/50 hover:bg-muted/50"
            }`}
            onClick={() => setSelectedEquipmentType(type.name)}
          >
            {/* Number badge */}
            <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <div className="relative">
              <img
                src={type.image}
                alt={type.name}
                className="w-20 h-20 object-contain mb-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-equipment.png';
                }}
              />
              {selectedEquipmentType === type.name && (
                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-center leading-tight">
              {type.name}
            </span>
            <Badge variant="secondary" className="mt-2 text-xs">
              {type.category}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFileUploadSection = (section: DocumentSection) => (
    <div key={section.id} className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          errors[section.id] 
            ? "border-red-300 bg-red-50" 
            : "border-gray-300 hover:border-primary/50 hover:bg-muted/30"
        }`}
        onClick={() => fileInputRefs.current[section.id]?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('border-primary', 'bg-primary/5');
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            handleFileUpload(files, section.id);
          }
        }}
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium mb-1">
          {isRTL ? section.titleAr : section.title}
          {section.required && <span className="text-red-500 ml-1">*</span>}
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          {isRTL 
            ? `اسحب وأسقط الملفات هنا أو انقر للتصفح`
            : `Drag & drop files here or click to browse`}
        </p>
        <div className="text-xs text-muted-foreground">
          <p>{isRTL ? "الأنواع المدعومة:" : "Supported:"} {section.acceptedTypes.join(', ')}</p>
          <p>{isRTL ? "الحد الأقصى:" : "Max size:"} {section.maxSize}MB | {isRTL ? "عدد الملفات:" : "Max files:"} {section.maxFiles}</p>
        </div>
        <Button variant="outline" size="sm" className="mt-3">
          {isRTL ? "اختر الملفات" : "Select Files"}
        </Button>
        
        <input
          ref={(el) => fileInputRefs.current[section.id] = el}
          type="file"
          multiple
          accept={section.acceptedTypes.join(',')}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFileUpload(e.target.files, section.id);
            }
          }}
        />
      </div>

      {errors[section.id] && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{errors[section.id]}</AlertDescription>
        </Alert>
      )}

      {section.files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {isRTL ? "الملفات المرفوعة:" : "Uploaded Files:"} ({section.files.length}/{section.maxFiles})
          </p>
          <div className="grid gap-2">
            {section.files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {file.status === 'uploading' && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  )}
                  {file.status === 'completed' && (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      {file.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                  {file.status === 'error' && (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(section.id, file.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          {isRTL ? "رفع وثائق المعدات" : "Upload Equipment Documents"}
        </h3>
        <p className="text-muted-foreground">
          {isRTL ? "قم برفع جميع الوثائق المطلوبة للمعدات" : "Upload all required documents for the equipment"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentSections.map(renderFileUploadSection)}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          {isRTL ? "تفاصيل المعدات" : "Equipment Details"}
        </h3>
        <p className="text-muted-foreground">
          {isRTL ? "أدخل تفاصيل المعدات أو استخرجها من الوثائق" : "Enter equipment details or extract from documents"}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium border-b pb-2">
            {isRTL ? "المعلومات الأساسية" : "Basic Information"}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                {isRTL ? "اسم المعدات" : "Equipment Name"}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={isRTL ? "مثال: Excavator XL3000" : "e.g. Excavator XL3000"}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="flex items-center gap-1">
                {isRTL ? "الطراز" : "Model"}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                placeholder={isRTL ? "مثال: CAT 320" : "e.g. CAT 320"}
                className={errors.model ? "border-red-500" : ""}
              />
              {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serial" className="flex items-center gap-1">
                {isRTL ? "الرقم التسلسلي" : "Serial Number"}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="serial"
                value={formData.serial}
                onChange={(e) => handleInputChange("serial", e.target.value)}
                placeholder={isRTL ? "مثال: CAT320-45678" : "e.g. CAT320-45678"}
                className={errors.serial ? "border-red-500" : ""}
              />
              {errors.serial && <p className="text-sm text-red-500">{errors.serial}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plateNumber">
                {isRTL ? "رقم اللوحة" : "Plate Number"}
              </Label>
              <Input
                id="plateNumber"
                value={formData.plateNumber}
                onChange={(e) => handleInputChange("plateNumber", e.target.value)}
                placeholder={isRTL ? "مثال: ABC-123" : "e.g. ABC-123"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">
                {isRTL ? "الشركة المصنعة" : "Manufacturer"}
              </Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                placeholder={isRTL ? "مثال: Caterpillar" : "e.g. Caterpillar"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearOfManufacture">
                {isRTL ? "سنة الصنع" : "Year of Manufacture"}
              </Label>
              <Input
                id="yearOfManufacture"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.yearOfManufacture}
                onChange={(e) => handleInputChange("yearOfManufacture", e.target.value)}
                placeholder="2020"
              />
              </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="category" className="flex items-center gap-1">
               {isRTL ? "الفئة" : "Category"}
               <span className="text-red-500">*</span>
             </Label>
             <Select
               value={formData.category}
               onValueChange={(value) => handleInputChange("category", value)}
             >
               <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                 <SelectValue placeholder={isRTL ? "اختر الفئة" : "Select category"} />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="heavy">
                   {isRTL ? "معدات ثقيلة" : "Heavy Equipment"}
                 </SelectItem>
                 <SelectItem value="light">
                   {isRTL ? "مركبة خفيفة" : "Light Vehicle"}
                 </SelectItem>
                 <SelectItem value="power-tool">
                   {isRTL ? "أداة كهربائية" : "Power Tool"}
                 </SelectItem>
                 <SelectItem value="safety">
                   {isRTL ? "معدات السلامة" : "Safety Equipment"}
                 </SelectItem>
                 <SelectItem value="construction">
                   {isRTL ? "معدات البناء" : "Construction Equipment"}
                 </SelectItem>
                 <SelectItem value="transport">
                   {isRTL ? "معدات النقل" : "Transport Equipment"}
                 </SelectItem>
               </SelectContent>
             </Select>
             {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
           </div>

           <div className="space-y-2">
             <Label htmlFor="fuelType">
               {isRTL ? "نوع الوقود" : "Fuel Type"}
             </Label>
             <Select
               value={formData.fuelType}
               onValueChange={(value) => handleInputChange("fuelType", value)}
             >
               <SelectTrigger>
                 <SelectValue placeholder={isRTL ? "اختر نوع الوقود" : "Select fuel type"} />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="diesel">{isRTL ? "ديزل" : "Diesel"}</SelectItem>
                 <SelectItem value="gasoline">{isRTL ? "بنزين" : "Gasoline"}</SelectItem>
                 <SelectItem value="electric">{isRTL ? "كهربائي" : "Electric"}</SelectItem>
                 <SelectItem value="hybrid">{isRTL ? "هجين" : "Hybrid"}</SelectItem>
                 <SelectItem value="lpg">{isRTL ? "غاز البترول المسال" : "LPG"}</SelectItem>
               </SelectContent>
             </Select>
           </div>
         </div>
       </div>

       {/* Purchase & Financial Information */}
       <div className="space-y-4">
         <h4 className="text-lg font-medium border-b pb-2">
           {isRTL ? "المعلومات المالية" : "Financial Information"}
         </h4>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="purchaseDate">
               {isRTL ? "تاريخ الشراء" : "Purchase Date"}
             </Label>
             <Input
               id="purchaseDate"
               type="date"
               value={formData.purchaseDate}
               onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
             />
           </div>

           <div className="space-y-2">
             <Label htmlFor="purchasePrice">
               {isRTL ? "سعر الشراء" : "Purchase Price"}
             </Label>
             <Input
               id="purchasePrice"
               type="number"
               min="0"
               step="0.01"
               value={formData.purchasePrice}
               onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
               placeholder={isRTL ? "0.00" : "0.00"}
             />
           </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="operatingHours">
               {isRTL ? "ساعات التشغيل" : "Operating Hours"}
             </Label>
             <Input
               id="operatingHours"
               type="number"
               min="0"
               value={formData.operatingHours}
               onChange={(e) => handleInputChange("operatingHours", e.target.value)}
               placeholder="0"
             />
           </div>

           <div className="space-y-2">
             <Label htmlFor="location">
               {isRTL ? "الموقع الحالي" : "Current Location"}
             </Label>
             <Input
               id="location"
               value={formData.location}
               onChange={(e) => handleInputChange("location", e.target.value)}
               placeholder={isRTL ? "مثال: المستودع الرئيسي" : "e.g. Main Warehouse"}
             />
           </div>
         </div>
       </div>

       {/* Expiry Dates */}
       <div className="space-y-4">
         <h4 className="text-lg font-medium border-b pb-2">
           {isRTL ? "تواريخ الانتهاء" : "Expiry Dates"}
         </h4>
         
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <div className="space-y-2">
             <Label htmlFor="registrationExpiry">
               {isRTL ? "انتهاء التسجيل" : "Registration Expiry"}
             </Label>
             <Input
               id="registrationExpiry"
               type="date"
               value={formData.registrationExpiry}
               onChange={(e) => handleInputChange("registrationExpiry", e.target.value)}
               className={errors.registrationExpiry ? "border-red-500" : ""}
             />
             {errors.registrationExpiry && <p className="text-sm text-red-500">{errors.registrationExpiry}</p>}
           </div>

           <div className="space-y-2">
             <Label htmlFor="insuranceExpiry">
               {isRTL ? "انتهاء التأمين" : "Insurance Expiry"}
             </Label>
             <Input
               id="insuranceExpiry"
               type="date"
               value={formData.insuranceExpiry}
               onChange={(e) => handleInputChange("insuranceExpiry", e.target.value)}
             />
           </div>

           <div className="space-y-2">
             <Label htmlFor="thirdPartyExpiry">
               {isRTL ? "انتهاء الطرف الثالث" : "3rd Party Expiry"}
             </Label>
             <Input
               id="thirdPartyExpiry"
               type="date"
               value={formData.thirdPartyExpiry}
               onChange={(e) => handleInputChange("thirdPartyExpiry", e.target.value)}
             />
           </div>
         </div>
       </div>

       {/* Status & Assignment */}
       <div className="space-y-4">
         <h4 className="text-lg font-medium border-b pb-2">
           {isRTL ? "الحالة والتعيين" : "Status & Assignment"}
         </h4>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label>{isRTL ? "الحالة الحالية" : "Current Status"}</Label>
             <div className="flex flex-wrap gap-4 mt-2">
               {[
                 { value: 'active', label: isRTL ? 'نشط' : 'Active', color: 'bg-green-100 text-green-800' },
                 { value: 'maintenance', label: isRTL ? 'في الصيانة' : 'In Maintenance', color: 'bg-yellow-100 text-yellow-800' },
                 { value: 'stored', label: isRTL ? 'مخزن' : 'Stored', color: 'bg-gray-100 text-gray-800' }
               ].map((status) => (
                 <label key={status.value} className="flex items-center cursor-pointer">
                   <input
                     type="radio"
                     name="status"
                     value={status.value}
                     checked={formData.status === status.value}
                     onChange={(e) => handleInputChange("status", e.target.value as any)}
                     className="sr-only"
                   />
                   <div className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                     formData.status === status.value 
                       ? status.color + ' ring-2 ring-offset-2 ring-current' 
                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                   }`}>
                     {status.label}
                   </div>
                 </label>
               ))}
             </div>
           </div>

           <div className="space-y-2">
             <Label htmlFor="assignedOperator">
               {isRTL ? "المشغل المعين" : "Assigned Operator"}
             </Label>
             <Input
               id="assignedOperator"
               value={formData.assignedOperator}
               onChange={(e) => handleInputChange("assignedOperator", e.target.value)}
               placeholder={isRTL ? "اسم المشغل" : "Operator name"}
             />
           </div>
         </div>
       </div>

       {/* Description */}
       <div className="space-y-2">
         <Label htmlFor="description">
           {isRTL ? "وصف إضافي" : "Additional Description"}
         </Label>
         <Textarea
           id="description"
           value={formData.description}
           onChange={(e) => handleInputChange("description", e.target.value)}
           placeholder={
             isRTL ? "وصف موجز للمعدات، حالتها، أو أي ملاحظات إضافية..." : "Brief description of the equipment, its condition, or any additional notes..."
           }
           rows={4}
           className="resize-none"
         />
         <p className="text-xs text-muted-foreground">
           {formData.description.length}/500 {isRTL ? "حرف" : "characters"}
         </p>
       </div>
     </div>
   </div>
 );

 const renderStep4 = () => {
   const requiredDocuments = documentSections.filter(section => section.required);
   const uploadedRequiredDocs = requiredDocuments.filter(section => section.files.length > 0);
   const totalFiles = documentSections.reduce((total, section) => total + section.files.length, 0);

   return (
     <div className="space-y-6">
       <div className="text-center mb-8">
         <h3 className="text-xl font-semibold mb-2">
           {isRTL ? "مراجعة وتأكيد التسجيل" : "Review & Confirm Registration"}
         </h3>
         <p className="text-muted-foreground">
           {isRTL ? "راجع جميع المعلومات قبل التسجيل النهائي" : "Review all information before final registration"}
         </p>
       </div>

       {/* Summary Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
               <Check className="h-4 w-4 text-white" />
             </div>
             <h4 className="font-medium">{isRTL ? "نوع المعدات" : "Equipment Type"}</h4>
           </div>
           <p className="text-sm text-muted-foreground">{selectedEquipmentType}</p>
         </div>

         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
               <FileText className="h-4 w-4 text-white" />
             </div>
             <h4 className="font-medium">{isRTL ? "الوثائق" : "Documents"}</h4>
           </div>
           <p className="text-sm text-muted-foreground">
             {totalFiles} {isRTL ? "ملف مرفوع" : "files uploaded"}
             <br />
             {uploadedRequiredDocs.length}/{requiredDocuments.length} {isRTL ? "مطلوب" : "required"}
           </p>
         </div>

         <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
               <PlusCircle className="h-4 w-4 text-white" />
             </div>
             <h4 className="font-medium">{isRTL ? "التفاصيل" : "Details"}</h4>
           </div>
           <p className="text-sm text-muted-foreground">
             {formData.name || (isRTL ? "غير محدد" : "Not specified")}
             <br />
             {formData.model || (isRTL ? "غير محدد" : "Not specified")}
           </p>
         </div>
       </div>

       {/* Detailed Review */}
       <div className="space-y-6">
         {/* Equipment Information */}
         <div className="bg-gray-50 rounded-lg p-6">
           <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
             <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
               <span className="text-white text-sm">1</span>
             </div>
             {isRTL ? "معلومات المعدات" : "Equipment Information"}
           </h4>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
             <div><strong>{isRTL ? "النوع:" : "Type:"}</strong> {selectedEquipmentType}</div>
             <div><strong>{isRTL ? "الاسم:" : "Name:"}</strong> {formData.name || 'N/A'}</div>
             <div><strong>{isRTL ? "الطراز:" : "Model:"}</strong> {formData.model || 'N/A'}</div>
             <div><strong>{isRTL ? "الرقم التسلسلي:" : "Serial:"}</strong> {formData.serial || 'N/A'}</div>
             <div><strong>{isRTL ? "رقم اللوحة:" : "Plate:"}</strong> {formData.plateNumber || 'N/A'}</div>
             <div><strong>{isRTL ? "الفئة:" : "Category:"}</strong> {formData.category || 'N/A'}</div>
             <div><strong>{isRTL ? "الشركة المصنعة:" : "Manufacturer:"}</strong> {formData.manufacturer || 'N/A'}</div>
             <div><strong>{isRTL ? "سنة الصنع:" : "Year:"}</strong> {formData.yearOfManufacture || 'N/A'}</div>
             <div><strong>{isRTL ? "الحالة:" : "Status:"}</strong> 
               <Badge variant={formData.status === 'active' ? 'default' : formData.status === 'maintenance' ? 'secondary' : 'outline'} className="ml-2">
                 {formData.status === 'active' ? (isRTL ? 'نشط' : 'Active') : 
                  formData.status === 'maintenance' ? (isRTL ? 'صيانة' : 'Maintenance') : 
                  (isRTL ? 'مخزن' : 'Stored')}
               </Badge>
             </div>
           </div>
         </div>

         {/* Documents Review */}
         <div className="bg-gray-50 rounded-lg p-6">
           <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
             <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
               <span className="text-white text-sm">2</span>
             </div>
             {isRTL ? "الوثائق المرفوعة" : "Uploaded Documents"}
           </h4>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {documentSections.map(section => (
               <div key={section.id} className="flex items-center justify-between p-3 bg-white rounded border">
                 <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                     section.files.length > 0 ? 'bg-green-100 text-green-600' : 
                     section.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
                   }`}>
                     {section.files.length > 0 ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                   </div>
                   <div>
                     <p className="text-sm font-medium">{isRTL ? section.titleAr : section.title}</p>
                     <p className="text-xs text-muted-foreground">
                       {section.files.length} {isRTL ? "ملف" : "files"}
                       {section.required && <span className="text-red-500 ml-1">*</span>}
                     </p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Additional Details */}
         {(formData.description || formData.assignedOperator || formData.location) && (
           <div className="bg-gray-50 rounded-lg p-6">
             <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
               <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                 <span className="text-white text-sm">3</span>
               </div>
               {isRTL ? "تفاصيل إضافية" : "Additional Details"}
             </h4>
             <div className="space-y-3 text-sm">
               {formData.description && (
                 <div>
                   <strong>{isRTL ? "الوصف:" : "Description:"}</strong>
                   <p className="mt-1 text-muted-foreground">{formData.description}</p>
                 </div>
               )}
               {formData.assignedOperator && (
                 <div><strong>{isRTL ? "المشغل المعين:" : "Assigned Operator:"}</strong> {formData.assignedOperator}</div>
               )}
               {formData.location && (
                 <div><strong>{isRTL ? "الموقع:" : "Location:"}</strong> {formData.location}</div>
               )}
             </div>
           </div>
         )}
       </div>

       {/* Final Validation */}
       {uploadedRequiredDocs.length < requiredDocuments.length && (
         <Alert variant="destructive">
           <AlertCircle className="h-4 w-4" />
           <AlertDescription>
             {isRTL 
               ? `يرجى رفع جميع الوثائق المطلوبة قبل المتابعة. متبقي: ${requiredDocuments.length - uploadedRequiredDocs.length}`
               : `Please upload all required documents before proceeding. Missing: ${requiredDocuments.length - uploadedRequiredDocs.length}`}
           </AlertDescription>
         </Alert>
       )}
     </div>
   );
 };

 // Reset form when modal closes
 React.useEffect(() => {
   if (!open) {
     setCurrentStep(1);
     setErrors({});
   }
 }, [open]);

 return (
   <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent className="sm:max-w-[95vw] md:max-w-[1000px] lg:max-w-[1200px] w-full p-6 max-h-[95vh] overflow-y-auto">
       <DialogHeader>
         <div className="flex justify-between items-start mb-4">
           <div className="flex-1">
             <DialogTitle className="text-2xl">
               {isRTL ? "إضافة معدات جديدة" : "Add New Equipment"}
             </DialogTitle>
             <DialogDescription className="text-base mt-2">
               {steps.find(step => step.number === currentStep)?.description}
             </DialogDescription>
           </div>
         </div>
         {renderStepIndicator()}
         {renderProgressBar()}
       </DialogHeader>

       <div className="py-4 min-h-[400px]">
         {currentStep === 1 && renderStep1()}
         {currentStep === 2 && renderStep2()}
         {currentStep === 3 && renderStep3()}
         {currentStep === 4 && renderStep4()}
       </div>

       <DialogFooter className="flex justify-between items-center pt-6 border-t">
         <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
           {isRTL ? "إلغاء" : "Cancel"}
         </Button>
         
         <div className="flex gap-3">
           {currentStep > 1 && (
             <Button 
               variant="outline" 
               onClick={handlePrevious}
               disabled={isSubmitting}
               className="flex items-center gap-2"
             >
               <ChevronLeft className="h-4 w-4" />
               {isRTL ? "السابق" : "Previous"}
             </Button>
           )}
           
           {currentStep < maxSteps ? (
             <Button 
               onClick={handleNext}
               disabled={
                 (currentStep === 1 && !selectedEquipmentType) ||
                 isSubmitting
               }
               className="flex items-center gap-2"
             >
               {isRTL ? "التالي" : "Next"}
               <ChevronRight className="h-4 w-4" />
             </Button>
           ) : (
             <Button
               onClick={handleSubmit}
               disabled={
                 isSubmitting || 
                 loading ||
                 documentSections.filter(s => s.required).some(s => s.files.length === 0)
               }
               className="bg-green-600 hover:bg-green-700 flex items-center gap-2 min-w-[140px]"
             >
               {(isSubmitting || loading) ? (
                 <>
                   <Loader2 className="h-4 w-4 animate-spin" />
                   {isRTL ? "جارٍ التسجيل..." : "Registering..."}
                 </>
               ) : (
                 <>
                   <PlusCircle className="h-4 w-4" />
                   {isRTL ? "تسجيل المعدات" : "Register Equipment"}
                 </>
               )}
             </Button>
           )}
         </div>
       </DialogFooter>
     </DialogContent>
   </Dialog>
 );
};

export default AddEquipmentModal;