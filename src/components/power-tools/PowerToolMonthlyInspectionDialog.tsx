import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { MonthlyInspection, InspectionItem } from "@/types/inspection";
import type { PowerTool } from "@/types/power-tools";
import { cn } from "@/lib/utils";

// Using the same inspection items as MonthlyInspectionDialog
const POWER_TOOL_INSPECTION_ITEMS = [
  {
    id: "driving-license",
    image: "/images/driving_license_check.png",
    title: "Valid Driving License",
    description: "Check if operator has valid driving license",
    titleAr: "رخصة قيادة سارية",
    descriptionAr: "تحقق من امتلاك المشغل لرخصة قيادة سارية",
    isRequired: true,
  },
  {
    id: "calibration",
    image: "/images/calibration_certificate.png",
    title: "Valid 3rd Party Calibration Certificate",
    description: "Verify calibration certificate validity",
    titleAr: "شهادة معايرة سارية من طرف ثالث",
    descriptionAr: "التحقق من صلاحية شهادة المعايرة",
    isRequired: true,
  },
  {
    id: "operator-competency",
    image: "/images/operator_competency.png",
    title: "Driver Competency Verification",
    description: "Ensure operator competency",
    titleAr: "التحقق من كفاءة السائق",
    descriptionAr: "ضمان كفاءة المشغل",
    isRequired: true,
  },
  {
    id: "cab-interior",
    image: "/images/cab_interior_seats_seatbelts.png",
    title: "Cab Cleanliness, Seats and Seatbelts",
    description: "Inspect cab cleanliness and seatbelts",
    titleAr: "نظافة الكابينة والمقاعد وأحزمة الأمان",
    descriptionAr: "فحص نظافة الكابينة وأحزمة الأمان",
    isRequired: true,
  },
  {
    id: "cab-glass",
    image: "/images/cab_glass_mirrors.png",
    title: "Glass Cab and Rear Mirror",
    description: "Check cab glass and mirrors condition",
    titleAr: "زجاج الكابينة والمرايا الخلفية",
    descriptionAr: "فحص حالة الزجاج والمرايا",
    isRequired: true,
  },
  {
    id: "control-levers",
    image: "/images/control_levers_joysticks.png",
    title: "Control Levers",
    description: "Test control levers functionality",
    titleAr: "عناصر التحكم (الرافعات)",
    descriptionAr: "اختبار عمل الرافعات",
    isRequired: true,
  },
  {
    id: "handbrake",
    image: "/images/handbrake_parking_brake.png",
    title: "Hand Brake",
    description: "Ensure hand brake is functional",
    titleAr: "فرامل اليد",
    descriptionAr: "التأكد من أن فرامل اليد تعمل",
    isRequired: true,
  },
  {
    id: "fire-extinguisher",
    image: "/images/fire_extinguisher_safety.png",
    title: "Fire Extinguisher",
    description: "Check fire extinguisher presence and status",
    titleAr: "طفاية حريق",
    descriptionAr: "التحقق من وجود طفاية الحريق وصلاحيتها",
    isRequired: true,
  },
  {
    id: "warning-devices",
    image: "/images/warning_devices_horn_lights.png",
    title: "Warning Devices – Horn, Back Alarm and Traffic Lights",
    description: "Test warning devices like horn and alarms",
    titleAr: "أجهزة التحذير – البوق، إنذار الرجوع، إشارات المرور",
    descriptionAr: "اختبار أجهزة التحذير مثل البوق والإنذارات",
    isRequired: true,
  },
  {
    id: "warning-signs",
    image: "/images/safety_warning_signs.png",
    title: "Warning Signs",
    description: "Inspect safety warning signs",
    titleAr: "لافتات التحذير",
    descriptionAr: "فحص لافتات السلامة التحذيرية",
    isRequired: true,
  },
  {
    id: "brakes",
    image: "/images/brake_system_inspection.png",
    title: "Brakes",
    description: "Inspect braking system",
    titleAr: "الفرامل",
    descriptionAr: "فحص نظام الفرامل",
    isRequired: true,
  },
  {
    id: "motor-condition",
    image: "/images/engine_motor_condition.png",
    title: "Motor Condition",
    description: "Check engine/motor condition",
    titleAr: "حالة المحرك",
    descriptionAr: "التحقق من حالة المحرك",
    isRequired: true,
  },
  {
    id: "hydraulic-system",
    image: "/images/hydraulic_system_check.png",
    title: "Hydraulic System",
    description: "Inspect hydraulic system",
    titleAr: "نظام الهيدروليك",
    descriptionAr: "فحص نظام الهيدروليك",
    isRequired: true,
  },
  {
    id: "hydraulic-leaks",
    image: "/images/hydraulic_links_leak_check.png",
    title: "No Leak in Links",
    description: "Ensure hydraulic links are leak-free",
    titleAr: "عدم وجود تسرب في الوصلات",
    descriptionAr: "التحقق من عدم تسرب الزيت في الوصلات",
    isRequired: true,
  },
  {
    id: "bucket-components",
    image: "/images/bucket_axles_joints.png",
    title: "Equipment Components - Bucket, Axes and Joints",
    description: "Check bucket, axles, and joints",
    titleAr: "مكونات المعدات - الدلو، المحاور، والوصلات",
    descriptionAr: "فحص الدلو والمحاور والوصلات",
    isRequired: true,
  },
  {
    id: "access-platforms",
    image: "/images/safety_access_platforms.png",
    title: "Access Platforms",
    description: "Inspect access platforms for safety",
    titleAr: "منصات الوصول",
    descriptionAr: "فحص منصات الوصول من حيث السلامة",
    isRequired: true,
  },
  {
    id: "tires-trackpads",
    image: "/images/tires_tracks_condition.png",
    title: "Tires / Track Pads Condition",
    description: "Check tires or track pads condition",
    titleAr: "حالة الإطارات / وسائد الجنزير",
    descriptionAr: "فحص حالة الإطارات أو وسائد الجنزير",
    isRequired: true,
  },
  {
    id: "outriggers",
    image: "/images/outriggers_stabilizers.png",
    title: "Outriggers",
    description: "Inspect outriggers or stabilizers",
    titleAr: "الدعامات الجانبية",
    descriptionAr: "فحص الدعامات أو المثبتات",
    isRequired: true,
  },
];

interface PowerToolMonthlyInspection {
  date: string;
  technicianId: string;
  technicianName: string;
  equipmentId: string;
  toolName: string;
  serialNumber: string;
  manufacturer: string;
  modelNumber: string;
  items: InspectionItem[];
  status: 'completed';
  powerToolId: string;
  nextInspectionDate: string;
  notes: string;
}

interface PowerToolMonthlyInspectionDialogProps {
  powerTool: PowerTool;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (inspection: MonthlyInspection) => Promise<void>;
}

export function PowerToolMonthlyInspectionDialog({
  powerTool,
  open,
  onOpenChange,
  onSubmit
}: PowerToolMonthlyInspectionDialogProps) {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, {
    status?: 'passed' | 'failed';
    comment: string;
  }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showNextInsteadOfNo, setShowNextInsteadOfNo] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [nextInspectionDate, setNextInspectionDate] = useState('');
  const [lastInspectionDate, setLastInspectionDate] = useState('');

  const currentItem = POWER_TOOL_INSPECTION_ITEMS[currentStep];

  const handleResponse = (status: 'passed' | 'failed') => {
    setResponses(prev => ({
      ...prev,
      [currentItem.id]: {
        status,
        comment: prev[currentItem.id]?.comment || ''
      }
    }));

    if (status === 'failed') {
      setShowNextInsteadOfNo(true);
      setShowCommentBox(true);
    } else if (status === 'passed' && currentStep < POWER_TOOL_INSPECTION_ITEMS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowNextInsteadOfNo(false);
      setShowCommentBox(false);
    }
  };

  const handleComment = (comment: string) => {
    setResponses(prev => ({
      ...prev,
      [currentItem.id]: { ...prev[currentItem.id], comment }
    }));
  };

  const handleNext = () => {
    if (currentStep < POWER_TOOL_INSPECTION_ITEMS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowCommentBox(false);
    } else {
      // Submit inspection
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowCommentBox(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      if (!nextInspectionDate) {
        setError(isRTL 
          ? 'يرجى تحديد تاريخ الفحص القادم'
          : 'Please set the next inspection date'
        );
        return;
      }

      const inspection: PowerToolMonthlyInspection = {
        date: new Date().toISOString(),
        technicianId: 'current-user-id',
        technicianName: 'Current Technician', // This should come from auth context
        equipmentId: powerTool.id,
        toolName: powerTool.toolName,
        serialNumber: powerTool.toolId,
        manufacturer: powerTool.manufacturer,
        modelNumber: powerTool.modelNumber,
        items: Object.entries(responses).map(([id, response]) => ({
          id,
          status: response.status || 'not-checked',
          comment: response.comment,
          description: POWER_TOOL_INSPECTION_ITEMS.find(item => item.id === id)?.description || '',
          isRequired: true, // Assuming all monthly inspection items are required
        })),
        status: 'completed',
        powerToolId: powerTool.id,
        nextInspectionDate,
        notes: ''
      };

      await onSubmit(inspection);
      onOpenChange(false);
      setCurrentStep(0);
      setResponses({});
      setShowNextInsteadOfNo(false);
      setShowCommentBox(false);
    } catch (err) {
      setError(isRTL 
        ? 'حدث خطأ أثناء حفظ الفحص'
        : 'An error occurred while saving the inspection'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isRTL ? "الفحص الشهري للأدوات الكهربائية" : "Power Tool Monthly Inspection"}
            <span className="text-sm text-muted-foreground ml-2">
              {currentStep + 1} / {POWER_TOOL_INSPECTION_ITEMS.length}
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
                  {isRTL ? "الفحص الأخير:" : "Last Inspection:"}
                </span>
                <Input
                  type="date"
                  value={lastInspectionDate}
                  onChange={(e) => setLastInspectionDate(e.target.value)}
                  className="inline-block w-40 ml-2"
                />
              </div>
              <div>
                <span className="text-muted-foreground">
                  {isRTL ? "الفحص القادم:" : "Next Inspection:"}
                </span>
                <Input
                  type="date"
                  value={nextInspectionDate}
                  onChange={(e) => setNextInspectionDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="inline-block w-40 ml-2"
                />
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
                variant={responses[currentItem.id]?.status === 'passed' ? 'default' : 'outline'}
                className={cn("w-32", responses[currentItem.id]?.status === 'passed' && "bg-green-600")}
                onClick={() => handleResponse('passed')}
              >
                {isRTL ? "نعم" : "Yes"}
              </Button>
              {showNextInsteadOfNo ? (
                <Button
                  variant="outline"
                  className="w-32"
                  onClick={handleNext}
                >
                  {isRTL ? "التالي" : "Next"}
                </Button>
              ) : (
                <>
                  <Button
                    variant={responses[currentItem.id]?.status === 'failed' ? 'destructive' : 'outline'}
                    className="w-32"
                    onClick={() => handleResponse('failed')}
                  >
                    {isRTL ? "لا" : "No"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-32"
                    onClick={() => setShowCommentBox(true)}
                  >
                    {isRTL ? "تعليق" : "Comment"}
                  </Button>
                </>
              )}
            </div>

            {/* Comment Box */}
            {showCommentBox && (
              <div className="space-y-2">
                <Textarea
                  placeholder={isRTL ? "أضف تعليقًا..." : "Add a comment..."}
                  value={responses[currentItem.id]?.comment || ''}
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
            {currentStep === POWER_TOOL_INSPECTION_ITEMS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(responses).length !== POWER_TOOL_INSPECTION_ITEMS.length}
              >
                {isRTL ? "إنهاء الفحص" : "Complete Inspection"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!responses[currentItem.id]}
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