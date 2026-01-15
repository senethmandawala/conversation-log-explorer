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
  DatePicker
} from "antd";
import { 
  IconArrowLeft, 
  IconClock, 
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

interface CallDurationData {
  date: string;
  balanceInquiry: number;
  fundTransfer: number;
  billPayment: number;
  cardServices: number;
}

// Mock data - daily average call duration by category
const mockDurationData: CallDurationData[] = [
  { date: "Jan 1", balanceInquiry: 45, fundTransfer: 120, billPayment: 90, cardServices: 150 },
  { date: "Jan 2", balanceInquiry: 48, fundTransfer: 115, billPayment: 95, cardServices: 145 },
  { date: "Jan 3", balanceInquiry: 42, fundTransfer: 125, billPayment: 88, cardServices: 155 },
  { date: "Jan 4", balanceInquiry: 50, fundTransfer: 118, billPayment: 92, cardServices: 148 },
  { date: "Jan 5", balanceInquiry: 44, fundTransfer: 122, billPayment: 85, cardServices: 152 },
  { date: "Jan 6", balanceInquiry: 46, fundTransfer: 110, billPayment: 98, cardServices: 140 },
  { date: "Jan 7", balanceInquiry: 40, fundTransfer: 128, billPayment: 82, cardServices: 158 },
];

const COLORS = ["#0C3DBE", "#E57373", "#66BB6A", "#FFCA28"];

interface ReportAverageCallDurationProps {
  onBack: () => void;
}

export default function ReportAverageCallDuration({ onBack }: ReportAverageCallDurationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    // Update filter count
    setNumberOfFilters(dateRange ? 1 : 0);
  }, [dateRange]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
  };

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
              {entry.name}: {formatDuration(entry.value)}
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
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconClock style={{ color: 'white', fontSize: 20 }} />
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Average Call Duration Report</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Analyze category-wise average call duration over time
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
                <Skeleton.Input active block style={{ height: 400 }} />
              ) : (
                <div style={{ height: 400, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockDurationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                        tickFormatter={(value) => `${value}s`}
                        label={{ 
                          value: 'Average Duration (seconds)', 
                          angle: -90, 
                          position: 'insideLeft', 
                          style: { textAnchor: 'middle', fontSize: 12, fill: '#6b7280' } 
                        }}
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
                        dataKey="balanceInquiry"
                        stroke={COLORS[0]}
                        strokeWidth={3}
                        dot={{ r: 4, fill: COLORS[0] }}
                        name="Balance Inquiry"
                      />
                      <Line
                        type="monotone"
                        dataKey="fundTransfer"
                        stroke={COLORS[1]}
                        strokeWidth={3}
                        dot={{ r: 4, fill: COLORS[1] }}
                        name="Fund Transfer"
                      />
                      <Line
                        type="monotone"
                        dataKey="billPayment"
                        stroke={COLORS[2]}
                        strokeWidth={3}
                        dot={{ r: 4, fill: COLORS[2] }}
                        name="Bill Payment"
                      />
                      <Line
                        type="monotone"
                        dataKey="cardServices"
                        stroke={COLORS[3]}
                        strokeWidth={3}
                        dot={{ r: 4, fill: COLORS[3] }}
                        name="Card Services"
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
