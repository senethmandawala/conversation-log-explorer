import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw, Calendar, List, X, Phone } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

// Mock VDN category data for treemap
const vdnCategoryData = [
  { name: "Billing", value: 355, fill: COLORS[0] },
  { name: "Support", value: 385, fill: COLORS[1] },
  { name: "Sales", value: 249, fill: COLORS[2] },
  { name: "General", value: 190, fill: COLORS[3] },
  { name: "Technical", value: 313, fill: COLORS[4] },
];

// Mock top VDN data for each category
const topVDNData = {
  "Billing": [
    { name: "VDN 1", value: 145, fill: COLORS[5] },
    { name: "VDN 2", value: 98, fill: COLORS[6] },
    { name: "VDN 3", value: 67, fill: COLORS[7] },
    { name: "VDN 4", value: 45, fill: COLORS[8] },
  ],
  "Support": [
    { name: "VDN 1", value: 128, fill: COLORS[5] },
    { name: "VDN 2", value: 112, fill: COLORS[6] },
    { name: "VDN 3", value: 89, fill: COLORS[7] },
    { name: "VDN 4", value: 56, fill: COLORS[8] },
  ],
  "Sales": [
    { name: "VDN 1", value: 87, fill: COLORS[5] },
    { name: "VDN 2", value: 76, fill: COLORS[6] },
    { name: "VDN 3", value: 54, fill: COLORS[7] },
    { name: "VDN 4", value: 32, fill: COLORS[8] },
  ],
  "General": [
    { name: "VDN 1", value: 65, fill: COLORS[5] },
    { name: "VDN 2", value: 54, fill: COLORS[6] },
    { name: "VDN 3", value: 43, fill: COLORS[7] },
    { name: "VDN 4", value: 28, fill: COLORS[8] },
  ],
  "Technical": [
    { name: "VDN 1", value: 112, fill: COLORS[5] },
    { name: "VDN 2", value: 89, fill: COLORS[6] },
    { name: "VDN 3", value: 67, fill: COLORS[7] },
    { name: "VDN 4", value: 45, fill: COLORS[8] },
  ],
};

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
    const total = vdnCategoryData.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(0);
    
    return (
      <div className="overflow-hidden rounded-md shadow-lg border-0" style={{ minWidth: 120 }}>
        <div 
          className="text-sm font-semibold px-3 py-2" 
          style={{ backgroundColor: data.fill, color: "white" }}
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

export function CategoryWiseVDN() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const TopVDNTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const categoryData = topVDNData[selectedCategory as keyof typeof topVDNData] || [];
      const total = categoryData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(0);
      
      return (
        <div className="overflow-hidden rounded-md shadow-lg border-0" style={{ minWidth: 120 }}>
          <div 
            className="text-sm font-semibold px-3 py-2" 
            style={{ backgroundColor: data.fill, color: "white" }}
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleTreemapClick = (data: any) => {
    if (data && data.name) {
      setSelectedCategory(data.name);
    }
  };

  const handleCloseTopVDN = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedCategory(null);
      setIsClosing(false);
    }, 300);
  };

  const handleReload = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const topVDNChartData = selectedCategory ? topVDNData[selectedCategory as keyof typeof topVDNData] || [] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* VDN Category Treemap */}
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
                    <Phone style={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                        Category-wise VDN Distribution
                      </Title>
                      <AntTooltip title="Distribution of calls across different VDN channels by category">
                        <div style={{ marginTop: '-4px' }}>
                          <InfoCircleOutlined 
                            style={{ fontSize: 14, color: '#64748b' }}
                          />
                        </div>
                      </AntTooltip>
                    </div>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Click on a category to see top VDNs
                    </Text>
                  </div>
                </Space>
              </div>
            </div>
            
            {/* Chart Content */}
            <div style={{ marginTop: 10 }}>
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={vdnCategoryData}
                    dataKey="value"
                    stroke="white"
                    content={<CustomTreemapContent />}
                    onClick={handleTreemapClick}
                  >
                    <RechartsTooltip content={<CustomTooltip />} />
                  </Treemap>
                </ResponsiveContainer>
              </div>
            )}
        </div>
      </Space>
    </AntCard>
      </motion.div>

      {/* Top VDN Bar Chart */}
      <AnimatePresence>
        {selectedCategory && !isClosing && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="w-full h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Top VDNs - {selectedCategory}</CardTitle>
                    <p className="text-sm text-muted-foreground">VDN performance for selected category</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleCloseTopVDN}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topVDNChartData}
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
                      <Tooltip content={<TopVDNTooltip />} cursor={{ fill: 'transparent' }} />
                      <Bar 
                        dataKey="value" 
                        radius={[8, 8, 0, 0]}
                        label={{ position: 'inside', fill: 'white', fontSize: 11, fontWeight: 600 }}
                      >
                        {topVDNChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
