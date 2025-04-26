
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Sample data - in a real app, this would come from an API
const data = [
  { month: "Jan", completed: 4, scheduled: 2 },
  { month: "Feb", completed: 5, scheduled: 3 },
  { month: "Mar", completed: 3, scheduled: 4 },
  { month: "Apr", completed: 6, scheduled: 3 },
  { month: "May", completed: 4, scheduled: 5 },
  { month: "Jun", completed: 5, scheduled: 6 },
  { month: "Jul", completed: 7, scheduled: 4 },
  { month: "Aug", completed: 0, scheduled: 6 },
  { month: "Sep", completed: 0, scheduled: 5 },
  { month: "Oct", completed: 0, scheduled: 4 },
  { month: "Nov", completed: 0, scheduled: 7 },
  { month: "Dec", completed: 0, scheduled: 5 },
];

const chartConfig: ChartConfig = {
  completed: { 
    label: "Completed", 
    theme: { light: "#22c55e", dark: "#22c55e" }
  },
  scheduled: { 
    label: "Scheduled", 
    theme: { light: "#3b82f6", dark: "#3b82f6" }
  },
};

export function MaintenanceTimelineChart() {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Area 
            type="monotone" 
            dataKey="completed" 
            stackId="1"
            stroke="#22c55e" 
            fill="#22c55e" 
            fillOpacity={0.5}
          />
          <Area 
            type="monotone" 
            dataKey="scheduled" 
            stackId="1"
            stroke="#3b82f6" 
            fill="#3b82f6" 
            fillOpacity={0.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
