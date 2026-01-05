import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Coins, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
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
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { CustomChartTooltip } from "@/components/ui/custom-chart-tooltip";
import { DateRangeFilter } from "@/components/conversation/DateRangeFilter";
import { DateRangeValue } from "@/types/conversation";

interface TokenUsageData {
  month: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

// Mock data - monthly token usage matching Angular
const mockTokenData: TokenUsageData[] = [
  { month: "Jan", inputTokens: 12500, outputTokens: 8200, totalTokens: 20700 },
  { month: "Feb", inputTokens: 15200, outputTokens: 9800, totalTokens: 25000 },
  { month: "Mar", inputTokens: 18400, outputTokens: 11500, totalTokens: 29900 },
  { month: "Apr", inputTokens: 14800, outputTokens: 9200, totalTokens: 24000 },
  { month: "May", inputTokens: 21000, outputTokens: 13500, totalTokens: 34500 },
  { month: "Jun", inputTokens: 19500, outputTokens: 12800, totalTokens: 32300 },
  { month: "Jul", inputTokens: 23400, outputTokens: 15200, totalTokens: 38600 },
  { month: "Aug", inputTokens: 25100, outputTokens: 16400, totalTokens: 41500 },
  { month: "Sep", inputTokens: 22800, outputTokens: 14900, totalTokens: 37700 },
  { month: "Oct", inputTokens: 28500, outputTokens: 18600, totalTokens: 47100 },
  { month: "Nov", inputTokens: 26200, outputTokens: 17100, totalTokens: 43300 },
  { month: "Dec", inputTokens: 31000, outputTokens: 20200, totalTokens: 51200 },
];

interface ReportTokenUsageProps {
  onBack: () => void;
}

export default function ReportTokenUsage({ onBack }: ReportTokenUsageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

  useEffect(() => {
    // Update filter count
    setNumberOfFilters(dateRange ? 1 : 0);
  }, [dateRange]);

  const totalTokens = mockTokenData.reduce((sum, d) => sum + d.totalTokens, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border/30">
          <div className="flex items-center justify-between">
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
                  Monitor token consumption over time
                </p>
              </div>
            </div>
            <Button
              variant={filtersOpen ? "default" : "outline"}
              size="icon"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="relative h-9 w-9"
            >
              <Filter className="h-4 w-4" />
              {numberOfFilters > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {numberOfFilters}
                </Badge>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Collapsible Filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="min-w-[200px]">
                  <DateRangeFilter 
                    value={dateRange} 
                    onChange={setDateRange} 
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Chart */}
          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTokenData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis 
                    className="text-xs" 
                    tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
                  />
                  <Tooltip 
                    content={<CustomChartTooltip />}
                    formatter={(value: number) => [`${value.toLocaleString()} tokens`, '']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="inputTokens"
                    stroke="#2196F3"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Input Tokens"
                  />
                  <Line
                    type="monotone"
                    dataKey="outputTokens"
                    stroke="#FF9800"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Output Tokens"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalTokens"
                    stroke="#9C27B0"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Total Tokens"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
