import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Filter, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { DateRangeFilter } from "@/components/conversation/DateRangeFilter";
import { DateRangeValue } from "@/types/conversation";

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

const getHeatmapColor = (value: number, maxValue: number, categoryIndex?: number) => {
  if (value === 0) return 'hsl(var(--muted))';
  const intensity = value / maxValue;
  
  // For categories tab, use different base colors for each category
  if (categoryIndex !== undefined) {
    const categoryColors = [
      { hue: 220, saturation: 70 }, // Blue - Billing Issues
      { hue: 140, saturation: 70 }, // Green - Technical Support  
      { hue: 45, saturation: 85 },  // Yellow - Account Management
      { hue: 0, saturation: 75 },   // Red - Product Inquiry
      { hue: 280, saturation: 70 }, // Purple - Service Complaint
      { hue: 25, saturation: 85 },  // Orange - Refund Request
      { hue: 200, saturation: 70 }  // Cyan - General Query
    ];
    
    const color = categoryColors[categoryIndex % categoryColors.length];
    const lightness = 85 - (50 * intensity);
    return `hsl(${color.hue}, ${color.saturation}%, ${lightness}%)`;
  }
  
  // For general tab, use blue gradient
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
  categoryIndex?: number;
}

const HeatmapCell = ({ value, maxValue, label, hour, categoryIndex }: HeatmapCellProps) => {
  return (
    <UITooltip delayDuration={0}>
      <TooltipTrigger>
        <div
          className="w-12 h-10 rounded border border-border/30 cursor-pointer transition-all duration-200 hover:border-primary hover:scale-105 hover:shadow-md hover:z-10"
          style={{ backgroundColor: getHeatmapColor(value, maxValue, categoryIndex) }}
        />
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-popover border-border">
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-muted-foreground">{hour}</p>
          <p className="font-bold text-primary">{value} calls</p>
        </div>
      </TooltipContent>
    </UITooltip>
  );
};

interface ReportWeeklyTrendsProps {
  onBack: () => void;
}

export default function ReportWeeklyTrends({ onBack }: ReportWeeklyTrendsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [generalData, setGeneralData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setGeneralData(generateGeneralHeatmapData());
      setCategoryData(generateCategoryHeatmapData());
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [dateRange]); // Reload data when date range changes

  useEffect(() => {
    // Update filter count
    setNumberOfFilters(dateRange ? 1 : 0);
  }, [dateRange]);

  const maxGeneralValue = Math.max(...generalData.map(d => d.value), 1);
  const maxCategoryValue = Math.max(...categoryData.map(d => d.value), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-10 w-10 rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Weekly Traffic Trends
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Analyze weekly traffic patterns and trends
                </p>
              </div>
            </div>
            <Button
              variant={filtersOpen ? "default" : "outline"}
              size="icon"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="relative h-9 w-9"
            >
              <Filter className="h-4 w-4" />
              {numberOfFilters > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {numberOfFilters}
                </Badge>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Collapsible Filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="min-w-[200px]">
                  <DateRangeFilter 
                    value={dateRange} 
                    onChange={setDateRange} 
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general" className="flex items-center gap-2">
                General
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Overall traffic trends for the week</p>
                  </TooltipContent>
                </UITooltip>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                Categories
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Traffic breakdown by category</p>
                  </TooltipContent>
                </UITooltip>
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="mt-6">
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

            {/* Categories Tab */}
            <TabsContent value="categories" className="mt-6">
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
                                  categoryIndex={catIndex}
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
    </motion.div>
  );
}
