import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Filter, Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar } from "recharts";

interface HourlyData {
  hour: string;
  day: string;
  value: number;
}

// Days of the week
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

// Generate mock heatmap data for general tab
const generateGeneralHeatmapData = (): HourlyData[] => {
  const data: HourlyData[] = [];
  DAYS.forEach((day) => {
    HOURS.forEach((hour) => {
      // Simulate higher traffic during business hours
      const hourNum = parseInt(hour);
      let baseValue = Math.floor(Math.random() * 30) + 10;
      if (hourNum >= 9 && hourNum <= 17) {
        baseValue += Math.floor(Math.random() * 50) + 30;
      }
      if (day === "Sat" || day === "Sun") {
        baseValue = Math.floor(baseValue * 0.5);
      }
      data.push({ hour, day, value: baseValue });
    });
  });
  return data;
};

// Generate mock data for categories tab
const generateCategoriesHeatmapData = (): HourlyData[] => {
  const data: HourlyData[] = [];
  const categories = ["Billing", "Support", "Sales", "General", "Technical"];
  DAYS.forEach((day) => {
    categories.forEach((category, index) => {
      const value = Math.floor(Math.random() * 80) + 20 + (index * 10);
      data.push({ hour: category, day, value });
    });
  });
  return data;
};

const generalHeatmapData = generateGeneralHeatmapData();
const categoriesHeatmapData = generateCategoriesHeatmapData();

// Convert heatmap data to bar chart format for display
const generalBarData = DAYS.map(day => {
  const dayData = generalHeatmapData.filter(d => d.day === day);
  const total = dayData.reduce((sum, d) => sum + d.value, 0);
  return { day, calls: total };
});

const categoriesBarData = ["Billing", "Support", "Sales", "General", "Technical"].map(category => {
  const categoryData = categoriesHeatmapData.filter(d => d.hour === category);
  const total = categoryData.reduce((sum, d) => sum + d.value, 0);
  return { category, calls: total };
});

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];

interface WeeklyTrendsAndPatternsProps {
  onBack?: () => void;
}

export function WeeklyTrendsAndPatterns({ onBack }: WeeklyTrendsAndPatternsProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState("this-week");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="overflow-hidden rounded-md shadow-lg border-0 bg-background/95 backdrop-blur-sm">
          <div className="px-3 py-2 bg-primary text-primary-foreground text-sm font-semibold">
            {label}
          </div>
          <div className="px-3 py-2 text-sm">
            <div className="text-muted-foreground">
              Calls: <span className="font-semibold text-foreground">{payload[0].value}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold">Weekly Trends & Patterns</CardTitle>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Analyze call patterns across different days and hours of the week</p>
                  </TooltipContent>
                </UITooltip>
              </div>
              <p className="text-sm text-muted-foreground">
                Hourly call distribution patterns throughout the week
              </p>
            </div>
          </div>
          
          <Button
            variant={filtersOpen ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {dateRange !== "this-week" && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                1
              </Badge>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters Panel */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleContent>
            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-2-weeks">Last 2 Weeks</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button variant="default" size="sm">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="general" className="flex items-center gap-1">
              General
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Overall call volume trends by day</p>
                </TooltipContent>
              </UITooltip>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-1">
              Categories
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Call distribution by category</p>
                </TooltipContent>
              </UITooltip>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={generalBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
                    {generalBarData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoriesBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
                    {categoriesBarData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
