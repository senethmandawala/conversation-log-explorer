import { useEffect, useState } from "react";
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
  Skeleton,
  Progress,
  Tooltip,
  ConfigProvider,
  Badge
} from "antd";
import { 
  SearchOutlined, 
  FilterOutlined, 
  DownloadOutlined,
  EyeOutlined,
  TeamOutlined,
  UserOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  StarOutlined,
  RiseOutlined,
  FallOutlined,
  ClearOutlined,
  AimOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { AIHelper } from "@/components/post-call/AIHelper";
import { usePostCall } from "@/contexts/PostCallContext";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface AgentMetric {
  id: string;
  agentId: string;
  name: string;
  avatar: string;
  department: string;
  totalCalls: number;
  avgHandleTime: string;
  fcr: number;
  csat: number;
  sentiment: number;
  trend: "up" | "down" | "stable";
  performance: "excellent" | "good" | "average" | "poor";
  status: "active" | "inactive";
}

const mockAgents: AgentMetric[] = [
  { id: "1", agentId: "AGT-001", name: "John Smith", avatar: "JS", department: "Customer Support", totalCalls: 245, avgHandleTime: "4:32", fcr: 92, csat: 4.8, sentiment: 85, trend: "up", performance: "excellent", status: "active" },
  { id: "2", agentId: "AGT-002", name: "Sarah Johnson", avatar: "SJ", department: "Technical Support", totalCalls: 230, avgHandleTime: "5:15", fcr: 88, csat: 4.6, sentiment: 78, trend: "up", performance: "good", status: "active" },
  { id: "3", agentId: "AGT-003", name: "Mike Wilson", avatar: "MW", department: "Sales", totalCalls: 198, avgHandleTime: "4:45", fcr: 85, csat: 4.5, sentiment: 72, trend: "stable", performance: "good", status: "active" },
  { id: "4", agentId: "AGT-004", name: "Emily Davis", avatar: "ED", department: "Customer Support", totalCalls: 210, avgHandleTime: "6:10", fcr: 78, csat: 4.2, sentiment: 65, trend: "down", performance: "average", status: "active" },
  { id: "5", agentId: "AGT-005", name: "David Brown", avatar: "DB", department: "Billing", totalCalls: 175, avgHandleTime: "5:30", fcr: 82, csat: 4.4, sentiment: 70, trend: "up", performance: "good", status: "active" },
  { id: "6", agentId: "AGT-006", name: "Lisa Chen", avatar: "LC", department: "Technical Support", totalCalls: 221, avgHandleTime: "5:45", fcr: 80, csat: 4.1, sentiment: 68, trend: "stable", performance: "average", status: "active" },
  { id: "7", agentId: "AGT-007", name: "Robert Taylor", avatar: "RT", department: "Customer Support", totalCalls: 134, avgHandleTime: "4:55", fcr: 75, csat: 3.7, sentiment: 55, trend: "down", performance: "poor", status: "inactive" },
  { id: "8", agentId: "AGT-008", name: "Jennifer Lee", avatar: "JL", department: "Sales", totalCalls: 278, avgHandleTime: "3:30", fcr: 89, csat: 4.4, sentiment: 76, trend: "up", performance: "good", status: "active" },
];

const getPerformanceConfig = (performance: AgentMetric["performance"]) => {
  switch (performance) {
    case "excellent": return { color: '#10b981', bg: '#10b98115', label: 'Excellent' };
    case "good": return { color: '#3b82f6', bg: '#3b82f615', label: 'Good' };
    case "average": return { color: '#f59e0b', bg: '#f59e0b15', label: 'Average' };
    case "poor": return { color: '#ef4444', bg: '#ef444415', label: 'Poor' };
  }
};

const getTrendIcon = (trend: AgentMetric["trend"]) => {
  switch (trend) {
    case "up": return <RiseOutlined style={{ color: '#10b981', fontSize: 14 }} />;
    case "down": return <FallOutlined style={{ color: '#ef4444', fontSize: 14 }} />;
    default: return <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>;
  }
};

const getProgressColor = (value: number) => {
  if (value >= 90) return '#10b981';
  if (value >= 80) return '#3b82f6';
  if (value >= 70) return '#f59e0b';
  return '#ef4444';
};

interface PerformingAgent {
  name: string;
  score: number;
}

const topPerformingAgents: PerformingAgent[] = [
  { name: "John Smith", score: 92 },
  { name: "Sarah Johnson", score: 88 },
  { name: "Mike Wilson", score: 85 },
  { name: "David Brown", score: 82 },
];

const agentsNeedAttention: PerformingAgent[] = [
  { name: "Emily Davis", score: 65 },
  { name: "Robert Taylor", score: 62 },
  { name: "Lisa Anderson", score: 58 },
  { name: "James Martinez", score: 55 },
];

export default function AgentPerformance() {
  const { setSelectedAgentId, setSelectedTab } = usePostCall();
  const [isLoading, setIsLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
  const [selectedPerformance, setSelectedPerformance] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         agent.agentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !selectedDepartment || agent.department === selectedDepartment;
    const matchesPerformance = !selectedPerformance || agent.performance === selectedPerformance;
    const matchesStatus = !selectedStatus || agent.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesPerformance && matchesStatus;
  });

  const activeFiltersCount = [selectedDepartment, selectedPerformance, selectedStatus].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDepartment(undefined);
    setSelectedPerformance(undefined);
    setSelectedStatus(undefined);
  };

  const uniqueDepartments = [...new Set(mockAgents.map(a => a.department))];

  const handleViewAgent = (agent: AgentMetric) => {
    setSelectedAgentId(agent.agentId);
    setSelectedTab("agent-insights");
  };

  // Summary stats
  const totalAgents = mockAgents.length;
  const activeAgents = mockAgents.filter(a => a.status === 'active').length;
  const avgFCR = Math.round(mockAgents.reduce((sum, a) => sum + a.fcr, 0) / mockAgents.length);
  const avgCSAT = (mockAgents.reduce((sum, a) => sum + a.csat, 0) / mockAgents.length).toFixed(1);

  const columns: ColumnsType<AgentMetric> = [
    {
      title: 'Agent',
      key: 'agent',
      render: (_, record) => (
        <Space>
          <div 
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{record.avatar}</span>
          </div>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.agentId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (text: string) => (
        <Tag 
          style={{ 
            borderRadius: 6, 
            padding: '2px 10px',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            color: '#475569'
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Total Calls',
      dataIndex: 'totalCalls',
      key: 'totalCalls',
      sorter: (a, b) => a.totalCalls - b.totalCalls,
      render: (value: number) => (
        <Space size={4}>
          <PhoneOutlined style={{ color: '#6366f1', fontSize: 12 }} />
          <Text strong>{value}</Text>
        </Space>
      ),
    },
    {
      title: 'Avg Handle Time',
      dataIndex: 'avgHandleTime',
      key: 'avgHandleTime',
      render: (text: string) => (
        <Space size={4}>
          <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
          <Text type="secondary">{text}</Text>
        </Space>
      ),
    },
    {
      title: 'FCR Rate',
      dataIndex: 'fcr',
      key: 'fcr',
      sorter: (a, b) => a.fcr - b.fcr,
      render: (value: number) => (
        <div style={{ minWidth: 100 }}>
          <div className="flex items-center justify-between mb-1">
            <Text strong style={{ fontSize: 13 }}>{value}%</Text>
          </div>
          <Progress 
            percent={value} 
            showInfo={false} 
            size="small"
            strokeColor={getProgressColor(value)}
            trailColor="#e2e8f0"
          />
        </div>
      ),
    },
    {
      title: 'CSAT',
      dataIndex: 'csat',
      key: 'csat',
      sorter: (a, b) => a.csat - b.csat,
      render: (value: number) => (
        <Space size={4}>
          <StarOutlined style={{ color: '#f59e0b', fontSize: 14 }} />
          <Text strong>{value}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>/5</Text>
        </Space>
      ),
    },
    {
      title: 'Performance',
      dataIndex: 'performance',
      key: 'performance',
      filters: [
        { text: 'Excellent', value: 'excellent' },
        { text: 'Good', value: 'good' },
        { text: 'Average', value: 'average' },
        { text: 'Poor', value: 'poor' },
      ],
      onFilter: (value, record) => record.performance === value,
      render: (performance: AgentMetric["performance"]) => {
        const config = getPerformanceConfig(performance);
        return (
          <Tag
            style={{
              borderRadius: 6,
              padding: '2px 10px',
              background: config.bg,
              border: `1px solid ${config.color}`,
              color: config.color,
            }}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      align: 'center',
      render: (trend: AgentMetric["trend"]) => (
        <Tooltip title={trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}>
          {getTrendIcon(trend)}
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AgentMetric["status"]) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status === 'active' ? 'Active' : 'Inactive'} 
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleViewAgent(record)}
            style={{ borderRadius: 8 }}
            className="hover:bg-primary/10 hover:text-primary"
          />
        </Tooltip>
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
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Row gutter={16}>
            {[
              { title: 'Total Agents', value: totalAgents, icon: <TeamOutlined />, color: '#6366f1' },
              { title: 'Active Agents', value: activeAgents, icon: <UserOutlined />, color: '#10b981' },
              { title: 'Avg FCR Rate', value: `${avgFCR}%`, icon: <AimOutlined />, color: '#f59e0b' },
              { title: 'Avg CSAT Score', value: avgCSAT, icon: <StarOutlined />, color: '#3b82f6' },
            ].map((stat, index) => (
              <Col xs={12} lg={6} key={stat.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    size="small" 
                    style={{ 
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      marginBottom: 16
                    }}
                    styles={{ body: { padding: 16 } }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{stat.title}</Text>
                        <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>
                          {isLoading ? <Skeleton.Input active size="small" style={{ width: 60 }} /> : stat.value}
                        </div>
                      </div>
                      <div 
                        style={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: 12, 
                          background: `${stat.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                          color: stat.color
                        }}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Performance Cards Row */}
        <Row gutter={16}>
          {/* Best Performing Agents */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                size="small"
                style={{ borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}
                styles={{ body: { padding: 16 } }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrophyOutlined style={{ color: '#10b981', fontSize: 18 }} />
                  <Text strong>Best Performing Agents</Text>
                </div>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 2 }} />
                ) : (
                  <Row gutter={[8, 8]}>
                    {topPerformingAgents.map((agent, index) => (
                      <Col xs={12} key={agent.name}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{
                            background: '#10b98115',
                            border: '1px solid #10b98130',
                            borderRadius: 8,
                            padding: '8px 12px'
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <Text style={{ fontSize: 13 }} className="truncate mr-2">{agent.name}</Text>
                            <Text strong style={{ color: '#10b981', fontSize: 13 }}>{agent.score}%</Text>
                          </div>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card>
            </motion.div>
          </Col>

          {/* Agents Requiring Attention */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card
                size="small"
                style={{ borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}
                styles={{ body: { padding: 16 } }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <FallOutlined style={{ color: '#f59e0b', fontSize: 18 }} />
                  <Text strong>Agents Requiring Attention</Text>
                </div>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 2 }} />
                ) : (
                  <Row gutter={[8, 8]}>
                    {agentsNeedAttention.map((agent, index) => (
                      <Col xs={12} key={agent.name}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{
                            background: '#f59e0b15',
                            border: '1px solid #f59e0b30',
                            borderRadius: 8,
                            padding: '8px 12px'
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <Text style={{ fontSize: 13 }} className="truncate mr-2">{agent.name}</Text>
                            <Text strong style={{ color: '#f59e0b', fontSize: 13 }}>{agent.score}%</Text>
                          </div>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Main Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card
            styles={{
              header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' },
              body: { padding: 24 }
            }}
            title={
              <div className="flex items-center gap-3">
                <div 
                  style={{ 
                    width: 42, 
                    height: 42, 
                    borderRadius: 12, 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <TeamOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Agent Performance Summary</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Monitor and evaluate agent performance metrics
                  </Text>
                </div>
              </div>
            }
            extra={
              <Space>
                <Button icon={<DownloadOutlined />}>Export</Button>
                <Badge count={activeFiltersCount} size="small" offset={[-5, 5]}>
                  <Button 
                    type={filtersVisible ? "primary" : "default"}
                    icon={<FilterOutlined />}
                    onClick={() => setFiltersVisible(!filtersVisible)}
                  >
                    Filters
                  </Button>
                </Badge>
              </Space>
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
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                            Search Agent
                          </Text>
                          <Input
                            placeholder="Name or ID..."
                            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            allowClear
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                            Department
                          </Text>
                          <Select
                            placeholder="All Departments"
                            value={selectedDepartment}
                            onChange={setSelectedDepartment}
                            allowClear
                            style={{ width: '100%' }}
                            options={uniqueDepartments.map(d => ({ label: d, value: d }))}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                            Performance
                          </Text>
                          <Select
                            placeholder="All Levels"
                            value={selectedPerformance}
                            onChange={setSelectedPerformance}
                            allowClear
                            style={{ width: '100%' }}
                            options={[
                              { label: 'Excellent', value: 'excellent' },
                              { label: 'Good', value: 'good' },
                              { label: 'Average', value: 'average' },
                              { label: 'Poor', value: 'poor' },
                            ]}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                            Status
                          </Text>
                          <Select
                            placeholder="All Statuses"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            allowClear
                            style={{ width: '100%' }}
                            options={[
                              { label: 'Active', value: 'active' },
                              { label: 'Inactive', value: 'inactive' },
                            ]}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                            Date Range
                          </Text>
                          <RangePicker style={{ width: '100%' }} />
                        </div>
                      </Col>
                      <Col xs={24} lg={18} className="flex items-end justify-end">
                        <Space>
                          <Button 
                            icon={<ClearOutlined />} 
                            onClick={clearAllFilters}
                          >
                            Clear All
                          </Button>
                          <Button type="primary">Apply Filters</Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Data Table */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton.Input key={i} active block style={{ height: 52 }} />
                ))}
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={filteredAgents}
                rowKey="id"
                pagination={{
                  total: filteredAgents.length,
                  pageSize: 8,
                  showTotal: (total, range) => (
                    <Text type="secondary">
                      Showing <Text strong>{range[0]}-{range[1]}</Text> of <Text strong>{total}</Text> agents
                    </Text>
                  ),
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '8', '10', '20'],
                }}
                style={{ borderRadius: 12, overflow: 'hidden' }}
                rowClassName={() => 
                  'transition-all duration-200 hover:shadow-[inset_3px_0_0_0_#10b981]'
                }
              />
            )}
          </Card>
        </motion.div>
      </div>

      <AIHelper />
    </ConfigProvider>
  );
}
