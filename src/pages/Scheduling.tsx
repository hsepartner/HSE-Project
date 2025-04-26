import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileCheck, X, Plus, Buildings, User, MapPin, Lightbulb, Video, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Scheduling = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Sample data for appointments
  const upcomingAppointments = [
    { id: 1, title: "Property Inspection", location: "123 Main St", date: "2025-04-27", time: "10:00 AM", type: "inspection", assignee: "John Doe" },
    { id: 2, title: "Elevator Maintenance", location: "456 Tower Ave", date: "2025-04-27", time: "2:30 PM", type: "maintenance", assignee: "Sarah Smith" },
    { id: 3, title: "HVAC System Review", location: "789 Office Blvd", date: "2025-04-28", time: "9:15 AM", type: "inspection", assignee: "Mike Johnson" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? "الجدولة" : "Scheduling"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL
                ? "إدارة مواعيد الفحص والصيانة بسهولة وكفاءة"
                : "Easily manage inspection and maintenance appointments"}
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            {isRTL ? "إضافة موعد جديد" : "Add New Appointment"}
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
                    ? "تعرف على كيفية إدارة المواعيد بفعالية"
                    : "Learn how to manage appointments effectively"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "حدد التاريخ والوقت بدقة لتجنب التعارضات"
                        : "Set date and time precisely to avoid conflicts"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">2</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "أضف ملاحظات لتوضيح تفاصيل الموعد"
                        : "Add notes to clarify appointment details"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">3</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "راجع المواعيد القادمة بانتظام"
                        : "Review upcoming appointments regularly"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg mb-6">
            <TabsTrigger
              value="overview"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              {isRTL ? "نظرة عامة" : "Overview"}
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              {isRTL ? "القادمة" : "Upcoming"}
            </TabsTrigger>
            <TabsTrigger
              value="scheduled"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              {isRTL ? "مجدولة" : "Scheduled"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Upcoming Inspections */}
              <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-blue-500" />
                    {isRTL ? "الفحوصات القادمة" : "Upcoming Inspections"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "نظرة عامة على الفحوصات القادمة" : "Overview of upcoming inspections"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "اليوم" : "Today"}</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">3</Badge>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "غدا" : "Tomorrow"}</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">5</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{isRTL ? "هذا الأسبوع" : "This Week"}</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">12</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scheduled Maintenance */}
              <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-500" />
                    {isRTL ? "الصيانة المجدولة" : "Scheduled Maintenance"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "نظرة عامة على الصيانة المجدولة" : "Overview of scheduled maintenance"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "هذا الأسبوع" : "This Week"}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">8</Badge>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "الأسبوع القادم" : "Next Week"}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">15</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{isRTL ? "هذا الشهر" : "This Month"}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">24</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calendar Overview */}
              <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    {isRTL ? "نظرة عامة على التقويم" : "Calendar Overview"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "إحصائيات تقويم المواعيد" : "Appointment calendar statistics"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "إجمالي المواعيد" : "Total Appointments"}</span>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">67</Badge>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "تصادمات المواعيد" : "Scheduling Conflicts"}</span>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">2</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{isRTL ? "متأخرة" : "Overdue"}</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">4</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="grid gap-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(appointment => (
                  <Card key={appointment.id} className="overflow-hidden border-primary/20 hover:shadow-lg transition-shadow duration-300">
                    <div className={`flex flex-col sm:flex-row ${appointment.type === 'inspection' ? 'border-l-4 border-blue-500' : 'border-l-4 border-green-500'}`}>
                      <div className="p-4 sm:p-6 flex-grow">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{appointment.title}</h3>
                            <div className="flex items-center text-muted-foreground mt-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{appointment.location}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground mt-1">
                              <User className="h-4 w-4 mr-1" />
                              <span>{appointment.assignee}</span>
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-0">
                            <Badge variant={appointment.type === 'inspection' ? 'secondary' : 'outline'} className={appointment.type === 'inspection' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                              {isRTL
                                ? (appointment.type === 'inspection' ? 'فحص' : 'صيانة')
                                : (appointment.type === 'inspection' ? 'Inspection' : 'Maintenance')}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col border-t sm:border-t-0 sm:border-l p-3 justify-around items-center sm:w-32 bg-slate-50 dark:bg-slate-800/50">
                        <Button variant="outline" size="sm" className="w-full mb-2">
                          {isRTL ? "تعديل" : "Edit"}
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full text-red-500 hover:text-red-700 hover:bg-red-50">
                          {isRTL ? "إلغاء" : "Cancel"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-6 text-center text-muted-foreground">
                  {isRTL ? "لا توجد مواعيد قادمة" : "No upcoming appointments"}
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scheduled">
            <Card className="p-6 border-primary/20">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium mb-4">
                  {isRTL ? "الصيانة المجدولة" : "Scheduled Maintenance"}
                </h3>
              </div>
              <p className="text-muted-foreground">
                {isRTL
                  ? "لا توجد مواعيد صيانة مجدولة حاليًا. أضف موعدًا جديدًا لعرضه هنا."
                  : "No scheduled maintenance appointments currently. Add a new appointment to view it here."}
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 flex items-center gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                {isRTL ? "إضافة موعد" : "Add Appointment"}
              </Button>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Calendar Preview Section */}
        <Card className="mt-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {isRTL ? "معاينة التقويم" : "Calendar Preview"}
            </CardTitle>
            <CardDescription>
              {isRTL ? "نظرة سريعة على المواعيد القادمة" : "A quick look at upcoming appointments"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <FileCheck size={16} className="mr-2 text-blue-600" />
                  {isRTL ? "فحص العقار" : "Property Inspection"}
                </h4>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm font-medium">123 Main St</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2025-04-27, 10:00 AM
                  </p>
                </div>
              </div>
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <Clock size={16} className="mr-2 text-green-600" />
                  {isRTL ? "صيانة المصعد" : "Elevator Maintenance"}
                </h4>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-sm font-medium">456 Tower Ave</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2025-04-27, 2:30 PM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal for adding new appointment */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{isRTL ? "إضافة موعد جديد" : "Add New Appointment"}</DialogTitle>
              <DialogDescription>
                {isRTL
                  ? "أدخل تفاصيل الموعد لجدولته في النظام"
                  : "Enter appointment details to schedule it in the system"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "العنوان" : "Title"}
                </Label>
                <Input
                  id="title"
                  placeholder={isRTL ? "عنوان الموعد" : "Appointment title"}
                  className="col-span-3"
                  aria-label={isRTL ? "عنوان الموعد" : "Appointment title"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "النوع" : "Type"}
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={isRTL ? "اختر النوع" : "Select type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspection">{isRTL ? "فحص" : "Inspection"}</SelectItem>
                    <SelectItem value="maintenance">{isRTL ? "صيانة" : "Maintenance"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "الموقع" : "Location"}
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="location"
                    placeholder={isRTL ? "أدخل الموقع" : "Enter location"}
                    aria-label={isRTL ? "الموقع" : "Location"}
                  />
                  <Button variant="outline" size="icon" aria-label={isRTL ? "تحديد الموقع" : "Select location"}>
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "التاريخ" : "Date"}
                </Label>
                <Input
                  id="date"
                  type="date"
                  className="col-span-3"
                  aria-label={isRTL ? "تاريخ الموعد" : "Appointment date"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "الوقت" : "Time"}
                </Label>
                <Input
                  id="time"
                  type="time"
                  className="col-span-3"
                  aria-label={isRTL ? "وقت الموعد" : "Appointment time"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignee" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "المسؤول" : "Assigned To"}
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={isRTL ? "اختر الشخص" : "Select person"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="sarah">Sarah Smith</SelectItem>
                    <SelectItem value="mike">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className={isRTL ? "text-right pt-2" : "text-left pt-2"}>
                  {isRTL ? "ملاحظات" : "Notes"}
                </Label>
                <Textarea
                  id="notes"
                  placeholder={isRTL ? "أضف ملاحظات إضافية..." : "Add additional notes..."}
                  className="col-span-3"
                  rows={3}
                  aria-label={isRTL ? "ملاحظات الموعد" : "Appointment notes"}
                />
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
                        ? "تأكد من تحديد التاريخ والوقت المناسبين لتجنب تعارضات الجدولة."
                        : "Ensure you select an appropriate date and time to avoid scheduling conflicts."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button variant="outline">{isRTL ? "إلغاء" : "Cancel"}</Button>
              </DialogClose>
              <Button type="submit">{isRTL ? "حفظ" : "Save"}</Button>
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            {isRTL ? "إضافة موعد" : "Add Appointment"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Scheduling;