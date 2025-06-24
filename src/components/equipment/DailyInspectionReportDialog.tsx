import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, X, FileText } from "lucide-react";
import { DailyInspection } from "@/types/inspection";
import { Equipment } from "@/types/equipment";
import { useLanguage } from "@/hooks/use-language";

// Import the same INSPECTION_ITEMS as in DailyChecklistDialog
import { INSPECTION_ITEMS as DAILY_ITEMS } from "./DailyChecklistDialog";

interface DailyInspectionReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: DailyInspection;
  equipment: Equipment;
  headerFields?: {
    machinery?: string;
    trafficPlateNumber?: string;
    company?: string;
    month?: string;
    issueDate?: string;
    project?: string;
  };
}

export function DailyInspectionReportDialog({
  open,
  onOpenChange,
  inspection,
  equipment,
  headerFields = {},
}: DailyInspectionReportDialogProps) {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";

  // Map responses by id for easy lookup
  const responses = Object.fromEntries(
    inspection.items.map((item) => [item.id, item])
  );

  const stats = {
    total: DAILY_ITEMS.length,
    passed: inspection.items.filter((i) => i.status === "passed").length,
    failed: inspection.items.filter((i) => i.status === "failed").length,
    passRate:
      DAILY_ITEMS.length > 0
        ? Math.round(
            (inspection.items.filter((i) => i.status === "passed").length /
              DAILY_ITEMS.length) *
              100
          )
        : 0,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-screen-lg max-h-[90vh] overflow-y-auto p-0 rounded-2xl shadow-2xl bg-white border border-gray-200">
        <DialogHeader className="sticky top-0 z-10 bg-white px-8 pt-8 pb-4 border-b border-gray-100 rounded-t-2xl">
          <DialogTitle className="flex items-center gap-3 text-3xl font-extrabold text-gray-900">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
            {isRTL ? "تقرير الفحص اليومي" : "Daily Inspection Report"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 pb-8 pt-2">
          {/* Checklist Header Fields */}
          <section className="bg-gray-50 p-6 rounded-xl mb-8 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-xl mb-4 text-gray-800 tracking-wide">DAILY MACHINERY INSPECTION CHECKLIST</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-sm">
              <div><span className="font-medium text-gray-600">MACHINERY:</span> <span className="text-gray-900">{headerFields.machinery}</span></div>
              <div><span className="font-medium text-gray-600">TRAFFIC PLATE NUMBER:</span> <span className="text-gray-900">{headerFields.trafficPlateNumber}</span></div>
              <div><span className="font-medium text-gray-600">COMPANY:</span> <span className="text-gray-900">{headerFields.company}</span></div>
              <div><span className="font-medium text-gray-600">MONTH:</span> <span className="text-gray-900">{headerFields.month}</span></div>
              <div><span className="font-medium text-gray-600">ISSUE DATE:</span> <span className="text-gray-900">{headerFields.issueDate}</span></div>
              <div><span className="font-medium text-gray-600">PROJECT:</span> <span className="text-gray-900">{headerFields.project}</span></div>
            </div>
          </section>

          {/* Overall Statistics */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { value: stats.total, label: isRTL ? "إجمالي العناصر" : "Total Items", color: "blue", icon: <FileText className="h-6 w-6" /> },
              { value: stats.passed, label: isRTL ? "نجح" : "Passed", color: "green", icon: <CheckCircle2 className="h-6 w-6" /> },
              { value: stats.failed, label: isRTL ? "فشل" : "Failed", color: "red", icon: <X className="h-6 w-6" /> },
              { value: `${stats.passRate}%`, label: isRTL ? "معدل النجاح" : "Pass Rate", color: "purple", icon: <CheckCircle2 className="h-6 w-6" /> },
            ].map((stat, index) => (
              <div key={index} className={`flex flex-col items-center justify-center bg-${stat.color}-50 p-6 rounded-xl shadow border border-${stat.color}-100 transition-shadow`}>
                <div className={`mb-2 text-${stat.color}-600`}>{stat.icon}</div>
                <div className={`text-3xl font-extrabold text-${stat.color}-700`}>{stat.value}</div>
                <div className={`text-base text-${stat.color}-800 mt-1 font-medium`}>{stat.label}</div>
              </div>
            ))}
          </section>

          {/* Equipment Information */}
          <section className="bg-gray-50 p-6 rounded-xl mb-8 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-xl mb-4 text-gray-800">{isRTL ? "معلومات المعدات" : "Equipment Information"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-sm">
              <div><span className="font-medium text-gray-600">{isRTL ? "اسم المعدة:" : "Equipment Name:"}</span> <span className="text-gray-900">{equipment.name}</span></div>
              <div><span className="font-medium text-gray-600">{isRTL ? "الرقم التسلسلي:" : "Serial Number:"}</span> <span className="text-gray-900">{equipment.serialNumber}</span></div>
              <div><span className="font-medium text-gray-600">{isRTL ? "المشروع:" : "Project:"}</span> <span className="text-gray-900">{headerFields.project}</span></div>
            </div>
          </section>

          {/* Detailed Results */}
          <section className="space-y-6">
            <h3 className="font-semibold text-xl text-gray-800 mb-2">{isRTL ? "النتائج التفصيلية" : "Detailed Results"}</h3>
            {/* Failed Items */}
            {stats.failed > 0 && (
              <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100 mb-4">
                <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2 text-lg">
                  <X className="h-5 w-5" />
                  {isRTL ? "العناصر الفاشلة" : "Failed Items"}
                </h4>
                <div className="space-y-4">
                  {DAILY_ITEMS.filter(item => responses[item.id]?.status === "failed").map(item => (
                    <div key={item.id} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                      <img src={item.image} alt="" className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-semibold text-base text-gray-800">{isRTL ? item.titleAr : item.title}</div>
                        {responses[item.id]?.comment && (
                          <div className="text-sm text-gray-600 mt-1">
                            <strong>{isRTL ? "ملاحظة:" : "Note:"}</strong> {responses[item.id].comment}
                          </div>
                        )}
                        {/* Action Required (if present) */}
                        {responses[item.id]?.action && (
                          <div className="text-sm mt-2">
                            <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">
                              {isRTL ? "الإجراء المطلوب:" : "Action Required:"}
                            </span> {responses[item.id].action}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Passed Items */}
            <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
              <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5" />
                {isRTL ? "العناصر الناجحة" : "Passed Items"}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {DAILY_ITEMS.filter(item => responses[item.id]?.status === "passed").map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <img src={item.image} alt="" className="w-10 h-10 object-cover rounded" />
                    <span className="text-base text-gray-800 font-medium">{isRTL ? item.titleAr : item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Next Inspection Date */}
          {inspection.nextInspectionDate && (
            <section className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 mt-8">
              <label className="block text-base font-semibold mb-2 text-gray-800">
                {isRTL ? "تاريخ الفحص القادم" : "Next Inspection Date"}
              </label>
              <Input type="date" value={inspection.nextInspectionDate} readOnly className="w-full border-gray-300 bg-white" />
            </section>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-gray-100 mt-10 sticky bottom-0 bg-white z-10 px-8 pb-8 rounded-b-2xl">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-gray-100 transition-all min-w-[120px]">
              {isRTL ? "إغلاق" : "Close"}
            </Button>
            <Button variant="outline" onClick={() => window.print()} className="hover:bg-gray-100 transition-all min-w-[160px] flex items-center justify-center">
              <FileText className="h-4 w-4 mr-2" />
              {isRTL ? "طباعة التقرير" : "Print Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 