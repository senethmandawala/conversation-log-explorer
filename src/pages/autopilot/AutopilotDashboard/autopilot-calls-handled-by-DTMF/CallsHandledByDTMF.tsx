import { useState } from "react";
import { 
  Card, 
  Typography, 
  Space, 
  Skeleton,
  Tooltip
} from "antd";
import { 
  IconChartPie,
  IconInfoCircle
} from "@tabler/icons-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

const { Title, Text } = Typography;

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}
const mainChartData: ChartDataItem[] = [
  { name: "Payment Options", value: 145, color: "#22c55e" },
  { name: "Account Balance", value: 98, color: "#3b82f6" },
  { name: "Service Status", value: 76, color: "#eab308" },
  { name: "Appointment Booking", value: 54, color: "#8b5cf6" },
  { name: "General Queries", value: 32, color: "#06b6d4" },
  { name: "Technical Support", value: 28, color: "#f97316" },
];

export function CallsHandledByDTMF() {
  const [isLoading, setIsLoading] = useState(false);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = mainChartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(0);
      
      return (
        <div 
          style={{ 
            minWidth: 120, 
            borderRadius: 6,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            border: 'none',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              padding: '8px 12px', 
              backgroundColor: data.color, 
              color: 'white' 
            }}
          >
            {data.name}
          </div>
          <div style={{ padding: '8px 12px', backgroundColor: '#f5f5f5' }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>
              Count: <span style={{ fontWeight: 600, color: '#333' }}>{data.value}</span>
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              Percentage: <span style={{ fontWeight: 600, color: '#333' }}>{percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
        style={{ fontSize: '10px', fontWeight: 600 }}
      >
        {value}
      </text>
    );
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
            <Space align="center" size="middle">
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
                <IconChartPie style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    Calls Handled by DTMF
                  </Title>
                  <Tooltip title="Distribution of calls handled through DTMF input">
                    <div style={{ marginTop: '-4px' }}>
                      <IconInfoCircle 
                        style={{ fontSize: 14, color: '#64748b' }}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Distribution of calls handled through DTMF input
                </Text>
              </div>
            </Space>
          </div>
        </div>
        
        {/* Chart Content */}
        <div style={{ marginTop: 30 }}>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mainChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {mainChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip title={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </Space>
    </Card>
  );
}
