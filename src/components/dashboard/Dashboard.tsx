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
import { EquipmentStatusChart } from "@/components/analytics/EquipmentStatusChart"; // Import chart component
import { ComplianceOverviewChart } from "@/components/analytics/ComplianceOverviewChart"; // Import chart component
import { PowerToolsStatusChart } from "@/components/analytics/PowerToolsStatusChart";
import { LiftingToolsStatusChart } from "@/components/analytics/LiftingToolsStatusChart";
import { OperatorsStatusChart } from "@/components/analytics/OperatorsStatusChart";

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
  id: string;
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
    name: "Crawler Crane",
    model: "Liebherr LR 1300",
    serialNumber: "LR1300-0001",
    category: "heavy",
    status: "active",
    compliance: 92,
    image: "/images/Crawler Crane.png",
  },
  {
    id: 2,
    name: "Excavator",
    model: "CAT 320",
    serialNumber: "CAT320-45678",
    category: "heavy",
    status: "maintenance",
    compliance: 65,
    image: "/images/Excavator.png",
  },
  {
    id: 3,
    name: "JCB",
    model: "JCB 3CX",
    serialNumber: "JCB3CX-78901",
    category: "heavy",
    status: "active",
    compliance: 78,
    image: "/images/JCB.png",
  },
  {
    id: 4,
    name: "Hlab",
    model: "HLAB X1",
    serialNumber: "HLABX1-12345",
    category: "heavy",
    status: "decommissioned",
    compliance: 20,
    image: "/images/hlab.png",
  },
  {
    id: 5,
    name: "Telehandler",
    model: "JLG 4017RS",
    serialNumber: "JLG4017-56789",
    category: "heavy",
    status: "active",
    compliance: 85,
    image: "/images/TELEHANDLER.png",
  },
  {
    id: 6,
    name: "Wheel Loader",
    model: "CAT 950GC",
    serialNumber: "CAT950GC-24680",
    category: "heavy",
    status: "maintenance",
    compliance: 55,
    image: "/images/Wheelloader.png",
  },
];

const equipmentTypes: EquipmentType[] = [
  {
    name: "Crawler Crane",
    image: "/images/Crawler Crane.png",
    category: "heavy",
    id: "1",
  },
  {
    name: "Excavator",
    image: "/images/Excavator.png",
    category: "heavy",
    id: "2",
  },
  {
    name: "JCB",
    image: "/images/JCB.png",
    category: "heavy",
    id: "3",
  },
  {
    name: "Hlab",
    image: "/images/hlab.png",
    category: "heavy",
    id: "4",
  },
  {
    name: "Telehandler",
    image: "/images/TELEHANDLER.png",
    category: "heavy",
    id: "5",
  },
  {
    name: "Wheel Loader",
    image: "/images/Wheelloader.png",
    category: "heavy",
    id: "6",
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
    details: "Operation Certificate for Crawler Crane",
    user: "John Smith",
    timestamp: "2024-04-26 09:00",
  },
  {
    id: 2,
    action: "Inspection Scheduled",
    details: "Excavator scheduled for 2024-04-28",
    user: "Maria Rodriguez",
    timestamp: "2024-04-25 14:15",
  },
  {
    id: 3,
    action: "Equipment Status Updated",
    details: "Hlab marked as DECOMMISSIONED",
    user: "Ahmed Hassan",
    timestamp: "2024-04-24 11:00",
  },
];

// Color maps for alerts and avatars
const alertColors = {
  urgent: {
    border: "border-red-500",
    bg: "bg-red-50 dark:bg-red-950",
    hover: "hover:bg-red-100 dark:hover:bg-red-900",
    iconBg: "bg-red-200",
    icon: "text-red-600",
    text: "text-red-700 dark:text-red-300",
  },
  warning: {
    border: "border-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950",
    hover: "hover:bg-yellow-100 dark:hover:bg-yellow-900",
    iconBg: "bg-yellow-200",
    icon: "text-yellow-600",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  valid: {
    border: "border-green-500",
    bg: "bg-green-50 dark:bg-green-950",
    hover: "hover:bg-green-100 dark:hover:bg-green-900",
    iconBg: "bg-green-200",
    icon: "text-green-600",
    text: "text-green-700 dark:text-green-300",
  },
};

const avatarColors = [
  "bg-blue-400 text-white",
  "bg-green-400 text-white",
  "bg-pink-400 text-white",
  "bg-yellow-400 text-white",
  "bg-purple-400 text-white",
  "bg-orange-400 text-white",
  "bg-teal-400 text-white",
];

function getAvatarColor(user: string) {
  // Simple hash to pick a color
  let hash = 0;
  for (let i = 0; i < user.length; i++) {
    hash = user.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

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

  const simulateAction = async (action: string): Promise<void> => {
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
        "min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6",
        isRTL && "rtl"
      )}
    >
      <WelcomeHeader />

      {/* Equipment Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Remove Equipment Overview Card section and start directly with analytics charts */}
      </div>

      {/* Keep only analytics charts and alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-100 via-white to-blue-50 border-blue-300 shadow-blue-100/60 shadow-lg rounded-2xl transition-transform hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-200">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {isRTL ? "حالة المعدات" : "Equipment Status"}
              </CardTitle>
              <CardDescription>
                {isRTL
                  ? "نظرة عامة على حالة جميع المعدات"
                  : "Overview of all equipment status"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <EquipmentStatusChart />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-100 via-white to-green-50 border-green-300 shadow-green-100/60 shadow-lg rounded-2xl transition-transform hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-200">
              <Info className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {isRTL ? "نظرة الامتثال" : "Compliance Overview"}
              </CardTitle>
              <CardDescription>
                {isRTL
                  ? "مستوى الامتثال الحالي للمعدات"
                  : "Current compliance level of equipment"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ComplianceOverviewChart />
          </CardContent>
        </Card>
      </div>

      {/* New Status Charts Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-yellow-100 via-white to-yellow-50 border-yellow-300 shadow-yellow-100/60 shadow-lg rounded-2xl transition-transform hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-200">
              <ClipboardCheck className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {isRTL ? "أدوات الطاقة" : "Power Tools Status"}
              </CardTitle>
              <CardDescription>
                {isRTL
                  ? "نظرة عامة على حالة أدوات الطاقة"
                  : "Overview of all power tools status"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <PowerToolsStatusChart />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-100 via-white to-purple-50 border-purple-300 shadow-purple-100/60 shadow-lg rounded-2xl transition-transform hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-200">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {isRTL ? "أدوات الرفع والملحقات" : "Lifting Tools & Tackles Status"}
              </CardTitle>
              <CardDescription>
                {isRTL
                  ? "نظرة عامة على حالة أدوات الرفع والملحقات"
                  : "Overview of all lifting tools and tackles status"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <LiftingToolsStatusChart />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-100 via-white to-pink-50 border-pink-300 shadow-pink-100/60 shadow-lg rounded-2xl transition-transform hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-200">
              <AlertTriangle className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {isRTL ? "المشغلون" : "Operators Status"}
              </CardTitle>
              <CardDescription>
                {isRTL
                  ? "نظرة عامة على حالة المشغلين"
                  : "Overview of all operators status"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <OperatorsStatusChart />
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section (enhanced) */}
      <Card className="shadow-md hover:shadow-lg transition-shadow rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Bell className="h-5 w-5 text-primary" />
            <span>{isRTL ? "التنبيهات" : "Alerts"}</span>
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => setOpenModal("allAlerts")}
                  aria-label={isRTL ? "عرض جميع التنبيهات" : "View all alerts"}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRTL ? "عرض جميع التنبيهات" : "View all alerts"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardDescription className="px-6 pb-2">
          {isRTL ? "الإشعارات الأخيرة" : "Recent notifications"}
        </CardDescription>
        <CardContent>
          <div className="space-y-4">
            {allAlerts.map((alert) => {
              const color = alertColors[alert.type];
              return (
                <div
                  key={alert.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all shadow-sm cursor-pointer border-l-4 ${color.border} ${color.bg} ${color.hover}`}
                >
                  <div className={`flex items-center justify-center h-9 w-9 rounded-full ${color.iconBg} mr-2`}>
                    <alert.icon className={`h-5 w-5 ${color.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${color.text}`}>{alert.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{alert.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{alert.date}</span>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setOpenModal("allAlerts")}
            >
              <Bell className="h-4 w-4 mr-2" />
              {isRTL ? "عرض جميع التنبيهات" : "View All Alerts"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Section (timeline style, responsive) */}
      <Card className="shadow-md hover:shadow-lg transition-shadow mt-6 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-primary" />
            {isRTL ? "النشاط الأخير" : "Recent Activity"}
          </CardTitle>
          <CardDescription>
            {isRTL ? "سجل الإجراءات الأخيرة في النظام" : "Log of recent system actions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[220px] md:h-[200px] pr-2">
            <div className="flex flex-col gap-4">
              {recentActivities.map((activity, idx) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg transition-colors relative shadow-sm bg-white/80 dark:bg-muted/40 hover:bg-blue-50 dark:hover:bg-blue-900 border-l-4 border-blue-400"
                >
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg shadow ${getAvatarColor(activity.user)}`}> 
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-blue-700 dark:text-blue-300">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.details}</p>
                    <p className="text-xs text-gray-400">{isRTL ? "بواسطة" : "by"} {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-2 whitespace-nowrap mt-1">{activity.timestamp}</span>
                  {idx !== recentActivities.length - 1 && (
                    <span className="absolute left-5 top-12 w-0.5 h-5 bg-blue-200" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* All Alerts Modal (enhanced, responsive) */}
      <Dialog open={openModal === "allAlerts"} onOpenChange={() => setOpenModal("")}> 
        <DialogContent className="sm:max-w-[95vw] md:max-w-[600px] w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Bell className="h-5 w-5 text-primary" />
              {isRTL ? "جميع الإشعارات" : "All Notifications"}
            </DialogTitle>
            <DialogDescription>
              {isRTL
                ? "مراجعة تنبيهات النظام والإشعارات"
                : "Review system alerts and notifications"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-80 pr-2">
            <div className="space-y-3 pr-2">
              {allAlerts.map((alert) => {
                const color = alertColors[alert.type];
                return (
                  <div
                    key={alert.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all shadow-sm cursor-pointer border-l-4 ${color.border} ${color.bg} ${color.hover}`}
                  >
                    <div className={`flex items-center justify-center h-9 w-9 rounded-full ${color.iconBg} mr-2`}>
                      <alert.icon className={`h-5 w-5 ${color.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${color.text}`}>{alert.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{alert.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{alert.date}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t gap-2">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">
              {isRTL ? "وضع علامة مقروء على الكل" : "Mark all as read"}
            </Button>
            <Button size="sm" className="w-full sm:w-auto">{isRTL ? "تكوين التنبيهات" : "Configure Alerts"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}