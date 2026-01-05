import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Filter } from "lucide-react";
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
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { DateRangeFilter } from "@/components/conversation/DateRangeFilter";
import { DateRangeValue } from "@/types/conversation";

interface CallDurationData {
  date: string;
  balanceInquiry: number;
  fundTransfer: number;
  billPayment: number;
  cardServices: number;
}

// Mock data - daily average call duration by category
const mockDurationData: CallDurationData[] = [
  { date: "Jan 1", balanceInquiry: 45, fundTransfer: 120, billPayment: 90, cardServices: 150 },
  { date: "Jan 2", balanceInquiry: 48, fundTransfer: 115, billPayment: 95, cardServices: 145 },
  { date: "Jan 3", balanceInquiry: 42, fundTransfer: 125, billPayment: 88, cardServices: 155 },
  { date: "Jan 4", balanceInquiry: 50, fundTransfer: 118, billPayment: 92, cardServices: 148 },
  { date: "Jan 5", balanceInquiry: 44, fundTransfer: 122, billPayment: 85, cardServices: 152 },
  { date: "Jan 6", balanceInquiry: 46, fundTransfer: 110, billPayment: 98, cardServices: 140 },
  { date: "Jan 7", balanceInquiry: 40, fundTransfer: 128, billPayment: 82, cardServices: 158 },
];

const COLORS = ["#0C3DBE", "#E57373", "#66BB6A", "#FFCA28"];

interface ReportAverageCallDurationProps {
  onBack: () => void;
}

export default function ReportAverageCallDuration({ onBack }: ReportAverageCallDurationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

  useEffect(() => {
    // Update filter count
    setNumberOfFilters(dateRange ? 1 : 0);
  }, [dateRange]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
  };

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
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/5 border border-indigo-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Average Call Duration Report
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Analyze category-wise average call duration over time
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
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockDurationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis
                    className="text-xs"
                    tickFormatter={(value) => `${value}s`}
                    label={{ value: 'Average Duration (seconds)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <Tooltip
                    content={<CustomChartTooltip />}
                    formatter={(value: number) => [formatDuration(value), '']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balanceInquiry"
                    stroke={COLORS[0]}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Balance Inquiry"
                  />
                  <Line
                    type="monotone"
                    dataKey="fundTransfer"
                    stroke={COLORS[1]}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Fund Transfer"
                  />
                  <Line
                    type="monotone"
                    dataKey="billPayment"
                    stroke={COLORS[2]}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Bill Payment"
                  />
                  <Line
                    type="monotone"
                    dataKey="cardServices"
                    stroke={COLORS[3]}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Card Services"
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
