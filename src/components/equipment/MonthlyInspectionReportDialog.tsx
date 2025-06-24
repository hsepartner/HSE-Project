import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, X, FileText, Calendar, Settings, TrendingUp } from "lucide-react";
import { MonthlyInspection } from "@/types/inspection";
import { Equipment } from "@/types/equipment";
import { useLanguage } from "@/hooks/use-language";

// Import the same INSPECTION_ITEMS as in MonthlyInspectionDialog
import { INSPECTION_ITEMS as MONTHLY_ITEMS } from "./MonthlyInspectionDialog";

interface MonthlyInspectionReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: MonthlyInspection;
  equipment: Equipment;
  headerFields?: {
    project?: string;
    subcontractor?: string;
    chassisNo?: string;
    driverName?: string;
    inspectorName?: string;
  };
}

export function MonthlyInspectionReportDialog({
  open,
  onOpenChange,
  inspection,
  equipment,
  headerFields = {},
}: MonthlyInspectionReportDialogProps) {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";

  // Map responses by id for easy lookup
  const responses = Object.fromEntries(
    inspection.items.map((item) => [item.id, item])
  );

  const stats = {
    total: MONTHLY_ITEMS.length,
    passed: inspection.items.filter((i) => i.status === "passed").length,
    failed: inspection.items.filter((i) => i.status === "failed").length,
    passRate:
      MONTHLY_ITEMS.length > 0
        ? Math.round(
            (inspection.items.filter((i) => i.status === "passed").length /
              MONTHLY_ITEMS.length) *
              100
          )
        : 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-50 border-green-200';
      case 'failed': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-[1400px] h-[95vh] overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-slate-50 to-gray-100 border-0">
        {/* Header Section */}
        <DialogHeader className="pb-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm rounded-t-2xl px-6 pt-6">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {isRTL ? "تقرير الفحص الشهري" : "Monthly Inspection Report"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {isRTL ? `تم في ${new Date(inspection.createdAt || Date.now()).toLocaleDateString('ar')}` : `Completed on ${new Date(inspection.createdAt || Date.now()).toLocaleDateString()}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${stats.passRate >= 80 ? 'bg-green-100 text-green-700' : stats.passRate >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {stats.passRate >= 80 ? (isRTL ? 'ممتاز' : 'Excellent') : stats.passRate >= 60 ? (isRTL ? 'جيد' : 'Good') : (isRTL ? 'يحتاج تحسين' : 'Needs Improvement')}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                value: stats.total, 
                label: isRTL ? "إجمالي العناصر" : "Total Items", 
                icon: Settings,
                gradient: "from-blue-500 to-blue-600",
                bgGradient: "from-blue-50 to-blue-100"
              },
              { 
                value: stats.passed, 
                label: isRTL ? "نجح" : "Passed", 
                icon: CheckCircle2,
                gradient: "from-green-500 to-green-600",
                bgGradient: "from-green-50 to-green-100"
              },
              { 
                value: stats.failed, 
                label: isRTL ? "فشل" : "Failed", 
                icon: X,
                gradient: "from-red-500 to-red-600",
                bgGradient: "from-red-50 to-red-100"
              },
              { 
                value: `${stats.passRate}%`, 
                label: isRTL ? "معدل النجاح" : "Pass Rate", 
                icon: TrendingUp,
                gradient: "from-purple-500 to-purple-600",
                bgGradient: "from-purple-50 to-purple-100"
              },
            ].map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br ${stat.bgGradient} p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50 backdrop-blur-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 bg-gradient-to-r ${stat.gradient} rounded-lg shadow-sm`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Equipment Information Card */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{isRTL ? "معلومات المعدات" : "Equipment Information"}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[
                { label: isRTL ? "اسم المعدة" : "Equipment Name", value: equipment.name },
                { label: isRTL ? "الرقم التسلسلي" : "Serial Number", value: equipment.serialNumber },
                { label: isRTL ? "المشروع" : "Project", value: headerFields.project },
                { label: isRTL ? "المقاول الفرعي" : "Subcontractor", value: headerFields.subcontractor },
                { label: isRTL ? "رقم الشاسيه" : "Chassis No", value: headerFields.chassisNo },
                { label: isRTL ? "اسم السائق" : "Driver Name", value: headerFields.driverName },
                { label: isRTL ? "اسم المفتش" : "Inspector Name", value: headerFields.inspectorName },
              ].filter(item => item.value).map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{item.label}</div>
                  <div className="text-sm font-semibold text-gray-800 truncate">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Failed Items */}
            {stats.failed > 0 && (
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                    <X className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-red-800">
                    {isRTL ? `العناصر الفاشلة (${stats.failed})` : `Failed Items (${stats.failed})`}
                  </h4>
                </div>
                <div className="grid gap-4">
                  {MONTHLY_ITEMS.filter(item => responses[item.id]?.status === "failed").map(item => (
                    <div key={item.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 hover:shadow-md transition-all duration-300">
                      <div className="flex-shrink-0">
                        <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-lg shadow-sm border-2 border-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-800 mb-2">{isRTL ? item.titleAr : item.title}</h5>
                        
                        {responses[item.id]?.comment && (
                          <div className="mb-2 p-2 bg-white/70 rounded-md">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{isRTL ? "ملاحظة:" : "Note:"}</span>
                            <p className="text-sm text-gray-700 mt-1">{responses[item.id].comment}</p>
                          </div>
                        )}
                        
                        {responses[item.id]?.action && (
                          <div className="p-2 bg-red-100 rounded-md border border-red-200">
                            <span className="text-xs font-medium text-red-600 uppercase tracking-wide">{isRTL ? "الإجراء المطلوب:" : "Action Required:"}</span>
                            <p className="text-sm text-red-700 mt-1 font-medium">{responses[item.id].action}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Passed Items */}
            {stats.passed > 0 && (
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-green-800">
                    {isRTL ? `العناصر الناجحة (${stats.passed})` : `Passed Items (${stats.passed})`}
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {MONTHLY_ITEMS.filter(item => responses[item.id]?.status === "passed").map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all duration-300">
                      <img src={item.image} alt="" className="w-8 h-8 object-cover rounded-md shadow-sm border border-white" />
                      <span className="text-sm font-medium text-gray-700 truncate flex-1">{isRTL ? item.titleAr : item.title}</span>
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Next Inspection Date */}
          {inspection.nextInspectionDate && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <label className="text-lg font-semibold text-gray-800">
                  {isRTL ? "تاريخ الفحص القادم" : "Next Inspection Date"}
                </label>
              </div>
              <Input 
                type="date" 
                value={inspection.nextInspectionDate} 
                readOnly 
                className="w-full max-w-xs bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 font-medium"
              />
            </div>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm rounded-b-2xl">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="px-6 py-2 hover:bg-gray-100 transition-all duration-300 border-gray-300"
          >
            {isRTL ? "إغلاق" : "Close"}
          </Button>
          <Button 
            onClick={() => window.print()} 
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FileText className="h-4 w-4 mr-2" />
            {isRTL ? "طباعة التقرير" : "Print Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}