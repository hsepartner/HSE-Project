import React, { forwardRef, useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Equipment, EquipmentCategory } from "@/types/equipment";
import { EquipmentList } from "@/components/equipment/EquipmentList";
import { EquipmentDetail } from "@/components/equipment/EquipmentDetail";
import { EquipmentHierarchy } from "@/components/equipment/EquipmentHierarchy";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Lightbulb, Plus, Video, Wrench, CheckCircle, AlertTriangle, Clock, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBadge } from "@/components/equipment/CategoryBadge";
import { useToast } from "@/components/ui/use-toast";
import { EquipmentCategoryCard } from "@/components/equipment/EquipmentCategoryCard";
import { EquipmentTypeList } from "@/components/equipment/EquipmentTypeList";
import AddEquipmentModal from "@/components/equipment/AddEquipmentModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Extended Equipment interface to include project field
interface ExtendedEquipment extends Equipment {
  project: string;
}

// Sample data as fallback
const SAMPLE_EQUIPMENT: ExtendedEquipment[] = [
  {
    id: "1",
    name: "Crawler Crane",
    model: "Liebherr LR 1300",
    trafficPlateNumber: "DUB-1300-A",
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
    parentEquipmentId: "1",
    project: "Project A",
  },
  {
    id: "2",
    name: "Excavator",
    model: "CAT 320",
    trafficPlateNumber: "DUB-320-B",
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
    project: "Project B",
  },
  {
    id: "3",
    name: "JCB",
    model: "JCB 3CX",
    trafficPlateNumber: "DUB-3CX-C",
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
    project: "Project C",
  },
  {
    id: "4",
    name: "Hlab",
    model: "HLAB X1",
    trafficPlateNumber: "DUB-X1-D",
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
    project: "Project A",
  },
  {
    id: "5",
    name: "Telehandler",
    model: "JLG 4017RS",
    trafficPlateNumber: "DUB-4017-E",
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
    project: "Project B",
  },
  {
    id: "6",
    name: "Wheel Loader",
    model: "CAT 950GC",
    trafficPlateNumber: "DUB-950GC-F",
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
    project: "Project C",
  },
  {
    id: "7",
    name: "Crawler Crane",
    model: "Liebherr LR 1100",
    trafficPlateNumber: "DUB-1100-G",
    category: "heavy",
    status: "active",
    complianceScore: 88,
    nextInspectionDate: "2025-10-01",
    purchaseDate: "2021-08-12",
    location: "Site B - North",
    assignedTo: "Ethan Operator",
    image: "/images/Crawler Crane.png",
    documents: [
      {
        id: "d13",
        name: "Load Test Certificate",
        type: "certificate",
        status: "verified",
        issueDate: "2024-10-01",
        expiryDate: "2025-10-01",
        issuedBy: "LoadCheck Ltd",
      },
    ],
    project: "Project A",
  },
  {
    id: "8",
    name: "Excavator",
    model: "Volvo EC950F",
    trafficPlateNumber: "DUB-950F-H",
    category: "heavy",
    status: "active",
    complianceScore: 95,
    nextInspectionDate: "2025-07-01",
    purchaseDate: "2022-06-20",
    location: "Site D - East",
    assignedTo: "Liam Operator",
    image: "/images/Excavator.png",
    documents: [
      {
        id: "d14",
        name: "Engine Report",
        type: "inspection",
        status: "verified",
        issueDate: "2024-06-20",
        expiryDate: "2025-06-20",
        issuedBy: "EngineSafe Inc.",
      },
    ],
    project: "Project C",
  },
  {
    id: "9",
    name: "JCB",
    model: "JCB 4CX",
    trafficPlateNumber: "DUB-4CX-I",
    category: "heavy",
    status: "maintenance",
    complianceScore: 70,
    nextInspectionDate: "2024-12-01",
    purchaseDate: "2020-11-11",
    location: "Site E - Garage",
    assignedTo: "Nora Operator",
    image: "/images/JCB.png",
    documents: [
      {
        id: "d15",
        name: "Hydraulic Report",
        type: "inspection",
        status: "pending",
        issueDate: "2023-12-01",
        expiryDate: "2024-12-01",
        issuedBy: "HydroCheck",
      },
    ],
    project: "Project B",
  },
  {
    id: "10",
    name: "Hlab",
    model: "HLAB X2",
    trafficPlateNumber: "DUB-X2-J",
    category: "heavy",
    status: "active",
    complianceScore: 60,
    nextInspectionDate: "2024-10-10",
    purchaseDate: "2019-09-05",
    location: "Lab Facility",
    assignedTo: "Olivia Operator",
    image: "/images/hlab.png",
    documents: [
      {
        id: "d16",
        name: "Software Calibration",
        type: "manual",
        status: "verified",
        issueDate: "2022-10-10",
        expiryDate: "2032-10-10",
        issuedBy: "LabTools Co",
      },
    ],
    project: "Project C",
  },
  {
    id: "11",
    name: "Telehandler",
    model: "Genie GTH-844",
    trafficPlateNumber: "DUB-844-K",
    category: "heavy",
    status: "active",
    complianceScore: 82,
    nextInspectionDate: "2025-01-05",
    purchaseDate: "2023-03-12",
    location: "Site F - Workshop",
    assignedTo: "Thomas Operator",
    image: "/images/TELEHANDLER.png",
    documents: [
      {
        id: "d17",
        name: "Annual Safety Inspection",
        type: "inspection",
        status: "verified",
        issueDate: "2024-01-05",
        expiryDate: "2025-01-05",
        issuedBy: "SafeGear",
      },
    ],
    project: "Project A",
  },
  {
    id: "12",
    name: "Wheel Loader",
    model: "Volvo L90H",
    trafficPlateNumber: "DUB-L90H-L",
    category: "heavy",
    status: "active",
    complianceScore: 87,
    nextInspectionDate: "2025-02-15",
    purchaseDate: "2022-09-25",
    location: "Site G - South Yard",
    assignedTo: "Grace Operator",
    image: "/images/Wheelloader.png",
    documents: [
      {
        id: "d18",
        name: "Brake Test Report",
        type: "inspection",
        status: "pending",
        issueDate: "2024-02-15",
        expiryDate: "2025-02-15",
        issuedBy: "BrakeCheck Systems",
      },
    ],
    project: "Project B",
  },
  {
    id: "13",
    name: "Crawler Crane",
    model: "Zoomlion ZCC2600",
    trafficPlateNumber: "DUB-2600-M",
    category: "heavy",
    status: "maintenance",
    complianceScore: 75,
    nextInspectionDate: "2024-11-01",
    purchaseDate: "2019-12-10",
    location: "Site H - North",
    assignedTo: "Henry Operator",
    image: "/images/Crawler Crane.png",
    documents: [
      {
        id: "d19",
        name: "Crane Structure Certificate",
        type: "certificate",
        status: "verified",
        issueDate: "2023-11-01",
        expiryDate: "2024-11-01",
        issuedBy: "CraneSafety Org",
      },
    ],
    project: "Project B",
  },
  {
    id: "14",
    name: "Telehandler",
    model: "Bobcat TL43.80HF",
    trafficPlateNumber: "DUB-43HF-N",
    category: "heavy",
    status: "decommissioned",
    complianceScore: 40,
    nextInspectionDate: "2023-10-10",
    purchaseDate: "2017-03-03",
    location: "Old Yard",
    assignedTo: "Sophia Operator",
    image: "/images/TELEHANDLER.png",
    documents: [
      {
        id: "d20",
        name: "Deactivation Report",
        type: "inspection",
        status: "rejected",
        issueDate: "2023-08-01",
        expiryDate: "2023-10-10",
        issuedBy: "Municipal Safety Dept",
      },
    ],
    project: "Project A",
  },
  {
    id: "15",
    name: "Wheel Loader",
    model: "Komatsu WA380",
    trafficPlateNumber: "DUB-WA380-O",
    category: "heavy",
    status: "maintenance",
    complianceScore: 58,
    nextInspectionDate: "2024-10-05",
    purchaseDate: "2021-04-14",
    location: "Site H - South",
    assignedTo: "David Operator",
    image: "/images/Wheelloader.png",
    documents: [
      {
        id: "d21",
        name: "Cooling System Inspection",
        type: "inspection",
        status: "verified",
        issueDate: "2023-10-05",
        expiryDate: "2024-10-05",
        issuedBy: "CoolTech",
      },
    ],
    project: "Project C",
  },
  {
    id: "16",
    name: "Excavator",
    model: "Hitachi ZX350",
    trafficPlateNumber: "DUB-ZX350-P",
    category: "heavy",
    status: "active",
    complianceScore: 90,
    nextInspectionDate: "2025-03-01",
    purchaseDate: "2022-03-12",
    location: "Site A - Pit",
    assignedTo: "Leo Operator",
    image: "/images/Excavator.png",
    documents: [
      {
        id: "d22",
        name: "Emission Test",
        type: "certificate",
        status: "verified",
        issueDate: "2024-03-01",
        expiryDate: "2025-03-01",
        issuedBy: "GreenCheck",
      },
    ],
    project: "Project B",
  },
];

// Equipment types data
const equipmentTypes = [
  {
    id: "1",
    name: "Crawler Crane",
    image: "/images/Crawler Crane.png",
    category: "heavy",
  },
  {
    id: "2",
    name: "Excavator",
    image: "/images/Excavator.png",
    category: "heavy",
  },
  {
    id: "3",
    name: "JCB",
    image: "/images/JCB.png",
    category: "heavy",
  },
  {
    id: "4",
    name: "Hlab",
    image: "/images/hlab.png",
    category: "heavy",
  },
  {
    id: "5",
    name: "Telehandler",
    image: "/images/TELEHANDLER.png",
    category: "heavy",
  },
  {
    id: "6",
    name: "Wheel Loader",
    image: "/images/Wheelloader.png",
    category: "heavy",
  },
];

// Map API equipment data to ExtendedEquipment format
function mapApiEquipmentToFrontend(apiEquipment: any): ExtendedEquipment {
  // Map equipment type to image (customize as needed)
  const typeImageMap: Record<string, string> = {
    "Crawler Crane": "/images/Crawler Crane.png",
    "Excavator": "/images/Excavator.png",
    "JCB": "/images/JCB.png",
    "Hlab": "/images/hlab.png",
    "Telehandler": "/images/TELEHANDLER.png",
    "Wheel Loader": "/images/Wheelloader.png",
  };

  // Map documents if present
  let documents: any[] = [];
  if (Array.isArray(apiEquipment.documents)) {
    documents = apiEquipment.documents;
  } else if (apiEquipment.document) {
    documents = [apiEquipment.document];
  }

  return {
    id: String(apiEquipment.id),
    name: apiEquipment.name || "",
    model: apiEquipment.model || "",
    trafficPlateNumber: apiEquipment.plateNumber || "",
    category: apiEquipment.category || "unknown",
    status: apiEquipment.status || "unknown",
    complianceScore: 0, // You may want to calculate or fetch this
    nextInspectionDate: apiEquipment.registrationExpiry || "", // Or another relevant date
    purchaseDate: apiEquipment.purchaseDate || "",
    location: apiEquipment.location || "",
    assignedTo: apiEquipment.assignedOperator || "",
    image: typeImageMap[apiEquipment.name || ""] || "/images/default.png",
    documents: documents,
    parentEquipmentId: "", // If you have this info
    project: "Project A", // Or infer from your logic
  };
}

// ShareEquipmentModal component
const ShareEquipmentModal = forwardRef<HTMLDivElement, {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: ExtendedEquipment | null;
  onShare: (data: { email?: string; link?: string }) => void;
  loading: boolean;
  isRTL: boolean;
}>(({ open, onOpenChange, equipment, onShare, loading, isRTL }, ref) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [shareMethod, setShareMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    if (equipment) {
      setShareLink(`https://example.com/equipment/${equipment.id}`);
    }
  }, [equipment]);

  const handleShare = () => {
    if (shareMethod === "email" && !email.trim()) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى إدخال بريد إلكتروني صالح" : "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    onShare(shareMethod === "email" ? { email } : { link: shareLink });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isRTL ? "مشاركة المعدات" : "Share Equipment"}
          </DialogTitle>
          <DialogDescription>
            {isRTL
              ? "شارك تفاصيل المعدات عبر البريد الإلكتروني أو رابط."
              : "Share equipment details via email or a link."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="share-method">
              {isRTL ? "طريقة المشاركة" : "Share Method"}
            </Label>
            <Select
              value={shareMethod}
              onValueChange={setShareMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? "اختر طريقة" : "Select method"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">{isRTL ? "بريد إلكتروني" : "Email"}</SelectItem>
                <SelectItem value="link">{isRTL ? "رابط" : "Link"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {shareMethod === "email" ? (
            <div className="grid gap-2">
              <Label htmlFor="email">{isRTL ? "البريد الإلكتروني" : "Email Address"}</Label>
              <Input
                id="email"
                type="email"
                placeholder={isRTL ? "أدخل البريد الإلكتروني" : "Enter email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="share-link">{isRTL ? "رابط المشاركة" : "Shareable Link"}</Label>
              <Input
                id="share-link"
                value={shareLink}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  toast({
                    title: isRTL ? "تم النسخ" : "Copied",
                    description: isRTL ? "تم نسخ الرابط إلى الحافظة" : "Link copied to clipboard",
                  });
                }}
              >
                {isRTL ? "نسخ الرابط" : "Copy Link"}
              </Button>
            </div>
          )}

          {equipment && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">{equipment.name}</p>
              <p className="text-xs text-muted-foreground">{equipment.trafficPlateNumber}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleShare} disabled={loading}>
            {loading ? (isRTL ? "جارٍ المشاركة..." : "Sharing...") : (isRTL ? "مشاركة" : "Share")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

const EquipmentRegistry = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const [activeTab, setActiveTab] = useState("list");
  const [viewMode, setViewMode] = useState<'categories' | 'type-list' | 'detail'>('categories');
  const [equipmentData, setEquipmentData] = useState<ExtendedEquipment[]>(SAMPLE_EQUIPMENT);
  const [selectedEquipment, setSelectedEquipment] = useState<ExtendedEquipment | null>(equipmentData[0]);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>("");
  const [filteredEquipment, setFilteredEquipment] = useState<ExtendedEquipment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState("Project A");
  const { toast } = useToast();

  // Fetch equipment data from API
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://laravel.mysignages.com/api/get/equipment");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Success fetching equipment:", data);
      // Ensure we always set an array
      const equipmentArray = Array.isArray(data.equipment) ? data.equipment : [];
      // Filter out equipment with missing category or status
      const filteredEquipment = equipmentArray.filter(
        eq =>
          eq.name && eq.name.trim() !== "" &&
          eq.category && eq.category.trim() !== "" &&
          eq.status && eq.status.trim() !== ""
      );
      // Map API data to frontend format
      const mappedEquipment = filteredEquipment.map(mapApiEquipmentToFrontend);
      setEquipmentData(mappedEquipment);
      setSelectedEquipment(mappedEquipment[0] || null);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL 
          ? "فشل في جلب بيانات المعدات. استخدام البيانات الافتراضية."
          : "Failed to fetch equipment data. Using fallback data.",
        variant: "destructive",
      });
      // Keep SAMPLE_EQUIPMENT as fallback
      setEquipmentData(SAMPLE_EQUIPMENT);
      setSelectedEquipment(SAMPLE_EQUIPMENT[0] || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [isRTL, toast]);

  // Group equipment by type
  const groupedEquipment = Array.isArray(equipmentData) ? equipmentData.reduce((acc, equipment) => {
    if (!acc[equipment.name]) {
      acc[equipment.name] = [];
    }
    acc[equipment.name].push(equipment);
    return acc;
  }, {} as Record<string, ExtendedEquipment[]>) : {};

  // Filter equipment by project
  const projectFilteredEquipment = Array.isArray(equipmentData) ? equipmentData.filter(
    (equipment) => equipment.project === selectedProject
  ) : [];

  // Statistics
  const stats = {
    total: projectFilteredEquipment.length,
    active: projectFilteredEquipment.filter((e) => e.status === "active").length,
    maintenance: projectFilteredEquipment.filter((e) => e.status === "maintenance").length,
    dueInspection: projectFilteredEquipment.filter(
      (e) => new Date(e.nextInspectionDate) <= new Date()
    ).length,
    byType: projectFilteredEquipment.reduce((acc, equipment) => {
      acc[equipment.name] = (acc[equipment.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    expiredDocs: projectFilteredEquipment.reduce(
      (acc, equipment) =>
        acc +
        equipment.documents.filter(
          (doc) => new Date(doc.expiryDate) <= new Date()
        ).length,
      0
    ),
  };

  const handleSelectEquipment = (equipment: Equipment) => {
    const extendedEquipment = projectFilteredEquipment.find(e => e.id === equipment.id);
    if (extendedEquipment) {
      setSelectedEquipment(extendedEquipment);
      setActiveTab("detail");
      setViewMode("detail");
    }
  };

  const handleShareEquipment = (equipment: ExtendedEquipment) => {
    setSelectedEquipment(equipment);
    setIsShareModalOpen(true);
  };

  const handleShare = (shareData: { email?: string; link?: string }) => {
    setIsShareModalOpen(false);
    toast({
      title: isRTL ? "نجاح" : "Success",
      description: isRTL
        ? `تمت مشاركة المعدات بنجاح عبر ${shareData.email ? "البريد الإلكتروني" : "رابط"}`
        : `Equipment shared successfully via ${shareData.email ? "email" : "link"}`,
    });
  };

  const simulateAction = async (action: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      toast({
        title: isRTL ? "نجاح" : "Success",
        description: isRTL ? `تم إكمال ${action} بنجاح` : `${action} completed successfully`,
      });
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6" dir={isRTL ? "rtl" : "ltr"}>
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
          <Button onClick={() => setIsModalOpen(true)} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            {isRTL ? "إضافة معدات" : "Add Equipment"}
          </Button>
        </div>

        {/* Project Tabs */}
        <Tabs
          value={selectedProject}
          onValueChange={setSelectedProject}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
            <TabsTrigger
              value="Project A"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Project A
            </TabsTrigger>
            <TabsTrigger
              value="Project B"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Project B
            </TabsTrigger>
            <TabsTrigger
              value="Project C"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Project C
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي المعدات" : "Total Equipment"}
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? "في المشروع الحالي" : "in current project"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "نشطة" : "Active"}
                  </p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {Math.round((stats.active / stats.total || 1) * 100)}% {isRTL ? "نشط" : "active"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "تحت الصيانة" : "Maintenance"}
                  </p>
                  <p className="text-2xl font-bold">{stats.maintenance}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {Math.round((stats.maintenance / stats.total || 1) * 100)}% {isRTL ? "صيانة" : "maintenance"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "فحص مستحق" : "Due Inspection"}
                  </p>
                  <p className="text-2xl font-bold">{stats.dueInspection}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? "المعدات التي تحتاج إلى فحص" : "equipment needing inspection"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm text-gray-600">
                  {isRTL ? "حالة الوثائق" : "Document Status"}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {isRTL ? "وثائق صالحة" : "Valid Documents"}
                    </p>
                    <p className="text-2xl font-bold">
                      {projectFilteredEquipment.reduce(
                        (acc, e) => acc + e.documents.length,
                        0
                      ) - stats.expiredDocs}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {isRTL ? "وثائق منتهية" : "Expired Documents"}
                    </p>
                    <p className="text-2xl font-bold">{stats.expiredDocs}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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

        {/* Equipment Overview Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{isRTL ? "نظرة عامة على المعدات" : "Equipment Overview"}</CardTitle>
                <CardDescription>
                  {isRTL ? "إدارة ومراقبة المعدات الخاصة بك" : "Manage and monitor your equipment"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {equipmentTypes.map((type, index) => (
                <div
                  key={type.name}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setSelectedEquipmentType(type.name);
                    setFilteredEquipment(
                      projectFilteredEquipment.filter((e) => e.name === type.name)
                    );
                    setViewMode("type-list");
                  }}
                >
                  <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
                    <div className="p-2">
                      <div className="aspect-square relative">
                        <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <img
                          src={type.image}
                          alt={type.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="pt-2 text-center">
                        <h3 className="text-sm font-medium truncate">{type.name}</h3>
                        <CategoryBadge category={type.category as EquipmentCategory} size="sm" className="mt-1" />
                        <p className="text-sm text-muted-foreground mt-1">
                          {projectFilteredEquipment.filter(e => e.name === type.name).length} {isRTL ? "معدات" : "equipment"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
            <TabsTrigger
              value="list"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              {isRTL ? "عرض القائمة" : "List View"}
            </TabsTrigger>
            <TabsTrigger
              value="detail"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              {isRTL ? "عرض التفاصيل" : "Detail View"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <EquipmentList
              equipment={projectFilteredEquipment}
              onSelect={handleSelectEquipment}
            />
          </TabsContent>

          <TabsContent value="detail" className="mt-6">
            {viewMode === "categories" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(groupedEquipment).map(([type, equipment]) => (
                  <EquipmentCategoryCard
                    key={type}
                    equipment={equipment.filter((e) => e.project === selectedProject)}
                    equipmentType={type}
                    category={equipment[0].category}
                    image={equipment[0].image}
                    onClick={() => {
                      setSelectedEquipmentType(type);
                      setFilteredEquipment(
                        projectFilteredEquipment.filter((e) => e.name === type)
                      );
                      setViewMode("type-list");
                    }}
                  />
                ))}
              </div>
            )}

            {viewMode === "type-list" && (
              <EquipmentTypeList
                equipment={filteredEquipment}
                equipmentType={selectedEquipmentType}
                onBack={() => setViewMode("categories")}
                onSelectEquipment={(equipment) => {
                  const extendedEquipment = filteredEquipment.find(e => e.id === equipment.id);
                  if (extendedEquipment) {
                    setSelectedEquipment(extendedEquipment);
                    setViewMode("detail");
                  }
                }}
                isRTL={isRTL}
              />
            )}

            {viewMode === "detail" && selectedEquipment && (
              <EquipmentDetail
                equipment={selectedEquipment}
                onBack={() => setViewMode("type-list")}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" className="flex gap-2" disabled={loading}>
            <Video className="h-4 w-4" />
            {isRTL ? "شاهد الفيديو التعليمي" : "Watch Tutorial"}
          </Button>
          <Button onClick={() => setIsModalOpen(true)} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            {isRTL ? "إضافة معدات" : "Add Equipment"}
          </Button>
        </div>

        {/* Add Equipment Modal */}
        <AddEquipmentModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          equipmentTypes={equipmentTypes}
          selectedEquipmentType={selectedEquipmentType}
          setSelectedEquipmentType={setSelectedEquipmentType}
          loading={loading}
          onSubmit={async (formData, documentSections) => {
            // Real API call to add equipment
            const allFiles = documentSections.flatMap(section => section.files);
            const uploadFormData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
              uploadFormData.append(key, value === undefined || value === null || value === '' ? 'null' : value);
            });
            documentSections.forEach((section, sectionIndex) => {
              section.files.forEach((file, fileIndex) => {
                uploadFormData.append(`documents[${sectionIndex}][id]`, section.id);
                uploadFormData.append(`documents[${sectionIndex}][files][${fileIndex}][name]`, file.name);
                uploadFormData.append(`documents[${sectionIndex}][files][${fileIndex}][size]`, file.size.toString());
                uploadFormData.append(`documents[${sectionIndex}][files][${fileIndex}][type]`, file.type);
                uploadFormData.append(`documents[${sectionIndex}][files][${fileIndex}][status]`, file.status);
              });
            });
            allFiles.forEach((file, index) => {
              if (file.fileObject) {
                uploadFormData.append(`files[${index}]`, file.fileObject, file.name);
              }
            });
            await fetch('https://laravel.mysignages.com/api/add/equipment', {
              method: 'POST',
              body: uploadFormData,
            });
            await fetchEquipment();
            setIsModalOpen(false);
          }}
          isRTL={isRTL}
          onCancel={() => setIsModalOpen(false)}
        />

        {/* Share Equipment Modal */}
        <ShareEquipmentModal
          open={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          equipment={selectedEquipment}
          onShare={handleShare}
          loading={loading}
          isRTL={isRTL}
        />
      </div>
    </DashboardLayout>
  );
};

export default EquipmentRegistry;
export { SAMPLE_EQUIPMENT };