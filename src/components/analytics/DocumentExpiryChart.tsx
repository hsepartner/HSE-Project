
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Sample data - in a real app, this would come from an API
const data = [
  { name: "Apr", certificates: 2, manuals: 0, inspections: 4 },
  { name: "May", certificates: 5, manuals: 1, inspections: 2 },
  { name: "Jun", certificates: 3, manuals: 0, inspections: 6 },
  { name: "Jul", certificates: 2, manuals: 1, inspections: 3 },
  { name: "Aug", certificates: 4, manuals: 2, inspections: 5 },
  { name: "Sep", certificates: 6, manuals: 0, inspections: 2 },
];

const chartConfig: ChartConfig = {
  certificates: { 
    label: "Certificates", 
    theme: { light: "#3b82f6", dark: "#3b82f6" }
  },
  manuals: { 
    label: "Manuals", 
    theme: { light: "#8b5cf6", dark: "#8b5cf6" }
  },
  inspections: { 
    label: "Inspections", 
    theme: { light: "#f97316", dark: "#f97316" }
  },
};

export function DocumentExpiryChart() {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
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
          <Line 
            type="monotone"
            dataKey="certificates"
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone"
            dataKey="manuals"
            stroke="#8b5cf6"
          />
          <Line 
            type="monotone"
            dataKey="inspections"
            stroke="#f97316"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
