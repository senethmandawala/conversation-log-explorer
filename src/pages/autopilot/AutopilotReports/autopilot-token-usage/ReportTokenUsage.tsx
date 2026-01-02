import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Coins } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomChartTooltip } from "@/components/ui/custom-chart-tooltip";

interface TokenUsageData {
  date: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
}

// Mock data
const mockTokenData: TokenUsageData[] = [
  { date: "Jan 1", inputTokens: 125000, outputTokens: 85000, totalTokens: 210000, cost: 4.2 },
  { date: "Jan 2", inputTokens: 142000, outputTokens: 92000, totalTokens: 234000, cost: 4.68 },
  { date: "Jan 3", inputTokens: 118000, outputTokens: 78000, totalTokens: 196000, cost: 3.92 },
  { date: "Jan 4", inputTokens: 156000, outputTokens: 98000, totalTokens: 254000, cost: 5.08 },
  { date: "Jan 5", inputTokens: 135000, outputTokens: 88000, totalTokens: 223000, cost: 4.46 },
  { date: "Jan 6", inputTokens: 98000, outputTokens: 65000, totalTokens: 163000, cost: 3.26 },
  { date: "Jan 7", inputTokens: 82000, outputTokens: 52000, totalTokens: 134000, cost: 2.68 },
];

interface ModelUsage {
  model: string;
  tokens: number;
  percentage: number;
  cost: number;
}

const modelUsage: ModelUsage[] = [
  { model: "GPT-4", tokens: 450000, percentage: 35, cost: 13.5 },
  { model: "GPT-3.5-Turbo", tokens: 520000, percentage: 40, cost: 1.04 },
  { model: "Claude-3", tokens: 320000, percentage: 25, cost: 9.6 },
];

interface ReportTokenUsageProps {
  onBack: () => void;
}

export default function ReportTokenUsage({ onBack }: ReportTokenUsageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const totalTokens = mockTokenData.reduce((sum, d) => sum + d.totalTokens, 0);
  const totalCost = mockTokenData.reduce((sum, d) => sum + d.cost, 0);
  const avgDaily = totalTokens / mockTokenData.length;

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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 border border-cyan-500/20 flex items-center justify-center">
              <Coins className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight">
                Token Usage Report
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track AI token consumption and costs across autopilot services
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Total Tokens</p>
              <p className="text-2xl font-bold mt-1">{(totalTokens / 1000000).toFixed(2)}M</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold mt-1">${totalCost.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Avg Daily Tokens</p>
              <p className="text-2xl font-bold mt-1">{(avgDaily / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Cost per 1K Tokens</p>
              <p className="text-2xl font-bold mt-1">${((totalCost / totalTokens) * 1000).toFixed(4)}</p>
            </div>
          </div>

          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <>
              {/* Area Chart */}
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockTokenData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="inputTokens"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                      name="Input Tokens"
                    />
                    <Area
                      type="monotone"
                      dataKey="outputTokens"
                      stackId="1"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.6}
                      name="Output Tokens"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Model Usage Table */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Usage by Model</h3>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Model</TableHead>
                        <TableHead>Tokens Used</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modelUsage.map((row) => (
                        <TableRow key={row.model} className="hover:bg-muted/20">
                          <TableCell className="font-medium">{row.model}</TableCell>
                          <TableCell>{(row.tokens / 1000).toFixed(0)}K</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${row.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm">{row.percentage}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">${row.cost.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
