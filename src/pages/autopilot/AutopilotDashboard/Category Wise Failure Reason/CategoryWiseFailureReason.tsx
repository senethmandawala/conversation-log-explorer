import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconInfoCircle, IconX, IconAlertTriangle } from "@tabler/icons-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Treemap,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
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
  '#FB6767', '#5766BC', '#62B766', '#FBA322', '#E83B76', 
  '#3EA1F0', '#98C861', '#FB6C3E', '#24B1F1', '#D0DD52'
];

interface TreemapDataItem {
  name: string;
  value: number;
  color: string;
}

interface FailureReasonDetail {
  reason: string;
  count: number;
}

// Mock treemap data for category-wise failure reasons
const treemapData: TreemapDataItem[] = [
  { name: "API Timeout", value: 145, color: COLORS[0] },
  { name: "Intent Recognition", value: 112, color: COLORS[1] },
  { name: "Backend Error", value: 98, color: COLORS[2] },
  { name: "User Abandonment", value: 87, color: COLORS[3] },
  { name: "System Overload", value: 76, color: COLORS[4] },
  { name: "Network Issues", value: 65, color: COLORS[5] },
  { name: "Auth Failure", value: 54, color: COLORS[6] },
  { name: "Data Validation", value: 43, color: COLORS[7] },
];

// Mock details data for each category
const failureReasonDetailsMap: Record<string, FailureReasonDetail[]> = {
  "API Timeout": [
    { reason: "Payment Gateway Timeout", count: 45 },
    { reason: "CRM API Slow Response", count: 38 },
    { reason: "Third-party Service Down", count: 32 },
    { reason: "Database Connection Timeout", count: 30 },
  ],
  "Intent Recognition": [
    { reason: "Ambiguous User Input", count: 42 },
    { reason: "Low Confidence Score", count: 35 },
    { reason: "Unsupported Language", count: 20 },
    { reason: "Background Noise", count: 15 },
  ],
  "Backend Error": [
    { reason: "Server 500 Error", count: 38 },
    { reason: "Null Pointer Exception", count: 28 },
    { reason: "Configuration Error", count: 18 },
    { reason: "Memory Overflow", count: 14 },
  ],
  "User Abandonment": [
    { reason: "Long Wait Time", count: 35 },
    { reason: "Complex IVR Navigation", count: 28 },
    { reason: "Repeated Authentication", count: 14 },
    { reason: "Call Disconnected", count: 10 },
  ],
  "System Overload": [
    { reason: "Peak Traffic Hours", count: 32 },
    { reason: "Resource Exhaustion", count: 24 },
    { reason: "Queue Full", count: 12 },
    { reason: "Rate Limiting", count: 8 },
  ],
  "Network Issues": [
    { reason: "VoIP Latency", count: 28 },
    { reason: "Packet Loss", count: 20 },
    { reason: "DNS Resolution Failed", count: 10 },
    { reason: "SSL Handshake Error", count: 7 },
  ],
  "Auth Failure": [
    { reason: "Invalid Credentials", count: 22 },
    { reason: "Session Expired", count: 18 },
    { reason: "MFA Timeout", count: 10 },
    { reason: "Account Locked", count: 4 },
  ],
  "Data Validation": [
    { reason: "Invalid Phone Format", count: 18 },
    { reason: "Missing Required Fields", count: 12 },
    { reason: "Account Not Found", count: 8 },
    { reason: "Date Format Mismatch", count: 5 },
  ],
};


const CustomTreemapContent = ({ x, y, width, height, index, name, value }: any) => {
  // Guard against undefined props from Recharts
  if (!name || width < 50 || height < 30) return null;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={COLORS[index % COLORS.length]}
        stroke="#fff"
        strokeWidth={2}
        rx={4}
        style={{ cursor: 'pointer' }}
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="normal"
          >
            {name.length > 15 ? `${name.slice(0, 15)}...` : name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            fontWeight="normal"
          >
            {value}
          </text>
        </>
      )}
    </g>
  );
};

const TreemapTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = treemapData.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(1);
    
    return (
      <div className="overflow-hidden rounded-md shadow-lg border-0 bg-background/95 backdrop-blur-sm">
        <div 
          className="px-3 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: COLORS[treemapData.findIndex(d => d.name === data.name) % COLORS.length] }}
        >
          {data.name}
        </div>
        <div className="px-3 py-2 text-sm space-y-0.5">
          <div className="text-muted-foreground">
            Count: <span className="font-semibold text-foreground">{data.value}</span>
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

export function CategoryWiseFailureReason() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleTreemapClick = (data: any) => {
    if (data && data.name) {
      setSelectedCategory(data.name);
    }
  };

  const handleCloseDetails = () => {
    // Start closing animation
    setIsClosing(true);
    // Clear selected category after animation completes
    setTimeout(() => {
      setSelectedCategory(null);
      setIsClosing(false);
    }, 300);
  };

  const detailsData = selectedCategory ? failureReasonDetailsMap[selectedCategory] || [] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Treemap Card */}
      <motion.div
        className={`w-full ${(!selectedCategory && !isClosing) ? 'md:col-span-2' : ''}`}
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
                    <IconAlertTriangle style={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                        Category-wise Failure Reasons
                      </Title>
                      <AntTooltip title="Distribution of failure reasons by category. Click on a category to see detailed breakdown.">
                        <div style={{ marginTop: '-4px' }}>
                          <InfoIcon 
                            style={{ fontSize: 14, color: '#64748b' }}
                          />
                        </div>
                      </AntTooltip>
                    </div>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Analysis of call failures by category
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
              <Treemap
                data={treemapData}
                dataKey="value"
                aspectRatio={4 / 3}
                stroke="#fff"
                content={<CustomTreemapContent />}
                onClick={handleTreemapClick}
              >
                <Tooltip content={<TreemapTooltip />} />
              </Treemap>
            </ResponsiveContainer>
          )}
        </div>
      </Space>
    </AntCard>
      </motion.div>

      {/* Details Card */}
      <AnimatePresence>
        {selectedCategory && !isClosing && (
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
                    <CardTitle className="text-lg font-semibold">Top Failure Reasons</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCategory}</p>
                  </div>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
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
                {detailsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={detailsData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="reason" 
                        tick={{ fontSize: 12 }}
                        width={75}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="overflow-hidden rounded-md shadow-lg border-0 bg-background/95 backdrop-blur-sm">
                                <div className="px-3 py-2 bg-primary text-primary-foreground text-sm font-semibold">
                                  {data.reason}
                                </div>
                                <div className="px-3 py-2 text-sm">
                                  <div className="text-muted-foreground">
                                    Count: <span className="font-semibold text-foreground">{data.count}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {detailsData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
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
