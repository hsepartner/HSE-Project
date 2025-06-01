import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, AlertTriangle, UserX, Wrench, Settings } from "lucide-react";

// Enhanced data with additional properties
const data = [
  { 
    name: "Active", 
    value: 5, 
    fill: "#22c55e",
    gradient: "url(#activeGradient)",
    icon: UserCheck,
    description: "Operators cleared for duty"
  },
  { 
    name: "Requires Review", 
    value: 2, 
    fill: "#eab308",
    gradient: "url(#requiresReviewGradient)",
    icon: AlertTriangle,
    description: "Operators pending certification review"
  },
  { 
    name: "Inactive", 
    value: 0, 
    fill: "#6b7280",
    gradient: "url(#inactiveGradient)",
    icon: UserX,
    description: "Operators not currently available"
  }
];

const chartConfig: ChartConfig = {
  active: { label: "Active", theme: { light: "#22c55e", dark: "#16a34a" } },
  requiresReview: { label: "Requires Review", theme: { light: "#eab308", dark: "#ca8a04" } },
  inactive: { label: "Inactive", theme: { light: "#6b7280", dark: "#52525b" } },
};

// Filter out zero values for display
const displayData = data.filter(item => item.value > 0);

// Custom label component for better positioning
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Hide labels for very small slices

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-sm font-medium drop-shadow-lg"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Custom tooltip content
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const IconComponent = data.icon;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <IconComponent className="w-4 h-4" style={{ color: data.fill }} />
          <span className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</span>
        </div>
        <p className="text-2xl font-bold mb-1" style={{ color: data.fill }}>
          {data.value} {data.value === 1 ? 'operator' : 'operators'}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{data.description}</p>
      </div>
    );
  }
  return null;
};

// Stats summary component
const StatsSummary = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {data.map((item) => {
        const IconComponent = item.icon;
        const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
        
        return (
          <div key={item.name} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${item.fill}20` }}
              >
                <IconComponent className="w-6 h-6" style={{ color: item.fill }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {item.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {item.name}
            </div>
            <Badge variant="secondary" className="text-xs">
              {percentage}%
            </Badge>
          </div>
        );
      })}
    </div>
  );
};

// Certification status indicator
const CertificationAlert = () => {
  const requiresReview = data.find(item => item.name === "Requires Review")?.value || 0;
  
  if (requiresReview === 0) {
    return (
      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>All Clear:</strong> All operators have current certifications.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Action Required:</strong> {requiresReview} {requiresReview === 1 ? 'operator needs' : 'operators need'} certification review.
        </p>
      </div>
    </div>
  );
};

export function OperatorsStatusChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const activeOperators = data.find(item => item.name === "Active")?.value || 0;

  return (
    <Card className="w-full bg-transparent border-none">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <Badge variant="outline">
            {total} Total Operators
          </Badge>
        </div>

        <StatsSummary />
        
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="requiresReviewGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#eab308" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ca8a04" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="inactiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity={1} />
                  <stop offset="100%" stopColor="#52525b" stopOpacity={1} />
                </linearGradient>
              </defs>
              
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={120}
                innerRadius={70}
                paddingAngle={displayData.length > 1 ? 3 : 0}
                dataKey="value"
                stroke="white"
                strokeWidth={2}
              >
                {displayData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.gradient}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Additional insights */}
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Quick Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {activeOperators} operators ready for deployment
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {total > 0 ? ((activeOperators / total) * 100).toFixed(0) : '0'}% workforce availability
                </span>
              </div>
            </div>
          </div>

          {/* Certification status alert */}
          <CertificationAlert />
        </div>
      </CardContent>
    </Card>
  );
}