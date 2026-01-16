import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip } from "antd";
import { 
  IconArrowLeft, 
  IconInfoCircle, 
  IconRefresh, 
  IconCalendar, 
  IconList,
  IconPhone
} from "@tabler/icons-react";
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
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space direction="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle" orientation="horizontal">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconPhone className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-xl !font-semibold">
                    Frequent Callers
                  </Title>
                  <Tooltip title="Top callers by call frequency">
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
        
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
              <p className="text-lg font-medium mb-2">No Data Available</p>
              <p className="text-sm">No frequent callers found for the selected period</p>
            </div>
          ) : (
            <div className="mt-4">
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
