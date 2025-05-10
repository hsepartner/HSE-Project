import { useState, useEffect } from "react";
import { Operator, OperatorDocument, OperatorDocumentType, DocumentStatus } from "@/types/operator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addYears } from "date-fns";
import { 
  CalendarIcon, 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Trash2, 
  Calendar as CalendarIcon2, 
  Clock, 
  HelpCircle, 
  FileCheck 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import * as React from "react";

const documentTypeOptions = [
  { value: OperatorDocumentType.OPERATOR_CV, label: "CV/Resume" },
  { value: OperatorDocumentType.LICENSE, label: "License" },
  { value: OperatorDocumentType.CERTIFICATION, label: "Certification" },
  { value: OperatorDocumentType.TRAINING, label: "Training Certificate" },
  { value: OperatorDocumentType.MEDICAL, label: "Medical Certificate" },
  { value: OperatorDocumentType.PASSPORT, label: "Passport/ID" },
];

// Wrap AlertDialog components with forwardRef
const ForwardedAlertDialog = React.forwardRef((props, ref) => (
  <AlertDialog {...props} ref={ref} />
));
ForwardedAlertDialog.displayName = "ForwardedAlertDialog";

const ForwardedAlertDialogContent = React.forwardRef((props, ref) => (
  <AlertDialogContent {...props} ref={ref} />
));
ForwardedAlertDialogContent.displayName = "ForwardedAlertDialogContent";

const ForwardedAlertDialogHeader = React.forwardRef((props, ref) => (
  <AlertDialogHeader {...props} ref={ref} />
));
ForwardedAlertDialogHeader.displayName = "ForwardedAlertDialogHeader";

const ForwardedAlertDialogFooter = React.forwardRef((props, ref) => (
  <AlertDialogFooter {...props} ref={ref} />
));
ForwardedAlertDialogFooter.displayName = "ForwardedAlertDialogFooter";

const ForwardedAlertDialogTitle = React.forwardRef((props, ref) => (
  <AlertDialogTitle {...props} ref={ref} />
));
ForwardedAlertDialogTitle.displayName = "ForwardedAlertDialogTitle";

const ForwardedAlertDialogDescription = React.forwardRef((props, ref) => (
  <AlertDialogDescription {...props} ref={ref} />
));
ForwardedAlertDialogDescription.displayName = "ForwardedAlertDialogDescription";

const ForwardedAlertDialogAction = React.forwardRef((props, ref) => (
  <AlertDialogAction {...props} ref={ref} />
));
ForwardedAlertDialogAction.displayName = "ForwardedAlertDialogAction";

const ForwardedAlertDialogCancel = React.forwardRef((props, ref) => (
  <AlertDialogCancel {...props} ref={ref} />
));
ForwardedAlertDialogCancel.displayName = "ForwardedAlertDialogCancel";

export const OperatorTab = ({ operator, onSave }) => {
  const [documents, setDocuments] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [expiryDate, setExpiryDate] = useState(addYears(new Date(), 1));
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    if (operator?.documents) {
      setDocuments(operator.documents);
    }
  }, [operator]);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleUpload = () => {
    if (!uploadFile || !documentType) {
      toast({
        title: "Validation Error",
        description: "Please select both a file and document type.",
        variant: "destructive",
      });
      return;
    }

    // For document types that require expiry dates
    if (documentType !== OperatorDocumentType.OPERATOR_CV && !expiryDate) {
      toast({
        title: "Validation Error",
        description: "Please select an expiry date for this document type.",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload
    simulateUpload();

    // Create new document object
    setTimeout(() => {
      const newDocument = {
        id: `doc-${Date.now()}`,
        type: documentType,
        fileName: documentName || uploadFile.name,
        fileUrl: URL.createObjectURL(uploadFile),
        uploadDate: new Date().toISOString(),
        expiryDate: documentType !== OperatorDocumentType.OPERATOR_CV 
          ? expiryDate?.toISOString() 
          : null,
        status: DocumentStatus.PENDING,
      };

      // Update local state and parent component
      const updatedDocuments = [...documents, newDocument];
      setDocuments(updatedDocuments);
      
      // Reset form
      setUploadFile(null);
      setDocumentType("");
      setDocumentName("");
      setExpiryDate(addYears(new Date(), 1));
      
      // Save to parent
      if (operator) {
        onSave({ ...operator, documents: updatedDocuments });
      }

      toast({
        title: "Document Uploaded",
        description: "The document has been uploaded successfully and is pending validation.",
      });
    }, 3000);
  };

  const confirmDeleteDocument = (document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDocument = () => {
    if (!documentToDelete) return;
    
    const updatedDocuments = documents.filter(doc => doc.id !== documentToDelete.id);
    setDocuments(updatedDocuments);
    
    if (operator) {
      onSave({ ...operator, documents: updatedDocuments });
    }
    
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
    
    toast({
      title: "Document Deleted",
      description: "The document has been removed successfully.",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case DocumentStatus.VALIDATED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Validated
          </Badge>
        );
      case DocumentStatus.REJECTED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case DocumentStatus.EXPIRED:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Expired
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const filteredDocuments = activeCategory === "all" 
    ? documents 
    : documents.filter(doc => doc.type === activeCategory);

  const documentsByType = documents.reduce((acc, doc) => {
    acc[doc.type] = (acc[doc.type] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.values(OperatorDocumentType).filter(type => 
    documents.some(doc => doc.type === type)
  );

  const remainingDocTypes = documentTypeOptions.filter(
    option => !documents.some(doc => doc.type === option.value)
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Upload New Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {remainingDocTypes.length === 0 ? (
                      <SelectItem value="none" disabled>
                        All document types already uploaded
                      </SelectItem>
                    ) : (
                      remainingDocTypes.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document-name">Document Name (Optional)</Label>
                <Input
                  id="document-name"
                  placeholder="e.g., Heavy Machinery License"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>
              
              {documentType && documentType !== OperatorDocumentType.OPERATOR_CV && (
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiryDate ? format(expiryDate, "PPP") : "Select expiry date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={expiryDate}
                        onSelect={setExpiryDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload File</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  {!uploadFile ? (
                    <>
                      <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Drag & drop files or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Accepted formats: PDF, JPG, PNG (max 10MB)
                        </p>
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        className="mt-4 mx-auto max-w-xs"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadFile(file);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <FileCheck className="mx-auto h-10 w-10 text-primary mb-4" />
                      <p className="font-medium mb-1">{uploadFile.name}</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadFile(null)}
                      >
                        Remove file
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <Button 
                className="w-full mt-2" 
                onClick={handleUpload}
                disabled={!uploadFile || !documentType || isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Document Library
          </h2>
        </div>

        {documents.length > 0 ? (
          <>
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between">
                <TabsList className="mb-4">
                  <TabsTrigger 
                    value="all" 
                    onClick={() => setActiveCategory("all")}
                    className="flex items-center"
                  >
                    All ({documents.length})
                  </TabsTrigger>
                  
                  {categories.map(category => (
                    <TabsTrigger 
                      key={category}
                      value={category}
                      onClick={() => setActiveCategory(category)}
                      className="flex items-center"
                    >
                      {category.replace(/_/g, " ")} ({documentsByType[category] || 0})
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredDocuments.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">No documents found in this category.</p>
                      </div>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <div key={doc.id} className="p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-primary/10 rounded-md p-2 text-primary">
                                <FileText className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="font-medium">{doc.fileName}</h3>
                                <div className="flex items-center space-x-4 mt-1">
                                  <p className="text-xs text-muted-foreground">
                                    {doc.type.replace(/_/g, " ")}
                                  </p>
                                  <Separator orientation="vertical" className="h-3" />
                                  <p className="text-xs text-muted-foreground">
                                    Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                                  </p>
                                  {doc.expiryDate && (
                                    <>
                                      <Separator orientation="vertical" className="h-3" />
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                              <CalendarIcon2 className="h-3 w-3 mr-1" />
                                              Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Document expiry date</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(doc.status)}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(doc.fileUrl, "_blank")}
                              >
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                onClick={() => confirmDeleteDocument(doc)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </Tabs>
          </>
        ) : (
          <Card className="p-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Documents Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Upload your first document using the form above to start building your document library.
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="inline-flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      What documents do I need?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Required documents typically include certifications, licenses, 
                    resume, and identification documents. Check with your manager for specific requirements.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ForwardedAlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <ForwardedAlertDialogContent>
          <ForwardedAlertDialogHeader>
            <ForwardedAlertDialogTitle>Are you sure?</ForwardedAlertDialogTitle>
            <ForwardedAlertDialogDescription>
              This will permanently delete the document "{documentToDelete?.fileName}". 
              This action cannot be undone.
            </ForwardedAlertDialogDescription>
          </ForwardedAlertDialogHeader>
          <ForwardedAlertDialogFooter>
            <ForwardedAlertDialogCancel>Cancel</ForwardedAlertDialogCancel>
            <ForwardedAlertDialogAction 
              onClick={handleDeleteDocument}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </ForwardedAlertDialogAction>
          </ForwardedAlertDialogFooter>
        </ForwardedAlertDialogContent>
      </ForwardedAlertDialog>
    </div>
  );
};