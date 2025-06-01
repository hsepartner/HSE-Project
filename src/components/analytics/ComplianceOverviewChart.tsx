import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, Truck, Wrench, Settings, Download } from "lucide-react";

// Enhanced data with additional properties
const data = [
  {
    name: "Heavy Equipment",
    compliant: 12,
    nonCompliant: 3,
    icon: Truck,
    complianceRate: 80,
    category: "heavy",
    trend: "up", // Added trend indicator
    previousComplianceRate: 75
  },
  {
    name: "Light Vehicles",
    compliant: 8,
    nonCompliant: 1,
    icon: Settings,
    complianceRate: 89,
    category: "light",
    trend: "down",
    previousComplianceRate: 92
  },
  {
    name: "Power Tools",
    compliant: 3,
    nonCompliant: 1,
    icon: Wrench,
    complianceRate: 75,
    category: "tools",
    trend: "stable",
    previousComplianceRate: 75
  }
];

const chartConfig: ChartConfig = {
  compliant: {
    label: "Compliant",
    theme: { light: "#22c55e", dark: "#16a34a" }
  },
  nonCompliant: {
    label: "Non-Compliant",
    theme: { light: "#ef4444", dark: "#dc2626" }
  },
};

// Calculate overall statistics
const totalCompliant = data.reduce((sum, item) => sum + item.compliant, 0);
const totalNonCompliant = data.reduce((sum, item) => sum + item.nonCompliant, 0);
const totalItems = totalCompliant + totalNonCompliant;
const overallComplianceRate = totalItems > 0 ? ((totalCompliant / totalItems) * 100).toFixed(1) : '0';

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const compliant = payload.find((p: any) => p.dataKey === 'compliant')?.value || 0;
    const nonCompliant = payload.find((p: any) => p.dataKey === 'nonCompliant')?.value || 0;
    const total = compliant + nonCompliant;
    const rate = total > 0 ? ((compliant / total) * 100).toFixed(1) : '0';
    
    return (
      <div className="p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-opacity-90">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Compliant</span>
            </div>
            <span className="font-medium text-green-600">{compliant}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Non-Compliant</span>
            </div>
            <span className="font-medium text-red-600">{nonCompliant}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Compliance Rate</span>
              <span className={`font-bold ${parseFloat(rate) >= 90 ? 'text-green-600' : parseFloat(rate) >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                {rate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Category summary cards
const CategorySummary = ({ onCategoryClick }: { onCategoryClick: (category: string) => void }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {data.map((item) => {
        const IconComponent = item.icon;
        const total = item.compliant + item.nonCompliant;
        const rate = total > 0 ? ((item.compliant / total) * 100).toFixed(0) : '0';
        const trendIcon = item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "→";
        
        return (
          <button
            key={item.name}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
            onClick={() => onCategoryClick(item.category)}
            aria-label={`View details for ${item.name}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <IconComponent className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {total} total items
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Compliant</span>
                <span className="font-medium text-green-600">{item.compliant}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Non-Compliant</span>
                <span className="font-medium text-red-600">{item.nonCompliant}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Rate</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={parseFloat(rate) >= 90 ? "default" : parseFloat(rate) >= 75 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {rate}%
                    </Badge>
                    <span className={`text-xs ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                      {trendIcon}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// Overall compliance status
const ComplianceStatus = () => {
  const criticalItems = data.filter(item => {
    const total = item.compliant + item.nonCompliant;
    const rate = total > 0 ? (item.compliant / total) * 100 : 0;
    return rate < 80;
  });

  if (criticalItems.length === 0) {
    return (
      <div className="p-4 rounded-lg border-l-4 border-green-400 bg-opacity-90">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-200">
              Excellent Compliance Status
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              All equipment categories meet compliance standards (≥80%).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border-l-4 border-yellow-400 bg-opacity-90">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        <p className="font-semibold text-yellow-800 dark:text-yellow-200">
          Compliance Action Required
        </p>
      </div>
      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
        The following categories require immediate attention:
      </p>
      <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
        {criticalItems.map(item => {
          const total = item.compliant + item.nonCompliant;
          const rate = total > 0 ? ((item.compliant / total) * 100).toFixed(0) : '0';
          return (
            <li key={item.name} className="flex justify-between">
              <span>• {item.name}</span>
              <span className="font-medium">{rate}% compliant</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Export data to CSV
const exportToCSV = () => {
  const headers = ["Category", "Compliant", "Non-Compliant", "Compliance Rate", "Trend"];
  const rows = data.map(item => [
    item.name,
    item.compliant,
    item.nonCompliant,
    `${item.complianceRate}%`,
    item.trend
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "compliance_report.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function ComplianceOverviewChart() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // Placeholder for drill-down logic
    console.log(`Selected category: ${category}`);
  };

  if (!data || data.length === 0) {
    return (
      <Card className="w-full bg-transparent border-none">
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-transparent border-none">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Overall: {overallComplianceRate}%
            </Badge>
            <Badge 
              variant={parseFloat(overallComplianceRate) >= 90 ? "default" : parseFloat(overallComplianceRate) >= 75 ? "secondary" : "destructive"}
            >
              {totalItems} Total Items
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            aria-label="Export compliance data to CSV"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <CategorySummary onCategoryClick={handleCategoryClick} />
        
        <ChartContainer config={chartConfig} className="h-80 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              onClick={(event: any) => {
                if (event?.activePayload?.[0]?.payload?.category) {
                  handleCategoryClick(event.activePayload[0].payload.category);
                }
              }}
              aria-label="Compliance bar chart"
            >
              <defs>
                <linearGradient id="compliantGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.9} />
                </linearGradient>
                <linearGradient id="nonCompliantGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                aria-label="Category axis"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                aria-label="Count axis"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
                aria-label="Chart legend"
              />
              <Bar 
                dataKey="compliant" 
                stackId="a" 
                fill="url(#compliantGradient)"
                radius={[0, 0, 4, 4]}
                name="Compliant"
                role="img"
                aria-label="Compliant items"
              />
              <Bar 
                dataKey="nonCompliant" 
                stackId="a" 
                fill="url(#nonCompliantGradient)"
                radius={[4, 4, 0, 0]}
                name="Non-Compliant"
                role="img"
                aria-label="Non-compliant items"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ComplianceStatus />
        
        {selectedCategory && (
          <div className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-opacity-90">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selected category: {data.find(item => item.category === selectedCategory)?.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Details for {selectedCategory} will be displayed here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}