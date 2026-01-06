import { useState, useEffect } from "react";
import { Card, Typography, Tooltip, Spin, Empty, Button, Space } from "antd";
import { 
  InfoCircleOutlined, 
  CalendarOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { motion } from "framer-motion";
import { CategoryWiseRepeatCall } from "./CategoryWiseRepeatCall";
import { AgentRepeatCallHandling } from "./AgentRepeatCallHandling";

const { Title, Text } = Typography;

const mockTimelineData = [
  { day: "Day 1", repeatCalls: 45, totalCalls: 120 },
  { day: "Day 2", repeatCalls: 52, totalCalls: 135 },
  { day: "Day 3", repeatCalls: 38, totalCalls: 110 },
  { day: "Day 4", repeatCalls: 65, totalCalls: 155 },
  { day: "Day 5", repeatCalls: 48, totalCalls: 128 },
  { day: "Day 6", repeatCalls: 32, totalCalls: 95 },
  { day: "Day 7", repeatCalls: 58, totalCalls: 145 },
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

export default function RepeatCallTimelineReportAntd() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(mockTimelineData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockTimelineData);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setData(mockTimelineData);
      setLoading(false);
    }, 500);
  };

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
          <div>
            <div className="flex items-center gap-2">
              <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                7 Day Repeat Call Timeline
              </Title>
              <Tooltip title="Track repeat callers over the past 7 days">
                <InfoCircleOutlined style={{ color: "hsl(var(--muted-foreground))", cursor: "help" }} />
              </Tooltip>
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Jun 19 - Jun 25, 2025
            </Text>
          </div>
        }
        extra={
          <Space>
            <Button type="text" icon={<CalendarOutlined />}>Week</Button>
            <Button type="text" icon={<ReloadOutlined />} onClick={handleReload} />
          </Space>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : data.length === 0 ? (
          <Empty description="No repeat call data available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="repeatGradientAntd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="totalGradientAntd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="day" 
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
                <Area 
                  type="monotone" 
                  dataKey="totalCalls" 
                  stroke="#3b82f6" 
                  fill="url(#totalGradientAntd)"
                  strokeWidth={2}
                  name="Total Calls"
                />
                <Area 
                  type="monotone" 
                  dataKey="repeatCalls" 
                  stroke="#8b5cf6" 
                  fill="url(#repeatGradientAntd)"
                  strokeWidth={2}
                  name="Repeat Calls"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Sub-charts */}
            <CategoryWiseRepeatCall />
            <AgentRepeatCallHandling />
          </>
        )}
      </Card>
    </motion.div>
  );
}
