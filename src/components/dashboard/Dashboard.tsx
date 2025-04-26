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

// Define interface for equipment items
interface EquipmentItem {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  category: EquipmentCategory;
  status: OperationalStatus;
  compliance: number;
}

// Mock data for equipment and alerts
const equipmentItems: EquipmentItem[] = [
  {
    id: 1,
    name: "Excavator XL2000",
    model: "CAT 320",
    serialNumber: "CAT320-45678",
    category: "heavy",
    status: "active",
    compliance: 92,
  },
  {
    id: 2,
    name: "Utility Truck",
    model: "Ford F-450",
    serialNumber: "FORD450-78901",
    category: "light",
    status: "maintenance",
    compliance: 65,
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
  },
];

const allAlerts = [
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

// Mock recent activity data
const recentActivities = [
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
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Get saved user role
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
    <div className={cn("space-y-6 bg-background p-6", isRTL && "rtl")}>
      <WelcomeHeader />

      {showExpiryAlert && (
        <div className="fixed top-24 right-4 max-w-sm z-50 animate-fade-in">
          <Card className="border-l-4 border-status-urgent shadow-lg transition-all hover:shadow-xl">
            <CardContent className="flex items-center p-4">
              <AlertTriangle className="h-6 w-6 text-status-urgent mr-4 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {isRTL ? "تنبيه انتهاء الوثيقة" : "Document Expiry Alert"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isRTL
                    ? "شهادة الخدمة لـ Excavator XL2000 تنتهي خلال 5 أيام"
                    : "Service Certificate for Excavator XL2000 expires in 5 days"}
                </p>
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    {isRTL ? "عرض التفاصيل" : "View Details"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={dismissNotification}
                  >
                    {isRTL ? "تجاهل" : "Dismiss"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full md:w-auto bg-muted rounded-lg p-1 grid grid-cols-4">
          <TabsTrigger
            value="overview"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
          >
            {isRTL ? "نظرة عامة" : "Overview"}
          </TabsTrigger>
          <TabsTrigger
            value="checklist"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
          >
            {isRTL ? "قوائم التحقق" : "Checklist Uploads"}
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
          >
            {isRTL ? "متتبع الوثائق" : "Document Tracker"}
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
          >
            {isRTL ? "جدول الصيانة" : "Maintenance Schedule"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-5 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
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
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
                  <div className="bg-muted/50 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
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
                          className="py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleButtonClick("equipmentDetail", item.id)}
                        >
                          <div className="col-span-4">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
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
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  item.compliance > 80
                                    ? "bg-status-valid"
                                    : item.compliance > 50
                                    ? "bg-status-warning"
                                    : "bg-status-expired"
                                }`}
                                style={{ width: `${item.compliance}%` }}
                              ></div>
                            </div>
                            <div className="text-xs mt-1">{item.compliance}%</div>
                          </div>
                          <div className="col-span-2 text-sm">
                            <span
                              className={`text-status-${
                                item.compliance > 80
                                  ? "valid"
                                  : item.compliance > 50
                                  ? "warning"
                                  : "urgent"
                              } font-medium`}
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
                      <div className="py-8 text-center text-muted-foreground">
                        {isRTL
                          ? "لا توجد معدات تطابق معايير البحث"
                          : "No equipment matches your search"}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 shadow-md hover:shadow-lg transition-shadow">
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
                      className={`border-l-4 border-status-${alert.type} p-3 bg-status-${alert.type}/10 rounded-lg transition-all hover:bg-status-${alert.type}/20`}
                    >
                      <div className="flex items-start">
                        <alert.icon
                          className={`h-4 w-4 text-status-${alert.type} mr-2 mt-0.5 flex-shrink-0`}
                        />
                        <div>
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.description}
                          </p>
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="col-span-2 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{isRTL ? "سجل المعدات" : "Equipment Registry"}</CardTitle>
                <CardDescription>
                  {isRTL
                    ? "إدارة مخزون المعدات والشهادات والامتثال"
                    : "Manage your equipment inventory, certificates, and compliance"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Truck className="h-32 w-32 mb-6 text-muted-foreground" />
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
                  <p className="text-sm text-muted-foreground text-center">
                    {isRTL ? "أنت مسجل الدخول كـ: " : "You are logged in as: "}
                    <span
                      className="font-medium cursor-pointer text-primary hover:underline"
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
                          className="w-full justify-start hover:bg-muted"
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
                          className="w-full justify-start hover:bg-muted"
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
                          className="w-full justify-start hover:bg-muted"
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
                          className="w-full justify-start hover:bg-muted"
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
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground">by {activity.user}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
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
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ClipboardCheck className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center mb-4 max-w-lg">
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{isRTL ? "متتبع الوثائق" : "Document Tracker"}</CardTitle>
                <CardDescription>
                  {isRTL
                    ? "تتبع جميع وثائق المعدات والشهادات"
                    : "Track all equipment documentation and certificates"}
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
                <div className="bg-muted/50 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
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
                      statusClass: "bg-status-valid text-status-valid-foreground",
                    },
                    {
                      name: "Registration",
                      equipment: "Utility Truck",
                      status: "Expiring Soon",
                      expiry: "2024-07-15",
                      statusClass: "bg-status-warning text-status-warning-foreground",
                    },
                    {
                      name: "Electrical Safety Inspection",
                      equipment: "Portable Generator",
                      status: "Critical",
                      expiry: "2024-05-05",
                      statusClass: "bg-status-urgent text-status-urgent-foreground",
                    },
                    {
                      name: "Decommission Report",
                      equipment: "Concrete Mixer",
                      status: "Expired",
                      expiry: "2024-03-01",
                      statusClass: "bg-status-expired text-status-expired-foreground",
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
                        className="py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleButtonClick("documentDetail")}
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{isRTL ? "جدول الصيانة" : "Maintenance Schedule"}</CardTitle>
                <CardDescription>
                  {isRTL
                    ? "عرض أنشطة الصيانة القادمة وجداول الخدمة"
                    : "View upcoming maintenance activities and service schedules"}
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
                <div className="bg-muted/50 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
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
                      statusClass: "bg-status-warning text-status-warning-foreground",
                    },
                    {
                      equipment: "Utility Truck",
                      type: "Repair",
                      date: "2024-04-28",
                      status: "In Progress",
                      statusClass: "bg-status-urgent text-status-urgent-foreground",
                    },
                    {
                      equipment: "Portable Generator",
                      type: "Calibration",
                      date: "2024-05-05",
                      status: "Scheduled",
                      statusClass: "bg-status-warning text-status-warning-foreground",
                    },
                    {
                      equipment: "Wheel Loader",
                      type: "Overhaul",
                      date: "2024-04-15",
                      status: "Completed",
                      statusClass: "bg-status-valid text-status-valid-foreground",
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
                        className="py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-muted/50 transition-colors"
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
        <DialogContent className="sm:max-w-lg">
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
              <div className="grid grid-cols-2 gap-4">
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
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`bg-status-${
                        selectedEquipment.compliance > 80
                          ? "valid"
                          : selectedEquipment.compliance > 50
                          ? "warning"
                          : "expired"
                      } h-full`}
                      style={{ width: `${selectedEquipment.compliance}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 flex justify-between">
                    <span>
                      {selectedEquipment.compliance}% {isRTL ? "مكتمل" : "Complete"}
                    </span>
                    <span className="text-muted-foreground">
                      {isRTL ? "آخر تحديث: 2024-04-23" : "Last updated: 2024-04-23"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{isRTL ? "الوثائق المرتبطة" : "Associated Documents"}</Label>
                <div className="bg-muted/30 rounded-lg p-2 space-y-2">
                  <div className="flex items-center justify-between rounded hover:bg-muted p-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">
                        {isRTL ? "شهادة التشغيل" : "Operation Certificate"}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {isRTL ? "صالح حتى 2025-08-15" : "Valid until 2025-08-15"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded hover:bg-muted p-2">
                    <div className="flex items-center">
                      <File className="h-4 w-4 text-muted-foreground mr-2" />
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isRTL ? "إضافة معدات جديدة" : "Add New Equipment"}</DialogTitle>
            <DialogDescription>
              {isRTL
                ? "أدخل التفاصيل لتسجيل معدات جديدة في النظام"
                : "Enter details to register new equipment in the system"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serial">{isRTL ? "الرقم التسلسلي" : "Serial Number"}</Label>
                <Input
                  id="serial"
                  placeholder={isRTL ? "مثال: CAT320-45678" : "e.g. CAT320-45678"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{isRTL ? "الفئة" : "Category"}</Label>
                <Select>
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
              <div className="flex space-x-4 mt-1">
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
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
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
              className="bg-status-valid hover:bg-status-valid/90"
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
        <DialogContent className="sm:max-w-lg">
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

            <div className="grid grid-cols-2 gap-4">
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
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {isRTL
                    ? "اسحب وأسقط الملف هنا أو انقر للتصفح"
                    : "Drag & drop file here or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
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
              className="bg-status-valid hover:bg-status-valid/90"
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
        <DialogContent className="sm:max-w-lg">
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

            <div className="grid grid-cols-2 gap-4">
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
              className="bg-status-valid hover:bg-status-valid/90"
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
        <DialogContent className="sm:max-w-lg">
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
                  className={`border-l-4 border-status-${alert.type} p-3 bg-status-${alert.type}/10 rounded-lg hover:bg-status-${alert.type}/20 cursor-pointer transition-colors flex items-start justify-between`}
                >
                  <div className="flex items-start">
                    <alert.icon
                      className={`h-5 w-5 text-status-${alert.type} mr-3 mt-0.5 flex-shrink-0`}
                    />
                    <div>
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
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
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{isRTL ? "سجل المعدات" : "Equipment Registry"}</DialogTitle>
            <DialogDescription>
              {isRTL
                ? "نظام إدارة المعدات الشامل"
                : "Comprehensive equipment management system"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
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
                className="bg-status-valid hover:bg-status-valid/90"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {isRTL ? "إضافة معدات" : "Add Equipment"}
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
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
                    className="py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-muted/30 transition-colors"
                  >
                    <div className="col-span-3 font-medium">{item.name}</div>
                    <div className="col-span-2 text-sm text-muted-foreground">
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
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`bg-status-${
                            item.compliance > 80
                              ? "valid"
                              : item.compliance > 50
                              ? "warning"
                              : "expired"
                          } h-full`}
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
        <DialogContent className="sm:max-w-xl">
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
                    <span>{isRTL ? "تم التحقق من الوثيقة" : "Document verified"}</span>
                  </div>
                  <span className="text-muted-foreground">2024-08-16</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{isRTL ? "تم رفع الوثيقة" : "Document uploaded"}</span>
                  </div>
                  <span className="text-muted-foreground">2024-08-16</span>
                </div>
                
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => handleButtonClick("uploadDocument")}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isRTL ? "رفع نسخة جديدة" : "Upload New Version"}
              </Button>
              <Button
                onClick={() => simulateAction(isRTL ? "تحديث الوثيقة" : "Document update")}
                disabled={loading}
                className="bg-status-valid hover:bg-status-valid/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRTL ? "جارٍ المعالجة..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    {isRTL ? "تحديث الوثيقة" : "Update Document"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Role Info Modal */}
        <Dialog open={openModal === "roleInfo"} onOpenChange={() => setOpenModal("")}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isRTL ? "معلومات الدور" : "Role Information"}</DialogTitle>
              <DialogDescription>
                {isRTL
                  ? "تفاصيل صلاحيات ومسؤوليات الدور الحالي"
                  : "Details about the permissions and responsibilities of your current role"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>{isRTL ? "الدور الحالي" : "Current Role"}</Label>
                <p className="mt-1 text-sm font-medium capitalize">{userRole}</p>
                <UserRoleBadge role={userRole} className="mt-2" />
              </div>

              <div>
                <Label>{isRTL ? "الوصف" : "Description"}</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {userRole === "admin"
                    ? isRTL
                      ? "كمسؤول، لديك وصول كامل لإدارة المعدات، الوثائق، والمستخدمين."
                      : "As an admin, you have full access to manage equipment, documents, and users."
                    : userRole === "operator"
                    ? isRTL
                      ? "كمشغل، يمكنك عرض المعدات ورفع قوائم التحقق اليومية."
                      : "As an operator, you can view equipment and upload daily checklists."
                    : userRole === "maintenance"
                    ? isRTL
                      ? "كفني صيانة، يمكنك جدولة الصيانة وتحديث حالة المعدات."
                      : "As a maintenance technician, you can schedule maintenance and update equipment status."
                    : isRTL
                      ? "كمسؤول HSE، يمكنك مراجعة الامتثال والتحقق من الوثائق."
                      : "As an HSE officer, you can review compliance and verify documents."}
                </p>
              </div>

              <div>
                <Label>{isRTL ? "الصلاحيات" : "Permissions"}</Label>
                <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                  {userRole === "admin" && (
                    <>
                      <li>{isRTL ? "إدارة المستخدمين" : "Manage users"}</li>
                      <li>{isRTL ? "تعديل جميع السجلات" : "Edit all records"}</li>
                      <li>{isRTL ? "تكوين النظام" : "Configure system settings"}</li>
                    </>
                  )}
                  {userRole === "operator" && (
                    <>
                      <li>{isRTL ? "عرض المعدات" : "View equipment"}</li>
                      <li>{isRTL ? "رفع قوائم التحقق" : "Upload checklists"}</li>
                    </>
                  )}
                  {userRole === "maintenance" && (
                    <>
                      <li>{isRTL ? "جدولة الصيانة" : "Schedule maintenance"}</li>
                      <li>{isRTL ? "تحديث حالة المعدات" : "Update equipment status"}</li>
                    </>
                  )}
                  {userRole === "hse" && (
                    <>
                      <li>{isRTL ? "مراجعة الوثائق" : "Review documents"}</li>
                      <li>{isRTL ? "إصدار تقارير الامتثال" : "Generate compliance reports"}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenModal("")}>
                {isRTL ? "إغلاق" : "Close"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Equipment Modal */}
        <Dialog
          open={openModal === "editEquipment"}
          onOpenChange={() => setOpenModal("")}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{isRTL ? "تعديل المعدات" : "Edit Equipment"}</DialogTitle>
              <DialogDescription>
                {isRTL
                  ? `تعديل تفاصيل ${selectedEquipment?.name || "المعدات"}`
                  : `Edit details for ${selectedEquipment?.name || "equipment"}`}
              </DialogDescription>
            </DialogHeader>

            {selectedEquipment && (
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{isRTL ? "اسم المعدات" : "Equipment Name"}</Label>
                    <Input
                      id="name"
                      defaultValue={selectedEquipment.name}
                      placeholder={isRTL ? "مثال: Excavator XL3000" : "e.g. Excavator XL3000"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">{isRTL ? "الطراز" : "Model"}</Label>
                    <Input
                      id="model"
                      defaultValue={selectedEquipment.model}
                      placeholder={isRTL ? "مثال: CAT 320" : "e.g. CAT 320"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serial">{isRTL ? "الرقم التسلسلي" : "Serial Number"}</Label>
                    <Input
                      id="serial"
                      defaultValue={selectedEquipment.serialNumber}
                      placeholder={isRTL ? "مثال: CAT320-45678" : "e.g. CAT320-45678"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{isRTL ? "الفئة" : "Category"}</Label>
                    <Select defaultValue={selectedEquipment.category}>
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
                  <Label htmlFor="status">{isRTL ? "الحالة" : "Status"}</Label>
                  <Select defaultValue={selectedEquipment.status}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "اختر الحالة" : "Select status"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{isRTL ? "نشط" : "Active"}</SelectItem>
                      <SelectItem value="maintenance">
                        {isRTL ? "في الصيانة" : "In Maintenance"}
                      </SelectItem>
                      <SelectItem value="stored">{isRTL ? "مخزن" : "Stored"}</SelectItem>
                      <SelectItem value="decommissioned">
                        {isRTL ? "معطل" : "Decommissioned"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{isRTL ? "الوصف" : "Description"}</Label>
                  <Textarea
                    id="description"
                    placeholder={
                      isRTL ? "وصف موجز للمعدات..." : "Brief description of the equipment..."
                    }
                    defaultValue={selectedEquipment.name}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenModal("")}>
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={() =>
                  simulateAction(isRTL ? "تعديل المعدات" : "Equipment update")
                }
                disabled={loading}
                className="bg-status-valid hover:bg-status-valid/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRTL ? "جارٍ المعالجة..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <Settings className="mr-2 h-4 w-4" />
                    {isRTL ? "تحديث" : "Update"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
}