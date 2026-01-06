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
  Cell
} from "recharts";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const mockFrequentCallersData = [
  { msisdn: "+94771234567", callCount: 28 },
  { msisdn: "+94772345678", callCount: 22 },
  { msisdn: "+94773456789", callCount: 22 },
  { msisdn: "+94774567890", callCount: 19 },
  { msisdn: "+94775678901", callCount: 16 },
  { msisdn: "+94776789012", callCount: 14 },
  { msisdn: "+94777890123", callCount: 12 },
  { msisdn: "+94778901234", callCount: 11 },
  { msisdn: "+94779012345", callCount: 10 },
  { msisdn: "+94770123456", callCount: 10 },
];

const PURPLE_GRADIENT_COLORS = [
  '#311B92', '#4527A0', '#512DA8', '#5E35B1', '#673AB7',
  '#7E57C2', '#9575CD', '#B39DDB', '#D1C4E9', '#EDE7F6',
];

const getAdjustedColors = (data: { callCount: number }[]) => {
  const adjustedColors: string[] = [];
  let colorIndex = 0;
  
  data.forEach((item, index) => {
    if (index === 0) {
      adjustedColors.push(PURPLE_GRADIENT_COLORS[0]);
    } else {
      if (data[index].callCount === data[index - 1].callCount) {
        adjustedColors.push(PURPLE_GRADIENT_COLORS[colorIndex]);
      } else {
        colorIndex++;
        adjustedColors.push(PURPLE_GRADIENT_COLORS[colorIndex]);
      }
    }
  });
  
  return adjustedColors;
};

const CustomTooltip = ({ active, payload }: any) => {
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
        <Text strong style={{ display: "block", marginBottom: 4 }}>{payload[0].payload.msisdn}</Text>
        <div className="flex items-center gap-2 text-sm">
          <span style={{ color: "hsl(var(--muted-foreground))" }}>Call Count:</span>
          <span style={{ fontWeight: 600 }}>{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function FrequentCallersReportAntd() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(mockFrequentCallersData);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartData(mockFrequentCallersData);
      setColors(getAdjustedColors(mockFrequentCallersData));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setChartData(mockFrequentCallersData);
      setColors(getAdjustedColors(mockFrequentCallersData));
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
                Frequent Callers
              </Title>
              <Tooltip title="Top callers by call frequency">
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
          <div className="flex items-center justify-center h-[400px]">
            <Spin size="large" />
          </div>
        ) : chartData.length === 0 ? (
          <Empty description="No frequent callers found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart 
              data={chartData} 
              layout="vertical" 
              margin={{ top: 5, right: 30, left: 100, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => Math.floor(value).toString()}
              />
              <YAxis 
                type="category"
                dataKey="msisdn" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                width={100}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="callCount" radius={[0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
}
