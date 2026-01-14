import { Button, Tooltip, Space } from "antd";
import { BarChartOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import { useReportDataFetch, type ReportFilters } from "@/hooks/useReportDataFetch";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Get colors from env.js
const categoryColors = (window as any).env_vars?.colors;

// Custom legend component with Tailwind styling
const CustomChartLegend = ({ config }: any) => {
  if (!config || Object.keys(config).length === 0) return null;
  
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {Object.entries(config).map(([key, entry]: [string, any]) => (
        <div key={key} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.label}</span>
        </div>
      ))}
    </div>
  );
};

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="z-50 overflow-hidden rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm text-card-foreground shadow-xl backdrop-blur-sm">
        <div className="space-y-1">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
                {entry.name}: {Math.round(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Helper to transform API performance data to chart format dynamically
const transformPerformanceData = (response: any) => {
  const apiData = response?.data?.data;
  if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }

  // Get all keys except call_date from the first item to determine categories
  const firstItem = apiData[0];
  const categories = Object.keys(firstItem).filter(key => key !== 'call_date');
  
  // Transform the API data to match the expected chart format
  return apiData.map((item: any) => {
    // Parse the call_date and format for display
    const date = new Date(item.call_date);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const transformedItem: any = {
      name: formattedDate,
    };
    
    // Add all categories dynamically
    categories.forEach(category => {
      const value = item[category];
      transformedItem[category] = value ? Math.round(parseFloat(value)) : 0;
    });
    
    return transformedItem;
  });
};

// Helper to get chart config dynamically based on data
const getChartConfig = (data: any[]) => {
  if (!data || data.length === 0) {
    return {};
  }
  
  // Get all keys except name from the first data item
  const categories = Object.keys(data[0]).filter(key => key !== 'name');
  const config: any = {};
  
  categories.forEach((category, index) => {
    // Use colors from env.js, cycling through if needed
    const colorIndex = index % (categoryColors?.length || 18);
    config[category] = {
      label: category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' '),
      color: categoryColors?.[colorIndex] || `hsl(${index * 30}, 70%, 50%)`
    };
  });
  
  return config;
};

// Fetch function for the hook
const fetchOverallPerformance = async (filters: ReportFilters) => {
  return callRoutingApiService.overallPerformanceTrend(filters);
};

interface OverallPerformanceChartProps {
  initialData?: any[];
  isLoading?: boolean;
}

export default function OverallPerformanceChart({ 
  initialData, 
  isLoading: propIsLoading 
}: OverallPerformanceChartProps = {}) {
  const navigate = useNavigate();
  
  const {
    data: performanceData,
    isLoading: hookIsLoading,
    hasData,
    hasError,
    effectiveDateRange,
    dateInputForPicker,
    handleDateRangeChange,
    handleReload,
  } = useReportDataFetch({
    fetchFn: fetchOverallPerformance,
    transformFn: transformPerformanceData,
    initialData,
  });

  // Use prop loading state if provided, otherwise use hook state
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookIsLoading;

  // Handle go to insights
  const handleGoToInsights = () => {
    navigate('/pca/call-insight');
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ marginTop: -4 }}>
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 ml-4">
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
                <BarChartOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Overall Performance Chart
                  </h3>
                  <Tooltip title="Weekly performance trends and metrics">
                    <div className="-mt-1">
                      <TablerIcon 
                        name="info-circle" 
                        className="wn-tabler-14"
                        size={14}
                      />
                    </div>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground">
                  {effectiveDateRange?.dateRangeForDisplay || ''}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DatePickerComponent
                onSelectedRangeValueChange={handleDateRangeChange}
                toolTipValue="Select date range for performance data"
                calenderType=""
                dateInput={dateInputForPicker}
              />
              <Tooltip title="Reload data">
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleReload}
                  loading={isLoading}
                  className={cn(
                    "h-10 rounded-xl border-2 transition-all duration-200",
                    "hover:border-primary/50"
                  )}
                />
              </Tooltip>
              <Tooltip title="Go to Insights">
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  onClick={handleGoToInsights}
                  className={cn(
                    "h-10 rounded-xl border-2 transition-all duration-200",
                    "hover:border-primary/50"
                  )}
                />
              </Tooltip>
            </div>
          </div>
        </div>
        
        {/* Chart Section */}
        <div className="mt-12">
          {isLoading ? (
            <ExceptionHandleView type="loading" />
          ) : hasError ? (
            <ExceptionHandleView 
              type="500" 
              title="Error Loading Data"
              content="performance data"
              onTryAgain={handleReload}
            />
          ) : !hasData ? (
            <ExceptionHandleView 
              type="204" 
              title="No Performance Data"
              content="overall performance trends"
              onTryAgain={handleReload}
            />
          ) : (
            <div className="space-y-7">
              <ChartContainer config={getChartConfig(performanceData)} className="h-[300px] w-full">
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  {/* Dynamic gradients for each category */}
                  {Object.keys(getChartConfig(performanceData)).map((category, index) => {
                    const colorIndex = index % (categoryColors?.length || 18);
                    const color = categoryColors?.[colorIndex] || `hsl(${index * 30}, 70%, 50%)`;
                    return (
                      <linearGradient key={`${category}Gradient`} id={`${category}Gradient`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    );
                  })}
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" vertical={false} />
                  <XAxis dataKey="name" className="text-xs" axisLine={false} tickLine={false} />
                  <YAxis 
                    className="text-xs" 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => Math.round(value).toString()}
                  />
                  <ChartTooltip content={<CustomChartTooltip />} />
                  {/* Dynamic lines for each category */}
                  {Object.keys(getChartConfig(performanceData)).map((category, index) => {
                    const colorIndex = index % (categoryColors?.length || 18);
                    const color = categoryColors?.[colorIndex] || `hsl(${index * 30}, 70%, 50%)`;
                    const config = getChartConfig(performanceData)[category];
                    return (
                      <Line 
                        key={category}
                        type="monotone" 
                        dataKey={category} 
                        stroke={color} 
                        strokeWidth={2.5} 
                        dot={{ fill: color, strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                        name={config.label}
                      />
                    );
                  })}
                </LineChart>
              </ChartContainer>
              <CustomChartLegend config={getChartConfig(performanceData)} />
            </div>
          )}
        </div>
      </Space>
    </div>
  );
}
