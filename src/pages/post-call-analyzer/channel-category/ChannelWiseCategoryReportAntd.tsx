import { useState, useEffect } from "react";
import { Card, Typography, Tooltip, Spin, Empty, Button, Space } from "antd";
import { 
  InfoCircleOutlined, 
  CalendarOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const mockChannelData = [
  { channel: "Phone", billing: 120, technical: 85, account: 65, service: 45 },
  { channel: "Chat", billing: 95, technical: 110, account: 55, service: 38 },
  { channel: "Email", billing: 65, technical: 45, account: 80, service: 52 },
  { channel: "Social", billing: 28, technical: 35, account: 22, service: 18 },
];

const CHANNEL_COLORS = {
  billing: "#3b82f6",
  technical: "#10b981",
  account: "#f59e0b",
  service: "#8b5cf6",
};

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
            <span style={{ color: "hsl(var(--muted-foreground))", textTransform: "capitalize" }}>{entry.dataKey}:</span>
            <span style={{ fontWeight: 600 }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChannelWiseCategoryReportAntd() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(mockChannelData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockChannelData);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setData(mockChannelData);
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
                Channel Wise Category Distribution
              </Title>
              <Tooltip title="Call distribution across different channels">
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
          <Empty description="No channel data available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="channel" 
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
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))", textTransform: "capitalize" }}>{value}</span>
                )}
              />
              <Bar dataKey="billing" fill={CHANNEL_COLORS.billing} radius={[4, 4, 0, 0]} />
              <Bar dataKey="technical" fill={CHANNEL_COLORS.technical} radius={[4, 4, 0, 0]} />
              <Bar dataKey="account" fill={CHANNEL_COLORS.account} radius={[4, 4, 0, 0]} />
              <Bar dataKey="service" fill={CHANNEL_COLORS.service} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
}
