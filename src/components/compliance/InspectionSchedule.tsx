
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InspectionChecklist, getInspectionStatus, INSPECTION_STATUS_CONFIG } from "@/types/compliance";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, CheckSquare, Eye, PencilLine } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Sample data
const SAMPLE_CHECKLISTS: InspectionChecklist[] = [
  {
    id: "1",
    title: "Daily Safety Inspection",
    equipmentId: "1",
    frequency: "daily",
    status: "pending",
    dueDate: "2024-04-21",
    assignedTo: "John Operator",
    items: [
      { id: "i1", description: "Check for oil leaks", isRequired: true, status: "not-checked" },
      { id: "i2", description: "Verify all safety guards are in place", isRequired: true, status: "not-checked" },
      { id: "i3", description: "Test emergency stop button", isRequired: true, status: "not-checked" },
      { id: "i4", description: "Check tire pressure", isRequired: false, status: "not-checked" }
    ]
  },
  {
    id: "2",
    title: "Monthly Electrical Inspection",
    equipmentId: "2",
    frequency: "monthly",
    status: "in-progress",
    dueDate: "2024-04-25",
    assignedTo: "Sarah Technician",
    items: [
      { id: "i5", description: "Check all electrical connections", isRequired: true, status: "passed" },
      { id: "i6", description: "Test backup power system", isRequired: true, status: "passed" },
      { id: "i7", description: "Inspect wiring for damage", isRequired: true, status: "not-checked" },
      { id: "i8", description: "Verify system ground", isRequired: true, status: "not-checked" }
    ]
  },
  {
    id: "3",
    title: "Quarterly Structural Inspection",
    equipmentId: "3",
    frequency: "quarterly",
    status: "overdue",
    dueDate: "2024-04-10",
    assignedTo: "Michael Engineer",
    items: [
      { id: "i9", description: "Inspect structural integrity", isRequired: true, status: "not-checked" },
      { id: "i10", description: "Check for corrosion", isRequired: true, status: "not-checked" },
      { id: "i11", description: "Verify load capacity signage", isRequired: false, status: "not-checked" },
      { id: "i12", description: "Test emergency controls", isRequired: true, status: "not-checked" }
    ]
  },
  {
    id: "4",
    title: "Annual Certification",
    equipmentId: "1",
    frequency: "annually",
    status: "completed",
    dueDate: "2024-03-15",
    completedDate: "2024-03-14",
    assignedTo: "External Auditor",
    completedBy: "Certification Agency",
    items: [
      { id: "i13", description: "Full system inspection", isRequired: true, status: "passed" },
      { id: "i14", description: "Safety compliance verification", isRequired: true, status: "passed" },
      { id: "i15", description: "Performance testing", isRequired: true, status: "passed" },
      { id: "i16", description: "Documentation review", isRequired: true, status: "passed" }
    ]
  }
];

interface InspectionScheduleProps {
  view: 'grid' | 'list';
}

export function InspectionSchedule({ view }: InspectionScheduleProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedChecklist, setSelectedChecklist] = useState<InspectionChecklist | null>(null);

  // Get all inspections with updated status based on due date
  const inspections = SAMPLE_CHECKLISTS.map(checklist => ({
    ...checklist,
    status: getInspectionStatus(checklist.dueDate, checklist.status)
  }));

  return (
    <div className="space-y-6">
      {view === 'grid' ? (
        <div className="flex gap-6">
          {/* Calendar View */}
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Inspection Calendar</CardTitle>
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
                  {date && inspections
                    .filter(inspection => new Date(inspection.dueDate).toDateString() === date.toDateString())
                    .map(inspection => (
                      <div 
                        key={inspection.id} 
                        className={cn(
                          "p-2 rounded-md border",
                          `border-l-4 border-l-${INSPECTION_STATUS_CONFIG[inspection.status].color}`
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{inspection.title}</p>
                            <p className="text-xs text-muted-foreground">Equipment {inspection.equipmentId}</p>
                          </div>
                          <div className={cn(
                            "px-2 py-0.5 text-xs rounded-full", 
                            `bg-${INSPECTION_STATUS_CONFIG[inspection.status].color}/10 text-${INSPECTION_STATUS_CONFIG[inspection.status].color}`
                          )}>
                            {INSPECTION_STATUS_CONFIG[inspection.status].label}
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {date && inspections
                    .filter(inspection => new Date(inspection.dueDate).toDateString() === date.toDateString()).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No inspections scheduled for this date
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Checklist Quick View */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Inspection Checklists</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedChecklist ? (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{selectedChecklist.title}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedChecklist(null)}>
                      Close
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Equipment</p>
                        <p className="font-medium">Equipment {selectedChecklist.equipmentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1",
                          `bg-${INSPECTION_STATUS_CONFIG[selectedChecklist.status].color}/10 text-${INSPECTION_STATUS_CONFIG[selectedChecklist.status].color}`
                        )}>
                          {INSPECTION_STATUS_CONFIG[selectedChecklist.status].label}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="font-medium">{new Date(selectedChecklist.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned To</p>
                        <p className="font-medium">{selectedChecklist.assignedTo || 'Unassigned'}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Checklist Items</h4>
                      <div className="space-y-2">
                        {selectedChecklist.items.map(item => (
                          <div key={item.id} className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center mt-0.5",
                              item.status === 'passed' ? "bg-status-valid/10 text-status-valid" :
                              item.status === 'failed' ? "bg-status-expired/10 text-status-expired" :
                              "bg-muted"
                            )}>
                              {item.status === 'passed' ? '✓' : item.status === 'failed' ? '✗' : '?'}
                            </div>
                            <div className="flex-1">
                              <p className={cn(
                                "text-sm",
                                item.isRequired && "font-medium"
                              )}>
                                {item.description}
                                {item.isRequired && <span className="text-status-expired ml-1">*</span>}
                              </p>
                              {item.notes && (
                                <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 border-t pt-4">
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Details
                      </Button>
                      <Button>
                        <PencilLine className="h-4 w-4 mr-2" />
                        Fill Checklist
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {inspections.map(inspection => (
                    <div 
                      key={inspection.id}
                      className={cn(
                        "p-3 border rounded-md cursor-pointer hover:border-primary transition-colors",
                        `border-l-4 border-l-${INSPECTION_STATUS_CONFIG[inspection.status].color}`
                      )}
                      onClick={() => setSelectedChecklist(inspection)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{inspection.title}</h3>
                          <p className="text-sm text-muted-foreground">Equipment {inspection.equipmentId}</p>
                        </div>
                        <div className={cn(
                          "px-2 py-0.5 text-xs rounded-full", 
                          `bg-${INSPECTION_STATUS_CONFIG[inspection.status].color}/10 text-${INSPECTION_STATUS_CONFIG[inspection.status].color}`
                        )}>
                          {INSPECTION_STATUS_CONFIG[inspection.status].label}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm">
                          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{new Date(inspection.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Progress: </span>
                          <span className="font-medium">
                            {inspection.items.filter(i => i.status !== 'not-checked').length}/{inspection.items.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        // List View
        <Card>
          <CardHeader>
            <CardTitle>Inspection Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="bg-muted/50 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">Inspection</div>
                <div className="col-span-2">Equipment</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-2">Actions</div>
              </div>
              <div className="divide-y">
                {inspections.map(inspection => (
                  <div 
                    key={inspection.id}
                    className={cn(
                      "py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-muted/50",
                      `border-l-4 border-l-${INSPECTION_STATUS_CONFIG[inspection.status].color}`
                    )}
                  >
                    <div className="col-span-4">
                      <div className="font-medium">{inspection.title}</div>
                      <div className="text-sm text-muted-foreground">{inspection.frequency} inspection</div>
                    </div>
                    <div className="col-span-2">
                      Equipment {inspection.equipmentId}
                    </div>
                    <div className="col-span-2">
                      <div className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        `bg-${INSPECTION_STATUS_CONFIG[inspection.status].color}/10 text-${INSPECTION_STATUS_CONFIG[inspection.status].color}`
                      )}>
                        {INSPECTION_STATUS_CONFIG[inspection.status].label}
                      </div>
                    </div>
                    <div className="col-span-2">
                      {new Date(inspection.dueDate).toLocaleDateString()}
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedChecklist(inspection)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm">
                        <CheckSquare className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
