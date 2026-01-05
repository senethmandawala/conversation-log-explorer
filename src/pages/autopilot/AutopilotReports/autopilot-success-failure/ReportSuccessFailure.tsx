import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Filter, ChevronDown } from "lucide-react";
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
import { CustomChartTooltip } from "@/components/ui/custom-chart-tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { DateRangeFilter } from "@/components/conversation/DateRangeFilter";
import { DateRangeValue } from "@/types/conversation";

interface SuccessFailureData {
  month: string;
  successRate: number;
  failureRate: number;
}

// Mock data - monthly success/failure rates
const mockData: SuccessFailureData[] = [
  { month: "Jan", successRate: 78, failureRate: 22 },
  { month: "Feb", successRate: 82, failureRate: 18 },
  { month: "Mar", successRate: 85, failureRate: 15 },
  { month: "Apr", successRate: 79, failureRate: 21 },
  { month: "May", successRate: 88, failureRate: 12 },
  { month: "Jun", successRate: 92, failureRate: 8 },
  { month: "Jul", successRate: 87, failureRate: 13 },
  { month: "Aug", successRate: 91, failureRate: 9 },
  { month: "Sep", successRate: 89, failureRate: 11 },
  { month: "Oct", successRate: 94, failureRate: 6 },
  { month: "Nov", successRate: 90, failureRate: 10 },
  { month: "Dec", successRate: 93, failureRate: 7 },
];

interface ReportSuccessFailureProps {
  onBack: () => void;
}

export default function ReportSuccessFailure({ onBack }: ReportSuccessFailureProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

  useEffect(() => {
    // Update filter count
    setNumberOfFilters(dateRange ? 1 : 0);
  }, [dateRange]);

  const avgSuccessRate = (mockData.reduce((sum, d) => sum + d.successRate, 0) / mockData.length).toFixed(1);
  const avgFailureRate = (mockData.reduce((sum, d) => sum + d.failureRate, 0) / mockData.length).toFixed(1);

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
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/5 border border-pink-500/20 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Success & Failure Rate Report
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Track success and failure rates over time
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
                <LineChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis 
                    className="text-xs" 
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    content={<CustomChartTooltip />}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="successRate"
                    stroke="#4CAF50"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Success Rate"
                  />
                  <Line
                    type="monotone"
                    dataKey="failureRate"
                    stroke="#F44336"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Failure Rate"
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
