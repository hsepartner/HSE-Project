
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Defect, DefectSeverity, SEVERITY_CONFIG } from "@/types/compliance";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Eye, MessageSquare, User, AlertTriangle } from "lucide-react";

// Sample data
const SAMPLE_DEFECTS: Defect[] = [
  {
    id: "1",
    equipmentId: "1",
    title: "Hydraulic Fluid Leak",
    description: "Slow hydraulic fluid leak observed from the main cylinder during operation.",
    reportedDate: "2024-04-18",
    reportedBy: "John Operator",
    severity: "major",
    status: "open",
    assignedTo: "Sarah Technician"
  },
  {
    id: "2",
    equipmentId: "2",
    title: "Brake Malfunction",
    description: "Emergency brake not engaging properly when tested.",
    reportedDate: "2024-04-15",
    reportedBy: "Mike Driver",
    severity: "critical",
    status: "in-progress",
    assignedTo: "Sarah Technician"
  },
  {
    id: "3",
    equipmentId: "3",
    title: "Unusual Noise During Operation",
    description: "Grinding noise coming from the main drive when operating at high speeds.",
    reportedDate: "2024-04-17",
    reportedBy: "Lisa Operator",
    severity: "minor",
    status: "open",
    assignedTo: "John Mechanic"
  },
  {
    id: "4",
    equipmentId: "1",
    title: "Display Flickering",
    description: "Control panel display flickers intermittently during operation.",
    reportedDate: "2024-04-10",
    reportedBy: "John Operator",
    severity: "minor",
    status: "resolved",
    resolvedDate: "2024-04-16",
    resolvedBy: "Tech Support",
    maintenanceId: "5"
  },
  {
    id: "5",
    equipmentId: "4",
    title: "Cooling System Overheating",
    description: "System temperature rises above normal operating levels after extended use.",
    reportedDate: "2024-04-12",
    reportedBy: "Technical Supervisor",
    severity: "major",
    status: "closed",
    resolvedDate: "2024-04-14",
    resolvedBy: "External Technician",
    maintenanceId: "6"
  }
];

const getDefectStatusConfig = (status: Defect['status']) => {
  switch (status) {
    case 'open':
      return {
        label: 'Open',
        color: 'bg-status-warning/10 text-status-warning border-status-warning/20'
      };
    case 'in-progress':
      return {
        label: 'In Progress',
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      };
    case 'resolved':
      return {
        label: 'Resolved',
        color: 'bg-status-valid/10 text-status-valid border-status-valid/20'
      };
    case 'closed':
      return {
        label: 'Closed',
        color: 'bg-status-inactive/10 text-status-inactive border-status-inactive/20'
      };
    default:
      return {
        label: 'Unknown',
        color: 'bg-status-inactive/10 text-status-inactive border-status-inactive/20'
      };
  }
};

interface DefectTrackerProps {
  view: 'grid' | 'list';
}

export function DefectTracker({ view }: DefectTrackerProps) {
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [filterStatus, setFilterStatus] = useState<Defect['status'] | 'all'>('all');
  
  const filteredDefects = SAMPLE_DEFECTS.filter(defect => 
    filterStatus === 'all' || defect.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" onValueChange={(value) => setFilterStatus(value as Defect['status'] | 'all')}>
        <TabsList>
          <TabsTrigger value="all">All Defects</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {view === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Defect Cards */}
          <div className="space-y-4">
            {filteredDefects.map(defect => {
              const severityConfig = SEVERITY_CONFIG[defect.severity];
              const statusConfig = getDefectStatusConfig(defect.status);
              
              return (
                <Card 
                  key={defect.id}
                  className={cn(
                    "cursor-pointer hover:shadow-md transition-shadow",
                    `border-l-4 border-l-${severityConfig.color}`
                  )}
                  onClick={() => setSelectedDefect(defect)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{defect.title}</h3>
                        <p className="text-sm text-muted-foreground">Equipment {defect.equipmentId}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className={cn(
                          "px-2 py-0.5 text-xs rounded-full", 
                          statusConfig.color
                        )}>
                          {statusConfig.label}
                        </div>
                        <div className={cn(
                          "px-2 py-0.5 text-xs rounded-full", 
                          `bg-${severityConfig.color}/10 text-${severityConfig.color} border-${severityConfig.color}/20`
                        )}>
                          {severityConfig.label}
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm line-clamp-2">{defect.description}</p>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Reported: {new Date(defect.reportedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        <span>By: {defect.reportedBy}</span>
                      </div>
                      
                      {defect.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          <span>Assigned: {defect.assignedTo}</span>
                        </div>
                      )}
                      
                      {defect.resolvedDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Resolved: {new Date(defect.resolvedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredDefects.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No defects found matching the selected filter.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Defect Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{selectedDefect ? 'Defect Details' : 'Select a Defect'}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDefect ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{selectedDefect.title}</h3>
                    <div className="flex gap-2">
                      <div className={cn(
                        "px-2 py-0.5 text-xs rounded-full", 
                        getDefectStatusConfig(selectedDefect.status).color
                      )}>
                        {getDefectStatusConfig(selectedDefect.status).label}
                      </div>
                      <div className={cn(
                        "px-2 py-0.5 text-xs rounded-full", 
                        `bg-${SEVERITY_CONFIG[selectedDefect.severity].color}/10 text-${SEVERITY_CONFIG[selectedDefect.severity].color} border-${SEVERITY_CONFIG[selectedDefect.severity].color}/20`
                      )}>
                        {SEVERITY_CONFIG[selectedDefect.severity].label}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className={cn(
                        "h-4 w-4",
                        `text-${SEVERITY_CONFIG[selectedDefect.severity].color}`
                      )} />
                      <span className="font-medium">Severity: {SEVERITY_CONFIG[selectedDefect.severity].label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {SEVERITY_CONFIG[selectedDefect.severity].description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Description</h4>
                    <p className="text-sm">{selectedDefect.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Equipment</p>
                      <p className="font-medium">Equipment {selectedDefect.equipmentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reported Date</p>
                      <p className="font-medium">{new Date(selectedDefect.reportedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reported By</p>
                      <p className="font-medium">{selectedDefect.reportedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned To</p>
                      <p className="font-medium">{selectedDefect.assignedTo || 'Unassigned'}</p>
                    </div>
                  </div>
                  
                  {(selectedDefect.status === 'resolved' || selectedDefect.status === 'closed') && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Resolution Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Resolved By</p>
                          <p className="font-medium">{selectedDefect.resolvedBy}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Resolution Date</p>
                          <p className="font-medium">
                            {selectedDefect.resolvedDate && new Date(selectedDefect.resolvedDate).toLocaleDateString()}
                          </p>
                        </div>
                        {selectedDefect.maintenanceId && (
                          <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Related Maintenance</p>
                            <p className="font-medium">Maintenance #{selectedDefect.maintenanceId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 border-t pt-4">
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Details
                    </Button>
                    {selectedDefect.status === 'open' && (
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Troubleshooting
                      </Button>
                    )}
                    {selectedDefect.status === 'in-progress' && (
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Resolve Defect
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Defect Selected</h3>
                  <p className="text-muted-foreground">Select a defect from the list to view its details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        // List View
        <Card>
          <CardHeader>
            <CardTitle>Defects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="bg-muted/50 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3">Issue</div>
                <div className="col-span-2">Equipment</div>
                <div className="col-span-2">Severity</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Reported</div>
                <div className="col-span-2">Actions</div>
              </div>
              <div className="divide-y">
                {filteredDefects.map(defect => {
                  const severityConfig = SEVERITY_CONFIG[defect.severity];
                  const statusConfig = getDefectStatusConfig(defect.status);
                  
                  return (
                    <div 
                      key={defect.id}
                      className={cn(
                        "py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-muted/50",
                        `border-l-4 border-l-${severityConfig.color}`
                      )}
                    >
                      <div className="col-span-3">
                        <div className="font-medium">{defect.title}</div>
                        <div className="text-sm text-muted-foreground truncate">{defect.description}</div>
                      </div>
                      <div className="col-span-2">
                        Equipment {defect.equipmentId}
                      </div>
                      <div className="col-span-2">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          `bg-${severityConfig.color}/10 text-${severityConfig.color} border-${severityConfig.color}/20`
                        )}>
                          {severityConfig.label}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          statusConfig.color
                        )}>
                          {statusConfig.label}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className="text-sm">{new Date(defect.reportedDate).toLocaleDateString()}</div>
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedDefect(defect)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {defect.status === 'open' && (
                          <Button size="sm">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {defect.status === 'in-progress' && (
                          <Button size="sm">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {filteredDefects.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    No defects found matching the selected filter.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
