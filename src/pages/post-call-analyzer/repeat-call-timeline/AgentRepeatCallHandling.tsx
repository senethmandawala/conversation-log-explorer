import { useState } from "react";
import { Card, Typography, Space, Tooltip } from "antd";
import { IconInfoCircle, IconUser } from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";

const { Title, Text } = Typography;

const mockData = [
  { agent: "Agent A", handled: 45, resolved: 38 },
  { agent: "Agent B", handled: 42, resolved: 35 },
  { agent: "Agent C", handled: 38, resolved: 32 },
  { agent: "Lisa Anderson", handled: 32, resolved: 28 },
  { agent: "Agent E", handled: 32, resolved: 26 },
  { agent: "Agent F", handled: 28, resolved: 22 },
];

export function AgentRepeatCallHandling() {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4 mt-6">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="flex justify-between items-center w-full">
          <Space align="center" size="middle" orientation="horizontal">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white">
              <IconUser className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Title level={5} className="!m-0 !text-base !font-semibold">
                  Agent Repeat Call Handling
                </Title>
                <Tooltip title="Agent performance on handling repeat calls">
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
            <BarChart 
              data={mockData} 
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              layout="horizontal"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
              <XAxis 
                dataKey="agent" 
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
              <Bar dataKey="handled" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Handled" />
              <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} name="Resolved" />
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
