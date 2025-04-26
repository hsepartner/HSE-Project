
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function ApiKeyDisplay() {
  const [showKey, setShowKey] = useState(false);
  
  // Sample API key data - in a real app, these would come from your backend
  const apiKeys = [
    {
      id: "key1",
      name: "Mobile App Integration",
      key: "sk_api_j48fhsi3hrue9432hjdsf9843hjsdf",
      created: "2025-04-10T14:32:00Z",
      lastUsed: "2025-04-20T09:15:22Z"
    },
    {
      id: "key2",
      name: "Warehouse System",
      key: "sk_api_l39fjei2932jjdsfh932jkdff902j",
      created: "2025-03-18T11:20:00Z",
      lastUsed: "2025-04-19T16:45:11Z"
    }
  ];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "API Key Copied",
      description: "API key has been copied to clipboard.",
    });
  };
  
  const handleDeleteKey = (id: string) => {
    toast({
      title: "API Key Deleted",
      description: "The API key has been deleted.",
    });
    // In a real app, this would delete the key from the backend
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your API Keys</CardTitle>
        <CardDescription>
          Active API keys that can access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div 
            key={apiKey.id} 
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{apiKey.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Created: {formatDate(apiKey.created)}
                </p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input 
                value={showKey ? apiKey.key : apiKey.key.replace(/./g, "•")}
                readOnly
                className="font-mono text-sm"
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleCopyKey(apiKey.key)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Last used: {formatDate(apiKey.lastUsed)}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8"
                onClick={() => handleDeleteKey(apiKey.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
