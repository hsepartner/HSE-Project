
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ApiKeyDisplay } from "@/components/integration/ApiKeyDisplay";
import { WebhookConfig } from "@/components/integration/WebhookConfig";
import { DataSyncSettings } from "@/components/integration/DataSyncSettings";
import { Database, Key, Globe, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function ApiIntegration() {
  const [generateKeyLoading, setGenerateKeyLoading] = useState(false);
  
  const handleGenerateKey = () => {
    setGenerateKeyLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setGenerateKeyLoading(false);
      toast({
        title: "API Key Generated",
        description: "Your new API key has been created successfully.",
      });
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API & Integrations</h1>
        <p className="text-muted-foreground">
          Connect with external systems and manage data exchanges
        </p>
      </div>
      
      <Tabs defaultValue="api-keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="data-sync">Data Sync</TabsTrigger>
          <TabsTrigger value="third-party">Third-Party Apps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key Management
              </CardTitle>
              <CardDescription>
                Generate and manage API keys for external access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">API Key Name</Label>
                <Input id="key-name" placeholder="e.g., Mobile App Integration" />
              </div>
              
              <div className="space-y-2">
                <Label>Access Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="read-equipment" className="flex items-center gap-2 cursor-pointer">
                      Equipment Data (Read)
                    </Label>
                    <Switch id="read-equipment" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="write-equipment" className="flex items-center gap-2 cursor-pointer">
                      Equipment Data (Write)
                    </Label>
                    <Switch id="write-equipment" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="read-documents" className="flex items-center gap-2 cursor-pointer">
                      Document Management (Read)
                    </Label>
                    <Switch id="read-documents" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="write-documents" className="flex items-center gap-2 cursor-pointer">
                      Document Management (Write)
                    </Label>
                    <Switch id="write-documents" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analytics" className="flex items-center gap-2 cursor-pointer">
                      Analytics Access
                    </Label>
                    <Switch id="analytics" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  onClick={handleGenerateKey} 
                  disabled={generateKeyLoading}
                  className="w-full"
                >
                  {generateKeyLoading ? "Generating..." : "Generate API Key"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <ApiKeyDisplay />
        </TabsContent>
        
        <TabsContent value="webhooks" className="space-y-4">
          <WebhookConfig />
        </TabsContent>
        
        <TabsContent value="data-sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Data Synchronization
              </CardTitle>
              <CardDescription>
                Configure automatic data synchronization with external systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataSyncSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="third-party" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Third-Party Applications
              </CardTitle>
              <CardDescription>
                Connect with external service providers and applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">ERP Integration</CardTitle>
                    <CardDescription>
                      Connect with your enterprise resource planning system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2">
                      <Label htmlFor="erp-url">ERP API Endpoint</Label>
                      <Input id="erp-url" placeholder="https://erp.example.com/api" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Configure</Button>
                  </CardFooter>
                </Card>
                
                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">CRM Integration</CardTitle>
                    <CardDescription>
                      Connect with your customer relationship management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2">
                      <Label htmlFor="crm-url">CRM API Endpoint</Label>
                      <Input id="crm-url" placeholder="https://crm.example.com/api" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Configure</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
