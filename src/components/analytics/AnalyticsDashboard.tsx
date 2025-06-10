import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Lightbulb, 
  Video, 
  Info, 
  Download, 
  Search, 
  TrendingUp,
  Shield,
  Wrench,
  FileText,
  BarChart3,
  RefreshCw,
  Filter,
  Calendar,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month");
  const [activeInsight, setActiveInsight] = useState(0);
  const isMobile = useIsMobile();

  const insights = [
    "Equipment uptime has increased by 12% this month",
    "3 compliance documents expire within 30 days",
    "Preventive maintenance reduced downtime by 25%"
  ];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen">
      {/* Enhanced Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Monitor equipment performance, compliance, and maintenance metrics with real-time insights and intelligent analytics.
          </p>
          
          {/* Live Insights Ticker */}
          <div className="flex items-center gap-2 mt-4">
            <Bell className="h-4 w-4 text-amber-500 animate-pulse" />
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1 rounded-full border border-amber-200">
              <p className="text-sm font-medium text-amber-800 animate-pulse">
                {insights[activeInsight]}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="hidden md:flex gap-2 hover:bg-blue-50 border-blue-200 text-blue-700"
            onClick={() => setActiveInsight((prev) => (prev + 1) % insights.length)}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
          <Button variant="outline" className="md:flex gap-2 hidden hover:bg-purple-50 border-purple-200 text-purple-700">
            <Video className="h-4 w-4" />
            Watch Tutorial
          </Button>
          <Button variant="outline" className="md:hidden" size="icon" title="Watch Tutorial">
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Quick Tips Section */}
      <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200/50 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg">
              <Lightbulb className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2 text-gray-900">Pro Tips & Features</h3>
              <p className="text-muted-foreground mb-6">
                Maximize your analytics potential with these intelligent features and shortcuts.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: Calendar,
                    title: "Smart Date Filtering",
                    description: "Use dynamic date ranges and custom periods for precise analysis",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: Download,
                    title: "One-Click Export",
                    description: "Export beautiful reports in PDF, Excel, or PowerPoint formats",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: Filter,
                    title: "Advanced Filtering",
                    description: "Create custom views with multi-dimensional filtering options",
                    color: "from-purple-500 to-pink-500"
                  }
                ].map((tip, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-lg bg-gradient-to-r flex items-center justify-center shadow-sm",
                        tip.color
                      )}>
                        <tip.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Controls Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <KpiMetrics dateRange={dateRange} />
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={dateRange} onValueChange={(value) => setDateRange(value as typeof dateRange)}>
              <SelectTrigger className="w-[160px] bg-white border-gray-200 hover:border-blue-300 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ExportOptions />
        </div>
      </div>

      {/* Enhanced Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/20">
          <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2 p-1">
            {[
              { value: "overview", label: "Overview", icon: TrendingUp },
              { value: "equipment", label: "Equipment", icon: Wrench },
              { value: "compliance", label: "Compliance", icon: Shield },
              { value: "reports", label: "Reports", icon: FileText }
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border-blue-200 transition-all duration-200"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2 auto-rows-fr">
            {[
              {
                title: "Equipment Status",
                description: "Real-time status distribution across all equipment",
                icon: Wrench,
                component: <EquipmentStatusChart />,
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Compliance Overview",
                description: "Compliance metrics by equipment category",
                icon: Shield,
                component: <ComplianceOverviewChart />,
                color: "from-green-500 to-emerald-500"
              }
            ].map((card, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg bg-gradient-to-r shadow-sm",
                      card.color
                    )}>
                      <card.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">{card.title}</span>
                    <Badge variant="secondary" className="ml-auto">Live</Badge>
                  </CardTitle>
                  <CardDescription className="text-base">{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[320px]">
                  {card.component}
                </CardContent>
              </Card>
            ))}

            <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Maintenance Timeline</span>
                  <Badge variant="secondary" className="ml-auto">Predictive</Badge>
                </CardTitle>
                <CardDescription className="text-base">
                  AI-powered maintenance history analysis and intelligent forecasting
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[320px]">
                <MaintenanceTimelineChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-8">
          <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 shadow-sm">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Equipment Performance Hub</span>
              </CardTitle>
              <CardDescription className="text-base">
                Comprehensive equipment analytics and performance insights
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px]">
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Search className="h-10 w-10 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Select Equipment for Analysis</h3>
                    <p className="text-muted-foreground max-w-md">
                      Choose specific equipment to view detailed performance metrics, maintenance history, and predictive analytics.
                    </p>
                  </div>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <Search className="h-5 w-5 mr-2" />
                  Browse Equipment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-8">
          <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Document Expiry Timeline</span>
                <Badge variant="destructive" className="ml-auto">3 Expiring</Badge>
              </CardTitle>
              <CardDescription className="text-base">
                Smart tracking of upcoming document expirations with automated alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px]">
              <DocumentExpiryChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-8">
          <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Advanced Report Builder</span>
                <Badge variant="outline" className="ml-auto">Beta</Badge>
              </CardTitle>
              <CardDescription className="text-base">
                Create, customize, and automate comprehensive analytics reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportBuilder />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Report Preview Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Report Gallery</span>
          </CardTitle>
          <CardDescription className="text-base">
            Preview of your professional analytics reports with export options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "Equipment Status Executive Summary",
                description: "Comprehensive PDF report with executive insights",
                icon: BarChart3,
                preview: "Interactive dashboard showing equipment distribution, performance metrics, and trend analysis",
                color: "from-blue-500 to-cyan-500",
                badge: "PDF"
              },
              {
                title: "Compliance Audit Report",
                description: "Detailed Excel workbook with compliance analytics",
                icon: Shield,
                preview: "Multi-sheet analysis comparing compliance rates, risk assessments, and action items",
                color: "from-green-500 to-emerald-500",
                badge: "Excel"
              }
            ].map((report, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-xl p-6 border border-gray-200/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg bg-gradient-to-r shadow-sm",
                      report.color
                    )}>
                      <report.icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-bold text-lg">{report.title}</h4>
                  </div>
                  <Badge variant="outline" className="bg-white">{report.badge}</Badge>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200/50 mb-4 min-h-[180px] flex items-center justify-center">
                  <p className="text-center text-muted-foreground font-medium leading-relaxed max-w-sm">
                    {report.preview}
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                
                <Button variant="outline" size="sm" className="w-full hover:bg-blue-50">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Export Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-xl p-6 shadow-xl">
        <div>
          <h3 className="text-lg font-bold mb-1">Ready to Export?</h3>
          <p className="text-blue-100">Generate comprehensive reports with all your analytics data</p>
        </div>
        <Button
          onClick={() => console.log("Export all charts")}
          className="bg-white text-slate-900 hover:bg-gray-100 shadow-lg px-6 py-3"
          disabled
          title="Advanced export features coming soon"
        >
          <Download className="h-5 w-5 mr-2" />
          Export All Analytics
        </Button>
      </div>
    </div>
  );
}