import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Layout, 
  Users, 
  FileCheck, 
  Bell, 
  CheckSquare,
  FileText,
  ArrowRight,
  Lightbulb,
  Info,
  HelpCircle,
  Video
} from "lucide-react";

const HowItWorks = () => {
  const { currentLanguage } = useLanguage();
  const isArabic = currentLanguage === 'ar';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isArabic ? "كيف يعمل النظام" : "How It Works"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isArabic 
                ? "دليل شامل لاستخدام منصة YourHSE Partner" 
                : "A comprehensive guide to using the YourHSE Partner platform"}
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2">
            <Video className="h-4 w-4" />
            {isArabic ? "شاهد الفيديو التعليمي" : "Watch Tutorial"}
          </Button>
        </div>

        {/* Quick Help Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="rounded-full bg-primary/10 p-3 shrink-0">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {isArabic ? "نصائح سريعة" : "Quick Tips"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isArabic 
                    ? "تعرف على أساسيات النظام في أقل من دقيقة" 
                    : "Learn the system basics in less than a minute"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      {isArabic 
                        ? "استخدم كود الألوان للتعرف سريعاً على حالة المستندات" 
                        : "Use color codes to quickly identify document status"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">2</span>
                    </div>
                    <p className="text-sm">
                      {isArabic 
                        ? "تحقق من التنبيهات يومياً للبقاء على اطلاع" 
                        : "Check alerts daily to stay informed"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">3</span>
                    </div>
                    <p className="text-sm">
                      {isArabic 
                        ? "حمل التطبيق على هاتفك للوصول السريع" 
                        : "Download the mobile app for quick access"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 p-1 bg-muted">
            <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              <Layout className="h-4 w-4 mr-2" />
              {isArabic ? "نظرة عامة" : "Overview"}
            </TabsTrigger>
            <TabsTrigger value="interface" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              <Layout className="h-4 w-4 mr-2" />
              {isArabic ? "الواجهة" : "Interface"}
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              <FileCheck className="h-4 w-4 mr-2" />
              {isArabic ? "المستندات" : "Documents"}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              <Bell className="h-4 w-4 mr-2" />
              {isArabic ? "التنبيهات" : "Notifications"}
            </TabsTrigger>
            <TabsTrigger value="checklists" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              <CheckSquare className="h-4 w-4 mr-2" />
              {isArabic ? "قوائم التحقق" : "Checklists"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Layout className="h-5 w-5 mr-2 text-primary" />
                  {isArabic ? "نظام YourHSE Partner" : "YourHSE Partner System"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? "نظرة عامة على النظام وميزاته الرئيسية" 
                    : "An overview of the system and its key features"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Layout className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isArabic ? "واجهة بديهية" : "Intuitive Interface"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isArabic 
                            ? "تصميم سهل الاستخدام مع تخطيط مستجيب للشاشات المختلفة" 
                            : "User-friendly design with responsive layout for different screens"}
                        </p>
                        <Button variant="link" className="px-0 py-1 h-auto text-primary text-sm flex items-center">
                          {isArabic ? "معرفة المزيد" : "Learn more"}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isArabic ? "أدوار متعددة للمستخدمين" : "Multi-User Roles"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isArabic 
                            ? "وصول مخصص ومحدد حسب دور المستخدم" 
                            : "Customized access and permissions based on user role"}
                        </p>
                        <Button variant="link" className="px-0 py-1 h-auto text-primary text-sm flex items-center">
                          {isArabic ? "معرفة المزيد" : "Learn more"}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <FileCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isArabic ? "إدارة المستندات" : "Document Management"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isArabic 
                            ? "تتبع سهل للمستندات والشهادات وتواريخ الانتهاء" 
                            : "Easy tracking of documents, certificates, and expiry dates"}
                        </p>
                        <Button variant="link" className="px-0 py-1 h-auto text-primary text-sm flex items-center">
                          {isArabic ? "معرفة المزيد" : "Learn more"}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isArabic ? "نظام التنبيهات" : "Alert System"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isArabic 
                            ? "تنبيهات تلقائية للمستندات منتهية الصلاحية أو التي تقترب من الانتهاء" 
                            : "Automatic alerts for expired or soon-to-expire documents"}
                        </p>
                        <Button variant="link" className="px-0 py-1 h-auto text-primary text-sm flex items-center">
                          {isArabic ? "معرفة المزيد" : "Learn more"}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isArabic ? "قوائم تحقق ديناميكية" : "Dynamic Checklists"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isArabic 
                            ? "قوائم تحقق مخصصة حسب نوع المعدات وجداول الصيانة" 
                            : "Custom checklists based on equipment type and maintenance schedules"}
                        </p>
                        <Button variant="link" className="px-0 py-1 h-auto text-primary text-sm flex items-center">
                          {isArabic ? "معرفة المزيد" : "Learn more"}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isArabic ? "تقارير وتحليلات" : "Reports & Analytics"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isArabic 
                            ? "رؤى بصرية واضحة من خلال الرسوم البيانية والإحصاءات" 
                            : "Visual insights through charts and statistics"}
                        </p>
                        <Button variant="link" className="px-0 py-1 h-auto text-primary text-sm flex items-center">
                          {isArabic ? "معرفة المزيد" : "Learn more"}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" />
                    {isArabic ? "كود الألوان" : "Color Coding"}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-background rounded-md p-3 flex items-center gap-3">
                      <div className="h-6 w-6 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">
                          {isArabic ? "صالح" : "Valid"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isArabic ? "المستند ساري المفعول" : "Document is current"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-background rounded-md p-3 flex items-center gap-3">
                      <div className="h-6 w-6 bg-amber-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">
                          {isArabic ? "ينتهي قريبًا" : "Expiring Soon"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isArabic ? "أقل من 30 يوم" : "Less than 30 days"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-background rounded-md p-3 flex items-center gap-3">
                      <div className="h-6 w-6 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">
                          {isArabic ? "منتهي الصلاحية" : "Expired"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isArabic ? "تجاوز تاريخ الانتهاء" : "Past expiry date"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-background rounded-md p-3 flex items-center gap-3">
                      <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">
                          {isArabic ? "غير نشط" : "Inactive"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isArabic ? "معدات غير مستخدمة" : "Equipment not in use"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Get Started Card */}
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="roundedSip-full bg-primary/10 p-3 shrink-0">
                      <HelpCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {isArabic ? "هل تحتاج إلى مساعدة؟" : "Need Help?"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {isArabic 
                          ? "يمكنك الوصول إلى دعم مباشر أو استكشاف أدلة مفصلة" 
                          : "Access live support or explore detailed guides"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-auto">
                      {isArabic ? "مركز المساعدة" : "Help Center"}
                    </Button>
                    <Button className="flex-1 md:flex-auto">
                      {isArabic ? "اتصل بالدعم" : "Contact Support"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interface" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layout className="h-5 w-5 mr-2 text-primary" />
                  {isArabic ? "واجهة المستخدم" : "User Interface"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? "فهم عناصر واجهة المستخدم والتنقل" 
                    : "Understanding UI elements and navigation"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-5 bg-muted/10 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Layout className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">
                          {isArabic ? "الشريط الجانبي" : "Sidebar"}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {isArabic 
                          ? "استخدم الشريط الجانبي للتنقل بين أقسام التطبيق المختلفة" 
                          : "Use the sidebar to navigate between different sections of the application"}
                      </p>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3 bg-background p-3 rounded-md">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-medium">1</span>
                          </div>
                          <div>
                            <p className="font-medium">{isArabic ? "قسم لوحة القيادة" : "Dashboard section"}</p>
                            <p className="text-xs text-muted-foreground">{isArabic ? "نظرة عامة على النظام" : "System overview"}</p>
                          </div>
                        </li>
                        <li className="flex items-center gap-3 bg-background p-3 rounded-md">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-medium">2</span>
                          </div>
                          <div>
                            <p className="font-medium">{isArabic ? "سجل المعدات" : "Equipment registry"}</p>
                            <p className="text-xs text-muted-foreground">{isArabic ? "إدارة المعدات" : "Equipment management"}</p>
                          </div>
                        </li>
                        <li className="flex items-center gap-3 bg-background p-3 rounded-md">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-medium">3</span>
                          </div>
                          <div>
                            <p className="font-medium">{isArabic ? "الإشعارات والتنبيهات" : "Notifications and alerts"}</p>
                            <p className="text-xs text-muted-foreground">{isArabic ? "تتبع التحديثات" : "Track updates"}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-5 bg-muted/10 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Layout className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">
                          {isArabic ? "الشريط العلوي" : "Top Bar"}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {isArabic 
                          ? "يوفر الوصول السريع إلى الإعدادات والمعلومات المهمة" 
                          : "Provides quick access to settings and important information"}
                      </p>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3 bg-background p-3 rounded-md">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-medium">1</span>
                          </div>
                          <div>
                            <p className="font-medium">{isArabic ? "مفتاح تبديل اللغة" : "Language toggle"}</p>
                            <p className="text-xs text-muted-foreground">{isArabic ? "تبديل بين اللغات" : "Switch between languages"}</p>
                          </div>
                        </li>
                        <li className="flex items-center gap-3 bg-background p-3 rounded-md">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-medium">2</span>
                          </div>
                          <div>
                            <p className="font-medium">{isArabic ? "إشعارات النظام" : "System notifications"}</p>
                            <p className="text-xs text-muted-foreground">{isArabic ? "تنبيهات مهمة" : "Important alerts"}</p>
                          </div>
                        </li>
                        <li className="flex items-center gap-3 bg-background p-3 rounded-md">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-medium">3</span>
                          </div>
                          <div>
                            <p className="font-medium">{isArabic ? "معلومات المستخدم وتسجيل الخروج" : "User info and logout"}</p>
                            <p className="text-xs text-muted-foreground">{isArabic ? "إدارة الحساب" : "Account management"}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-5 bg-muted/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Layout className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        {isArabic ? "الوضع المستجيب" : "Responsive Mode"}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {isArabic 
                        ? "يتكيف التطبيق مع أحجام الشاشات المختلفة" 
                        : "The application adapts to different screen sizes"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border bg-background rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-center h-16 mb-3">
                          <svg width="10" height="20" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                            <rect x="0.5" y="0.5" width="7" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                            <rect x="3" y="10" width="2" height="2" rx="1" fill="currentColor"/>
                          </svg>
                        </div>
                        <p className="font-medium">{isArabic ? "الجوال" : "Mobile"}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isArabic ? "تخطيط مبسط وقابل للتمرير" : "Simplified, scrollable layout"}
                        </p>
                      </div>
                      <div className="border bg-background rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-center h-16 mb-3">
                          <svg width="24" height="18" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                            <rect x="0.5" y="0.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                            <rect x="7" y="9" width="2" height="1" rx="0.5" fill="currentColor"/>
                          </svg>
                        </div>
                        <p className="font-medium">{isArabic ? "جهاز لوحي" : "Tablet"}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isArabic ? "مزيج من عناصر الجوال والحاسوب" : "Hybrid of mobile and desktop"}
                        </p>
                      </div>
                      <div className="border bg-background rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-center h-16 mb-3">
                          <svg width="28" height="20" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                            <rect x="0.5" y="0.5" width="17" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                            <rect x="0" y="11" width="18" height="3" rx="1" fill="currentColor" fillOpacity="0.2"/>
                            <rect x="7" y="12" width="4" height="1" rx="0.5" fill="currentColor"/>
                          </svg>
                        </div>
                        <p className="font-medium">{isArabic ? "سطح المكتب" : "Desktop"}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isArabic ? "تجربة كاملة مع جميع الميزات" : "Full experience with all features"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-primary/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-primary" />
                        <p className="font-medium text-sm">
                          {isArabic ? "نصيحة مفيدة" : "Helpful Tip"}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic 
                          ? "يمكنك دائمًا العودة إلى الوضع الكامل للشاشة عن طريق النقر على أيقونة التوسيع في شريط التنقل" 
                          : "You can always return to full-screen mode by clicking the expand icon in the navigation bar"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Interactive Elements Section */}
                  <div className="border rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Layout className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        {isArabic ? "العناصر التفاعلية" : "Interactive Elements"}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border bg-background rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-3 flex items-center">
                          <Button size="icon" variant="ghost" className="h-6 w-6 mr-2 rounded-full">
                            <span className="text-xs">?</span>
                          </Button>
                          {isArabic ? "أزرار المساعدة" : "Help Buttons"}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {isArabic 
                            ? "انقر على أزرار المساعدة للحصول على تلميحات حول ميزات معينة" 
                            : "Click on help buttons for tooltips about specific features"}
                        </p>
                        <div className="bg-muted p-3 rounded-md flex items-center gap-2">
                          <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full">
                            <span className="text-xs">?</span>
                          </Button>
                          <span className="text-xs">{isArabic ? "اضغط للمساعدة" : "Press for help"}</span>
                        </div>
                      </div>
                      
                      <div className="border bg-background rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-3 flex items-center">
                          <div className="h-6 w-6 rounded bg-status-warning mr-2"></div>
                          {isArabic ? "مؤشرات الحالة" : "Status Indicators"}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {isArabic 
                            ? "توضح ألوان الحالة المختلفة بسرعة حالة العناصر" 
                            : "Different status colors quickly show item states"}
                        </p>
                        <div className="bg-muted p-3 rounded-md flex flex-wrap gap-2">
                          <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                          <div className="h-4 w-4 bg-amber-500 rounded-full"></div>
                          <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                          <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-primary" />
                  {isArabic ? "إدارة المستندات" : "Document Management"}
                </CardTitle>
                <CardDescription>
                  {isArabic ? "تحميل وتتبع المستندات" : "Uploading and tracking documents"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Document Types */}
                  <div className="border rounded-lg p-5 bg-muted/10">
                    <h3 className="font-semibold text-lg mb-4">
                      {isArabic ? "أنواع المستندات المدعومة" : "Supported Document Types"}
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-background rounded-lg p-4 border hover:shadow-sm transition-shadow text-center">
                        <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium text-sm">{isArabic ? "شهادات" : "Certificates"}</p>
                      </div>
                      
                      <div className="bg-background rounded-lg p-4 border hover:shadow-sm transition-shadow text-center">
                        <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium text-sm">{isArabic ? "تراخيص" : "Licenses"}</p>
                      </div>
                      
                      <div className="bg-background rounded-lg p-4 border hover:shadow-sm transition-shadow text-center">
                        <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium text-sm">{isArabic ? "تقارير الفحص" : "Inspection Reports"}</p>
                      </div>
                      
                      <div className="bg-background rounded-lg p-4 border hover:shadow-sm transition-shadow text-center">
                        <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium text-sm">{isArabic ? "أدلة المستخدم" : "User Manuals"}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Button variant="link" className="text-sm">
                        {isArabic ? "عرض كل أنواع المستندات" : "View all document types"}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Document Upload Process */}
                  <div className="border rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-4">
                      {isArabic ? "عملية تحميل المستندات" : "Document Upload Process"}
                    </h3>
                    
                    <div className="relative">
                      {/* Connecting Line */}
                      <div className="hidden md:block absolute top-10 left-10 w-[calc(100%-80px)] h-0.5 bg-primary/20"></div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-background rounded-lg p-4 border relative">
                          <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center absolute -top-4 left-4 border-4 border-background">
                            <span className="font-medium text-primary">1</span>
                          </div>
                          <div className="pt-4">
                            <h4 className="font-medium text-sm mb-2">
                              {isArabic ? "اختيار القسم" : "Select Section"}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {isArabic 
                                ? "اختر قسم المستندات المناسب" 
                                : "Choose the appropriate document section"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-background rounded-lg p-4 border relative">
                          <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center absolute -top-4 left-4 border-4 border-background">
                            <span className="font-medium text-primary">2</span>
                          </div>
                          <div className="pt-4">
                            <h4 className="font-medium text-sm mb-2">
                              {isArabic ? "تحميل الملف" : "Upload File"}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {isArabic 
                                ? "اسحب وأفلت أو انقر لتحميل" 
                                : "Drag & drop or click to upload"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-background rounded-lg p-4 border relative">
                          <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center absolute -top-4 left-4 border-4 border-background">
                            <span className="font-medium text-primary">3</span>
                          </div>
                          <div className="pt-4">
                            <h4 className="font-medium text-sm mb-2">
                              {isArabic ? "إضافة البيانات" : "Add Metadata"}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {isArabic 
                                ? "أدخل التفاصيل وتواريخ الصلاحية" 
                                : "Enter details and expiry dates"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-background rounded-lg p-4 border relative">
                          <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center absolute -top-4 left-4 border-4 border-background">
                            <span className="font-medium text-primary">4</span>
                          </div>
                          <div className="pt-4">
                            <h4 className="font-medium text-sm mb-2">
                              {isArabic ? "تأكيد وحفظ" : "Confirm & Save"}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {isArabic 
                                ? "راجع المعلومات واحفظ المستند" 
                                : "Review info and save document"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-primary/5 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0">
                          <Info className="h-5 w-5 text-primary mt-0.5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm mb-1">
                            {isArabic ? "تذكير مهم" : "Important Reminder"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {isArabic 
                              ? "تأكد من أن جميع المستندات المحملة واضحة ومقروءة. يدعم النظام ملفات PDF وJPG وPNG بحد أقصى 10 ميجابايت لكل ملف." 
                              : "Ensure all uploaded documents are clear and legible. The system supports PDF, JPG, and PNG files with a maximum of 10MB per file."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Document Tutorial Button */}
                  <div className="text-center">
                    <Button className="gap-2">
                      <Video className="h-4 w-4" />
                      {isArabic ? "شاهد فيديو شرح إدارة المستندات" : "Watch Document Management Tutorial"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  {isArabic ? "نظام التنبيهات" : "Notifications System"}
                </CardTitle>
                <CardDescription>
                  {isArabic ? "فهم التنبيهات والإشعارات" : "Understanding alerts and notifications"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Notification Types */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-5 bg-muted/10 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Bell className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">
                          {isArabic ? "أنواع التنبيهات" : "Alert Types"}
                        </h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-background p-3 rounded-md border-l-4 border-amber-500">
                          <p className="font-medium text-sm">
                            {isArabic ? "تنبيهات قرب انتهاء الصلاحية" : "Expiry Warnings"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isArabic 
                              ? "إشعارات عندما تقترب المستندات من تاريخ انتهاء الصلاحية" 
                              : "Notifications when documents are approaching expiry dates"}
                          </p>
                        </div>
                        
                        <div className="bg-background p-3 rounded-md border-l-4 border-red-500">
                          <p className="font-medium text-sm">
                            {isArabic ? "تنبيهات منتهية الصلاحية" : "Expired Alerts"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isArabic 
                              ? "إشعارات للمستندات التي انتهت صلاحيتها" 
                              : "Notifications for documents that have expired"}
                          </p>
                        </div>
                        
                        <div className="bg-background p-3 rounded-md border-l-4 border-blue-500">
                          <p className="font-medium text-sm">
                            {isArabic ? "تحديثات النظام" : "System Updates"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isArabic 
                              ? "إشعارات حول تحديثات النظام والميزات الجديدة" 
                              : "Notifications about system updates and new features"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-5 bg-muted/10 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Bell className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">
                          {isArabic ? "إعدادات الإشعارات" : "Notification Settings"}
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-background p-3 rounded-md">
                          <div>
                            <p className="font-medium text-sm">
                              {isArabic ? "تنبيهات البريد الإلكتروني" : "Email Alerts"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isArabic ? "إرسال التنبيهات عبر البريد الإلكتروني" : "Send alerts via email"}
                            </p>
                          </div>
                          <div className="h-5 w-10 bg-primary rounded-full relative flex items-center cursor-pointer">
                            <div className="h-4 w-4 bg-white rounded-full absolute right-0.5"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-background p-3 rounded-md">
                          <div>
                            <p className="font-medium text-sm">
                              {isArabic ? "إشعارات النظام" : "System Notifications"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isArabic ? "عرض الإشعارات داخل التطبيق" : "Show notifications in-app"}
                            </p>
                          </div>
                          <div className="h-5 w-10 bg-primary rounded-full relative flex items-center cursor-pointer">
                            <div className="h-4 w-4 bg-white rounded-full absolute right-0.5"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-background p-3 rounded-md">
                          <div>
                            <p className="font-medium text-sm">
                              {isArabic ? "الرسائل النصية" : "SMS Notifications"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isArabic ? "إرسال تنبيهات عبر الرسائل النصية" : "Send alerts via text message"}
                            </p>
                          </div>
                          <div className="h-5 w-10 bg-muted rounded-full relative flex items-center cursor-pointer">
                            <div className="h-4 w-4 bg-background rounded-full absolute left-0.5 border"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notification Center Preview */}
                  <div className="border rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-4">
                      {isArabic ? "مركز الإشعارات" : "Notification Center"}
                    </h3>
                    
                    <div className="border rounded-lg bg-background overflow-hidden">
                      <div className="bg-muted p-3 border-b flex items-center justify-between">
                        <p className="font-medium text-sm">
                          {isArabic ? "الإشعارات الأخيرة" : "Recent Notifications"}
                        </p>
                        <Button variant="ghost" size="sm" className="h-8">
                          {isArabic ? "تعيين الكل كمقروء" : "Mark all as read"}
                        </Button>
                      </div>
                      
                      <div className="divide-y">
                        <div className="p-4 bg-primary/5">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                              <Bell className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {isArabic ? "شهادة السلامة تنتهي قريبًا" : "Safety Certificate Expiring Soon"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {isArabic ? "ستنتهي صلاحية المستند في 15 يومًا" : "Document will expire in 15 days"}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <Button variant="secondary" size="sm" className="h-7 text-xs">
                                  {isArabic ? "تحديث الآن" : "Update Now"}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  {isArabic ? "تذكيري لاحقًا" : "Remind Later"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <Info className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {isArabic ? "تحديث جديد للنظام" : "New System Update"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {isArabic ? "تم إضافة ميزات جديدة وإصلاحات" : "New features and fixes have been added"}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                              <Bell className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {isArabic ? "مستند منتهي الصلاحية" : "Expired Document"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {isArabic ? "انتهت صلاحية رخصة المعدات منذ 3 أيام" : "Equipment license expired 3 days ago"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="checklists" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2 text-primary" />
                  {isArabic ? "قوائم التحقق" : "Checklists"}
                </CardTitle>
                <CardDescription>
                  {isArabic ? "استخدام وإنشاء قوائم التحقق" : "Using and creating checklists"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Checklist Types */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckSquare className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">
                          {isArabic ? "الفحص اليومي" : "Daily Inspection"}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isArabic 
                          ? "قوائم التحقق للعمليات والمعدات اليومية" 
                          : "Checklists for daily operations and equipment"}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        {isArabic ? "عرض النماذج" : "View Templates"}
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckSquare className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">
                          {isArabic ? "الصيانة الدورية" : "Periodic Maintenance"}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isArabic 
                          ? "قوائم التحقق للصيانة الأسبوعية والشهرية" 
                          : "Checklists for weekly and monthly maintenance"}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        {isArabic ? "عرض النماذج" : "View Templates"}
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckSquare className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">
                          {isArabic ? "قوائم مخصصة" : "Custom Checklists"}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isArabic 
                          ? "إنشاء قوائم تحقق مخصصة لاحتياجاتك" 
                          : "Create custom checklists for your needs"}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        {isArabic ? "إنشاء قائمة جديدة" : "Create New"}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Checklist Examples */}
                  <div className="border rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-4">
                      {isArabic ? "مثال قائمة التحقق" : "Checklist Example"}
                    </h3>
                    <div className="bg-background rounded-lg border">
                      <div className="p-4 border-b bg-muted/30">
                        <p className="font-medium text-sm">{isArabic ? "قائمة فحص المعدات اليومية" : "Daily Equipment Inspection Checklist"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{isArabic ? "تم إنشاؤها في 15 أبريل 2025" : "Created on April 15, 2025"}</p>
                      </div>
                      <div className="divide-y">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                            <p className="text-sm">{isArabic ? "فحص مستوى الزيت" : "Check oil level"}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">{isArabic ? "إضافة ملاحظة" : "Add Note"}</Button>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                            <p className="text-sm">{isArabic ? "فحص ضغط الإطارات" : "Check tire pressure"}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">{isArabic ? "إضافة ملاحظة" : "Add Note"}</Button>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                            <p className="text-sm">{isArabic ? "اختبار الفرامل" : "Test brakes"}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">{isArabic ? "إضافة ملاحظة" : "Add Note"}</Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="link" className="text-sm">{isArabic ? "عرض المزيد من الأمثلة" : "View More Examples"}</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HowItWorks;