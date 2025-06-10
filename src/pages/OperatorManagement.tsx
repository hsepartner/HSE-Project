import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OperatorTab } from "@/components/OperatorTab";
import { Operator } from "@/types/operator";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, UserCheck, FileCheck, Search, Upload, User, FileImage, Camera } from "lucide-react";
import { OperatorsStatusChart } from "@/components/analytics/OperatorsStatusChart";

const OperatorManagement = () => {
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
    otherDocuments: []
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const { toast } = useToast();
  const { t } = useLanguage();

  // Mock initial data for demo purposes
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
      }
    ];
    setOperators(mockOperators);
  }, []);

  const handleSave = (updatedOperator) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === updatedOperator.id ? updatedOperator : op))
    );
    
    toast({
      title: "Success",
      description: "Operator information has been updated successfully.",
    });
  };

  const handleFileUpload = (field, file) => {
    setNewOperator(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleAddOperator = () => {
    if (!newOperator.name.trim() || !newOperator.email.trim() || !newOperator.nationality || !newOperator.operatorType) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields (Name, Email, Nationality, Operator Type).",
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
      otherDocuments: []
    });
    setIsAddDialogOpen(false);
    setActiveTab("documents");

    toast({
      title: "Operator Added",
      description: "New operator has been added successfully.",
    });
  };

  const filteredOperators = operators.filter(
    (op) =>
      op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.operatorType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectOperator = (operator) => {
    setSelectedOperator(operator);
    setActiveTab("documents");
  };

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

  const operatorTypes = [
    "Heavy Equipment",
    "Crane Operator",
    "Forklift Operator",
    "Excavator Operator",
    "Bulldozer Operator",
    "Loader Operator",
    "Other"
  ];

  const nationalities = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Japan", "South Korea", "Singapore", "India", "China", "Other"
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold">{t("Operator Management")}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage operator profiles and certifications
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Operator
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OperatorsStatusChart operators={operators} />
              </div>
            </div>

        <Card className="shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader className="bg-muted/40 pb-3">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="list">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Operator List
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Documents
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="list" className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search operators..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {filteredOperators.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No operators found. Add an operator to get started.</p>
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
                                  {op.name.split(' ').map(n => n[0]).join('').toUpperCase()}
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
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right mr-4">
                                <span className="text-sm text-muted-foreground">Documents</span>
                                <p className="font-medium">{documentCounts[op.id] || 0}</p>
                              </div>
                              <Button 
                                onClick={() => handleSelectOperator(op)}
                                variant="outline"
                              >
                                Manage Documents
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
                            {selectedOperator.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-xl font-medium">{selectedOperator.name}</h2>
                          <p className="text-sm text-muted-foreground">{selectedOperator.email}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">
                              {selectedOperator.nationality}
                            </Badge>
                            <Badge variant="secondary">
                              {selectedOperator.operatorType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setActiveTab("list")}>
                        Back to List
                      </Button>
                    </div>
                    
                    <OperatorTab
                      operator={selectedOperator}
                      onSave={handleSave}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Operator Selected</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select an operator from the list to view or manage their documents.
                    </p>
                    <Button variant="outline" onClick={() => setActiveTab("list")}>
                      Go to Operator List
                    </Button>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Add Operator Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Operator</DialogTitle>
            <DialogDescription>
              Enter the operator's bio data and upload required documents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="operator-name">Operator Name *</Label>
                  <Input
                    id="operator-name"
                    placeholder="e.g., John Doe"
                    value={newOperator.name}
                    onChange={(e) => setNewOperator(prev => ({ ...prev, name: e.target.value }))}
                    autoComplete="off"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="operator-email">Email Address *</Label>
                  <Input
                    id="operator-email"
                    placeholder="e.g., john.doe@example.com"
                    value={newOperator.email}
                    onChange={(e) => setNewOperator(prev => ({ ...prev, email: e.target.value }))}
                    type="email"
                    autoComplete="off"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Select value={newOperator.nationality} onValueChange={(value) => setNewOperator(prev => ({ ...prev, nationality: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
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
                  <Label htmlFor="operator-type">Type of Operator *</Label>
                  <Select value={newOperator.operatorType} onValueChange={(value) => setNewOperator(prev => ({ ...prev, operatorType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator type" />
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
            </div>

            {/* Photo Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Photo</h3>
              <div className="grid gap-2">
                <Label htmlFor="operator-photo">Operator Photo</Label>
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
                    onClick={() => document.getElementById('photo-upload').click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
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
                          setNewOperator(prev => ({ ...prev, photo: e.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Documents</h3>
              <div className="grid gap-4">
                {/* 3rd Party Certificate */}
                <div className="grid gap-2">
                  <Label htmlFor="third-party-cert">3rd Party Certificate</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('thirdPartyCertificate', e.target.files[0])}
                    />
                    {newOperator.thirdPartyCertificate && (
                      <Badge variant="outline" className="text-xs">
                        {newOperator.thirdPartyCertificate.name}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Driving License */}
                <div className="grid gap-2">
                  <Label htmlFor="driving-license">Driving License</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('drivingLicense', e.target.files[0])}
                    />
                    {newOperator.drivingLicense && (
                      <Badge variant="outline" className="text-xs">
                        {newOperator.drivingLicense.name}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* ID Card */}
                <div className="grid gap-2">
                  <Label htmlFor="id-card">ID Card</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('idCard', e.target.files[0])}
                    />
                    {newOperator.idCard && (
                      <Badge variant="outline" className="text-xs">
                        {newOperator.idCard.name}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Health Fitness Certificate */}
                <div className="grid gap-2">
                  <Label htmlFor="health-fitness-cert">Health & Fitness Certificate</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('healthFitnessCertificate', e.target.files[0])}
                    />
                    {newOperator.healthFitnessCertificate && (
                      <Badge variant="outline" className="text-xs">
                        {newOperator.healthFitnessCertificate.name}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Other Documents */}
                <div className="grid gap-2">
                  <Label htmlFor="other-docs">Other Documents</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setNewOperator(prev => ({ ...prev, otherDocuments: files }));
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
              Cancel
            </Button>
            <Button onClick={handleAddOperator}>Add Operator</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default OperatorManagement;