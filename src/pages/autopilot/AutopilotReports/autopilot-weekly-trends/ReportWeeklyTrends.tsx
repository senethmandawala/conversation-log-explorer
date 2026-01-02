import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CustomChartTooltip } from "@/components/ui/custom-chart-tooltip";

interface WeeklyTrendData {
  week: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  avgDuration: number;
}

// Mock data
const mockTrendData: WeeklyTrendData[] = [
  { week: "Week 1", totalCalls: 2450, successfulCalls: 2200, failedCalls: 250, avgDuration: 125 },
  { week: "Week 2", totalCalls: 2680, successfulCalls: 2450, failedCalls: 230, avgDuration: 118 },
  { week: "Week 3", totalCalls: 2320, successfulCalls: 2100, failedCalls: 220, avgDuration: 132 },
  { week: "Week 4", totalCalls: 2890, successfulCalls: 2650, failedCalls: 240, avgDuration: 115 },
  { week: "Week 5", totalCalls: 3100, successfulCalls: 2850, failedCalls: 250, avgDuration: 108 },
  { week: "Week 6", totalCalls: 2950, successfulCalls: 2720, failedCalls: 230, avgDuration: 112 },
  { week: "Week 7", totalCalls: 3250, successfulCalls: 3000, failedCalls: 250, avgDuration: 105 },
  { week: "Week 8", totalCalls: 3450, successfulCalls: 3200, failedCalls: 250, avgDuration: 102 },
];

interface ReportWeeklyTrendsProps {
  onBack: () => void;
}

export default function ReportWeeklyTrends({ onBack }: ReportWeeklyTrendsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const totalCalls = mockTrendData.reduce((sum, d) => sum + d.totalCalls, 0);
  const avgSuccessRate =
    (mockTrendData.reduce((sum, d) => sum + d.successfulCalls, 0) / totalCalls) * 100;

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-10 w-10 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight">
                Weekly Traffic Trends Report
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Analyze weekly traffic patterns and trends in autopilot usage
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Total Calls</p>
              <p className="text-2xl font-bold mt-1">{totalCalls.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Avg Success Rate</p>
              <p className="text-2xl font-bold mt-1 text-green-500">{avgSuccessRate.toFixed(1)}%</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Peak Week</p>
              <p className="text-2xl font-bold mt-1">Week 8</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Trend</p>
              <p className="text-2xl font-bold mt-1 text-green-500">↑ 12%</p>
            </div>
          </div>

          {/* Chart */}
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalCalls"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Total Calls"
                  />
                  <Line
                    type="monotone"
                    dataKey="successfulCalls"
                    stroke="hsl(142, 71%, 45%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Successful Calls"
                  />
                  <Line
                    type="monotone"
                    dataKey="failedCalls"
                    stroke="hsl(0, 84%, 60%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Failed Calls"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
