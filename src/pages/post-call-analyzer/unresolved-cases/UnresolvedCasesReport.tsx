import { useState, useEffect } from "react";
import { 
  Card, 
  Table, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Tag, 
  Space, 
  Row, 
  Col, 
  Typography,
  ConfigProvider
} from "antd";
import { 
  SearchOutlined, 
  FilterOutlined, 
  ArrowLeftOutlined,
  WarningOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock data
const mockAgentWiseData = [
  { key: "1", agent: "John Smith", category: "Technical Support", total_calls: 145, total_unresolved_calls: 23, unresolved_rate: "15.9%", total_repeat_calls: 12 },
  { key: "2", agent: "Sarah Johnson", category: "Billing Issues", total_calls: 132, total_unresolved_calls: 28, unresolved_rate: "21.2%", total_repeat_calls: 15 },
  { key: "3", agent: "Mike Davis", category: "Account Management", total_calls: 98, total_unresolved_calls: 18, unresolved_rate: "18.4%", total_repeat_calls: 9 },
  { key: "4", agent: "Emily Wilson", category: "Product Inquiry", total_calls: 87, total_unresolved_calls: 15, unresolved_rate: "17.2%", total_repeat_calls: 8 },
  { key: "5", agent: "Chris Brown", category: "Service Complaint", total_calls: 76, total_unresolved_calls: 22, unresolved_rate: "28.9%", total_repeat_calls: 14 },
];

const mockCategoryWiseData = [
  { key: "1", category: "Technical Support", total_calls: 245, total_unresolved_calls: 52, total_repeat_calls: 28 },
  { key: "2", category: "Billing Issues", total_calls: 198, total_unresolved_calls: 45, total_repeat_calls: 24 },
  { key: "3", category: "Account Management", total_calls: 156, total_unresolved_calls: 38, total_repeat_calls: 19 },
  { key: "4", category: "Product Inquiry", total_calls: 134, total_unresolved_calls: 28, total_repeat_calls: 15 },
  { key: "5", category: "Service Complaint", total_calls: 112, total_unresolved_calls: 35, total_repeat_calls: 18 },
];

const callTypes = [
  { value: "all", label: "All Call Types" },
  { value: "inbound", label: "Inbound" },
  { value: "outbound", label: "Outbound" },
];

export default function UnresolvedCasesReport() {
  const { setSelectedTab } = usePostCall();
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedCallType, setSelectedCallType] = useState<string | undefined>(undefined);

  const totalUnresolvedCalls = 198;
  const totalRepeatCalls = 104;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const activeFiltersCount = [selectedCallType].filter(Boolean).length;

  const getUnresolvedRateColor = (rate: string) => {
    const numRate = parseFloat(rate.replace('%', ''));
    if (numRate >= 25) return 'red';
    if (numRate >= 15) return 'orange';
    return 'green';
  };

  const agentWiseColumns: ColumnsType<typeof mockAgentWiseData[0]> = [
    {
      title: 'Agent',
      dataIndex: 'agent',
      key: 'agent',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      align: 'center' as const,
      render: (text: string) => (
        <Tag color="gold" style={{ borderRadius: 6 }}>{text}</Tag>
      ),
    },
    {
      title: 'Total Calls',
      dataIndex: 'total_calls',
      key: 'total_calls',
      align: 'center' as const,
    },
    {
      title: 'Unresolved Calls',
      dataIndex: 'total_unresolved_calls',
      key: 'total_unresolved_calls',
      align: 'center' as const,
      render: (count: number) => (
        <Tag color="red" style={{ borderRadius: 12, fontWeight: 600 }}>{count}</Tag>
      ),
    },
    {
      title: 'Unresolved Rate',
      dataIndex: 'unresolved_rate',
      key: 'unresolved_rate',
      align: 'center' as const,
      render: (rate: string) => (
        <Tag color={getUnresolvedRateColor(rate)} style={{ borderRadius: 12, fontWeight: 600 }}>
          {rate}
        </Tag>
      ),
    },
    {
      title: 'Repeat Calls',
      dataIndex: 'total_repeat_calls',
      key: 'total_repeat_calls',
      align: 'center' as const,
      render: (count: number) => (
        <Tag color="orange" style={{ borderRadius: 12, fontWeight: 600 }}>{count}</Tag>
      ),
    },
  ];

  const categoryWiseColumns: ColumnsType<typeof mockCategoryWiseData[0]> = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => (
        <Tag color="gold" style={{ borderRadius: 6 }}>{text}</Tag>
      ),
    },
    {
      title: 'Total Calls',
      dataIndex: 'total_calls',
      key: 'total_calls',
      align: 'center' as const,
    },
    {
      title: 'Unresolved Calls',
      dataIndex: 'total_unresolved_calls',
      key: 'total_unresolved_calls',
      align: 'center' as const,
      render: (count: number) => (
        <Tag color="red" style={{ borderRadius: 12, fontWeight: 600 }}>{count}</Tag>
      ),
    },
    {
      title: 'Repeat Calls',
      dataIndex: 'total_repeat_calls',
      key: 'total_repeat_calls',
      align: 'center' as const,
      render: (count: number) => (
        <Tag color="orange" style={{ borderRadius: 12, fontWeight: 600 }}>{count}</Tag>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#475569',
            headerSortActiveBg: '#f1f5f9',
            rowHoverBg: '#f8fafc',
            borderColor: '#e2e8f0',
          },
          Card: {
            headerBg: 'transparent',
          },
          Select: {
            borderRadius: 8,
          },
          Input: {
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
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <WarningOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Unresolved Cases Analysis</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Monitor and analyze calls requiring escalation or remaining unresolved
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
                  <Tag color="red" style={{ marginLeft: 8, borderRadius: 10 }}>{activeFiltersCount}</Tag>
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
                        <Button type="primary" style={{ width: '100%' }}>Search</Button>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12}>
                <StatCard
                  label="Total Unresolved Calls"
                  value={totalUnresolvedCalls.toString()}
                  icon={<WarningOutlined />}
                  color="#ef4444"
                  gradientColors={["#ef4444", "#dc2626"] as [string, string]}
                  isLoading={loading}
                />
              </Col>
              <Col xs={24} sm={12}>
                <StatCard
                  label="Repeat Calls"
                  value={totalRepeatCalls.toString()}
                  icon={<PhoneOutlined />}
                  color="#f59e0b"
                  gradientColors={["#f59e0b", "#d97706"] as [string, string]}
                  isLoading={loading}
                />
              </Col>
            </Row>

            {/* Agent-wise Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: 24 }}
            >
              <Title level={5} style={{ marginBottom: 16 }}>Agent-wise Unresolved Cases</Title>
              <Table
                columns={agentWiseColumns}
                dataSource={mockAgentWiseData}
                loading={loading}
                pagination={false}
                style={{ borderRadius: 12, overflow: 'hidden' }}
              />
            </motion.div>

            {/* Category-wise Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Title level={5} style={{ marginBottom: 16 }}>Category-wise Unresolved Cases</Title>
              <Table
                columns={categoryWiseColumns}
                dataSource={mockCategoryWiseData}
                loading={loading}
                pagination={false}
                style={{ borderRadius: 12, overflow: 'hidden' }}
              />
            </motion.div>
          </Card>
        </motion.div>
      </div>
      <AIHelper />
    </ConfigProvider>
  );
}
