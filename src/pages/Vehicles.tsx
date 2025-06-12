import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertCircle,
  CheckCircle,
  Plus,
  Truck,
  Wrench,
  Clock,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { StatusBadge } from "@/components/equipment/StatusBadge";
import { useLanguage } from "@/hooks/use-language";
import { CategoryBadge } from "@/components/equipment/CategoryBadge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VehicleList } from "@/components/vehicles/VehicleList";
import { VehicleDetail } from "@/components/vehicles/VehicleDetail";
import { VehicleTypeList } from "@/components/vehicles/VehicleTypeList";
import { VehicleCategoryCard } from "@/components/vehicles/VehicleCategoryCard";
import AddEquipmentModal from "@/components/equipment/AddEquipmentModal";

// Vehicle interface
interface Vehicle {
  id: string;
  name: string;
  model: string;
  plateNumber: string;
  category: "light" | "heavy" | "commercial";
  status: "active" | "maintenance" | "decommissioned";
  complianceScore: number;
  nextInspectionDate: string;
  purchaseDate: string;
  location: string;
  assignedTo: string;
  image: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    issueDate: string;
    expiryDate: string;
    issuedBy: string;
  }>;
  project: string;
  dailyInspections?: Array<import("@/types/vehicleInspection").VehicleDailyInspection>;
  monthlyInspections?: Array<import("@/types/vehicleInspection").VehicleMonthlyInspection>;
}

const SAMPLE_VEHICLES: Vehicle[] = [
  {
    id: "V1",
    name: "Hydra Crane",
    model: "ACE 12XW",
    plateNumber: "HYD 001",
    category: "heavy",
    status: "active",
    complianceScore: 92,
    nextInspectionDate: "2025-08-15",
    purchaseDate: "2023-05-10",
    location: "Site A - North",
    assignedTo: "John Driver",
    image: "/images/Hydra Crane.jpeg",
    documents: [
      {
        id: "d1",
        name: "Vehicle Registration",
        type: "certificate",
        status: "verified",
        issueDate: "2024-01-15",
        expiryDate: "2025-01-15",
        issuedBy: "Transport Authority",
      },
    ],
    project: "Project A",
  },
  {
    id: "V2",
    name: "Mobile Cranes",
    model: "Tadano GR-500EX",
    plateNumber: "MOB 002",
    category: "heavy",
    status: "maintenance",
    complianceScore: 85,
    nextInspectionDate: "2024-07-10",
    purchaseDate: "2022-11-20",
    location: "Site B - South",
    assignedTo: "Alice Smith",
    image: "/images/Mobile Cranes.jpeg",
    documents: [
      {
        id: "d2",
        name: "Insurance",
        type: "insurance",
        status: "expired",
        issueDate: "2023-06-01",
        expiryDate: "2024-06-01",
        issuedBy: "Insurance Co.",
      },
    ],
    project: "Project B",
  },
  {
    id: "V3",
    name: "Forklifts",
    model: "Toyota 8FGCU25",
    plateNumber: "FLK 003",
    category: "heavy",
    status: "active",
    complianceScore: 90,
    nextInspectionDate: "2025-03-12",
    purchaseDate: "2023-09-18",
    location: "Warehouse 1",
    assignedTo: "David Miller",
    image: "/images/Forklifts.jpeg",
    documents: [
      {
        id: "d3",
        name: "Forklift License",
        type: "certificate",
        status: "verified",
        issueDate: "2024-03-12",
        expiryDate: "2025-03-12",
        issuedBy: "Transport Authority",
      },
    ],
    project: "Project C",
  },
  {
    id: "V4",
    name: "Tippers",
    model: "Tata LPK 2518",
    plateNumber: "TIP 004",
    category: "heavy",
    status: "maintenance",
    complianceScore: 87,
    nextInspectionDate: "2024-11-05",
    purchaseDate: "2022-06-22",
    location: "Site D - West",
    assignedTo: "Emma Watson",
    image: "/images/Tippers.jpeg",
    documents: [
      {
        id: "d4",
        name: "Insurance",
        type: "insurance",
        status: "verified",
        issueDate: "2023-11-05",
        expiryDate: "2024-11-05",
        issuedBy: "Insurance Co.",
      },
    ],
    project: "Project A",
  },
  {
    id: "V5",
    name: "Bulldozers",
    model: "CAT D6R",
    plateNumber: "BLD 005",
    category: "heavy",
    status: "active",
    complianceScore: 93,
    nextInspectionDate: "2025-05-20",
    purchaseDate: "2024-01-10",
    location: "Site E - Central",
    assignedTo: "Olivia Brown",
    image: "/images/Bulldozers.jpeg",
    documents: [
      {
        id: "d5",
        name: "Fitness Certificate",
        type: "certificate",
        status: "verified",
        issueDate: "2024-05-20",
        expiryDate: "2025-05-20",
        issuedBy: "Transport Authority",
      },
    ],
    project: "Project B",
  },
];

const vehicleTypes = [
  {
    name: "Pickup Trucks",
    category: "light",
    icon: Truck as LucideIcon,
  },
  {
    name: "Vans",
    category: "commercial",
    icon: Truck as LucideIcon,
  },
  {
    name: "Heavy Trucks",
    category: "heavy",
    icon: Truck as LucideIcon,
  },
  {
    name: "Utility Vehicles",
    category: "light",
    icon: Truck as LucideIcon,
  },
];

const Vehicles = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const [activeTab, setActiveTab] = useState("list");
  const [selectedProject, setSelectedProject] = useState("Project A");
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<
    "categories" | "type-list" | "detail"
  >("categories");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  // Filter vehicles by project
  const projectFilteredVehicles = SAMPLE_VEHICLES.filter(
    (vehicle) => vehicle.project === selectedProject
  );

  // Group vehicles by type
  const groupedVehicles = projectFilteredVehicles.reduce((acc, vehicle) => {
    if (!acc[vehicle.name]) {
      acc[vehicle.name] = [];
    }
    acc[vehicle.name].push(vehicle);
    return acc;
  }, {} as Record<string, Vehicle[]>);

  // Statistics
  const stats = {
    total: projectFilteredVehicles.length,
    active: projectFilteredVehicles.filter((v) => v.status === "active").length,
    maintenance: projectFilteredVehicles.filter(
      (v) => v.status === "maintenance"
    ).length,
    dueInspection: projectFilteredVehicles.filter(
      (v) => new Date(v.nextInspectionDate) <= new Date()
    ).length,
    byType: projectFilteredVehicles.reduce((acc, vehicle) => {
      acc[vehicle.name] = (acc[vehicle.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    expiredDocs: projectFilteredVehicles.reduce(
      (acc, v) =>
        acc +
        v.documents.filter(
          (doc) => new Date(doc.expiryDate) <= new Date()
        ).length,
      0
    ),
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setActiveTab("detail");
    setViewMode("detail");
  };

  const handleShare = (shareData: { email?: string; link?: string }) => {
    toast({
      title: isRTL ? "نجاح" : "Success",
      description: isRTL
        ? "تم مشاركة المركبة بنجاح"
        : "Vehicle shared successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {isRTL ? "سجل المركبات" : "Vehicles Registry"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL
                ? "إدارة ومراقبة جميع المركبات والوثائق المرتبطة بها"
                : "Manage and monitor all vehicles and associated documentation"}
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {isRTL ? "إضافة مركبة" : "Add Vehicle"}
          </Button>
        </div>

        {/* Project Tabs */}
        <Tabs
          value={selectedProject}
          onValueChange={setSelectedProject}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 rounded-lg border p-1">
            <TabsTrigger value="Project A">Project A</TabsTrigger>
            <TabsTrigger value="Project B">Project B</TabsTrigger>
            <TabsTrigger value="Project C">Project C</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي المركبات" : "Total Vehicles"}
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? "في جميع المشاريع" : "Across all projects"}
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? "مركبات في الخدمة" : "Vehicles in service"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "في الصيانة" : "In Maintenance"}
                  </p>
                  <p className="text-2xl font-bold">{stats.maintenance}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {isRTL ? "قيد الصيانة" : "Under maintenance"}
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
                  <p className="text-xs text-purple-600 mt-1">
                    {isRTL
                      ? "المركبات التي تحتاج إلى فحص"
                      : "vehicles needing inspection"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips Section */}
        <Card className="bg-primary/5 border-primary/20 mb-6">
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
                    ? "تعرف على كيفية إدارة سجل المركبات بفعالية"
                    : "Learn how to manage the vehicle registry effectively"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "قم بتحديث حالة المركبات بانتظام"
                        : "Regularly update vehicle status"}
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
                        ? "استخدم التسلسل الهرمي لتنظيم المركبات"
                        : "Use hierarchy to organize vehicles"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Overview Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{isRTL ? "نظرة عامة على المركبات" : "Vehicle Overview"}</CardTitle>
                <CardDescription>
                  {isRTL ? "إدارة ومراقبة المركبات الخاصة بك" : "Manage and monitor your vehicles"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {VEHICLE_TYPES.map((type, index) => (
                <div
                  key={type.id}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setSelectedVehicleType(type.name);
                    setFilteredVehicles(
                      projectFilteredVehicles.filter((v) => v.name === type.name)
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
                        <CategoryBadge category={type.category} size="sm" className="mt-1" />
                        <p className="text-sm text-muted-foreground mt-1">
                          {projectFilteredVehicles.filter(v => v.name === type.name).length} {isRTL ? "مركبة" : "vehicles"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
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
            <TabsTrigger
              value="hierarchy"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              {isRTL ? "التسلسل الهرمي" : "Hierarchy"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <VehicleList
              vehicles={projectFilteredVehicles}
              onSelect={handleSelectVehicle}
            />
          </TabsContent>

          <TabsContent value="detail" className="mt-6">
            {viewMode === "categories" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(groupedVehicles).map(([type, vehicles]) => (
                  <VehicleCategoryCard
                    key={type}
                    vehicles={vehicles}
                    vehicleType={type}
                    category={vehicles[0].category}
                    image={vehicles[0].image}
                    onClick={() => {
                      setSelectedVehicleType(type);
                      setFilteredVehicles(
                        projectFilteredVehicles.filter((v) => v.name === type)
                      );
                      setViewMode("type-list");
                    }}
                  />
                ))}
              </div>
            )}

            {viewMode === "type-list" && (
              <VehicleTypeList
                vehicles={filteredVehicles}
                vehicleType={selectedVehicleType}
                onBack={() => setViewMode("categories")}
                onSelectVehicle={(vehicle) => {
                  setSelectedVehicle(vehicle);
                  setViewMode("detail");
                }}
                isRTL={isRTL}
              />
            )}

            {viewMode === "detail" && selectedVehicle && (
              <VehicleDetail
                vehicle={selectedVehicle}
                onBack={() => setViewMode("type-list")}
              />
            )}
          </TabsContent>

          <TabsContent value="hierarchy" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(groupedVehicles).map(([type, vehicles]) => (
                <Card
                  key={type}
                  className="border-primary/20 hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="bg-primary/5 rounded-t-lg pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      {type}
                    </CardTitle>
                    <CardDescription>
                      {vehicles.length} {isRTL ? "مركبة" : "vehicles"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {vehicles
                        .filter((v) => v.project === selectedProject)
                        .map((vehicle) => (
                          <div
                            key={vehicle.id}
                            className="flex items-center justify-between p-2 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer"
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setActiveTab("detail");
                              setViewMode("detail");
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-background rounded-lg border shadow-sm p-1 flex items-center justify-center">
                                {vehicle.image ? (
                                  <img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    className="w-8 h-8 object-contain"
                                  />
                                ) : (
                                  <Truck className="w-6 h-6 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{vehicle.plateNumber}</p>
                                <p className="text-sm text-muted-foreground">
                                  {vehicle.model}
                                </p>
                              </div>
                            </div>
                            <StatusBadge status={vehicle.status} size="sm" />
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Vehicle Modal */}
        <AddEquipmentModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          equipmentTypes={VEHICLE_TYPES}
          selectedEquipmentType={selectedVehicleType}
          setSelectedEquipmentType={setSelectedVehicleType}
          loading={loading}
          onSubmit={async (data, documents) => {
            // Add vehicle logic here
            setIsModalOpen(false);
            toast({
              title: isRTL ? "نجاح" : "Success",
              description: isRTL
                ? "تمت إضافة المركبة بنجاح"
                : "Vehicle added successfully",
            });
          }}
          isRTL={isRTL}
          onCancel={() => setIsModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

// Vehicle types data
const VEHICLE_TYPES = [
  {
    name: "Hydra Crane",
    image: "/images/Hydra Crane.jpeg",
    category: "heavy",
    id: "1",
    icon: Truck as LucideIcon,
  },
  {
    name: "Mobile Cranes ",
    image: "/images/Mobile Cranes.jpeg",
    category: "heavy",
    id: "2",
    icon: Truck as LucideIcon,
  },
  {
    name: "Forklifts",
    image: "/images/Forklifts.jpeg",
    category: "heavy",
    id: "3",
    icon: Truck as LucideIcon,
  },
  {
    name: "Tippers",
    image: "/images/Tippers.jpeg",
    category: "heavy",
    id: "4",
    icon: Truck as LucideIcon,
  },
  {
    name: "Bulldozers",
    image: "/images/Bulldozers.jpeg",
    category: "heavy",
    id: "5",
    icon: Truck as LucideIcon,
  },
];


// The SAMPLE_VEHICLES array is already defined above

export default Vehicles;
