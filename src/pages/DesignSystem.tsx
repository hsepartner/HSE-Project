
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/status/StatusBadge";
import { StatusPill } from "@/components/status/StatusPill";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { StatusTimeline } from "@/components/status/StatusTimeline";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert, Clock, FileCheck, Truck, Wrench, Shield, Users } from "lucide-react";
import { RoleBadge } from "@/components/auth/RoleBadge";
import { UserCard } from "@/components/auth/UserCard";
import { ROLE_CONFIG } from "@/types/auth";

const DesignSystem = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Design System</h2>
          <ThemeToggle />
        </div>

        <Tabs defaultValue="colors">
          <TabsList>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="usage">Usage Guidelines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Color System</CardTitle>
                <CardDescription>
                  Core status colors used throughout the application to indicate different states
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Expired */}
                  <div className="space-y-2">
                    <div className="h-24 bg-status-expired rounded-md flex items-end">
                      <div className="w-full p-2 text-xs bg-black/20 text-white font-mono rounded-b-md">
                        #FF3B30
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Expired/Critical</h3>
                      <p className="text-xs text-muted-foreground">0 days or past expiry</p>
                    </div>
                  </div>
                  
                  {/* Urgent */}
                  <div className="space-y-2">
                    <div className="h-24 bg-status-urgent rounded-md flex items-end">
                      <div className="w-full p-2 text-xs bg-black/20 text-white font-mono rounded-b-md">
                        #FF9500
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Urgent Attention</h3>
                      <p className="text-xs text-muted-foreground">1-7 days to expiry</p>
                    </div>
                  </div>
                  
                  {/* Warning */}
                  <div className="space-y-2">
                    <div className="h-24 bg-status-warning rounded-md flex items-end">
                      <div className="w-full p-2 text-xs bg-black/20 text-white font-mono rounded-b-md">
                        #FFCC00
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Warning State</h3>
                      <p className="text-xs text-muted-foreground">8-30 days to expiry</p>
                    </div>
                  </div>
                  
                  {/* Valid */}
                  <div className="space-y-2">
                    <div className="h-24 bg-status-valid rounded-md flex items-end">
                      <div className="w-full p-2 text-xs bg-black/20 text-white font-mono rounded-b-md">
                        #34C759
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Valid/Compliant</h3>
                      <p className="text-xs text-muted-foreground">31+ days to expiry</p>
                    </div>
                  </div>
                  
                  {/* Inactive */}
                  <div className="space-y-2">
                    <div className="h-24 bg-status-inactive rounded-md flex items-end">
                      <div className="w-full p-2 text-xs bg-black/20 text-white font-mono rounded-b-md">
                        #8E8E93
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Not Applicable</h3>
                      <p className="text-xs text-muted-foreground">Inactive state</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Color Semantics</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Borders & Outlines</CardTitle>
                            <div className="h-4 w-16 rounded bg-status-expired/20 border border-status-expired"></div>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <p>Used to emphasize element boundaries with the relevant status color at a reduced opacity.</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Backgrounds</CardTitle>
                            <div className="h-4 w-16 rounded bg-status-warning/10"></div>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <p>Applied as subtle backgrounds at 10% opacity to maintain readability while conveying status.</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Text & Icons</CardTitle>
                            <div className="h-4 w-16 flex items-center justify-center text-status-valid">
                              <Clock className="h-4 w-4" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <p>Status colors applied directly to text and icons for immediate visual indication.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="components" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Indicators</CardTitle>
                <CardDescription>
                  Components that utilize the status color system to convey information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-3">Buttons</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="expired">Expired</Button>
                    <Button variant="urgent">Urgent</Button>
                    <Button variant="warning">Warning</Button>
                    <Button variant="valid">Valid</Button>
                    <Button variant="inactive">Inactive</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button variant="expiredOutline">Expired Outline</Button>
                    <Button variant="urgentOutline">Urgent Outline</Button>
                    <Button variant="warningOutline">Warning Outline</Button>
                    <Button variant="validOutline">Valid Outline</Button>
                    <Button variant="inactiveOutline">Inactive Outline</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status="expired" />
                    <StatusBadge status="urgent" />
                    <StatusBadge status="warning" />
                    <StatusBadge status="valid" />
                    <StatusBadge status="inactive" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Pills</h3>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill status="expired" size="sm" />
                    <StatusPill status="urgent" size="sm" />
                    <StatusPill status="warning" size="sm" />
                    <StatusPill status="valid" size="sm" />
                    <StatusPill status="inactive" size="sm" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <StatusPill status="expired" />
                    <StatusPill status="urgent" />
                    <StatusPill status="warning" />
                    <StatusPill status="valid" />
                    <StatusPill status="inactive" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <StatusPill status="expired" size="lg" showDays={true} daysToExpiry={0} />
                    <StatusPill status="urgent" size="lg" showDays={true} daysToExpiry={5} />
                    <StatusPill status="warning" size="lg" showDays={true} daysToExpiry={15} />
                    <StatusPill status="valid" size="lg" showDays={true} daysToExpiry={45} />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Status Indicators</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <StatusIndicator status="expired" daysToExpiry={-2} />
                      <StatusIndicator status="urgent" daysToExpiry={5} />
                      <StatusIndicator status="warning" daysToExpiry={15} />
                      <StatusIndicator status="valid" daysToExpiry={45} />
                      <StatusIndicator status="inactive" daysToExpiry={null} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Timelines</h3>
                  <div className="space-y-4 max-w-md">
                    <StatusTimeline totalDays={30} daysRemaining={0} />
                    <StatusTimeline totalDays={30} daysRemaining={5} />
                    <StatusTimeline totalDays={30} daysRemaining={15} />
                    <StatusTimeline totalDays={30} daysRemaining={45} />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Alerts</h3>
                  <div className="space-y-3">
                    <Alert variant="destructive">
                      <CircleAlert className="h-4 w-4" />
                      <AlertTitle>Critical Alert</AlertTitle>
                      <AlertDescription>
                        Expired item requiring immediate attention.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert className="border-status-urgent text-status-urgent">
                      <CircleAlert className="h-4 w-4" />
                      <AlertTitle>Urgent Alert</AlertTitle>
                      <AlertDescription>
                        Item requiring attention within 7 days.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert className="border-status-warning text-status-warning">
                      <CircleAlert className="h-4 w-4" />
                      <AlertTitle>Warning Alert</AlertTitle>
                      <AlertDescription>
                        Item requiring attention within 30 days.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert className="border-status-valid text-status-valid">
                      <Truck className="h-4 w-4" />
                      <AlertTitle>Valid Status</AlertTitle>
                      <AlertDescription>
                        Equipment is compliant with all requirements.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="auth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role-Based Access Control</CardTitle>
                <CardDescription>
                  Color-coded user roles and permission indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-3">Role Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    <RoleBadge role="admin" />
                    <RoleBadge role="manager" />
                    <RoleBadge role="technician" />
                    <RoleBadge role="viewer" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">User Cards with Role Indicators</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <UserCard 
                      user={{
                        id: "1",
                        name: "Alex Johnson",
                        email: "alex@example.com",
                        role: "admin"
                      }}
                    />
                    <UserCard 
                      user={{
                        id: "2",
                        name: "Sam Rodriguez",
                        email: "sam@example.com",
                        role: "manager"
                      }}
                    />
                    <UserCard 
                      user={{
                        id: "3",
                        name: "Taylor Williams",
                        email: "taylor@example.com",
                        role: "technician"
                      }}
                    />
                    <UserCard 
                      user={{
                        id: "4",
                        name: "Morgan Lee",
                        email: "morgan@example.com",
                        role: "viewer"
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Permission Levels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                      <Card key={role} className={`border-${config.color}/30 bg-${config.color}/5`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">{config.label}</CardTitle>
                            <RoleBadge role={role as any} size="sm" showLabel={false} />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-2">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {config.permissions.map(permission => (
                              <span 
                                key={permission}
                                className={`inline-flex items-center px-2 py-1 text-xs rounded-full bg-${config.color}/10 text-${config.color} border border-${config.color}/20`}
                              >
                                {permission.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Role-Based UI Elements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Admin View</h4>
                      <Card className="border-status-valid/30 bg-status-valid/5">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">User Management</h3>
                            <Button variant="validOutline" size="sm">
                              <Users className="mr-1 h-4 w-4" />
                              Add User
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-xs">
                              <span className="w-1/3">Name</span>
                              <span className="w-1/3">Role</span>
                              <span className="w-1/3">Actions</span>
                            </div>
                            <div className="flex items-center justify-between rounded bg-background p-2">
                              <span className="text-sm">User 1</span>
                              <RoleBadge role="manager" size="sm" />
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="expired" size="sm">Delete</Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Viewer View</h4>
                      <Card className="border-status-inactive/30 bg-status-inactive/5">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">User Management</h3>
                            <Button variant="inactiveOutline" size="sm" disabled>
                              <Users className="mr-1 h-4 w-4" />
                              Add User
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-xs">
                              <span className="w-1/2">Name</span>
                              <span className="w-1/2">Role</span>
                            </div>
                            <div className="flex items-center justify-between rounded bg-background p-2">
                              <span className="text-sm">User 1</span>
                              <RoleBadge role="manager" size="sm" />
                            </div>
                            <div className="text-xs text-muted-foreground italic">
                              * View-only access. Contact an administrator for changes.
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Guidelines</CardTitle>
                <CardDescription>
                  Best practices for implementing the status color system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Consistency</h3>
                  <p className="text-muted-foreground">
                    Always use the status colors consistently across the application to maintain clear communication:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Red (#FF3B30) - Only for expired or critical issues</li>
                    <li>Orange (#FF9500) - Only for items requiring urgent attention (1-7 days)</li>
                    <li>Yellow (#FFCC00) - Only for warning states (8-30 days)</li>
                    <li>Green (#34C759) - Only for valid/compliant states (31+ days)</li>
                    <li>Grey (#8E8E93) - Only for inactive or not applicable states</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Accessibility</h3>
                  <p className="text-muted-foreground">
                    Ensure that status information is not communicated by color alone:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Always include text labels with status colors when possible</li>
                    <li>Use patterns or icons in addition to colors</li>
                    <li>Ensure sufficient contrast ratios for all status indicators</li>
                    <li>Test the interface in both light and dark modes</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Context-Appropriate Indicators</h3>
                  <p className="text-muted-foreground">
                    Choose the appropriate status component based on context:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">In Tables and Lists</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="mb-2">Use compact indicators like badges and pills:</p>
                        <div className="flex gap-2">
                          <StatusBadge status="expired" />
                          <StatusPill status="urgent" size="sm" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">For Detailed Views</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="mb-2">Use comprehensive indicators with context:</p>
                        <StatusIndicator 
                          status="warning" 
                          daysToExpiry={15}
                          label="Equipment Certification" 
                        />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">For Dashboards</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="mb-2">Use visual cards and progress indicators:</p>
                        <StatusTimeline totalDays={30} daysRemaining={15} />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">For Notifications</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="mb-2">Use alerts with clear descriptions:</p>
                        <Alert className="border-status-urgent text-status-urgent">
                          <CircleAlert className="h-4 w-4" />
                          <AlertTitle className="text-sm">Urgent: Certification Expiring</AlertTitle>
                        </Alert>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Design Principles</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-muted/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Clarity</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Status should be immediately recognizable without requiring interpretation.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Consistency</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Status colors and patterns should be used consistently throughout the application.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Context</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Provide adequate context for each status to ensure proper understanding.</p>
                      </CardContent>
                    </Card>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DesignSystem;
