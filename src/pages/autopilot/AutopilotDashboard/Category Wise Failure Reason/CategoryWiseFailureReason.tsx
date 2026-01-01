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
  { name: "API Timeout", value: 145, color: "#ef4444" },
  { name: "Intent Recognition", value: 112, color: "#f97316" },
  { name: "Backend Error", value: 98, color: "#eab308" },
  { name: "User Abandonment", value: 87, color: "#84cc16" },
  { name: "System Overload", value: 76, color: "#22c55e" },
  { name: "Network Issues", value: 65, color: "#06b6d4" },
  { name: "Auth Failure", value: 54, color: "#3b82f6" },
  { name: "Data Validation", value: 43, color: "#8b5cf6" },
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

const COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6"];

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
            fontWeight="600"
          >
            {name.length > 15 ? `${name.slice(0, 15)}...` : name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            fontWeight="700"
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

  const handleTreemapClick = (data: any) => {
    if (data && data.name) {
      setSelectedCategory(data.name);
    }
  };

  const handleCloseDetails = () => {
    setSelectedCategory(null);
  };

  const detailsData = selectedCategory ? failureReasonDetailsMap[selectedCategory] || [] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Treemap Card */}
      <Card className={`w-full ${!selectedCategory ? 'md:col-span-2' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">Category-wise Failure Reasons</CardTitle>
            <UITooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Distribution of failure reasons by category. Click on a category to see detailed breakdown.</p>
              </TooltipContent>
            </UITooltip>
          </div>
          <p className="text-sm text-muted-foreground">Analysis of call failures by category</p>
        </CardHeader>
        
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Details Card */}
      <AnimatePresence>
        {selectedCategory && (
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
