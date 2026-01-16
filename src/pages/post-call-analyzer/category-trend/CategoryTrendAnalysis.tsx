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
  IconFilter, 
  IconArrowLeft,
  IconChartLine
} from "@tabler/icons-react";
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
            className="rounded-xl border-slate-200"
            styles={{
              header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' },
              body: { padding: 24 }
            }}
            title={
              <div className="flex items-center gap-3">
                <Button 
                  type="text" 
                  icon={<IconArrowLeft />} 
                  onClick={() => setSelectedTab("reports")}
                  className="mr-2"
                />
                <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <IconChartLine className="text-white text-xl" />
                </div>
                <div>
                  <Title level={5} className="!m-0 !font-semibold">Category Trend Analysis</Title>
                  <Text type="secondary" className="text-[13px]">
                    Track call volume trends across different categories over time
                  </Text>
                </div>
              </div>
            }
            extra={
              <Button 
                type={filtersVisible ? "primary" : "default"}
                icon={<IconFilter />}
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white rounded-full w-[18px] h-[18px] inline-flex items-center justify-center text-[11px]">
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
                  className="overflow-hidden"
                >
                  <Card
                    size="small"
                    className="mb-5 bg-slate-50 border-slate-200 rounded-xl"
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} lg={8}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Date Range</Text>
                          <RangePicker className="w-full" />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={8}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Call Type</Text>
                          <Select
                            placeholder="All Call Types"
                            className="w-full"
                            allowClear
                            value={selectedCallType}
                            onChange={setSelectedCallType}
                            options={callTypes}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={8} className="flex items-end">
                        <Button type="primary" onClick={handleSearch} className="w-full">
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
                  className="rounded-xl border-slate-200"
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
