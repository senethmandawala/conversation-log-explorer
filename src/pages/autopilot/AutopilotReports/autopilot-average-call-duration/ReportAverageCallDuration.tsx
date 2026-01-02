import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CustomChartTooltip } from "@/components/ui/custom-chart-tooltip";

interface CallDurationData {
  category: string;
  avgDuration: number;
  callCount: number;
}

// Mock data
const mockDurationData: CallDurationData[] = [
  { category: "Balance Inquiry", avgDuration: 45, callCount: 1250 },
  { category: "Fund Transfer", avgDuration: 120, callCount: 890 },
  { category: "Bill Payment", avgDuration: 90, callCount: 756 },
  { category: "Card Services", avgDuration: 150, callCount: 432 },
  { category: "Loan Queries", avgDuration: 180, callCount: 321 },
  { category: "Account Opening", avgDuration: 240, callCount: 234 },
  { category: "Technical Support", avgDuration: 200, callCount: 189 },
  { category: "Complaints", avgDuration: 300, callCount: 145 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(221, 83%, 53%)",
  "hsl(262, 83%, 58%)",
  "hsl(339, 82%, 51%)",
];

interface ReportAverageCallDurationProps {
  onBack: () => void;
}

export default function ReportAverageCallDuration({ onBack }: ReportAverageCallDurationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const overallAvg =
    mockDurationData.reduce((sum, d) => sum + d.avgDuration * d.callCount, 0) /
    mockDurationData.reduce((sum, d) => sum + d.callCount, 0);

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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/5 border border-indigo-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight">
                Average Call Duration Report
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Analyze call duration statistics and trends for autopilot conversations
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Overall Avg Duration</p>
              <p className="text-2xl font-bold mt-1">{formatDuration(Math.round(overallAvg))}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Total Calls</p>
              <p className="text-2xl font-bold mt-1">
                {mockDurationData.reduce((sum, d) => sum + d.callCount, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold mt-1">{mockDurationData.length}</p>
            </div>
          </div>

          {/* Chart */}
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockDurationData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis
                    type="number"
                    tickFormatter={(value) => formatDuration(value)}
                    className="text-xs"
                  />
                  <YAxis
                    dataKey="category"
                    type="category"
                    width={90}
                    className="text-xs"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as CallDurationData;
                        return (
                          <CustomChartTooltip
                            label={data.category}
                            payload={[
                              {
                                name: "Avg Duration",
                                value: formatDuration(data.avgDuration),
                                color: payload[0].color,
                              },
                              {
                                name: "Call Count",
                                value: data.callCount.toLocaleString(),
                                color: "hsl(var(--muted-foreground))",
                              },
                            ]}
                          />
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="avgDuration" radius={[0, 4, 4, 0]}>
                    {mockDurationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
