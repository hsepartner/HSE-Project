import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/use-language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Equipment } from "@/types/equipment";
import { DEFAULT_DAILY_CHECKLIST_ITEMS, InspectionItem, DailyInspection } from "@/types/inspection";

interface DailyChecklistDialogProps {
  equipment: Equipment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (inspection: DailyInspection) => Promise<void>;
}

export function DailyChecklistDialog({
  equipment,
  open,
  onOpenChange,
  onSubmit
}: DailyChecklistDialogProps) {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InspectionItem[]>(
    () => equipment.category ? [...DEFAULT_DAILY_CHECKLIST_ITEMS[equipment.category]] : []
  );
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

      const inspection: DailyInspection = {
        date: new Date().toISOString(),
        operatorId: 'current-user-id', // This should come from auth context
        operatorName: equipment.assignedTo || 'Unknown Operator',
        items,
        notes,
        status: 'completed',
        equipmentId: equipment.id
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
            {isRTL ? "قائمة التحقق اليومية" : "Daily Inspection Checklist"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Equipment Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{isRTL ? "المعدات:" : "Equipment:"}</span>
                <span className="font-medium ml-2">{equipment.name}</span>
              </div>
              <div>
                <span className="text-gray-600">{isRTL ? "الرقم التسلسلي:" : "Serial No:"}</span>
                <span className="font-medium ml-2">{equipment.serialNumber}</span>
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
