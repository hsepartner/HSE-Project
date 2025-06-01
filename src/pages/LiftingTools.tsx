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
import AddEquipmentModal from "@/components/equipment/AddEquipmentModal";
import { EquipmentCategoryCard } from "@/components/equipment/EquipmentCategoryCard";
import { EquipmentTypeList } from "@/components/equipment/EquipmentTypeList";
import { SAMPLE_EQUIPMENT } from "./EquipmentRegistry";

const SAMPLE_LIFTING_TOOLS = SAMPLE_EQUIPMENT.filter(e => e.category === 'lifting-tool');

const liftingToolTypes = SAMPLE_LIFTING_TOOLS.map(e => ({
  id: e.id,
  name: e.name,
  image: e.image,
  category: e.category,
}));

const LiftingTools = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const [activeTab, setActiveTab] = useState("list");
  const [viewMode, setViewMode] = useState<'categories' | 'type-list' | 'detail'>('categories');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(SAMPLE_LIFTING_TOOLS[0] || null);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>("");
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Group lifting tools by type
  const groupedEquipment = SAMPLE_LIFTING_TOOLS.reduce((acc, equipment) => {
    if (!acc[equipment.name]) {
      acc[equipment.name] = [];
    }
    acc[equipment.name].push(equipment);
    return acc;
  }, {} as Record<string, Equipment[]>);

  const handleSelectEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setActiveTab("detail");
  };

  const simulateAction = async (action: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? "سجل أدوات الرفع" : "Lifting Tools Registry"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL
                ? "إدارة ومراقبة جميع أدوات الرفع والوثائق المرتبطة بها"
                : "Manage and monitor all lifting tools and associated documentation"}
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {isRTL ? "إضافة أداة رفع" : "Add Lifting Tool"}
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
                    ? "تعرف على كيفية إدارة سجل أدوات الرفع بفعالية"
                    : "Learn how to manage the lifting tools registry effectively"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "قم بتحديث حالة أدوات الرفع بانتظام"
                        : "Regularly update lifting tool status"}
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
                        ? "استخدم التسلسل الهرمي لتنظيم أدوات الرفع"
                        : "Use hierarchy to organize lifting tools"}
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
              equipment={SAMPLE_LIFTING_TOOLS}
              onSelect={handleSelectEquipment}
            />
          </TabsContent>

          <TabsContent value="detail" className="mt-6">
            {viewMode === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(groupedEquipment).map(([type, equipment]) => (
                  <EquipmentCategoryCard
                    key={type}
                    equipment={equipment}
                    equipmentType={type}
                    category={equipment[0].category}
                    image={equipment[0].image}
                    onClick={() => {
                      setSelectedEquipmentType(type);
                      setFilteredEquipment(equipment);
                      setViewMode('type-list');
                    }}
                  />
                ))}
              </div>
            )}

            {viewMode === 'type-list' && (
              <EquipmentTypeList
                equipment={filteredEquipment}
                equipmentType={selectedEquipmentType}
                onBack={() => setViewMode('categories')}
                onSelectEquipment={(equipment) => {
                  setSelectedEquipment(equipment);
                  setViewMode('detail');
                }}
                isRTL={isRTL}
              />
            )}

            {viewMode === 'detail' && selectedEquipment && (
              <EquipmentDetail
                equipment={selectedEquipment}
                onBack={() => setViewMode('type-list')}
              />
            )}
          </TabsContent>

          <TabsContent value="hierarchy" className="mt-6">
            <EquipmentHierarchy equipment={SAMPLE_LIFTING_TOOLS} />
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
            {isRTL ? "إضافة أداة رفع" : "Add Lifting Tool"}
          </Button>
        </div>

        {/* Add Lifting Tool Modal */}
        <AddEquipmentModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          equipmentTypes={liftingToolTypes}
          selectedEquipmentType={selectedEquipmentType}
          setSelectedEquipmentType={setSelectedEquipmentType}
          loading={loading}
          onSubmit={async () => await simulateAction(isRTL ? "تسجيل أداة الرفع" : "Lifting tool registration")}
          isRTL={isRTL}
          onCancel={() => setIsModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default LiftingTools; 