import { useState } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const mockData = [
  { reason: "Technical Issue", count: 45, fill: COLORS[0] },
  { reason: "Billing Query", count: 38, fill: COLORS[1] },
  { reason: "Service Request", count: 32, fill: COLORS[2] },
  { reason: "Product Info", count: 28, fill: COLORS[3] },
  { reason: "Complaint", count: 22, fill: COLORS[4] },
];

export function ReasonWiseRepeatCall() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="border-t border-border/30 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h5 className="text-base font-semibold">Reason-wise Repeat Call</h5>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Distribution of repeat calls by reason</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-sm text-muted-foreground">Jun 19 - Jun 25, 2025</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : mockData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
            <XAxis 
              dataKey="reason" 
              className="text-xs" 
              axisLine={false} 
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              className="text-xs" 
              axisLine={false} 
              tickLine={false}
            />
            <RechartsTooltip content={<BarChartTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
}
