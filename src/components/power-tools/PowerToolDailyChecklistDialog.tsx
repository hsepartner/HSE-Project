import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/use-language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight, MessageSquare, CheckCircle2 } from "lucide-react";
import { PowerTool } from "@/types/equipment";
import { cn } from "@/lib/utils";

interface InspectionItem {
  id: string;
  description: string;
  isRequired: boolean;
  status: "not-checked" | "passed" | "failed";
  comment?: string; // Add comment field to support per-item comments
}

interface PowerToolDailyInspection {
  date: string;
  operatorId: string;
  operatorName: string;
  items: InspectionItem[];
  notes: string;
  status: "completed";
  powerToolId: string;
}

// Define inspection items with images and bilingual descriptions
const INSPECTION_ITEMS = [
  {
    id: "fire-extinguisher",
    image: "/images/fire.png",
    title: "Fire Extinguisher",
    description: "Fire extinguisher available",
    titleAr: "طفاية الحريق",
    descriptionAr: "طفاية الحريق متوفرة",
  },
  {
    id: "first-aid",
    image: "/images/firstaid.png",
    title: "First Aid Box",
    description: "First aid box available",
    titleAr: "صندوق الإسعافات الأولية",
    descriptionAr: "صندوق الإسعافات الأولية متوفر",
  },
  {
    id: "oil-check",
    image: "/images/checkoil.png",
    title: "Oil Check",
    description: "Check oil level, no oil leak observed",
    titleAr: "فحص الزيت",
    descriptionAr: "فحص مستوى الزيت، لا يوجد تسرب للزيت",
  },
  {
    id: "windshield",
    image: "/images/windshield.png",
    title: "Windshield",
    description: "Windshield is clean and free from damages",
    titleAr: "الزجاج الأمامي",
    descriptionAr: "الزجاج الأمامي نظيف وخالي من الأضرار",
  },
  {
    id: "lights",
    image: "/images/headlights.png",
    title: "Lights",
    description: "Head lights, Indicator lights, break lights are operational",
    titleAr: "الأضواء",
    descriptionAr: "المصابيح الأمامية، إشارات الانعطاف، أضواء الفرامل تعمل",
  },
  {
    id: "tires",
    image: "/images/tirecondition.png",
    title: "Tire Condition",
    description: "Tyre condition – FRONT tyre / REAR tyre",
    titleAr: "حالة الإطارات",
    descriptionAr: "حالة الإطارات - الإطارات الأمامية / الخلفية",
  },
  {
    id: "cabin",
    image: "/images/closedcabin.png",
    title: "Cabin",
    description: "Closed cabin and Air Conditioning is working",
    titleAr: "المقصورة",
    descriptionAr: "المقصورة مغلقة ونظام التكييف يعمل",
  },
  {
    id: "reverse-alarm",
    image: "/images/reversealarm.png",
    title: "Reverse Alarm",
    description: "Reverse alarm, horn, mirrors are operational",
    titleAr: "إنذار الرجوع للخلف",
    descriptionAr: "إنذار الرجوع للخلف، البوق، المرايا تعمل",
  },
  {
    id: "hoses",
    image: "/images/housepipes.png",
    title: "Hoses & Pipes",
    description: "Hoses & pipe joints are in good condition",
    titleAr: "الخراطيم والأنابيب",
    descriptionAr: "الخراطيم ووصلات الأنابيب في حالة جيدة",
  },
  {
    id: "bucket",
    image: "/images/conditinofbucket.png",
    title: "Bucket Condition",
    description: "Condition of buckets (teeth protected)",
    titleAr: "حالة الدلو",
    descriptionAr: "حالة الدلاء (الأسنان محمية)",
  },
];

interface PowerToolDailyChecklistDialogProps {
  powerTool: PowerTool;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (inspection: PowerToolDailyInspection) => Promise<void>;
}

export function PowerToolDailyChecklistDialog({
  powerTool,
  open,
  onOpenChange,
  onSubmit,
}: PowerToolDailyChecklistDialogProps) {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<
    Record<string, { status?: "passed" | "failed"; comment: string }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const currentItem = INSPECTION_ITEMS[currentStep];

  // Handle status change for the current item
  const handleResponse = (status: "passed" | "failed") => {
    setResponses((prev) => ({
      ...prev,
      [currentItem.id]: {
        status,
        comment: prev[currentItem.id]?.comment || "",
      },
    }));
  };

  // Handle comment input for the current item
  const handleComment = (comment: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentItem.id]: {
        status: prev[currentItem.id]?.status,
        comment,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < INSPECTION_ITEMS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setIsCommentOpen(false); // Close comment section when moving to next item
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setIsCommentOpen(false); // Close comment section when moving to previous item
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      // Validate that all required items have a status
      const uncheckedRequired = INSPECTION_ITEMS.filter(
        (item) => item.isRequired && !responses[item.id]?.status
      );

      if (uncheckedRequired.length > 0) {
        setError(
          isRTL
            ? "يرجى إكمال جميع العناصر المطلوبة قبل التقديم"
            : "Please complete all required items before submitting"
        );
        return;
      }

      const inspection: PowerToolDailyInspection = {
        date: new Date().toISOString(),
        operatorId: "current-user-id",
        operatorName: powerTool.operatorName || "Unknown Operator",
        items: INSPECTION_ITEMS.map((item) => ({
          id: item.id,
          description: item.description,
          status: responses[item.id]?.status || "not-checked",
          isRequired: item.isRequired,
          comment: responses[item.id]?.comment || "",
        })),
        notes: "", // Set to empty string to align with DailyChecklistDialog
        status: "completed",
        powerToolId: powerTool.id,
      };

      await onSubmit(inspection);
      onOpenChange(false);
      setCurrentStep(0);
      setResponses({});
      setIsCommentOpen(false);
    } catch (err) {
      setError(
        isRTL
          ? "حدث خطأ أثناء حفظ قائمة التحقق"
          : "An error occurred while saving the checklist"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!powerTool) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isRTL ? "قائمة التحقق اليومية للأدوات الكهربائية" : "Power Tool Daily Inspection"}
            <span className="text-sm text-muted-foreground ml-2">
              {currentStep + 1} / {INSPECTION_ITEMS.length}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Power Tool Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">
                  {isRTL ? "الأداة:" : "Tool:"}
                </span>
                <span className="font-medium ml-2">{powerTool.toolName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {isRTL ? "رقم الأداة:" : "Tool ID:"}
                </span>
                <span className="font-medium ml-2">{powerTool.toolId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {isRTL ? "الموديل:" : "Model:"}
                </span>
                <span className="font-medium ml-2">{powerTool.modelNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {isRTL ? "المصنع:" : "Manufacturer:"}
                </span>
                <span className="font-medium ml-2">{powerTool.manufacturer}</span>
              </div>
            </div>
          </div>

          {/* Inspection Item */}
          <div className="text-center space-y-4">
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="mx-auto h-48 object-contain"
            />
            <div>
              <h3 className="text-lg font-semibold">
                {isRTL ? currentItem.titleAr : currentItem.title}
              </h3>
              <p className="text-muted-foreground">
                {isRTL ? currentItem.descriptionAr : currentItem.description}
              </p>
            </div>
          </div>

          {/* Response Buttons */}
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <Button
                variant={responses[currentItem.id]?.status === "passed" ? "default" : "outline"}
                className={cn(
                  "w-32",
                  responses[currentItem.id]?.status === "passed" && "bg-green-600"
                )}
                onClick={() => handleResponse("passed")}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {isRTL ? "نعم" : "Yes"}
              </Button>
              <Button
                variant={responses[currentItem.id]?.status === "failed" ? "destructive" : "outline"}
                className="w-32"
                onClick={() => handleResponse("failed")}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                {isRTL ? "لا" : "No"}
              </Button>
            </div>

            {/* Add Comment Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCommentOpen(!isCommentOpen)}
                className="text-muted-foreground"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {isRTL ? "إضافة تعليق" : "Add Comment"}
              </Button>
            </div>

            {/* Comment Box */}
            {isCommentOpen && (
              <div className="space-y-2">
                <Textarea
                  placeholder={isRTL ? "أضف تعليقًا..." : "Add a comment..."}
                  value={responses[currentItem.id]?.comment || ""}
                  onChange={(e) => handleComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {isRTL ? "السابق" : "Previous"}
            </Button>
            {currentStep === INSPECTION_ITEMS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  Object.keys(responses).length !== INSPECTION_ITEMS.length
                }
              >
                {isRTL ? "إنهاء الفحص" : "Complete Inspection"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!responses[currentItem.id]?.status}
              >
                {isRTL ? "التالي" : "Next"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}