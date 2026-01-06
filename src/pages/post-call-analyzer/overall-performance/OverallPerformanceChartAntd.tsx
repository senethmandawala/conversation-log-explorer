import { useState, useEffect } from "react";
import { Card, Typography, Tooltip, Spin, Empty } from "antd";
import { InfoCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { motion } from "framer-motion";
import { fetchOverallPerformance, type OverallPerformanceResponse } from "@/lib/api";

const { Title, Text } = Typography;

// Helper to transform API performance data to chart format
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

const defaultPerformanceData = [
  { name: "Mon", calls: 0, resolved: 0, fulfilled: 0 },
  { name: "Tue", calls: 0, resolved: 0, fulfilled: 0 },
  { name: "Wed", calls: 0, resolved: 0, fulfilled: 0 },
  { name: "Thu", calls: 0, resolved: 0, fulfilled: 0 },
  { name: "Fri", calls: 0, resolved: 0, fulfilled: 0 },
  { name: "Sat", calls: 0, resolved: 0, fulfilled: 0 },
  { name: "Sun", calls: 0, resolved: 0, fulfilled: 0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 8,
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <Text strong style={{ display: "block", marginBottom: 8 }}>{label}</Text>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: entry.color,
              }}
            />
            <span style={{ color: "hsl(var(--muted-foreground))" }}>{entry.name}:</span>
            <span style={{ fontWeight: 600 }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function OverallPerformanceChartAntd() {
  const [performanceData, setPerformanceData] = useState(defaultPerformanceData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const performanceResponse = await fetchOverallPerformance();

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          border: "1px solid hsl(var(--border))",
        }}
        styles={{
          header: {
            borderBottom: "1px solid hsl(var(--border))",
            padding: "16px 20px",
          },
          body: { padding: "20px" },
        }}
        title={
          <div className="flex items-center gap-2">
            <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              Overall Performance Chart
            </Title>
            <Tooltip title="Weekly performance trends and metrics">
              <InfoCircleOutlined style={{ color: "hsl(var(--muted-foreground))", cursor: "help" }} />
            </Tooltip>
          </div>
        }
        extra={
          <div className="flex items-center gap-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            <CalendarOutlined />
            <span>This Week</span>
          </div>
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-[280px]">
            <Spin size="large" />
          </div>
        ) : performanceData.length === 0 ? (
          <Empty description="No performance data available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="callsGradientAntd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGradientAntd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: 16 }}
                formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>}
              />
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="#3b82f6" 
                strokeWidth={2.5} 
                dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                name="Fail Calls"
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10b981" 
                strokeWidth={2.5}
                dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                name="Resolved"
              />
              <Line 
                type="monotone" 
                dataKey="fulfilled" 
                stroke="#8b5cf6" 
                strokeWidth={2.5}
                dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                name="Fulfilled"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
}
