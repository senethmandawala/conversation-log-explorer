import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePostCall } from "@/contexts/PostCallContext";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw, Calendar, List } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

// Generate mock heatmap data for General tab (Date x Hour)
const generateGeneralHeatmapData = () => {
  const days = ['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'];
  const data: any[] = [];
  
  days.forEach((day, dayIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0') + ':00';
      // Generate random call counts with peak hours (9-17)
      const isPeakHour = hour >= 9 && hour <= 17;
      const baseValue = isPeakHour ? 50 : 10;
      const callCount = Math.floor(Math.random() * baseValue) + (isPeakHour ? 30 : 0);
      
      data.push({
        x: hour,
        y: dayIndex,
        value: callCount,
        hour: hourStr,
        day: day
      });
    }
  });
  
  return data;
};

// Generate mock heatmap data for Categories tab (Category x Hour)
const generateCategoryHeatmapData = () => {
  const categories = ['Billing Issues', 'Technical Support', 'Account Management', 'Product Inquiry', 'Service Complaint', 'Refund Request', 'General Query'];
  const data: any[] = [];
  
  categories.forEach((category, catIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0') + ':00';
      const isPeakHour = hour >= 9 && hour <= 17;
      const baseValue = isPeakHour ? 30 : 5;
      const callCount = Math.floor(Math.random() * baseValue) + (isPeakHour ? 10 : 0);
      
      data.push({
        x: hour,
        y: catIndex,
        value: callCount,
        hour: hourStr,
        category: category
      });
    }
  });
  
  return data;
};

const getHeatmapColor = (value: number, maxValue: number) => {
  if (value === 0) return 'hsl(var(--muted))';
  const intensity = value / maxValue;
  // Professional blue gradient
  const hue = 220;
  const saturation = 70 + (20 * intensity);
  const lightness = 85 - (50 * intensity);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

interface HeatmapCellProps {
  value: number;
  maxValue: number;
  label: string;
  hour: string;
}

const HeatmapCell = ({ value, maxValue, label, hour }: HeatmapCellProps) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger>
        <div
          className="w-12 h-10 rounded border border-border/30 cursor-pointer transition-all duration-200 hover:border-primary hover:scale-105 hover:shadow-md hover:z-10"
          style={{ backgroundColor: getHeatmapColor(value, maxValue) }}
        />
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-popover border-border">
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-muted-foreground">{hour}</p>
          <p className="font-bold text-primary">{value} calls</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default function TrafficTrendsReport() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [generalData, setGeneralData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGeneralData(generateGeneralHeatmapData());
      setCategoryData(generateCategoryHeatmapData());
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setGeneralData(generateGeneralHeatmapData());
      setCategoryData(generateCategoryHeatmapData());
      setLoading(false);
    }, 500);
  };

  const maxGeneralValue = Math.max(...generalData.map(d => d.value), 1);
  const maxCategoryValue = Math.max(...categoryData.map(d => d.value), 1);

  return (
    <Card className="h-full border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">Traffic Trends</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visualize traffic trends across time periods</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm text-muted-foreground">Jun 19 - Jun 25, 2025</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Calendar className="h-4 w-4" />
              Week
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleReload}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading-general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center h-[400px]"
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </motion.div>
              ) : (
                <motion.div
                  key="content-general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-x-auto"
                >
                <div className="inline-block min-w-full">
                  {/* Hour labels */}
                  <div className="flex mb-3">
                    <div className="w-24 flex-shrink-0"></div>
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="w-12 text-[11px] text-center font-medium text-muted-foreground">
                        {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                      </div>
                    ))}
                  </div>
                  
                  {/* Heatmap grid */}
                  {['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'].map((day, dayIndex) => (
                    <div key={day} className="flex items-center mb-2 group">
                      <div className="w-24 text-xs font-semibold text-right pr-3 flex-shrink-0 text-foreground group-hover:text-primary transition-colors">{day}</div>
                      <div className="flex gap-1">
                        {Array.from({ length: 24 }, (_, hour) => {
                          const dataPoint = generalData.find(d => d.y === dayIndex && d.x === hour);
                          return (
                            <HeatmapCell
                              key={hour}
                              value={dataPoint?.value || 0}
                              maxValue={maxGeneralValue}
                              label={day}
                              hour={`${hour.toString().padStart(2, '0')}:00`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading-categories"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center h-[400px]"
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </motion.div>
              ) : (
                <motion.div
                  key="content-categories"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-x-auto"
                >
                <div className="inline-block min-w-full">
                  {/* Hour labels */}
                  <div className="flex mb-3">
                    <div className="w-40 flex-shrink-0"></div>
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="w-12 text-[11px] text-center font-medium text-muted-foreground">
                        {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                      </div>
                    ))}
                  </div>
                  
                  {/* Heatmap grid */}
                  {['Billing Issues', 'Technical Support', 'Account Management', 'Product Inquiry', 'Service Complaint', 'Refund Request', 'General Query'].map((category, catIndex) => (
                    <div key={category} className="flex items-center mb-2 group">
                      <div className="w-40 text-xs font-semibold text-right pr-3 flex-shrink-0 truncate text-foreground group-hover:text-primary transition-colors" title={category}>{category}</div>
                      <div className="flex gap-1">
                        {Array.from({ length: 24 }, (_, hour) => {
                          const dataPoint = categoryData.find(d => d.y === catIndex && d.x === hour);
                          return (
                            <HeatmapCell
                              key={hour}
                              value={dataPoint?.value || 0}
                              maxValue={maxCategoryValue}
                              label={category}
                              hour={`${hour.toString().padStart(2, '0')}:00`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
