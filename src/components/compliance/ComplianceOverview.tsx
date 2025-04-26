
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceMeter } from "@/components/equipment/ComplianceMeter";
import { StatusPill } from "@/components/status/StatusPill";
import { ComplianceMetric } from "@/types/compliance";
import { AlertCircle, Calendar, CheckCircle, FileCheck, Wrench } from "lucide-react";
import { EquipmentCategory } from "@/types/equipment";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

// Sample data for demonstration
const SAMPLE_METRICS: ComplianceMetric[] = [
  {
    equipmentId: "1",
    overallScore: 92,
    lastUpdated: "2024-04-18T14:30:00",
    expiryStatus: "valid",
    inspectionScore: 95,
    maintenanceScore: 90,
    documentScore: 100,
    defectScore: 85,
    nextDueDate: "2024-05-15",
    nextDueItem: "Monthly Inspection"
  },
  {
    equipmentId: "2",
    overallScore: 65,
    lastUpdated: "2024-04-15T09:45:00",
    expiryStatus: "warning",
    inspectionScore: 70,
    maintenanceScore: 60,
    documentScore: 80,
    defectScore: 50,
    nextDueDate: "2024-04-25",
    nextDueItem: "Weekly Maintenance"
  },
  {
    equipmentId: "3",
    overallScore: 45,
    lastUpdated: "2024-04-17T16:20:00",
    expiryStatus: "urgent",
    inspectionScore: 30,
    maintenanceScore: 40,
    documentScore: 60,
    defectScore: 50,
    nextDueDate: "2024-04-22",
    nextDueItem: "Safety Inspection"
  },
  {
    equipmentId: "4",
    overallScore: 20,
    lastUpdated: "2024-04-10T11:15:00",
    expiryStatus: "expired",
    inspectionScore: 10,
    maintenanceScore: 0,
    documentScore: 40,
    defectScore: 30,
    nextDueDate: "2024-04-05",
    nextDueItem: "Monthly Maintenance"
  }
];

// Data for charts
const statusDistribution = [
  { name: 'Valid', value: 42, color: 'hsl(var(--status-valid))' },
  { name: 'Warning', value: 18, color: 'hsl(var(--status-warning))' },
  { name: 'Urgent', value: 8, color: 'hsl(var(--status-urgent))' },
  { name: 'Expired', value: 4, color: 'hsl(var(--status-expired))' },
];

const complianceByCategory = [
  { name: 'Heavy', score: 87, color: '#3B82F6' },
  { name: 'Light', score: 92, color: '#22C55E' },
  { name: 'Power Tools', score: 78, color: '#F97316' },
];

const upcomingTasksData = [
  { name: 'Inspections', count: 12 },
  { name: 'Maintenance', count: 8 },
  { name: 'Renewals', count: 5 },
];

interface ComplianceOverviewProps {
  view: 'grid' | 'list';
}

export function ComplianceOverview({ view }: ComplianceOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">72</div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              5 added this month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div className="text-3xl font-bold">86%</div>
              <StatusPill status="valid" size="sm" />
            </div>
            <div className="mt-2">
              <Progress value={86} className="h-2" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              +2.5% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">25</div>
              <div className="w-12 h-12 bg-status-warning/10 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-status-warning" />
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <StatusPill status="warning" size="sm" />
              <span className="text-xs text-muted-foreground">Due this week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">7</div>
              <div className="w-12 h-12 bg-status-expired/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-status-expired" />
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <StatusPill status="expired" size="sm" />
              <span className="text-xs text-muted-foreground">Needs immediate attention</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Detailed Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">Updated today at 10:30 AM</span>
            <Button variant="outline" size="sm">View Details</Button>
          </CardFooter>
        </Card>
        
        {/* Compliance by Category */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compliance by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={complianceByCategory}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Compliance %', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Compliance']} />
                <Bar dataKey="score" name="Compliance Score">
                  {complianceByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">Based on 72 equipment items</span>
            <Button variant="outline" size="sm">Export Report</Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Equipment Compliance List */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Compliance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="bg-muted/50 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">Equipment</div>
              <div className="col-span-2">Overall Score</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Next Due</div>
              <div className="col-span-2">Action</div>
            </div>
            <div className="divide-y">
              {SAMPLE_METRICS.map((metric) => (
                <div 
                  key={metric.equipmentId} 
                  className={cn(
                    "py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-muted/50",
                    `border-l-4 border-l-status-${metric.expiryStatus}`
                  )}
                >
                  <div className="col-span-4">
                    <div className="font-medium">Equipment {metric.equipmentId}</div>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {new Date(metric.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <ComplianceMeter 
                      score={metric.overallScore} 
                      showLabel={false}
                      size="sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <StatusPill status={metric.expiryStatus} size="sm" />
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm font-medium">{metric.nextDueItem}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(metric.nextDueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-4">
          <Button variant="outline">Export</Button>
          <Button>View All Equipment</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
