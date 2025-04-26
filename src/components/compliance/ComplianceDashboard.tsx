
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplianceOverview } from "./ComplianceOverview";
import { InspectionSchedule } from "./InspectionSchedule";
import { MaintenanceSchedule } from "./MaintenanceSchedule";
import { DefectTracker } from "./DefectTracker";
import { Filter, Calendar, List, PlusCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceDashboardProps {
  className?: string;
}

export function ComplianceDashboard({ className }: ComplianceDashboardProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor equipment compliance, inspections, and maintenance schedules.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              className="pl-8 w-[200px] md:w-[260px]"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="hidden md:flex border rounded-md">
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="px-3"
              onClick={() => setView('grid')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="px-3"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inspections">Inspections</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="defects">Defects</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              {activeTab === 'inspections' ? 'New Inspection' : 
               activeTab === 'maintenance' ? 'Schedule Maintenance' : 
               activeTab === 'defects' ? 'Report Defect' : 'Create New'}
            </Button>
          </div>
        </div>
        
        <TabsContent value="overview" className="space-y-4">
          <ComplianceOverview view={view} />
        </TabsContent>
        
        <TabsContent value="inspections" className="space-y-4">
          <InspectionSchedule view={view} />
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          <MaintenanceSchedule view={view} />
        </TabsContent>
        
        <TabsContent value="defects" className="space-y-4">
          <DefectTracker view={view} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
