import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "antd";
import { IconInfoCircle, IconX, IconUsers } from "@tabler/icons-react";
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
import { 
  Card as AntCard, 
  Typography, 
  Space, 
  Tooltip as AntTooltip
} from "antd";
import { IconInfoCircle as InfoIcon } from "@tabler/icons-react";

const { Title, Text } = Typography;

// Get colors from environment configuration
const COLORS = (window as any).env_vars?.colors || [
];

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
  { name: "****5678", value: 12, color: COLORS[0] },
  { name: "****1234", value: 8, color: COLORS[0] },
  { name: "****9012", value: 6, color: COLORS[0] },
  { name: "****3456", value: 5, color: COLORS[0] },
  { name: "****7890", value: 4, color: COLORS[0] },
];

// Mock category breakdown data for each caller
const categoryBreakdownMap: Record<string, CategoryData[]> = {
  "****5678": [
    { name: "Payment Issues", value: 5, color: COLORS[1] },
    { name: "Account Inquiry", value: 3, color: COLORS[2] },
    { name: "Technical Support", value: 2, color: COLORS[3] },
    { name: "General Info", value: 2, color: COLORS[4] },
  ],
  "****1234": [
    { name: "Account Inquiry", value: 4, color: COLORS[2] },
    { name: "Payment Issues", value: 2, color: COLORS[1] },
    { name: "Technical Support", value: 1, color: COLORS[3] },
    { name: "General Info", value: 1, color: COLORS[4] },
  ],
  "****9012": [
    { name: "Technical Support", value: 3, color: COLORS[3] },
    { name: "Account Inquiry", value: 2, color: COLORS[2] },
    { name: "Payment Issues", value: 1, color: COLORS[1] },
  ],
  "****3456": [
    { name: "Account Inquiry", value: 3, color: COLORS[2] },
    { name: "General Info", value: 1, color: COLORS[4] },
    { name: "Payment Issues", value: 1, color: COLORS[1] },
  ],
  "****7890": [
    { name: "General Info", value: 2, color: COLORS[4] },
    { name: "Account Inquiry", value: 1, color: COLORS[2] },
    { name: "Technical Support", value: 1, color: COLORS[3] },
  ],
};


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
        <AntCard className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
          <Space orientation="vertical" size="middle" className="w-full">
            <div className="-mt-3">
              <div className="flex justify-between items-center w-full">
                <Space align="center" size="middle">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white">
                    <IconUsers className="text-xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Title level={4} className="!m-0 !text-lg !font-semibold">
                        Frequent Callers
                      </Title>
                      <AntTooltip title="Analysis of most frequent callers. Click on any bar to view detailed category breakdown.">
                        <div className="-mt-1">
                          <InfoIcon className="text-sm text-slate-500" />
                        </div>
                      </AntTooltip>
                    </div>
                    <Text type="secondary" className="text-sm">
                      Top callers by call volume
                    </Text>
                  </div>
                </Space>
              </div>
            </div>
            
            {/* Chart Content */}
            <div className="mt-8">
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
                    label={{ position: 'inside', fill: 'white', fontSize: 11, fontWeight: 600 }}
                  >
                    {callersData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[0]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <p className="text-center text-sm text-muted-foreground mt-2">
              <span className="font-medium">Phone numbers are masked for privacy</span>
            </p>
        </div>
      </Space>
    </AntCard>
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
                        type="text" 
                         
                        onClick={handleCloseDetails}
                        className="h-8 w-8"
                      >
                        <IconX className="h-4 w-4" />
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
