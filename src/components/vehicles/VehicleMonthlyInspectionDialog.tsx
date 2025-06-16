import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Vehicle } from "@/types/vehicle";
import { InspectionItem } from "@/types/inspection";
import { VehicleMonthlyInspection } from "@/types/vehicleInspection";
import { cn } from "@/lib/utils";

const INSPECTION_ITEMS = [
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

interface MonthlyInspectionDialogProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (inspection: VehicleMonthlyInspection) => Promise<void>;
}

export function MonthlyInspectionDialog({
  vehicle,
  open,
  onOpenChange,
  onSubmit
}: MonthlyInspectionDialogProps) {
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
  const [nextInspectionDate, setNextInspectionDate] = useState('');
  const [lastInspectionDate, setLastInspectionDate] = useState('');
  const [mileage, setMileage] = useState('');

  const currentItem = INSPECTION_ITEMS[currentStep];

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
    } else if (status === 'passed' && currentStep < INSPECTION_ITEMS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowNextInsteadOfNo(false);
    }
  };

  const handleComment = (comment: string) => {
    setResponses(prev => ({
      ...prev,
      [currentItem.id]: { ...prev[currentItem.id], comment }
    }));
  };

  const handleNext = () => {
    if (currentStep < INSPECTION_ITEMS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowNextInsteadOfNo(false);
    } else {
      // Submit inspection
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowNextInsteadOfNo(false);
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

      const inspection: VehicleMonthlyInspection = {
        date: new Date().toISOString(),
        technicianId: 'current-user-id',
        technicianName: vehicle?.assignedTo || 'Unknown Technician',
        items: Object.entries(responses).map(([id, response]) => {
          const item = INSPECTION_ITEMS.find(i => i.id === id);
          return {
            id,
            description: item?.description || '',
            isRequired: true,
            status: response.status || 'not-checked',
            comment: response.comment
          };
        }),
        status: 'completed',
        vehicleId: vehicle?.id || '',
        mileage: Number(mileage),
        nextInspectionDate,
        notes: ''
      };

      await onSubmit(inspection);
      onOpenChange(false);
      setCurrentStep(0);
      setResponses({});
      setShowNextInsteadOfNo(false);
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
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-screen overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            {isRTL ? "الفحص الشهري" : "Monthly Inspection"}
            <span className="text-sm text-muted-foreground ml-2">
              {currentStep + 1} / {INSPECTION_ITEMS.length}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 pb-4">
          {/* Equipment Info */}
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-muted-foreground mb-1 sm:mb-0">
                  {isRTL ? "المركبة:" : "Vehicle:"}
                </span>
                <span className="font-medium sm:ml-2">{vehicle?.name || 'N/A'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-muted-foreground mb-1 sm:mb-0">
                  {isRTL ? "رقم اللوحة:" : "Plate No:"}
                </span>
                <span className="font-medium sm:ml-2">{vehicle?.plateNumber || 'N/A'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-muted-foreground mb-1 sm:mb-0">
                  {isRTL ? "عداد المسافات:" : "Mileage:"}
                </span>
                <Input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="w-full sm:w-40 sm:ml-2"
                  placeholder={isRTL ? "أدخل قراءة عداد المسافات" : "Enter mileage"}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-muted-foreground mb-1 sm:mb-0">
                  {isRTL ? "الفحص الأخير:" : "Last Inspection:"}
                </span>
                <Input
                  type="date"
                  value={lastInspectionDate}
                  onChange={(e) => setLastInspectionDate(e.target.value)}
                  className="w-full sm:w-40 sm:ml-2"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-muted-foreground mb-1 sm:mb-0">
                  {isRTL ? "الفحص القادم:" : "Next Inspection:"}
                </span>
                <Input
                  type="date"
                  value={nextInspectionDate}
                  onChange={(e) => setNextInspectionDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full sm:w-40 sm:ml-2"
                />
              </div>
            </div>
          </div>

          {/* Inspection Item */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex justify-center">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="h-32 sm:h-40 md:h-48 object-contain"
              />
            </div>
            <div className="px-2">
              <h3 className="text-base sm:text-lg font-semibold">
                {isRTL ? currentItem.titleAr : currentItem.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isRTL ? currentItem.descriptionAr : currentItem.description}
              </p>
            </div>
          </div>

          {/* Response Buttons */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-center gap-3 sm:gap-4">
              <Button
                variant={responses[currentItem.id]?.status === 'passed' ? 'default' : 'outline'}
                className={cn(
                  "w-24 sm:w-32",
                  responses[currentItem.id]?.status === 'passed' && "bg-green-600"
                )}
                onClick={() => handleResponse('passed')}
              >
                {isRTL ? "نعم" : "Yes"}
              </Button>
              {showNextInsteadOfNo ? (
                <Button
                  variant="outline"
                  className="w-24 sm:w-32"
                  onClick={handleNext}
                >
                  {isRTL ? "التالي" : "Next"}
                </Button>
              ) : (
                <Button
                  variant={responses[currentItem.id]?.status === 'failed' ? 'destructive' : 'outline'}
                  className="w-24 sm:w-32"
                  onClick={() => handleResponse('failed')}
                >
                  {isRTL ? "لا" : "No"}
                </Button>
              )}
            </div>

            {/* Comment Box - Always Visible */}
            <div className="px-2">
              <Textarea
                placeholder={isRTL ? "أضف تعليقًا..." : "Add a comment..."}
                value={responses[currentItem.id]?.comment || ''}
                onChange={(e) => handleComment(e.target.value)}
                className="min-h-[80px] sm:min-h-[100px] resize-none"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mx-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Navigation Buttons - Sticky Footer */}
        <div className="sticky bottom-0 bg-background border-t pt-4 mt-4">
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1 sm:flex-none"
            >
              <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">{isRTL ? "السابق" : "Previous"}</span>
            </Button>
            {currentStep === INSPECTION_ITEMS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(responses).length !== INSPECTION_ITEMS.length}
                className="flex-1 sm:flex-none min-w-[120px]"
              >
                <span className="text-sm sm:text-base">
                  {isRTL ? "إنهاء الفحص" : "Complete Inspection"}
                </span>
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!responses[currentItem.id]}
                className="flex-1 sm:flex-none"
              >
                <span className="text-sm sm:text-base">{isRTL ? "التالي" : "Next"}</span>
                <ChevronRight className="h-4 w-4 ml-1 sm:ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}