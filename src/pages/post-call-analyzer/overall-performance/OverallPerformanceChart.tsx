import { useState, useEffect } from "react";
import { Card, Typography, Space, Tooltip, Button } from "antd";
import { BarChartOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { callRoutingApiService, type CommonResponse } from "@/services/callRoutingApiService";
import { ChartContainer, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import { useDate } from "@/contexts/DateContext";
import { useProjectSelection } from "@/services/projectSelectionService";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

// Custom tooltip component for the chart
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

// Chart config for the performance chart
const chartConfig = {
  calls: { label: "Open Calls", color: "hsl(226, 70%, 55%)" },
  resolved: { label: "Call Resolution", color: "hsl(142, 71%, 45%)" },
  fulfilled: { label: "Satisfaction", color: "hsl(38, 92%, 50%)" },
};

// Helper to transform API performance data to chart format
const transformPerformanceData = (apiData: any[]) => {
  if (!apiData || apiData.length === 0) {
    return defaultPerformanceData;
  }

  // Transform the API data to match the expected chart format
  return apiData.map((item) => {
    // Parse the call_date and format for display
    const date = new Date(item.call_date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return {
      name: formattedDate, // Use full date instead of just day name
      calls: item.open_calls || 0,
      resolved: item.avg_call_resolution ? parseFloat(item.avg_call_resolution) : 0, // No scaling
      fulfilled: item.avg_satisfaction ? parseFloat(item.avg_satisfaction) : 0, // No scaling
      // Additional metrics that could be useful
      droppedCalls: item.dropped_calls || 0,
      repeatCalls: item.repeat_calls || 0,
      avgDuration: item.avg_call_duration ? parseFloat(item.avg_call_duration) : 0,
      avgSilentTime: item.avg_silent_time ? parseFloat(item.avg_silent_time) : 0,
      avgWaitingTime: item.avg_waiting_time ? parseFloat(item.avg_waiting_time) : 0,
      churnPercentage: item.churn_percentage ? parseFloat(item.churn_percentage) : 0,
    };
  });
};

// Default fallback data (same as in PostCallDashboard)
const defaultPerformanceData = [
  { name: "Mon", calls: 0, resolved: 0 },
  { name: "Tue", calls: 0, resolved: 0 },
  { name: "Wed", calls: 0, resolved: 0 },
  { name: "Thu", calls: 0, resolved: 0 },
  { name: "Fri", calls: 0, resolved: 0 },
  { name: "Sat", calls: 0, resolved: 0 },
  { name: "Sun", calls: 0, resolved: 0 },
];

export default function OverallPerformanceChart() {
  const [performanceData, setPerformanceData] = useState(defaultPerformanceData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { globalDateRange, setGlobalDateRange } = useDate();
  const { selectedProject } = useProjectSelection();
  const navigate = useNavigate();

  // Handle date range change
  const handleDateRangeChange = (dateRange: any) => {
    setGlobalDateRange(dateRange);
  };

  // Handle reload
  const handleReload = () => {
    loadData();
  };

  // Handle go to insights
  const handleGoToInsights = () => {
    navigate('/pca/call-insight');
  };

  const loadData = async () => {
    setIsLoading(true);
    
    // Only proceed if we have a selected project
    if (!selectedProject) {
      setPerformanceData(defaultPerformanceData);
      setHasData(false);
      setIsLoading(false);
      return;
    }

    let fromTime, toTime;
    
    if (globalDateRange && globalDateRange.fromDate && globalDateRange.toDate) {
      // Use the formatted date strings from DatePicker (already in correct format)
      fromTime = globalDateRange.fromDate;
      toTime = globalDateRange.toDate;
    } else {
      // Fallback to today
      const today = dayjs();
      fromTime = today.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      toTime = today.endOf('day').format('YYYY-MM-DDTHH:mm:ss');
    }

    // Get IDs from selected project - no fallbacks
    const tenantId = parseInt(selectedProject.tenant_id);
    const subtenantId = parseInt(selectedProject.sub_tenant_id);
    const companyId = parseInt(selectedProject.company_id);
    const departmentId = parseInt(selectedProject.department_id);

    const filters = {
      tenantId,
      subtenantId,
      companyId,
      departmentId,
      fromTime,
      toTime,
    };

    const response = await callRoutingApiService.overallPerformanceTrend(filters);

    // Check if response has data and transform it
    if (response?.data?.data && Array.isArray(response.data.data)) {
      if (response.data.data.length > 0) {
        const transformedData = transformPerformanceData(response.data.data);
        setPerformanceData(transformedData);
        setHasData(true);
      } else {
        // Handle empty data array
        setPerformanceData(defaultPerformanceData);
        setHasData(false);
      }
    } else {
      // Handle empty response
      setPerformanceData(defaultPerformanceData);
      setHasData(false);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    const loadDataWithErrorHandling = async () => {
      try {
        setHasError(false);
        await loadData();
      } catch (error) {
        console.error('Error in loadData:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadDataWithErrorHandling();
  }, [globalDateRange, selectedProject]); // Re-fetch when global date range or selected project changes

  return (
    <Card
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
                <BarChartOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    Overall Performance Chart
                  </Title>
                  <Tooltip title="Weekly performance trends and metrics">
                    <div style={{ marginTop: '-4px' }}>
                      <TablerIcon 
                        name="info-circle" 
                        className="wn-tabler-14"
                        size={14}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Weekly performance trends and metrics
                </Text>
              </div>
            </Space>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <DatePickerComponent
                onSelectedRangeValueChange={handleDateRangeChange}
                toolTipValue="Select date range for performance data"
                calenderType=""
                dateInput={globalDateRange}
              />
              <Tooltip title="Reload data">
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleReload}
                  loading={isLoading}
                  className="h-10 rounded-xl border-2 hover:border-primary/50 transition-all duration-200"
                />
              </Tooltip>
              <Tooltip title="Go to Insights">
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  onClick={handleGoToInsights}
                  className="h-10 rounded-xl border-2 hover:border-primary/50 transition-all duration-200"
                />
              </Tooltip>
            </div>
          </div>
        </div>
        
        {/* Actual Chart Component or Empty State */}
        <div style={{ marginTop: 30}}>
          {isLoading ? (
            <ExceptionHandleView type="loading" />
          ) : hasError ? (
            <ExceptionHandleView 
              type="500" 
              title="Error Loading Data"
              content="performance data"
              onTryAgain={() => {
                const loadData = async () => {
                  try {
                    setHasError(false);
                    await loadData();
                  } catch (error) {
                    console.error('Failed to fetch performance data:', error);
                    setHasError(true);
                    setIsLoading(false);
                  }
                };
                loadData();
              }}
            />
          ) : !hasData ? (
            <ExceptionHandleView 
              type="204" 
              title="No Performance Data"
              content="overall performance trends"
              onTryAgain={() => {
                const loadData = async () => {
                  try {
                    setHasError(false);
                    await loadData();
                  } catch (error) {
                    console.error('Failed to fetch performance data:', error);
                    setHasError(true);
                    setIsLoading(false);
                  }
                };
                loadData();
              }}
            />
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(226, 70%, 55%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(226, 70%, 55%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fulfilledGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                <XAxis dataKey="name" className="text-xs" axisLine={false} tickLine={false} />
                <YAxis 
                  className="text-xs" 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(value) => Math.round(value).toString()}
                />
                <ChartTooltip content={<CustomChartTooltip />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="hsl(226, 70%, 55%)" 
                  strokeWidth={2.5} 
                  dot={{ fill: "hsl(226, 70%, 55%)", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  name="Open Calls"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="hsl(142, 71%, 45%)" 
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(142, 71%, 45%)", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  name="Call Resolution"
                />
                <Line 
                  type="monotone" 
                  dataKey="fulfilled" 
                  stroke="hsl(38, 92%, 50%)" 
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(38, 92%, 50%)", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  name="Satisfaction"
                />
              </LineChart>
            </ChartContainer>
          )}
        </div>
      </Space>
    </Card>
  );
}
