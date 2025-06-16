import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Equipment } from "@/types/equipment";
import { useLanguage } from "@/hooks/use-language";
import { Plus, Trash2, FileText, Calendar, User, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface MaintenanceActivity {
  id: string;
  date: string;
  description: string;
  performedBy: string;
  validatedBy: string;
  dateOfValidation: string;
  nextActivityDue: string;
  remarks: string;
}

interface EquipmentMaintenanceLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
  onSubmit: (data: any) => void; // Placeholder for submission
  loading: boolean;
}

export function EquipmentMaintenanceLogModal({
  open,
  onOpenChange,
  equipment,
  onSubmit,
  loading,
}: EquipmentMaintenanceLogModalProps) {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const { toast } = useToast();

  const [manufacturer, setManufacturer] = useState(equipment?.model || "");
  const [serialNumber, setSerialNumber] = useState(equipment?.serialNumber || "");
  const [location, setLocation] = useState(equipment?.location || "");
  const [dateManufactured, setDateManufactured] = useState("");
  const [dateInService, setDateInService] = useState(equipment?.purchaseDate || "");
  const [maintenanceActivities, setMaintenanceActivities] = useState<MaintenanceActivity[]>([
    {
      id: crypto.randomUUID(),
      date: "",
      description: "",
      performedBy: "",
      validatedBy: "",
      dateOfValidation: "",
      nextActivityDue: "",
      remarks: "",
    },
  ]);
  const [supervisorName, setSupervisorName] = useState("");
  const [signatureDate, setSignatureDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [formReference, setFormReference] = useState("EQML-001"); // Auto-generated/initial
  const [revisionTracking, setRevisionTracking] = useState("Rev 1.0");

  const addActivityRow = () => {
    setMaintenanceActivities([
      ...maintenanceActivities,
      {
        id: crypto.randomUUID(),
        date: "",
        description: "",
        performedBy: "",
        validatedBy: "",
        dateOfValidation: "",
        nextActivityDue: "",
        remarks: "",
      },
    ]);
  };

  const removeActivityRow = (id: string) => {
    setMaintenanceActivities(maintenanceActivities.filter((activity) => activity.id !== id));
  };

  const handleActivityChange = (
    id: string,
    field: keyof MaintenanceActivity,
    value: string
  ) => {
    setMaintenanceActivities(
      maintenanceActivities.map((activity) =>
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );
  };

  const validateForm = () => {
    // Basic validation
    if (!equipment) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "لم يتم تحديد المعدات." : "Equipment not selected.",
        variant: "destructive",
      });
      return false;
    }
    if (!manufacturer || !serialNumber || !location || !dateInService || !supervisorName) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى ملء جميع حقول معلومات المعدات." : "Please fill all equipment information fields.",
        variant: "destructive",
      });
      return false;
    }

    for (const activity of maintenanceActivities) {
      if (!activity.date || !activity.description || !activity.performedBy) {
        toast({
          title: isRTL ? "خطأ" : "Error",
          description: isRTL ? "يرجى ملء جميع حقول أنشطة الصيانة المطلوبة." : "Please fill all required maintenance activity fields.",
          variant: "destructive",
        });
        return false;
      }
      if (activity.date && isNaN(new Date(activity.date).getTime())) {
        toast({
          title: isRTL ? "خطأ" : "Error",
          description: isRTL ? "تاريخ نشاط صيانة غير صالح." : "Invalid maintenance activity date.",
          variant: "destructive",
        });
        return false;
      }
      if (activity.dateOfValidation && isNaN(new Date(activity.dateOfValidation).getTime())) {
        toast({
          title: isRTL ? "خطأ" : "Error",
          description: isRTL ? "تاريخ التحقق من نشاط صيانة غير صالح." : "Invalid maintenance activity validation date.",
          variant: "destructive",
        });
        return false;
      }
      if (activity.nextActivityDue && isNaN(new Date(activity.nextActivityDue).getTime())) {
        toast({
          title: isRTL ? "خطأ" : "Error",
          description: isRTL ? "تاريخ النشاط التالي المستحق غير صالح." : "Invalid next activity due date.",
          variant: "destructive",
        });
        return false;
      }
    }

    if (dateManufactured && isNaN(new Date(dateManufactured).getTime())) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "تاريخ التصنيع غير صالح." : "Invalid manufactured date.",
        variant: "destructive",
      });
      return false;
    }
    if (dateInService && isNaN(new Date(dateInService).getTime())) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "تاريخ الخدمة غير صالح." : "Invalid date in service.",
        variant: "destructive",
      });
      return false;
    }
    if (isNaN(new Date(signatureDate).getTime())) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "تاريخ التوقيع غير صالح." : "Invalid signature date.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const formData = {
      equipmentInfo: {
        typeOfEquipment: equipment?.name,
        manufacturer,
        serialNumber,
        location,
        dateManufactured,
        dateInService,
      },
      maintenanceActivities,
      footer: {
        supervisorName,
        signatureDate,
        formReference,
        revisionTracking,
      },
    };

    onSubmit(formData);
    // Placeholder for PDF export and data storage
    // console.log("Form Data Submitted:", formData);
    // alert("Form submitted! (PDF export and data storage would happen here)");
    onOpenChange(false); // Close modal on successful submission
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isRTL ? "ورقة سجل صيانة المعدات" : "Equipment Maintenance Log Sheet"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isRTL ? "سجل مفصل لأنشطة صيانة المعدات." : "Detailed log of equipment maintenance activities."}
          </DialogDescription>
        </DialogHeader>

        {/* Company Branding Area */}
        <div className="mb-6 border-b pb-4">
          <div className="flex justify-around items-center h-24 bg-gray-100 rounded-lg">
            <div className="text-center text-sm text-gray-500">
              {isRTL ? "شعار العميل" : "Client Logo"}
            </div>
            <div className="text-center text-sm text-gray-500">
              {isRTL ? "شعار المستشار" : "Consultant Logo"}
            </div>
            <div className="text-center text-sm text-gray-500">
              {isRTL ? "شعار المقاول" : "Contractor Logo"}
            </div>
          </div>
        </div>

        {/* Equipment Information Fields */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="font-semibold text-lg">{isRTL ? "معلومات المعدات" : "Equipment Information"}</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipment-type">{isRTL ? "نوع المعدات / الشركة المصنعة" : "Type of Equipment / Manufacturer"}</Label>
              <Input id="equipment-type" value={equipment?.name || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">{isRTL ? "الشركة المصنعة" : "Manufacturer"}</Label>
              <Input id="manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder={isRTL ? "أدخل الشركة المصنعة" : "Enter manufacturer"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serial-number">{isRTL ? "الرقم التسلسلي" : "Serial Number"}</Label>
              <Input id="serial-number" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder={isRTL ? "أدخل الرقم التسلسلي" : "Enter serial number"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{isRTL ? "موقع المنشأة / المعدات" : "Plant/Equipment Location"}</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder={isRTL ? "أدخل الموقع" : "Enter location"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-manufactured">{isRTL ? "تاريخ التصنيع" : "Date Manufactured"}</Label>
              <Input id="date-manufactured" type="date" value={dateManufactured} onChange={(e) => setDateManufactured(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-in-service">{isRTL ? "تاريخ الخدمة / الانضمام" : "Date in Service/Joined"}</Label>
              <Input id="date-in-service" type="date" value={dateInService} onChange={(e) => setDateInService(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Activity Cards - Responsive Layout */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="font-semibold text-lg">{isRTL ? "جدول أنشطة الصيانة" : "Maintenance Activity Table"}</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceActivities.map((activity, index) => (
                <div key={activity.id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {isRTL ? `النشاط ${index + 1}` : `Activity ${index + 1}`}
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeActivityRow(activity.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {isRTL ? "التاريخ" : "Date"}
                      </Label>
                      <Input 
                        type="date" 
                        value={activity.date} 
                        onChange={(e) => handleActivityChange(activity.id, "date", e.target.value)} 
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-medium flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {isRTL ? "تمت الصيانة بواسطة" : "Performed By"}
                      </Label>
                      <Input 
                        value={activity.performedBy} 
                        onChange={(e) => handleActivityChange(activity.id, "performedBy", e.target.value)} 
                        placeholder={isRTL ? "الاسم" : "Name"} 
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {isRTL ? "تم التحقق بواسطة" : "Validated By"}
                      </Label>
                      <Input 
                        value={activity.validatedBy} 
                        onChange={(e) => handleActivityChange(activity.id, "validatedBy", e.target.value)} 
                        placeholder={isRTL ? "الاسم" : "Name"} 
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {isRTL ? "تاريخ التحقق" : "Validation Date"}
                      </Label>
                      <Input 
                        type="date" 
                        value={activity.dateOfValidation} 
                        onChange={(e) => handleActivityChange(activity.id, "dateOfValidation", e.target.value)} 
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {isRTL ? "النشاط التالي المستحق" : "Next Due Date"}
                      </Label>
                      <Input 
                        type="date" 
                        value={activity.nextActivityDue} 
                        onChange={(e) => handleActivityChange(activity.id, "nextActivityDue", e.target.value)} 
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">{isRTL ? "ملاحظات" : "Remarks"}</Label>
                      <Input 
                        value={activity.remarks} 
                        onChange={(e) => handleActivityChange(activity.id, "remarks", e.target.value)} 
                        placeholder={isRTL ? "ملاحظات" : "Remarks"} 
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">{isRTL ? "وصف الصيانة" : "Maintenance Description"}</Label>
                    <Textarea 
                      value={activity.description} 
                      onChange={(e) => handleActivityChange(activity.id, "description", e.target.value)} 
                      placeholder={isRTL ? "أدخل وصف مفصل للصيانة المنجزة" : "Enter detailed description of maintenance performed"} 
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" onClick={addActivityRow} className="mt-4 w-full">
              <Plus className="h-4 w-4 mr-2" />
              {isRTL ? "إضافة نشاط صيانة جديد" : "Add New Maintenance Activity"}
            </Button>
          </CardContent>
        </Card>

        {/* Footer Section */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="font-semibold text-lg">{isRTL ? "توقيعات" : "Signatures"}</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supervisor-name">{isRTL ? "اسم مشرف الصيانة" : "Maintenance Supervisor Name"}</Label>
              <Input id="supervisor-name" value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} placeholder={isRTL ? "الاسم" : "Name"} />
              <p className="text-xs text-muted-foreground">{isRTL ? "التوقيع:" : "Signature:"} _________________________</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signature-date">{isRTL ? "التاريخ" : "Date"}</Label>
              <Input id="signature-date" type="date" value={signatureDate} onChange={(e) => setSignatureDate(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{isRTL ? "رقم مرجع النموذج:" : "Form Reference:"} {formReference}</span>
          <span>{isRTL ? "تتبع المراجعة:" : "Revision Tracking:"} {revisionTracking}</span>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (isRTL ? "جارٍ الحفظ..." : "Saving...") : (isRTL ? "حفظ السجل" : "Save Log")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}