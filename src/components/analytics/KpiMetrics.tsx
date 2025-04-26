
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface KpiMetricsProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

export function KpiMetrics({ dateRange }: KpiMetricsProps) {
  // Sample data - in a real app, this would come from an API
  const metrics = {
    totalEquipment: 28,
    complianceRate: 85,
    pendingApprovals: 4,
    upcomingExpirations: 7
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalEquipment}</div>
          <p className="text-xs text-muted-foreground">
            Active tracking across all categories
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.complianceRate}%</div>
          <p className="text-xs text-muted-foreground">
            Equipment meeting all requirements
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.pendingApprovals}</div>
          <p className="text-xs text-muted-foreground">
            Documents awaiting verification
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Expirations</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.upcomingExpirations}</div>
          <p className="text-xs text-muted-foreground">
            Documents expiring within 30 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
