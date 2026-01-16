import { useState } from "react";
import { Card, Typography, Space, Tooltip } from "antd";
import { IconInfoCircle, IconChartBar } from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";

const { Title, Text } = Typography;

const mockData = [
  { category: "Billing", repeatCalls: 52, totalCalls: 120 },
  { category: "Technical", repeatCalls: 45, totalCalls: 98 },
  { category: "Account", repeatCalls: 38, totalCalls: 85 },
  { category: "Service", repeatCalls: 32, totalCalls: 76 },
  { category: "General Inquiry", repeatCalls: 18, totalCalls: 95 },
];

export function CategoryWiseRepeatCall() {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4 mt-6">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="flex justify-between items-center w-full">
          <Space align="center" size="middle" orientation="horizontal">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white">
              <IconChartBar className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Title level={5} className="!m-0 !text-base !font-semibold">
                  Category-wise Repeat Calls
                </Title>
                <Tooltip title="Repeat calls distribution across categories">
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
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : mockData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
              <XAxis 
                dataKey="category" 
                style={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
              />
              <YAxis 
                style={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
              />
              <RechartsTooltip content={<BarChartTooltip />} />
              <Bar dataKey="repeatCalls" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Repeat Calls" />
              <Bar dataKey="totalCalls" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Total Calls" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No data available
          </div>
        )}
      </Space>
    </Card>
  );
}
