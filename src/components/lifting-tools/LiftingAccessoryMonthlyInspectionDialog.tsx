import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, FileText, Play, X, Check, AlertTriangle, Eye } from "lucide-react";
import type { LiftingAccessory } from "@/types/lifting-tools";
import type { MonthlyInspection } from "@/types/inspection";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const LIFTING_ACCESSORY_INSPECTION_ITEMS = [
  {
    id: "driving-license",
    image: "/images/driving_license_check.png",
    title: "Valid Driving License",
    description: "Check if operator has valid driving license",
    titleAr: "رخصة قيادة سارية",
    descriptionAr: "تحقق من امتلاك المشغل لرخصة قيادة سارية",
  },
  {
    id: "calibration",
    image: "/images/calibration_certificate.png",
    title: "Valid 3rd Party Calibration Certificate",
    description: "Verify calibration certificate validity",
    titleAr: "شهادة معايرة سارية من طرف ثالث",
    descriptionAr: "التحقق من صلاحية شهادة المعايرة",
  },
  {
    id: "operator-competency",
    image: "/images/operator_competency.png",
    title: "Driver Competency Verification",
    description: "Ensure operator competency",
    titleAr: "التحقق من كفاءة السائق",
    descriptionAr: "ضمان كفاءة المشغل",
  },
  {
    id: "cab-interior",
    image: "/images/cab_interior_seats_seatbelts.png",
    title: "Cab Cleanliness, Seats and Seatbelts",
    description: "Inspect cab cleanliness and seatbelts",
    titleAr: "نظافة الكابينة والمقاعد وأحزمة الأمان",
    descriptionAr: "فحص نظافة الكابينة وأحزمة الأمان",
  },
  {
    id: "cab-glass",
    image: "/images/cab_glass_mirrors.png",
    title: "Glass Cab and Rear Mirror",
    description: "Check cab glass and mirrors condition",
    titleAr: "زجاج الكابينة والمرايا الخلفية",
    descriptionAr: "فحص حالة الزجاج والمرايا",
  },
  {
    id: "control-levers",
    image: "/images/control_levers_joysticks.png",
    title: "Control Levers",
    description: "Test control levers functionality",
    titleAr: "عناصر التحكم (الرافعات)",
    descriptionAr: "اختبار عمل الرافعات",
  },
  {
    id: "handbrake",
    image: "/images/handbrake_parking_brake.png",
    title: "Hand Brake",
    description: "Ensure hand brake is functional",
    titleAr: "فرامل اليد",
    descriptionAr: "التأكد من أن فرامل اليد تعمل",
  },
  {
    id: "fire-extinguisher",
    image: "/images/fire_extinguisher_safety.png",
    title: "Fire Extinguisher",
    description: "Check fire extinguisher presence and status",
    titleAr: "طفاية حريق",
    descriptionAr: "التحقق من وجود طفاية الحريق وصلاحيتها",
  },
  {
    id: "warning-devices",
    image: "/images/warning_devices_horn_lights.png",
    title: "Warning Devices – Horn, Back Alarm and Traffic Lights",
    description: "Test warning devices like horn and alarms",
    titleAr: "أجهزة التحذير – البوق، إنذار الرجوع، إشارات المرور",
    descriptionAr: "اختبار أجهزة التحذير مثل البوق والإنذارات",
  },
  {
    id: "warning-signs",
    image: "/images/safety_warning_signs.png",
    title: "Warning Signs",
    description: "Inspect safety warning signs",
    titleAr: "لافتات التحذير",
    descriptionAr: "فحص لافتات السلامة التحذيرية",
  },
  {
    id: "brakes",
    image: "/images/brake_system_inspection.png",
    title: "Brakes",
    description: "Inspect braking system",
    titleAr: "الفرامل",
    descriptionAr: "فحص نظام الفرامل",
  },
  {
    id: "motor-condition",
    image: "/images/engine_motor_condition.png",
    title: "Motor Condition",
    description: "Check engine/motor condition",
    titleAr: "حالة المحرك",
    descriptionAr: "التحقق من حالة المحرك",
  },
  {
    id: "hydraulic-system",
    image: "/images/hydraulic_system_check.png",
    title: "Hydraulic System",
    description: "Inspect hydraulic system",
    titleAr: "نظام الهيدروليك",
    descriptionAr: "فحص نظام الهيدروليك",
  },
  {
    id: "hydraulic-leaks",
    image: "/images/hydraulic_links_leak_check.png",
    title: "No Leak in Links",
    description: "Ensure hydraulic links are leak-free",
    titleAr: "عدم وجود تسرب في الوصلات",
    descriptionAr: "التحقق من عدم تسرب الزيت في الوصلات",
  },
  {
    id: "bucket-components",
    image: "/images/bucket_axles_joints.png",
    title: "Equipment Components - Bucket, Axes and Joints",
    description: "Check bucket, axles, and joints",
    titleAr: "مكونات المعدات - الدلو، المحاور، والوصلات",
    descriptionAr: "فحص الدلو والمحاور والوصلات",
  },
  {
    id: "access-platforms",
    image: "/images/safety_access_platforms.png",
    title: "Access Platforms",
    description: "Inspect access platforms for safety",
    titleAr: "منصات الوصول",
    descriptionAr: "فحص منصات الوصول من حيث السلامة",
  },
  {
    id: "tires-trackpads",
    image: "/images/tires_tracks_condition.png",
    title: "Tires / Track Pads Condition",
    description: "Check tires or track pads condition",
    titleAr: "حالة الإطارات / وسائد الجنزير",
    descriptionAr: "فحص حالة الإطارات أو وسائد الجنزير",
  },
  {
    id: "outriggers",
    image: "/images/outriggers_stabilizers.png",
    title: "Outriggers",
    description: "Inspect outriggers or stabilizers",
    titleAr: "الدعامات الجانبية",
    descriptionAr: "فحص الدعامات أو المثبتات",
  },
];

interface Props {
  accessory: LiftingAccessory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (inspection: MonthlyInspection) => Promise<void>;
}

interface InspectionResponse {
  status?: "passed" | "failed";
  comment: string;
  action?: string;
}

export function LiftingAccessoryMonthlyInspectionDialog({
  accessory,
  open,
  onOpenChange,
  onSubmit,
}: Props) {
  if (!accessory) {
    return null; // or a fallback UI
  }

  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(-1);
  const [responses, setResponses] = useState<Record<string, InspectionResponse>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showNextInsteadOfNo, setShowNextInsteadOfNo] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [nextInspectionDate, setNextInspectionDate] = useState("");
  const [lastInspectionDate, setLastInspectionDate] = useState("");
  const [project, setProject] = useState("");
  const [subcontractor, setSubcontractor] = useState("");
  const [chassisNo, setChassisNo] = useState("");
  const [driverName, setDriverName] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "individual" | "lastReport">("list");
  const [lastReports, setLastReports] = useState<MonthlyInspection[]>([]);
  const [selectedReportDate, setSelectedReportDate] = useState<string>("");
  const [lastReportLoading, setLastReportLoading] = useState(false);

  const currentItem = currentStep >= 0 ? LIFTING_ACCESSORY_INSPECTION_ITEMS[currentStep] : null;

  const getInspectionItemDetails = (id: string) => {
    const item = LIFTING_ACCESSORY_INSPECTION_ITEMS.find((i) => i.id === id);
    return {
      description: item ? item.description : "",
      isRequired: true,
    };
  };

  const handleStartInspection = () => {
    if (viewMode === "individual") {
      setCurrentStep(0);
    } else {
      const firstUnchecked = LIFTING_ACCESSORY_INSPECTION_ITEMS.findIndex(item => !responses[item.id]?.status);
      if (firstUnchecked >= 0) {
        setCurrentStep(firstUnchecked);
        setViewMode("individual");
      }
    }
  };

  const handleResponse = (status: "passed" | "failed", id: string) => {
    setResponses((prev) => ({
      ...prev,
      [id]: {
        status,
        comment: prev[id]?.comment || "",
        action: prev[id]?.action || "",
      },
    }));

    if (viewMode === "individual") {
      if (status === "failed" && currentStep >= 0) {
        setShowNextInsteadOfNo(true);
        setShowCommentBox(true);
      } else if (status === "passed" && currentStep < LIFTING_ACCESSORY_INSPECTION_ITEMS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        setShowNextInsteadOfNo(false);
        setShowCommentBox(false);
      }
    }
  };

  const handleComment = (comment: string, id: string) => {
    setResponses((prev) => ({
      ...prev,
      [id]: { ...prev[id], comment },
    }));
  };

  const handleAction = (action: string, id: string) => {
    setResponses((prev) => ({
      ...prev,
      [id]: { ...prev[id], action },
    }));
  };

  const handleNext = () => {
    if (currentStep < LIFTING_ACCESSORY_INSPECTION_ITEMS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setShowCommentBox(false);
      setShowNextInsteadOfNo(false);
    } else {
      showCompletionReport();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setShowCommentBox(false);
      setShowNextInsteadOfNo(false);
    } else if (currentStep === 0) {
      setCurrentStep(-1);
      setViewMode("list");
    }
  };

  const showCompletionReport = () => {
    setCurrentStep(-2);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      if (!nextInspectionDate) {
        setError(isRTL ? "يرجى تحديد تاريخ الفحص القادم" : "Please set the next inspection date");
        return;
      }

      const inspection: MonthlyInspection = {
        date: new Date().toISOString(),
        technicianId: "current-user-id",
        technicianName: inspectorName || "Unknown Technician",
        items: Object.entries(responses).map(([id, response]) => {
          const { description, isRequired } = getInspectionItemDetails(id);
          return {
            id,
            description,
            isRequired,
            status: response.status || "not-checked",
            comment: response.comment,
            action: response.action,
          };
        }),
        status: "completed",
        equipmentId: accessory.accessoryId,
        toolName: accessory.accessoryName || "",
        serialNumber: chassisNo || accessory.accessoryId || "",
        manufacturer: subcontractor || accessory.manufacturer || "",
        modelNumber: accessory.modelNumber || "",
        nextInspectionDate,
        notes: project,
        powerToolId: "",
      };

      await onSubmit(inspection);

      // Store in localStorage
      const existingReports = JSON.parse(localStorage.getItem(`lifting_accessory_inspection_reports_${accessory.accessoryId}`) || '[]');
      localStorage.setItem(
        `lifting_accessory_inspection_reports_${accessory.accessoryId}`,
        JSON.stringify([inspection, ...existingReports])
      );

      // Update last reports state
      setLastReports((prev) => [
        inspection,
        ...prev.filter((report) => report.date !== inspection.date),
      ]);

      // Show toast notification
      toast({
        title: isRTL ? "تم حفظ التقرير" : "Report Saved",
        description: isRTL ? "تم حفظ تقرير الفحص بنجاح" : "The inspection report has been saved successfully",
        variant: "default",
        duration: 3000,
      });

      // Close the dialog
      onOpenChange(false);
      setCurrentStep(-1);
      setResponses({});
      setShowNextInsteadOfNo(false);
      setShowCommentBox(false);
      setViewMode("list");
    } catch (err) {
      setError(isRTL ? "حدث خطأ أثناء حفظ الفحص" : "An error occurred while saving the inspection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(-1);
    setResponses({});
    setShowNextInsteadOfNo(false);
    setShowCommentBox(false);
    setError("");
    setProject("");
    setSubcontractor("");
    setChassisNo("");
    setDriverName("");
    setInspectorName("");
    setNextInspectionDate("");
    setLastInspectionDate("");
    setViewMode("list");
  };

  const getStatusIcon = (status?: "passed" | "failed") => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "failed":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getCompletionStats = () => {
    const total = LIFTING_ACCESSORY_INSPECTION_ITEMS.length;
    const completed = Object.keys(responses).length;
    const passed = Object.values(responses).filter((r) => r.status === "passed").length;
    const failed = Object.values(responses).filter((r) => r.status === "failed").length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    return { total, completed, passed, failed, passRate };
  };

  // Fetch reports from localStorage
  async function fetchLastInspectionReports(accessoryId: string): Promise<MonthlyInspection[]> {
    const storedReports = JSON.parse(localStorage.getItem(`lifting_accessory_inspection_reports_${accessoryId}`) || '[]');
    if (storedReports.length > 0) {
      return storedReports;
    }
    // Fallback mock data if no reports in localStorage
    return [
      {
        date: "2025-05-20",
        status: "completed",
        items: LIFTING_ACCESSORY_INSPECTION_ITEMS.map(item => ({
          id: item.id,
          description: item.description,
          isRequired: true,
          status: Math.random() > 0.3 ? "passed" : "failed",
          comment: Math.random() > 0.7 ? "Sample comment" : "",
          action: Math.random() > 0.7 ? "Sample action" : "",
        })),
        equipmentId: accessoryId,
        technicianId: "user-1",
        technicianName: "John Smith",
        toolName: "Lifting Sling",
        serialNumber: "SN123456",
        manufacturer: "Sample Co",
        modelNumber: "X123",
        nextInspectionDate: "2025-06-20",
        notes: "Sample project",
        powerToolId: "",
      },
      {
        date: "2025-04-15",
        status: "completed",
        items: LIFTING_ACCESSORY_INSPECTION_ITEMS.map(item => ({
          id: item.id,
          description: item.description,
          isRequired: true,
          status: Math.random() > 0.5 ? "passed" : "failed",
          comment: Math.random() > 0.8 ? "Older comment" : "",
          action: Math.random() > 0.8 ? "Older action" : "",
        })),
        equipmentId: accessoryId,
        technicianId: "user-2",
        technicianName: "Jane Smith",
        toolName: "Lifting Hook",
        serialNumber: "SN654321",
        manufacturer: "Sample Co",
        modelNumber: "B456",
        nextInspectionDate: "2025-05-15",
        notes: "Another project",
        powerToolId: "",
      },
    ];
  }

  // Fetch reports on component mount or when accessory changes
  useEffect(() => {
    if (viewMode === "lastReport" && accessory?.accessoryId) {
      setLastReportLoading(true);
      fetchLastInspectionReports(accessory.accessoryId).then((reports) => {
        setLastReports(reports);
        setSelectedReportDate(reports[0]?.date || "");
        setLastReportLoading(false);
      });
    }
  }, [viewMode, accessory?.accessoryId]);

  if (!accessory) return null;

  // Completion Report View
  if (currentStep === -2) {
    const stats = getCompletionStats();
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-[1200px] max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              {isRTL ? "تقرير إكمال الفحص الشهري" : "Monthly Inspection Completion Report"}
            </DialogTitle>
          </DialogHeader>

          <Button 
            variant="outline" 
            onClick={() => {
              setCurrentStep(-1);
              setViewMode("list");
            }} 
            className="mb-4 hover:bg-gray-100 transition-all w-fit"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {isRTL ? "العودة للقائمة" : "Back to List"}
          </Button>

          {/* Checklist Header Fields */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">MONTHLY LIFTING ACCESSORY INSPECTION CHECKLIST</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="font-medium">{isRTL ? "المشروع:" : "Project:"}</span> {project}</div>
              <div><span className="font-medium">{isRTL ? "تاريخ الفحص الأخير:" : "Last Inspection Date:"}</span> {lastInspectionDate}</div>
              <div><span className="font-medium">{isRTL ? "المقاول الفرعي:" : "Subcontractor:"}</span> {subcontractor}</div>
              <div><span className="font-medium">{isRTL ? "رقم الشاسيه:" : "Chassis No:"}</span> {chassisNo}</div>
              <div><span className="font-medium">{isRTL ? "اسم السائق:" : "Driver Name:"}</span> {driverName}</div>
              <div><span className="font-medium">{isRTL ? "اسم المفتش:" : "Inspector Name:"}</span> {inspectorName}</div>
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { value: stats.total, label: isRTL ? "إجمالي العناصر" : "Total Items", color: "blue" },
              { value: stats.passed, label: isRTL ? "نجح" : "Passed", color: "green" },
              { value: stats.failed, label: isRTL ? "فشل" : "Failed", color: "red" },
              { value: `${stats.passRate}%`, label: isRTL ? "معدل النجاح" : "Pass Rate", color: "purple" },
            ].map((stat, index) => (
              <div key={index} className={`bg-${stat.color}-50 p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow`}>
                <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                <div className={`text-sm text-${stat.color}-800`}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Accessory Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">{isRTL ? "معلومات الملحق" : "Accessory Information"}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="font-medium">{isRTL ? "اسم الملحق:" : "Accessory Name:"}</span> {accessory.accessoryName || ""}</div>
              <div><span className="font-medium">{isRTL ? "الرقم التسلسلي:" : "Serial Number:"}</span> {chassisNo || accessory.accessoryId || ""}</div>
              <div><span className="font-medium">{isRTL ? "المشروع:" : "Project:"}</span> {project}</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">{isRTL ? "النتائج التفصيلية" : "Detailed Results"}</h3>
            {/* Failed Items */}
            {stats.failed > 0 && (
              <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                  <X className="h-5 w-5" />
                  {isRTL ? "العناصر الفاشلة" : "Failed Items"}
                </h4>
                <div className="space-y-3">
                  {LIFTING_ACCESSORY_INSPECTION_ITEMS.filter(item => responses[item.id]?.status === "failed").map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <img src={item.image} alt="" className="w-10 h-10 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{isRTL ? item.titleAr : item.title}</div>
                        {responses[item.id]?.comment && (
                          <div className="text-sm text-gray-600 mt-1">
                            <strong>{isRTL ? "ملاحظة:" : "Note:"}</strong> {responses[item.id].comment}
                          </div>
                        )}
                        {responses[item.id]?.action && (
                          <div className="text-sm text-red-600 mt-1">
                            <strong>{isRTL ? "الإجراء المطلوب:" : "Action Required:"}</strong> {responses[item.id].action}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Passed Items */}
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                {isRTL ? "العناصر الناجحة" : "Passed Items"}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {LIFTING_ACCESSORY_INSPECTION_ITEMS.filter(item => responses[item.id]?.status === "passed").map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <img src={item.image} alt="" className="w-8 h-8 object-cover rounded" />
                    <span className="text-sm">{isRTL ? item.titleAr : item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Inspection Date */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <label className="block text-sm font-medium mb-2 text-gray-800">
              {isRTL ? "تاريخ الفحص القادم" : "Next Inspection Date"}
            </label>
            <Input
              type="date"
              value={nextInspectionDate}
              onChange={(e) => setNextInspectionDate(e.target.value)}
              className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => window.print()} className="hover:bg-gray-100 transition-all">
              <FileText className="h-4 w-4 mr-2" />
              {isRTL ? "طباعة التقرير" : "Print Report"}
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !nextInspectionDate} className="bg-blue-600 hover:bg-blue-700 transition-all">
              {isSubmitting ? (isRTL ? "جاري الحفظ..." : "Saving...") : (isRTL ? "حفظ التقرير" : "Save Report")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Last Report View
  if (viewMode === "lastReport") {
    const selectedReport = lastReports.find(report => report.date === selectedReportDate);
    const stats = selectedReport && selectedReport.items ? {
      total: LIFTING_ACCESSORY_INSPECTION_ITEMS.length,
      completed: selectedReport.items.length,
      passed: selectedReport.items.filter((i) => i.status === "passed").length,
      failed: selectedReport.items.filter((i) => i.status === "failed").length,
      passRate: selectedReport.items.length > 0 ? Math.round((selectedReport.items.filter((i) => i.status === "passed").length / selectedReport.items.length) * 100) : 0,
    } : { total: 0, completed: 0, passed: 0, failed: 0, passRate: 0 };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-[1200px] max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              {isRTL ? "آخر تقرير فحص شهري" : "Last Monthly Inspection Report"}
            </DialogTitle>
          </DialogHeader>

          <Button 
            variant="outline" 
            onClick={() => setViewMode("list")} 
            className="mb-4 hover:bg-gray-100 transition-all w-fit"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {isRTL ? "العودة للقائمة" : "Back to List"}
          </Button>

          {lastReportLoading ? (
            <div className="py-8 text-center text-gray-500">{isRTL ? "جاري التحميل..." : "Loading..."}</div>
          ) : lastReports.length > 0 ? (
            <>
              {/* Report Date Selector */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">{isRTL ? "اختيار تاريخ التقرير" : "Select Report Date"}</h3>
                <Select
                  value={selectedReportDate}
                  onValueChange={(value) => setSelectedReportDate(value)}
                >
                  <SelectTrigger className="w-full max-w-[300px] border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200">
                    <SelectValue placeholder={isRTL ? "اختر تاريخ التقرير" : "Select report date"} />
                  </SelectTrigger>
                  <SelectContent>
                    {lastReports.map((report) => (
                      <SelectItem key={report.date} value={report.date}>
                        {new Date(report.date).toLocaleDateString(isRTL ? "ar-EG" : "en-US")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedReport && (
                <>
                  {/* Checklist Header Fields */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">MONTHLY LIFTING ACCESSORY INSPECTION CHECKLIST</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div><span className="font-medium">{isRTL ? "المشروع:" : "Project:"}</span> {selectedReport.notes}</div>
                      <div><span className="font-medium">{isRTL ? "تاريخ الفحص:" : "Inspection Date:"}</span> {selectedReport.date.split('T')[0]}</div>
                      <div><span className="font-medium">{isRTL ? "المقاول الفرعي:" : "Subcontractor:"}</span> {selectedReport.manufacturer}</div>
                      <div><span className="font-medium">{isRTL ? "رقم الشاسيه:" : "Chassis No:"}</span> {selectedReport.serialNumber}</div>
                      <div><span className="font-medium">{isRTL ? "اسم السائق:" : "Driver Name:"}</span> {selectedReport.technicianName}</div>
                      <div><span className="font-medium">{isRTL ? "اسم المفتش:" : "Inspector Name:"}</span> {selectedReport.technicianName}</div>
                    </div>
                  </div>

                  {/* Overall Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { value: stats.total, label: isRTL ? "إجمالي العناصر" : "Total Items", color: "blue" },
                      { value: stats.passed, label: isRTL ? "نجح" : "Passed", color: "green" },
                      { value: stats.failed, label: isRTL ? "فشل" : "Failed", color: "red" },
                      { value: `${stats.passRate}%`, label: isRTL ? "معدل النجاح" : "Pass Rate", color: "purple" },
                    ].map((stat, index) => (
                      <div key={index} className={`bg-${stat.color}-50 p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow`}>
                        <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                        <div className={`text-sm text-${stat.color}-800`}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Accessory Information */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">{isRTL ? "معلومات الملحق" : "Accessory Information"}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div><span className="font-medium">{isRTL ? "اسم الملحق:" : "Accessory Name:"}</span> {selectedReport.toolName || selectedReport.equipmentId}</div>
                      <div><span className="font-medium">{isRTL ? "الرقم التسلسلي:" : "Serial Number:"}</span> {selectedReport.serialNumber}</div>
                      <div><span className="font-medium">{isRTL ? "المشروع:" : "Project:"}</span> {selectedReport.notes}</div>
                    </div>
                  </div>

                  {/* Inspection Items Grid */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">{isRTL ? "النتائج التفصيلية" : "Detailed Results"}</h3>
                    {/* Failed Items */}
                    {stats.failed > 0 && (
                      <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                          <X className="h-5 w-5" />
                          {isRTL ? "العناصر الفاشلة" : "Failed Items"}
                        </h4>
                        <div className="space-y-3">
                          {LIFTING_ACCESSORY_INSPECTION_ITEMS.filter(item => {
                            const reportItem = selectedReport.items.find(i => i.id === item.id);
                            return reportItem?.status === "failed";
                          }).map(item => (
                            <div key={item.id} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                              <img src={item.image} alt="" className="w-10 h-10 object-cover rounded" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{isRTL ? item.titleAr : item.title}</div>
                                {selectedReport.items.find(i => i.id === item.id)?.comment && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    <strong>{isRTL ? "ملاحظة:" : "Note:"}</strong> {selectedReport.items.find(i => i.id === item.id)?.comment}
                                  </div>
                                )}
                                {selectedReport.items.find(i => i.id === item.id)?.action && (
                                  <div className="text-sm text-red-600 mt-1">
                                    <strong>{isRTL ? "الإجراء المطلوب:" : "Action Required:"}</strong> {selectedReport.items.find(i => i.id === item.id)?.action}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Passed Items */}
                    <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        {isRTL ? "العناصر الناجحة" : "Passed Items"}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {LIFTING_ACCESSORY_INSPECTION_ITEMS.filter(item => {
                          const reportItem = selectedReport.items.find(i => i.id === item.id);
                          return reportItem?.status === "passed";
                        }).map(item => (
                          <div key={item.id} className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <img src={item.image} alt="" className="w-8 h-8 object-cover rounded" />
                            <span className="text-sm">{isRTL ? item.titleAr : item.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Next Inspection Date */}
                  <div className="bg-blue-50 p-4 rounded-lg shadow-sm mt-6">
                    <label className="block text-sm font-medium mb-2 text-gray-800">
                      {isRTL ? "تاريخ الفحص القادم" : "Next Inspection Date"}
                    </label>
                    <Input
                      type="date"
                      value={selectedReport.nextInspectionDate || ""}
                      readOnly
                      className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </>
              )}

              {/* Reference Information */}
              <div className="text-xs text-gray-500 text-center pt-4 border-t mt-6">
                ESPEC-HSE-F09 Issue Date: 17-5-2021 Rev. No. 03
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4 border-t mt-6">
                <Button variant="outline" onClick={() => window.print()} className="hover:bg-gray-100 transition-all">
                  <FileText className="h-4 w-4 mr-2" />
                  {isRTL ? "طباعة التقرير" : "Print Report"}
                </Button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">{isRTL ? "لا يوجد تقارير سابقة" : "No previous reports found."}</div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Initial Overview View (Enhanced List View)
  if (currentStep === -1) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-[1400px] max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl bg-white">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {isRTL ? "الفحص الشهري لملحقات الرفع" : "Lifting Accessory Monthly Inspection Checklist"}
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setLastReportLoading(true);
                  fetchLastInspectionReports(accessory.accessoryId).then((reports) => {
                    setLastReports(reports);
                    setSelectedReportDate(reports[0]?.date || "");
                    setLastReportLoading(false);
                    setViewMode("lastReport");
                  });
                }}
                className="hover:bg-gray-100 transition-all"
              >
                <FileText className="h-4 w-4 mr-2" />
                {isRTL ? "آخر تقرير فحص" : "Last Report"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setViewMode("individual")}
                className="hover:bg-gray-100 transition-all"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isRTL ? "عرض فردي" : "Individual View"}
              </Button>
              <Button onClick={handleStartInspection} className="bg-blue-600 hover:bg-blue-700 transition-all">
                <Play className="h-4 w-4 mr-2" />
                {isRTL ? "بدء الفحص" : "Start Inspection"}
              </Button>
            </div>
          </DialogHeader>

          {/* Accessory and Project Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {isRTL ? "قائمة فحص ملحقات الرفع" : "Lifting Accessory Inspection Checklist"}
            </h3>
            <p className="text-sm mb-3 text-gray-500">{accessory.accessoryName || "Lifting Sling"}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">{isRTL ? "المشروع:" : "Project:"}</label>
                <Input
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  placeholder={isRTL ? "أدخل اسم المشروع" : "Enter project name"}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{isRTL ? "تاريخ الفحص الأخير:" : "Last Inspection Date:"}</label>
                <Input
                  type="date"
                  value={lastInspectionDate}
                  onChange={(e) => setLastInspectionDate(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{isRTL ? "المقاول الفرعي:" : "Subcontractor:"}</label>
                <Input
                  value={subcontractor}
                  onChange={(e) => setSubcontractor(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  placeholder={isRTL ? "أدخل المقاول الفرعي" : "Enter subcontractor"}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{isRTL ? "رقم الشاسيه:" : "Chassis No:"}</label>
                <Input
                  value={chassisNo}
                  onChange={(e) => setChassisNo(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  placeholder={isRTL ? "أدخل رقم الشاسيه" : "Enter chassis number"}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{isRTL ? "اسم السائق:" : "Driver Name:"}</label>
                <Input
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  placeholder={isRTL ? "أدخل اسم السائق" : "Enter driver name"}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{isRTL ? "اسم المفتش:" : "Inspector Name:"}</label>
                <Input
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  placeholder={isRTL ? "أدخل اسم المفتش" : "Enter inspector name"}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Inspection Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {LIFTING_ACCESSORY_INSPECTION_ITEMS.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow">
                      {getStatusIcon(responses[item.id]?.status)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1 text-gray-800">
                      {isRTL ? item.titleAr : item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">
                      {isRTL ? item.descriptionAr : item.description}
                    </p>
                    <div className="flex gap-2 mb-2">
                      <Button
                        size="sm"
                        variant={responses[item.id]?.status === "passed" ? "default" : "outline"}
                        className={cn(
                          "h-8 px-3 text-xs",
                          responses[item.id]?.status === "passed" && "bg-green-600 hover:bg-green-700"
                        )}
                        onClick={() => handleResponse("passed", item.id)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {isRTL ? "نعم" : "Yes"}
                      </Button>
                      <Button
                        size="sm"
                        variant={responses[item.id]?.status === "failed" ? "destructive" : "outline"}
                        className="h-8 px-3 text-xs"
                        onClick={() => {
                          handleResponse("failed", item.id);
                          setShowCommentBox(true);
                        }}
                      >
                        <X className="h-3 w-3 mr-1" />
                        {isRTL ? "لا" : "No"}
                      </Button>
                    </div>
                    {(responses[item.id]?.status === "failed" || showCommentBox) && (
                      <div className="space-y-2">
                        <Input
                          placeholder={isRTL ? "ملاحظات" : "Notes"}
                          value={responses[item.id]?.comment || ""}
                          onChange={(e) => handleComment(e.target.value, item.id)}
                          className="h-8 text-xs border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                        {responses[item.id]?.status === "failed" && (
                          <Input
                            placeholder={isRTL ? "الإجراء المطلوب" : "Action Required"}
                            value={responses[item.id]?.action || ""}
                            onChange={(e) => handleAction(e.target.value, item.id)}
                            className="h-8 text-xs border-red-200 focus:border-red-300 focus:ring focus:ring-red-100"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Summary */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-800">{isRTL ? "ملخص التقدم" : "Progress Summary"}</h4>
              <span className="text-sm text-gray-500">
                {Object.keys(responses).length} / {LIFTING_ACCESSORY_INSPECTION_ITEMS.length} {isRTL ? "مكتمل" : "completed"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.keys(responses).length / LIFTING_ACCESSORY_INSPECTION_ITEMS.length) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{isRTL ? "نجح" : "Passed"}: {Object.values(responses).filter(r => r.status === "passed").length}</span>
              <span>{isRTL ? "فشل" : "Failed"}: {Object.values(responses).filter(r => r.status === "failed").length}</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleReset} className="hover:bg-gray-100 transition-all">
              {isRTL ? "إعادة تعيين" : "Reset"}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-gray-100 transition-all">
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              {Object.keys(responses).length === LIFTING_ACCESSORY_INSPECTION_ITEMS.length ? (
                <Button onClick={showCompletionReport} className="bg-green-600 hover:bg-green-700 transition-all">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isRTL ? "عرض التقرير" : "View Report"}
                </Button>
              ) : (
                <Button onClick={handleStartInspection} className="bg-blue-600 hover:bg-blue-700 transition-all">
                  <Play className="h-4 w-4 mr-2" />
                  {isRTL ? "متابعة الفحص" : "Continue Inspection"}
                </Button>
              )}
            </div>
          </div>

          {/* Reference Information */}
          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            ESPEC-HSE-F09 Issue Date: 17-5-2021 Rev. No. 03
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Individual Item Inspection View
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[800px] max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl bg-white">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {isRTL ? "الفحص الشهري لملحقات الرفع" : "Lifting Accessory Monthly Inspection"}
              <span className="text-sm text-gray-500 ml-2">
                {currentStep + 1} / {LIFTING_ACCESSORY_INSPECTION_ITEMS.length}
              </span>
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentStep(-1);
                setViewMode("list");
              }}
              className="hover:bg-gray-100 transition-all"
            >
              {isRTL ? "عرض القائمة" : "List View"}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Accessory Info */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{isRTL ? "الملحق:" : "Accessory:"}</span>
                <span className="font-medium ml-2">{accessory.accessoryName || ""}</span>
              </div>
              <div>
                <span className="text-gray-600">{isRTL ? "الرقم التسلسلي:" : "Serial No:"}</span>
                <span className="font-medium ml-2">{chassisNo || accessory.accessoryId || ""}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">{isRTL ? "التقدم" : "Progress"}</span>
              <span className="text-gray-500">{Math.round(((currentStep + 1) / LIFTING_ACCESSORY_INSPECTION_ITEMS.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / LIFTING_ACCESSORY_INSPECTION_ITEMS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Inspection Item */}
          {currentItem && (
            <div className="text-center space-y-4">
              <div className="relative">
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="mx-auto h-48 object-contain rounded-lg border shadow-sm"
                />
                {responses[currentItem.id]?.status && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                    {getStatusIcon(responses[currentItem.id].status)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {isRTL ? currentItem.titleAr : currentItem.title}
                </h3>
                <p className="text-gray-500">
                  {isRTL ? currentItem.descriptionAr : currentItem.description}
                </p>
              </div>
            </div>
          )}

          {/* Response Buttons */}
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <Button
                variant={responses[currentItem?.id || ""]?.status === "passed" ? "default" : "outline"}
                className={cn(
                  "w-32",
                  responses[currentItem?.id || ""]?.status === "passed" && "bg-green-600 hover:bg-green-700 transition-all"
                )}
                onClick={() => handleResponse("passed", currentItem.id)}
              >
                <Check className="h-4 w-4 mr-2" />
                {isRTL ? "نعم" : "Yes"}
              </Button>
              {showNextInsteadOfNo ? (
                <Button
                  variant="outline"
                  className="w-32 hover:bg-gray-100 transition-all"
                  onClick={handleNext}
                >
                  {isRTL ? "التالي" : "Next"}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button
                    variant={responses[currentItem?.id || ""]?.status === "failed" ? "destructive" : "outline"}
                    className="w-32 hover:bg-red-50 transition-all"
                    onClick={() => {
                      handleResponse("failed", currentItem.id);
                      setShowCommentBox(true);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {isRTL ? "لا" : "No"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-32 hover:bg-gray-100 transition-all"
                    onClick={() => setShowCommentBox(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {isRTL ? "تعليق" : "Comment"}
                  </Button>
                </>
              )}
            </div>

            {/* Comment Box */}
            {(showCommentBox || responses[currentItem?.id || ""]?.comment) && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">
                    {isRTL ? "ملاحظات" : "Notes"}
                  </label>
                  <Textarea
                    placeholder={isRTL ? "أضف ملاحظاتك هنا..." : "Add your notes here..."}
                    value={responses[currentItem?.id || ""]?.comment || ""}
                    onChange={(e) => handleComment(e.target.value, currentItem.id)}
                    className="min-h-[80px] border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  />
                </div>
                {responses[currentItem?.id || ""]?.status === "failed" && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-red-600">
                      {isRTL ? "الإجراء المطلوب" : "Action Required"}
                    </label>
                    <Input
                      placeholder={isRTL ? "حدد الإجراء المطلوب" : "Specify required action"}
                      value={responses[currentItem?.id || ""]?.action || ""}
                      onChange={(e) => handleAction(e.target.value, currentItem.id)}
                      className="border-red-200 focus:border-red-300 focus:ring focus:ring-red-100 transition-all"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handlePrevious} className="hover:bg-gray-100 transition-all">
              <ChevronLeft className="h-4 w-4 mr-2" />
              {isRTL ? "السابق" : "Previous"}
            </Button>
            <div className="flex gap-2">
              {currentStep === LIFTING_ACCESSORY_INSPECTION_ITEMS.length - 1 ? (
                <Button
                  onClick={showCompletionReport}
                  disabled={!responses[currentItem?.id || ""]}
                  className="bg-green-600 hover:bg-green-700 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isRTL ? "إنهاء الفحص" : "Complete Inspection"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!responses[currentItem?.id || ""]}
                  className="bg-blue-600 hover:bg-blue-700 transition-all"
                >
                  {isRTL ? "التالي" : "Next"}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex justify-center">
            <div className="flex gap-1 overflow-x-auto py-2">
              {LIFTING_ACCESSORY_INSPECTION_ITEMS.map((item, index) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-8 h-8 p-0 rounded-full",
                    index === currentStep && "bg-blue-100 hover:bg-blue-200",
                    responses[item.id]?.status === "passed" && "bg-green-100 hover:bg-green-200",
                    responses[item.id]?.status === "failed" && "bg-red-100 hover:bg-red-200"
                  )}
                  onClick={() => setCurrentStep(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { LIFTING_ACCESSORY_INSPECTION_ITEMS };