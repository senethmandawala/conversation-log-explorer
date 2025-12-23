import { useState } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

const mockData = [
  { agent: "Agent A", handled: 45, resolved: 38 },
  { agent: "Agent B", handled: 42, resolved: 35 },
  { agent: "Agent C", handled: 38, resolved: 32 },
  { agent: "Lisa Anderson", handled: 32, resolved: 28 },
  { agent: "Agent E", handled: 32, resolved: 26 },
  { agent: "Agent F", handled: 28, resolved: 22 },
];

const CustomBarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-lg space-y-1">
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm flex-shrink-0" 
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-sm font-medium text-foreground">
              {item.name}: <span className="font-semibold">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function AgentRepeatCallHandling() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="border-t border-border/30 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h5 className="text-base font-semibold">Agent Repeat Call Handling</h5>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Agent performance on handling repeat calls</p>
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
          <BarChart 
            data={mockData} 
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
            <XAxis 
              dataKey="agent" 
              className="text-xs" 
              axisLine={false} 
              tickLine={false}
            />
            <YAxis 
              className="text-xs" 
              axisLine={false} 
              tickLine={false}
            />
            <RechartsTooltip content={<CustomBarTooltip />} />
            <Bar dataKey="handled" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Handled" />
            <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} name="Resolved" />
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
