import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  User, 
  Globe, 
  Lock, 
  Mail, 
  Smartphone, 
  Database, 
  Clock, 
  Info, 
  Lightbulb,
  Video
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? "الإعدادات" : "Settings"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL 
                ? "تخصيص وتكوين النظام الخاص بك ليناسب احتياجاتك" 
                : "Customize and configure your system to suit your needs"}
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2">
            <Video className="h-4 w-4" />
            {isRTL ? "شاهد الفيديو التعليمي" : "Watch Tutorial"}
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
                    ? "تعرف على كيفية تحسين إعدادات النظام بسرعة" 
                    : "Learn how to optimize your system settings quickly"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      {isRTL 
                        ? "قم بتمكين المصادقة الثنائية لتعزيز الأمان" 
                        : "Enable two-factor authentication for enhanced security"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">2</span>
                    </div>
                    <p className="text-sm">
                      {isRTL 
                        ? "خصص إشعاراتك لتجنب التشتت" 
                        : "Customize notifications to avoid distractions"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">3</span>
                    </div>
                    <p className="text-sm">
                      {isRTL 
                        ? "اضبط إعدادات اللغة للحصول على تجربة سلسة" 
                        : "Adjust language settings for a seamless experience"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-1 bg-muted">
            <TabsTrigger 
              value="account" 
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              {isRTL ? "الحساب" : "Account"}
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              {isRTL ? "الإشعارات" : "Notifications"}
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              {isRTL ? "الأمان" : "Security"}
            </TabsTrigger>
            <TabsTrigger 
              value="language" 
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {isRTL ? "اللغة" : "Language"}
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow flex items-center gap-2"
            >
              <SettingsIcon className="h-4 w-4" />
              {isRTL ? "النظام" : "System"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  {isRTL ? "إعدادات الحساب" : "Account Settings"}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? "إدارة تفاصيل حسابك والتفضيلات" 
                    : "Manage your account details and preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor="profile-visibility" className="font-semibold">
                            {isRTL ? "رؤية الملف الشخصي" : "Profile Visibility"}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {isRTL 
                              ? "السماح للآخرين برؤية ملفك الشخصي" 
                              : "Allow others to view your profile"}
                          </p>
                        </div>
                      </div>
                      <Switch id="profile-visibility" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor="two-factor" className="font-semibold">
                            {isRTL ? "المصادقة الثنائية" : "Two-Factor Authentication"}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {isRTL 
                              ? "إضافة طبقة أمان إضافية" 
                              : "Add an extra layer of security"}
                          </p>
                        </div>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "تغيير كلمة المرور" : "Change Password"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "تحديث كلمة المرور الخاصة بك للحفاظ على الأمان" 
                          : "Update your password to maintain security"}
                      </p>
                      <Button variant="outline" className="w-full">
                        {isRTL ? "تغيير كلمة المرور" : "Change Password"}
                      </Button>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "تحديث البريد الإلكتروني" : "Update Email"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "تغيير عنوان البريد الإلكتروني المرتبط بحسابك" 
                          : "Change the email address linked to your account"}
                      </p>
                      <Button variant="outline" className="w-full">
                        {isRTL ? "تحديث البريد الإلكتروني" : "Update Email"}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">
                        {isRTL ? "نصيحة أمان" : "Security Tip"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL 
                          ? "استخدم كلمة مرور قوية تحتوي على أحرف، أرقام، ورموز خاصة لتعزيز أمان حسابك." 
                          : "Use a strong password with letters, numbers, and special characters to enhance account security."}
                      </p>
                    </div>
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
                  {isRTL ? "إعدادات الإشعارات" : "Notification Settings"}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? "تخصيص كيفية تلقي الإشعارات" 
                    : "Customize how you receive notifications"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor="email-notifications" className="font-semibold">
                            {isRTL ? "إشعارات البريد الإلكتروني" : "Email Notifications"}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {isRTL 
                              ? "تلقي التنبيهات عبر البريد الإلكتروني" 
                              : "Receive alerts via email"}
                          </p>
                        </div>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Smartphone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor="sms-notifications" className="font-semibold">
                            {isRTL ? "إشعارات الرسائل القصيرة" : "SMS Notifications"}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {isRTL 
                              ? "تلقي التنبيهات عبر الرسائل النصية" 
                              : "Receive alerts via text messages"}
                          </p>
                        </div>
                      </div>
                      <Switch id="sms-notifications" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Bell className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor="push-notifications" className="font-semibold">
                            {isRTL ? "إشعارات التطبيق" : "Push Notifications"}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {isRTL 
                              ? "تلقي التنبيهات داخل التطبيق" 
                              : "Receive in-app alerts"}
                          </p>
                        </div>
                      </div>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "تخصيص الإشعارات" : "Customize Notifications"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "اختر أنواع التنبيهات التي تريد تلقيها" 
                          : "Select which types of alerts you want to receive"}
                      </p>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={isRTL ? "اختر نوع الإشعار" : "Select notification type"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                          <SelectItem value="critical">{isRTL ? "حرج فقط" : "Critical Only"}</SelectItem>
                          <SelectItem value="updates">{isRTL ? "التحديثات فقط" : "Updates Only"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "توقيت الإشعارات" : "Notification Timing"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "حدد أوقات تلقي الإشعارات" 
                          : "Set times for receiving notifications"}
                      </p>
                      <Select defaultValue="immediate">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={isRTL ? "اختر التوقيت" : "Select timing"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">{isRTL ? "فوري" : "Immediate"}</SelectItem>
                          <SelectItem value="daily">{isRTL ? "يومي" : "Daily Digest"}</SelectItem>
                          <SelectItem value="weekly">{isRTL ? "أسبوعي" : "Weekly Summary"}</SelectItem>
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
                        {isRTL ? "تلميح" : "Tip"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL 
                          ? "قم بإيقاف تشغيل الإشعارات غير الضرورية لتقليل الانحرافات أثناء العمل." 
                          : "Turn off non-essential notifications to reduce distractions during work."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  {isRTL ? "إعدادات الأمان" : "Security Settings"}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? "تعزيز أمان حسابك والبيانات" 
                    : "Enhance the security of your account and data"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor="session-timeout" className="font-semibold">
                            {isRTL ? "مهلة الجلسة" : "Session Timeout"}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {isRTL 
                              ? "مدة الجلسة قبل تسجيل الخروج التلقائي" 
                              : "Session duration before auto-logout"}
                          </p>
                        </div>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 {isRTL ? "دقيقة" : "min"}</SelectItem>
                          <SelectItem value="30">30 {isRTL ? "دقيقة" : "min"}</SelectItem>
                          <SelectItem value="60">60 {isRTL ? "دقيقة" : "min"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor="login-history" className="font-semibold">
                            {isRTL ? "تاريخ تسجيل الدخول" : "Login History"}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {isRTL 
                              ? "عرض سجل تسجيلات الدخول الأخيرة" 
                              : "View recent login activity"}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {isRTL ? "عرض" : "View"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "مراجعة الأجهزة المعتمدة" : "Review Authorized Devices"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "إدارة الأجهزة المصرح لها بالوصول إلى حسابك" 
                          : "Manage devices authorized to access your account"}
                      </p>
                      <Button variant="outline" className="w-full">
                        {isRTL ? "إدارة الأجهزة" : "Manage Devices"}
                      </Button>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "إعدادات جدار الحماية" : "Firewall Settings"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "تكوين قواعد جدار الحماية للوصول" 
                          : "Configure firewall rules for access"}
                      </p>
                      <Button variant="outline" className="w-full">
                        {isRTL ? "تكوين" : "Configure"}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">
                        {isRTL ? "تلميح أمان" : "Security Tip"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL 
                          ? "قم بمراجعة تاريخ تسجيل الدخول بانتظام للتأكد من عدم وجود أنشطة مشبوهة." 
                          : "Regularly review login history to ensure no suspicious activity."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  {isRTL ? "إعدادات اللغة" : "Language Settings"}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? "تخصيص تفضيلات اللغة والتنسيق" 
                    : "Customize language and format preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor="enable-rtl" className="font-semibold">
                            {isRTL ? "دعم RTL" : "RTL Support"}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {isRTL 
                              ? "تمكين الكتابة من اليمين إلى اليسار" 
                              : "Enable right-to-left text direction"}
                          </p>
                        </div>
                      </div>
                      <Switch id="enable-rtl" defaultChecked={isRTL} />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "اللغة الأساسية" : "Primary Language"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "اختر اللغة الأساسية للتطبيق" 
                          : "Select the primary language for the application"}
                      </p>
                      <Select defaultValue={currentLanguage}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">{isRTL ? "الإنجليزية" : "English"}</SelectItem>
                          <SelectItem value="ar">{isRTL ? "العربية" : "Arabic"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "تنسيق التاريخ" : "Date Format"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "اختر تنسيق العرض للتواريخ" 
                          : "Choose the display format for dates"}
                      </p>
                      <Select defaultValue={isRTL ? "DD/MM/YYYY" : "MM/DD/YYYY"}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "تنسيق الوقت" : "Time Format"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "اختر تنسيق العرض للوقت" 
                          : "Choose the display format for time"}
                      </p>
                      <Select defaultValue="12">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">{isRTL ? "12 ساعة" : "12-hour"}</SelectItem>
                          <SelectItem value="24">{isRTL ? "24 ساعة" : "24-hour"}</SelectItem>
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
                        {isRTL ? "تلميح" : "Tip"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL 
                          ? "يمكنك التبديل بين اللغات بسهولة من شريط التنقل العلوي في أي وقت." 
                          : "You can switch between languages easily from the top navigation bar at any time."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SettingsIcon className="h-5 w-5 mr-2 text-primary" />
                  {isRTL ? "إعدادات النظام" : "System Settings"}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? "تكوين إعدادات النظام والنسخ الاحتياطي" 
                    : "Configure system settings and backups"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor="auto-backup" className="font-semibold">
                            {isRTL ? "النسخ الاحتياطي التلقائي" : "Automatic Backup"}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {isRTL 
                              ? "تمكين النسخ الاحتياطي التلقائي للبيانات" 
                              : "Enable automatic data backups"}
                          </p>
                        </div>
                      </div>
                      <Switch id="auto-backup" defaultChecked />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "الاحتفاظ بالبيانات" : "Data Retention"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "تحديد مدة الاحتفاظ بالبيانات" 
                          : "Set the duration for data retention"}
                      </p>
                      <Select defaultValue="90">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 {isRTL ? "يوم" : "days"}</SelectItem>
                          <SelectItem value="90">90 {isRTL ? "يوم" : "days"}</SelectItem>
                          <SelectItem value="180">180 {isRTL ? "يوم" : "days"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "إعادة تعيين النظام" : "Reset System"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "إعادة النظام إلى الإعدادات الافتراضية" 
                          : "Reset the system to default settings"}
                      </p>
                      <Button variant="outline" className="w-full">
                        {isRTL ? "إعادة تعيين" : "Reset"}
                      </Button>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="font-semibold">
                        {isRTL ? "تكامل النظام" : "System Integrations"}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL 
                          ? "إدارة التكامل مع تطبيقات الطرف الثالث" 
                          : "Manage integrations with third-party applications"}
                      </p>
                      <Button variant="outline" className="w-full">
                        {isRTL ? "إدارة التكامل" : "Manage Integrations"}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">
                        {isRTL ? "تلميح" : "Tip"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL 
                          ? "تأكد من تفعيل النسخ الاحتياطي التلقائي لحماية بياناتك من الفقدان." 
                          : "Ensure automatic backups are enabled to protect your data from loss."}
                      </p>
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

export default Settings;