import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3 } from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CustomChartTooltip } from "@/components/ui/custom-chart-tooltip";

interface SuccessFailureData {
  category: string;
  success: number;
  failure: number;
  total: number;
}

// Mock data
const mockData: SuccessFailureData[] = [
  { category: "Balance Inquiry", success: 1150, failure: 100, total: 1250 },
  { category: "Fund Transfer", success: 780, failure: 110, total: 890 },
  { category: "Bill Payment", success: 680, failure: 76, total: 756 },
  { category: "Card Services", success: 380, failure: 52, total: 432 },
  { category: "Loan Queries", success: 275, failure: 46, total: 321 },
  { category: "Account Opening", success: 198, failure: 36, total: 234 },
];

const overallData = [
  { name: "Success", value: mockData.reduce((sum, d) => sum + d.success, 0), fill: "hsl(142, 71%, 45%)" },
  { name: "Failure", value: mockData.reduce((sum, d) => sum + d.failure, 0), fill: "hsl(0, 84%, 60%)" },
];

interface ReportSuccessFailureProps {
  onBack: () => void;
}

export default function ReportSuccessFailure({ onBack }: ReportSuccessFailureProps) {
  const [isLoading, setIsLoading] = useState(false);

  const totalCalls = mockData.reduce((sum, d) => sum + d.total, 0);
  const totalSuccess = mockData.reduce((sum, d) => sum + d.success, 0);
  const successRate = ((totalSuccess / totalCalls) * 100).toFixed(1);

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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/5 border border-pink-500/20 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight">
                Success/Failure Rate Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Monitor success and failure rates over time for autopilot interactions
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Total Interactions</p>
              <p className="text-2xl font-bold mt-1">{totalCalls.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold mt-1 text-green-500">{successRate}%</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Successful</p>
              <p className="text-2xl font-bold mt-1 text-green-500">{totalSuccess.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold mt-1 text-red-500">{(totalCalls - totalSuccess).toLocaleString()}</p>
            </div>
          </div>

          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bar Chart */}
              <div className="lg:col-span-2 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="category"
                      className="text-xs"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend />
                    <Bar dataKey="success" fill="hsl(142, 71%, 45%)" name="Success" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="failure" fill="hsl(0, 84%, 60%)" name="Failure" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overallData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {overallData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
