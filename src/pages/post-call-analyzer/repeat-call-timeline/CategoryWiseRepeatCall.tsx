import { useState } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";

const mockData = [
  { category: "Billing", repeatCalls: 52, totalCalls: 120 },
  { category: "Technical", repeatCalls: 45, totalCalls: 98 },
  { category: "Account", repeatCalls: 38, totalCalls: 85 },
  { category: "Service", repeatCalls: 32, totalCalls: 76 },
  { category: "General Inquiry", repeatCalls: 18, totalCalls: 95 },
];

export function CategoryWiseRepeatCall() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="border-t border-border/30 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h5 className="text-base font-semibold">Category-wise Repeat Calls</h5>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Repeat calls distribution across categories</p>
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
              dataKey="category" 
              className="text-xs" 
              axisLine={false} 
              tickLine={false}
            />
            <YAxis 
              className="text-xs" 
              axisLine={false} 
              tickLine={false}
            />
            <RechartsTooltip content={<BarChartTooltip />} />
            <Bar dataKey="repeatCalls" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Repeat Calls" />
            <Bar dataKey="totalCalls" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Total Calls" />
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
