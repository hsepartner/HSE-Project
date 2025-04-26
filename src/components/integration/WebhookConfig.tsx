
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, ArrowRight, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function WebhookConfig() {
  const [webhooks, setWebhooks] = useState([
    {
      id: "hook1",
      name: "Equipment Status Updates",
      url: "https://example.com/webhooks/equipment-status",
      events: ["equipment.created", "equipment.updated", "equipment.deleted"],
      active: true
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  
  const availableEvents = [
    { id: "equipment.created", label: "Equipment Created" },
    { id: "equipment.updated", label: "Equipment Updated" },
    { id: "equipment.deleted", label: "Equipment Deleted" },
    { id: "document.uploaded", label: "Document Uploaded" },
    { id: "document.approved", label: "Document Approved" },
    { id: "document.rejected", label: "Document Rejected" },
    { id: "document.expiring", label: "Document Expiring Soon" },
    { id: "maintenance.scheduled", label: "Maintenance Scheduled" },
    { id: "maintenance.completed", label: "Maintenance Completed" }
  ];
  
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  
  const handleToggleEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };
  
  const handleAddWebhook = () => {
    if (!newWebhookName || !newWebhookUrl || selectedEvents.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields and select at least one event.",
        variant: "destructive"
      });
      return;
    }
    
    const newWebhook = {
      id: `hook${webhooks.length + 1}`,
      name: newWebhookName,
      url: newWebhookUrl,
      events: selectedEvents,
      active: true
    };
    
    setWebhooks([...webhooks, newWebhook]);
    setNewWebhookName("");
    setNewWebhookUrl("");
    setSelectedEvents([]);
    setShowAddForm(false);
    
    toast({
      title: "Webhook Added",
      description: "Your new webhook has been added successfully.",
    });
  };
  
  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(hook => hook.id !== id));
    
    toast({
      title: "Webhook Deleted",
      description: "The webhook has been deleted.",
    });
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Webhook Endpoints</CardTitle>
          <CardDescription>
            Receive real-time notifications for system events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {webhooks.map(webhook => (
            <div 
              key={webhook.id} 
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{webhook.name}</h3>
                  <p className="text-xs text-muted-foreground">{webhook.url}</p>
                </div>
                <Badge variant={webhook.active ? "outline" : "secondary"}>
                  {webhook.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div>
                <p className="text-xs font-medium mb-1">Subscribed Events:</p>
                <div className="flex flex-wrap gap-1">
                  {webhook.events.map(eventId => {
                    const event = availableEvents.find(e => e.id === eventId);
                    return (
                      <Badge key={eventId} variant="secondary" className="text-xs">
                        {event?.label || eventId}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Switch 
                    id={`active-${webhook.id}`}
                    checked={webhook.active}
                    // In a real app, this would toggle the webhook active state
                  />
                  <Label htmlFor={`active-${webhook.id}`} className="ml-2">
                    {webhook.active ? "Active" : "Inactive"}
                  </Label>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8"
                  onClick={() => handleDeleteWebhook(webhook.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          
          {showAddForm ? (
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Add New Webhook</h3>
              
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Webhook Name</Label>
                <Input 
                  id="webhook-name" 
                  placeholder="e.g., Inventory System Updates"
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input 
                  id="webhook-url" 
                  placeholder="https://example.com/webhook"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Events to Subscribe</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-1">
                  {availableEvents.map(event => (
                    <div key={event.id} className="flex items-center justify-between">
                      <Label 
                        htmlFor={`event-${event.id}`} 
                        className="flex items-center cursor-pointer"
                      >
                        {event.label}
                      </Label>
                      <Switch 
                        id={`event-${event.id}`}
                        checked={selectedEvents.includes(event.id)}
                        onCheckedChange={() => handleToggleEvent(event.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWebhook}>
                  Add Webhook
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Webhook
            </Button>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Webhook Testing</CardTitle>
          <CardDescription>
            Send test events to verify your webhook configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-webhook">Select Webhook</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="">Select a webhook...</option>
              {webhooks.map(webhook => (
                <option key={webhook.id} value={webhook.id}>
                  {webhook.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="test-event">Select Event</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="">Select an event...</option>
              {availableEvents.map(event => (
                <option key={event.id} value={event.id}>
                  {event.label}
                </option>
              ))}
            </select>
          </div>
          
          <Button className="w-full mt-2">
            Send Test Event
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
