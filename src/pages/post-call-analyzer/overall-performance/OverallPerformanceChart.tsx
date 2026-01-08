import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Tooltip } from "antd";
import { BarChartOutlined, CalendarOutlined } from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { 
  fetchOverallPerformance, 
  type OverallPerformanceResponse 
} from "@/lib/api";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const { Title, Text } = Typography;

// Chart config for the performance chart
const chartConfig = {
  calls: { label: "Calls", color: "hsl(226, 70%, 55%)" },
  resolved: { label: "Resolved", color: "hsl(142, 71%, 45%)" },
  fulfilled: { label: "Fulfilled", color: "hsl(38, 92%, 50%)" },
};

// Helper to transform API performance data to chart format (same as in PostCallDashboard)
const transformPerformanceData = (performance: OverallPerformanceResponse['overallPerformance']) => {
  const resolvedSeries = performance.series.find(s => s.name === 'Resolved');
  const failedSeries = performance.series.find(s => s.name === 'Fail Calls');
  const fulfilledSeries = performance.series.find(s => s.name === 'Fulfilled');
  
  if (!resolvedSeries) return [];
  
  return resolvedSeries.data.map((point, index) => {
    const date = new Date(point.x);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      name: dayName,
      calls: failedSeries?.data[index]?.y || 0,
      resolved: point.y,
      fulfilled: fulfilledSeries?.data[index]?.y || 0,
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

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const performanceResponse = await fetchOverallPerformance();

        // Transform and set performance data (same logic as PostCallDashboard)
        if (performanceResponse?.overallPerformance) {
          const transformedData = transformPerformanceData(performanceResponse.overallPerformance);
          if (transformedData.length > 0) {
            setPerformanceData(transformedData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
              suffixIcon={<CalendarOutlined />}
              style={{ 
                borderRadius: 8,
                borderColor: '#d9d9d9'
              }}
            />
          </div>
        </div>
        
        {/* Actual Chart Component */}
        <div style={{ marginTop: 30}}>
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
              name="Calls"
            />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              stroke="hsl(142, 71%, 45%)" 
              strokeWidth={2.5}
              dot={{ fill: "hsl(142, 71%, 45%)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
              name="Resolved"
            />
            <Line 
              type="monotone" 
              dataKey="fulfilled" 
              stroke="hsl(38, 92%, 50%)" 
              strokeWidth={2.5}
              dot={{ fill: "hsl(38, 92%, 50%)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
              name="Fulfilled"
            />
          </LineChart>
        </ChartContainer>
        </div>
      </Space>
    </Card>
  );
}
