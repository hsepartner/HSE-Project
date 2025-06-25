import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight, FileText, Play, X, Check, AlertTriangle, Eye, CheckCircle2 } from "lucide-react";
import type { PowerTool } from "@/types/power-tools";
import { cn } from "@/lib/utils";
import type { DailyInspection } from "@/types/inspection";
import { useToast } from "@/components/ui/use-toast";

interface InspectionItem {
  id: string;
  image: string;
  title: string;
  description: string;
  titleAr: string;
  descriptionAr: string;
  isRequired: boolean;
  status: "not-checked" | "passed" | "failed";
  comment?: string;
  action?: string;
}

interface PowerToolDailyInspection {
  date: string;
  operatorId: string;
  operatorName: string;
  equipmentId: string;
  toolName: string;
  serialNumber: string;
  manufacturer: string;
  modelNumber: string;
  items: InspectionItem[];
  notes: string;
  status: "completed";
  powerToolId: string;
  nextInspectionDate: string;
}

const INSPECTION_ITEMS: InspectionItem[] = [
  {
    id: "fire-extinguisher",
    image: "/images/fire.png",
    title: "Fire Extinguisher",
    description: "Fire extinguisher available",
    titleAr: "طفاية الحريق",
    descriptionAr: "طفاية الحريق متوفرة",
    isRequired: true,
    status: "not-checked",
  },
  {
    id: "first-aid",
    image: "/images/firstaid.png",
    title: "First Aid Box",
    description: "First aid box available",
    titleAr: "صندوق الإسعافات الأولية",
    descriptionAr: "صندوق الإسعافات الأولية متوفر",
    isRequired: true,
    status: "not-checked",
  },
  {
    id: "oil-check",
    image: "/images/checkoil.png",
    title: "Oil Check",
    description: "Check oil level, no oil leak observed",
    titleAr: "فحص الزيت",
    descriptionAr: "فحص مستوى الزيت، لا يوجد تسرب للزيت",
    isRequired: true,
    status: "not-checked",
  },
  {
    id: "windshield",
    image: "/images/windshield.png",
    title: "Windshield",
    description: "Windshield is clean and free from damages",
    titleAr: "الزجاج الأمامي",
    descriptionAr: "الزجاج الأمامي نظيف وخالي من الأضرار",
    isRequired: true,
    status: "not-checked",
  },
  {
    id: "lights",
    image: "/images/headlights.png",
    title: "Lights",
    description: "Head lights, Indicator lights, brake lights are operational",
    titleAr: "الأضواء",
    descriptionAr: "المصابيح الأمامية، إشارات الانعطاف، أضواء الفرامل تعمل",
    isRequired: true,
    status: "not-checked",
  },
  {
    id: "tires",
    image: "/images/tirecondition.png",
    title: "Tire Condition",
    description: "Tyre condition – FRONT tyre / REAR tyre",
    titleAr: "حالة الإطارات",
    descriptionAr: "حالة الإطارات - الإطارات الأمامية / الخلفية",
    isRequired: true,
    status: "not-checked",
  },
  {
    id: "cabin",
    image: "/images/closedcabin.png",
    title: "Cabin",
    description: "Closed cabin and Air Conditioning is working",
    titleAr: "المقصورة",
    descriptionAr: "المقصورة مغلقة ونظام التكييف يعمل",
    isRequired: true,
    status: "not-checked",
  },
  {
    id: "reverse-alarm",
    image: "/images/reversealarm.png",
    title: "Reverse Alarm",
    description: "Reverse alarm, horn, mirrors are operational",
    titleAr: "إنذار الرجوع للخلف",
    descriptionAr: "إنذار الرجوع للخلف، البوق، المرايا تعمل",
    isRequired: true,
    status: "not-checked",
  },
  {
    id: "hoses",
    image: "/images/housepipes.png",
    title: "Hoses & Pipes",
    description: "Hoses & pipe joints are in good condition",
    titleAr: "الخراطيم والأنابيب",
    descriptionAr: "الخراطيم ووصلات الأنابيب في حالة جيدة",
    isRequired: true,
    status: "not-checked",
  },
  {
    id: "bucket",
    image: "/images/conditinofbucket.png",
    title: "Bucket Condition",
    description: "Condition of buckets (teeth protected)",
    titleAr: "حالة الدلو",
    descriptionAr: "حالة الدلاء (الأسنان محمية)",
    isRequired: true,
    status: "not-checked",
  },
];

interface PowerToolDailyChecklistDialogProps {
  powerTool: PowerTool;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (inspection: DailyInspection) => Promise<void>;
}

export function PowerToolDailyChecklistDialog({
  powerTool,
  open,
  onOpenChange,
  onSubmit,
}: PowerToolDailyChecklistDialogProps) {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(-1);
  const [responses, setResponses] = useState<Record<string, { status?: "passed" | "failed"; action?: string; comment: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showNextInsteadOfNo, setShowNextInsteadOfNo] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "individual" | "lastReport">("list");
  const [project, setProject] = useState("");
  const [company, setCompany] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [month, setMonth] = useState("");
  const [nextInspectionDate, setNextInspectionDate] = useState("");
  const [lastReports, setLastReports] = useState<PowerToolDailyInspection[]>([]);
  const [selectedReportDate, setSelectedReportDate] = useState<string>("");
  const [lastReportLoading, setLastReportLoading] = useState(false);

  const currentItem = currentStep >= 0 ? INSPECTION_ITEMS[currentStep] : null;

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
    const total = INSPECTION_ITEMS.length;
    const completed = Object.keys(responses).length;
    const passed = Object.values(responses).filter((r) => r.status === "passed").length;
    const failed = Object.values(responses).filter((r) => r.status === "failed").length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    return { total, completed, passed, failed, passRate };
  };

  const handleStartInspection = () => {
    if (viewMode === "individual") {
      setCurrentStep(0);
    } else {
      const firstUnchecked = INSPECTION_ITEMS.findIndex(item => !responses[item.id]?.status);
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
      } else if (status === "passed" && currentStep < INSPECTION_ITEMS.length - 1) {
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
    if (currentStep < INSPECTION_ITEMS.length - 1) {
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
      const inspection: PowerToolDailyInspection = {
        date: new Date().toISOString(),
        operatorId: "current-user-id",
        operatorName: powerTool.operatorName || "Unknown Operator",
        equipmentId: powerTool.id,
        toolName: powerTool.toolName,
        serialNumber: powerTool.toolId,
        manufacturer: powerTool.manufacturer,
        modelNumber: powerTool.modelNumber,
        items: Object.entries(responses).map(([id, response]) => ({
          id,
          description: INSPECTION_ITEMS.find(item => item.id === id)?.description || '',
          isRequired: true,
          status: response.status || "not-checked",
          comment: response.comment,
          action: response.action,
        })),
        notes: project,
        status: "completed",
        powerToolId: powerTool.id,
        nextInspectionDate,
      };
      await onSubmit(inspection as DailyInspection);

      const existingReports = JSON.parse(localStorage.getItem(`inspection_reports_${powerTool.id}`) || '[]');
      localStorage.setItem(
        `inspection_reports_${powerTool.id}`,
        JSON.stringify([inspection, ...existingReports])
      );

      setLastReports((prev) => [
        inspection,
        ...prev.filter((report) => report.date !== inspection.date),
      ]);

      toast({
        title: isRTL ? "تم حفظ التقرير" : "Report Saved",
        description: isRTL ? "تم حفظ تقرير الفحص بنجاح" : "The inspection report has been saved successfully",
        variant: "default",
        duration: 3000,
      });

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
    setCompany("");
    setMonth("");
    setIssueDate("");
    setNextInspectionDate("");
    setViewMode("list");
  };

  async function fetchLastInspectionReports(powerToolId: string): Promise<PowerToolDailyInspection[]> {
    const storedReports = JSON.parse(localStorage.getItem(`inspection_reports_${powerToolId}`) || '[]');
    if (storedReports.length > 0) {
      return storedReports;
    }
    return [
      {
        date: "2025-06-20",
        status: "completed",
        items: INSPECTION_ITEMS.map(item => ({
          id: item.id,
          description: item.description,
          isRequired: true,
          status: Math.random() > 0.3 ? "passed" : "failed",
          comment: Math.random() > 0.7 ? "Sample comment" : "",
          action: Math.random() > 0.7 ? "Sample action" : "",
        })),
        equipmentId: powerToolId,
        operatorId: "user-1",
        operatorName: "John Doe",
        toolName: powerTool.toolName,
        serialNumber: powerTool.toolId,
        manufacturer: powerTool.manufacturer,
        modelNumber: powerTool.modelNumber,
        nextInspectionDate: "2025-07-20",
        notes: "Sample project",
        powerToolId: powerToolId,
      },
      {
        date: "2025-06-15",
        status: "completed",
        items: INSPECTION_ITEMS.map(item => ({
          id: item.id,
          description: item.description,
          isRequired: true,
          status: Math.random() > 0.5 ? "passed" : "failed",
          comment: Math.random() > 0.8 ? "Older comment" : "",
          action: Math.random() > 0.8 ? "Older action" : "",
        })),
        equipmentId: powerToolId,
        operatorId: "user-2",
        operatorName: "Jane Doe",
        toolName: powerTool.toolName,
        serialNumber: powerTool.toolId,
        manufacturer: powerTool.manufacturer,
        modelNumber: powerTool.modelNumber,
        nextInspectionDate: "2025-07-15",
        notes: "Another project",
        powerToolId: powerToolId,
      },
    ];
  }

  useEffect(() => {
    if (viewMode === "lastReport" && powerTool.id) {
      setLastReportLoading(true);
      fetchLastInspectionReports(powerTool.id).then((reports) => {
        setLastReports(reports);
        setSelectedReportDate(reports[0]?.date || "");
        setLastReportLoading(false);
      });
    }
  }, [viewMode, powerTool.id]);

  if (!powerTool || !open) return null;

  if (currentStep === -2) {
    const stats = getCompletionStats();
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-[1200px] max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              {isRTL ? "تقرير إكمال الفحص" : "Inspection Completion Report"}
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
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">POWER TOOL DAILY INSPECTION CHECKLIST</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="font-medium">TOOL:</span> {powerTool.toolName}</div>
              <div><span className="font-medium">TOOL ID:</span> {powerTool.toolId}</div>
              <div><span className="font-medium">COMPANY:</span> {company}</div>
              <div><span className="font-medium">MONTH:</span> {month}</div>
              <div><span className="font-medium">ISSUE DATE:</span> {issueDate}</div>
              <div><span className="font-medium">PROJECT:</span> {project}</div>
            </div>
          </div>
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
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">{isRTL ? "معلومات الأداة" : "Tool Information"}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="font-medium">{isRTL ? "اسم الأداة:" : "Tool Name:"}</span> {powerTool.toolName}</div>
              <div><span className="font-medium">{isRTL ? "رقم الأداة:" : "Tool ID:"}</span> {powerTool.toolId}</div>
              <div><span className="font-medium">{isRTL ? "المشروع:" : "Project:"}</span> {project}</div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">{isRTL ? "النتائج التفصيلية" : "Detailed Results"}</h3>
            {stats.failed > 0 && (
              <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                  <X className="h-5 w-5" />
                  {isRTL ? "العناصر الفاشلة" : "Failed Items"}
                </h4>
                <div className="space-y-3">
                  {INSPECTION_ITEMS.filter(item => responses[item.id]?.status === "failed").map(item => (
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
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                {isRTL ? "العناصر الناجحة" : "Passed Items"}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INSPECTION_ITEMS.filter(item => responses[item.id]?.status === "passed").map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <img src={item.image} alt="" className="w-8 h-8 object-cover rounded" />
                    <span className="text-sm">{isRTL ? item.titleAr : item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

  if (viewMode === "lastReport") {
    const selectedReport = lastReports.find(report => report.date === selectedReportDate);
    const stats = selectedReport && selectedReport.items ? {
      total: INSPECTION_ITEMS.length,
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
              {isRTL ? "آخر تقرير فحص" : "Last Inspection Report"}
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
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">POWER TOOL DAILY INSPECTION CHECKLIST</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div><span className="font-medium">TOOL:</span> {selectedReport.toolName}</div>
                      <div><span className="font-medium">TOOL ID:</span> {selectedReport.serialNumber}</div>
                      <div><span className="font-medium">COMPANY:</span> {selectedReport.manufacturer}</div>
                      <div><span className="font-medium">MONTH:</span> {new Date(selectedReport.date).toLocaleString('default', { month: 'long' })}</div>
                      <div><span className="font-medium">ISSUE DATE:</span> {selectedReport.date.split('T')[0]}</div>
                      <div><span className="font-medium">PROJECT:</span> {selectedReport.notes}</div>
                    </div>
                  </div>
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
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">{isRTL ? "معلومات الأداة" : "Tool Information"}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div><span className="font-medium">{isRTL ? "اسم الأداة:" : "Tool Name:"}</span> {selectedReport.toolName}</div>
                      <div><span className="font-medium">{isRTL ? "رقم الأداة:" : "Tool ID:"}</span> {selectedReport.serialNumber}</div>
                      <div><span className="font-medium">{isRTL ? "المشروع:" : "Project:"}</span> {selectedReport.notes}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">{isRTL ? "النتائج التفصيلية" : "Detailed Results"}</h3>
                    {stats.failed > 0 && (
                      <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                          <X className="h-5 w-5" />
                          {isRTL ? "العناصر الفاشلة" : "Failed Items"}
                        </h4>
                        <div className="space-y-3">
                          {INSPECTION_ITEMS.filter(item => {
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
                    <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        {isRTL ? "العناصر الناجحة" : "Passed Items"}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {INSPECTION_ITEMS.filter(item => {
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
              <div className="text-xs text-gray-500 text-center pt-4 border-t mt-6">
                ESPEC-HSE-F09 Issue Date: 17-5-2021 Rev. No. 03
              </div>
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

  if (currentStep === -1) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-[1400px] max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl bg-white">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              POWER TOOL DAILY INSPECTION CHECKLIST
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setLastReportLoading(true);
                  fetchLastInspectionReports(powerTool.id).then((reports) => {
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
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">TOOL:</label>
                <Input value={powerTool.toolName} disabled className="mt-1 border-gray-300" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">TOOL ID:</label>
                <Input value={powerTool.toolId} disabled className="mt-1 border-gray-300" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">COMPANY:</label>
                <Input
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  placeholder="Enter company"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">MONTH:</label>
                <Input
                  type="month"
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  placeholder="Select month"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">ISSUE DATE:</label>
                <Input
                  type="date"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  placeholder="Select issue date"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">PROJECT:</label>
                <Input
                  value={project}
                  onChange={e => setProject(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  placeholder="Enter project name"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {INSPECTION_ITEMS.map((item) => (
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
          <div className="bg-blue-50 p-4 rounded-lg mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-800">{isRTL ? "ملخص التقدم" : "Progress Summary"}</h4>
              <span className="text-sm text-gray-500">
                {Object.keys(responses).length} / {INSPECTION_ITEMS.length} {isRTL ? "مكتمل" : "completed"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.keys(responses).length / INSPECTION_ITEMS.length) * 100}%`,
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
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleReset} className="hover:bg-gray-100 transition-all">
              {isRTL ? "إعادة تعيين" : "Reset"}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-gray-100 transition-all">
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              {Object.keys(responses).length === INSPECTION_ITEMS.length ? (
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
          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            ESPEC-HSE-F09 Issue Date: 17-5-2021 Rev. No. 03
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[800px] max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl bg-white">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {isRTL ? "الفحص اليومي" : "Daily Inspection"}
              <span className="text-sm text-gray-500 ml-2">
                {currentStep + 1} / {INSPECTION_ITEMS.length}
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
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{isRTL ? "الأداة:" : "Tool:"}</span>
                <span className="font-medium ml-2">{powerTool.toolName}</span>
              </div>
              <div>
                <span className="text-gray-600">{isRTL ? "رقم الأداة:" : "Tool ID:"}</span>
                <span className="font-medium ml-2">{powerTool.toolId}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-800">{isRTL ? "التقدم" : "Progress"}</span>
              <span className="text-gray-500">{Math.round(((currentStep + 1) / INSPECTION_ITEMS.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / INSPECTION_ITEMS.length) * 100}%`,
                }}
              />
            </div>
          </div>
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
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handlePrevious} className="hover:bg-gray-100 transition-all">
              <ChevronLeft className="h-4 w-4 mr-2" />
              {isRTL ? "السابق" : "Previous"}
            </Button>
            <div className="flex gap-2">
              {currentStep === INSPECTION_ITEMS.length - 1 ? (
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
          <div className="flex justify-center">
            <div className="flex gap-1 overflow-x-auto py-2">
              {INSPECTION_ITEMS.map((item, index) => (
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

export { INSPECTION_ITEMS };