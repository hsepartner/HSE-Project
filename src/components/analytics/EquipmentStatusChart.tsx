
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Sample data - in a real app, this would come from an API
const data = [
  { name: "Active", value: 23, fill: "#22c55e" },
  { name: "Maintenance", value: 4, fill: "#eab308" },
  { name: "Decommissioned", value: 1, fill: "#6b7280" }
];

const chartConfig: ChartConfig = {
  active: { label: "Active", theme: { light: "#22c55e", dark: "#22c55e" } },
  maintenance: { label: "Maintenance", theme: { light: "#eab308", dark: "#eab308" } },
  decommissioned: { label: "Decommissioned", theme: { light: "#6b7280", dark: "#6b7280" } },
};

export function EquipmentStatusChart() {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
