import { useState, useEffect, useRef } from "react";
import { 
  Card, 
  Button, 
  Select, 
  DatePicker, 
  Tag, 
  Space, 
  Row, 
  Col, 
  Typography,
  Skeleton,
  ConfigProvider,
  Collapse,
  Input
} from "antd";
import { 
  ArrowLeftOutlined,
  FilterOutlined,
  CalendarOutlined,
  PhoneOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  HourglassOutlined,
  CloseOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { StatCard } from "@/components/ui/stat-card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import PerformanceTrend from "./PerformanceTrend";

// Mock data for agent performance
const mockAgentData = [
  { agent_id: 1, agent_name: "John Smith", dropped_calls: 45, package_churn: 12.5, open_calls: 23, avg_silent_time: 8.3, avg_waiting_time: 15.2 },
  { agent_id: 2, agent_name: "Sarah Johnson", dropped_calls: 38, package_churn: 9.8, open_calls: 18, avg_silent_time: 6.5, avg_waiting_time: 12.8 },
  { agent_id: 3, agent_name: "Mike Davis", dropped_calls: 52, package_churn: 15.2, open_calls: 31, avg_silent_time: 10.1, avg_waiting_time: 18.5 },
  { agent_id: 4, agent_name: "Emily Wilson", dropped_calls: 29, package_churn: 7.3, open_calls: 15, avg_silent_time: 5.2, avg_waiting_time: 10.3 },
  { agent_id: 5, agent_name: "Chris Brown", dropped_calls: 41, package_churn: 11.2, open_calls: 20, avg_silent_time: 7.8, avg_waiting_time: 14.1 },
  { agent_id: 6, agent_name: "Lisa Anderson", dropped_calls: 35, package_churn: 8.9, open_calls: 17, avg_silent_time: 6.1, avg_waiting_time: 11.9 },
  { agent_id: 7, agent_name: "David Martinez", dropped_calls: 48, package_churn: 13.7, open_calls: 27, avg_silent_time: 9.2, avg_waiting_time: 16.8 },
  { agent_id: 8, agent_name: "Jennifer Lee", dropped_calls: 32, package_churn: 8.1, open_calls: 16, avg_silent_time: 5.8, avg_waiting_time: 11.2 },
];

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const metrics = [
  { id: "dropped_calls", icon: PhoneOutlined, color: "#e53935", label: "Dropped Calls" },
  { id: "package_churn", icon: ReloadOutlined, color: "#43a047", label: "Package Churn" },
  { id: "open_calls", icon: ExclamationCircleOutlined, color: "#fb8c00", label: "Open Calls" },
  { id: "avg_silent_time", icon: ClockCircleOutlined, color: "#1e88e5", label: "Avg. Silence Time" },
  { id: "avg_waiting_time", icon: HourglassOutlined, color: "#8e24aa", label: "Avg. Waiting Time" },
];

const CHART_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#f97316"];

export default function AgentWiseComparisonReport() {
  const { setSelectedTab } = usePostCall();
  const [loading, setLoading] = useState(false);
  const [panelOpenState, setPanelOpenState] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [selectedCallType, setSelectedCallType] = useState<string | undefined>(undefined);
  const [selectedMetric, setSelectedMetric] = useState("dropped_calls");
  const [agentData, setAgentData] = useState(mockAgentData);
  const [showPerformanceTrend, setShowPerformanceTrend] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedAgentId, setSelectedAgentId] = useState<number>(0);

  useEffect(() => {
    let count = 0;
    if (selectedCallType) count++;
    if (selectedAgent) count++;
    setNumberOfFilters(count);
  }, [selectedCallType, selectedAgent]);

  const toggleFilters = () => {
    setPanelOpenState(!panelOpenState);
  };

  const searchFilterData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleBarClick = (data: any) => {
    if (data && data.agent_name) {
      setSelectedAgent(data.agent_name);
      setSelectedAgentId(data.agent_id);
      setShowPerformanceTrend(true);
    }
  };

  const getChartData = () => {
    const metricKey = selectedMetric as keyof typeof mockAgentData[0];
    return [...agentData]
      .sort((a, b) => (b[metricKey] as number) - (a[metricKey] as number))
      .map(agent => ({
        ...agent,
        name: agent.agent_name,
        value: agent[metricKey]
      }));
  };

  const getMetricLabel = () => {
    const metric = metrics.find(m => m.id === selectedMetric);
    return metric?.label || selectedMetric;
  };

  const formatValue = (value: number) => {
    if (selectedMetric === "package_churn") {
      return `${value.toFixed(2)}%`;
    } else if (selectedMetric.includes("time")) {
      return `${value.toFixed(2)}s`;
    }
    return value.toString();
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Card: {
              headerBg: 'transparent',
            },
            Button: {
              borderRadius: 8,
            },
            Select: {
              borderRadius: 8,
            },
          },
        }}
      >
        <div className="p-6 space-y-6">
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
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <PhoneOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Agent-wise Comparison Report</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Compare performance metrics across agents
                  </Text>
                </div>
              </div>
            }
            extra={
              <Space>
                <Button 
                  type={panelOpenState ? "primary" : "default"}
                  icon={<FilterOutlined />}
                  onClick={toggleFilters}
                >
                  Filters
                  {numberOfFilters > 0 && (
                    <Tag color="red" style={{ marginLeft: 8, borderRadius: 10 }}>{numberOfFilters}</Tag>
                  )}
                </Button>
              </Space>
            }
          >
            <AnimatePresence>
              {panelOpenState && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
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
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Date Range</Text>
                          <RangePicker style={{ width: '100%' }} />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Search Agent</Text>
                          <Input
                            placeholder="Search agent..."
                            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Call Type</Text>
                          <Select
                            placeholder="All Call Types"
                            style={{ width: '100%' }}
                            allowClear
                            value={selectedCallType}
                            onChange={setSelectedCallType}
                            options={[
                              { value: 'inbound', label: 'Inbound' },
                              { value: 'outbound', label: 'Outbound' },
                            ]}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6} className="flex items-end">
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                          <Button onClick={() => {
                            setSelectedAgent("");
                            setSelectedCallType(undefined);
                          }}>Clear</Button>
                          <Button type="primary" onClick={searchFilterData}>Search</Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Metric Tabs */}
            <div className="mb-6">
              <Row gutter={[12, 12]} justify="center">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <Col key={metric.id} xs={12} sm={8} md={6} lg={4}>
                      <Button
                        type={selectedMetric === metric.id ? "primary" : "default"}
                        onClick={() => {
                          setSelectedMetric(metric.id);
                          setShowPerformanceTrend(false);
                        }}
                        style={{ 
                          height: 'auto', 
                          padding: '12px 8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%'
                        }}
                      >
                        <Icon style={{ fontSize: 20, color: selectedMetric === metric.id ? "currentColor" : metric.color }} />
                        <span style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.2 }}>{metric.label}</span>
                      </Button>
                    </Col>
                  );
                })}
              </Row>
            </div>

            {/* Charts Container */}
            <Row gutter={[24, 24]}>
              {/* Main Chart */}
              <Col xs={24} lg={showPerformanceTrend ? 12 : 24}>
                <Card style={{ border: '1px solid #e2e8f0' }}>
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                          />
                          <YAxis 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            label={{
                              value: getMetricLabel(),
                              angle: -90,
                              position: "insideLeft",
                              style: { fontSize: 14, fontWeight: 600, fill: "#1f2937" },
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            labelStyle={{ color: "#1f2937", fontWeight: 600 }}
                            formatter={(value: number) => [formatValue(value), getMetricLabel()]}
                          />
                          <Bar 
                            dataKey="value" 
                            radius={[8, 8, 0, 0]}
                            onClick={handleBarClick}
                            cursor="pointer"
                          >
                            {getChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <p style={{ fontSize: 14, textAlign: 'center', color: '#64748b', marginTop: 16 }}>
                        Click on any bar to see agent details
                      </p>
                    </>
                  )}
                </Card>
              </Col>

              {/* Performance Trend Panel */}
              <AnimatePresence>
                {showPerformanceTrend && (
                  <Col xs={24} lg={12}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card style={{ border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                          <div>
                            <Text type="secondary" style={{ fontSize: 13 }}>{selectedAgent}</Text>
                            <Title level={5} style={{ margin: 0, marginTop: 4 }}>Performance Trend</Title>
                          </div>
                          <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={() => setShowPerformanceTrend(false)}
                            style={{ height: 32, width: 32 }}
                          />
                        </div>
                        <PerformanceTrend
                          selectedAgent={selectedAgent}
                          selectedAgentId={selectedAgentId}
                          selectedMetric={selectedMetric}
                        />
                      </Card>
                    </motion.div>
                  </Col>
                )}
              </AnimatePresence>
            </Row>
          </Card>
        </div>
      </ConfigProvider>
      <AIHelper />
    </>
  );
}
