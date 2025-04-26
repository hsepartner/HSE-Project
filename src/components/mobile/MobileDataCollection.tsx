
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCodeScanner } from "@/components/mobile/QrCodeScanner";
import { OfflineStatus } from "@/components/mobile/OfflineStatus";
import { Smartphone, Camera, Save, Upload, Search, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function MobileDataCollection() {
  const [activeTab, setActiveTab] = useState("inspection");
  const [isScanning, setIsScanning] = useState(false);
  const [equipmentId, setEquipmentId] = useState("");

  const handleScanComplete = (result: string) => {
    setIsScanning(false);
    setEquipmentId(result);
    toast({
      title: "QR Code Scanned",
      description: `Equipment ID: ${result}`,
    });
  };

  const handleSaveOffline = () => {
    toast({
      title: "Data Saved Offline",
      description: "Your data has been saved locally and will be uploaded when connection is restored.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Data Submitted",
      description: "Your inspection data has been recorded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mobile Data Collection</h1>
          <p className="text-muted-foreground">
            Record equipment inspections and maintenance in the field
          </p>
        </div>
        <OfflineStatus />
      </div>

      {isScanning ? (
        <Card>
          <CardHeader>
            <CardTitle>Scan Equipment QR Code</CardTitle>
            <CardDescription>Position the QR code within the scanner</CardDescription>
          </CardHeader>
          <CardContent>
            <QrCodeScanner onScanComplete={handleScanComplete} />
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setIsScanning(false)} className="w-full">
              Cancel Scanning
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card className="sm:max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Equipment Lookup
              </CardTitle>
              <CardDescription>
                Scan QR code or enter equipment ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input 
                    placeholder="Enter equipment ID" 
                    value={equipmentId}
                    onChange={(e) => setEquipmentId(e.target.value)}
                  />
                </div>
                <Button variant="outline" onClick={() => setIsScanning(true)}>
                  <Camera className="h-4 w-4" />
                </Button>
                <Button>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {equipmentId && (
                <div className="text-center">
                  <ArrowDown className="h-6 w-6 mx-auto text-muted-foreground my-2" />
                  <p className="text-sm text-muted-foreground">Equipment found. Continue below.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {equipmentId && (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full sm:max-w-2xl mx-auto">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="inspection">Inspection</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inspection">
                <Card>
                  <CardHeader>
                    <CardTitle>Equipment Inspection</CardTitle>
                    <CardDescription>Record inspection findings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="equipment-id">Equipment ID</Label>
                        <Input id="equipment-id" value={equipmentId} readOnly />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inspection-date">Inspection Date</Label>
                        <Input id="inspection-date" type="date" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inspector">Inspector Name</Label>
                        <Input id="inspector" placeholder="Your name" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="condition">Equipment Condition</Label>
                        <Select>
                          <SelectTrigger id="condition">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Inspection Notes</Label>
                        <Textarea id="notes" placeholder="Enter detailed observations..." />
                      </div>
                      
                      <div className="flex space-x-2 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={handleSaveOffline}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Offline
                        </Button>
                        <Button type="submit" className="flex-1">
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Now
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="maintenance">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Record</CardTitle>
                    <CardDescription>Log maintenance activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-equipment-id">Equipment ID</Label>
                        <Input id="maintenance-equipment-id" value={equipmentId} readOnly />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-type">Maintenance Type</Label>
                        <Select>
                          <SelectTrigger id="maintenance-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Routine Service</SelectItem>
                            <SelectItem value="repair">Repair</SelectItem>
                            <SelectItem value="calibration">Calibration</SelectItem>
                            <SelectItem value="overhaul">Overhaul</SelectItem>
                            <SelectItem value="emergency">Emergency Repair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-date">Maintenance Date</Label>
                        <Input id="maintenance-date" type="date" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="technician">Technician Name</Label>
                        <Input id="technician" placeholder="Technician's name" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="parts-replaced">Parts Replaced</Label>
                        <Input id="parts-replaced" placeholder="List any replaced parts" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-notes">Maintenance Notes</Label>
                        <Textarea id="maintenance-notes" placeholder="Enter detailed maintenance information..." />
                      </div>
                      
                      <div className="flex space-x-2 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={handleSaveOffline}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Offline
                        </Button>
                        <Button type="submit" className="flex-1">
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Now
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}
