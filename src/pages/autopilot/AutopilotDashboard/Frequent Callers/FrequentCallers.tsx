import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

interface CallerData {
  name: string;
  value: number;
  color: string;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

// Mock frequent callers data
const callersData: CallerData[] = [
  { name: "****5678", value: 12, color: "#3b82f6" },
  { name: "****1234", value: 8, color: "#3b82f6" },
  { name: "****9012", value: 6, color: "#3b82f6" },
  { name: "****3456", value: 5, color: "#3b82f6" },
  { name: "****7890", value: 4, color: "#3b82f6" },
];

// Mock category breakdown data for each caller
const categoryBreakdownMap: Record<string, CategoryData[]> = {
  "****5678": [
    { name: "Payment Issues", value: 5, color: "#ef4444" },
    { name: "Account Inquiry", value: 3, color: "#f97316" },
    { name: "Technical Support", value: 2, color: "#eab308" },
    { name: "General Info", value: 2, color: "#84cc16" },
  ],
  "****1234": [
    { name: "Account Inquiry", value: 4, color: "#f97316" },
    { name: "Payment Issues", value: 2, color: "#ef4444" },
    { name: "Technical Support", value: 1, color: "#eab308" },
    { name: "General Info", value: 1, color: "#84cc16" },
  ],
  "****9012": [
    { name: "Technical Support", value: 3, color: "#eab308" },
    { name: "Account Inquiry", value: 2, color: "#f97316" },
    { name: "Payment Issues", value: 1, color: "#ef4444" },
  ],
  "****3456": [
    { name: "Account Inquiry", value: 3, color: "#f97316" },
    { name: "General Info", value: 1, color: "#84cc16" },
    { name: "Payment Issues", value: 1, color: "#ef4444" },
  ],
  "****7890": [
    { name: "General Info", value: 2, color: "#84cc16" },
    { name: "Account Inquiry", value: 1, color: "#f97316" },
    { name: "Technical Support", value: 1, color: "#eab308" },
  ],
};

const COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6"];

const BarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = callersData.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(1);
    
    return (
      <div className="overflow-hidden rounded-md shadow-lg border-0 bg-background/95 backdrop-blur-sm">
        <div 
          className="px-3 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: data.color }}
        >
          {data.name}
        </div>
        <div className="px-3 py-2 text-sm space-y-0.5">
          <div className="text-muted-foreground">
            Calls: <span className="font-semibold text-foreground">{data.value}</span>
          </div>
          <div className="text-muted-foreground">
            Percentage: <span className="font-semibold text-foreground">{percentage}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
      style={{ fontSize: '10px', fontWeight: 600 }}
    >
      {value}
    </text>
  );
};

export function FrequentCallers() {
  const [selectedCaller, setSelectedCaller] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleBarClick = (data: any) => {
    if (data && data.name) {
      setSelectedCaller(data.name);
    }
  };

  const handleCloseDetails = () => {
    // Start closing animation
    setIsClosing(true);
    // Clear selected caller after animation completes
    setTimeout(() => {
      setSelectedCaller(null);
      setIsClosing(false);
    }, 300);
  };

  const categoryData = selectedCaller ? categoryBreakdownMap[selectedCaller] || [] : [];

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = categoryData.reduce((sum, item) => sum + item.value, 0);
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : "0";
      
      return (
        <div className="overflow-hidden rounded-md shadow-lg border-0 bg-background/95 backdrop-blur-sm">
          <div 
            className="px-3 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: data.color }}
          >
            {data.name}
          </div>
          <div className="px-3 py-2 text-sm space-y-0.5">
            <div className="text-muted-foreground">
              Calls: <span className="font-semibold text-foreground">{data.value}</span>
            </div>
            <div className="text-muted-foreground">
              Percentage: <span className="font-semibold text-foreground">{percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Frequent Callers Bar Chart */}
      <motion.div
        className={`w-full ${(!selectedCaller && !isClosing) ? 'md:col-span-2' : ''}`}
        layout
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">Frequent Callers</CardTitle>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analysis of most frequent callers. Click on any bar to view detailed category breakdown.</p>
                </TooltipContent>
              </UITooltip>
            </div>
            <p className="text-sm text-muted-foreground">Top callers by call volume</p>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={callersData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<BarTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                    onClick={handleBarClick}
                    style={{ cursor: 'pointer' }}
                    label={{ position: 'top', fill: '#3b82f6', fontSize: 12, fontWeight: 600 }}
                  >
                    {callersData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#3b82f6" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <p className="text-center text-sm text-muted-foreground mt-2">
              <span className="font-medium">Phone numbers are masked for privacy</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown Donut Chart */}
      <AnimatePresence>
        {selectedCaller && !isClosing && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <CardTitle className="text-lg font-semibold">Top Categories</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCaller}</p>
                  </div>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCloseDetails}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Close details view</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
              </CardHeader>
              
              <CardContent>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={renderCustomLabel}
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
