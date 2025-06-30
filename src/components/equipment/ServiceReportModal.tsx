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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";

interface PartUsed {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
}

interface ServiceReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
  onSubmit: (data: any) => void; // Placeholder for submission
  loading: boolean;
}

export function ServiceReportModal({
  open,
  onOpenChange,
  equipment,
  onSubmit,
  loading,
}: ServiceReportModalProps) {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const { toast } = useToast();

  const [reportNumber, setReportNumber] = useState("SR-" + Math.floor(Math.random() * 100000).toString().padStart(5, '0')); // Auto-generated
  const [customerName, setCustomerName] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");
  const [equipmentType, setEquipmentType] = useState(equipment?.name || "");
  const [modelNumber, setModelNumber] = useState(equipment?.model || "");
  const [engineNumber, setEngineNumber] = useState("");
  const [trafficPlateNumber, setTrafficPlateNumber] = useState(equipment?.trafficPlateNumber || "");
  const [serviceDate, setServiceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [warrantyStatus, setWarrantyStatus] = useState<"new_delivery" | "warranty" | "no_warranty" | "">("");
  const [natureOfComplaint, setNatureOfComplaint] = useState("");
  const [detailedServiceDescription, setDetailedServiceDescription] = useState("");
  const [partsUsed, setPartsUsed] = useState<PartUsed[]>([
    { id: crypto.randomUUID(), name: "", quantity: 0, unitCost: 0 },
  ]);
  const [customerFeedback, setCustomerFeedback] = useState("");
  const [gmgtRepresentativeName, setGmgtRepresentativeName] = useState("");
  const [gmgtSignatureDate, setGmgtSignatureDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [customerRepresentativeName, setCustomerRepresentativeName] = useState("");
  const [customerSignatureDate, setCustomerSignatureDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const equipmentTypes = [
    "Crawler Crane", "Excavator", "JCB", "Hlab", "Telehandler", "Wheel Loader"
  ];

  const addPartRow = () => {
    setPartsUsed([
      ...partsUsed,
      { id: crypto.randomUUID(), name: "", quantity: 0, unitCost: 0 },
    ]);
  };

  const removePartRow = (id: string) => {
    setPartsUsed(partsUsed.filter((part) => part.id !== id));
  };

  const handlePartChange = (
    id: string,
    field: keyof PartUsed,
    value: string | number
  ) => {
    setPartsUsed(
      partsUsed.map((part) =>
        part.id === id ? { ...part, [field]: value } : part
      )
    );
  };

  const validateForm = () => {
    if (!customerName || !serviceLocation || !equipmentType || !modelNumber || !trafficPlateNumber || !serviceDate || !warrantyStatus || !natureOfComplaint || !detailedServiceDescription || !gmgtRepresentativeName || !customerRepresentativeName) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة." : "Please fill all required fields.",
        variant: "destructive",
      });
      return false;
    }
    if (isNaN(new Date(serviceDate).getTime())) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "تاريخ الخدمة غير صالح." : "Invalid service date.",
        variant: "destructive",
      });
      return false;
    }
    if (isNaN(new Date(gmgtSignatureDate).getTime())) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "تاريخ توقيع ممثل GMGT غير صالح." : "Invalid GMGT representative signature date.",
        variant: "destructive",
      });
      return false;
    }
    if (isNaN(new Date(customerSignatureDate).getTime())) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "تاريخ توقيع ممثل العميل غير صالح." : "Invalid customer representative signature date.",
        variant: "destructive",
      });
      return false;
    }

    for (const part of partsUsed) {
      if (!part.name || part.quantity <= 0 || part.unitCost <= 0) {
        toast({
          title: isRTL ? "خطأ" : "Error",
          description: isRTL ? "الرجاء إدخال تفاصيل صالحة لجميع الأجزاء المستخدمة." : "Please enter valid details for all parts used.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const formData = {
      reportNumber,
      customerDetails: {
        customerName,
        serviceLocation,
      },
      equipmentDetails: {
        equipmentType,
        modelNumber,
        engineNumber,
        trafficPlateNumber,
        serviceDate,
        warrantyStatus,
      },
      serviceDetails: {
        natureOfComplaint,
        detailedServiceDescription,
        partsUsed,
      },
      customerFeedback,
      signatures: {
        gmgtRepresentativeName,
        gmgtSignatureDate,
        customerRepresentativeName,
        customerSignatureDate,
      },
    };
    onSubmit(formData);
    // Placeholder for PDF export and email notification
    // console.log("Service Report Submitted:", formData);
    // alert("Service Report submitted! (PDF export and email notification would happen here)");
    onOpenChange(false); // Close modal on successful submission
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isRTL ? "تقرير الخدمة" : "Service Report"} - {reportNumber}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isRTL ? "نموذج لتوثيق تفاصيل الخدمة المقدمة للمعدات." : "Form to document service details for equipment."}
          </DialogDescription>
        </DialogHeader>

        {/* Company Letterhead (Placeholder) */}
        <div className="mb-6 border-b pb-4">
          <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">
            {isRTL ? "رأسية الشركة ومعلومات الاتصال" : "Company Letterhead & Contact Info"}
          </div>
        </div>

        {/* Customer & Equipment Details */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="font-semibold text-lg">{isRTL ? "تفاصيل العميل والمعدات" : "Customer & Equipment Details"}</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">{isRTL ? "اسم العميل" : "Customer Name"}</Label>
              <Input id="customer-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={isRTL ? "أدخل اسم العميل" : "Enter customer name"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-location">{isRTL ? "موقع الخدمة" : "Service Location"}</Label>
              <Input id="service-location" value={serviceLocation} onChange={(e) => setServiceLocation(e.target.value)} placeholder={isRTL ? "أدخل موقع الخدمة" : "Enter service location"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment-type">{isRTL ? "نوع المعدات" : "Equipment Type"}</Label>
              <Select value={equipmentType} onValueChange={setEquipmentType}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? "اختر نوع المعدات" : "Select equipment type"} />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-number">{isRTL ? "رقم الطراز" : "Model Number"}</Label>
              <Input id="model-number" value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} placeholder={isRTL ? "أدخل رقم الطراز" : "Enter model number"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="engine-number">{isRTL ? "رقم المحرك" : "Engine Number"}</Label>
              <Input id="engine-number" value={engineNumber} onChange={(e) => setEngineNumber(e.target.value)} placeholder={isRTL ? "أدخل رقم المحرك" : "Enter engine number"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traffic-plate-number">{isRTL ? "رقم اللوحة" : "Plate Number"}</Label>
              <Input id="traffic-plate-number" value={trafficPlateNumber} onChange={(e) => setTrafficPlateNumber(e.target.value)} placeholder={isRTL ? "أدخل رقم اللوحة" : "Enter plate number"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-date">{isRTL ? "تاريخ الخدمة" : "Service Date"}</Label>
              <Input id="service-date" type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "حالة الضمان" : "Warranty Status"}</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="new-delivery" checked={warrantyStatus === "new_delivery"} onCheckedChange={() => setWarrantyStatus("new_delivery")} />
                  <Label htmlFor="new-delivery">{isRTL ? "تسليم جديد" : "New Delivery"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="warranty" checked={warrantyStatus === "warranty"} onCheckedChange={() => setWarrantyStatus("warranty")} />
                  <Label htmlFor="warranty">{isRTL ? "ضمان" : "Warranty"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="no-warranty" checked={warrantyStatus === "no_warranty"} onCheckedChange={() => setWarrantyStatus("no_warranty")} />
                  <Label htmlFor="no-warranty">{isRTL ? "لا يوجد ضمان" : "No Warranty"}</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Details Section */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="font-semibold text-lg">{isRTL ? "تفاصيل الخدمة" : "Service Details"}</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nature-of-complaint">{isRTL ? "طبيعة الشكوى" : "Nature of Complaint"}</Label>
              <Textarea id="nature-of-complaint" value={natureOfComplaint} onChange={(e) => setNatureOfComplaint(e.target.value)} placeholder={isRTL ? "وصف موجز للشكوى..." : "Brief description of the complaint..."} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detailed-service-description">{isRTL ? "وصف الخدمة التفصيلي" : "Detailed Service Description"}</Label>
              <Textarea id="detailed-service-description" value={detailedServiceDescription} onChange={(e) => setDetailedServiceDescription(e.target.value)} placeholder={isRTL ? "وصف شامل للخدمة المنفذة..." : "Comprehensive description of service performed..."} rows={5} />
            </div>
            <div>
              <h4 className="font-medium mb-3">{isRTL ? "الأجزاء المستخدمة" : "Parts Used"}</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{isRTL ? "الاسم" : "Name"}</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{isRTL ? "الكمية" : "Quantity"}</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{isRTL ? "تكلفة الوحدة" : "Unit Cost"}</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{isRTL ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {partsUsed.map((part) => (
                      <tr key={part.id}>
                        <td className="p-2"><Input value={part.name} onChange={(e) => handlePartChange(part.id, "name", e.target.value)} placeholder={isRTL ? "اسم الجزء" : "Part Name"} /></td>
                        <td className="p-2"><Input type="number" value={part.quantity} onChange={(e) => handlePartChange(part.id, "quantity", parseInt(e.target.value))} min="0" /></td>
                        <td className="p-2"><Input type="number" value={part.unitCost} onChange={(e) => handlePartChange(part.id, "unitCost", parseFloat(e.target.value))} min="0" step="0.01" /></td>
                        <td className="p-2 text-center">
                          <Button variant="ghost" size="sm" onClick={() => removePartRow(part.id)} title={isRTL ? "إزالة" : "Remove"}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" onClick={addPartRow} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                {isRTL ? "إضافة جزء" : "Add Part"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customer Feedback Section */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="font-semibold text-lg">{isRTL ? "قسم الملاحظات" : "Feedback Section"}</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="customer-feedback">{isRTL ? "ملاحظات العميل" : "Customer Feedback"}</Label>
              <Textarea id="customer-feedback" value={customerFeedback} onChange={(e) => setCustomerFeedback(e.target.value)} placeholder={isRTL ? "أدخل ملاحظات العميل..." : "Enter customer feedback..."} rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Signature Section */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="font-semibold text-lg">{isRTL ? "قسم التوقيع" : "Signature Section"}</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gmgt-rep-name">{isRTL ? "اسم ممثل GMGT" : "GMGT Representative Name"}</Label>
              <Input id="gmgt-rep-name" value={gmgtRepresentativeName} onChange={(e) => setGmgtRepresentativeName(e.target.value)} placeholder={isRTL ? "الاسم" : "Name"} />
              <p className="text-xs text-muted-foreground">{isRTL ? "التوقيع:" : "Signature:"} _________________________</p>
              <Label htmlFor="gmgt-signature-date">{isRTL ? "التاريخ" : "Date"}</Label>
              <Input id="gmgt-signature-date" type="date" value={gmgtSignatureDate} onChange={(e) => setGmgtSignatureDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-rep-name">{isRTL ? "اسم ممثل العميل" : "Customer Representative Name"}</Label>
              <Input id="customer-rep-name" value={customerRepresentativeName} onChange={(e) => setCustomerRepresentativeName(e.target.value)} placeholder={isRTL ? "الاسم" : "Name"} />
              <p className="text-xs text-muted-foreground">{isRTL ? "التوقيع:" : "Signature:"} _________________________</p>
              <Label htmlFor="customer-signature-date">{isRTL ? "التاريخ" : "Date"}</Label>
              <Input id="customer-signature-date" type="date" value={customerSignatureDate} onChange={(e) => setCustomerSignatureDate(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (isRTL ? "جارٍ الحفظ..." : "Saving...") : (isRTL ? "حفظ التقرير" : "Save Report")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 