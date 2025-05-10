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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, FileText, UserCheck, FileCheck, Search } from "lucide-react";

const OperatorManagement = () => {
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newOperatorName, setNewOperatorName] = useState("");
  const [newOperatorEmail, setNewOperatorEmail] = useState("");
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
        documents: [],
        active: true,
      },
      {
        id: "op2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
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

  const handleAddOperator = () => {
    if (!newOperatorName.trim() || !newOperatorEmail.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields.",
        variant: "destructive",
      });
      return;
    }

    const newOperator = {
      id: `op${Date.now()}`,
      name: newOperatorName,
      email: newOperatorEmail,
      documents: [],
      active: true,
    };

    setOperators([...operators, newOperator]);
    setSelectedOperator(newOperator);
    setNewOperatorName("");
    setNewOperatorEmail("");
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
      op.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectOperator = (operator) => {
    setSelectedOperator(operator);
    setActiveTab("documents");
  };

  const documentCounts = operators.reduce((acc, op) => {
    acc[op.id] = op.documents?.length || 0;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
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

        <Card className="shadow-sm">
          {/* Wrap entire card content in Tabs component */}
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
                              <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center">
                                {op.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-medium">{op.name}</h3>
                                <p className="text-sm text-muted-foreground">{op.email}</p>
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
                      <div>
                        <h2 className="text-xl font-medium">{selectedOperator.name}</h2>
                        <p className="text-sm text-muted-foreground">{selectedOperator.email}</p>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Operator</DialogTitle>
            <DialogDescription>
              Enter the details of the new operator below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="operator-name">Operator Name</Label>
              <Input
                id="operator-name"
                placeholder="e.g., John Doe"
                value={newOperatorName}
                onChange={(e) => setNewOperatorName(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="operator-email">Email Address</Label>
              <Input
                id="operator-email"
                placeholder="e.g., john.doe@example.com"
                value={newOperatorEmail}
                onChange={(e) => setNewOperatorEmail(e.target.value)}
                type="email"
                autoComplete="off"
              />
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