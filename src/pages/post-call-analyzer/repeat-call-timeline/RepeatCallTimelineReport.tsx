import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip, Row, Col } from "antd";
import { 
  InfoCircleOutlined, 
  ReloadOutlined, 
  CalendarOutlined, 
  UnorderedListOutlined,
  LineChartOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  AimOutlined,
  UserOutlined
} from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";
import { LineChartTooltip } from "@/components/ui/custom-chart-tooltip";
import { ReasonWiseRepeatCall } from "./ReasonWiseRepeatCall.tsx";
import { CategoryWiseRepeatCall } from "./CategoryWiseRepeatCall.tsx";
import { AgentRepeatCallHandling } from "./AgentRepeatCallHandling.tsx";

const { Title, Text } = Typography;

// Mock data for the main timeline chart
const generateTimelineData = () => {
  const days = ['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'];
  return days.map(day => ({
    date: day,
    totalCalls: Math.floor(Math.random() * 50) + 70,
    repeatCalls: Math.floor(Math.random() * 20) + 15,
    uniqueCustomers: Math.floor(Math.random() * 40) + 50,
  }));
};

export default function RepeatCallTimelineReport() {
  const [loading, setLoading] = useState(false);
  const [timelineData, setTimelineData] = useState(generateTimelineData());
  const [dailyRepeatRate, setDailyRepeatRate] = useState("23.5");
  const [mostAffectedCategory, setMostAffectedCategory] = useState("Billing Issues");

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setTimelineData(generateTimelineData());
      setDailyRepeatRate((Math.random() * 30 + 15).toFixed(1));
      setLoading(false);
    }, 500);
  };

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
            <Space align="center" size="middle" orientation="horizontal">
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
                <LineChartOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    7 Day Repeat Call Timeline
                  </Title>
                  <Tooltip title="Track repeat callers over the past 7 days">
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
                  Jun 19 - Jun 25, 2025
                </Text>
              </div>
            </Space>
            
            <Space size="small" orientation="horizontal">
              <DatePicker 
                suffixIcon={<CalendarOutlined />}
                style={{ 
                  borderRadius: 8,
                  borderColor: '#d9d9d9'
                }}
              />
              <Button 
                type="text" 
                icon={<ReloadOutlined />}
                onClick={handleReload}
                style={{ width: 36, height: 36 }}
              />
              <Button 
                type="text" 
                icon={<UnorderedListOutlined />}
                style={{ width: 36, height: 36 }}
              />
            </Space>
          </div>
        </div>
        {/* Stat Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              label="Daily Repeat Rate"
              value={`${dailyRepeatRate}%`}
              icon={<AimOutlined />}
              color="#3b82f6"
              gradientColors={["#3b82f6", "#2563eb"] as [string, string]}
              isLoading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              label="Most Affected Category"
              value={mostAffectedCategory}
              icon={<PhoneOutlined />}
              color="#ef4444"
              gradientColors={["#ef4444", "#dc2626"] as [string, string]}
              isLoading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              label="Total Repeat Calls"
              value={timelineData.reduce((sum, day) => sum + day.repeatCalls, 0).toString()}
              icon={<ClockCircleOutlined />}
              color="#f59e0b"
              gradientColors={["#f59e0b", "#d97706"] as [string, string]}
              isLoading={loading}
            />
          </Col>
        </Row>

        {/* Main Timeline Chart */}
        <div style={{ marginBottom: 24 }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 350 }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                border: '2px solid #1890ff', 
                borderTop: '2px solid transparent', 
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  style={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  style={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <RechartsTooltip content={<LineChartTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalCalls" 
                  stroke="#737FC4" 
                  strokeWidth={3}
                  dot={{ fill: "#737FC4", strokeWidth: 0, r: 4 }}
                  name="Total Calls"
                />
                <Line 
                  type="monotone" 
                  dataKey="repeatCalls" 
                  stroke="#83C180" 
                  strokeWidth={3}
                  dot={{ fill: "#83C180", strokeWidth: 0, r: 4 }}
                  name="Repeat Calls"
                />
                <Line 
                  type="monotone" 
                  dataKey="uniqueCustomers" 
                  stroke="#F5AF4E" 
                  strokeWidth={3}
                  dot={{ fill: "#F5AF4E", strokeWidth: 0, r: 4 }}
                  name="Unique Customers"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sub-reports */}
        <div style={{ marginTop: 32 }}>
          <ReasonWiseRepeatCall />
          <CategoryWiseRepeatCall />
          <AgentRepeatCallHandling />
        </div>
      </Space>
    </Card>
  );
}
