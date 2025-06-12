import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/use-language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { LiftingAccessory } from "@/types/lifting-tools";
import type { DailyInspection } from "@/types/inspection";

const DEFAULT_LIFTING_DAILY_ITEMS = [
  { id: 'ld1', description: 'Check general condition and cleanliness', isRequired: true, status: 'not-checked' },
  { id: 'ld2', description: 'Inspect for cracks, deformation or damage', isRequired: true, status: 'not-checked' },
  { id: 'ld3', description: 'Verify safety latches and locks functioning', isRequired: true, status: 'not-checked' },
  { id: 'ld4', description: 'Check chain/wire rope condition', isRequired: true, status: 'not-checked' },
  { id: 'ld5', description: 'Inspect hooks for deformation', isRequired: true, status: 'not-checked' },
  { id: 'ld6', description: 'Verify load rating marks are visible', isRequired: true, status: 'not-checked' },
  { id: 'ld7', description: 'Check lifting points integrity', isRequired: true, status: 'not-checked' },
  { id: 'ld8', description: 'Verify proper storage condition', isRequired: true, status: 'not-checked' },
];

interface Props {
  accessory: LiftingAccessory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (inspection: DailyInspection) => Promise<void>;
}

export function LiftingAccessoryDailyChecklistDialog({
  accessory,
  open,
  onOpenChange,
  onSubmit
}: Props) {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([...DEFAULT_LIFTING_DAILY_ITEMS]);
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

      const inspection: DailyInspection = {
        date: new Date().toISOString(),
        operatorId: 'current-user-id',
        operatorName: 'Current Operator',
        toolName: accessory.accessoryName,
        equipmentId: accessory.accessoryId,
        serialNumber: accessory.accessoryId,
        manufacturer: accessory.manufacturer,
        modelNumber: accessory.modelNumber,
        items,
        notes,
        status: 'completed',
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

  if (!accessory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isRTL ? "قائمة التحقق اليومية لملحقات الرفع" : "Lifting Accessory Daily Inspection Checklist"}
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
