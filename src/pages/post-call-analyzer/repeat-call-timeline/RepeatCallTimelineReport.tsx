import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip, Row, Col } from "antd";
import { 
  IconInfoCircle, 
  IconRefresh, 
  IconCalendar, 
  IconList,
  IconChartLine,
  IconPhone,
  IconClock,
  IconTarget,
  IconUser
} from "@tabler/icons-react";
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
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle" orientation="horizontal">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconChartLine className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-lg !font-semibold">
                    7 Day Repeat Call Timeline
                  </Title>
                  <Tooltip title="Track repeat callers over the past 7 days">
                    <div className="-mt-1">
                      <TablerIcon 
                        name="info-circle" 
                        className="wn-tabler-14"
                        size={14}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" className="text-sm">
                  Jun 19 - Jun 25, 2025
                </Text>
              </div>
            </Space>
            
            <Space size="small" orientation="horizontal">
              <DatePicker 
                suffixIcon={<IconCalendar />}
                className="rounded-lg"
              />
              <Button 
                type="text" 
                icon={<IconRefresh />}
                onClick={handleReload}
                className="w-9 h-9"
              />
              <Button 
                type="text" 
                icon={<IconList />}
                className="w-9 h-9"
              />
            </Space>
          </div>
        </div>
        {/* Stat Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              label="Daily Repeat Rate"
              value={`${dailyRepeatRate}%`}
              icon={<IconTarget />}
              color="#3b82f6"
              gradientColors={["#3b82f6", "#2563eb"] as [string, string]}
              isLoading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              label="Most Affected Category"
              value={mostAffectedCategory}
              icon={<IconPhone />}
              color="#ef4444"
              gradientColors={["#ef4444", "#dc2626"] as [string, string]}
              isLoading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              label="Total Repeat Calls"
              value={timelineData.reduce((sum, day) => sum + day.repeatCalls, 0).toString()}
              icon={<IconClock />}
              color="#f59e0b"
              gradientColors={["#f59e0b", "#d97706"] as [string, string]}
              isLoading={loading}
            />
          </Col>
        </Row>

        {/* Main Timeline Chart */}
        <div className="mb-6">
          {loading ? (
            <div className="flex items-center justify-center h-[350px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
        <div className="mt-8">
          <ReasonWiseRepeatCall />
          <CategoryWiseRepeatCall />
          <AgentRepeatCallHandling />
        </div>
      </Space>
    </Card>
  );
}
