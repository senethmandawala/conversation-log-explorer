import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Info, X } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { PieChartTooltip } from "@/components/ui/custom-chart-tooltip";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

// Mock data for main chart
const categoryData: ChartDataItem[] = [
  { name: "Billing Inquiries", value: 35, color: "#8b5cf6" },
  { name: "Technical Support", value: 25, color: "#3b82f6" },
  { name: "General Questions", value: 20, color: "#10b981" },
  { name: "Sales", value: 12, color: "#f59e0b" },
  { name: "Others", value: 8, color: "#6b7280" },
];

// Subcategory data for each category
const subcategoryDataMap: Record<string, ChartDataItem[]> = {
  "Billing Inquiries": [
    { name: "Payment Issues", value: 120, color: "#8b5cf6" },
    { name: "Invoice Queries", value: 85, color: "#a78bfa" },
    { name: "Refund Requests", value: 65, color: "#c4b5fd" },
    { name: "Plan Changes", value: 45, color: "#ddd6fe" },
    { name: "Billing Disputes", value: 30, color: "#ede9fe" },
  ],
  "Technical Support": [
    { name: "Login Issues", value: 95, color: "#3b82f6" },
    { name: "App Crashes", value: 72, color: "#60a5fa" },
    { name: "Connectivity", value: 58, color: "#93c5fd" },
    { name: "Feature Help", value: 42, color: "#bfdbfe" },
    { name: "Device Setup", value: 28, color: "#dbeafe" },
  ],
  "General Questions": [
    { name: "Account Info", value: 78, color: "#10b981" },
    { name: "Service Hours", value: 55, color: "#34d399" },
    { name: "Policy Questions", value: 42, color: "#6ee7b7" },
    { name: "Location Info", value: 32, color: "#a7f3d0" },
  ],
  "Sales": [
    { name: "New Plans", value: 45, color: "#f59e0b" },
    { name: "Upgrades", value: 38, color: "#fbbf24" },
    { name: "Promotions", value: 28, color: "#fcd34d" },
    { name: "Add-ons", value: 18, color: "#fde68a" },
  ],
  "Others": [
    { name: "Feedback", value: 35, color: "#6b7280" },
    { name: "Complaints", value: 28, color: "#9ca3af" },
    { name: "Suggestions", value: 20, color: "#d1d5db" },
  ],
};

export function CategoryDistribution() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getColorForIndex = (index: number): string => {
    return categoryData[index % categoryData.length].color;
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

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCloseSubcategory = () => {
    setSelectedCategory(null);
  };

  const subcategoryData = selectedCategory ? subcategoryDataMap[selectedCategory] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Main Category Distribution */}
      <Card className={`w-full ${!selectedCategory ? 'md:col-span-2' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">Category Distribution</CardTitle>
            <UITooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Distribution of calls across different categories. Click on a segment to view subcategories.</p>
              </TooltipContent>
            </UITooltip>
          </div>
          <p className="text-sm text-muted-foreground">Distribution of interactions by category</p>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
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
                    onClick={(entry) => handleCategoryClick(entry.name)}
                    cursor="pointer"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
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
                      style={{ backgroundColor: getColorForIndex(index) }}
                    />
                    <span className="text-sm text-muted-foreground">{category.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Subcategory Distribution Slide */}
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
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subcategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={renderCustomLabel}
                        labelLine={false}
                      >
                        {subcategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieChartTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
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
