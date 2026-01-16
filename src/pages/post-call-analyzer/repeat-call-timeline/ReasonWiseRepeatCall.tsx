import { useState } from "react";
import { Card, Typography, Space, Tooltip } from "antd";
import { IconInfoCircle, IconChartBar } from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";

const { Title, Text } = Typography;

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const mockData = [
  { reason: "Technical Issue", count: 45, fill: COLORS[0] },
  { reason: "Billing Query", count: 38, fill: COLORS[1] },
  { reason: "Service Request", count: 32, fill: COLORS[2] },
  { reason: "Product Info", count: 28, fill: COLORS[3] },
  { reason: "Complaint", count: 22, fill: COLORS[4] },
];

export function ReasonWiseRepeatCall() {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4 mt-6">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="flex justify-between items-center w-full">
          <Space align="center" size="middle" orientation="horizontal">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white">
              <IconChartBar className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Title level={5} className="!m-0 !text-base !font-semibold">
                  Reason-wise Repeat Call
                </Title>
                <Tooltip title="Distribution of repeat calls by reason">
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
                dataKey="reason" 
                style={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                style={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
              />
              <RechartsTooltip content={<BarChartTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {mockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
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
