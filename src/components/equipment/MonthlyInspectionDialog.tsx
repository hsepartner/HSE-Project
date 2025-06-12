import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Wrench } from "lucide-react";
import { Equipment } from "@/types/equipment";
import { InspectionItem, MonthlyInspection } from "@/types/inspection";

const DEFAULT_MONTHLY_ITEMS: InspectionItem[] = [
  // Generic technical checks applicable to all equipment
  { id: 'm1', description: 'Perform detailed mechanical inspection', isRequired: true, status: 'not-checked' },
  { id: 'm2', description: 'Check and calibrate all gauges and sensors', isRequired: true, status: 'not-checked' },
  { id: 'm3', description: 'Inspect all hydraulic/pneumatic systems', isRequired: true, status: 'not-checked' },
  { id: 'm4', description: 'Verify emergency systems operation', isRequired: true, status: 'not-checked' },
  { id: 'm5', description: 'Test all control mechanisms', isRequired: true, status: 'not-checked' },
  { id: 'm6', description: 'Check structural integrity and welds', isRequired: true, status: 'not-checked' },
  { id: 'm7', description: 'Inspect electrical systems and connections', isRequired: true, status: 'not-checked' },
  { id: 'm8', description: 'Review and verify maintenance records', isRequired: true, status: 'not-checked' },
];

interface MonthlyInspectionDialogProps {
  equipment: Equipment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (inspection: MonthlyInspection) => Promise<void>;
}

export function MonthlyInspectionDialog({
  equipment,
  open,
  onOpenChange,
  onSubmit
}: MonthlyInspectionDialogProps) {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InspectionItem[]>([...DEFAULT_MONTHLY_ITEMS]);
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

      // Validation
      if (!nextInspectionDate) {
        setError(isRTL 
          ? 'يرجى تحديد تاريخ الفحص القادم'
          : 'Please set the next inspection date'
        );
        return;
      }

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

      const inspection: MonthlyInspection = {
        date: new Date().toISOString(),
        technicianId: 'current-user-id', // This should come from auth context
        technicianName: 'Current Technician', // This should come from auth context
        items,
        notes,
        status: 'completed',
        equipmentId: equipment.id,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {isRTL ? "الفحص الفني الشهري" : "Monthly Technical Inspection"}
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

          {/* Next Inspection Date */}
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

          {/* Checklist Items */}
          <div className="space-y-4">
            <h3 className="font-medium border-b pb-2">
              {isRTL ? "قائمة الفحص التقني" : "Technical Inspection Checklist"}
            </h3>
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

          {/* Technical Notes */}
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
