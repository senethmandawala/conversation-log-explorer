import { useState, useEffect } from "react";
import { 
  Card, 
  Select, 
  DatePicker, 
  Button, 
  Row, 
  Col, 
  Typography,
  ConfigProvider
} from "antd";
import { 
  FilterOutlined, 
  ArrowLeftOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AntdLineChartTooltip } from "@/components/ui/antd-chart-tooltip";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock data for the line chart
const mockChartData = [
  { date: "2024-01-01", Billing: 45, Technical: 32, Sales: 28, Complaints: 15, General: 20 },
  { date: "2024-01-02", Billing: 52, Technical: 38, Sales: 31, Complaints: 18, General: 25 },
  { date: "2024-01-03", Billing: 48, Technical: 42, Sales: 35, Complaints: 22, General: 28 },
  { date: "2024-01-04", Billing: 61, Technical: 45, Sales: 38, Complaints: 20, General: 30 },
  { date: "2024-01-05", Billing: 55, Technical: 48, Sales: 42, Complaints: 25, General: 32 },
  { date: "2024-01-06", Billing: 58, Technical: 51, Sales: 45, Complaints: 28, General: 35 },
  { date: "2024-01-07", Billing: 63, Technical: 55, Sales: 48, Complaints: 30, General: 38 },
  { date: "2024-01-08", Billing: 67, Technical: 58, Sales: 52, Complaints: 32, General: 40 },
  { date: "2024-01-09", Billing: 70, Technical: 62, Sales: 55, Complaints: 35, General: 42 },
  { date: "2024-01-10", Billing: 65, Technical: 59, Sales: 50, Complaints: 33, General: 39 },
];

const CHART_COLORS = [
  "#8b5cf6", // purple
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
];

const callTypes = [
  { value: "all", label: "All Call Types" },
  { value: "home", label: "Home" },
  { value: "mobile", label: "Mobile" },
  { value: "unknown", label: "Unknown" },
];

export default function CategoryTrendAnalysis() {
  const { setSelectedTab } = usePostCall();
  const [loading, setLoading] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedCallType, setSelectedCallType] = useState<string | undefined>(undefined);
  const [chartData] = useState(mockChartData);

  const categories = ["Billing", "Technical", "Sales", "Complaints", "General"];
  const activeFiltersCount = [selectedCallType].filter(Boolean).length;

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg: 'transparent',
          },
          Select: {
            borderRadius: 8,
          },
          Button: {
            borderRadius: 8,
          },
        },
      }}
    >
      <div className="p-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
            styles={{
              header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' },
              body: { padding: 24 }
            }}
            title={
              <div className="flex items-center gap-3">
                <Button 
                  type="text" 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => setSelectedTab("reports")}
                  style={{ marginRight: 8 }}
                />
                <div 
                  style={{ 
                    width: 42, 
                    height: 42, 
                    borderRadius: 12, 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <LineChartOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Category Trend Analysis</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Track call volume trends across different categories over time
                  </Text>
                </div>
              </div>
            }
            extra={
              <Button 
                type={filtersVisible ? "primary" : "default"}
                icon={<FilterOutlined />}
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                Filters
                {activeFiltersCount > 0 && (
                  <span style={{ 
                    marginLeft: 8, 
                    background: '#ef4444', 
                    color: 'white', 
                    borderRadius: 10, 
                    padding: '2px 8px',
                    fontSize: 12 
                  }}>
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            }
          >
            {/* Filters Panel */}
            <AnimatePresence>
              {filtersVisible && (
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
                      marginBottom: 20, 
                      background: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      borderRadius: 12
                    }}
                    styles={{ body: { padding: 16 } }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} lg={8}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Date Range</Text>
                          <RangePicker style={{ width: '100%' }} />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={8}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Call Type</Text>
                          <Select
                            placeholder="All Call Types"
                            style={{ width: '100%' }}
                            allowClear
                            value={selectedCallType}
                            onChange={setSelectedCallType}
                            options={callTypes}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={8} className="flex items-end">
                        <Button type="primary" onClick={handleSearch} style={{ width: '100%' }}>
                          Search
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chart */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  size="small"
                  style={{ 
                    borderRadius: 12, 
                    border: '1px solid #e2e8f0',
                  }}
                  styles={{ body: { padding: 24 } }}
                >
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                      <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        label={{
                          value: "Calls Count",
                          angle: -90,
                          position: "insideLeft",
                          style: { fontSize: 14, fontWeight: 600, fill: "#1e293b" },
                        }}
                      />
                      <Tooltip content={<AntdLineChartTooltip />} />
                      <Legend
                        wrapperStyle={{ paddingTop: "20px" }}
                        iconType="circle"
                      />
                      {categories.map((category, index) => (
                        <Line
                          key={category}
                          type="monotone"
                          dataKey={category}
                          stroke={CHART_COLORS[index % CHART_COLORS.length]}
                          strokeWidth={3}
                          dot={{ r: 6, strokeWidth: 0 }}
                          activeDot={{ r: 8 }}
                          animationDuration={800}
                          animationEasing="ease-in-out"
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
      <AIHelper />
    </ConfigProvider>
  );
}
