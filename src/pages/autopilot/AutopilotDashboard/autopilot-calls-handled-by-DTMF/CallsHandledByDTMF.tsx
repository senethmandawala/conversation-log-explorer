import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

// Mock data for main chart
const mainChartData: ChartDataItem[] = [
  { name: "Payment Options", value: 145, color: "#22c55e" },
  { name: "Account Balance", value: 98, color: "#3b82f6" },
  { name: "Service Status", value: 76, color: "#eab308" },
  { name: "Appointment Booking", value: 54, color: "#8b5cf6" },
  { name: "General Queries", value: 32, color: "#06b6d4" },
  { name: "Technical Support", value: 28, color: "#f97316" },
];

export function CallsHandledByDTMF() {
  const [isLoading, setIsLoading] = useState(false);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = mainChartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(0);
      
      return (
        <div className="overflow-hidden rounded-md shadow-lg border-0" style={{ minWidth: 120 }}>
          <div 
            className="text-sm font-semibold px-3 py-2" 
            style={{ backgroundColor: data.color, color: "white" }}
          >
            {data.name}
          </div>
          <div className="bg-muted px-3 py-2 text-sm space-y-0.5">
            <div className="text-muted-foreground">Count: <span className="font-semibold text-foreground">{data.value}</span></div>
            <div className="text-muted-foreground">Percentage: <span className="font-semibold text-foreground">{percentage}%</span></div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
        style={{ fontSize: '10px', fontWeight: 600 }}
      >
        {value}
      </text>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Calls Handled by DTMF</CardTitle>
          <UITooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Distribution of calls handled through DTMF input</p>
            </TooltipContent>
          </UITooltip>
        </div>
        <p className="text-sm text-muted-foreground">Distribution of calls handled through DTMF input</p>
      </CardHeader>
      
      <CardContent>
        <div className="relative">
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mainChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {mainChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
