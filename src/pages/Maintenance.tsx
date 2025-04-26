import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  FileText,
  Wrench,
  X,
  Settings,
  Clock,
  AlertCircle,
  Lightbulb,
  Video,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Maintenance = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(75);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? "الصيانة" : "Maintenance"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL
                ? "إدارة وتتبع جميع أنشطة الصيانة للمعدات بكفاءة"
                : "Efficiently manage and track all equipment maintenance activities"}
            </p>
          </div>
          <Button
            onClick={handleOpenModal}
            className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Wrench className="h-4 w-4" />
            {isRTL ? "إضافة إجراء صيانة" : "Add Maintenance Action"}
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
                    ? "تعرف على كيفية إدارة أنشطة الصيانة بفعالية"
                    : "Learn how to manage maintenance activities effectively"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">
                        1
                      </span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "حدد الأولوية للمهام الحرجة أولاً"
                        : "Prioritize critical tasks first"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">
                        2
                      </span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "أضف وصفًا تفصيليًا لكل إجراء"
                        : "Add detailed descriptions for each action"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">
                        3
                      </span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "راجع سجل الصيانة بانتظام"
                        : "Review maintenance history regularly"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Card */}
        <Card className="mb-6 border-primary/20 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              {isRTL ? "نظرة عامة على الصيانة" : "Maintenance Overview"}
            </CardTitle>
            <CardDescription>
              {isRTL
                ? "إحصائيات سريعة عن أنشطة الصيانة"
                : "Quick stats on maintenance activities"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-2">
                  {isRTL ? "معدل إكمال الصيانة" : "Maintenance Completion Rate"}
                </span>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold">{progress}%</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    {isRTL ? "جيد" : "Good"}
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-2">
                  {isRTL ? "إجمالي عناصر الصيانة" : "Total Maintenance Items"}
                </span>
                <span className="text-2xl font-bold">52</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {isRTL ? "عنصرًا نشطًا" : "Active items"}
                </p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-2">
                  {isRTL ? "تحتاج اهتمام فوري" : "Need Immediate Attention"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-500">3</span>
                  <Badge variant="destructive" className="ml-2">
                    {isRTL ? "عاجل" : "Urgent"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Upcoming Maintenance */}
          <Card className="overflow-hidden border-primary/20 border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                {isRTL ? "الصيانة القادمة" : "Upcoming Maintenance"}
              </CardTitle>
              <CardDescription>
                {isRTL
                  ? "المواعيد المجدولة القادمة"
                  : "Upcoming scheduled maintenance"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-b-slate-100 dark:border-b-slate-800">
                  <span>{isRTL ? "هذا الأسبوع" : "This Week"}</span>
                  <span className="font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md">
                    8
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-b-slate-100 dark:border-b-slate-800">
                  <span>{isRTL ? "الأسبوع القادم" : "Next Week"}</span>
                  <span className="font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md">
                    12
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>{isRTL ? "هذا الشهر" : "This Month"}</span>
                  <span className="font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md">
                    25
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance History */}
          <Card className="overflow-hidden border-primary/20 border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                {isRTL ? "سجل الصيانة" : "Maintenance History"}
              </CardTitle>
              <CardDescription>
                {isRTL
                  ? "نظرة عامة على حالات الصيانة"
                  : "Overview of maintenance statuses"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-b-slate-100 dark:border-b-slate-800">
                  <span>{isRTL ? "مكتملة" : "Completed"}</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    42
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-b-slate-100 dark:border-b-slate-800">
                  <span>{isRTL ? "معلقة" : "Pending"}</span>
                  <span className="font-semibold text-amber-500 dark:text-amber-400">
                    7
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>{isRTL ? "ملغاة" : "Cancelled"}</span>
                  <span className="font-semibold text-red-500 dark:text-red-400">
                    3
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Analytics */}
          <Card className="overflow-hidden border-primary/20 border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                {isRTL ? "تحليلات الصيانة" : "Maintenance Analytics"}
              </CardTitle>
              <CardDescription>
                {isRTL
                  ? "مقاييس أداء الصيانة"
                  : "Maintenance performance metrics"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-b-slate-100 dark:border-b-slate-800">
                  <span>{isRTL ? "وقت التعطل" : "Downtime"}</span>
                  <span className="font-semibold">48hr</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-b-slate-100 dark:border-b-slate-800">
                  <span>{isRTL ? "تكلفة الصيانة" : "Maintenance Cost"}</span>
                  <span className="font-semibold">$12,450</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>{isRTL ? "أعطال متكررة" : "Recurring Issues"}</span>
                  <span className="font-semibold text-amber-500 dark:text-amber-400">
                    5
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Activity Preview Section */}
        <Card className="mt-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              {isRTL ? "معاينة نشاط الصيانة" : "Maintenance Activity Preview"}
            </CardTitle>
            <CardDescription>
              {isRTL
                ? "مثال على أنشطة الصيانة الأخيرة"
                : "Example of recent maintenance activities"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <Wrench size={16} className="mr-2 text-blue-600" />
                  {isRTL ? "صيانة نظام التكييف" : "HVAC System Maintenance"}
                </h4>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm font-medium">
                    {isRTL
                      ? "فحص وتنظيف نظام التكييف"
                      : "Inspection and cleaning of HVAC system"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2025-04-25, John Smith
                  </p>
                </div>
              </div>
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <AlertCircle size={16} className="mr-2 text-red-600" />
                  {isRTL ? "إصلاح المصعد" : "Elevator Repair"}
                </h4>
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-sm font-medium">
                    {isRTL
                      ? "إصلاح عطل في المصعد"
                      : "Repair of elevator malfunction"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2025-04-24, Sarah Johnson
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Maintenance Action Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                {isRTL
                  ? "إضافة إجراء صيانة جديد"
                  : "Add New Maintenance Action"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "أدخل تفاصيل إجراء الصيانة لتسجيله في النظام"
                  : "Enter maintenance action details to log it in the system"}
              </p>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="equipment"
                    className={isRTL ? "text-right" : "text-left"}
                  >
                    {isRTL ? "المعدات" : "Equipment"}
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isRTL ? "اختر المعدات" : "Select equipment"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hvac">
                        {isRTL ? "نظام التكييف" : "HVAC System"}
                      </SelectItem>
                      <SelectItem value="generator">
                        {isRTL ? "المولد" : "Generator"}
                      </SelectItem>
                      <SelectItem value="pump">
                        {isRTL ? "مضخة المياه" : "Water Pump"}
                      </SelectItem>
                      <SelectItem value="elevator">
                        {isRTL ? "المصعد" : "Elevator"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="type"
                    className={isRTL ? "text-right" : "text-left"}
                  >
                    {isRTL ? "نوع الصيانة" : "Maintenance Type"}
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={isRTL ? "اختر النوع" : "Select type"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">
                        {isRTL ? "صيانة وقائية" : "Preventive"}
                      </SelectItem>
                      <SelectItem value="corrective">
                        {isRTL ? "صيانة تصحيحية" : "Corrective"}
                      </SelectItem>
                      <SelectItem value="predictive">
                        {isRTL ? "صيانة تنبؤية" : "Predictive"}
                      </SelectItem>
                      <SelectItem value="emergency">
                        {isRTL ? "صيانة طارئة" : "Emergency"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className={isRTL ? "text-right" : "text-left"}
                >
                  {isRTL ? "عنوان الصيانة" : "Maintenance Title"}
                </Label>
                <Input
                  id="title"
                  placeholder={
                    isRTL ? "أدخل عنوان الصيانة" : "Enter maintenance title"
                  }
                  aria-label={isRTL ? "عنوان الصيانة" : "Maintenance title"}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="priority"
                    className={isRTL ? "text-right" : "text-left"}
                  >
                    {isRTL ? "الأولوية" : "Priority"}
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={isRTL ? "حدد الأولوية" : "Select priority"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        {isRTL ? "منخفضة" : "Low"}
                      </SelectItem>
                      <SelectItem value="medium">
                        {isRTL ? "متوسطة" : "Medium"}
                      </SelectItem>
                      <SelectItem value="high">
                        {isRTL ? "عالية" : "High"}
                      </SelectItem>
                      <SelectItem value="critical">
                        {isRTL ? "حرجة" : "Critical"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="scheduled-date"
                    className={isRTL ? "text-right" : "text-left"}
                  >
                    {isRTL ? "التاريخ المجدول" : "Scheduled Date"}
                  </Label>
                  <Input
                    id="scheduled-date"
                    type="date"
                    aria-label={isRTL ? "التاريخ المجدول" : "Scheduled date"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className={isRTL ? "text-right" : "text-left"}
                >
                  {isRTL ? "الوصف والتعليمات" : "Description & Instructions"}
                </Label>
                <Textarea
                  id="description"
                  placeholder={
                    isRTL
                      ? "وصف تفصيلي لإجراء الصيانة..."
                      : "Detailed description of maintenance action..."
                  }
                  rows={4}
                  aria-label={
                    isRTL ? "الوصف والتعليمات" : "Description and instructions"
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="technician"
                    className={isRTL ? "text-right" : "text-left"}
                  >
                    {isRTL ? "الفني المسؤول" : "Assigned Technician"}
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={isRTL ? "اختر الفني" : "Select technician"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Smith</SelectItem>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="mike">Mike Davidson</SelectItem>
                      <SelectItem value="emma">Emma Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="estimated-time"
                    className={isRTL ? "text-right" : "text-left"}
                  >
                    {isRTL ? "الوقت المقدر" : "Estimated Time"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="estimated-time"
                      type="number"
                      placeholder="2"
                      aria-label={isRTL ? "الوقت المقدر" : "Estimated time"}
                    />
                    <Select defaultValue="hours">
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder={isRTL ? "وحدة" : "Unit"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">
                          {isRTL ? "دقائق" : "Minutes"}
                        </SelectItem>
                        <SelectItem value="hours">
                          {isRTL ? "ساعات" : "Hours"}
                        </SelectItem>
                        <SelectItem value="days">
                          {isRTL ? "أيام" : "Days"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">
                      {isRTL ? "نصيحة" : "Tip"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL
                        ? "قدم وصفًا واضحًا وتعليمات دقيقة لضمان تنفيذ الصيانة بسلاسة."
                        : "Provide a clear description and precise instructions to ensure smooth maintenance execution."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button variant="outline">{isRTL ? "إلغاء" : "Cancel"}</Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Wrench className="h-4 w-4" />
                {isRTL ? "إنشاء إجراء الصيانة" : "Create Maintenance Action"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" className="flex gap-2">
            <Video className="h-4 w-4" />
            {isRTL ? "شاهد الفيديو التعليمي" : "Watch Tutorial"}
          </Button>
          <Button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Wrench className="h-4 w-4" />
            {isRTL ? "إضافة إجراء صيانة" : "Add Maintenance Action"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Maintenance;
