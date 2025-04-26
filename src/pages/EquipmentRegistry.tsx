import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Equipment } from "@/types/equipment";
import { EquipmentList } from "@/components/equipment/EquipmentList";
import { EquipmentDetail } from "@/components/equipment/EquipmentDetail";
import { EquipmentHierarchy } from "@/components/equipment/EquipmentHierarchy";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Lightbulb, Plus, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Sample data (unchanged)
const SAMPLE_EQUIPMENT: Equipment[] = [
  {
    id: "1",
    name: "Excavator XL2000",
    model: "CAT 320",
    serialNumber: "CAT320-45678",
    category: "heavy",
    status: "active",
    complianceScore: 92,
    nextInspectionDate: "2025-08-15",
    purchaseDate: "2020-05-10",
    location: "Site A - North",
    assignedTo: "John Operator",
    documents: [
      {
        id: "d1",
        name: "Operation Certificate",
        type: "certificate",
        status: "verified",
        issueDate: "2024-01-15",
        expiryDate: "2025-08-15",
        issuedBy: "Safety Authority"
      },
      {
        id: "d2",
        name: "Maintenance Manual",
        type: "manual",
        status: "verified",
        issueDate: "2020-05-10",
        expiryDate: "2030-05-10",
        issuedBy: "Manufacturer"
      },
      {
        id: "d3",
        name: "Last Inspection Report",
        type: "inspection",
        status: "verified",
        issueDate: "2024-02-10",
        expiryDate: "2024-08-10",
        issuedBy: "TechInspect Inc."
      }
    ]
  },
  {
    id: "2",
    name: "Utility Truck",
    model: "Ford F-450",
    serialNumber: "FORD450-78901",
    category: "light",
    status: "maintenance",
    complianceScore: 65,
    nextInspectionDate: "2025-06-20",
    purchaseDate: "2021-07-15",
    location: "Site B - East",
    documents: [
      {
        id: "d4",
        name: "Registration",
        type: "certificate",
        status: "verified",
        issueDate: "2023-07-15",
        expiryDate: "2024-07-15",
        issuedBy: "DMV"
      },
      {
        id: "d5",
        name: "Maintenance Schedule",
        type: "manual",
        status: "pending",
        issueDate: "2021-07-15",
        expiryDate: "2031-07-15",
        issuedBy: "Ford"
      }
    ],
    parentEquipmentId: "1"
  },
  {
    id: "3",
    name: "Portable Generator",
    model: "Honda EU7000",
    serialNumber: "HONDAEU7-12345",
    category: "power-tool",
    status: "active",
    complianceScore: 78,
    nextInspectionDate: "2024-05-05",
    purchaseDate: "2022-01-20",
    location: "Site C - Workshop",
    documents: [
      {
        id: "d6",
        name: "Warranty",
        type: "certificate",
        status: "verified",
        issueDate: "2022-01-20",
        expiryDate: "2025-01-20",
        issuedBy: "Honda"
      },
      {
        id: "d7",
        name: "Electrical Safety Inspection",
        type: "inspection",
        status: "pending",
        issueDate: "2023-05-05",
        expiryDate: "2024-05-05",
        issuedBy: "ElecSafe Corp"
      }
    ]
  },
  {
    id: "4",
    name: "Concrete Mixer",
    model: "PremierMix 500",
    serialNumber: "PRMX500-56789",
    category: "heavy",
    status: "decommissioned",
    complianceScore: 20,
    nextInspectionDate: "2024-03-01",
    purchaseDate: "2018-11-05",
    location: "Warehouse",
    documents: [
      {
        id: "d8",
        name: "Decommission Report",
        type: "inspection",
        status: "rejected",
        issueDate: "2024-01-30",
        expiryDate: "2024-03-01",
        issuedBy: "Safety Dept"
      }
    ]
  },
  {
    id: "5",
    name: "Circular Saw",
    model: "DeWalt DCS577",
    serialNumber: "DW577-34567",
    category: "power-tool",
    status: "active",
    complianceScore: 85,
    nextInspectionDate: "2024-08-10",
    purchaseDate: "2023-02-15",
    location: "Site A - Workshop",
    documents: [
      {
        id: "d9",
        name: "Safety Manual",
        type: "manual",
        status: "verified",
        issueDate: "2023-02-15",
        expiryDate: "2033-02-15",
        issuedBy: "DeWalt"
      },
      {
        id: "d10",
        name: "Calibration Certificate",
        type: "certificate",
        status: "pending",
        issueDate: "2023-08-10",
        expiryDate: "2024-08-10",
        issuedBy: "ToolCal Inc."
      }
    ],
    parentEquipmentId: "3"
  }
];

const EquipmentRegistry = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [activeTab, setActiveTab] = useState("list");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(SAMPLE_EQUIPMENT[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setActiveTab("detail");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? "سجل المعدات" : "Equipment Registry"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL
                ? "إدارة ومراقبة جميع المعدات والوثائق المرتبطة بها"
                : "Manage and monitor all equipment and associated documentation"}
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {isRTL ? "إضافة معدات" : "Add Equipment"}
          </Button>
        </div>

        {/* Quick Tips Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="rounded-full bg-primary/10 p-3 shrink-0">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {isRTL ? "نصائح سريعة" : "Quick Tips"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isRTL
                    ? "تعرف على كيفية إدارة سجل المعدات بفعالية"
                    : "Learn how to manage the equipment registry effectively"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "قم بتحديث حالة المعدات بانتظام"
                        : "Regularly update equipment status"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">2</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "تأكد من توثيق جميع الفحوصات"
                        : "Ensure all inspections are documented"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">3</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "استخدم التسلسل الهرمي لتنظيم المعدات"
                        : "Use hierarchy to organize equipment"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
            <TabsTrigger
              value="list"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              {isRTL ? "عرض القائمة" : "List View"}
            </TabsTrigger>
            <TabsTrigger
              value="detail"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              {isRTL ? "عرض التفاصيل" : "Detail View"}
            </TabsTrigger>
            <TabsTrigger
              value="hierarchy"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              {isRTL ? "التسلسل الهرمي" : "Hierarchy"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <EquipmentList equipment={SAMPLE_EQUIPMENT} onSelect={handleSelectEquipment} />
          </TabsContent>

          <TabsContent value="detail" className="mt-6">
            {selectedEquipment ? (
              <EquipmentDetail equipment={selectedEquipment} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  {isRTL ? "يرجى اختيار معدات لعرض التفاصيل" : "Please select an equipment to view details"}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="hierarchy" className="mt-6">
            <EquipmentHierarchy equipment={SAMPLE_EQUIPMENT} />
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" className="flex gap-2">
            <Video className="h-4 w-4" />
            {isRTL ? "شاهد الفيديو التعليمي" : "Watch Tutorial"}
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {isRTL ? "إضافة معدات" : "Add Equipment"}
          </Button>
        </div>

        {/* Add Equipment Modal (Placeholder) */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {isRTL ? "إضافة معدات جديدة" : "Add New Equipment"}
              </DialogTitle>
              <DialogDescription>
                {isRTL
                  ? "أدخل تفاصيل المعدات لإضافتها إلى السجل"
                  : "Enter equipment details to add to the registry"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{isRTL ? "اسم المعدات" : "Equipment Name"}*</Label>
                  <Input id="name" placeholder={isRTL ? "أدخل الاسم" : "Enter name"} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">{isRTL ? "الموديل" : "Model"}*</Label>
                  <Input id="model" placeholder={isRTL ? "أدخل الموديل" : "Enter model"} required />
                </div>
              </div>
              {/* Additional fields can be added here */}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{isRTL ? "إلغاء" : "Cancel"}</Button>
              </DialogClose>
              <Button type="submit">{isRTL ? "إضافة" : "Add"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default EquipmentRegistry;