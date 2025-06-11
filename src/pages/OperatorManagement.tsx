import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OperatorTab } from "@/components/OperatorTab";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, UserCheck, FileCheck, Search, Upload, User, Camera, Lightbulb, Wrench, CheckCircle, AlertTriangle, Clock, Share2 } from "lucide-react";

const ShareOperatorModal = ({
  open,
  onOpenChange,
  operator,
  onShare,
  loading,
  isRTL,
}) => {
  const { t } = useLanguage();
  const [shareMethod, setShareMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    if (operator) {
      setShareLink(`https://example.com/operator/${operator.id}`);
    }
  }, [operator]);

  const handleShare = () => {
    if (shareMethod === "email" && !email.trim()) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى إدخال بريد إلكتروني صالح" : "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    onShare(shareMethod === "email" ? { email } : { link: shareLink });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isRTL ? "مشاركة المشغل" : "Share Operator"}
          </DialogTitle>
          <DialogDescription>
            {isRTL
              ? "شارك تفاصيل المشغل عبر البريد الإلكتروني أو رابط."
              : "Share operator details via email or a link."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="share-method">
              {isRTL ? "طريقة المشاركة" : "Share Method"}
            </Label>
            <Select
              value={shareMethod}
              onValueChange={setShareMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? "اختر طريقة" : "Select method"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">{isRTL ? "بريد إلكتروني" : "Email"}</SelectItem>
                <SelectItem value="link">{isRTL ? "رابط" : "Link"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {shareMethod === "email" ? (
            <div className="grid gap-2">
              <Label htmlFor="email">{isRTL ? "البريد الإلكتروني" : "Email Address"}</Label>
              <Input
                id="email"
                type="email"
                placeholder={isRTL ? "أدخل البريد الإلكتروني" : "Enter email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="share-link">{isRTL ? "رابط المشاركة" : "Shareable Link"}</Label>
              <Input
                id="share-link"
                value={shareLink}
                readOnly
                onClick={(e) => e.target.select()}
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  toast({
                    title: isRTL ? "تم النسخ" : "Copied",
                    description: isRTL ? "تم نسخ الرابط إلى الحافظة" : "Link copied to clipboard",
                  });
                }}
              >
                {isRTL ? "نسخ الرابط" : "Copy Link"}
              </Button>
            </div>
          )}

          {operator && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">{operator.name}</p>
              <p className="text-xs text-muted-foreground">{operator.email}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleShare} disabled={loading}>
            {loading ? (isRTL ? "جارٍ المشاركة..." : "Sharing...") : (isRTL ? "مشاركة" : "Share")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const OperatorManagement = () => {
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newOperator, setNewOperator] = useState({
    name: "",
    email: "",
    nationality: "",
    operatorType: "",
    photo: null,
    thirdPartyCertificate: null,
    drivingLicense: null,
    idCard: null,
    healthFitnessCertificate: null,
    otherDocuments: [],
    project: "Project A",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [selectedProject, setSelectedProject] = useState("Project A");
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";

  useEffect(() => {
    const mockOperators = [
      {
        id: "op1",
        name: "John Doe",
        email: "john.doe@example.com",
        nationality: "United States",
        operatorType: "Heavy Equipment",
        photo: null,
        thirdPartyCertificate: null,
        drivingLicense: null,
        idCard: null,
        healthFitnessCertificate: null,
        otherDocuments: [],
        documents: [],
        active: true,
        project: "Project A",
      },
      {
        id: "op2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        nationality: "Canada",
        operatorType: "Crane Operator",
        photo: null,
        thirdPartyCertificate: null,
        drivingLicense: null,
        idCard: null,
        healthFitnessCertificate: null,
        otherDocuments: [],
        documents: [],
        active: true,
        project: "Project B",
      },
      {
        id: "op3",
        name: "Ahmed Khan",
        email: "ahmed.khan@example.com",
        nationality: "India",
        operatorType: "Excavator Operator",
        photo: null,
        thirdPartyCertificate: null,
        drivingLicense: null,
        idCard: null,
        healthFitnessCertificate: null,
        otherDocuments: [],
        documents: [],
        active: false,
        project: "Project C",
      },
    ];
    setOperators(mockOperators);
  }, []);

  const handleSave = (updatedOperator) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === updatedOperator.id ? updatedOperator : op))
    );
    toast({
      title: isRTL ? "نجاح" : "Success",
      description: isRTL ? "تم تحديث معلومات المشغل بنجاح" : "Operator information has been updated successfully.",
    });
  };

  const handleFileUpload = (field, file) => {
    setNewOperator((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleAddOperator = () => {
    if (!newOperator.name.trim() || !newOperator.email.trim() || !newOperator.nationality || !newOperator.operatorType || !newOperator.project) {
      toast({
        title: isRTL ? "خطأ في التحقق" : "Validation Error",
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، الجنسية، نوع المشغل، المشروع)." : "Please fill all required fields (Name, Email, Nationality, Operator Type, Project).",
        variant: "destructive",
      });
      return;
    }

    const operatorToAdd = {
      id: `op${Date.now()}`,
      ...newOperator,
      documents: [],
      active: true,
    };

    setOperators([...operators, operatorToAdd]);
    setSelectedOperator(operatorToAdd);
    setNewOperator({
      name: "",
      email: "",
      nationality: "",
      operatorType: "",
      photo: null,
      thirdPartyCertificate: null,
      drivingLicense: null,
      idCard: null,
      healthFitnessCertificate: null,
      otherDocuments: [],
      project: "Project A",
    });
    setIsAddDialogOpen(false);
    setActiveTab("documents");

    toast({
      title: isRTL ? "تم إضافة المشغل" : "Operator Added",
      description: isRTL ? "تم إضافة المشغل الجديد بنجاح." : "New operator has been added successfully.",
    });
  };

  const handleShare = (shareData) => {
    setIsShareModalOpen(false);
    toast({
      title: isRTL ? "نجاح" : "Success",
      description: isRTL
        ? `تمت مشاركة المشغل بنجاح عبر ${shareData.email ? "البريد الإلكتروني" : "رابط"}`
        : `Operator shared successfully via ${shareData.email ? "email" : "link"}`,
    });
  };

  const handleSelectOperator = (operator) => {
    setSelectedOperator(operator);
    setActiveTab("documents");
  };

  const filteredOperators = operators.filter(
    (op) =>
      op.project === selectedProject &&
      (op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.operatorType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const documentCounts = operators.reduce((acc, op) => {
    let count = 0;
    if (op.thirdPartyCertificate) count++;
    if (op.drivingLicense) count++;
    if (op.idCard) count++;
    if (op.healthFitnessCertificate) count++;
    if (op.otherDocuments?.length) count += op.otherDocuments.length;
    acc[op.id] = count;
    return acc;
  }, {});

  const operatorStats = {
    total: filteredOperators.length,
    active: filteredOperators.filter((op) => op.active).length,
    inactive: filteredOperators.filter((op) => !op.active).length,
    byType: filteredOperators.reduce((acc, op) => {
      acc[op.operatorType] = (acc[op.operatorType] || 0) + 1;
      return acc;
    }, {}),
  };

  const operatorTypes = [
    "Heavy Equipment",
    "Crane Operator",
    "Forklift Operator",
    "Excavator Operator",
    "Bulldozer Operator",
    "Loader Operator",
    "Other",
  ];

  const nationalities = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "South Korea",
    "Singapore",
    "India",
    "China",
    "Other",
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">{t(isRTL ? "إدارة المشغلين" : "Operator Management")}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t(isRTL ? "إدارة ملفات المشغلين والشهادات" : "Manage operator profiles and certifications")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t(isRTL ? "إضافة مشغل" : "Add Operator")}
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                {t(isRTL ? "تصدير" : "Export")}
              </Button>
            </div>
          </div>

          <Tabs
            value={selectedProject}
            onValueChange={setSelectedProject}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
              <TabsTrigger
                value="Project A"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
              >
                Project A
              </TabsTrigger>
              <TabsTrigger
                value="Project B"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
              >
                Project B
              </TabsTrigger>
              <TabsTrigger
                value="Project C"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
              >
                Project C
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Wrench className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {t(isRTL ? "إجمالي المشغلين" : "Total Operators")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{operatorStats.total}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t(isRTL ? "في المشروع الحالي" : "in current project")}
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
                      {t(isRTL ? "المشغلون النشطون" : "Active Operators")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{operatorStats.active}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {Math.round((operatorStats.active / operatorStats.total) * 100)}% {t(isRTL ? "نشط" : "active")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {t(isRTL ? "المشغلون غير النشطين" : "Inactive Operators")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{operatorStats.inactive}</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      {Math.round((operatorStats.inactive / operatorStats.total) * 100)}% {t(isRTL ? "غير نشط" : "inactive")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileCheck className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {t(isRTL ? "الوثائق المحملة" : "Documents Uploaded")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Object.values(documentCounts).reduce((a, b) => a + b, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t(isRTL ? "عبر جميع المشغلين" : "across all operators")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sm text-gray-600">
                    {t(isRTL ? "توزيع نوع المشغل" : "Operator Type Distribution")}
                  </h3>
                </div>
                <div className="space-y-2">
                  {Object.entries(operatorStats.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${(count / operatorStats.total) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sm text-gray-600">
                    {t(isRTL ? "حالة الوثائق" : "Document Status")}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t(isRTL ? "وثائق كاملة" : "Complete Documentation")}
                      </p>
                      <p className="text-2xl font-bold">
                        {operators.filter(op => documentCounts[op.id] >= 4).length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t(isRTL ? "وثائق ناقصة" : "Pending Documentation")}
                      </p>
                      <p className="text-2xl font-bold">
                        {operators.filter(op => documentCounts[op.id] < 4).length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="rounded-full bg-primary/10 p-3 shrink-0">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div className="w-full">
                  <h3 className="font-semibold text-lg mb-1">
                    {t(isRTL ? "نظرة عامة على المشغلين" : "Quick Tips")}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t(isRTL ? "نصائح سريعة لإدارة المشغلين بفعالية" : "Quick tips to manage operators effectively")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-medium text-sm">1</span>
                      </div>
                      <p className="text-sm">
                        {t(isRTL ? "قم بتحديث بيانات المشغلين بانتظام" : "Regularly update operator data")}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-medium text-sm">2</span>
                      </div>
                      <p className="text-sm">
                        {t(isRTL ? "تأكد من توثيق جميع الشهادات" : "Ensure all certificates are documented")}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-medium text-sm">3</span>
                      </div>
                      <p className="text-sm">
                        {t(isRTL ? "راقب تواريخ انتهاء الشهادات" : "Monitor certificate expiry dates")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <CardHeader className="bg-muted/40 pb-3">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="list">
                    <UserCheck className="w-4 h-4 mr-2" />
                    {t(isRTL ? "قائمة المشغلين" : "Operator List")}
                  </TabsTrigger>
                  <TabsTrigger value="documents">
                    <FileCheck className="w-4 h-4 mr-2" />
                    {t(isRTL ? "الوثائق" : "Documents")}
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="list" className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t(isRTL ? "البحث عن المشغلين..." : "Search operators...")}
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {filteredOperators.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">{t(isRTL ? "لم يتم العثور على مشغلين. أضف مشغلًا للبدء." : "No operators found. Add an operator to get started.")}</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredOperators.map((op) => (
                        <Card key={op.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex items-center justify-between p-4">
                              <div className="flex items-center space-x-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={op.photo} alt={op.name} />
                                  <AvatarFallback>
                                    {op.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">{op.name}</h3>
                                  <p className="text-sm text-muted-foreground">{op.email}</p>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {op.nationality}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {op.operatorType}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {op.project}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right mr-4">
                                  <span className="text-sm text-muted-foreground">{t(isRTL ? "الوثائق" : "Documents")}</span>
                                  <p className="font-medium">{documentCounts[op.id] || 0}</p>
                                </div>
                                <Button
                                  onClick={() => handleSelectOperator(op)}
                                  variant="outline"
                                >
                                  {t(isRTL ? "إدارة الوثائق" : "Manage Documents")}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  {selectedOperator ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={selectedOperator.photo} alt={selectedOperator.name} />
                            <AvatarFallback>
                              {selectedOperator.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-xl font-medium">{selectedOperator.name}</h2>
                            <p className="text-sm text-muted-foreground">{selectedOperator.email}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{selectedOperator.nationality}</Badge>
                              <Badge variant="secondary">{selectedOperator.operatorType}</Badge>
                              <Badge variant="outline">{selectedOperator.project}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsShareModalOpen(true)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            {t(isRTL ? "مشاركة" : "Share")}
                          </Button>
                          <Button variant="outline" onClick={() => setActiveTab("list")}>
                            {t(isRTL ? "العودة إلى القائمة" : "Back to List")}
                          </Button>
                        </div>
                      </div>
                      <OperatorTab operator={selectedOperator} onSave={handleSave} />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-1">{t(isRTL ? "لم يتم اختيار مشغل" : "No Operator Selected")}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t(isRTL ? "حدد مشغلًا من القائمة لعرض أو إدارة وثائقه." : "Select an operator from the list to view or manage their documents.")}
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab("list")}>
                        {t(isRTL ? "الذهاب إلى قائمة المشغلين" : "Go to Operator List")}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t(isRTL ? "إضافة مشغل جديد" : "Add New Operator")}</DialogTitle>
                <DialogDescription>
                  {t(isRTL ? "أدخل بيانات المشغل وقم بتحميل الوثائق المطلوبة." : "Enter the operator's bio data and upload required documents.")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t(isRTL ? "المعلومات الأساسية" : "Basic Information")}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="operator-name">{t(isRTL ? "اسم المشغل" : "Operator Name")} *</Label>
                      <Input
                        id="operator-name"
                        placeholder={t(isRTL ? "مثال: جون دو" : "e.g., John Doe")}
                        value={newOperator.name}
                        onChange={(e) => setNewOperator((prev) => ({ ...prev, name: e.target.value }))}
                        autoComplete="off"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="operator-email">{t(isRTL ? "البريد الإلكتروني" : "Email Address")} *</Label>
                      <Input
                        id="operator-email"
                        placeholder={t(isRTL ? "مثال: john.doe@example.com" : "e.g., john.doe@example.com")}
                        value={newOperator.email}
                        onChange={(e) => setNewOperator((prev) => ({ ...prev, email: e.target.value }))}
                        type="email"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nationality">{t(isRTL ? "الجنسية" : "Nationality")} *</Label>
                      <Select
                        value={newOperator.nationality}
                        onValueChange={(value) => setNewOperator((prev) => ({ ...prev, nationality: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t(isRTL ? "اختر الجنسية" : "Select nationality")} />
                        </SelectTrigger>
                        <SelectContent>
                          {nationalities.map((nationality) => (
                            <SelectItem key={nationality} value={nationality}>
                              {nationality}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="operator-type">{t(isRTL ? "نوع المشغل" : "Type of Operator")} *</Label>
                      <Select
                        value={newOperator.operatorType}
                        onValueChange={(value) => setNewOperator((prev) => ({ ...prev, operatorType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t(isRTL ? "اختر نوع المشغل" : "Select operator type")} />
                        </SelectTrigger>
                        <SelectContent>
                          {operatorTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project">{t(isRTL ? "المشروع" : "Project")} *</Label>
                    <Select
                      value={newOperator.project}
                      onValueChange={(value) => setNewOperator((prev) => ({ ...prev, project: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t(isRTL ? "اختر المشروع" : "Select project")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Project A">Project A</SelectItem>
                        <SelectItem value="Project B">Project B</SelectItem>
                        <SelectItem value="Project C">Project C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t(isRTL ? "الصورة" : "Photo")}</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="operator-photo">{t(isRTL ? "صورة المشغل" : "Operator Photo")}</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={newOperator.photo} alt="Operator" />
                        <AvatarFallback>
                          <Camera className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("photo-upload").click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {t(isRTL ? "تحميل الصورة" : "Upload Photo")}
                      </Button>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setNewOperator((prev) => ({ ...prev, photo: e.target.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t(isRTL ? "الوثائق" : "Documents")}</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="third-party-cert">{t(isRTL ? "شهادة الطرف الثالث" : "3rd Party Certificate")}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload("thirdPartyCertificate", e.target.files[0])}
                        />
                        {newOperator.thirdPartyCertificate && (
                          <Badge variant="outline" className="text-xs">
                            {newOperator.thirdPartyCertificate.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="driving-license">{t(isRTL ? "رخصة القيادة" : "Driving License")}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload("drivingLicense", e.target.files[0])}
                        />
                        {newOperator.drivingLicense && (
                          <Badge variant="outline" className="text-xs">
                            {newOperator.drivingLicense.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="id-card">{t(isRTL ? "بطاقة الهوية" : "ID Card")}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload("idCard", e.target.files[0])}
                        />
                        {newOperator.idCard && (
                          <Badge variant="outline" className="text-xs">
                            {newOperator.idCard.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="health-fitness-cert">{t(isRTL ? "شهادة اللياقة الصحية" : "Health & Fitness Certificate")}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload("healthFitnessCertificate", e.target.files[0])}
                        />
                        {newOperator.healthFitnessCertificate && (
                          <Badge variant="outline" className="text-xs">
                            {newOperator.healthFitnessCertificate.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="other-docs">{t(isRTL ? "وثائق أخرى" : "Other Documents")}</Label>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setNewOperator((prev) => ({ ...prev, otherDocuments: files }));
                        }}
                      />
                      {newOperator.otherDocuments.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {newOperator.otherDocuments.map((file, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {file.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t(isRTL ? "إلغاء" : "Cancel")}
                </Button>
                <Button onClick={handleAddOperator}>{t(isRTL ? "إضافة المشغل" : "Add Operator")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <ShareOperatorModal
            open={isShareModalOpen}
            onOpenChange={setIsShareModalOpen}
            operator={selectedOperator}
            onShare={handleShare}
            isRTL={isRTL}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OperatorManagement;