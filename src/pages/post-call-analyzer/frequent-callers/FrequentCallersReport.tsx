import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip } from "antd";
import { 
  LeftOutlined, 
  InfoCircleOutlined, 
  ReloadOutlined, 
  CalendarOutlined, 
  UnorderedListOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip as RechartsTooltip } from "recharts";

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
  '#311B92',
  '#4527A0',
  '#512DA8',
  '#5E35B1',
  '#673AB7',
  '#7E57C2',
  '#9575CD',
  '#B39DDB',
  '#D1C4E9',
  '#EDE7F6',
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

export default function FrequentCallersReport() {
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
    const timer = setTimeout(() => {
      setChartData(mockFrequentCallersData);
      setColors(getAdjustedColors(mockFrequentCallersData));
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
                <PhoneOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                    Frequent Callers
                  </Title>
                  <Tooltip title="Top callers by call frequency">
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
                placeholder="Select date"
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
        
        <div style={{ marginTop: 16 }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
              <div style={{ 
                animation: 'spin 1s linear infinite',
                borderRadius: '50%',
                height: '32px',
                width: '32px',
                borderBottom: '2px solid #1890ff'
              }}></div>
            </div>
          ) : chartData.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#8c8c8c' }}>
              <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: 8 }}>No Data Available</p>
              <p style={{ fontSize: '14px' }}>No frequent callers found for the selected period</p>
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart 
                data={chartData} 
                layout="vertical" 
                margin={{ top: 5, right: 30, left: 100, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(value) => Math.floor(value).toString()}
                />
                <YAxis 
                  type="category"
                  dataKey="msisdn" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  width={100}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value, 'Call Count']}
                />
                <Bar 
                  dataKey="callCount" 
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            </div>
          )}
        </div>
      </Space>
    </Card>
  );
}
