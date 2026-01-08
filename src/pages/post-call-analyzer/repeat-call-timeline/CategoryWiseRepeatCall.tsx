import { useState } from "react";
import { Card, Typography, Space, Tooltip } from "antd";
import { InfoCircleOutlined, BarChartOutlined } from "@ant-design/icons";
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
    <Card
      style={{
        borderRadius: 12,
        border: '1px solid #e8e8e8',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: 16,
        marginTop: 24
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
              <BarChartOutlined style={{ fontSize: 20 }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                  Category-wise Repeat Calls
                </Title>
                <Tooltip title="Repeat calls distribution across categories">
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
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
            <div style={{ 
              width: 32, 
              height: 32, 
              border: '2px solid #1890ff', 
              borderTop: '2px solid transparent', 
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#666' }}>
            No data available
          </div>
        )}
      </Space>
    </Card>
  );
}
