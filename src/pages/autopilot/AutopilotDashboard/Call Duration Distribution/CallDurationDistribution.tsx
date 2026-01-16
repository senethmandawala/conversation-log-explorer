import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconInfoCircle, IconRefresh, IconCalendar, IconList, IconClock } from "@tabler/icons-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Treemap,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card as AntCard, 
  Typography, 
  Space, 
  Tooltip as AntTooltip,
  Table as AntTable,
  Tag as AntTag,
  Tabs as AntTabs
} from "antd";
import { IconInfoCircle as InfoIcon } from "@tabler/icons-react";

const { Title, Text } = Typography;

// Get colors from environment configuration
const COLORS = (window as any).env_vars?.colors || [
  '#FB6767', '#5766BC', '#62B766', '#FBA322', '#E83B76', 
  '#3EA1F0', '#98C861', '#FB6C3E', '#24B1F1', '#D0DD52'
];

// Mock duration category data
const durationCategoryData = [
  { name: "Billing Issues", value: 145, fill: COLORS[0] },
  { name: "Technical Support", value: 128, fill: COLORS[1] },
  { name: "Account Management", value: 98, fill: COLORS[2] },
  { name: "Product Inquiry", value: 87, fill: COLORS[3] },
  { name: "Service Complaint", value: 76, fill: COLORS[4] },
];

// Mock long calls data
const longCallsData = [
  { name: "Billing Issues", value: 45, fill: COLORS[0] },
  { name: "Technical Support", value: 38, fill: COLORS[1] },
  { name: "Account Management", value: 28, fill: COLORS[2] },
  { name: "Product Inquiry", value: 22, fill: COLORS[3] },
  { name: "Service Complaint", value: 18, fill: COLORS[4] },
];

// Mock long call logs
const mockLongCallLogs = [
  { id: 1, date: "2024-01-15", time: "10:30 AM", msisdn: "+94771234567", sentiment: "Negative", status: "Resolved" },
  { id: 2, date: "2024-01-15", time: "11:45 AM", msisdn: "+94772345678", sentiment: "Neutral", status: "Pending" },
  { id: 3, date: "2024-01-14", time: "02:15 PM", msisdn: "+94773456789", sentiment: "Positive", status: "Resolved" },
  { id: 4, date: "2024-01-14", time: "03:30 PM", msisdn: "+94774567890", sentiment: "Negative", status: "Escalated" },
  { id: 5, date: "2024-01-13", time: "09:20 AM", msisdn: "+94775678901", sentiment: "Neutral", status: "Resolved" },
];

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill } = props;
  
  if (!name) {
    return null;
  }

  const maxFontSize = 14;
  const minFontSize = 8;
  const padding = 8;
  
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  
  const charWidth = 0.6;
  const estimatedFontSizeByWidth = availableWidth / (name.length * charWidth);
  const estimatedFontSizeByHeight = availableHeight * 0.6;
  
  let fontSize = Math.min(estimatedFontSizeByWidth, estimatedFontSizeByHeight, maxFontSize);
  fontSize = Math.max(fontSize, minFontSize);
  
  const showText = width > 40 && height > 20 && fontSize >= minFontSize;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="white"
        strokeWidth={2}
        style={{ cursor: "pointer" }}
        className="hover:opacity-80 transition-opacity"
      />
      {showText && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={fontSize}
          fontWeight="normal"
          style={{ pointerEvents: "none" }}
        >
          {name}
        </text>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = durationCategoryData.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(0);
    
    return (
      <div className="overflow-hidden rounded-md shadow-lg border-0 min-w-[120px]">
        <div 
          className="text-sm font-semibold px-3 py-2 text-white"
          style={{ backgroundColor: data.fill }}
        >
          {data.name}
        </div>
        <div className="bg-muted px-3 py-2 text-sm space-y-0.5">
          <div className="text-muted-foreground">Count: <span className="font-semibold text-foreground">{data.value}</span></div>
          <div className="text-muted-foreground">Percentage: <span className="font-semibold text-foreground">{percentage}%</span></div>
        </div>
      </div>
    );
  }
  return null;
};

const LongCallsTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = longCallsData.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(0);
    
    return (
      <div className="overflow-hidden rounded-md shadow-lg border-0 min-w-[120px]">
        <div 
          className="text-sm font-semibold px-3 py-2 text-white"
          style={{ backgroundColor: data.fill }}
        >
          {data.name}
        </div>
        <div className="bg-muted px-3 py-2 text-sm space-y-0.5">
          <div className="text-muted-foreground">Count: <span className="font-semibold text-foreground">{data.value}</span></div>
          <div className="text-muted-foreground">Percentage: <span className="font-semibold text-foreground">{percentage}%</span></div>
        </div>
      </div>
    );
  }
  return null;
};

export function CallDurationDistribution() {
  const [activeTab, setActiveTab] = useState("duration");
  const [loading, setLoading] = useState(true); // Start with loading true
  
  const [averageCallTime, setAverageCallTime] = useState("8:45");
  const [totalCallCount, setTotalCallCount] = useState("1,234");
  
  const [longCallThreshold, setLongCallThreshold] = useState("15:00");
  const [totalCalls, setTotalCalls] = useState("1,234");
  const [totalLongCalls, setTotalLongCalls] = useState("156");
  const [longCallPercentage, setLongCallPercentage] = useState(12.6);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Positive</Badge>;
      case "negative": return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Negative</Badge>;
      default: return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">Neutral</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Resolved</Badge>;
      case "pending": return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">Pending</Badge>;
      case "escalated": return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Escalated</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <AntCard className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconClock className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-lg !font-semibold">
                    Call Duration Analysis
                  </Title>
                  <AntTooltip title="Analyze call duration patterns and identify long calls">
                    <div className="-mt-1">
                      <InfoIcon className="text-sm text-slate-500" />
                    </div>
                  </AntTooltip>
                </div>
                <Text type="secondary" className="text-sm">
                  Duration distribution and long call analysis
                </Text>
              </div>
            </Space>
          </div>
        </div>
        
        {/* Chart Content */}
        <div className="mt-1">
        <AntTabs
          activeKey={activeTab}
          onChange={(value) => setActiveTab(value)}
          className="w-full"
          size="large"
          items={[
            {
              key: "duration",
              label: "Call Duration",
              children: (
                <>
                  <div className="mb-4">
                    <Card className="rounded-xl border-gray-200 bg-gradient-to-br from-blue-500 to-blue-600 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm mb-1">Average Call Time</p>
                          <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-bold text-white m-0">{averageCallTime}</h2>
                            <span className="text-white/80 text-sm">from {totalCallCount} Calls</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-[400px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <Card className="border-border/50 h-[450px]">
                      <CardContent className="p-4">
                        <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <Treemap
                              data={durationCategoryData}
                              dataKey="value"
                              stroke="white"
                              content={<CustomTreemapContent />}
                            >
                              <RechartsTooltip content={<CustomTooltip />} />
                            </Treemap>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )
            },
            {
              key: "long-calls",
              label: "Long Calls",
              children: (
                <>
                  <div className="mb-4">
                    <Card className="rounded-xl border-gray-200 bg-gradient-to-br from-orange-500 to-orange-600 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm mb-1">Long Calls</p>
                          <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-bold text-white m-0">{totalLongCalls}</h2>
                            <span className="text-white/80 text-sm">from {totalCalls} Calls</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-[400px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <Card className="border-border/50 h-[450px]">
                      <CardContent className="p-4">
                        <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={longCallsData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                              />
                              <YAxis tick={{ fontSize: 12 }} />
                              <Tooltip content={<LongCallsTooltip />} cursor={{ fill: 'transparent' }} />
                              <Bar 
                                dataKey="value" 
                                radius={[8, 8, 0, 0]}
                                label={{ position: 'inside', fill: 'white', fontSize: 11, fontWeight: 600 }}
                              >
                                {longCallsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )
            }
          ]}
        />
        </div>
      </Space>
    </AntCard>
  );
}
