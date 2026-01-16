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
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Card as AntCard, 
  Typography, 
  Space, 
  Tooltip as AntTooltip,
  Table as AntTable,
  Tag as AntTag
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

interface AttemptDetail {
  reason: string;
  firstAttempt: number;
  secondAttempt: number;
  thirdAttempt: number;
  failed: number;
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

// Mock attempt details data for each category
const attemptDetailsMap: Record<string, AttemptDetail[]> = {
  "API Timeout": [
    { reason: "Payment Gateway Timeout", firstAttempt: 45, secondAttempt: 25, thirdAttempt: 15, failed: 60 },
    { reason: "CRM API Slow Response", firstAttempt: 38, secondAttempt: 22, thirdAttempt: 12, failed: 48 },
    { reason: "Third-party Service Down", firstAttempt: 32, secondAttempt: 18, thirdAttempt: 10, failed: 40 },
    { reason: "Database Connection Timeout", firstAttempt: 30, secondAttempt: 20, thirdAttempt: 8, failed: 38 },
  ],
  "Intent Recognition": [
    { reason: "Ambiguous User Input", firstAttempt: 42, secondAttempt: 28, thirdAttempt: 16, failed: 54 },
    { reason: "Low Confidence Score", firstAttempt: 35, secondAttempt: 25, thirdAttempt: 14, failed: 46 },
    { reason: "Unsupported Language", firstAttempt: 20, secondAttempt: 15, thirdAttempt: 8, failed: 28 },
    { reason: "Background Noise", firstAttempt: 15, secondAttempt: 10, thirdAttempt: 5, failed: 20 },
  ],
  "Backend Error": [
    { reason: "Server 500 Error", firstAttempt: 38, secondAttempt: 28, thirdAttempt: 18, failed: 56 },
    { reason: "Null Pointer Exception", firstAttempt: 28, secondAttempt: 20, thirdAttempt: 12, failed: 42 },
    { reason: "Configuration Error", firstAttempt: 18, secondAttempt: 14, thirdAttempt: 8, failed: 32 },
    { reason: "Memory Overflow", firstAttempt: 14, secondAttempt: 10, thirdAttempt: 6, failed: 24 },
  ],
  "User Abandonment": [
    { reason: "Long Wait Time", firstAttempt: 35, secondAttempt: 25, thirdAttempt: 15, failed: 45 },
    { reason: "Complex IVR Navigation", firstAttempt: 28, secondAttempt: 20, thirdAttempt: 12, failed: 38 },
    { reason: "Repeated Authentication", firstAttempt: 14, secondAttempt: 10, thirdAttempt: 6, failed: 20 },
    { reason: "Call Disconnected", firstAttempt: 10, secondAttempt: 8, thirdAttempt: 4, failed: 16 },
  ],
  "System Overload": [
    { reason: "Peak Traffic Hours", firstAttempt: 32, secondAttempt: 24, thirdAttempt: 14, failed: 44 },
    { reason: "Resource Exhaustion", firstAttempt: 24, secondAttempt: 18, thirdAttempt: 10, failed: 36 },
    { reason: "Queue Full", firstAttempt: 12, secondAttempt: 8, thirdAttempt: 4, failed: 18 },
    { reason: "Rate Limiting", firstAttempt: 8, secondAttempt: 6, thirdAttempt: 2, failed: 12 },
  ],
  "Network Issues": [
    { reason: "VoIP Latency", firstAttempt: 28, secondAttempt: 20, thirdAttempt: 12, failed: 40 },
    { reason: "Packet Loss", firstAttempt: 20, secondAttempt: 14, thirdAttempt: 8, failed: 30 },
    { reason: "DNS Resolution Failed", firstAttempt: 10, secondAttempt: 8, thirdAttempt: 4, failed: 16 },
    { reason: "SSL Handshake Error", firstAttempt: 7, secondAttempt: 5, thirdAttempt: 2, failed: 10 },
  ],
  "Auth Failure": [
    { reason: "Invalid Credentials", firstAttempt: 22, secondAttempt: 18, thirdAttempt: 10, failed: 32 },
    { reason: "Session Expired", firstAttempt: 18, secondAttempt: 14, thirdAttempt: 8, failed: 26 },
    { reason: "MFA Timeout", firstAttempt: 10, secondAttempt: 8, thirdAttempt: 4, failed: 14 },
    { reason: "Account Locked", firstAttempt: 4, secondAttempt: 3, thirdAttempt: 1, failed: 6 },
  ],
  "Data Validation": [
    { reason: "Invalid Phone Format", firstAttempt: 18, secondAttempt: 12, thirdAttempt: 6, failed: 24 },
    { reason: "Missing Required Fields", firstAttempt: 12, secondAttempt: 8, thirdAttempt: 4, failed: 16 },
    { reason: "Account Not Found", firstAttempt: 8, secondAttempt: 6, thirdAttempt: 3, failed: 10 },
    { reason: "Date Format Mismatch", firstAttempt: 5, secondAttempt: 3, thirdAttempt: 1, failed: 6 },
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

export function CategoryWiseFailureReasonAttempt() {
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

  const detailsData = selectedCategory ? attemptDetailsMap[selectedCategory] || [] : [];

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
                        Category-wise Failure Reason Attempts
                      </Title>
                      <AntTooltip title="Distribution of failure reasons by category with attempt analysis. Click on a category to see detailed breakdown.">
                        <div style={{ marginTop: '-4px' }}>
                          <InfoIcon 
                            style={{ fontSize: 14, color: '#64748b' }}
                          />
                        </div>
                      </AntTooltip>
                    </div>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Analysis of call failure attempts by category
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
                  <div className="overflow-x-auto">
                    <AntTable
                      dataSource={detailsData.map((item, index) => ({ ...item, key: index }))}
                      columns={[
                        {
                          title: 'Reason',
                          dataIndex: 'reason',
                          key: 'reason',
                          width: 200,
                          render: (text: string) => (
                            <Text strong style={{ fontSize: 13 }}>{text}</Text>
                          ),
                        },
                        {
                          title: (
                            <Space>
                              First Attempt
                              <AntTooltip title="Number of successful calls on first attempt">
                                <InfoIcon style={{ fontSize: 12, color: '#94a3b8' }} />
                              </AntTooltip>
                            </Space>
                          ),
                          dataIndex: 'firstAttempt',
                          key: 'firstAttempt',
                          width: 150,
                          align: 'center',
                          render: (value: number) => (
                            <AntTag color="success" style={{ fontWeight: 500 }}>
                              {value}
                            </AntTag>
                          ),
                        },
                        {
                          title: (
                            <Space>
                              Second Attempt
                              <AntTooltip title="Number of successful calls on second attempt">
                                <InfoIcon style={{ fontSize: 12, color: '#94a3b8' }} />
                              </AntTooltip>
                            </Space>
                          ),
                          dataIndex: 'secondAttempt',
                          key: 'secondAttempt',
                          width: 150,
                          align: 'center',
                          render: (value: number) => (
                            <AntTag color="warning" style={{ fontWeight: 500 }}>
                              {value}
                            </AntTag>
                          ),
                        },
                        {
                          title: (
                            <Space>
                              Third Attempt
                              <AntTooltip title="Number of successful calls on third attempt">
                                <InfoIcon style={{ fontSize: 12, color: '#94a3b8' }} />
                              </AntTooltip>
                            </Space>
                          ),
                          dataIndex: 'thirdAttempt',
                          key: 'thirdAttempt',
                          width: 150,
                          align: 'center',
                          render: (value: number) => (
                            <AntTag color="default" style={{ fontWeight: 500 }}>
                              {value}
                            </AntTag>
                          ),
                        },
                        {
                          title: (
                            <Space>
                              Failed
                              <AntTooltip title="Number of failed calls after all attempts">
                                <InfoIcon style={{ fontSize: 12, color: '#94a3b8' }} />
                              </AntTooltip>
                            </Space>
                          ),
                          dataIndex: 'failed',
                          key: 'failed',
                          width: 150,
                          align: 'center',
                          render: (value: number) => (
                            <AntTag color="error" style={{ fontWeight: 500 }}>
                              {value}
                            </AntTag>
                          ),
                        },
                      ]}
                      pagination={false}
                      size="small"
                      scroll={{ x: 800 }}
                      style={{
                        borderRadius: 8,
                        overflow: 'hidden',
                      }}
                      rowClassName={(record, index) => 
                        index % 2 === 0 ? 'bg-gray-50/50' : ''
                      }
                    />
                  </div>
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
