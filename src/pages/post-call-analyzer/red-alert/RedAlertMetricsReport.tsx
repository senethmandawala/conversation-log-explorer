import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Treemap, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

// Custom Tooltip Components
const TreemapTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">Value: {data.value}</p>
        <p className="text-sm text-muted-foreground">Percentage: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

const BarChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">Value: {data.value}</p>
      </div>
    );
  }
  return null;
};

// Mock Call Logs Component
const RedAlertCallLogs = ({ category, subCategory }: { category: string; subCategory: string }) => {
  const mockLogs = [
    { id: 1, time: "10:30 AM", duration: "5:23", status: "Completed" },
    { id: 2, time: "11:15 AM", duration: "3:45", status: "Dropped" },
    { id: 3, time: "02:00 PM", duration: "8:12", status: "Completed" },
    { id: 4, time: "03:30 PM", duration: "2:56", status: "Completed" },
  ];

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {mockLogs.map((log) => (
        <div key={log.id} className="p-2 bg-muted/30 rounded-lg text-sm">
          <div className="flex justify-between">
            <span>{log.time}</span>
            <span className="text-muted-foreground">{log.duration}</span>
          </div>
          <div className="text-muted-foreground">{log.status}</div>
        </div>
      ))}
    </div>
  );
};

// Colors matching Angular environment.colors
const COLORS = [
  "#4285F4", "#34A853", "#FBBC04", "#EA4335", "#9C27B0",
  "#FF5722", "#00BCD4", "#8BC34A", "#FFC107", "#E91E63"
];

// Mock data for red alert treemap
const mockRedAlertData = [
  { name: "Drop calls", value: 145, percentage: 28 },
  { name: "Repeat Calls", value: 128, percentage: 25 },
  { name: "Open Cases", value: 98, percentage: 19 },
  { name: "Package Churn", value: 87, percentage: 17 },
  { name: "Bad Practices", value: 55, percentage: 11 },
];

// Custom Treemap Content Component
const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill, percentage } = props;
  
  // Skip rendering if there's no valid name (this filters out the root node)
  if (!name) {
    return null;
  }
  
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
      {width > 60 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={14}
          fontWeight={600}
          style={{ pointerEvents: "none" }}
        >
          {percentage}%
        </text>
      )}
    </g>
  );
};

export default function RedAlertMetricsReport() {
  const [loading, setLoading] = useState(false);
  const [secondChartLoading, setSecondChartLoading] = useState(false);
  const [thirdChartLoading, setThirdChartLoading] = useState(false);
  
  const [showSecondChart, setShowSecondChart] = useState(false);
  const [showThirdChart, setShowThirdChart] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  
  const [redAlertData] = useState(mockRedAlertData);
  const [barChartData, setBarChartData] = useState<any[]>([]);

  const handleReload = () => {
    setLoading(true);
    setShowSecondChart(false);
    setShowThirdChart(false);
    setSelectedCategory("");
    setSelectedSubCategory("");
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleTreemapClick = (data: any) => {
    if (data?.name) {
      setSelectedCategory(data.name);
      setShowSecondChart(true);
      setShowThirdChart(false);
      setSelectedSubCategory("");
      loadSecondChartData(data.name);
    }
  };

  const loadSecondChartData = (category: string) => {
    setSecondChartLoading(true);
    
    // Mock data for bar chart based on category
    setTimeout(() => {
      const mockBarData = [
        { name: "Agent A", value: 45 },
        { name: "Agent B", value: 38 },
        { name: "Agent C", value: 32 },
        { name: "Agent D", value: 28 },
        { name: "Agent E", value: 22 },
        { name: "Agent F", value: 18 },
        { name: "Agent G", value: 15 },
        { name: "Agent H", value: 12 },
      ];
      setBarChartData(mockBarData);
      setSecondChartLoading(false);
    }, 300);
  };

  const handleBarClick = (data: any) => {
    if (data?.name) {
      setSelectedSubCategory(data.name);
      setShowThirdChart(true);
      setThirdChartLoading(false);
    }
  };

  const closeSecondChart = () => {
    setShowSecondChart(false);
    setShowThirdChart(false);
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  const closeThirdChart = () => {
    setShowThirdChart(false);
    setSelectedSubCategory("");
  };

  // Prepare treemap data with colors
  const treemapData = redAlertData.map((item, idx) => ({
    ...item,
    fill: COLORS[idx % COLORS.length],
  }));

  // Get column classes based on drill-down state
  const getFirstChartCol = () => {
    if (showThirdChart) return "col-12 md:col-span-4";
    if (showSecondChart) return "col-12 md:col-span-6";
    return "col-12";
  };

  const getSecondChartCol = () => {
    if (showThirdChart) return "col-12 md:col-span-4";
    return "col-12 md:col-span-6";
  };

  // Generate shades for bar chart
  const getBarChartColors = () => {
    const categoryIndex = redAlertData.findIndex(item => item.name === selectedCategory);
    const baseColor = COLORS[categoryIndex % COLORS.length];
    return barChartData.map((_, idx) => {
      const factor = 1 - (idx * 0.08);
      return baseColor + Math.round(Math.max(0.5, factor) * 255).toString(16).padStart(2, '0');
    });
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">Red Alert Metrics</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Highlighting key areas that require immediate attention</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm text-muted-foreground">Highlighting key areas that require immediate attention</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={handleReload}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {/* Treemap Chart - First Level */}
            <div className={showThirdChart ? "col-span-12 md:col-span-4" : showSecondChart ? "col-span-12 md:col-span-6" : "col-span-12"}>
              <ResponsiveContainer width="100%" height={350}>
                <Treemap
                  data={treemapData}
                  dataKey="value"
                  stroke="white"
                  fill="hsl(226, 70%, 55%)"
                  content={<CustomTreemapContent />}
                  onClick={handleTreemapClick}
                >
                  <RechartsTooltip content={<TreemapTooltip />} />
                </Treemap>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {treemapData.filter(item => item.value > 0).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm flex-shrink-0" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground text-center mt-3 py-2 bg-muted/30 rounded-lg">
                <span className="font-medium text-primary">Note:</span> Data is based on the selected date range
              </p>
            </div>

            {/* Bar Chart - Second Level */}
            {showSecondChart && (
              <div className={showThirdChart ? "col-span-12 md:col-span-4" : "col-span-12 md:col-span-6"}>
                <div className="border border-border/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{selectedCategory}</p>
                      <h5 className="text-base font-semibold">
                        {selectedCategory === 'Open Cases' || selectedCategory === 'Drop calls' 
                          ? 'Top Agents' 
                          : 'Reasons for ' + selectedCategory}
                      </h5>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={closeSecondChart}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {secondChartLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            className="text-xs" 
                            axisLine={false} 
                            tickLine={false}
                            hide
                          />
                          <YAxis 
                            className="text-xs" 
                            axisLine={false} 
                            tickLine={false}
                          />
                          <RechartsTooltip content={<BarChartTooltip />} />
                          <Bar 
                            dataKey="value" 
                            radius={[6, 6, 0, 0]}
                            onClick={handleBarClick}
                            style={{ cursor: 'pointer' }}
                          >
                            {barChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getBarChartColors()[index]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <p className="text-sm text-muted-foreground text-center mt-2 py-2 bg-muted/30 rounded-lg">
                        <span className="font-medium text-primary">Note:</span> Data is based on the selected date range
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Call Logs - Third Level */}
            {showThirdChart && (
              <div className="col-span-12 md:col-span-4">
                <div className="border border-border/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{selectedCategory} / {selectedSubCategory}</p>
                      <h5 className="text-base font-semibold">Call Logs</h5>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={closeThirdChart}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {thirdChartLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <RedAlertCallLogs 
                      category={selectedCategory}
                      subCategory={selectedSubCategory}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
