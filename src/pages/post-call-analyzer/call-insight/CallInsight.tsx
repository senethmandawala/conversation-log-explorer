import { useEffect, useState, useMemo } from "react";
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
  Badge,
  Tooltip,
  ConfigProvider
} from "antd";
import { 
  SearchOutlined, 
  FilterOutlined, 
  DownloadOutlined,
  EyeOutlined,
  PhoneOutlined,
  UserOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  ClearOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { StatusBadge } from "@/components/ui/status-badge";
import "@/components/ui/status-badge.css";
import { motion, AnimatePresence } from "framer-motion";
import { AIHelper } from "@/components/post-call/AIHelper";
import { CallLogDetails } from "./CallLogDetails";
import { useColumnConfig } from "@/hooks/useColumnConfig";
import { ColumnToggle } from "@/components/ui/column-toggle";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface CallRecord {
  id: string;
  msisdn: string;
  agentName: string;
  category: string;
  sentiment: "positive" | "negative" | "neutral";
  duration: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
  callDisposition?: string;
}

const mockCalls: CallRecord[] = [
  { id: "1", msisdn: "+1234567890", agentName: "John Smith", category: "Billing", sentiment: "positive", duration: "5:23", date: "2024-01-15", time: "09:30", status: "completed", callDisposition: "Completed" },
  { id: "2", msisdn: "+1234567891", agentName: "Sarah Johnson", category: "Technical Support", sentiment: "negative", duration: "12:45", date: "2024-01-15", time: "10:15", status: "completed", callDisposition: "Transferred" },
  { id: "3", msisdn: "+1234567892", agentName: "Mike Wilson", category: "Sales", sentiment: "neutral", duration: "8:10", date: "2024-01-15", time: "11:00", status: "completed", callDisposition: "Success" },
  { id: "4", msisdn: "+1234567893", agentName: "Emily Davis", category: "Complaints", sentiment: "negative", duration: "15:30", date: "2024-01-15", time: "11:45", status: "pending", callDisposition: "Pending" },
  { id: "5", msisdn: "+1234567894", agentName: "John Smith", category: "General Inquiry", sentiment: "positive", duration: "3:15", date: "2024-01-15", time: "12:30", status: "completed", callDisposition: "Completed" },
  { id: "6", msisdn: "+1234567895", agentName: "Sarah Johnson", category: "Billing", sentiment: "neutral", duration: "6:45", date: "2024-01-15", time: "14:00", status: "completed", callDisposition: "Success" },
  { id: "7", msisdn: "+1234567896", agentName: "Mike Wilson", category: "Technical Support", sentiment: "positive", duration: "9:20", date: "2024-01-15", time: "14:45", status: "failed", callDisposition: "Failed" },
  { id: "8", msisdn: "+1234567897", agentName: "Emily Davis", category: "Sales", sentiment: "positive", duration: "7:00", date: "2024-01-15", time: "15:30", status: "completed", callDisposition: "Completed" },
  { id: "9", msisdn: "+1234567898", agentName: "John Smith", category: "Billing", sentiment: "neutral", duration: "4:50", date: "2024-01-16", time: "09:00", status: "completed", callDisposition: "Success" },
  { id: "10", msisdn: "+1234567899", agentName: "Sarah Johnson", category: "Technical Support", sentiment: "negative", duration: "18:20", date: "2024-01-16", time: "10:30", status: "completed", callDisposition: "Cancelled" },
];

const SentimentIcon = ({ sentiment }: { sentiment: CallRecord["sentiment"] }) => {
  switch (sentiment) {
    case "positive":
      return <RiseOutlined style={{ color: '#10b981', fontSize: 14 }} />;
    case "negative":
      return <FallOutlined style={{ color: '#ef4444', fontSize: 14 }} />;
    default:
      return <MinusOutlined style={{ color: '#f59e0b', fontSize: 14 }} />;
  }
};

const getSentimentColor = (sentiment: CallRecord["sentiment"]) => {
  switch (sentiment) {
    case "positive": return { bg: '#10b98115', border: '#10b981', text: '#10b981' };
    case "negative": return { bg: '#ef444415', border: '#ef4444', text: '#ef4444' };
    default: return { bg: '#f59e0b15', border: '#f59e0b', text: '#f59e0b' };
  }
};

const getStatusConfig = (status: CallRecord["status"]) => {
  switch (status) {
    case "completed": return { color: 'success' as const, text: 'Completed' };
    case "pending": return { color: 'processing' as const, text: 'Pending' };
    case "failed": return { color: 'error' as const, text: 'Failed' };
  }
};

export default function CallInsight() {
  const { columns: columnConfig, visibleColumns, toggleColumnVisibility, resetToDefault } = useColumnConfig('callInsight');
  const [isLoading, setIsLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSentiment, setSelectedSentiment] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>(undefined);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredCalls = mockCalls.filter(call => {
    const matchesSearch = call.msisdn.includes(searchQuery) || 
                         call.agentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || call.category === selectedCategory;
    const matchesSentiment = !selectedSentiment || call.sentiment === selectedSentiment;
    const matchesStatus = !selectedStatus || call.status === selectedStatus;
    const matchesAgent = !selectedAgent || call.agentName === selectedAgent;
    return matchesSearch && matchesCategory && matchesSentiment && matchesStatus && matchesAgent;
  });

  const activeFiltersCount = [selectedCategory, selectedSentiment, selectedStatus, selectedAgent].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(undefined);
    setSelectedSentiment(undefined);
    setSelectedStatus(undefined);
    setSelectedAgent(undefined);
  };

  const uniqueAgents = [...new Set(mockCalls.map(c => c.agentName))];
  const uniqueCategories = [...new Set(mockCalls.map(c => c.category))];

  // Check if a column should be visible based on env config
  const isColVisible = (key: string): boolean => {
    const col = visibleColumns.find(c => c.def === key);
    return col ? col.visible : true;
  };

  // Create columns based on env config
  const allColumns: ColumnsType<CallRecord> = useMemo(() => {
    const envColumns = visibleColumns;
    
    const baseColumns: ColumnsType<CallRecord> = envColumns.map(col => {
      const columnKey = col.def;
      
      // Map env column definitions to actual table columns
      switch (columnKey) {
        case 'msisdn':
          return {
            title: col.label,
            dataIndex: 'msisdn',
            key: 'msisdn',
            align: 'center' as const,
            render: (text: string) => (
              <StatusBadge title={text} color="primary" size="xs" />
            ),
          };
          
        case 'agent':
          return {
            title: col.label,
            dataIndex: 'agentName',
            key: 'agent',
            align: 'center' as const,
            render: (text: string) => (
              <Text strong style={{ fontFamily: 'Geist, sans-serif' }}>{text}</Text>
            ),
          };
          
        case 'catSubCat':
          return {
            title: col.label,
            dataIndex: 'category',
            key: 'catSubCat',
            align: 'center' as const,
            render: (text: string) => (
              <StatusBadge title={text} color="basic" size="xs" />
            ),
          };
          
        case 'userSentiment':
          return {
            title: col.label,
            dataIndex: 'sentiment',
            key: 'userSentiment',
            align: 'center' as const,
            render: (sentiment: CallRecord["sentiment"]) => {
              const getSentimentIcon = (sentiment: CallRecord["sentiment"]) => {
                switch (sentiment) {
                  case "positive":
                    return { icon: <TablerIcon name="mood-smile-beam" className="text-green-500" size={24} />, title: "Positive" };
                  case "negative":
                    return { icon: <TablerIcon name="mood-sad" className="text-red-500" size={24} />, title: "Negative" };
                  default:
                    return { icon: <TablerIcon name="mood-empty" className="text-yellow-500" size={24} />, title: "Neutral" };
                }
              };

              const sentimentConfig = getSentimentIcon(sentiment);
              return (
                <Tooltip title={sentimentConfig.title}>
                  {sentimentConfig.icon}
                </Tooltip>
              );
            },
          };
          
        case 'callDuration':
          return {
            title: col.label,
            dataIndex: 'duration',
            key: 'callDuration',
            align: 'center' as const,
            render: (text: string) => (
              <Space size={4}>
                <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
                <Text type="secondary">{text}</Text>
              </Space>
            ),
          };
          
        case 'dateTime':
          return {
            title: col.label,
            key: 'dateTime',
            align: 'center' as const,
            render: (_, record) => (
              <div>
                <Text style={{ display: 'block' }}>{record.date}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{record.time}</Text>
              </div>
            ),
          };
          
        case 'caseStatus':
          return {
            title: col.label,
            dataIndex: 'status',
            key: 'caseStatus',
            align: 'center' as const,
            render: (status: CallRecord["status"]) => {
              const getStatusColor = (status: string) => {
                switch (status?.toLowerCase()) {
                  case 'completed':
                    return 'success';
                  case 'pending':
                    return 'amber';
                  case 'failed':
                    return 'warn';
                  default:
                    return 'basic';
                }
              };
              
              return (
                <StatusBadge 
                  title={status} 
                  color={getStatusColor(status)} 
                  size="xs" 
                />
              );
            },
          };
          
        case 'calldisposition':
          return {
            title: col.label,
            dataIndex: 'callDisposition',
            key: 'calldisposition',
            align: 'center' as const,
            render: (text: string) => {
              const getDispositionColor = (disposition: string) => {
                switch (disposition?.toLowerCase()) {
                  case 'completed':
                  case 'success':
                    return 'success';
                  case 'pending':
                  case 'in progress':
                    return 'amber';
                  case 'failed':
                  case 'cancelled':
                    return 'warn';
                  default:
                    return 'basic';
                }
              };
              
              return (
                <StatusBadge 
                  title={text || 'N/A'} 
                  color={getDispositionColor(text)} 
                  size="xs" 
                />
              );
            },
          };
          
        case 'actions':
          return {
            title: (
              <ColumnToggle 
                columns={columnConfig} 
                onToggle={toggleColumnVisibility} 
                onReset={resetToDefault}
              />
            ),
            key: 'actions',
            width: 60,
            fixed: 'right' as const,
            align: 'center' as const,
            render: (_, record) => (
              <Tooltip title="View Details">
                <Button 
                  type="text" 
                  icon={<EyeOutlined />}
                  onClick={() => setSelectedCall(record)}
                  style={{ 
                    borderRadius: 8,
                    transition: 'all 0.2s'
                  }}
                  className="hover:bg-primary/10 hover:text-primary"
                />
              </Tooltip>
            ),
          };
          
        default:
          return {
            title: col.label,
            dataIndex: columnKey,
            key: columnKey,
            align: 'center' as const,
            render: (text: any) => <Text>{text || 'N/A'}</Text>,
          };
      }
    });
    
    return baseColumns;
  }, [visibleColumns, columnConfig, toggleColumnVisibility, resetToDefault]);

  // Use the columns directly from allColumns since they're already filtered by env config
  const columns = allColumns;

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
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <PhoneOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Call Insights</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Analyze and explore individual call recordings and transcripts
                  </Text>
                </div>
              </div>
            }
            extra={
              <Space>
                <Button icon={<DownloadOutlined />}>Export CSV</Button>
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
                            Search MSISDN / Agent
                          </Text>
                          <Input
                            placeholder="Search..."
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
                            Agent
                          </Text>
                          <Select
                            placeholder="All Agents"
                            value={selectedAgent}
                            onChange={setSelectedAgent}
                            allowClear
                            style={{ width: '100%' }}
                            options={uniqueAgents.map(a => ({ label: a, value: a }))}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                            Category
                          </Text>
                          <Select
                            placeholder="All Categories"
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            allowClear
                            style={{ width: '100%' }}
                            options={uniqueCategories.map(c => ({ label: c, value: c }))}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                            Sentiment
                          </Text>
                          <Select
                            placeholder="All Sentiments"
                            value={selectedSentiment}
                            onChange={setSelectedSentiment}
                            allowClear
                            style={{ width: '100%' }}
                            options={[
                              { label: 'Positive', value: 'positive' },
                              { label: 'Neutral', value: 'neutral' },
                              { label: 'Negative', value: 'negative' },
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
                              { label: 'Completed', value: 'completed' },
                              { label: 'Pending', value: 'pending' },
                              { label: 'Failed', value: 'failed' },
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
                      <Col xs={24} lg={12} className="flex items-end justify-end">
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
                dataSource={filteredCalls}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{
                  total: filteredCalls.length,
                  pageSize: 8,
                  showTotal: (total, range) => (
                    <Text type="secondary">
                      Showing <Text strong>{range[0]}-{range[1]}</Text> of <Text strong>{total}</Text> results
                    </Text>
                  ),
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '8', '10', '20'],
                }}
                style={{ borderRadius: 12, overflow: 'hidden' }}
                rowClassName={() => 
                  'transition-all duration-200 hover:shadow-[inset_3px_0_0_0_#6366f1]'
                }
              />
            )}
          </Card>
        </motion.div>
      </div>

      {/* Call Log Details Sheet */}
      <CallLogDetails
        callLog={selectedCall ? {
          id: selectedCall.id,
          date: selectedCall.date,
          time: selectedCall.time,
          msisdn: selectedCall.msisdn,
          agent: selectedCall.agentName,
          callDuration: selectedCall.duration,
          category: selectedCall.category,
          subCategory: "General",
          userSentiment: selectedCall.sentiment,
          agentSentiment: "positive",
          summary: "Customer called regarding " + selectedCall.category.toLowerCase() + " inquiry. Agent " + selectedCall.agentName + " handled the call professionally and addressed all customer concerns.",
          transcription: [
            { speaker: "Agent", text: "Thank you for calling. How may I assist you today?", timestamp: "00:00" },
            { speaker: "Customer", text: "Hi, I need help with my account.", timestamp: "00:05" },
            { speaker: "Agent", text: "I'd be happy to help you with that. Can you please provide your account details?", timestamp: "00:10" },
            { speaker: "Customer", text: "Sure, let me give you that information.", timestamp: "00:18" },
            { speaker: "Agent", text: "Thank you. I can see your account now. How can I assist you further?", timestamp: "00:25" },
          ],
        } : null}
        open={!!selectedCall}
        onClose={() => setSelectedCall(null)}
      />

      <AIHelper />
    </ConfigProvider>
  );
}
