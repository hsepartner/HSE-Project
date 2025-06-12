import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Car } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { DEFAULT_VEHICLE_DAILY_CHECKLIST_ITEMS, InspectionItem, VehicleDailyInspection } from "@/types/vehicleInspection";

interface VehicleDailyChecklistDialogProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (inspection: VehicleDailyInspection) => Promise<void>;
}

export function VehicleDailyChecklistDialog({
  vehicle,
  open,
  onOpenChange,
  onSubmit
}: VehicleDailyChecklistDialogProps) {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [notes, setNotes] = useState('');
  const [mileage, setMileage] = useState('');
  const [items, setItems] = useState<InspectionItem[]>(
    () => vehicle.category ? [...DEFAULT_VEHICLE_DAILY_CHECKLIST_ITEMS[vehicle.category]] : []
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

      // Validate mileage
      if (!mileage || isNaN(Number(mileage))) {
        setError(isRTL 
          ? 'يرجى إدخال قراءة عداد المسافات'
          : 'Please enter the current mileage reading'
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

      const inspection: VehicleDailyInspection = {
        date: new Date().toISOString(),
        driverId: 'current-user-id', // This should come from auth context
        driverName: vehicle.assignedTo || 'Unknown Driver',
        items,
        notes,
        status: 'completed',
        vehicleId: vehicle.id,
        mileage: Number(mileage)
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
          <DialogTitle className="text-xl flex items-center gap-2">
            <Car className="h-5 w-5" />
            {isRTL ? "قائمة التحقق اليومية" : "Daily Vehicle Inspection"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{isRTL ? "المركبة:" : "Vehicle:"}</span>
                <span className="font-medium ml-2">{vehicle.name}</span>
              </div>
              <div>
                <span className="text-gray-600">{isRTL ? "رقم اللوحة:" : "Plate No:"}</span>
                <span className="font-medium ml-2">{vehicle.plateNumber}</span>
              </div>
            </div>
          </div>

          {/* Mileage Reading */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {isRTL ? "قراءة عداد المسافات" : "Current Mileage"}
            </label>
            <Input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder={isRTL ? "أدخل قراءة عداد المسافات" : "Enter current mileage reading"}
            />
          </div>

          {/* Checklist Items */}
          <div className="space-y-4">
            <h3 className="font-medium border-b pb-2">
              {isRTL ? "قائمة فحص السلامة" : "Safety Inspection Checklist"}
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

          {/* Notes */}
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
              {isRTL ? "حفظ الفحص" : "Save Inspection"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
