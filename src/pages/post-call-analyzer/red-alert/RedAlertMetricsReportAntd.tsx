import { useState, useEffect } from "react";
import { Card, Typography, Tooltip, Spin, Empty, Tag } from "antd";
import { InfoCircleOutlined, CalendarOutlined, AlertOutlined } from "@ant-design/icons";
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
import { fetchRedAlertMetrics } from "@/lib/api";

const { Title, Text } = Typography;

const ALERT_COLORS = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16"];

const mockRedAlertData = [
  { category: "Payment Issues", count: 45 },
  { category: "Service Outage", count: 38 },
  { category: "Account Lock", count: 32 },
  { category: "Fraud Alert", count: 28 },
  { category: "Escalation", count: 22 },
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
        <Text strong style={{ display: "block", marginBottom: 4 }}>{label}</Text>
        <div className="flex items-center gap-2 text-sm">
          <AlertOutlined style={{ color: "#ef4444" }} />
          <span style={{ color: "hsl(var(--muted-foreground))" }}>Alerts:</span>
          <span style={{ fontWeight: 600 }}>{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function RedAlertMetricsReportAntd() {
  const [data, setData] = useState(mockRedAlertData);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAlerts, setTotalAlerts] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchRedAlertMetrics();
        if (response?.redAlertMetrics?.data) {
          const transformedData = response.redAlertMetrics.data.map(item => ({
            category: item.category,
            count: item.count
          }));
          setData(transformedData);
          setTotalAlerts(transformedData.reduce((acc, item) => acc + item.count, 0));
        }
      } catch (error) {
        console.error('Failed to fetch red alert data:', error);
        setTotalAlerts(mockRedAlertData.reduce((acc, item) => acc + item.count, 0));
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
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 4,
                height: 32,
                borderRadius: 4,
                background: "linear-gradient(180deg, #ef4444 0%, #f97316 100%)",
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                  Red Alert Metrics
                </Title>
                <Tooltip title="Highlighting key areas that require immediate attention">
                  <InfoCircleOutlined style={{ color: "hsl(var(--muted-foreground))", cursor: "help" }} />
                </Tooltip>
                <Tag color="error" icon={<AlertOutlined />}>
                  {totalAlerts} Total
                </Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Critical issues requiring immediate action
              </Text>
            </div>
          </div>
        }
        extra={
          <div className="flex items-center gap-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            <CalendarOutlined />
            <span>Today</span>
          </div>
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-[280px]">
            <Spin size="large" />
          </div>
        ) : data.length === 0 ? (
          <Empty description="No red alerts" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="redAlertGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={ALERT_COLORS[index % ALERT_COLORS.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        <div 
          style={{ 
            marginTop: 16, 
            padding: "12px 16px", 
            background: "hsl(var(--muted))", 
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          <Text type="secondary">
            <strong style={{ color: "hsl(226, 70%, 55%)" }}>Note:</strong> Data is based on the selected date range. Review each category for detailed analysis.
          </Text>
        </div>
      </Card>
    </motion.div>
  );
}
