import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, X, Users } from "lucide-react";
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
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// Get colors from environment configuration
const COLORS = (window as any).env_vars?.colors || [
  '#FB6767', '#5766BC', '#62B766', '#FBA322', '#E83B76', 
  '#3EA1F0', '#98C861', '#FB6C3E', '#24B1F1', '#D0DD52'
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
        <AntCard
          style={{
            borderRadius: 12,
            border: '1px solid #e8e8e8',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '16px 16px 16px 16px'
          }}
        >
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ marginTop: -12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Space align="center" size="middle">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <Users style={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                        Frequent Callers
                      </Title>
                      <AntTooltip title="Analysis of most frequent callers. Click on any bar to view detailed category breakdown.">
                        <div style={{ marginTop: '-4px' }}>
                          <InfoCircleOutlined 
                            style={{ fontSize: 14, color: '#64748b' }}
                          />
                        </div>
                      </AntTooltip>
                    </div>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Top callers by call volume
                    </Text>
                  </div>
                </Space>
              </div>
            </div>
            
            {/* Chart Content */}
            <div style={{ marginTop: 30 }}>
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
