
import { useState } from "react";
import { Vendor, VendorContract } from "@/types/vendor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ContractExpiryDashboardProps {
  vendors: Vendor[];
}

export function ContractExpiryDashboard({ vendors }: ContractExpiryDashboardProps) {
  // Extract all contracts from vendors
  const allContracts = vendors.flatMap(vendor => 
    vendor.contracts.map(contract => ({
      ...contract,
      vendorName: vendor.name,
      vendorId: vendor.id
    }))
  );

  // Function to get days until expiry
  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiryDate = new Date(endDate);
    const differenceInTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24));
  };

  // Filter contracts by expiry status
  const expiringContracts = allContracts.filter(contract => {
    const daysUntil = getDaysUntilExpiry(contract.endDate);
    return daysUntil > 0 && daysUntil <= 90 && contract.status === 'active';
  }).sort((a, b) => getDaysUntilExpiry(a.endDate) - getDaysUntilExpiry(b.endDate));

  // Prepare data for chart
  const prepareChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Create an array of the next 12 months
    const nextMonths = Array.from({ length: 12 }, (_, i) => months[(currentMonth + i) % 12]);
    
    // Count contracts expiring in each month
    const contractCounts = nextMonths.map((month, index) => {
      const targetMonth = (currentMonth + index) % 12;
      const targetYear = new Date().getFullYear() + Math.floor((currentMonth + index) / 12);
      
      const count = allContracts.filter(contract => {
        const expiryDate = new Date(contract.endDate);
        return expiryDate.getMonth() === targetMonth && expiryDate.getFullYear() === targetYear;
      }).length;
      
      return { month, count };
    });
    
    return contractCounts;
  };

  const chartData = prepareChartData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contracts Expiring Soon</CardTitle>
            <CardDescription>
              Contracts expiring in the next 90 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expiringContracts.length > 0 ? (
                <div className="space-y-3">
                  {expiringContracts.slice(0, 5).map(contract => {
                    const daysUntil = getDaysUntilExpiry(contract.endDate);
                    return (
                      <div 
                        key={contract.id} 
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-medium text-sm truncate">{contract.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {contract.vendorName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={daysUntil <= 30 ? "destructive" : "outline"}>
                            {daysUntil} days
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {expiringContracts.length > 5 && (
                    <Button variant="outline" className="w-full text-sm h-8">
                      View {expiringContracts.length - 5} more
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle className="h-10 w-10 text-status-valid mb-3" />
                  <p className="text-muted-foreground">
                    No contracts expiring in the next 90 days
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contract Expiry Forecast</CardTitle>
            <CardDescription>
              Number of contracts expiring in the next 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Expiring Contracts" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Contract Renewal Status</CardTitle>
          <CardDescription>
            Overview of all contract statuses and renewal tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4 flex flex-col items-center">
              <div className="bg-green-500/10 text-green-500 p-3 rounded-full mb-3">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">
                {allContracts.filter(c => c.status === 'active').length}
              </h3>
              <p className="text-sm text-muted-foreground">Active Contracts</p>
            </div>
            
            <div className="bg-card border rounded-lg p-4 flex flex-col items-center">
              <div className="bg-status-urgent/10 text-status-urgent p-3 rounded-full mb-3">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">
                {expiringContracts.length}
              </h3>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
            </div>
            
            <div className="bg-card border rounded-lg p-4 flex flex-col items-center">
              <div className="bg-status-expired/10 text-status-expired p-3 rounded-full mb-3">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">
                {allContracts.filter(c => c.status === 'expired').length}
              </h3>
              <p className="text-sm text-muted-foreground">Expired Contracts</p>
            </div>
            
            <div className="bg-card border rounded-lg p-4 flex flex-col items-center">
              <div className="bg-status-inactive/10 text-status-inactive p-3 rounded-full mb-3">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">
                {allContracts.filter(c => c.renewalReminder).length}
              </h3>
              <p className="text-sm text-muted-foreground">With Reminders</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
