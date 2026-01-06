import { useState, useEffect } from "react";
import { Card, Typography, Tooltip, Spin, Empty, Button, Space } from "antd";
import { 
  InfoCircleOutlined, 
  CalendarOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { Treemap, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const mockDurationData = [
  { name: "0-2 min", value: 245, color: "#3b82f6" },
  { name: "2-5 min", value: 380, color: "#10b981" },
  { name: "5-10 min", value: 290, color: "#f59e0b" },
  { name: "10-15 min", value: 165, color: "#8b5cf6" },
  { name: "15+ min", value: 88, color: "#ef4444" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
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
        <Text strong style={{ display: "block", marginBottom: 4 }}>{data.name}</Text>
        <div className="flex items-center gap-2 text-sm">
          <span style={{ color: "hsl(var(--muted-foreground))" }}>Calls:</span>
          <span style={{ fontWeight: 600 }}>{data.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, value, color } = props;
  
  if (width < 50 || height < 30) return null;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="hsl(var(--background))"
        strokeWidth={2}
        rx={6}
        ry={6}
      />
      <text
        x={x + width / 2}
        y={y + height / 2 - 8}
        textAnchor="middle"
        fill="#fff"
        fontSize={13}
        fontWeight={600}
      >
        {name}
      </text>
      <text
        x={x + width / 2}
        y={y + height / 2 + 10}
        textAnchor="middle"
        fill="rgba(255,255,255,0.8)"
        fontSize={11}
      >
        {value} calls
      </text>
    </g>
  );
};

export default function CallDurationReportAntd() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(mockDurationData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockDurationData);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setData(mockDurationData);
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
                Call Duration Distribution
              </Title>
              <Tooltip title="Distribution of calls by duration">
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
          <div className="flex items-center justify-center h-[350px]">
            <Spin size="large" />
          </div>
        ) : data.length === 0 ? (
          <Empty description="No duration data available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={data}
                dataKey="value"
                aspectRatio={4 / 3}
                content={<CustomTreemapContent />}
              >
                <RechartsTooltip content={<CustomTooltip />} />
              </Treemap>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {data.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: item.color,
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.name}: {item.value}
                  </Text>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}
