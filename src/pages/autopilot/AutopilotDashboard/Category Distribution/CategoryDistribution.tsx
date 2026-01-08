import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Treemap,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Info, X, PieChartIcon } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card as AntCard, 
  Typography, 
  Space, 
  Tooltip as AntTooltip,
  Button as AntButton
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// Get colors from environment configuration
const COLORS = (window as any).env_vars?.colors || [
  '#FB6767', '#5766BC', '#62B766', '#FBA322', '#E83B76', 
  '#3EA1F0', '#98C861', '#FB6C3E', '#24B1F1', '#D0DD52'
];

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

// Mock data for main chart
const categoryData: ChartDataItem[] = [
  { name: "Billing Inquiries", value: 35, color: COLORS[0] },
  { name: "Technical Support", value: 25, color: COLORS[1] },
  { name: "General Questions", value: 20, color: COLORS[2] },
  { name: "Sales", value: 12, color: COLORS[3] },
  { name: "Others", value: 8, color: COLORS[4] },
];

// Subcategory data for each category
const subcategoryDataMap: Record<string, ChartDataItem[]> = {
  "Billing Inquiries": [
    { name: "Payment Issues", value: 120, color: COLORS[0] },
    { name: "Invoice Queries", value: 85, color: COLORS[0] },
    { name: "Refund Requests", value: 65, color: COLORS[0] },
    { name: "Plan Changes", value: 45, color: COLORS[0] },
    { name: "Billing Disputes", value: 30, color: COLORS[0] },
  ],
  "Technical Support": [
    { name: "Login Issues", value: 95, color: COLORS[1] },
    { name: "App Crashes", value: 72, color: COLORS[1] },
    { name: "Connectivity", value: 58, color: COLORS[1] },
    { name: "Feature Help", value: 42, color: COLORS[1] },
    { name: "Device Setup", value: 28, color: COLORS[1] },
  ],
  "General Questions": [
    { name: "Account Info", value: 78, color: COLORS[2] },
    { name: "Service Hours", value: 55, color: COLORS[2] },
    { name: "Policy Questions", value: 42, color: COLORS[2] },
    { name: "Location Info", value: 32, color: COLORS[2] },
  ],
  "Sales": [
    { name: "New Plans", value: 45, color: COLORS[3] },
    { name: "Upgrades", value: 38, color: COLORS[3] },
    { name: "Promotions", value: 28, color: COLORS[3] },
    { name: "Add-ons", value: 18, color: COLORS[3] },
  ],
  "Others": [
    { name: "Feedback", value: 35, color: COLORS[4] },
    { name: "Complaints", value: 28, color: COLORS[4] },
    { name: "Suggestions", value: 20, color: COLORS[4] },
  ],
};

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill } = props;
  
  // Skip rendering if there's no valid name (this filters out the root node)
  if (!name) {
    return null;
  }

  // Calculate dynamic font size based on cell dimensions
  const maxFontSize = 14;
  const minFontSize = 8;
  const padding = 8;
  
  // Calculate font size that fits within the cell
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  
  // Estimate characters per line based on available width (approx 0.6 ratio for font width)
  const charWidth = 0.6;
  const estimatedFontSizeByWidth = availableWidth / (name.length * charWidth);
  const estimatedFontSizeByHeight = availableHeight * 0.6;
  
  // Use the smaller of the two to ensure it fits
  let fontSize = Math.min(estimatedFontSizeByWidth, estimatedFontSizeByHeight, maxFontSize);
  fontSize = Math.max(fontSize, minFontSize);
  
  // Only show text if there's enough space
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

export function CategoryDistribution() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = categoryData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(0);
      
      return (
        <div className="overflow-hidden rounded-md shadow-lg border-0" style={{ minWidth: 120 }}>
          <div 
            className="text-sm font-semibold px-3 py-2" 
            style={{ backgroundColor: data.color, color: "white" }}
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

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCloseSubcategory = () => {
    // Start closing animation
    setIsClosing(true);
    // Clear selected category after animation completes
    setTimeout(() => {
      setSelectedCategory(null);
      setIsClosing(false);
    }, 300);
  };

  const subcategoryData = selectedCategory ? subcategoryDataMap[selectedCategory] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Main Category Distribution */}
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
                    <PieChartIcon style={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                        Category Distribution
                      </Title>
                      <AntTooltip title="Distribution of calls across different categories. Click on a segment to view subcategories.">
                        <div style={{ marginTop: '-4px' }}>
                          <InfoCircleOutlined 
                            style={{ fontSize: 14, color: '#64748b' }}
                          />
                        </div>
                      </AntTooltip>
                    </div>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Distribution of interactions by category
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
                <>
                  <div className="h-[300px] bg-white rounded-md p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <Treemap
                        data={categoryData.map(item => ({ ...item, fill: item.color }))}
                        dataKey="value"
                        stroke="white"
                        fill="#8b5cf6"
                        content={<CustomTreemapContent />}
                        onClick={(entry) => handleCategoryClick(entry.name)}
                      >
                        <Tooltip content={<CustomTooltip />} />
                      </Treemap>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Custom Legend */}
                  <div className="flex flex-wrap justify-center mt-3 gap-2">
                    {categoryData.map((category, index) => (
                      <div 
                        key={category.name} 
                        className="flex items-center cursor-pointer hover:opacity-80"
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <span 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm text-muted-foreground">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Space>
        </AntCard>
      </motion.div>

      {/* Subcategory Distribution Slide */}
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
                    <CardTitle className="text-lg font-semibold">Subcategory Distribution</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedCategory}</p>
                  </div>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCloseSubcategory}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Close subcategory view</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
              </CardHeader>
              
              <CardContent>
                {subcategoryData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={subcategoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
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
                          }}
                          labelLine={false}
                        >
                          {subcategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Custom Legend at the bottom */}
                    <div className="flex flex-wrap justify-center mt-6 gap-4">
                      {subcategoryData.map((category, index) => (
                        <div 
                          key={category.name} 
                          className="flex items-center"
                        >
                          <span 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm text-muted-foreground">{category.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
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
