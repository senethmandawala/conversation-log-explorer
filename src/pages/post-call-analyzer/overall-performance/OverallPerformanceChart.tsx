import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Tooltip } from "antd";
import { BarChartOutlined, CalendarOutlined } from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { callRoutingApiService, type CommonResponse } from "@/services/callRoutingApiService";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import dayjs from "dayjs";

const { Title, Text } = Typography;

// Chart config for the performance chart
const chartConfig = {
  calls: { label: "Open Calls", color: "hsl(226, 70%, 55%)" },
  resolved: { label: "Call Resolution (x10)", color: "hsl(142, 71%, 45%)" },
  fulfilled: { label: "Satisfaction (x10)", color: "hsl(38, 92%, 50%)" },
};

// Helper to transform API performance data to chart format
const transformPerformanceData = (apiData: any[]) => {
  if (!apiData || apiData.length === 0) {
    return defaultPerformanceData;
  }

  // Transform the API data to match the expected chart format
  return apiData.map((item) => {
    // Parse the call_date and get day name
    const date = new Date(item.call_date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    return {
      name: dayName,
      calls: item.open_calls || 0,
      resolved: item.avg_call_resolution ? parseFloat(item.avg_call_resolution) * 10 : 0, // Scale for visibility
      fulfilled: item.avg_satisfaction ? parseFloat(item.avg_satisfaction) * 10 : 0, // Scale for visibility
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
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Prepare filters with the required parameters
        const filters = {
          tenantId: 2,
          subtenantId: 2,
          companyId: 2,
          departmentId: 11,
          fromTime: selectedDate ? selectedDate.startOf('day').toISOString() : dayjs().startOf('day').toISOString(),
          toTime: selectedDate ? selectedDate.endOf('day').toISOString() : dayjs().endOf('day').toISOString(),
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
            console.log('No performance data available');
            setPerformanceData(defaultPerformanceData);
            setHasData(false);
          }
        } else {
          // Handle empty response
          console.log('No performance data available');
          setPerformanceData(defaultPerformanceData);
          setHasData(false);
        }
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
        setPerformanceData(defaultPerformanceData);
        setHasData(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedDate]); // Re-fetch when date changes

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
            
            <DatePicker 
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              format="YYYY-MM-DD"
              placeholder="Select date"
              suffixIcon={<CalendarOutlined />}
              style={{ 
                borderRadius: 8,
                borderColor: '#d9d9d9'
              }}
            />
          </div>
        </div>
        
        {/* Actual Chart Component or Empty State */}
        <div style={{ marginTop: 30}}>
          {isLoading ? (
            <ExceptionHandleView type="loading" />
          ) : !hasData ? (
            <ExceptionHandleView 
              type="204" 
              title="No Performance Data"
              content="overall performance trends"
              onTryAgain={() => {
                const loadData = async () => {
                  setIsLoading(true);
                  try {
                    const filters = {
                      tenantId: 2,
                      subtenantId: 2,
                      companyId: 2,
                      departmentId: 11,
                      fromTime: selectedDate ? selectedDate.startOf('day').toISOString() : dayjs().startOf('day').toISOString(),
                      toTime: selectedDate ? selectedDate.endOf('day').toISOString() : dayjs().endOf('day').toISOString(),
                    };

                    const response = await callRoutingApiService.overallPerformanceTrend(filters);

                    if (response?.data?.data && Array.isArray(response.data.data)) {
                      if (response.data.data.length > 0) {
                        const transformedData = transformPerformanceData(response.data.data);
                        setPerformanceData(transformedData);
                        setHasData(true);
                      }
                    }
                  } catch (error) {
                    console.error('Failed to fetch performance data:', error);
                  } finally {
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
                <YAxis className="text-xs" axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
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
                  name="Call Resolution (x10)"
                />
                <Line 
                  type="monotone" 
                  dataKey="fulfilled" 
                  stroke="hsl(38, 92%, 50%)" 
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(38, 92%, 50%)", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  name="Satisfaction (x10)"
                />
              </LineChart>
            </ChartContainer>
          )}
        </div>
      </Space>
    </Card>
  );
}
