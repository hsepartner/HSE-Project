
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Sample data - in a real app, this would come from an API
const data = [
  {
    name: "Heavy Equipment",
    compliant: 12,
    nonCompliant: 3,
  },
  {
    name: "Light Vehicles",
    compliant: 8,
    nonCompliant: 1,
  },
  {
    name: "Power Tools",
    compliant: 3,
    nonCompliant: 1,
  }
];

const chartConfig: ChartConfig = {
  compliant: { 
    label: "Compliant", 
    theme: { light: "#22c55e", dark: "#22c55e" }
  },
  nonCompliant: { 
    label: "Non-Compliant", 
    theme: { light: "#ef4444", dark: "#ef4444" }
  },
};

export function ComplianceOverviewChart() {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="compliant" stackId="a" fill="#22c55e" />
          <Bar dataKey="nonCompliant" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
