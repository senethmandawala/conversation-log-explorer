import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw, Calendar, List, X } from "lucide-react";
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

// Mock VDN category data for treemap
const vdnCategoryData = [
  { name: "Billing", value: 355, fill: "#4285F4" },
  { name: "Support", value: 385, fill: "#34A853" },
  { name: "Sales", value: 249, fill: "#FBBC04" },
  { name: "General", value: 190, fill: "#EA4335" },
  { name: "Technical", value: 313, fill: "#9C27B0" },
];

// Mock top VDN data for each category
const topVDNData = {
  "Billing": [
    { name: "VDN 1", value: 145, fill: "#8b5cf6" },
    { name: "VDN 2", value: 98, fill: "#3b82f6" },
    { name: "VDN 3", value: 67, fill: "#10b981" },
    { name: "VDN 4", value: 45, fill: "#f59e0b" },
  ],
  "Support": [
    { name: "VDN 1", value: 128, fill: "#8b5cf6" },
    { name: "VDN 2", value: 112, fill: "#3b82f6" },
    { name: "VDN 3", value: 89, fill: "#10b981" },
    { name: "VDN 4", value: 56, fill: "#f59e0b" },
  ],
  "Sales": [
    { name: "VDN 1", value: 87, fill: "#8b5cf6" },
    { name: "VDN 2", value: 76, fill: "#3b82f6" },
    { name: "VDN 3", value: 54, fill: "#10b981" },
    { name: "VDN 4", value: 32, fill: "#f59e0b" },
  ],
  "General": [
    { name: "VDN 1", value: 65, fill: "#8b5cf6" },
    { name: "VDN 2", value: 54, fill: "#3b82f6" },
    { name: "VDN 3", value: 43, fill: "#10b981" },
    { name: "VDN 4", value: 28, fill: "#f59e0b" },
  ],
  "Technical": [
    { name: "VDN 1", value: 112, fill: "#8b5cf6" },
    { name: "VDN 2", value: 89, fill: "#3b82f6" },
    { name: "VDN 3", value: 67, fill: "#10b981" },
    { name: "VDN 4", value: 45, fill: "#f59e0b" },
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
          fontWeight={600}
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
        <Card className="w-full h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold">Category-wise VDN Distribution</CardTitle>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Distribution of calls across different VDN channels by category</p>
                  </TooltipContent>
                </UITooltip>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Click on a category to see top VDNs</p>
          </CardHeader>
          
          <CardContent>
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
          </CardContent>
        </Card>
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
                        label={{ position: 'top', fill: '#4285F4', fontSize: 12, fontWeight: 600 }}
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
