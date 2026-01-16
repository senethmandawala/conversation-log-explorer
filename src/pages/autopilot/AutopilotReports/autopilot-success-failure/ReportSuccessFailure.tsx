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
  IconArrowLeft, 
  IconChartBar, 
  IconFilter
} from "@tabler/icons-react";
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

interface SuccessFailureData {
  month: string;
  successRate: number;
  failureRate: number;
}

// Mock data - monthly success/failure rates
const mockData: SuccessFailureData[] = [
  { month: "Jan", successRate: 78, failureRate: 22 },
  { month: "Feb", successRate: 82, failureRate: 18 },
  { month: "Mar", successRate: 85, failureRate: 15 },
  { month: "Apr", successRate: 79, failureRate: 21 },
  { month: "May", successRate: 88, failureRate: 12 },
  { month: "Jun", successRate: 92, failureRate: 8 },
  { month: "Jul", successRate: 87, failureRate: 13 },
  { month: "Aug", successRate: 91, failureRate: 9 },
  { month: "Sep", successRate: 89, failureRate: 11 },
  { month: "Oct", successRate: 94, failureRate: 6 },
  { month: "Nov", successRate: 90, failureRate: 10 },
  { month: "Dec", successRate: 93, failureRate: 7 },
];

interface ReportSuccessFailureProps {
  onBack: () => void;
}

export default function ReportSuccessFailure({ onBack }: ReportSuccessFailureProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    // Update filter count
    setNumberOfFilters(dateRange ? 1 : 0);
  }, [dateRange]);

  const avgSuccessRate = (mockData.reduce((sum, d) => sum + d.successRate, 0) / mockData.length).toFixed(1);
  const avgFailureRate = (mockData.reduce((sum, d) => sum + d.failureRate, 0) / mockData.length).toFixed(1);

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
              {entry.name}: {entry.value}%
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
                    icon={<IconArrowLeft />}
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
                      background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconChartBar style={{ color: 'white', fontSize: 20 }} />
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Success & Failure Rate Report</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Track success and failure rates over time
                    </Text>
                  </div>
                </div>
                <Badge count={numberOfFilters} size="small" offset={[-5, 5]}>
                  <Button 
                    type={filtersOpen ? "primary" : "default"}
                    icon={<IconFilter />}
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
                    <LineChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
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
                        dataKey="successRate"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#22c55e' }}
                        name="Success Rate"
                      />
                      <Line
                        type="monotone"
                        dataKey="failureRate"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#ef4444' }}
                        name="Failure Rate"
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
