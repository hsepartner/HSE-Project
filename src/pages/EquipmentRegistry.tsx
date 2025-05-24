import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Equipment } from "@/types/equipment";
import { EquipmentList } from "@/components/equipment/EquipmentList";
import { EquipmentDetail } from "@/components/equipment/EquipmentDetail";
import { EquipmentHierarchy } from "@/components/equipment/EquipmentHierarchy";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Lightbulb, Plus, Video, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, PlusCircle } from "lucide-react";
import AddEquipmentModal from "@/components/equipment/AddEquipmentModal";

// Sample data (unchanged)
const SAMPLE_EQUIPMENT: Equipment[] = [
  {
    id: "1",
    name: "Crawler Crane",
    model: "Liebherr LR 1300",
    serialNumber: "LR1300-0001",
    category: "heavy",
    status: "active",
    complianceScore: 92,
    nextInspectionDate: "2025-08-15",
    purchaseDate: "2020-05-10",
    location: "Site A - North",
    assignedTo: "John Operator",
    image: "/images/Crawler Crane.png",
    documents: [
      {
        id: "d1",
        name: "Operation Certificate",
        type: "certificate",
        status: "verified",
        issueDate: "2024-01-15",
        expiryDate: "2025-08-15",
        issuedBy: "Safety Authority",
      },
      {
        id: "d2",
        name: "Maintenance Manual",
        type: "manual",
        status: "verified",
        issueDate: "2020-05-10",
        expiryDate: "2030-05-10",
        issuedBy: "Manufacturer",
      },
      {
        id: "d3",
        name: "Last Inspection Report",
        type: "inspection",
        status: "verified",
        issueDate: "2024-02-10",
        expiryDate: "2024-08-10",
        issuedBy: "TechInspect Inc.",
      },
    ],
  },
  {
    id: "2",
    name: "Excavator",
    model: "CAT 320",
    serialNumber: "CAT320-45678",
    category: "heavy",
    status: "maintenance",
    complianceScore: 65,
    nextInspectionDate: "2025-06-20",
    purchaseDate: "2021-07-15",
    location: "Site B - East",
    assignedTo: "Maria Operator",
    image: "/images/Excavator.png",
    documents: [
      {
        id: "d4",
        name: "Registration",
        type: "certificate",
        status: "verified",
        issueDate: "2023-07-15",
        expiryDate: "2024-07-15",
        issuedBy: "DMV",
      },
      {
        id: "d5",
        name: "Maintenance Schedule",
        type: "manual",
        status: "pending",
        issueDate: "2021-07-15",
        expiryDate: "2031-07-15",
        issuedBy: "Ford",
      },
    ],
    parentEquipmentId: "1",
  },
  {
    id: "3",
    name: "JCB",
    model: "JCB 3CX",
    serialNumber: "JCB3CX-78901",
    category: "heavy",
    status: "active",
    complianceScore: 78,
    nextInspectionDate: "2024-05-05",
    purchaseDate: "2022-01-20",
    location: "Site C - Workshop",
    assignedTo: "Ahmed Operator",
    image: "/images/JCB.png",
    documents: [
      {
        id: "d6",
        name: "Warranty",
        type: "certificate",
        status: "verified",
        issueDate: "2022-01-20",
        expiryDate: "2025-01-20",
        issuedBy: "Honda",
      },
      {
        id: "d7",
        name: "Electrical Safety Inspection",
        type: "inspection",
        status: "pending",
        issueDate: "2023-05-05",
        expiryDate: "2024-05-05",
        issuedBy: "ElecSafe Corp",
      },
    ],
  },
  {
    id: "4",
    name: "Hlab",
    model: "HLAB X1",
    serialNumber: "HLABX1-12345",
    category: "heavy",
    status: "decommissioned",
    complianceScore: 20,
    nextInspectionDate: "2024-03-01",
    purchaseDate: "2018-11-05",
    location: "Warehouse",
    assignedTo: "Sarah Operator",
    image: "/images/hlab.png",
    documents: [
      {
        id: "d8",
        name: "Decommission Report",
        type: "inspection",
        status: "rejected",
        issueDate: "2024-01-30",
        expiryDate: "2024-03-01",
        issuedBy: "Safety Dept",
      },
    ],
  },
  {
    id: "5",
    name: "Telehandler",
    model: "JLG 4017RS",
    serialNumber: "JLG4017-56789",
    category: "heavy",
    status: "active",
    complianceScore: 85,
    nextInspectionDate: "2024-08-10",
    purchaseDate: "2023-02-15",
    location: "Site A - Workshop",
    assignedTo: "James Operator",
    image: "/images/TELEHANDLER.png",
    documents: [
      {
        id: "d9",
        name: "Safety Manual",
        type: "manual",
        status: "verified",
        issueDate: "2023-02-15",
        expiryDate: "2033-02-15",
        issuedBy: "DeWalt",
      },
      {
        id: "d10",
        name: "Calibration Certificate",
        type: "certificate",
        status: "pending",
        issueDate: "2023-08-10",
        expiryDate: "2024-08-10",
        issuedBy: "ToolCal Inc.",
      },
    ],
    parentEquipmentId: "3",
  },
  {
    id: "6",
    name: "Wheel Loader",
    model: "CAT 950GC",
    serialNumber: "CAT950GC-24680",
    category: "heavy",
    status: "maintenance",
    complianceScore: 55,
    nextInspectionDate: "2024-09-01",
    purchaseDate: "2021-03-10",
    location: "Site D - South",
    assignedTo: "Emily Operator",
    image: "/images/Wheelloader.png",
    documents: [
      {
        id: "d11",
        name: "Registration",
        type: "certificate",
        status: "verified",
        issueDate: "2023-07-15",
        expiryDate: "2024-07-15",
        issuedBy: "DMV",
      },
      {
        id: "d12",
        name: "Maintenance Schedule",
        type: "manual",
        status: "pending",
        issueDate: "2021-07-15",
        expiryDate: "2031-07-15",
        issuedBy: "Ford",
      },
    ],
  },
];

// Equipment types data from Dashboard.tsx
const equipmentTypes = [
  {
    name: "Crawler Crane",
    image: "/images/Crawler Crane.png",
    category: "heavy",
  },
  {
    name: "Excavator",
    image: "/images/Excavator.png",
    category: "heavy",
  },
  {
    name: "JCB",
    image: "/images/JCB.png",
    category: "heavy",
  },
  {
    name: "Hlab",
    image: "/images/hlab.png",
    category: "heavy",
  },
  {
    name: "Telehandler",
    image: "/images/TELEHANDLER.png",
    category: "heavy",
  },
  {
    name: "Wheel Loader",
    image: "/images/Wheelloader.png",
    category: "heavy",
  },
];

const EquipmentRegistry = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const [activeTab, setActiveTab] = useState("list");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    SAMPLE_EQUIPMENT[0]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setActiveTab("detail");
  };

  const simulateAction = (action: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      toast({
        title: isRTL ? "نجاح" : "Success",
        description: isRTL ? `تم إكمال ${action} بنجاح` : `${action} completed successfully`,
      });
    }, 2000);
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
            <EquipmentList
              equipment={SAMPLE_EQUIPMENT}
              onSelect={handleSelectEquipment}
            />
          </TabsContent>

          <TabsContent value="detail" className="mt-6">
            {selectedEquipment ? (
              <EquipmentDetail equipment={selectedEquipment} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  {isRTL
                    ? "يرجى اختيار معدات لعرض التفاصيل"
                    : "Please select an equipment to view details"}
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

        {/* Add Equipment Modal (Updated to match Dashboard.tsx) */}
        <AddEquipmentModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          equipmentTypes={equipmentTypes}
          selectedEquipmentType={selectedEquipmentType}
          setSelectedEquipmentType={setSelectedEquipmentType}
          loading={loading}
          onSubmit={() => simulateAction(isRTL ? "تسجيل المعدات" : "Equipment registration")}
          isRTL={isRTL}
          onCancel={() => setIsModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default EquipmentRegistry;