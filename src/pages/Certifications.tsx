import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Calendar,
  User,
  Building,
  Shield,
  Clock,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FilePlus,
  Lightbulb,
  Video,
  Info,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const Certifications = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Sample certification data
  const certifications = [
    {
      id: 1,
      title: "Elevator Safety Inspection",
      type: "equipment",
      issueDate: "2024-10-15",
      expiryDate: "2025-05-15",
      status: "valid",
      issuer: "Safety First Inspections",
      certificateNo: "EL-2024-78956",
    },
    {
      id: 2,
      title: "Fire Alarm System Certification",
      type: "equipment",
      issueDate: "2024-09-20",
      expiryDate: "2025-04-30",
      status: "expiring",
      issuer: "Fire Safety Bureau",
      certificateNo: "FS-2024-45632",
    },
    {
      id: 3,
      title: "HVAC Technician License",
      type: "personnel",
      issueDate: "2024-01-10",
      expiryDate: "2025-01-10",
      status: "valid",
      issuer: "National HVAC Association",
      certificateNo: "HVAC-L-32145",
    },
    {
      id: 4,
      title: "Building Operation Permit",
      type: "company",
      issueDate: "2024-06-05",
      expiryDate: "2025-06-05",
      status: "valid",
      issuer: "City Building Department",
      certificateNo: "BOP-2024-7723",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'valid':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {isRTL ? "صالح" : "Valid"}
          </Badge>
        );
      case 'expiring':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {isRTL ? "ينتهي قريباً" : "Expiring Soon"}
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            {isRTL ? "منتهي" : "Expired"}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'equipment':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'personnel':
        return <User className="h-5 w-5 text-green-500" />;
      case 'company':
        return <Building className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? "الشهادات والتراخيص" : "Certifications & Licenses"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL
                ? "إدارة وتتبع جميع الشهادات والتراخيص بسهولة"
                : "Easily manage and track all certifications and licenses"}
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isRTL ? "رفع شهادة جديدة" : "Upload New Certificate"}
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
                    ? "تعرف على كيفية إدارة الشهادات والتراخيص بفعالية"
                    : "Learn how to manage certifications and licenses effectively"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "تأكد من تحديث الشهادات قبل انتهاء صلاحيتها"
                        : "Ensure certificates are renewed before expiry"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">2</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "استخدم البحث للعثور على الشهادات بسرعة"
                        : "Use search to quickly find certificates"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">3</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "راقب الشهادات التي ستنتهي قريبًا"
                        : "Monitor certificates nearing expiry"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="w-full flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isRTL ? "البحث عن شهادات..." : "Search certificates..."}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={isRTL ? "البحث عن شهادات" : "Search certificates"}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder={isRTL ? "النوع" : "Type"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? "الكل" : "All Types"}</SelectItem>
                <SelectItem value="equipment">{isRTL ? "المعدات" : "Equipment"}</SelectItem>
                <SelectItem value="personnel">{isRTL ? "الموظفين" : "Personnel"}</SelectItem>
                <SelectItem value="company">{isRTL ? "الشركة" : "Company"}</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-36">
                <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? "الكل" : "All Status"}</SelectItem>
                <SelectItem value="valid">{isRTL ? "صالح" : "Valid"}</SelectItem>
                <SelectItem value="expiring">{isRTL ? "ينتهي قريباً" : "Expiring Soon"}</SelectItem>
                <SelectItem value="expired">{isRTL ? "منتهي" : "Expired"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 gap-2 p-1 bg-muted rounded-lg mb-6">
            <TabsTrigger
              value="overview"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              {isRTL ? "نظرة عامة" : "Overview"}
            </TabsTrigger>
            <TabsTrigger
              value="equipment"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              {isRTL ? "المعدات" : "Equipment"}
            </TabsTrigger>
            <TabsTrigger
              value="personnel"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              {isRTL ? "الموظفين" : "Personnel"}
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              {isRTL ? "الشركة" : "Company"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Equipment Certifications */}
              <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-primary/5 rounded-t-lg py-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-blue-500" />
                    {isRTL ? "شهادات المعدات" : "Equipment Certifications"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "نظرة عامة على شهادات المعدات" : "Overview of equipment certifications"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "صالحة" : "Valid"}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">24</Badge>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "تنتهي قريباً" : "Expiring Soon"}</span>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">8</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{isRTL ? "منتهية" : "Expired"}</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">3</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personnel Certifications */}
              <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-primary/5 rounded-t-lg py-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-green-500" />
                    {isRTL ? "شهادات الموظفين" : "Personnel Certifications"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "نظرة عامة على شهادات الموظفين" : "Overview of personnel certifications"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "صالحة" : "Valid"}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">16</Badge>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "تنتهي قريباً" : "Expiring Soon"}</span>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">4</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{isRTL ? "منتهية" : "Expired"}</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">2</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Licenses */}
              <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-primary/5 rounded-t-lg py-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building className="h-5 w-5 text-purple-500" />
                    {isRTL ? "تراخيص الشركة" : "Company Licenses"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "نظرة عامة على تراخيص الشركة" : "Overview of company licenses"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "صالحة" : "Valid"}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">5</Badge>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>{isRTL ? "تنتهي قريباً" : "Expiring Soon"}</span>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">1</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{isRTL ? "منتهية" : "Expired"}</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">0</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">{isRTL ? "الشهادات الأخيرة" : "Recent Certifications"}</h2>
              <div className="grid gap-3">
                {certifications.length > 0 ? (
                  certifications
                    .filter((cert) =>
                      cert.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((cert) => (
                      <Card key={cert.id} className="overflow-hidden border-primary/20 hover:shadow-lg transition-shadow duration-300">
                        <div
                          className={`flex flex-col sm:flex-row border-l-4 ${
                            cert.type === 'equipment'
                              ? 'border-blue-500'
                              : cert.type === 'personnel'
                              ? 'border-green-500'
                              : 'border-purple-500'
                          }`}
                        >
                          <div className="p-3 sm:p-4 flex-grow">
                            <div className="flex flex-col sm:flex-row justify-between">
                              <div>
                                <h3 className="font-medium text-lg">{cert.title}</h3>
                                <div className="flex items-center text-muted-foreground mt-1 gap-1">
                                  {getTypeIcon(cert.type)}
                                  <span>
                                    {cert.type === 'equipment'
                                      ? isRTL
                                        ? 'شهادة معدات'
                                        : 'Equipment Certificate'
                                      : cert.type === 'personnel'
                                      ? isRTL
                                        ? 'شهادة موظف'
                                        : 'Personnel Certificate'
                                      : isRTL
                                      ? 'ترخيص شركة'
                                      : 'Company License'}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 sm:mt-0">{getStatusBadge(cert.status)}</div>
                            </div>
                            <div className="mt-3">
                              <div className="text-sm text-muted-foreground">
                                {isRTL ? "رقم الشهادة:" : "Certificate No:"} {cert.certificateNo} |{' '}
                                {isRTL ? "الجهة المصدرة:" : "Issuer:"} {cert.issuer}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>
                                  {isRTL ? "تاريخ الإصدار:" : "Issue Date:"} {cert.issueDate}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>
                                  {isRTL ? "تاريخ الانتهاء:" : "Expiry Date:"} {cert.expiryDate}
                                </span>
                              </div>
                            </div>
                            {cert.status === 'expiring' && (
                              <div className="mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{isRTL ? "الوقت المتبقي:" : "Time Remaining:"}</span>
                                  <span>
                                    {getDaysRemaining(cert.expiryDate)} {isRTL ? "يوم" : "days"}
                                  </span>
                                </div>
                                <Progress value={30} className="h-2" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-row sm:flex-col border-t sm:border-t-0 sm:border-l p-3 justify-around items-center sm:w-24 bg-slate-50 dark:bg-slate-800/50">
                            <Button variant="outline" size="sm" className="w-full mb-1 text-xs">
                              {isRTL ? "عرض" : "View"}
                            </Button>
                            <Button variant="ghost" size="sm" className="w-full text-xs">
                              {isRTL ? "تحديث" : "Renew"}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                ) : (
                  <Card className="p-6 text-center text-muted-foreground">
                    {isRTL ? "لا توجد شهادات مطابقة" : "No matching certifications found"}
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="equipment">
            <Card className="p-6 border-primary/20">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium mb-4">
                  {isRTL ? "شهادات المعدات" : "Equipment Certifications"}
                </h3>
              </div>
              <p className="text-muted-foreground">
                {isRTL
                  ? "لا توجد شهادات معدات متاحة حاليًا. أضف شهادة جديدة لعرضها هنا."
                  : "No equipment certifications currently available. Add a new certificate to view it here."}
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 flex items-center gap-2"
                variant="outline"
              >
                <Upload className="h-4 w-4" />
                {isRTL ? "إضافة شهادة" : "Add Certificate"}
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="personnel">
            <Card className="p-6 border-primary/20">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium mb-4">
                  {isRTL ? "شهادات الموظفين" : "Personnel Certifications"}
                </h3>
              </div>
              <p className="text-muted-foreground">
                {isRTL
                  ? "لا توجد شهادات موظفين متاحة حاليًا. أضف شهادة جديدة لعرضها هنا."
                  : "No personnel certifications currently available. Add a new certificate to view it here."}
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 flex items-center gap-2"
                variant="outline"
              >
                <Upload className="h-4 w-4" />
                {isRTL ? "إضافة شهادة" : "Add Certificate"}
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card className="p-6 border-primary/20">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium mb-4">
                  {isRTL ? "تراخيص الشركة" : "Company Licenses"}
                </h3>
              </div>
              <p className="text-muted-foreground">
                {isRTL
                  ? "لا توجد تراخيص شركة متاحة حاليًا. أضف ترخيصًا جديدًا لعرضه هنا."
                  : "No company licenses currently available. Add a new license to view it here."}
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 flex items-center gap-2"
                variant="outline"
              >
                <Upload className="h-4 w-4" />
                {isRTL ? "إضافة ترخيص" : "Add License"}
              </Button>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Certifications Preview Section */}
        <Card className="mt-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {isRTL ? "معاينة الشهادات الأخيرة" : "Recent Certifications Preview"}
            </CardTitle>
            <CardDescription>
              {isRTL ? "نظرة سريعة على الشهادات المضافة مؤخرًا" : "A quick look at recently added certifications"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <Shield size={16} className="mr-2 text-blue-600" />
                  {isRTL ? "فحص سلامة المصعد" : "Elevator Safety Inspection"}
                </h4>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm font-medium">{isRTL ? "رقم الشهادة: EL-2024-78956" : "Certificate No: EL-2024-78956"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? "تنتهي في 2025-05-15" : "Expires on 2025-05-15"}
                  </p>
                </div>
              </div>
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <Shield size={16} className="mr-2 text-blue-600" />
                  {isRTL ? "شهادة نظام إنذار الحريق" : "Fire Alarm System Certification"}
                </h4>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm font-medium">{isRTL ? "رقم الشهادة: FS-2024-45632" : "Certificate No: FS-2024-45632"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? "تنتهي في 2025-04-30" : "Expires on 2025-04-30"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Improved Modal for uploading new certificate */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh]">
            <DialogHeader className="space-y-2">
              <DialogTitle>{isRTL ? "رفع شهادة جديدة" : "Upload New Certificate"}</DialogTitle>
              <DialogDescription>
                {isRTL
                  ? "أدخل تفاصيل الشهادة وارفع المستندات ذات الصلة لتسجيلها في النظام."
                  : "Enter certificate details and upload relevant documents to register in the system."}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="grid gap-3 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
                  <Label htmlFor="title" className={isRTL ? "sm:text-right" : "sm:text-left"}>
                    {isRTL ? "العنوان" : "Title"}*
                  </Label>
                  <div className="sm:col-span-3">
                    <Input
                      id="title"
                      placeholder={isRTL ? "عنوان الشهادة" : "Certificate title"}
                      required
                      aria-label={isRTL ? "عنوان الشهادة" : "Certificate title"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
                  <Label htmlFor="type" className={isRTL ? "sm:text-right" : "sm:text-left"}>
                    {isRTL ? "النوع" : "Type"}*
                  </Label>
                  <div className="sm:col-span-3">
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر النوع" : "Select type"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equipment">{isRTL ? "شهادة معدات" : "Equipment Certificate"}</SelectItem>
                        <SelectItem value="personnel">{isRTL ? "شهادة موظف" : "Personnel Certificate"}</SelectItem>
                        <SelectItem value="company">{isRTL ? "ترخيص شركة" : "Company License"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2">
                    <Label htmlFor="certificateNo" className={isRTL ? "sm:text-right text-sm" : "sm:text-left text-sm"}>
                      {isRTL ? "رقم الشهادة" : "Certificate No."}*
                    </Label>
                    <Input
                      id="certificateNo"
                      placeholder={isRTL ? "رقم الشهادة" : "Certificate number"}
                      required
                      aria-label={isRTL ? "رقم الشهادة" : "Certificate number"}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2">
                    <Label htmlFor="issuer" className={isRTL ? "sm:text-right text-sm" : "sm:text-left text-sm"}>
                      {isRTL ? "الجهة المصدرة" : "Issuer"}*
                    </Label>
                    <Input
                      id="issuer"
                      placeholder={isRTL ? "الجهة المصدرة" : "Issuer name"}
                      required
                      aria-label={isRTL ? "الجهة المصدرة" : "Issuer"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2">
                    <Label htmlFor="issueDate" className={isRTL ? "sm:text-right text-sm" : "sm:text-left text-sm"}>
                      {isRTL ? "تاريخ الإصدار" : "Issue Date"}*
                    </Label>
                    <Input
                      id="issueDate"
                      type="date"
                      required
                      aria-label={isRTL ? "تاريخ الإصدار" : "Issue date"}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2">
                    <Label htmlFor="expiryDate" className={isRTL ? "sm:text-right text-sm" : "sm:text-left text-sm"}>
                      {isRTL ? "تاريخ الانتهاء" : "Expiry Date"}*
                    </Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      required
                      aria-label={isRTL ? "تاريخ الانتهاء" : "Expiry date"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 mt-2">
                  <Label className={isRTL ? "sm:text-right pt-0" : "sm:text-left pt-0"}>
                    {isRTL ? "رفع الملفات" : "Upload Files"}
                  </Label>
                  <div className="sm:col-span-3 border border-dashed rounded-md p-3 text-center">
                    <FilePlus className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? "اسحب وأفلت الملفات هنا أو" : "Drag and drop files here or"}
                      <Button variant="secondary" size="sm" className="ml-2 h-7 text-xs">
                        {isRTL ? "تصفح" : "Browse"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isRTL ? "PDF أو JPG أو PNG (بحد أقصى 10 ميجابايت)" : "PDF, JPG, or PNG (max 10MB)"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2">
                  <Label htmlFor="notes" className={isRTL ? "sm:text-right pt-2" : "sm:text-left pt-2"}>
                    {isRTL ? "ملاحظات" : "Notes"}
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder={isRTL ? "أضف ملاحظات إضافية..." : "Add additional notes..."}
                    className="sm:col-span-3"
                    rows={2}
                    aria-label={isRTL ? "ملاحظات" : "Notes"}
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
                          ? "تأكد من إدخال تواريخ دقيقة لتجنب مشاكل تتبع الشهادات."
                          : "Ensure accurate date entries to avoid issues with certificate tracking."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
              </DialogClose>
              <Button type="submit" size="sm">
                {isRTL ? "حفظ" : "Save"}
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isRTL ? "رفع شهادة" : "Upload Certificate"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Certifications;