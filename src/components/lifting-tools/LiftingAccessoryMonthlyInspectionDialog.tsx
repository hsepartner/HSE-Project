import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/use-language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Wrench } from "lucide-react";
import type { LiftingAccessory } from "@/types/lifting-tools";
import type { MonthlyInspection } from "@/types/inspection";

const DEFAULT_LIFTING_MONTHLY_ITEMS = [
  { id: 'lm1', description: 'Load test verification', isRequired: true, status: 'not-checked' },
  { id: 'lm2', description: 'Detailed structural inspection', isRequired: true, status: 'not-checked' },
  { id: 'lm3', description: 'Measurement of wear and deformation', isRequired: true, status: 'not-checked' },
  { id: 'lm4', description: 'Check certification validity', isRequired: true, status: 'not-checked' },
  { id: 'lm5', description: 'Inspect welded joints', isRequired: true, status: 'not-checked' },
  { id: 'lm6', description: 'Verify dimensions against specifications', isRequired: true, status: 'not-checked' },
  { id: 'lm7', description: 'Check all moving parts lubrication', isRequired: true, status: 'not-checked' },
  { id: 'lm8', description: 'Inspect load bearing components', isRequired: true, status: 'not-checked' },
  { id: 'lm9', description: 'Verify safety device calibration', isRequired: true, status: 'not-checked' },
  { id: 'lm10', description: 'Review maintenance records', isRequired: true, status: 'not-checked' },
];

interface Props {
  accessory: LiftingAccessory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (inspection: MonthlyInspection) => Promise<void>;
}

export function LiftingAccessoryMonthlyInspectionDialog({
  accessory,
  open,
  onOpenChange,
  onSubmit
}: Props) {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([...DEFAULT_LIFTING_MONTHLY_ITEMS]);
  const [nextInspectionDate, setNextInspectionDate] = useState('');
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

      if (!nextInspectionDate) {
        setError(isRTL 
          ? 'يرجى تحديد تاريخ الفحص القادم'
          : 'Please set the next inspection date'
        );
        return;
      }

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

      const inspection: MonthlyInspection = {
        date: new Date().toISOString(),
        technicianId: 'current-user-id',
        technicianName: 'Current Technician',
        toolName: accessory.accessoryName,
        equipmentId: accessory.accessoryId,
        serialNumber: accessory.accessoryId,
        manufacturer: accessory.manufacturer,
        modelNumber: accessory.modelNumber,
        items,
        notes,
        status: 'completed',
        nextInspectionDate
      };

      await onSubmit(inspection);
      onOpenChange(false);
    } catch (err) {
      setError(isRTL 
        ? 'حدث خطأ أثناء حفظ الفحص'
        : 'An error occurred while saving the inspection'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!accessory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {isRTL ? "الفحص الفني الشهري لملحقات الرفع" : "Lifting Accessory Monthly Technical Inspection"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{isRTL ? "الملحق:" : "Accessory:"}</span>
                <span className="font-medium ml-2">{accessory.accessoryName}</span>
              </div>
              <div>
                <span className="text-gray-600">{isRTL ? "رقم الملحق:" : "Accessory ID:"}</span>
                <span className="font-medium ml-2">{accessory.accessoryId}</span>
              </div>
              <div>
                <span className="text-gray-600">{isRTL ? "الموديل:" : "Model:"}</span>
                <span className="font-medium ml-2">{accessory.modelNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">{isRTL ? "المصنع:" : "Manufacturer:"}</span>
                <span className="font-medium ml-2">{accessory.manufacturer}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {isRTL ? "تاريخ الفحص القادم" : "Next Inspection Date"}
            </label>
            <Input
              type="date"
              value={nextInspectionDate}
              onChange={(e) => setNextInspectionDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

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
                      {isRTL ? "مقبول" : "Pass"}
                    </Button>
                    <Button
                      size="sm"
                      variant={item.status === 'failed' ? 'destructive' : 'outline'}
                      className="w-24"
                      onClick={() => handleItemStatusChange(item.id, 'failed')}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {isRTL ? "مرفوض" : "Fail"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {isRTL ? "ملاحظات فنية" : "Technical Notes"}
            </label>
            <Textarea
              placeholder={isRTL ? "إضافة ملاحظات فنية..." : "Add technical notes..."}
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
              {isRTL ? "حفظ الفحص" : "Save Inspection"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
