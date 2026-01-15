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
  Progress,
  Skeleton,
  ConfigProvider,
  Pagination
} from "antd";
import { 
  IconArrowLeft,
  IconDownload,
  IconFilter,
  IconSearch,
  IconCalendar,
  IconAlertTriangle,
  IconChevronUp,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEye,
  IconChartBar,
  IconBulb
} from "@tabler/icons-react";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion, AnimatePresence } from "framer-motion";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
import AgentCallLogs from "./AgentCallLogs";
import ViolationWiseAnalysis from "./ViolationWiseAnalysis";

interface ViolationBreakdown {
  type: string;
  count: number;
  percentage: number;
  isSubType?: boolean;
  suggestions?: { text: string }[];
}

interface BadPracticeRecord {
  id: string;
  agent: string;
  agentId: string;
  totalCalls: number;
  violationType: string;
  totalViolations: number;
  score: string;
  scoreValue: number;
  expanded?: boolean;
  violationBreakdown: ViolationBreakdown[];
}

const mockBadPracticeData: BadPracticeRecord[] = [
  {
    id: "1",
    agent: "John Smith",
    agentId: "agent-1",
    totalCalls: 145,
    violationType: "Script Deviation",
    totalViolations: 23,
    score: "72%",
    scoreValue: 72,
    violationBreakdown: [
      { type: "Script Deviation", count: 12, percentage: 52, suggestions: [{ text: "Follow the approved script structure for better compliance" }] },
      { type: "Greeting Issues", count: 5, percentage: 22, isSubType: true },
      { type: "Closing Issues", count: 7, percentage: 30, isSubType: true },
      { type: "Hold Time Exceeded", count: 8, percentage: 35, suggestions: [{ text: "Reduce hold times by having resources readily available" }] },
      { type: "Tone Issues", count: 3, percentage: 13, suggestions: [{ text: "Maintain professional and empathetic tone throughout calls" }] },
    ],
  },
  {
    id: "2",
    agent: "Sarah Johnson",
    agentId: "agent-2",
    totalCalls: 198,
    violationType: "Hold Time Exceeded",
    totalViolations: 15,
    score: "45%",
    scoreValue: 45,
    violationBreakdown: [
      { type: "Hold Time Exceeded", count: 10, percentage: 67, suggestions: [{ text: "Prepare resources before placing customer on hold" }] },
      { type: "Script Deviation", count: 5, percentage: 33, suggestions: [{ text: "Review script guidelines regularly" }] },
    ],
  },
  {
    id: "3",
    agent: "Mike Wilson",
    agentId: "agent-3",
    totalCalls: 167,
    violationType: "Tone Issues",
    totalViolations: 28,
    score: "78%",
    scoreValue: 78,
    violationBreakdown: [
      { type: "Tone Issues", count: 15, percentage: 54, suggestions: [{ text: "Practice active listening and empathy techniques" }] },
      { type: "Interruptions", count: 8, percentage: 29, isSubType: true },
      { type: "Rushed Speech", count: 7, percentage: 25, isSubType: true },
      { type: "Script Deviation", count: 13, percentage: 46, suggestions: [{ text: "Balance personalization with script adherence" }] },
    ],
  },
  {
    id: "4",
    agent: "Emily Davis",
    agentId: "agent-4",
    totalCalls: 134,
    violationType: "Compliance Issues",
    totalViolations: 12,
    score: "38%",
    scoreValue: 38,
    violationBreakdown: [
      { type: "Compliance Issues", count: 8, percentage: 67, suggestions: [{ text: "Complete mandatory compliance training refresher" }] },
      { type: "Missing Disclosures", count: 5, percentage: 42, isSubType: true },
      { type: "Verification Skipped", count: 3, percentage: 25, isSubType: true },
      { type: "Hold Time Exceeded", count: 4, percentage: 33, suggestions: [{ text: "Improve knowledge base navigation skills" }] },
    ],
  },
  {
    id: "5",
    agent: "David Brown",
    agentId: "agent-5",
    totalCalls: 212,
    violationType: "Script Deviation",
    totalViolations: 31,
    score: "82%",
    scoreValue: 82,
    violationBreakdown: [
      { type: "Script Deviation", count: 18, percentage: 58, suggestions: [{ text: "Focus on key script elements while maintaining natural flow" }] },
      { type: "Tone Issues", count: 8, percentage: 26, suggestions: [{ text: "Monitor voice modulation during peak hours" }] },
      { type: "Hold Time Exceeded", count: 5, percentage: 16, suggestions: [{ text: "Use quick reference guides for common issues" }] },
    ],
  },
];

const callTypes = [
  { value: "all", label: "All Call Types" },
  { value: "inbound", label: "Inbound" },
  { value: "outbound", label: "Outbound" },
];

export default function BadPracticeReport() {
  const { setSelectedTab } = usePostCall();
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCallType, setSelectedCallType] = useState<string>("");
  const [agentName, setAgentName] = useState<string>("");
  const [data, setData] = useState<BadPracticeRecord[]>(mockBadPracticeData);
  
  // Call logs view state
  const [showAgentCallLogs, setShowAgentCallLogs] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<{ name: string; id: string } | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleRowExpand = (id: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 70) return "red";
    if (scoreValue >= 50) return "orange";
    return "green";
  };

  const activeFiltersCount = [selectedCallType, agentName].filter(Boolean).length;

  const handleViewCallLogs = (agent: string, agentId: string) => {
    setSelectedAgent({ name: agent, id: agentId });
    setShowAgentCallLogs(true);
  };

  const handleBackToReport = () => {
    setShowAgentCallLogs(false);
    setSelectedAgent(null);
  };

  // Table columns definition
  const columns: ColumnsType<BadPracticeRecord> = [
    {
      title: 'Agent',
      dataIndex: 'agent',
      key: 'agent',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Total Calls',
      dataIndex: 'totalCalls',
      key: 'totalCalls',
      align: 'center' as const,
    },
    {
      title: 'Most Violation Type',
      dataIndex: 'violationType',
      key: 'violationType',
      render: (text: string) => (
        <Tag color="purple" className="rounded-md">{text}</Tag>
      ),
    },
    {
      title: 'Total Violations',
      dataIndex: 'totalViolations',
      key: 'totalViolations',
      align: 'center' as const,
    },
    {
      title: 'Bad Practice Score',
      dataIndex: 'score',
      key: 'score',
      align: 'center' as const,
      render: (score: string, record: BadPracticeRecord) => (
        <Tag color={getScoreColor(record.scoreValue)} className="rounded-xl font-semibold">
          {score}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center' as const,
      render: (_, record: BadPracticeRecord) => (
        <Space>
          <Button
            type="text"
            icon={record.expanded ? <IconChevronUp /> : <IconChevronDown />}
            onClick={() => toggleRowExpand(record.id)}
          />
          <Button
            type="text"
            icon={<IconEye />}
            onClick={() => handleViewCallLogs(record.agent, record.agentId)}
          />
        </Space>
      ),
    },
  ];

  // Show call logs view if selected
  if (showAgentCallLogs && selectedAgent) {
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
        <div className="p-6">
          <Card
            className="rounded-xl border-slate-200"
            styles={{ body: { padding: 24 } }}
          >
            <AgentCallLogs
              agentName={selectedAgent.name}
              agentId={selectedAgent.id}
              onBack={handleBackToReport}
            />
          </Card>
        </div>
        <AIHelper />
      </ConfigProvider>
    );
  }

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
                <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <IconAlertTriangle className="text-white text-xl" />
                </div>
                <div>
                  <Title level={5} className="!m-0 !font-semibold">Bad Practice Analysis</Title>
                  <Text type="secondary" className="text-[13px]">
                    Identify and analyze agent behaviors that deviate from best practices
                  </Text>
                </div>
              </div>
            }
            extra={
              <Space>
                <Button 
                  type={filtersOpen ? "primary" : "default"}
                  icon={<IconFilter />}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  Filters
                  {activeFiltersCount > 0 && (
                    <Tag color="red" className="ml-2 rounded-lg">{activeFiltersCount}</Tag>
                  )}
                </Button>
              </Space>
            }
          >
            {/* Filters Panel */}
            <AnimatePresence>
              {filtersOpen && (
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
                    styles={{ body: { padding: 16 } }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Date Range</Text>
                          <RangePicker className="w-full" />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Agent Name</Text>
                          <Input
                            placeholder="Search agent..."
                            prefix={<IconSearch className="text-slate-400" />}
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Call Type</Text>
                          <Select
                            placeholder="All Call Types"
                            className="w-full"
                            allowClear
                            value={selectedCallType ? selectedCallType : undefined}
                            onChange={(value) => setSelectedCallType(value === "" ? "" : value)}
                            options={[
                              { value: "", label: "All Call Types" },
                              { value: "inbound", label: "Inbound" },
                              { value: "outbound", label: "Outbound" },
                            ]}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6} className="flex items-end">
                        <Button type="primary" className="w-full">Search</Button>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton.Input key={i} active block className="h-[52px]" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Title level={5} className="mb-4">Agent Wise Analysis</Title>
                  <div className="rounded-xl overflow-hidden border border-slate-200">
                  {/* Table Header */}
                  <div className="flex bg-slate-50 border-b border-slate-200">
                    <div className="flex-1 px-4 py-3 font-semibold text-slate-600">Agent</div>
                    <div className="flex-1 px-4 py-3 font-semibold text-slate-600 text-center">Total Calls</div>
                    <div className="flex-1 px-4 py-3 font-semibold text-slate-600">Most Violation Type</div>
                    <div className="flex-1 px-4 py-3 font-semibold text-slate-600 text-center">Total Violations</div>
                    <div className="flex-1 px-4 py-3 font-semibold text-slate-600 text-center">Bad Practice Score</div>
                    <div className="flex-1 px-4 py-3 font-semibold text-slate-600 text-center">Actions</div>
                  </div>
                  
                  {/* Table Body with Expanded Rows */}
                  {paginatedData.map((record, index) => (
                    <div key={record.id}>
                      {/* Main Row */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`flex border-b border-slate-200 hover:bg-slate-50 transition-colors ${record.expanded ? 'bg-slate-50' : ''}`}
                      >
                        <div className="flex-1 px-4 py-3">
                          <Text strong>{record.agent}</Text>
                        </div>
                        <div className="flex-1 px-4 py-3 text-center">
                          {record.totalCalls}
                        </div>
                        <div className="flex-1 px-4 py-3">
                          <Tag color="purple" className="rounded-md">{record.violationType}</Tag>
                        </div>
                        <div className="flex-1 px-4 py-3 text-center">
                          {record.totalViolations}
                        </div>
                        <div className="flex-1 px-4 py-3 text-center">
                          <Tag color={getScoreColor(record.scoreValue)} className="rounded-xl font-semibold">
                            {record.score}
                          </Tag>
                        </div>
                        <div className="flex-1 px-4 py-3 text-center">
                          <Space>
                            <Button
                              type="text"
                              icon={record.expanded ? <IconChevronUp /> : <IconChevronDown />}
                              onClick={() => toggleRowExpand(record.id)}
                            />
                            <Button
                              type="text"
                              icon={<IconEye />}
                              onClick={() => handleViewCallLogs(record.agent, record.agentId)}
                            />
                          </Space>
                        </div>
                      </motion.div>
                      
                      {/* Expanded Content */}
                      <AnimatePresence>
                        {record.expanded && (
                          <motion.div
                            key={`${record.id}-expanded`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-b border-slate-200 bg-slate-50"
                          >
                            <div className="p-6 flex gap-6">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-4">
                                    <IconChartBar className="text-amber-500" />
                                    <Text strong className="text-sm">Violation Breakdown</Text>
                                  </div>
                                  <div className="space-y-3">
                                    {record.violationBreakdown.map((violation, vIndex) => (
                                      <div key={vIndex} className={violation.isSubType ? 'ml-4' : ''}>
                                        <div className="flex justify-between mb-1">
                                          <Text 
                                            className={`text-sm ${violation.isSubType ? 'text-slate-400' : 'font-medium text-slate-800'}`}
                                          >
                                            {violation.isSubType ? `└ ${violation.type}` : violation.type}
                                          </Text>
                                          <Text 
                                            className={`text-sm ${violation.isSubType ? 'text-slate-400' : 'text-slate-800'}`}
                                          >
                                            {violation.count} ({violation.percentage}%)
                                          </Text>
                                        </div>
                                        <Progress 
                                          percent={violation.percentage} 
                                          size="small"
                                          className="!m-0"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Vertical Separator */}
                                <div className="w-0.5 bg-slate-200 self-stretch" />

                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-4">
                                    <IconBulb className="text-indigo-500" />
                                    <Text strong className="text-sm">Agent Recommendations</Text>
                                  </div>
                                  <div className="space-y-2">
                                    {record.violationBreakdown
                                      .filter(v => v.suggestions && v.suggestions.length > 0)
                                      .flatMap(v => v.suggestions || [])
                                      .map((suggestion, sIndex) => (
                                        <div key={sIndex} className="flex gap-2 text-sm">
                                          <Text type="secondary">•</Text>
                                          <Text>{suggestion.text}</Text>
                                        </div>
                                      ))
                                    }
                                  </div>
                                </div>
                              </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
                
                {/* Exact CallInsight Pagination - No Table Wrapper */}
                <div className="flex justify-end mt-4">
                  <Pagination
                    total={totalRecords}
                    pageSize={pageSize}
                    showTotal={(total, range) => (
                      <Text type="secondary">
                        Showing <Text strong>{range[0]}-{range[1]}</Text> of <Text strong>{total}</Text> results
                      </Text>
                    )}
                    showSizeChanger={true}
                    pageSizeOptions={['5', '8', '10', '20']}
                    current={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                    onShowSizeChange={(current, size) => {
                      setCurrentPage(1);
                    }}
                  />
                </div>
                </motion.div>

                {/* Violation-wise Analysis Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ViolationWiseAnalysis />
                </motion.div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
      <AIHelper />
    </ConfigProvider>
  );
}
