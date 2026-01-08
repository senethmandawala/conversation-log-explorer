import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  Typography, 
  ConfigProvider,
  Button, 
  Badge,
  Space,
  Skeleton,
  DatePicker,
  Statistic
} from "antd";
import { 
  ArrowLeftOutlined, 
  DollarOutlined, 
  FilterOutlined
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface DateRangeValue {
  type: string;
  from: Date | null;
  to: Date | null;
  displayValue: string;
}

interface TokenUsageData {
  month: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

// Mock data - monthly token usage matching Angular
const mockTokenData: TokenUsageData[] = [
  { month: "Jan", inputTokens: 12500, outputTokens: 8200, totalTokens: 20700 },
  { month: "Feb", inputTokens: 15200, outputTokens: 9800, totalTokens: 25000 },
  { month: "Mar", inputTokens: 18400, outputTokens: 11500, totalTokens: 29900 },
  { month: "Apr", inputTokens: 14800, outputTokens: 9200, totalTokens: 24000 },
  { month: "May", inputTokens: 21000, outputTokens: 13500, totalTokens: 34500 },
  { month: "Jun", inputTokens: 19500, outputTokens: 12800, totalTokens: 32300 },
  { month: "Jul", inputTokens: 23400, outputTokens: 15200, totalTokens: 38600 },
  { month: "Aug", inputTokens: 25100, outputTokens: 16400, totalTokens: 41500 },
  { month: "Sep", inputTokens: 22800, outputTokens: 14900, totalTokens: 37700 },
  { month: "Oct", inputTokens: 28500, outputTokens: 18600, totalTokens: 47100 },
  { month: "Nov", inputTokens: 26200, outputTokens: 17100, totalTokens: 43300 },
  { month: "Dec", inputTokens: 31000, outputTokens: 20200, totalTokens: 51200 },
];

interface ReportTokenUsageProps {
  onBack: () => void;
}

export default function ReportTokenUsage({ onBack }: ReportTokenUsageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    // Update filter count
    setNumberOfFilters(dateRange ? 1 : 0);
  }, [dateRange]);

  const totalTokens = mockTokenData.reduce((sum, d) => sum + d.totalTokens, 0);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 600, marginBottom: '8px' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ 
              margin: 0, 
              color: entry.color,
              fontSize: '12px'
            }}>
              {entry.name}: {entry.value.toLocaleString()} tokens
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg: 'transparent',
          },
        },
      }}
    >
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            style={{ 
              borderRadius: 12, 
              border: '1px solid #e2e8f0'
            }}
            styles={{ 
              header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' },
              body: { padding: 24 }
            }}
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={onBack}
                    style={{ 
                      borderRadius: 8,
                      height: 40,
                      width: 40
                    }}
                  />
                  <div 
                    style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 8, 
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <DollarOutlined style={{ color: 'white', fontSize: 20 }} />
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Token Usage Report</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Monitor token consumption over time
                    </Text>
                  </div>
                </div>
                <Badge count={numberOfFilters} size="small" offset={[-5, 5]}>
                  <Button 
                    type={filtersOpen ? "primary" : "default"}
                    icon={<FilterOutlined />}
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    style={{ borderRadius: 8 }}
                  />
                </Badge>
              </div>
            }
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Collapsible Filters */}
              <AnimatePresence>
                {filtersOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <Card
                      size="small"
                      style={{ 
                        background: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: 12
                      }}
                      styles={{ body: { padding: 16 } }}
                    >
                      <RangePicker 
                        style={{ minWidth: 200 }}
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates)}
                      />
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chart */}
              {isLoading ? (
                <Skeleton.Input active block style={{ height: 350 }} />
              ) : (
                <div style={{ height: 350, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockTokenData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                        tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                        formatter={(value, entry) => (
                          <span style={{ color: '#000' }}>{value}</span>
                        )}
                      />
                      <Line
                        type="monotone"
                        dataKey="inputTokens"
                        stroke="#2196F3"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#2196F3' }}
                        name="Input Tokens"
                      />
                      <Line
                        type="monotone"
                        dataKey="outputTokens"
                        stroke="#FF9800"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#FF9800' }}
                        name="Output Tokens"
                      />
                      <Line
                        type="monotone"
                        dataKey="totalTokens"
                        stroke="#9C27B0"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#9C27B0' }}
                        name="Total Tokens"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Space>
          </Card>
        </motion.div>
      </div>
    </ConfigProvider>
  );
}
