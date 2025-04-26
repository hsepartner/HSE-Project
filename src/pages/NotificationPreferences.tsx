import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageCircle, AlertTriangle, Info, Lightbulb, Video } from "lucide-react";
import { NotificationPreference, NotificationType } from "@/types/notification";

// Sample notification preferences data
const INITIAL_PREFERENCES: NotificationPreference[] = [
  {
    type: "maintenance_due",
    channels: { "in-app": true, "email": true, "sms": false, "whatsapp": false },
    enabled: true
  },
  {
    type: "inspection_required",
    channels: { "in-app": true, "email": true, "sms": false, "whatsapp": false },
    enabled: true
  },
  {
    type: "certification_expiry",
    channels: { "in-app": true, "email": true, "sms": true, "whatsapp": false },
    enabled: true
  },
  {
    type: "equipment_status_change",
    channels: { "in-app": true, "email": false, "sms": false, "whatsapp": false },
    enabled: true
  },
  {
    type: "vendor_contract_expiry",
    channels: { "in-app": true, "email": true, "sms": false, "whatsapp": false },
    enabled: true
  },
  {
    type: "document_approval_required",
    channels: { "in-app": true, "email": true, "sms": false, "whatsapp": false },
    enabled: true
  },
  {
    type: "equipment_assignment",
    channels: { "in-app": true, "email": false, "sms": false, "whatsapp": false },
    enabled: true
  },
  {
    type: "system_alert",
    channels: { "in-app": true, "email": true, "sms": true, "whatsapp": false },
    enabled: true
  }
];

// Type name mapping for display
const TYPE_DISPLAY_NAMES: Record<NotificationType, string> = {
  "maintenance_due": "Maintenance Due",
  "inspection_required": "Inspection Required",
  "certification_expiry": "Certification Expiry",
  "equipment_status_change": "Equipment Status Change",
  "vendor_contract_expiry": "Vendor Contract Expiry",
  "document_approval_required": "Document Approval Required",
  "equipment_assignment": "Equipment Assignment",
  "system_alert": "System Alert"
};

// Type descriptions
const TYPE_DESCRIPTIONS: Record<NotificationType, string> = {
  "maintenance_due": "Notifications when equipment maintenance is due or approaching",
  "inspection_required": "Alerts for required equipment inspections and checks",
  "certification_expiry": "Reminders about upcoming certification expirations",
  "equipment_status_change": "Updates when equipment status changes (active, inactive, etc.)",
  "vendor_contract_expiry": "Notifications about vendor contracts that are about to expire",
  "document_approval_required": "Alerts when documents require your approval",
  "equipment_assignment": "Notifications about equipment assignments and transfers",
  "system_alert": "Critical system notifications and alerts"
};

// Type priority/importance
const TYPE_PRIORITY: Record<NotificationType, "high" | "medium" | "low"> = {
  "maintenance_due": "medium",
  "inspection_required": "medium",
  "certification_expiry": "high",
  "equipment_status_change": "low",
  "vendor_contract_expiry": "medium",
  "document_approval_required": "high",
  "equipment_assignment": "low",
  "system_alert": "high"
};

// Group preferences by category
const CATEGORIES = {
  "Equipment": ["maintenance_due", "inspection_required", "equipment_status_change", "equipment_assignment"],
  "Compliance": ["certification_expiry", "vendor_contract_expiry", "document_approval_required"],
  "System": ["system_alert"]
};

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(INITIAL_PREFERENCES);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleToggleEnabled = (type: NotificationType) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.type === type ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const handleToggleChannel = (type: NotificationType, channel: keyof NotificationPreference["channels"]) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.type === type
          ? { ...pref, channels: { ...pref.channels, [channel]: !pref.channels[channel] } }
          : pref
      )
    );
  };

  const handleToggleAll = (category: string, enabled: boolean) => {
    setPreferences(prev =>
      prev.map(pref =>
        CATEGORIES[category as keyof typeof CATEGORIES].includes(pref.type)
          ? { ...pref, enabled }
          : pref
      )
    );
  };

  const handleSavePreferences = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      console.log("Saving notification preferences:", preferences);
      setSaveStatus("saved");
      toast.success("Notification preferences saved successfully");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 800);
  };

  const renderPriorityBadge = (priority: "high" | "medium" | "low") => {
    const colors = {
      high: "bg-red-100 text-red-800 hover:bg-red-100",
      medium: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      low: "bg-green-100 text-green-800 hover:bg-green-100"
    };
    return (
      <Badge variant="outline" className={`${colors[priority]} border-none`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </Badge>
    );
  };

  const renderChannelIcon = (channel: string) => {
    switch (channel) {
      case "in-app":
        return <Bell size={16} className="text-blue-600" />;
      case "email":
        return <Mail size={16} className="text-blue-600" />;
      case "sms":
        return <MessageCircle size={16} className="text-blue-600" />;
      case "whatsapp":
        return <MessageCircle size={16} className="text-green-600" />;
      default:
        return null;
    }
  };

  const renderCategoryTable = (category: string) => {
    const categoryTypes = CATEGORIES[category as keyof typeof CATEGORIES];
    const categoryPrefs = preferences.filter(pref => categoryTypes.includes(pref.type));
    const allEnabled = categoryPrefs.every(pref => pref.enabled);
    const allDisabled = categoryPrefs.every(pref => !pref.enabled);

    return (
      <Card className="mb-6 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                {category}
              </CardTitle>
              <CardDescription className="mt-1">
                {categoryTypes.length} notification types
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {allEnabled ? "Disable all" : allDisabled ? "Enable all" : "Toggle all"}
                </span>
                <Switch
                  checked={!allDisabled}
                  onCheckedChange={(checked) => handleToggleAll(category, checked)}
                  aria-label={`Toggle all notifications for ${category}`}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Notification Type</TableHead>
                <TableHead className="w-[100px] text-center">Enabled</TableHead>
                <TableHead className="text-center">In-App</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">SMS</TableHead>
                <TableHead className="text-center">WhatsApp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryPrefs.map((pref) => (
                <TableRow key={pref.type} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="font-medium flex items-center gap-2">
                        {TYPE_DISPLAY_NAMES[pref.type]}
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" aria-label={`Preview ${TYPE_DISPLAY_NAMES[pref.type]} notification`}>
                          <Info size={14} className="text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {TYPE_DESCRIPTIONS[pref.type]}
                      </div>
                      <div className="mt-1">
                        {renderPriorityBadge(TYPE_PRIORITY[pref.type])}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={pref.enabled}
                      onCheckedChange={() => handleToggleEnabled(pref.type)}
                      aria-label={`Toggle ${TYPE_DISPLAY_NAMES[pref.type]} notifications`}
                    />
                  </TableCell>
                  {["in-app", "email", "sms", "whatsapp"].map((channel) => (
                    <TableCell key={channel} className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        {renderChannelIcon(channel)}
                        <Switch
                          disabled={!pref.enabled}
                          checked={pref.channels[channel as keyof NotificationPreference["channels"]]}
                          onCheckedChange={() => handleToggleChannel(pref.type, channel as keyof NotificationPreference["channels"])}
                          className="data-[state=checked]:bg-blue-600"
                          aria-label={`Toggle ${channel} for ${TYPE_DISPLAY_NAMES[pref.type]}`}
                        />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notification Preferences</h1>
            <p className="text-muted-foreground mt-2">
              Configure how and when you receive notifications for optimal workflow.
            </p>
          </div>
          <Button
            onClick={handleSavePreferences}
            disabled={saveStatus === "saving"}
            className="min-w-32 flex items-center gap-2"
          >
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Preferences"}
            {saveStatus === "saved" && <span className="text-green-500">✔</span>}
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
                <h3 className="font-semibold text-lg mb-1">Quick Tips</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimize your notification settings for a better experience.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      Enable high-priority notifications for critical alerts.
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">2</span>
                    </div>
                    <p className="text-sm">
                      Use multiple channels for important notifications.
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">3</span>
                    </div>
                    <p className="text-sm">
                      Disable low-priority notifications to reduce clutter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channel Information */}
        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3 items-start">
              <div className="mt-0.5">
                <Info size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Channel Information</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your notification channels below. In-app notifications are always available, while Email, SMS, and WhatsApp require verification in your{' '}
                  <a href="#" className="underline font-medium text-primary">account settings</a>.
                </p>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex gap-2 items-center">
                    <Bell size={16} className="text-blue-600" />
                    <span className="text-sm font-medium">In-App</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Mail size={16} className="text-blue-600" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <MessageCircle size={16} className="text-blue-600" />
                    <span className="text-sm font-medium">SMS</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <MessageCircle size={16} className="text-green-600" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-muted">
            <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              All Notifications
            </TabsTrigger>
            <TabsTrigger value="equipment" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              Equipment
            </TabsTrigger>
            <TabsTrigger value="compliance" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              Compliance
            </TabsTrigger>
            <TabsTrigger value="system" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {Object.keys(CATEGORIES).map(category => renderCategoryTable(category))}
          </TabsContent>
          <TabsContent value="equipment" className="space-y-6">
            {renderCategoryTable("Equipment")}
          </TabsContent>
          <TabsContent value="compliance" className="space-y-6">
            {renderCategoryTable("Compliance")}
          </TabsContent>
          <TabsContent value="system" className="space-y-6">
            {renderCategoryTable("System")}
          </TabsContent>
        </Tabs>

        {/* Notification Preview Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              Notification Preview
            </CardTitle>
            <CardDescription>
              See how your notifications will appear across different channels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <Bell size={16} className="mr-2 text-blue-600" />
                  In-App Notification
                </h4>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm font-medium">Certification Expiry</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Safety certificate will expire in 15 days.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="secondary" size="sm" className="h-7 text-xs">Update Now</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Dismiss</Button>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <Mail size={16} className="mr-2 text-blue-600" />
                  Email Notification
                </h4>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm font-medium">Subject: Certification Expiry Reminder</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dear User, your safety certificate is set to expire in 15 days. Please update it to maintain compliance.
                  </p>
                  <Button variant="link" className="text-xs p-0 h-auto mt-2">Update Now</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Notifications Warning */}
        <Card className="bg-amber-50/50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex gap-3 items-start">
              <div className="mt-0.5">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Critical Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  System alerts and high-priority notifications may still be delivered even if disabled, as they contain critical information about your account and system security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" className="flex gap-2">
            <Video className="h-4 w-4" />
            Watch Tutorial
          </Button>
          <Button
            onClick={handleSavePreferences}
            disabled={saveStatus === "saving"}
            className="min-w-32 flex items-center gap-2"
          >
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Preferences"}
            {saveStatus === "saved" && <span className="text-green-500">✔</span>}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationPreferences;