import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EquipmentStatusChart } from "@/components/analytics/EquipmentStatusChart";
import { ComplianceOverviewChart } from "@/components/analytics/ComplianceOverviewChart";
import { DocumentExpiryChart } from "@/components/analytics/DocumentExpiryChart";
import { MaintenanceTimelineChart } from "@/components/analytics/MaintenanceTimelineChart";
import { KpiMetrics } from "@/components/analytics/KpiMetrics";
import { ReportBuilder } from "@/components/analytics/ReportBuilder";
import { ExportOptions } from "@/components/analytics/ExportOptions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lightbulb, Video, Info, Download , Search} from "lucide-react";

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month");
  const isMobile = useIsMobile();

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor equipment performance, compliance, and maintenance metrics with real-time insights.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2">
            <Video className="h-4 w-4" />
            Watch Tutorial
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
                  Get the most out of your analytics dashboard with these tips.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      Adjust the date range to focus on specific time periods.
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">2</span>
                    </div>
                    <p className="text-sm">
                      Export reports for sharing with your team.
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">3</span>
                    </div>
                    <p className="text-sm">
                      Use the Report Builder for custom analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <KpiMetrics dateRange={dateRange} />
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={(value) => setDateRange(value as typeof dateRange)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <ExportOptions />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-muted">
            <TabsTrigger
              value="overview"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="equipment"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              Equipment
            </TabsTrigger>
            <TabsTrigger
              value="compliance"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              Compliance
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Equipment Status
                  </CardTitle>
                  <CardDescription>Current status distribution of all equipment</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? "h-[250px]" : "h-[300px]"}>
                  <EquipmentStatusChart />
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Compliance Overview
                  </CardTitle>
                  <CardDescription>Compliance status by equipment category</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? "h-[250px]" : "h-[300px]"}>
                  <ComplianceOverviewChart />
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Maintenance Timeline
                  </CardTitle>
                  <CardDescription>Equipment maintenance history and forecast</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? "h-[250px]" : "h-[300px]"}>
                  <MaintenanceTimelineChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Equipment Performance
                </CardTitle>
                <CardDescription>Detailed equipment performance metrics</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "h-[300px]" : "h-[400px]"}>
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-center text-muted-foreground mb-4">
                    Select equipment to view detailed performance metrics
                  </p>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Select Equipment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Document Expiry Timeline
                </CardTitle>
                <CardDescription>Upcoming document expirations</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "h-[300px]" : "h-[400px]"}>
                <DocumentExpiryChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Custom Report Builder
                </CardTitle>
                <CardDescription>Create and manage custom analytics reports</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportBuilder />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Report Preview Section */}
        <Card className="mt-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Report Preview
            </CardTitle>
            <CardDescription>
              Example of how your analytics reports will appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <Info size={16} className="mr-2 text-blue-600" />
                  Equipment Status Report
                </h4>
                <div className="bg-blue-50 p-3 rounded-md flex items-center justify-center h-32">
                  <p className="text-sm text-blue-600 font-medium">
                    Pie chart showing equipment status distribution
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  PDF report summarizing equipment status across all categories
                </p>
              </div>
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <Info size={16} className="mr-2 text-blue-600" />
                  Compliance Summary
                </h4>
                <div className="bg-blue-50 p-3 rounded-md flex items-center justify-center h-32">
                  <p className="text-sm text-blue-600 font-medium">
                    Bar chart showing compliance by category
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Excel report detailing compliance metrics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button
            onClick={() => console.log("Export all charts")}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>
  );
}