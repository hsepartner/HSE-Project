
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Wrench, Clock, Calendar as CalendarIcon, User, Eye, Tag } from "lucide-react";
import { MaintenanceSchedule as MaintenanceScheduleType, MaintenanceType } from "@/types/compliance";

// Sample data
const SAMPLE_MAINTENANCE: MaintenanceScheduleType[] = [
  {
    id: "1",
    equipmentId: "1",
    title: "Routine Oil Change",
    description: "Change oil and replace oil filter",
    type: "preventive",
    status: "scheduled",
    scheduledDate: "2024-04-25",
    estimatedDuration: 2,
    assignedTo: "John Mechanic"
  },
  {
    id: "2",
    equipmentId: "2",
    title: "Hydraulic System Repair",
    description: "Fix hydraulic leak and replace damaged seals",
    type: "corrective",
    status: "in-progress",
    scheduledDate: "2024-04-21",
    estimatedDuration: 4,
    assignedTo: "Sarah Technician"
  },
  {
    id: "3",
    equipmentId: "3",
    title: "Belt Replacement",
    description: "Replace worn drive belts",
    type: "preventive",
    status: "scheduled",
    scheduledDate: "2024-04-27",
    estimatedDuration: 1.5,
    assignedTo: "Mike Engineer"
  },
  {
    id: "4",
    equipmentId: "1",
    title: "Annual Servicing",
    description: "Complete annual maintenance as per manufacturer recommendations",
    type: "preventive",
    status: "scheduled",
    scheduledDate: "2024-05-15",
    estimatedDuration: 8,
    assignedTo: "External Service Provider"
  },
  {
    id: "5",
    equipmentId: "4",
    title: "Emergency Brake Repair",
    description: "Repair malfunctioning emergency brake system",
    type: "corrective",
    status: "completed",
    scheduledDate: "2024-04-18",
    estimatedDuration: 3,
    actualDuration: 2.5,
    assignedTo: "John Mechanic",
    completedBy: "John Mechanic",
    completedDate: "2024-04-18"
  }
];

const getMaintenanceTypeConfig = (type: MaintenanceType) => {
  switch (type) {
    case 'preventive':
      return {
        label: 'Preventive',
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      };
    case 'corrective':
      return {
        label: 'Corrective',
        color: 'bg-status-urgent/10 text-status-urgent border-status-urgent/20'
      };
    case 'predictive':
      return {
        label: 'Predictive',
        color: 'bg-green-500/10 text-green-500 border-green-500/20'
      };
    case 'condition-based':
      return {
        label: 'Condition-based',
        color: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      };
    default:
      return {
        label: 'Unknown',
        color: 'bg-status-inactive/10 text-status-inactive border-status-inactive/20'
      };
  }
};

const getMaintenanceStatusConfig = (status: MaintenanceScheduleType['status']) => {
  switch (status) {
    case 'scheduled':
      return {
        label: 'Scheduled',
        color: 'bg-status-warning/10 text-status-warning border-status-warning/20'
      };
    case 'in-progress':
      return {
        label: 'In Progress',
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      };
    case 'completed':
      return {
        label: 'Completed',
        color: 'bg-status-valid/10 text-status-valid border-status-valid/20'
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        color: 'bg-status-inactive/10 text-status-inactive border-status-inactive/20'
      };
    default:
      return {
        label: 'Unknown',
        color: 'bg-status-inactive/10 text-status-inactive border-status-inactive/20'
      };
  }
};

interface MaintenanceScheduleProps {
  view: 'grid' | 'list';
}

export function MaintenanceSchedule({ view }: MaintenanceScheduleProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceScheduleType | null>(null);

  return (
    <div className="space-y-6">
      {view === 'grid' ? (
        <div className="flex gap-6">
          {/* Calendar View */}
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Maintenance Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border pointer-events-auto"
                />
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium">Scheduled for {date?.toLocaleDateString()}</h3>
                <div className="mt-2 space-y-2">
                  {date && SAMPLE_MAINTENANCE
                    .filter(maintenance => new Date(maintenance.scheduledDate).toDateString() === date.toDateString())
                    .map(maintenance => {
                      const typeConfig = getMaintenanceTypeConfig(maintenance.type);
                      const statusConfig = getMaintenanceStatusConfig(maintenance.status);
                      
                      return (
                        <div 
                          key={maintenance.id} 
                          className="p-2 rounded-md border cursor-pointer hover:border-primary"
                          onClick={() => setSelectedMaintenance(maintenance)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{maintenance.title}</p>
                              <p className="text-xs text-muted-foreground">Equipment {maintenance.equipmentId}</p>
                            </div>
                            <div className={cn(
                              "px-2 py-0.5 text-xs rounded-full", 
                              statusConfig.color
                            )}>
                              {statusConfig.label}
                            </div>
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{maintenance.estimatedDuration} hours</span>
                          </div>
                        </div>
                      );
                    })}
                  
                  {date && SAMPLE_MAINTENANCE
                    .filter(maintenance => new Date(maintenance.scheduledDate).toDateString() === date.toDateString()).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No maintenance scheduled for this date
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Maintenance Details */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Maintenance Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMaintenance ? (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{selectedMaintenance.title}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedMaintenance(null)}>
                      Close
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Equipment</p>
                        <p className="font-medium">Equipment {selectedMaintenance.equipmentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1",
                          getMaintenanceStatusConfig(selectedMaintenance.status).color
                        )}>
                          {getMaintenanceStatusConfig(selectedMaintenance.status).label}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1",
                          getMaintenanceTypeConfig(selectedMaintenance.type).color
                        )}>
                          {getMaintenanceTypeConfig(selectedMaintenance.type).label}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Scheduled Date</p>
                        <p className="font-medium">{new Date(selectedMaintenance.scheduledDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Duration</p>
                        <p className="font-medium">{selectedMaintenance.estimatedDuration} hours</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned To</p>
                        <p className="font-medium">{selectedMaintenance.assignedTo || 'Unassigned'}</p>
                      </div>
                    </div>
                    
                    {selectedMaintenance.description && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm">{selectedMaintenance.description}</p>
                      </div>
                    )}
                    
                    {selectedMaintenance.status === 'completed' && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Completion Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Completed By</p>
                            <p className="font-medium">{selectedMaintenance.completedBy}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Completion Date</p>
                            <p className="font-medium">
                              {selectedMaintenance.completedDate && new Date(selectedMaintenance.completedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Actual Duration</p>
                            <p className="font-medium">{selectedMaintenance.actualDuration} hours</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2 border-t pt-4">
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Details
                      </Button>
                      {selectedMaintenance.status !== 'completed' && selectedMaintenance.status !== 'cancelled' && (
                        <Button>
                          <Wrench className="h-4 w-4 mr-2" />
                          {selectedMaintenance.status === 'in-progress' ? 'Complete Maintenance' : 'Start Maintenance'}
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {SAMPLE_MAINTENANCE.map(maintenance => {
                    const typeConfig = getMaintenanceTypeConfig(maintenance.type);
                    const statusConfig = getMaintenanceStatusConfig(maintenance.status);
                    
                    return (
                      <div 
                        key={maintenance.id}
                        className="p-3 border rounded-md cursor-pointer hover:border-primary transition-colors"
                        onClick={() => setSelectedMaintenance(maintenance)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{maintenance.title}</h3>
                            <p className="text-sm text-muted-foreground">Equipment {maintenance.equipmentId}</p>
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
                              typeConfig.color
                            )}>
                              {typeConfig.label}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{new Date(maintenance.scheduledDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{maintenance.estimatedDuration} hours</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="truncate">{maintenance.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        // List View
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="bg-muted/50 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3">Maintenance</div>
                <div className="col-span-2">Equipment</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Scheduled Date</div>
                <div className="col-span-2">Actions</div>
              </div>
              <div className="divide-y">
                {SAMPLE_MAINTENANCE.map(maintenance => {
                  const typeConfig = getMaintenanceTypeConfig(maintenance.type);
                  const statusConfig = getMaintenanceStatusConfig(maintenance.status);
                  
                  return (
                    <div 
                      key={maintenance.id}
                      className="py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-muted/50"
                    >
                      <div className="col-span-3">
                        <div className="font-medium">{maintenance.title}</div>
                        <div className="text-sm text-muted-foreground truncate">{maintenance.description}</div>
                      </div>
                      <div className="col-span-2">
                        Equipment {maintenance.equipmentId}
                      </div>
                      <div className="col-span-2">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          typeConfig.color
                        )}>
                          {typeConfig.label}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          statusConfig.color
                        )}>
                          {statusConfig.label}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm">{new Date(maintenance.scheduledDate).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">{maintenance.estimatedDuration} hours</div>
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedMaintenance(maintenance)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {maintenance.status !== 'completed' && maintenance.status !== 'cancelled' && (
                          <Button size="sm">
                            <Wrench className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
