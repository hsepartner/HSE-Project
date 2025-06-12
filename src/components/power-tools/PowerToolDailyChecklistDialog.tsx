import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/use-language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { PowerTool } from "@/types/equipment";

interface InspectionItem {
  id: string;
  description: string;
  isRequired: boolean;
  status: 'not-checked' | 'passed' | 'failed';
}

interface PowerToolDailyInspection {
  date: string;
  operatorId: string;
  operatorName: string;
  items: InspectionItem[];
  notes: string;
  status: 'completed';
  powerToolId: string;
}

const DEFAULT_POWER_TOOL_DAILY_ITEMS: InspectionItem[] = [
  { id: 'pd1', description: 'Check power cord/battery condition', isRequired: true, status: 'not-checked' },
  { id: 'pd2', description: 'Inspect tool body for damage', isRequired: true, status: 'not-checked' },
  { id: 'pd3', description: 'Test power switch operation', isRequired: true, status: 'not-checked' },
  { id: 'pd4', description: 'Check handle and grip condition', isRequired: true, status: 'not-checked' },
  { id: 'pd5', description: 'Verify all safety guards in place', isRequired: true, status: 'not-checked' },
  { id: 'pd6', description: 'Check cutting/working parts', isRequired: true, status: 'not-checked' },
  { id: 'pd7', description: 'Test emergency stop (if applicable)', isRequired: true, status: 'not-checked' },
  { id: 'pd8', description: 'Verify required safety accessories available', isRequired: true, status: 'not-checked' },
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
  onSubmit
}: PowerToolDailyChecklistDialogProps) {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InspectionItem[]>([...DEFAULT_POWER_TOOL_DAILY_ITEMS]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleItemStatusChange = (itemId: string, status: 'passed' | 'failed') => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status } : item
    ));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      // Validate that all required items have been checked
      const uncheckedRequired = items.filter(item => 
        item.isRequired && item.status === 'not-checked'
      );

      if (uncheckedRequired.length > 0) {
        setError(isRTL 
          ? 'يرجى إكمال جميع العناصر المطلوبة قبل التقديم'
          : 'Please complete all required items before submitting'
        );
        return;
      }

      const inspection: PowerToolDailyInspection = {
        date: new Date().toISOString(),
        operatorId: 'current-user-id', // This should come from auth context
        operatorName: powerTool.operatorName || 'Unknown Operator',
        items,
        notes,
        status: 'completed',
        powerToolId: powerTool.id
      };

      await onSubmit(inspection);
      onOpenChange(false);
    } catch (err) {
      setError(isRTL 
        ? 'حدث خطأ أثناء حفظ قائمة التحقق'
        : 'An error occurred while saving the checklist'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isRTL ? "قائمة التحقق اليومية للأدوات الكهربائية" : "Power Tool Daily Inspection Checklist"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Power Tool Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{isRTL ? "الأداة:" : "Tool:"}</span>
                <span className="font-medium ml-2">{powerTool.toolName}</span>
              </div>
              <div>
                <span className="text-gray-600">{isRTL ? "رقم الأداة:" : "Tool ID:"}</span>
                <span className="font-medium ml-2">{powerTool.toolId}</span>
              </div>
              <div>
                <span className="text-gray-600">{isRTL ? "الموديل:" : "Model:"}</span>
                <span className="font-medium ml-2">{powerTool.modelNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">{isRTL ? "المصنع:" : "Manufacturer:"}</span>
                <span className="font-medium ml-2">{powerTool.manufacturer}</span>
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.description}
                      {item.isRequired && <span className="text-red-500 ml-1">*</span>}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={item.status === 'passed' ? 'default' : 'outline'}
                      className="w-24"
                      onClick={() => handleItemStatusChange(item.id, 'passed')}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {isRTL ? "نعم" : "Yes"}
                    </Button>
                    <Button
                      size="sm"
                      variant={item.status === 'failed' ? 'destructive' : 'outline'}
                      className="w-24"
                      onClick={() => handleItemStatusChange(item.id, 'failed')}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {isRTL ? "لا" : "No"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {isRTL ? "ملاحظات" : "Notes"}
            </label>
            <Textarea
              placeholder={isRTL ? "إضافة ملاحظات..." : "Add notes..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-24"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isRTL ? "حفظ" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
