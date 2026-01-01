import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";

interface VDNData {
  category: string;
  vdn1: number;
  vdn2: number;
  vdn3: number;
  vdn4: number;
}

// Mock data for VDN distribution
const vdnData: VDNData[] = [
  { category: "Billing", vdn1: 145, vdn2: 98, vdn3: 67, vdn4: 45 },
  { category: "Support", vdn1: 128, vdn2: 112, vdn3: 89, vdn4: 56 },
  { category: "Sales", vdn1: 87, vdn2: 76, vdn3: 54, vdn4: 32 },
  { category: "General", vdn1: 65, vdn2: 54, vdn3: 43, vdn4: 28 },
  { category: "Technical", vdn1: 112, vdn2: 89, vdn3: 67, vdn4: 45 },
];

const COLORS = {
  vdn1: "#8b5cf6",
  vdn2: "#3b82f6",
  vdn3: "#10b981",
  vdn4: "#f59e0b",
};

export function CategoryWiseVDN() {
  const [isLoading, setIsLoading] = useState(false);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="overflow-hidden rounded-md shadow-lg border-0 bg-background/95 backdrop-blur-sm">
          <div className="px-3 py-2 bg-primary text-primary-foreground text-sm font-semibold">
            {label}
          </div>
          <div className="px-3 py-2 text-sm space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{entry.name}:</span>
                <span className="font-semibold text-foreground">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Category-wise VDN Distribution</CardTitle>
          <UITooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Distribution of calls across different VDN (Virtual Dialed Number) channels by category</p>
            </TooltipContent>
          </UITooltip>
        </div>
        <p className="text-sm text-muted-foreground">VDN distribution by call category</p>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vdnData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="vdn1" name="VDN 1" fill={COLORS.vdn1} radius={[4, 4, 0, 0]} />
              <Bar dataKey="vdn2" name="VDN 2" fill={COLORS.vdn2} radius={[4, 4, 0, 0]} />
              <Bar dataKey="vdn3" name="VDN 3" fill={COLORS.vdn3} radius={[4, 4, 0, 0]} />
              <Bar dataKey="vdn4" name="VDN 4" fill={COLORS.vdn4} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
