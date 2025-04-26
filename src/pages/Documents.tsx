import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  FileCheck,
  FileClock,
  Search,
  Filter,
  Download,
  X,
  File,
  Info,
  Lightbulb,
  Video
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Documents = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Mock data for documents
  const documents = [
    { id: 1, name: "Crane Certification 2025", category: "Equipment Certifications", status: "valid", lastUpdated: "2025-04-20", size: "2.4 MB" },
    { id: 2, name: "Monthly Maintenance Report - April", category: "Maintenance Reports", status: "valid", lastUpdated: "2025-04-15", size: "4.1 MB" },
    { id: 3, name: "Safety Inspection Checklist", category: "Checklists", status: "expiring", lastUpdated: "2025-03-28", size: "1.2 MB" },
    { id: 4, name: "Vendor Contract - ABC Equipment", category: "Vendor Documents", status: "expired", lastUpdated: "2024-12-10", size: "3.8 MB" },
    { id: 5, name: "Generator Certification", category: "Equipment Certifications", status: "valid", lastUpdated: "2025-04-01", size: "2.9 MB" },
    { id: 6, name: "Weekly Safety Report", category: "Checklists", status: "valid", lastUpdated: "2025-04-22", size: "0.8 MB" },
  ];

  const handleUpload = (e) => {
    e.preventDefault();
    setUploadModalOpen(false);
  };

  const handleDocumentClick = (document) => {
    setSelectedDocument(document);
    setViewModalOpen(true);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "valid": return "bg-green-100 text-green-800";
      case "expiring": return "bg-amber-100 text-amber-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "";
    }
  };

  const categories = [
    "Equipment Certifications",
    "Maintenance Reports",
    "Checklists",
    "Vendor Documents"
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? "المستندات" : "Documents"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL 
                ? "إدارة وتنظيم جميع المستندات الخاصة بك بسهولة" 
                : "Easily manage and organize all your documents"}
            </p>
          </div>
          <Button 
            onClick={() => setUploadModalOpen(true)} 
            className="shrink-0 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isRTL ? "رفع مستند" : "Upload Document"}
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
                    ? "تعرف على كيفية إدارة مستنداتك بفعالية" 
                    : "Learn how to manage your documents effectively"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      {isRTL 
                        ? "استخدم الفئات لتنظيم مستنداتك" 
                        : "Use categories to organize your documents"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">2</span>
                    </div>
                    <p className="text-sm">
                      {isRTL 
                        ? "تحقق من حالة المستندات بانتظام" 
                        : "Check document status regularly"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">3</span>
                    </div>
                    <p className="text-sm">
                      {isRTL 
                        ? "قم بتحميل المستندات بصيغة PDF للتوافق" 
                        : "Upload documents in PDF for compatibility"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Document Categories */}
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {isRTL ? "فئات المستندات" : "Document Categories"}
              </CardTitle>
              <CardDescription>
                {isRTL ? "تصفح المستندات حسب الفئة" : "Browse documents by category"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map(category => (
                  <div
                    key={category}
                    className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span>
                      {isRTL ? (
                        category === "Equipment Certifications" ? "شهادات المعدات" :
                        category === "Maintenance Reports" ? "تقارير الصيانة" :
                        category === "Checklists" ? "قوائم التحقق" : "وثائق البائع"
                      ) : category}
                    </span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {category === "Equipment Certifications" ? 38 :
                       category === "Maintenance Reports" ? 56 :
                       category === "Checklists" ? 124 : 18}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Status */}
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                {isRTL ? "حالة المستند" : "Document Status"}
              </CardTitle>
              <CardDescription>
                {isRTL ? "نظرة عامة على حالة المستندات" : "Overview of document status"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <span>{isRTL ? "صالح" : "Valid"}</span>
                  </div>
                  <span className="font-semibold text-green-600">187</span>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>{isRTL ? "تنتهي قريبا" : "Expiring Soon"}</span>
                  </div>
                  <span className="font-semibold text-amber-500">24</span>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span>{isRTL ? "منتهي" : "Expired"}</span>
                  </div>
                  <span className="font-semibold text-red-600">12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileClock className="h-5 w-5 text-primary" />
                {isRTL ? "النشاط الأخير" : "Recent Activity"}
              </CardTitle>
              <CardDescription>
                {isRTL ? "آخر الأنشطة على المستندات" : "Latest document activities"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-md transition-colors">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-blue-600" />
                    <span>{isRTL ? "عمليات التحميل اليوم" : "Uploads Today"}</span>
                  </div>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-md transition-colors">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-green-600" />
                    <span>{isRTL ? "التنزيلات اليوم" : "Downloads Today"}</span>
                  </div>
                  <span className="font-semibold">15</span>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-md transition-colors">
                  <div className="flex items-center gap-2">
                    <FileClock className="h-4 w-4 text-purple-600" />
                    <span>{isRTL ? "آخر تحديث" : "Last Update"}</span>
                  </div>
                  <span className="font-semibold">10 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document List Section */}
        <Card className="mt-8 border-primary/20">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {isRTL ? "قائمة المستندات" : "Document List"}
                </CardTitle>
                <CardDescription>
                  {isRTL ? "عرض وإدارة جميع المستندات الخاصة بك" : "View and manage all your documents"}
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={isRTL ? "بحث المستندات..." : "Search documents..."}
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label={isRTL ? "بحث المستندات" : "Search documents"}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder={isRTL ? "جميع الفئات" : "All categories"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? "جميع الفئات" : "All categories"}</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {isRTL ? (
                          category === "Equipment Certifications" ? "شهادات المعدات" :
                          category === "Maintenance Reports" ? "تقارير الصيانة" :
                          category === "Checklists" ? "قوائم التحقق" : "وثائق البائع"
                        ) : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isRTL ? "اسم المستند" : "Document Name"}</TableHead>
                    <TableHead>{isRTL ? "الفئة" : "Category"}</TableHead>
                    <TableHead>{isRTL ? "الحالة" : "Status"}</TableHead>
                    <TableHead>{isRTL ? "آخر تحديث" : "Last Updated"}</TableHead>
                    <TableHead>{isRTL ? "الحجم" : "Size"}</TableHead>
                    <TableHead>{isRTL ? "إجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map(document => (
                      <TableRow
                        key={document.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium" onClick={() => handleDocumentClick(document)}>
                          {document.name}
                        </TableCell>
                        <TableCell>
                          {isRTL ? (
                            document.category === "Equipment Certifications" ? "شهادات المعدات" :
                            document.category === "Maintenance Reports" ? "تقارير الصيانة" :
                            document.category === "Checklists" ? "قوائم التحقق" : "وثائق البائع"
                          ) : document.category}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(document.status)}>
                            {isRTL ? (
                              document.status === "valid" ? "صالح" :
                              document.status === "expiring" ? "ينتهي قريبا" : "منتهي"
                            ) : (
                              document.status === "valid" ? "Valid" :
                              document.status === "expiring" ? "Expiring Soon" : "Expired"
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>{document.lastUpdated}</TableCell>
                        <TableCell>{document.size}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDocumentClick(document)}
                            aria-label={isRTL ? `عرض ${document.name}` : `View ${document.name}`}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={isRTL ? `تنزيل ${document.name}` : `Download ${document.name}`}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        {isRTL ? "لم يتم العثور على مستندات" : "No documents found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Document Preview Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              {isRTL ? "معاينة المستندات" : "Document Preview"}
            </CardTitle>
            <CardDescription>
              {isRTL ? "مثال على كيفية ظهور المستندات" : "Example of how documents appear"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <FileText size={16} className="mr-2 text-blue-600" />
                  {isRTL ? "شهادة المعدات" : "Equipment Certification"}
                </h4>
                <div className="bg-blue-50 p-3 rounded-md flex items-center justify-center h-32">
                  <FileText className="h-12 w-12 text-blue-400" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isRTL ? "ملف PDF يحتوي على تفاصيل شهادة المعدات" : "PDF file containing equipment certification details"}
                </p>
              </div>
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <FileText size={16} className="mr-2 text-blue-600" />
                  {isRTL ? "تقرير صيانة" : "Maintenance Report"}
                </h4>
                <div className="bg-blue-50 p-3 rounded-md flex items-center justify-center h-32">
                  <FileText className="h-12 w-12 text-blue-400" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isRTL ? "ملف DOCX يحتوي على تقرير الصيانة الشهري" : "DOCX file containing monthly maintenance report"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Modal */}
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isRTL ? "رفع مستند جديد" : "Upload New Document"}</DialogTitle>
              <DialogDescription>
                {isRTL ? "اختر ملفًا وأدخل المعلومات المطلوبة لرفع مستند." : "Select a file and enter the required information to upload a document."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="document">{isRTL ? "المستند" : "Document"}</Label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 text-center">
                        <span className="font-semibold">{isRTL ? "انقر للتحميل" : "Click to upload"}</span> {isRTL ? "أو اسحب وأفلت" : "or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOCX, XLSX (MAX. 10MB)</p>
                    </div>
                    <input id="document" type="file" className="hidden" accept=".pdf,.docx,.xlsx" />
                  </label>
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">{isRTL ? "اسم المستند" : "Document Name"}</Label>
                <Input
                  id="name"
                  placeholder={isRTL ? "أدخل اسم المستند" : "Enter document name"}
                  aria-label={isRTL ? "اسم المستند" : "Document name"}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="category">{isRTL ? "الفئة" : "Category"}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر فئة" : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {isRTL ? (
                          category === "Equipment Certifications" ? "شهادات المعدات" :
                          category === "Maintenance Reports" ? "تقارير الصيانة" :
                          category === "Checklists" ? "قوائم التحقق" : "وثائق البائع"
                        ) : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                        ? "تأكد من إدخال اسم واضح للمستند لسهولة البحث لاحقًا." 
                        : "Ensure you enter a clear document name for easy searching later."}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    {isRTL ? "إلغاء" : "Cancel"}
                  </Button>
                </DialogClose>
                <Button type="submit">{isRTL ? "رفع" : "Upload"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Document Modal */}
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          {selectedDocument && (
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <File className="h-5 w-5 text-primary" />
                  {selectedDocument.name}
                </DialogTitle>
                <DialogDescription>
                  {isRTL ? "عرض تفاصيل المستند وتنزيله" : "View document details and download"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-50 border rounded-lg p-4 flex flex-col items-center justify-center h-64">
                  <FileText className="h-16 w-16 text-blue-400 mb-4" />
                  <p className="text-blue-600 font-medium">{isRTL ? "معاينة المستند" : "Document Preview"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? "انقر لتنزيل المستند للعرض الكامل" : "Click to download for full view"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{isRTL ? "الفئة" : "Category"}</p>
                    <p>
                      {isRTL ? (
                        selectedDocument.category === "Equipment Certifications" ? "شهادات المعدات" :
                        selectedDocument.category === "Maintenance Reports" ? "تقارير الصيانة" :
                        selectedDocument.category === "Checklists" ? "قوائم التحقق" : "وثائق البائع"
                      ) : selectedDocument.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{isRTL ? "الحالة" : "Status"}</p>
                    <Badge className={getStatusColor(selectedDocument.status)}>
                      {isRTL ? (
                        selectedDocument.status === "valid" ? "صالح" :
                        selectedDocument.status === "expiring" ? "ينتهي قريبا" : "منتهي"
                      ) : (
                        selectedDocument.status === "valid" ? "Valid" :
                        selectedDocument.status === "expiring" ? "Expiring Soon" : "Expired"
                      )}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{isRTL ? "آخر تحديث" : "Last Updated"}</p>
                    <p>{selectedDocument.lastUpdated}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{isRTL ? "الحجم" : "Size"}</p>
                    <p>{selectedDocument.size}</p>
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
                          ? "قم بتنزيل المستند لمشاركته مع الفريق أو للاحتفاظ بنسخة احتياطية." 
                          : "Download the document to share with your team or keep a backup."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {isRTL ? "تنزيل" : "Download"}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">
                    {isRTL ? "إغلاق" : "Close"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" className="flex gap-2">
            <Video className="h-4 w-4" />
            {isRTL ? "شاهد الفيديو التعليمي" : "Watch Tutorial"}
          </Button>
          <Button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isRTL ? "رفع مستند" : "Upload Document"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documents;