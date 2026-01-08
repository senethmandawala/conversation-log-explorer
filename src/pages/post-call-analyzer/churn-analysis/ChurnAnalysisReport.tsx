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
  TeamOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  PercentageOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { StatCard } from "@/components/ui/stat-card";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock data
const mockChurnData = [
  { key: "1", date: "2024-01-15", msisdn: "+1234567890", product: "Premium Plan", reason: "Poor Service Quality", agent: "John Smith", status: "Churned", actionTaken: "Follow-up call scheduled" },
  { key: "2", date: "2024-01-15", msisdn: "+1234567891", product: "Basic Plan", reason: "High Pricing", agent: "Sarah Johnson", status: "Retained", actionTaken: "Discount offered" },
  { key: "3", date: "2024-01-16", msisdn: "+1234567892", product: "Premium Plan", reason: "Technical Issues", agent: "Mike Wilson", status: "Churned", actionTaken: "Technical support provided" },
  { key: "4", date: "2024-01-16", msisdn: "+1234567893", product: "Standard Plan", reason: "Better Competitor Offer", agent: "Emily Davis", status: "At Risk", actionTaken: "Retention offer sent" },
  { key: "5", date: "2024-01-17", msisdn: "+1234567894", product: "Basic Plan", reason: "Poor Service Quality", agent: "John Smith", status: "Retained", actionTaken: "Service upgrade" },
  { key: "6", date: "2024-01-17", msisdn: "+1234567895", product: "Premium Plan", reason: "High Pricing", agent: "Sarah Johnson", status: "Churned", actionTaken: "None" },
  { key: "7", date: "2024-01-18", msisdn: "+1234567896", product: "Standard Plan", reason: "Technical Issues", agent: "Mike Wilson", status: "Retained", actionTaken: "Technical resolution" },
  { key: "8", date: "2024-01-18", msisdn: "+1234567897", product: "Premium Plan", reason: "Poor Service Quality", agent: "Emily Davis", status: "At Risk", actionTaken: "Manager callback" },
];

const callTypes = [
  { value: "all", label: "All Call Types" },
  { value: "home", label: "Home" },
  { value: "mobile", label: "Mobile" },
  { value: "unknown", label: "Unknown" },
];

export default function ChurnAnalysisReport() {
  const { setSelectedTab } = usePostCall();
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedCallType, setSelectedCallType] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const activeFiltersCount = [selectedCallType].filter(Boolean).length;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "churned": return 'red';
      case "retained": return 'green';
      case "at risk": return 'orange';
      default: return 'default';
    }
  };

  const columns: ColumnsType<typeof mockChurnData[0]> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'MSISDN',
      dataIndex: 'msisdn',
      key: 'msisdn',
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Agent',
      dataIndex: 'agent',
      key: 'agent',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} style={{ borderRadius: 12, fontWeight: 600 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action Taken',
      dataIndex: 'actionTaken',
      key: 'actionTaken',
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
                    background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)'
                  }}
                >
                  <WarningOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Churn Analysis Report</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Analyze customer churn patterns and retention effectiveness
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
                      <Col xs={24} sm={12} lg={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Date Range</Text>
                          <RangePicker style={{ width: '100%' }} />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Agent Name</Text>
                          <Input prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} placeholder="Search agents..." />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Reason</Text>
                          <Select placeholder="All Reasons" style={{ width: '100%' }} allowClear options={[
                            { value: 'service', label: 'Poor Service Quality' },
                            { value: 'pricing', label: 'High Pricing' },
                            { value: 'technical', label: 'Technical Issues' },
                          ]} />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Products</Text>
                          <Select placeholder="All Products" style={{ width: '100%' }} allowClear options={[
                            { value: 'premium', label: 'Premium Plan' },
                            { value: 'standard', label: 'Standard Plan' },
                            { value: 'basic', label: 'Basic Plan' },
                          ]} />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={4}>
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
                      <Col xs={24} sm={12} lg={4} className="flex items-end">
                        <Button type="primary" style={{ width: '100%' }}>Search</Button>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  label="Total Churn Predictions"
                  value="156"
                  icon={<TeamOutlined />}
                  color="#3b82f6"
                  gradientColors={["#3b82f6", "#2563eb"] as [string, string]}
                  isLoading={loading}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  label="Churned"
                  value="45"
                  icon={<WarningOutlined />}
                  color="#ef4444"
                  gradientColors={["#ef4444", "#dc2626"] as [string, string]}
                  isLoading={loading}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  label="Successfully Retained"
                  value="89"
                  icon={<ThunderboltOutlined />}
                  color="#10b981"
                  gradientColors={["#10b981", "#059669"] as [string, string]}
                  isLoading={loading}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  label="Retention Rate"
                  value="66.4%"
                  icon={<PercentageOutlined />}
                  color="#8b5cf6"
                  gradientColors={["#8b5cf6", "#7c3aed"] as [string, string]}
                  isLoading={loading}
                />
              </Col>
            </Row>

            {/* Churn Records Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Title level={5} style={{ marginBottom: 16 }}>Churn Records</Title>
              <Table
                columns={columns}
                dataSource={mockChurnData}
                loading={loading}
                pagination={{ 
                  pageSize: 10, 
                  showSizeChanger: false,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`
                }}
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
