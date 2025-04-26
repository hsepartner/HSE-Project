
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function DataSyncSettings() {
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState("60");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>("2024-04-22 09:15:32");
  const { toast } = useToast();

  const testConnection = () => {
    setIsTestingConnection(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsTestingConnection(false);
      toast({
        title: "Connection successful",
        description: "The data source is available and configured correctly."
      });
    }, 1500);
  };

  const syncNow = () => {
    setIsTestingConnection(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsTestingConnection(false);
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setLastSyncTime(now);
      toast({
        title: "Data synchronized",
        description: "All data has been synchronized successfully."
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Synchronization</CardTitle>
        <CardDescription>
          Configure how equipment data is synchronized with external systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-medium">Automatic Synchronization</h4>
            <p className="text-sm text-muted-foreground">
              Enable automatic synchronization with external systems
            </p>
          </div>
          <Switch
            checked={autoSync}
            onCheckedChange={setAutoSync}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
          <Input
            id="sync-interval"
            value={syncInterval}
            onChange={(e) => setSyncInterval(e.target.value)}
            type="number"
            min="1"
            disabled={!autoSync}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Last Synchronized</Label>
          <p className="text-sm">
            {lastSyncTime ? lastSyncTime : "Never"}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Connection Status</Label>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-status-valid"></div>
            <p className="text-sm">Connected</p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button onClick={testConnection} disabled={isTestingConnection} variant="outline">
            {isTestingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
          <Button onClick={syncNow} disabled={isTestingConnection}>
            {isTestingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              "Sync Now"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
