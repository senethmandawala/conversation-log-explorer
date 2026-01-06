import { useEffect, useState } from "react";
import { 
  Card, Button, Input, Tag, Checkbox, Table, Select, Popover, 
  Space, Typography, Badge, Skeleton, Tooltip, Row, Col
} from "antd";
import { 
  DownloadOutlined, FilterOutlined, ClockCircleOutlined,
  RiseOutlined, FallOutlined, MinusOutlined, EyeOutlined,
  PlayCircleOutlined, PauseCircleOutlined, CloseOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion, AnimatePresence } from "framer-motion";
import { CallLogDetails } from "@/components/post-call/CallLogDetails";

const { Title, Text } = Typography;

interface CallRecord {
  id: string;
  key: string;
  callid: string;
  msisdn: string;
  agent: string;
  category: string;
  subCategory: string;
  userSentiment: "positive" | "negative" | "neutral";
  agentSentiment: "positive" | "negative" | "neutral";
  callDuration: string;
  date: string;
  time: string;
  caseStatus: "Open" | "Closed" | "Pending";
  calldisposition: { status: string; color: string }[];
}

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  configurable: boolean;
}

const mockCalls: CallRecord[] = [
  { id: "1", key: "1", callid: "CALL-001", msisdn: "+1234567890", agent: "John Smith", category: "Billing", subCategory: "Payment Issue", userSentiment: "positive", agentSentiment: "positive", callDuration: "5:23", date: "2024-01-15", time: "09:30", caseStatus: "Closed", calldisposition: [{ status: "Resolved", color: "success" }] },
  { id: "2", key: "2", callid: "CALL-002", msisdn: "+1234567891", agent: "Sarah Johnson", category: "Technical Support", subCategory: "Network Issue", userSentiment: "negative", agentSentiment: "neutral", callDuration: "12:45", date: "2024-01-15", time: "10:15", caseStatus: "Open", calldisposition: [{ status: "Escalated", color: "warning" }] },
  { id: "3", key: "3", callid: "CALL-003", msisdn: "+1234567892", agent: "Mike Wilson", category: "Sales", subCategory: "New Plan", userSentiment: "neutral", agentSentiment: "positive", callDuration: "8:10", date: "2024-01-15", time: "11:00", caseStatus: "Closed", calldisposition: [{ status: "Completed", color: "success" }] },
  { id: "4", key: "4", callid: "CALL-004", msisdn: "+1234567893", agent: "Emily Davis", category: "Complaints", subCategory: "Service Quality", userSentiment: "negative", agentSentiment: "neutral", callDuration: "15:30", date: "2024-01-15", time: "11:45", caseStatus: "Pending", calldisposition: [{ status: "In Progress", color: "processing" }] },
  { id: "5", key: "5", callid: "CALL-005", msisdn: "+1234567894", agent: "John Smith", category: "General Inquiry", subCategory: "Account Info", userSentiment: "positive", agentSentiment: "positive", callDuration: "3:15", date: "2024-01-15", time: "12:30", caseStatus: "Closed", calldisposition: [{ status: "Resolved", color: "success" }] },
  { id: "6", key: "6", callid: "CALL-006", msisdn: "+1234567895", agent: "Sarah Johnson", category: "Billing", subCategory: "Refund Request", userSentiment: "neutral", agentSentiment: "positive", callDuration: "6:45", date: "2024-01-15", time: "14:00", caseStatus: "Closed", calldisposition: [{ status: "Resolved", color: "success" }] },
  { id: "7", key: "7", callid: "CALL-007", msisdn: "+1234567896", agent: "Mike Wilson", category: "Technical Support", subCategory: "Device Issue", userSentiment: "positive", agentSentiment: "positive", callDuration: "9:20", date: "2024-01-15", time: "14:45", caseStatus: "Open", calldisposition: [{ status: "Dropped Call", color: "warning" }, { status: "Communication Issue", color: "processing" }] },
  { id: "8", key: "8", callid: "CALL-008", msisdn: "+1234567897", agent: "Emily Davis", category: "Sales", subCategory: "Upgrade", userSentiment: "positive", agentSentiment: "positive", callDuration: "7:00", date: "2024-01-15", time: "15:30", caseStatus: "Closed", calldisposition: [{ status: "Completed", color: "success" }] },
];

const defaultColumnConfig: ColumnConfig[] = [
  { key: 'callid', label: 'Call ID', visible: true, configurable: true },
  { key: 'dateTime', label: 'Date Time', visible: true, configurable: false },
  { key: 'msisdn', label: 'MSISDN', visible: true, configurable: false },
  { key: 'category', label: 'Category', visible: true, configurable: true },
  { key: 'calldisposition', label: 'Call Disposition', visible: true, configurable: true },
  { key: 'callDuration', label: 'Call Duration', visible: true, configurable: true },
  { key: 'userSentiment', label: 'User Sentiment', visible: true, configurable: true },
  { key: 'agent', label: 'Agent', visible: true, configurable: true },
  { key: 'agentSentiment', label: 'Agent Sentiment', visible: true, configurable: true },
  { key: 'caseStatus', label: 'Case Status', visible: true, configurable: true },
  { key: 'actions', label: 'Actions', visible: true, configurable: false },
];

const SentimentIcon = ({ sentiment }: { sentiment: "positive" | "negative" | "neutral" }) => {
  const icons = {
    positive: <RiseOutlined style={{ color: '#52c41a', fontSize: 16 }} />,
    negative: <FallOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />,
    neutral: <MinusOutlined style={{ color: '#faad14', fontSize: 16 }} />,
  };
  return icons[sentiment];
};

const getStatusTagColor = (color: string): string => {
  const colorMap: Record<string, string> = { success: 'success', warning: 'warning', processing: 'processing', error: 'error' };
  return colorMap[color] || 'default';
};

const getCaseStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = { Open: 'processing', Closed: 'success', Pending: 'warning' };
  return colorMap[status] || 'default';
};

export default function CallInsight() {
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [msisdnFilter, setMsisdnFilter] = useState("");
  const [agentNameFilter, setAgentNameFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedUserSentiment, setSelectedUserSentiment] = useState<string | undefined>(undefined);
  const [selectedAgentSentiment, setSelectedAgentSentiment] = useState<string | undefined>(undefined);
  const [selectedCaseStatus, setSelectedCaseStatus] = useState<string | undefined>(undefined);
  const [keywordFilter, setKeywordFilter] = useState("");
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);
  const [playingCallId, setPlayingCallId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredCalls = mockCalls.filter(call => {
    return (!msisdnFilter || call.msisdn.includes(msisdnFilter)) &&
      (!agentNameFilter || call.agent.toLowerCase().includes(agentNameFilter.toLowerCase())) &&
      (!selectedCategory || call.category === selectedCategory) &&
      (!selectedUserSentiment || call.userSentiment === selectedUserSentiment) &&
      (!selectedAgentSentiment || call.agentSentiment === selectedAgentSentiment) &&
      (!selectedCaseStatus || call.caseStatus === selectedCaseStatus) &&
      (!keywordFilter || call.category.toLowerCase().includes(keywordFilter.toLowerCase()) || call.subCategory.toLowerCase().includes(keywordFilter.toLowerCase()));
  });

  const activeFiltersCount = [msisdnFilter, agentNameFilter, selectedCategory, selectedUserSentiment, selectedAgentSentiment, selectedCaseStatus, keywordFilter].filter(Boolean).length;

  const clearFilters = () => {
    setMsisdnFilter(""); setAgentNameFilter(""); setSelectedCategory(undefined);
    setSelectedUserSentiment(undefined); setSelectedAgentSentiment(undefined);
    setSelectedCaseStatus(undefined); setKeywordFilter("");
  };

  const toggleColumnVisibility = (key: string) => {
    setColumnConfig(prev => prev.map(col => col.key === key ? { ...col, visible: !col.visible } : col));
  };

  const isColumnVisible = (key: string) => columnConfig.find(c => c.key === key)?.visible ?? true;

  const columns: ColumnsType<CallRecord> = [
    ...(isColumnVisible('callid') ? [{ title: 'Call ID', dataIndex: 'callid', key: 'callid', width: 120, render: (text: string) => <Text code>{text}</Text> }] : []),
    ...(isColumnVisible('dateTime') ? [{ title: 'Date Time', key: 'dateTime', width: 130, render: (_: unknown, record: CallRecord) => (<div><div>{record.date}</div><Text type="secondary" style={{ fontSize: 12 }}>{record.time}</Text></div>) }] : []),
    ...(isColumnVisible('msisdn') ? [{ title: 'MSISDN', dataIndex: 'msisdn', key: 'msisdn', width: 140, render: (text: string) => <Text code>{text}</Text> }] : []),
    ...(isColumnVisible('category') ? [{ title: 'Category', dataIndex: 'category', key: 'category', width: 150 }] : []),
    ...(isColumnVisible('calldisposition') ? [{ title: 'Call Disposition', key: 'calldisposition', width: 180, render: (_: unknown, record: CallRecord) => (<Space size={[4, 4]} wrap>{record.calldisposition.map((badge, i) => (<Tag key={i} color={getStatusTagColor(badge.color)}>{badge.status}</Tag>))}</Space>) }] : []),
    ...(isColumnVisible('callDuration') ? [{ title: 'Duration', dataIndex: 'callDuration', key: 'callDuration', width: 100, render: (text: string) => (<Space><ClockCircleOutlined style={{ color: '#8c8c8c' }} /><Text type="secondary">{text}</Text></Space>) }] : []),
    ...(isColumnVisible('userSentiment') ? [{ title: 'User Sentiment', key: 'userSentiment', width: 120, align: 'center' as const, render: (_: unknown, record: CallRecord) => <SentimentIcon sentiment={record.userSentiment} /> }] : []),
    ...(isColumnVisible('agent') ? [{ title: 'Agent', dataIndex: 'agent', key: 'agent', width: 130 }] : []),
    ...(isColumnVisible('agentSentiment') ? [{ title: 'Agent Sentiment', key: 'agentSentiment', width: 130, align: 'center' as const, render: (_: unknown, record: CallRecord) => <SentimentIcon sentiment={record.agentSentiment} /> }] : []),
    ...(isColumnVisible('caseStatus') ? [{ title: 'Status', key: 'caseStatus', width: 100, align: 'center' as const, render: (_: unknown, record: CallRecord) => (<Tag color={getCaseStatusColor(record.caseStatus)}>{record.caseStatus}</Tag>) }] : []),
    ...(isColumnVisible('actions') ? [{ title: '', key: 'actions', width: 90, fixed: 'right' as const, render: (_: unknown, record: CallRecord) => (
      <Space>
        <Tooltip title={playingCallId === record.id ? "Pause" : "Play"}>
          <Button type={playingCallId === record.id ? "primary" : "text"} icon={playingCallId === record.id ? <PauseCircleOutlined /> : <PlayCircleOutlined />} size="small" onClick={() => setPlayingCallId(playingCallId === record.id ? null : record.id)} />
        </Tooltip>
        <Tooltip title="View Details">
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => setSelectedCall(record)} />
        </Tooltip>
      </Space>
    )}] : []),
  ];

  const columnConfigContent = (
    <div style={{ padding: 8, minWidth: 180 }}>
      <Title level={5} style={{ marginBottom: 12 }}>Configure Columns</Title>
      <Space direction="vertical">
        {columnConfig.filter(col => col.configurable).map(col => (
          <Checkbox key={col.key} checked={col.visible} onChange={() => toggleColumnVisibility(col.key)}>{col.label}</Checkbox>
        ))}
      </Space>
    </div>
  );

  const filterPopover = (value: string, setValue: (v: string) => void, placeholder: string) => (
    <div style={{ width: 200 }}>
      <Input placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} style={{ marginBottom: 8 }} />
      <Button type="primary" block size="small">Apply</Button>
    </div>
  );

  return (
    <>
      <div style={{ padding: 24 }}>
        <Card styles={{ body: { padding: 24 } }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <Title level={4} style={{ marginBottom: 4 }}>Call Insights</Title>
              <Text type="secondary">Analyze and explore individual call recordings and transcripts</Text>
            </div>
            <Space>
              <Tooltip title="Export CSV"><Button icon={<DownloadOutlined />} /></Tooltip>
              <Popover content={columnConfigContent} trigger="click" placement="bottomRight">
                <Button>Columns</Button>
              </Popover>
              <Badge count={activeFiltersCount} size="small">
                <Button type={filtersOpen ? "primary" : "default"} icon={<FilterOutlined />} onClick={() => setFiltersOpen(!filtersOpen)} />
              </Badge>
            </Space>
          </div>

          {isLoading ? <Skeleton active paragraph={{ rows: 5 }} /> : (
            <>
              <AnimatePresence>
                {filtersOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: 16, overflow: 'hidden' }}>
                    <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                      <Col xs={24} sm={12} md={8} lg={4}>
                        <Popover content={filterPopover(msisdnFilter, setMsisdnFilter, "Enter MSISDN")} trigger="click">
                          <Button block type={msisdnFilter ? "primary" : "default"} ghost={!!msisdnFilter}>
                            {msisdnFilter || "MSISDN"}
                            {msisdnFilter && <CloseOutlined onClick={(e) => { e.stopPropagation(); setMsisdnFilter(""); }} style={{ marginLeft: 8 }} />}
                          </Button>
                        </Popover>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={4}>
                        <Popover content={filterPopover(agentNameFilter, setAgentNameFilter, "Enter Agent Name")} trigger="click">
                          <Button block type={agentNameFilter ? "primary" : "default"} ghost={!!agentNameFilter}>
                            {agentNameFilter || "Agent Name"}
                            {agentNameFilter && <CloseOutlined onClick={(e) => { e.stopPropagation(); setAgentNameFilter(""); }} style={{ marginLeft: 8 }} />}
                          </Button>
                        </Popover>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={4}>
                        <Select placeholder="Category" value={selectedCategory} onChange={setSelectedCategory} allowClear style={{ width: '100%' }}
                          options={[{ value: 'Billing', label: 'Billing' }, { value: 'Technical Support', label: 'Technical Support' }, { value: 'Sales', label: 'Sales' }, { value: 'Complaints', label: 'Complaints' }, { value: 'General Inquiry', label: 'General Inquiry' }]} />
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={4}>
                        <Select placeholder="Case Status" value={selectedCaseStatus} onChange={setSelectedCaseStatus} allowClear style={{ width: '100%' }}
                          options={[{ value: 'Open', label: 'Open' }, { value: 'Closed', label: 'Closed' }, { value: 'Pending', label: 'Pending' }]} />
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={4}>
                        <Select placeholder="User Sentiment" value={selectedUserSentiment} onChange={setSelectedUserSentiment} allowClear style={{ width: '100%' }}
                          options={[{ value: 'positive', label: 'Positive' }, { value: 'neutral', label: 'Neutral' }, { value: 'negative', label: 'Negative' }]} />
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={4}>
                        <Select placeholder="Agent Sentiment" value={selectedAgentSentiment} onChange={setSelectedAgentSentiment} allowClear style={{ width: '100%' }}
                          options={[{ value: 'positive', label: 'Positive' }, { value: 'neutral', label: 'Neutral' }, { value: 'negative', label: 'Negative' }]} />
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={4}>
                        <Popover content={filterPopover(keywordFilter, setKeywordFilter, "Enter keyword")} trigger="click">
                          <Button block type={keywordFilter ? "primary" : "default"} ghost={!!keywordFilter}>
                            {keywordFilter || "Search Key"}
                            {keywordFilter && <CloseOutlined onClick={(e) => { e.stopPropagation(); setKeywordFilter(""); }} style={{ marginLeft: 8 }} />}
                          </Button>
                        </Popover>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={4}>
                        <Space>
                          <Button type="primary" shape="round">Search</Button>
                          {activeFiltersCount > 0 && <Button shape="round" onClick={clearFilters}>Clear</Button>}
                        </Space>
                      </Col>
                    </Row>
                  </motion.div>
                )}
              </AnimatePresence>

              <Table
                columns={columns}
                dataSource={filteredCalls}
                pagination={{ pageSize, pageSizeOptions: ['5', '10', '25', '50'], showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`, onShowSizeChange: (_, size) => setPageSize(size) }}
                scroll={{ x: 1200 }}
                size="middle"
              />
            </>
          )}
        </Card>
      </div>

      <CallLogDetails
        callLog={selectedCall ? {
          id: selectedCall.id, date: selectedCall.date, time: selectedCall.time, msisdn: selectedCall.msisdn,
          agent: selectedCall.agent, callDuration: selectedCall.callDuration, category: selectedCall.category,
          subCategory: selectedCall.subCategory, userSentiment: selectedCall.userSentiment, agentSentiment: selectedCall.agentSentiment,
          summary: `Customer called regarding ${selectedCall.category.toLowerCase()} inquiry. Agent ${selectedCall.agent} handled the call professionally.`,
          transcription: [
            { speaker: "Agent", text: "Thank you for calling. How may I assist you today?", timestamp: "00:00" },
            { speaker: "Customer", text: "Hi, I need help with my account.", timestamp: "00:05" },
            { speaker: "Agent", text: "I'd be happy to help you with that.", timestamp: "00:10" },
          ],
        } : null}
        open={!!selectedCall}
        onClose={() => setSelectedCall(null)}
      />
      <AIHelper />
    </>
  );
}
