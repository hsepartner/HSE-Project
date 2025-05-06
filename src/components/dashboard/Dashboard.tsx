import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  FileText,
  Settings,
  Truck,
  Bell,
  ClipboardCheck,
  BarChart3,
  AlertTriangle,
  Upload,
  PlusCircle,
  Loader2,
  Badge,
  Info,
  File,
  Search,
} from "lucide-react";
import { StatusCard } from "./StatusCard";
import { useToast } from "@/components/ui/use-toast";
import { StatusBadge } from "../equipment/StatusBadge";
import { CategoryBadge } from "../equipment/CategoryBadge";
import { WelcomeHeader } from "./WelcomeHeader";
import { UserRoleBadge } from "../user/UserRoleBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { EquipmentCategory, OperationalStatus } from "@/types/equipment";

// Define interfaces
interface EquipmentItem {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  category: EquipmentCategory;
  status: OperationalStatus;
  compliance: number;
  image?: string;
}

interface EquipmentType {
  name: string;
  image: string;
  category: EquipmentCategory;
}

interface Alert {
  id: number;
  title: string;
  description: string;
  type: "urgent" | "warning" | "valid";
  icon: React.ComponentType<{ className?: string }>;
  date: string;
}

interface Activity {
  id: number;
  action: string;
  details: string;
  user: string;
  timestamp: string;
}

// Mock data
const equipmentItems: EquipmentItem[] = [
  {
    id: 1,
    name: "Excavator XL2000",
    model: "CAT 320",
    serialNumber: "CAT320-45678",
    category: "heavy",
    status: "active",
    compliance: 92,
    image: "/images/Excavator.png",
  },
  {
    id: 2,
    name: "Utility Truck",
    model: "Ford F-450",
    serialNumber: "FORD450-78901",
    category: "light",
    status: "maintenance",
    compliance: 65,
    image: "/images/JCB.png",
  },
  {
    id: 3,
    name: "Portable Generator",
    model: "Honda EU7000",
    serialNumber: "HONDAEU7-12345",
    category: "power-tool",
    status: "active",
    compliance: 78,
  },
  {
    id: 4,
    name: "Concrete Mixer",
    model: "PremierMix 500",
    serialNumber: "PRMX500-56789",
    category: "heavy",
    status: "decommissioned",
    compliance: 20,
    image: "/images/WheelLoader.png",
  },
];

const equipmentTypes: EquipmentType[] = [
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

const allAlerts: Alert[] = [
  {
    id: 1,
    title: "5 Expiring Documents",
    description: "Within next 7 days",
    type: "urgent",
    icon: AlertTriangle,
    date: "2024-04-26",
  },
  {
    id: 2,
    title: "8 Scheduled Inspections",
    description: "This week",
    type: "warning",
    icon: Calendar,
    date: "2024-04-25",
  },
  {
    id: 3,
    title: "3 Documents Verified",
    description: "Today",
    type: "valid",
    icon: FileText,
    date: "2024-04-26",
  },
];

const recentActivities: Activity[] = [
  {
    id: 1,
    action: "Document Uploaded",
    details: "Operation Certificate for Excavator XL2000",
    user: "John Smith",
    timestamp: "2024-04-26 09:00",
  },
  {
    id: 2,
    action: "Inspection Scheduled",
    details: "Utility Truck scheduled for 2024-04-28",
    user: "Maria Rodriguez",
    timestamp: "2024-04-25 14:15",
  },
  {
    id: 3,
    action: "Equipment Status Updated",
    details: "Concrete Mixer marked as DECOMMISSIONED",
    user: "Ahmed Hassan",
    timestamp: "2024-04-24 11:00",
  },
];

export function Dashboard() {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const [showExpiryAlert, setShowExpiryAlert] = useState(true);
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<
    "admin" | "operator" | "maintenance" | "hse"
  >("admin");
  const [openModal, setOpenModal] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(
    null
  );
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (
      savedRole &&
      ["admin", "operator", "maintenance", "hse"].includes(savedRole)
    ) {
      setUserRole(savedRole as "admin" | "operator" | "maintenance" | "hse");
    }
  }, []);

  const dismissNotification = () => {
    setShowExpiryAlert(false);
    toast({
      title: isRTL ? "تم تجاهل الإشعار" : "Notification dismissed",
      description: isRTL ? "سيتم تذكيرك غدًا" : "You'll be reminded again tomorrow",
    });
  };

  const handleButtonClick = (modalType: string, equipmentId?: number) => {
    if (equipmentId) {
      const equipment = equipmentItems.find((item) => item.id === equipmentId);
      setSelectedEquipment(equipment || null);
    } else {
      setSelectedEquipment(null);
    }
    setOpenModal(modalType);
  };

  const simulateAction = (action: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenModal("");
      toast({
        title: isRTL ? "نجاح" : "Success",
        description: isRTL ? `تم إكمال ${action} بنجاح` : `${action} completed successfully`,
      });
    }, 2000);
  };

  const filteredEquipmentItems = equipmentItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={cn(
        "min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 space-y-6",
        isRTL && "rtl"
      )}
    >
      <WelcomeHeader />

      {/* Equipment Showcase */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {equipmentTypes.slice(0, 5).map((type) => (
          <div
            key={type.name}
            className="relative group cursor-pointer"
            onClick={() => handleButtonClick("addEquipment")}
            role="button"
            aria-label={`Add ${type.name} equipment`}
          >
            <div className="overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-all">
              <div className="p-2">
                <div className="aspect-square relative">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="absolute inset-0 w-full h-full object-contain p-4 transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="p-2 text-center">
                  <p className="text-sm font-medium truncate">{type.name}</p>
                  <CategoryBadge category={type.category} size="sm" className="mt-1" />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="text-center">
                  <PlusCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    {isRTL ? "إضافة معدات جديدة" : "Add New Equipment"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title={isRTL ? "إجمالي المعدات" : "Total Equipment"}
          value={28}
          description={isRTL ? "+2 من الشهر الماضي" : "+2 from last month"}
          status="valid"
          icon={Truck}
        />
        <StatusCard
          title={isRTL ? "نشط" : "Active"}
          value={23}
          description={isRTL ? "82% من الإجمالي" : "82% of total"}
          status="valid"
          icon={ClipboardCheck}
        />
        <StatusCard
          title={isRTL ? "في الصيانة" : "In Maintenance"}
          value={4}
          description={isRTL ? "+2 من الأسبوع الماضي" : "+2 from last week"}
          status="warning"
          icon={Settings}
        />
        <StatusCard
          title={isRTL ? "يحتاج إلى الاهتمام" : "Needs Attention"}
          value={7}
          description={isRTL ? "يتطلب المراجعة" : "Requires review"}
          status="urgent"
          icon={AlertTriangle}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full bg-gray-100 rounded-lg p-1 grid grid-cols-2 sm:grid-cols-4">
          <TabsTrigger
            value="overview"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
          >
            {isRTL ? "نظرة عامة" : "Overview"}
          </TabsTrigger>
          <TabsTrigger
            value="checklist"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
          >
            {isRTL ? "قوائم التحقق" : "Checklist Uploads"}
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
          >
            {isRTL ? "متتبع الوثائق" : "Document Tracker"}
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
          >
            {isRTL ? "جدول الصيانة" : "Maintenance Schedule"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-5 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <CardTitle>
                    {isRTL ? "نظرة عامة على حالة المعدات" : "Equipment Status Overview"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL
                      ? "مراقبة حالة الامتثال وتسجيل المعدات"
                      : "Monitor equipment compliance and documentation status"}
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-64 mt-4 sm:mt-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder={isRTL ? "البحث في المعدات..." : "Search equipment..."}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label={isRTL ? "البحث في المعدات" : "Search equipment"}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <div className="bg-gray-100 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">{isRTL ? "المعدات" : "Equipment"}</div>
                    <div className="col-span-2">{isRTL ? "الفئة" : "Category"}</div>
                    <div className="col-span-2">{isRTL ? "الحالة" : "Status"}</div>
                    <div className="col-span-2">{isRTL ? "الامتثال" : "Compliance"}</div>
                    <div className="col-span-2">
                      {isRTL ? "التفتيش التالي" : "Next Inspection"}
                    </div>
                  </div>
                  <ScrollArea className="h-[300px]">
                    {filteredEquipmentItems.length > 0 ? (
                      filteredEquipmentItems.map((item) => (
                        <div
                          key={item.id}
                          className="py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleButtonClick("equipmentDetail", item.id)}
                          role="button"
                          aria-label={`View details for ${item.name}`}
                        >
                          <div className="col-span-4">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              {item.model} • {item.serialNumber}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <CategoryBadge category={item.category} size="sm" />
                          </div>
                          <div className="col-span-2">
                            <StatusBadge status={item.status} size="sm" />
                          </div>
                          <div className="col-span-2">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  item.compliance > 80
                                    ? "bg-green-500"
                                    : item.compliance > 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${item.compliance}%` }}
                              ></div>
                            </div>
                            <div className="text-xs mt-1">{item.compliance}%</div>
                          </div>
                          <div className="col-span-2 text-sm">
                            <span
                              className={`text-${
                                item.compliance > 80
                                  ? "green"
                                  : item.compliance > 50
                                  ? "yellow"
                                  : "red"
                              }-500 font-medium`}
                            >
                              {item.compliance > 80
                                ? "120 days"
                                : item.compliance > 50
                                ? "14 days"
                                : "5 days"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        {isRTL
                          ? "لا توجد معدات تطابق معايير البحث"
                          : "No equipment matches your search"}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{isRTL ? "التنبيهات" : "Alerts"}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleButtonClick("allAlerts")}
                          aria-label={isRTL ? "عرض جميع التنبيهات" : "View all alerts"}
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isRTL ? "عرض جميع التنبيهات" : "View all alerts"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>
                  {isRTL ? "الإشعارات الأخيرة" : "Recent notifications"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`border-l-4 border-${
                        alert.type === "urgent"
                          ? "red"
                          : alert.type === "warning"
                          ? "yellow"
                          : "green"
                      }-500 p-3 bg-${
                        alert.type === "urgent"
                          ? "red"
                          : alert.type === "warning"
                          ? "yellow"
                          : "green"
                      }-50 rounded-lg transition-all hover:bg-${
                        alert.type === "urgent"
                          ? "red"
                          : alert.type === "warning"
                          ? "yellow"
                          : "green"
                      }-100`}
                    >
                      <div className="flex items-start">
                        <alert.icon
                          className={`h-4 w-4 text-${
                            alert.type === "urgent"
                              ? "red"
                              : alert.type === "warning"
                              ? "yellow"
                              : "green"
                          }-500 mr-2 mt-0.5 flex-shrink-0`}
                        />
                        <div>
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-xs text-gray-500">{alert.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleButtonClick("allAlerts")}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    {isRTL ? "عرض جميع التنبيهات" : "View All Alerts"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card className="col-span-1 md:col-span-2 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{isRTL ? "سجل المعدات" : "Equipment Registry"}</CardTitle>
                <CardDescription>
                  {isRTL
                    ? "إدارة مخزون المعدات والشهادات والامتثال"
                    : "Manage your equipment inventory, certificates, and compliance"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Truck className="h-32 w-32 mb-6 text-gray-400" />
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 transition-all"
                  onClick={() => handleButtonClick("equipmentRegistry")}
                >
                  <Link to="/equipment">
                    <Truck className="h-4 w-4 mr-2" />
                    {isRTL ? "الذهاب إلى سجل المعدات" : "Go to Equipment Registry"}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{isRTL ? "أدوار المستخدم" : "User Roles"}</CardTitle>
                <CardDescription>
                  {isRTL ? "مستويات وصول متعددة للمستخدم" : "Multiple user access levels"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <UserRoleBadge role="admin" />
                  <UserRoleBadge role="operator" />
                  <UserRoleBadge role="maintenance" />
                  <UserRoleBadge role="hse" />
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500 text-center">
                    {isRTL ? "أنت مسجل الدخول كـ: " : "You are logged in as: "}
                    <span
                      className="font-medium cursor-pointer text-blue-600 hover:underline"
                      onClick={() => handleButtonClick("roleInfo")}
                    >
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{isRTL ? "إجراءات سريعة" : "Quick Actions"}</CardTitle>
                <CardDescription>
                  {isRTL ? "المهام والاختصارات الشائعة" : "Common tasks and shortcuts"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start hover:bg-gray-100"
                          onClick={() => handleButtonClick("addEquipment")}
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          {isRTL ? "إضافة معدات جديدة" : "Add New Equipment"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isRTL
                            ? "تسجيل معدات جديدة في النظام"
                            : "Register new equipment in the system"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start hover:bg-gray-100"
                          onClick={() => handleButtonClick("uploadDocument")}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          {isRTL ? "رفع وثيقة" : "Upload Document"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isRTL
                            ? "إضافة وثائق للامتثال"
                            : "Add documentation for compliance"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start hover:bg-gray-100"
                          onClick={() => handleButtonClick("scheduleInspection")}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          {isRTL ? "جدولة التفتيش" : "Schedule Inspection"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isRTL
                            ? "ترتيب تفتيش أو صيانة"
                            : "Arrange an inspection or maintenance"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start hover:bg-gray-100"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          {isRTL ? "عرض التحليلات" : "View Analytics"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isRTL ? "استعراض بيانات الأداء" : "Review performance data"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{isRTL ? "النشاط الأخير" : "Recent Activity"}</CardTitle>
              <CardDescription>
                {isRTL ? "سجل الإجراءات الأخيرة في النظام" : "Log of recent system actions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.details}</p>
                        <p className="text-xs text-gray-500">by {activity.user}</p>
                      </div>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{isRTL ? "رفع قوائم التحقق" : "Checklist Uploads"}</CardTitle>
              <CardDescription>
                {isRTL
                  ? "رفع وإدارة قوائم التحقق والنماذج"
                  : "Upload and manage inspection checklists and forms"}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center flex-col">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ClipboardCheck className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-center mb-4 max-w-lg">
                {isRTL
                  ? "رفع قوائم التحقق وتقارير التفتيش لصيانة المعدات والامتثال. رفع قوائم التحقق اليومية للمشغلين والنماذج الشهرية للصيانة."
                  : "Upload checklists and inspection reports for equipment maintenance and compliance. Upload daily operator checklists and monthly maintenance forms."}
              </p>
              <div className="flex gap-3">
                <Button variant="outline">
                  {isRTL ? "قائمة التحقق اليومية" : "Daily Checklist"}
                </Button>
                <Button onClick={() => handleButtonClick("uploadDocument")}>
                  {isRTL ? "رفع قائمة التحقق" : "Upload Checklist"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <CardTitle>{isRTL ? "متتبع الوثائق" : "Document Tracker"}</CardTitle>
                <CardDescription>
                  {isRTL
                    ? "تتبع جميع وثائق المعدات والشهادات"
                    : "Track all equipment documentation and certificates"}
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64 mt-4 sm:mt-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder={isRTL ? "البحث في الوثائق..." : "Search documents..."}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label={isRTL ? "البحث في الوثائق" : "Search documents"}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-gray-100 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">{isRTL ? "الوثيقة" : "Document"}</div>
                  <div className="col-span-3">{isRTL ? "المعدات" : "Equipment"}</div>
                  <div className="col-span-2">{isRTL ? "الحالة" : "Status"}</div>
                  <div className="col-span-3">
                    {isRTL ? "تاريخ الانتهاء" : "Expiry Date"}
                  </div>
                </div>
                <ScrollArea className="h-[300px]">
                  {[
                    {
                      name: "Operation Certificate",
                      equipment: "Excavator XL2000",
                      status: "Valid",
                      expiry: "2025-08-15",
                      statusClass: "bg-green-500 text-white",
                    },
                    {
                      name: "Registration",
                      equipment: "Utility Truck",
                      status: "Expiring Soon",
                      expiry: "2024-07-15",
                      statusClass: "bg-yellow-500 text-white",
                    },
                    {
                      name: "Electrical Safety Inspection",
                      equipment: "Portable Generator",
                      status: "Critical",
                      expiry: "2024-05-05",
                      statusClass: "bg-red-500 text-white",
                    },
                    {
                      name: "Decommission Report",
                      equipment: "Concrete Mixer",
                      status: "Expired",
                      expiry: "2024-03-01",
                      statusClass: "bg-gray-500 text-white",
                    },
                  ]
                    .filter(
                      (doc) =>
                        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        doc.equipment.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((doc, index) => (
                      <div
                        key={index}
                        className="py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleButtonClick("documentDetail")}
                        role="button"
                        aria-label={`View details for ${doc.name}`}
                      >
                        <div className="col-span-4 font-medium">{doc.name}</div>
                        <div className="col-span-3 text-sm">{doc.equipment}</div>
                        <div className="col-span-2">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${doc.statusClass}`}
                          >
                            {doc.status}
                          </div>
                        </div>
                        <div className="col-span-3 text-sm">{doc.expiry}</div>
                      </div>
                    ))}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <CardTitle>{isRTL ? "جدول الصيانة" : "Maintenance Schedule"}</CardTitle>
                <CardDescription>
                  {isRTL
                    ? "عرض أنشطة الصيانة القادمة وجداول الخدمة"
                    : "View upcoming maintenance activities and service schedules"}
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64 mt-4 sm:mt-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder={isRTL ? "البحث في الصيانة..." : "Search maintenance..."}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label={isRTL ? "البحث في الصيانة" : "Search maintenance"}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-gray-100 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">{isRTL ? "المعدات" : "Equipment"}</div>
                  <div className="col-span-3">{isRTL ? "النوع" : "Type"}</div>
                  <div className="col-span-3">{isRTL ? "التاريخ" : "Date"}</div>
                  <div className="col-span-2">{isRTL ? "الحالة" : "Status"}</div>
                </div>
                <ScrollArea className="h-[300px]">
                  {[
                    {
                      equipment: "Excavator XL2000",
                      type: "Routine Service",
                      date: "2024-05-15",
                      status: "Scheduled",
                      statusClass: "bg-yellow-500 text-white",
                    },
                    {
                      equipment: "Utility Truck",
                      type: "Repair",
                      date: "2024-04-28",
                      status: "In Progress",
                      statusClass: "bg-red-500 text-white",
                    },
                    {
                      equipment: "Portable Generator",
                      type: "Calibration",
                      date: "2024-05-05",
                      status: "Scheduled",
                      statusClass: "bg-yellow-500 text-white",
                    },
                    {
                      equipment: "Wheel Loader",
                      type: "Overhaul",
                      date: "2024-04-15",
                      status: "Completed",
                      statusClass: "bg-green-500 text-white",
                    },
                  ]
                    .filter(
                      (item) =>
                        item.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.type.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item, index) => (
                      <div
                        key={index}
                        className="py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 transition-colors"
                      >
                        <div className="col-span-4 font-medium">{item.equipment}</div>
                        <div className="col-span-3 text-sm">{item.type}</div>
                        <div className="col-span-3 text-sm">{item.date}</div>
                        <div className="col-span-2">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.statusClass}`}
                          >
                            {item.status}
                          </div>
                        </div>
                      </div>
                    ))}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Equipment Detail Modal */}
      <Dialog
        open={openModal === "equipmentDetail"}
        onOpenChange={() => setOpenModal("")}
      >
        <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isRTL ? "تفاصيل المعدات" : "Equipment Details"}</DialogTitle>
            <DialogDescription>
              {selectedEquipment
                ? isRTL
                  ? `تفاصيل لـ ${selectedEquipment.name}`
                  : `Details for ${selectedEquipment.name}`
                : isRTL
                ? "معلومات المعدات"
                : "Equipment information"}
            </DialogDescription>
          </DialogHeader>

          {selectedEquipment && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>{isRTL ? "اسم المعدات" : "Equipment Name"}</Label>
                  <p className="mt-1 text-sm font-medium">{selectedEquipment.name}</p>
                </div>
                <div>
                  <Label>{isRTL ? "الطراز" : "Model"}</Label>
                  <p className="mt-1 text-sm font-medium">{selectedEquipment.model}</p>
                </div>
                <div>
                  <Label>{isRTL ? "الرقم التسلسلي" : "Serial Number"}</Label>
                  <p className="mt-1 text-sm font-medium">
                    {selectedEquipment.serialNumber}
                  </p>
                </div>
                <div>
                  <Label>{isRTL ? "الفئة" : "Category"}</Label>
                  <div className="mt-1">
                    <CategoryBadge category={selectedEquipment.category} size="sm" />
                  </div>
                </div>
                <div>
                  <Label>{isRTL ? "الحالة" : "Status"}</Label>
                  <div className="mt-1">
                    <StatusBadge status={selectedEquipment.status} size="sm" />
                  </div>
                </div>
              </div>

              <div>
                <Label>{isRTL ? "حالة الامتثال" : "Compliance Status"}</Label>
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`bg-${
                        selectedEquipment.compliance > 80
                          ? "green"
                          : selectedEquipment.compliance > 50
                          ? "yellow"
                          : "red"
                      }-500 h-full`}
                      style={{ width: `${selectedEquipment.compliance}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 flex justify-between">
                    <span>
                      {selectedEquipment.compliance}% {isRTL ? "مكتمل" : "Complete"}
                    </span>
                    <span className="text-gray-500">
                      {isRTL ? "آخر تحديث: 2024-04-23" : "Last updated: 2024-04-23"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{isRTL ? "الوثائق المرتبطة" : "Associated Documents"}</Label>
                <div className="bg-gray-50 rounded-lg p-2 space-y-2">
                  <div className="flex items-center justify-between rounded hover:bg-gray-100 p-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">
                        {isRTL ? "شهادة التشغيل" : "Operation Certificate"}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {isRTL ? "صالح حتى 2025-08-15" : "Valid until 2025-08-15"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded hover:bg-gray-100 p-2">
                    <div className="flex items-center">
                      <File className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">
                        {isRTL ? "سجل الخدمة" : "Service Record"}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {isRTL ? "تم التحديث منذ 14 يومًا" : "Updated 14 days ago"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() =>
                handleButtonClick("scheduleInspection", selectedEquipment?.id)
              }
            >
              <Calendar className="h-4 w-4 mr-2" />
              {isRTL ? "جدولة التفتيش" : "Schedule Inspection"}
            </Button>

            <Button
              onClick={() => handleButtonClick("editEquipment", selectedEquipment?.id)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isRTL ? "تعديل المعدات" : "Edit Equipment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Equipment Modal */}
      <Dialog open={openModal === "addEquipment"} onOpenChange={() => setOpenModal("")}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] lg:max-w-[1000px] w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isRTL ? "إضافة معدات جديدة" : "Add New Equipment"}</DialogTitle>
            <DialogDescription>
              {isRTL
                ? "اختر نوع المعدات وأدخل التفاصيل لتسجيل معدات جديدة"
                : "Select equipment type and enter details to register new equipment"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>{isRTL ? "نوع المعدات" : "Equipment Type"}</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {equipmentTypes.map((type) => (
                  <div
                    key={type.name}
                    className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                      selectedEquipmentType === type.name
                        ? "border-blue-500 bg-blue-50"
                        : "hover:border-blue-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedEquipmentType(type.name)}
                    role="button"
                    aria-label={`Select ${type.name}`}
                  >
                    <img
                      src={type.image}
                      alt={type.name}
                      className="w-24 h-24 object-contain mb-2"
                    />
                    <span className="text-sm font-medium text-center">
                      {type.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{isRTL ? "اسم المعدات" : "Equipment Name"}</Label>
                <Input
                  id="name"
                  placeholder={isRTL ? "مثال: Excavator XL3000" : "e.g. Excavator XL3000"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">{isRTL ? "الطراز" : "Model"}</Label>
                <Input id="model" placeholder={isRTL ? "مثال: CAT 320" : "e.g. CAT 320"} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serial">{isRTL ? "الرقم التسلسلي" : "Serial Number"}</Label>
                <Input
                  id="serial"
                  placeholder={isRTL ? "مثال: CAT320-45678" : "e.g. CAT320-45678"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{isRTL ? "الفئة" : "Category"}</Label>
                <Select
                  defaultValue={
                    equipmentTypes.find((type) => type.name === selectedEquipmentType)?.category
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر الفئة" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heavy">
                      {isRTL ? "معدات ثقيلة" : "Heavy Equipment"}
                    </SelectItem>
                    <SelectItem value="light">
                      {isRTL ? "مركبة خفيفة" : "Light Vehicle"}
                    </SelectItem>
                    <SelectItem value="power-tool">
                      {isRTL ? "أداة كهربائية" : "Power Tool"}
                    </SelectItem>
                    <SelectItem value="safety">
                      {isRTL ? "معدات السلامة" : "Safety Equipment"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{isRTL ? "الوصف" : "Description"}</Label>
              <Textarea
                id="description"
                placeholder={
                  isRTL ? "وصف موجز للمعدات..." : "Brief description of the equipment..."
                }
              />
            </div>

            <div className="space-y-2">
              <Label>{isRTL ? "الحالة الأولية" : "Initial Status"}</Label>
              <div className="flex flex-wrap gap-4 mt-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="active"
                    name="status"
                    className="form-radio"
                  />
                  <Label htmlFor="active" className="cursor-pointer">
                    {isRTL ? "نشط" : "Active"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="maintenance"
                    name="status"
                    className="form-radio"
                  />
                  <Label htmlFor="maintenance" className="cursor-pointer">
                    {isRTL ? "في الصيانة" : "In Maintenance"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="stored"
                    name="status"
                    className="form-radio"
                  />
                  <Label htmlFor="stored" className="cursor-pointer">
                    {isRTL ? "مخزن" : "Stored"}
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{isRTL ? "الوثائق الأولية" : "Initial Documents"}</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  {isRTL
                    ? "اسحب وأسقط الملفات هنا أو انقر للتصفح"
                    : "Drag & drop files here or click to browse"}
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  {isRTL ? "اختر الملفات" : "Select Files"}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal("")}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={() =>
                simulateAction(isRTL ? "تسجيل المعدات" : "Equipment registration")
              }
              disabled={loading}
              className="bg-green-500 hover:bg-green-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRTL ? "جارٍ المعالجة..." : "Processing..."}
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {isRTL ? "تسجيل المعدات" : "Register Equipment"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog
        open={openModal === "uploadDocument"}
        onOpenChange={() => setOpenModal("")}
      >
        <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isRTL ? "رفع وثيقة" : "Upload Document"}</DialogTitle>
            <DialogDescription>
              {isRTL
                ? "إضافة وثائق للامتثال والشهادات"
                : "Add documentation for equipment compliance and certification"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="doctype">{isRTL ? "نوع الوثيقة" : "Document Type"}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={isRTL ? "اختر نوع الوثيقة" : "Select document type"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="certificate">
                    {isRTL ? "شهادة التشغيل" : "Operation Certificate"}
                  </SelectItem>
                  <SelectItem value="inspection">
                    {isRTL ? "تقرير التفتيش" : "Inspection Report"}
                  </SelectItem>
                  <SelectItem value="maintenance">
                    {isRTL ? "سجل الصيانة" : "Maintenance Record"}
                  </SelectItem>
                  <SelectItem value="calibration">
                    {isRTL ? "شهادة المعايرة" : "Calibration Certificate"}
                  </SelectItem>
                  <SelectItem value="registration">
                    {isRTL ? "وثيقة التسجيل" : "Registration Document"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">{isRTL ? "المعدات المرتبطة" : "Related Equipment"}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? "اختر المعدات" : "Select equipment"} />
                </SelectTrigger>
                <SelectContent>
                  {equipmentItems.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name} ({item.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">{isRTL ? "تاريخ الإصدار" : "Issue Date"}</Label>
                <Input id="issueDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">{isRTL ? "تاريخ الانتهاء" : "Expiry Date"}</Label>
                <Input id="expiryDate" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">{isRTL ? "رقم المرجع" : "Reference Number"}</Label>
              <Input
                id="reference"
                placeholder={isRTL ? "مثال: CERT-2024-0042" : "e.g. CERT-2024-0042"}
              />
            </div>

            <div className="space-y-2">
              <Label>{isRTL ? "ملف الوثيقة" : "Document File"}</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  {isRTL
                    ? "اسحب وأسقط الملف هنا أو انقر للتصفح"
                    : "Drag & drop file here or click to browse"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {isRTL
                    ? "الصيغ المدعومة: PDF، JPG، PNG (الحد الأقصى 10 ميغابايت)"
                    : "Supported formats: PDF, JPG, PNG (max 10MB)"}
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  {isRTL ? "اختر الملف" : "Select File"}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal("")}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={() =>
                simulateAction(isRTL ? "رفع الوثيقة" : "Document upload")
              }
              disabled={loading}
              className="bg-green-500 hover:bg-green-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRTL ? "جارٍ الرفع..." : "Uploading..."}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {isRTL ? "رفع الوثيقة" : "Upload Document"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Inspection Modal */}
      <Dialog
        open={openModal === "scheduleInspection"}
        onOpenChange={() => setOpenModal("")}
      >
        <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isRTL ? "جدولة التفتيش" : "Schedule Inspection"}</DialogTitle>
            <DialogDescription>
              {selectedEquipment
                ? isRTL
                  ? `جدولة تفتيش لـ ${selectedEquipment.name}`
                  : `Schedule an inspection for ${selectedEquipment.name}`
                : isRTL
                ? "جدولة تفتيش أو نشاط صيانة"
                : "Schedule an inspection or maintenance activity"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {!selectedEquipment && (
              <div className="space-y-2">
                <Label htmlFor="equipment">{isRTL ? "المعدات" : "Equipment"}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر المعدات" : "Select equipment"} />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentItems.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name} ({item.model})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="activityType">{isRTL ? "نوع النشاط" : "Activity Type"}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={isRTL ? "اختر نوع النشاط" : "Select activity type"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">
                    {isRTL ? "خدمة روتينية" : "Routine Service"}
                  </SelectItem>
                  <SelectItem value="safety">
                    {isRTL ? "تفتيش السلامة" : "Safety Inspection"}
                  </SelectItem>
                  <SelectItem value="repair">{isRTL ? "إصلاح" : "Repair"}</SelectItem>
                  <SelectItem value="calibration">
                    {isRTL ? "معايرة" : "Calibration"}
                  </SelectItem>
                  <SelectItem value="overhaul">
                    {isRTL ? "إصلاح شامل" : "Major Overhaul"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">
                  {isRTL ? "التاريخ المجدول" : "Scheduled Date"}
                </Label>
                <Input id="scheduledDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">
                  {isRTL ? "المدة المتوقعة" : "Estimated Duration"}
                </Label>
                <div className="flex space-x-2">
                  <Input id="duration" type="number" min="1" placeholder="1" />
                  <Select defaultValue="days">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">{isRTL ? "ساعات" : "Hours"}</SelectItem>
                      <SelectItem value="days">{isRTL ? "أيام" : "Days"}</SelectItem>
                      <SelectItem value="weeks">{isRTL ? "أسابيع" : "Weeks"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">{isRTL ? "معين إلى" : "Assigned To"}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? "اختر فني" : "Select technician"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech1">
                    {isRTL ? "جون سميث (الصيانة)" : "John Smith (Maintenance)"}
                  </SelectItem>
                  <SelectItem value="tech2">
                    {isRTL
                      ? "ماريا رودريغيز (مفتش السلامة)"
                      : "Maria Rodriguez (Safety Inspector)"}
                  </SelectItem>
                  <SelectItem value="tech3">
                    {isRTL
                      ? "أحمد حسن (أخصائي المعايرة)"
                      : "Ahmed Hassan (Calibration Specialist)"}
                  </SelectItem>
                  <SelectItem value="tech4">
                    {isRTL ? "سارة ويلسون (فني رئيسي)" : "Sarah Wilson (Lead Technician)"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{isRTL ? "الملاحظات والتعليمات" : "Notes & Instructions"}</Label>
              <Textarea
                id="notes"
                placeholder={
                  isRTL
                    ? "أضف أي تعليمات أو متطلبات محددة..."
                    : "Add any specific instructions or requirements..."
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>
                  {isRTL
                    ? "إرسال إشعارات البريد الإلكتروني إلى الأشخاص المعينين"
                    : "Send email notifications to assigned personnel"}
                </span>
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal("")}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={() =>
                simulateAction(isRTL ? "جدولة التفتيش" : "Inspection scheduling")
              }
              disabled={loading}
              className="bg-green-500 hover:bg-green-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRTL ? "جارٍ الجدولة..." : "Scheduling..."}
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  {isRTL ? "جدولة" : "Schedule"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* All Alerts Modal */}
      <Dialog open={openModal === "allAlerts"} onOpenChange={() => setOpenModal("")}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isRTL ? "جميع الإشعارات" : "All Notifications"}</DialogTitle>
            <DialogDescription>
              {isRTL
                ? "مراجعة تنبيهات النظام والإشعارات"
                : "Review system alerts and notifications"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-80">
            <div className="space-y-3 pr-4">
              {allAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 border-${
                    alert.type === "urgent"
                      ? "red"
                      : alert.type === "warning"
                      ? "yellow"
                      : "green"
                  }-500 p-3 bg-${
                    alert.type === "urgent"
                      ? "red"
                      : alert.type === "warning"
                      ? "yellow"
                      : "green"
                  }-50 rounded-lg hover:bg-${
                    alert.type === "urgent"
                      ? "red"
                      : alert.type === "warning"
                      ? "yellow"
                      : "green"
                  }-100 cursor-pointer transition-colors flex items-start justify-between`}
                >
                  <div className="flex items-start">
                    <alert.icon
                      className={`h-5 w-5 text-${
                        alert.type === "urgent"
                          ? "red"
                          : alert.type === "warning"
                          ? "yellow"
                          : "green"
                        }-500 mr-3 mt-0.5 flex-shrink-0`}
                    />
                    <div>
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-gray-500">{alert.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {alert.date}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="ghost" size="sm">
              {isRTL ? "وضع علامة مقروء على الكل" : "Mark all as read"}
            </Button>
            <Button size="sm">{isRTL ? "تكوين التنبيهات" : "Configure Alerts"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Equipment Registry Modal */}
      <Dialog
        open={openModal === "equipmentRegistry"}
        onOpenChange={() => setOpenModal("")}
      >
        <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] lg:max-w-[1200px] w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isRTL ? "سجل المعدات" : "Equipment Registry"}</DialogTitle>
            <DialogDescription>
              {isRTL
                ? "نظام إدارة المعدات الشامل"
                : "Comprehensive equipment management system"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  {isRTL ? "تصدير" : "Export"}
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  {isRTL ? "فلاتر" : "Filters"}
                </Button>
              </div>
              <Button
                size="sm"
                onClick={() => handleButtonClick("addEquipment")}
                className="bg-green-500 hover:bg-green-600"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {isRTL ? "إضافة معدات" : "Add Equipment"}
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3">{isRTL ? "اسم المعدات" : "Equipment Name"}</div>
                <div className="col-span-2">{isRTL ? "الطراز/التسلسلي" : "Model/Serial"}</div>
                <div className="col-span-2">{isRTL ? "الفئة" : "Category"}</div>
                <div className="col-span-2">{isRTL ? "الحالة" : "Status"}</div>
                <div className="col-span-1">{isRTL ? "الامتثال" : "Compliance"}</div>
                <div className="col-span-2">{isRTL ? "الإجراءات" : "Actions"}</div>
              </div>
              <ScrollArea className="h-[300px]">
                {filteredEquipmentItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-3 font-medium">{item.name}</div>
                    <div className="col-span-2 text-sm text-gray-500">
                      {item.model}
                      <br />
                      {item.serialNumber}
                    </div>
                    <div className="col-span-2">
                      <CategoryBadge category={item.category} size="sm" />
                    </div>
                    <div className="col-span-2">
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <div className="col-span-1">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`bg-${
                            item.compliance > 80
                              ? "green"
                              : item.compliance > 50
                              ? "yellow"
                              : "red"
                          }-500 h-full`}
                          style={{ width: `${item.compliance}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1">{item.compliance}%</div>
                    </div>
                    <div className="col-span-2 flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleButtonClick("equipmentDetail", item.id)}
                              aria-label={isRTL ? "عرض التفاصيل" : "View Details"}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isRTL ? "عرض التفاصيل" : "View Details"}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleButtonClick("editEquipment", item.id)}
                              aria-label={isRTL ? "تعديل المعدات" : "Edit Equipment"}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isRTL ? "تعديل المعدات" : "Edit Equipment"}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handleButtonClick("scheduleInspection", item.id)
                              }
                              aria-label={isRTL ? "جدولة التفتيش" : "Schedule Inspection"}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isRTL ? "جدولة التفتيش" : "Schedule Inspection"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Detail Modal */}
      <Dialog
        open={openModal === "documentDetail"}
        onOpenChange={() => setOpenModal("")}
      >
        <DialogContent className="sm:max-w-[500px] md:max-w-[600px] w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isRTL ? "تفاصيل الوثيقة" : "Document Details"}</DialogTitle>
            <DialogDescription>
              {isRTL
                ? "عرض وإدارة معلومات الوثيقة"
                : "View and manage document information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-muted/30 p-5 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {isRTL ? "شهادة التشغيل" : "Operation Certificate"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL
                      ? "شهادة تشغيل للمعدات الثقيلة"
                      : "Certificate of operation for heavy equipment"}
                  </p>
                </div>
                <Badge className="bg-status-valid">{isRTL ? "صالح" : "Valid"}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">
                    {isRTL ? "المعدات المرتبطة" : "Associated Equipment"}
                  </Label>
                  <p className="font-medium mt-1">
                    {isRTL ? "Excavator XL2000 (CAT 320)" : "Excavator XL2000 (CAT 320)"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    {isRTL ? "رقم المرجع" : "Reference Number"}
                  </Label>
                  <p className="font-medium mt-1">CERT-2024-0123</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    {isRTL ? "تاريخ الإصدار" : "Issue Date"}
                  </Label>
                  <p className="font-medium mt-1">2024-08-15</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    {isRTL ? "تاريخ الانتهاء" : "Expiry Date"}
                  </Label>
                  <p className="font-medium mt-1">2025-08-15</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{isRTL ? "صادر عن" : "Issued By"}</Label>
                  <p className="font-medium mt-1">
                    {isRTL
                      ? "شركة السلامة الأولى للشهادات"
                      : "Safety First Certifications Ltd."}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    {isRTL ? "تم التحقق بواسطة" : "Verified By"}
                  </Label>
                  <p className="font-medium mt-1">
                    {isRTL ? "جيمس بيترسون (مدير HSE)" : "James Peterson (HSE Manager)"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-2 rounded-lg p-4 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
              <FileText className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Operation_Certificate_CAT320.pdf</p>
              <p className="text-xs text-muted-foreground mb-4">
                {isRTL ? "2.4 ميغابايت • تم الرفع في 2024-08-16" : "2.4 MB • Uploaded on 2024-08-16"}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  {isRTL ? "تحميل" : "Download"}
                </Button>
                <Button size="sm">{isRTL ? "عرض الوثيقة" : "View Document"}</Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">
                {isRTL ? "النشاط الأخير" : "Recent Activity"}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                  <File className="h-4 w-4 text-status-valid mr-2" />
                    <span>
                      {isRTL ? "تم التحقق من الوثيقة" : "Document verified"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {isRTL ? "بواسطة جيمس بيترسون • 2024-08-16" : "by James Peterson • 2024-08-16"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 text-status-warning mr-2" />
                    <span>
                      {isRTL ? "تم رفع الوثيقة" : "Document uploaded"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {isRTL ? "بواسطة أحمد حسن • 2024-08-16" : "by Ahmed Hassan • 2024-08-16"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">
              {isRTL ? "تحميل نسخة" : "Download Copy"}
            </Button>
            <Button>
              {isRTL ? "تحديث الوثيقة" : "Update Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Equipment Modal */}
      <Dialog
        open={openModal === "editEquipment"}
        onOpenChange={() => setOpenModal("")}
      >
        <DialogContent className="sm:max-w-[500px] md:max-w-[600px] w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isRTL ? "تعديل المعدات" : "Edit Equipment"}</DialogTitle>
            <DialogDescription>
              {selectedEquipment
                ? isRTL
                  ? `تعديل تفاصيل ${selectedEquipment.name}`
                  : `Edit details for ${selectedEquipment.name}`
                : isRTL
                ? "تحديث معلومات المعدات"
                : "Update equipment information"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{isRTL ? "اسم المعدات" : "Equipment Name"}</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedEquipment?.name}
                  placeholder={isRTL ? "مثال: Excavator XL3000" : "e.g. Excavator XL3000"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model">{isRTL ? "الطراز" : "Model"}</Label>
                <Input
                  id="edit-model"
                  defaultValue={selectedEquipment?.model}
                  placeholder={isRTL ? "مثال: CAT 320" : "e.g. CAT 320"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-serial">{isRTL ? "الرقم التسلسلي" : "Serial Number"}</Label>
                <Input
                  id="edit-serial"
                  defaultValue={selectedEquipment?.serialNumber}
                  placeholder={isRTL ? "مثال: CAT320-45678" : "e.g. CAT320-45678"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">{isRTL ? "الفئة" : "Category"}</Label>
                <Select defaultValue={selectedEquipment?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر الفئة" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heavy">
                      {isRTL ? "معدات ثقيلة" : "Heavy Equipment"}
                    </SelectItem>
                    <SelectItem value="light">
                      {isRTL ? "مركبة خفيفة" : "Light Vehicle"}
                    </SelectItem>
                    <SelectItem value="power-tool">
                      {isRTL ? "أداة كهربائية" : "Power Tool"}
                    </SelectItem>
                    <SelectItem value="safety">
                      {isRTL ? "معدات السلامة" : "Safety Equipment"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">{isRTL ? "الوصف" : "Description"}</Label>
              <Textarea
                id="edit-description"
                placeholder={
                  isRTL ? "وصف موجز للمعدات..." : "Brief description of the equipment..."
                }
              />
            </div>

            <div className="space-y-2">
              <Label>{isRTL ? "الحالة" : "Status"}</Label>
              <div className="flex space-x-4 mt-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="edit-active"
                    name="edit-status"
                    className="form-radio"
                    defaultChecked={selectedEquipment?.status === "active"}
                  />
                  <Label htmlFor="edit-active" className="cursor-pointer">
                    {isRTL ? "نشط" : "Active"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="edit-maintenance"
                    name="edit-status"
                    className="form-radio"
                    defaultChecked={selectedEquipment?.status === "maintenance"}
                  />
                  <Label htmlFor="edit-maintenance" className="cursor-pointer">
                    {isRTL ? "في الصيانة" : "In Maintenance"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="edit-decommissioned"
                    name="edit-status"
                    className="form-radio"
                    defaultChecked={selectedEquipment?.status === "decommissioned"}
                  />
                  <Label htmlFor="edit-decommissioned" className="cursor-pointer">
                    {isRTL ? "معطل" : "Decommissioned"}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal("")}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={() =>
                simulateAction(isRTL ? "تحديث المعدات" : "Equipment update")
              }
              disabled={loading}
              className="bg-status-valid hover:bg-status-valid/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRTL ? "جارٍ التحديث..." : "Updating..."}
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  {isRTL ? "تحديث المعدات" : "Update Equipment"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Info Modal */}
      <Dialog open={openModal === "roleInfo"} onOpenChange={() => setOpenModal("")}>
        <DialogContent className="sm:max-w-[400px] md:max-w-[500px] w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isRTL ? "معلومات الدور" : "Role Information"}</DialogTitle>
            <DialogDescription>
              {isRTL
                ? "تفاصيل حول دورك وأذوناتك"
                : "Details about your role and permissions"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{isRTL ? "دورك الحالي" : "Your Current Role"}</Label>
              <div className="mt-2">
                <UserRoleBadge role={userRole} />
              </div>
            </div>

            <div>
              <Label>{isRTL ? "الأذونات" : "Permissions"}</Label>
              <ul className="mt-2 space-y-2 text-sm">
                {userRole === "admin" && (
                  <>
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-status-valid">
                        {isRTL ? "الكل" : "All"}
                      </Badge>
                      <span>{isRTL ? "الوصول الكامل لإدارة النظام" : "Full system management access"}</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-status-valid">
                        {isRTL ? "المعدات" : "Equipment"}
                      </Badge>
                      <span>{isRTL ? "إضافة/تعديل/حذف المعدات" : "Add/Edit/Delete equipment"}</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-status-valid">
                        {isRTL ? "المستخدمون" : "Users"}
                      </Badge>
                      <span>{isRTL ? "إدارة أدوار المستخدمين والأذونات" : "Manage user roles and permissions"}</span>
                    </li>
                  </>
                )}
                {userRole === "operator" && (
                  <>
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-status-valid">
                        {isRTL ? "المعدات" : "Equipment"}
                      </Badge>
                      <span>{isRTL ? "عرض تفاصيل المعدات" : "View equipment details"}</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-status-valid">
                        {isRTL ? "الإبلاغ" : "Reporting"}
                      </Badge>
                      <span>{isRTL ? "إرسال تقارير الحالة" : "Submit status reports"}</span>
                    </li>
                  </>
                )}
                {userRole === "maintenance" && (
                  <>
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-status-valid">
                        {isRTL ? "الصيانة" : "Maintenance"}
                      </Badge>
                      <span>{isRTL ? "جدولة وتحديث أنشطة الصيانة" : "Schedule and update maintenance activities"}</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-status-valid">
                        {isRTL ? "الوثائق" : "Documents"}
                      </Badge>
                      <span>{isRTL ? "رفع تقارير الصيانة" : "Upload maintenance reports"}</span>
                    </li>
                  </>
                )}
                {userRole === "hse" && (
                  <>
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-status-valid">
                        {isRTL ? "الامتثال" : "Compliance"}
                      </Badge>
                      <span>{isRTL ? "مراجعة وتحديث حالة الامتثال" : "Review and update compliance status"}</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-status-valid">
                        {isRTL ? "التفتيش" : "Inspections"}
                      </Badge>
                      <span>{isRTL ? "إجراء تفتيشات السلامة" : "Conduct safety inspections"}</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "لطلب تغيير الدور، يرجى التواصل مع مسؤول النظام."
                  : "To request a role change, please contact your system administrator."}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setOpenModal("")}>
              {isRTL ? "إغلاق" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}