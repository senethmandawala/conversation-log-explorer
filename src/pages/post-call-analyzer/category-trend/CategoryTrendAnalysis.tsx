import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowLeft, Filter, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data for the line chart
const mockChartData = [
  { date: "2024-01-01", Billing: 45, Technical: 32, Sales: 28, Complaints: 15, General: 20 },
  { date: "2024-01-02", Billing: 52, Technical: 38, Sales: 31, Complaints: 18, General: 25 },
  { date: "2024-01-03", Billing: 48, Technical: 42, Sales: 35, Complaints: 22, General: 28 },
  { date: "2024-01-04", Billing: 61, Technical: 45, Sales: 38, Complaints: 20, General: 30 },
  { date: "2024-01-05", Billing: 55, Technical: 48, Sales: 42, Complaints: 25, General: 32 },
  { date: "2024-01-06", Billing: 58, Technical: 51, Sales: 45, Complaints: 28, General: 35 },
  { date: "2024-01-07", Billing: 63, Technical: 55, Sales: 48, Complaints: 30, General: 38 },
  { date: "2024-01-08", Billing: 67, Technical: 58, Sales: 52, Complaints: 32, General: 40 },
  { date: "2024-01-09", Billing: 70, Technical: 62, Sales: 55, Complaints: 35, General: 42 },
  { date: "2024-01-10", Billing: 65, Technical: 59, Sales: 50, Complaints: 33, General: 39 },
];

const CHART_COLORS = [
  "#8b5cf6", // purple
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
];

export default function CategoryTrendAnalysis() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();
  const [loading, setLoading] = useState(false);
  const [panelOpenState, setPanelOpenState] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [selectedCallType, setSelectedCallType] = useState<string>("");
  const [chartData, setChartData] = useState(mockChartData);
  const [emptyData, setEmptyData] = useState(false);

  useEffect(() => {
    setShowModuleTabs(true);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  useEffect(() => {
    let count = 0;
    if (selectedCallType) count++;
    setNumberOfFilters(count);
  }, [selectedCallType]);

  const toggleFilters = () => {
    setPanelOpenState(!panelOpenState);
  };

  const searchFilterData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const categories = ["Billing", "Technical", "Sales", "Complaints", "General"];

  return (
    <>
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/post-call-analyzer/reports")}
                  className="h-9 w-9 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Category Trend Analysis
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track call volume trends across different categories over time
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={panelOpenState ? "default" : "outline"}
                  size="icon"
                  onClick={toggleFilters}
                  className="relative h-9 w-9"
                >
                  <Filter className="h-4 w-4" />
                  {numberOfFilters > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                      {numberOfFilters}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Collapsible open={panelOpenState} onOpenChange={setPanelOpenState}>
              <CollapsibleContent>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: panelOpenState ? 1 : 0, 
                    height: panelOpenState ? "auto" : 0 
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-6 p-4 border border-border/50 rounded-lg bg-muted/30"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Calendar className="h-4 w-4" />
                        Select dates
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Call Type</label>
                      <Select value={selectedCallType} onValueChange={setSelectedCallType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Call Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Call Types</SelectItem>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        onClick={searchFilterData}
                        className="w-full rounded-full"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : emptyData ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-medium mb-2">No data available</p>
                <p className="text-sm">Try adjusting your filters to see results</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <div className="border border-border/50 rounded-lg p-6 bg-card">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        label={{
                          value: "Calls Count",
                          angle: -90,
                          position: "insideLeft",
                          style: { fontSize: 14, fontWeight: 600, fill: "hsl(var(--foreground))" },
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: "20px",
                        }}
                        iconType="circle"
                      />
                      {categories.map((category, index) => (
                        <Line
                          key={category}
                          type="monotone"
                          dataKey={category}
                          stroke={CHART_COLORS[index % CHART_COLORS.length]}
                          strokeWidth={3}
                          dot={{ r: 6, strokeWidth: 0 }}
                          activeDot={{ r: 8 }}
                          animationDuration={800}
                          animationEasing="ease-in-out"
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
