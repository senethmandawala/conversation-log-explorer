import { useEffect, useState, useMemo, useCallback } from "react";
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
  IconSearch, 
  IconFilter, 
  IconDownload,
  IconEye,
  IconUsers,
  IconUser,
  IconPhone,
  IconClock,
  IconTrophy,
  IconStar,
  IconTrendingUp,
  IconTrendingDown,
  IconClearAll,
  IconTarget
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { AIHelper } from "@/components/post-call/AIHelper";
import { usePostCall } from "@/contexts/PostCallContext";
import { useColumnConfig } from "@/hooks/useColumnConfig";
import { ColumnToggle } from "@/components/ui/column-toggle";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { ExceptionHandleView } from "@/components/ui/ExceptionHandleView";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { callRoutingApiService, type Filters } from "@/services/callRoutingApiService";
import { useProjectSelection } from "@/services/projectSelectionService";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface AgentMetric {
  agentID: number;
  agentName: string;
  totalCalls: number;
  openCases: number;
  agentGroup: string[];
  firstCallResolution: string;
  avgHandlingTime: string;
  averageSilent: string;
  averageWaitingTime: string;
  qualityScore: string;
  overallSentiment: string;
  selfManagement: number;
  assistantKindnessRating: number;
  assistantEmpathyRating: number;
  negativeCommentsTowardsTheBrand: number;
  satisfaction: number;
  callConfidently: number;
  upselling: number;
  droppedCall: number;
  escalation: number;
  transfer: number;
  requestWaiting: number;
  thankingForWaiting: number;
  welcomeMsg: number;
  satisfactionScore: number;
  [key: string]: any;
}


const getSentimentColor = (sentiment: string) => {
  switch (sentiment?.toLowerCase()) {
    case "positive": return { color: '#10b981', bg: '#10b98115', label: 'Positive' };
    case "neutral": return { color: '#f59e0b', bg: '#f59e0b15', label: 'Neutral' };
    case "negative": return { color: '#ef4444', bg: '#ef444415', label: 'Negative' };
    default: return { color: '#94a3b8', bg: '#94a3b815', label: 'Unknown' };
  }
};


const getProgressColor = (value: number) => {
  if (value >= 90) return '#10b981';
  if (value >= 80) return '#3b82f6';
  if (value >= 70) return '#f59e0b';
  return '#ef4444';
};


export default function AgentPerformance() {
  const { setSelectedAgentId, setSelectedTab } = usePostCall();
  const { columns: columnConfig, visibleColumns, toggleColumnVisibility, resetToDefault } = useColumnConfig('agent');
  const { selectedProject } = useProjectSelection();
  const [isLoading, setIsLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  
  // API Data
  const [agentData, setAgentData] = useState<AgentMetric[]>([]);
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [exceptionType, setExceptionType] = useState<'loading' | '200' | '204' | '500' | '503' | 'no-records' | ''>('loading');

  // Get project IDs
  const getProjectFilters = useCallback((): Filters => {
    if (!selectedProject) return {};
    return {
      tenantId: parseInt(selectedProject.tenant_id),
      subtenantId: parseInt(selectedProject.sub_tenant_id),
      companyId: parseInt(selectedProject.company_id),
      departmentId: parseInt(selectedProject.department_id),
    };
  }, [selectedProject]);

  // Fetch group filter options
  const fetchGroupFilters = useCallback(async () => {
    const projectFilters = getProjectFilters();
    if (!selectedProject) return;
    
    try {
      const response = await callRoutingApiService.AgentPerformanceGroupFilter(projectFilters);
      if (response.status === 'SUCCESS' || response.status === 'success') {
        const groups = response.data?.agentGroups || [];
        setGroupOptions(groups);
      }
    } catch (err) {
      console.error('Failed to fetch group filters:', err);
    }
  }, [getProjectFilters, selectedProject]);

  // Fetch agent performance data
  const fetchAgentPerformance = useCallback(async (page = 1, pageSize = 10, filters: Filters = {}) => {
    const projectFilters = getProjectFilters();
    if (!selectedProject) return;
    
    setIsLoading(true);
    setError(null);
    setExceptionType('loading');
    
    try {
      const response = await callRoutingApiService.AgentPerformance({
        page: page,
        size: pageSize,
        sort: 'agent_id',
        sortOrder: 'asc',
        ...projectFilters,
        ...filters
      });

      if (response.status === 'SUCCESS' || response.status === 'success') {
        const data = response.data;
        const content = Array.isArray(data?.content) ? data.content : [];
        const totalElements = data?.totalElements || 0;
        
        // Set summary data
        setSummaryData({
          average_kindness: data.average_kindness || 0,
          average_empathy: data.average_empathy || 0,
          average_dropped_call_rate: data.average_dropped_call_rate || 0,
          average_waiting_time: data.average_waiting_time || '0min 0sec',
          average_silence_time: data.average_silence_time || '0min 0sec',
          average_fcr_rate: data.average_fcr_rate || 0,
          attention_need_agents: data.attention_need_agents || '',
          top_performing_agents: data.top_performing_agents || '',
          high_score_percentage: data.high_score_percentage || '0%'
        });
        
        if (!content || content.length === 0) {
          if (Object.keys(filters).length > 0) {
            setExceptionType('200');
          } else {
            setExceptionType('no-records');
          }
        } else {
          setExceptionType('');
        }
        
        setAgentData(content);
        setPagination(prev => ({
          ...prev,
          total: totalElements,
          current: page,
          pageSize: pageSize
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch agent performance data');
      }
    } catch (err) {
      console.error('Failed to fetch agent performance:', err);
      setError('Failed to load agent performance data. Please try again.');
      setExceptionType('500');
      setAgentData([]);
    } finally {
      setIsLoading(false);
    }
  }, [getProjectFilters, selectedProject]);

  // Initialize data on component mount and when project changes
  useEffect(() => {
    if (!selectedProject) return;
    
    const initializeData = async () => {
      await Promise.all([
        fetchGroupFilters(),
        fetchAgentPerformance(1, pagination.pageSize, {})
      ]);
    };
    
    initializeData();
  }, [selectedProject]);

  // Build filters object for API calls
  const buildApiFilters = useCallback((): Filters => {
    const filters: Filters = {};
    
    if (searchQuery) filters.agentName = searchQuery;
    if (selectedGroup) filters.agentGroup = selectedGroup;
    
    // Add date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      filters.fromTime = dateRange[0].format('YYYY-MM-DD');
      filters.toTime = dateRange[1].format('YYYY-MM-DD');
    }
    
    return filters;
  }, [searchQuery, selectedGroup, dateRange]);

  // Handle filter application
  const applyFilters = useCallback(() => {
    setExceptionType('loading');
    fetchAgentPerformance(1, pagination.pageSize, buildApiFilters());
  }, [fetchAgentPerformance, pagination.pageSize, buildApiFilters]);

  // Handle pagination change
  const handleTableChange = useCallback((paginationInfo: any) => {
    fetchAgentPerformance(paginationInfo.current, paginationInfo.pageSize, buildApiFilters());
  }, [fetchAgentPerformance, buildApiFilters]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedGroup) count++;
    if (dateRange) count++;
    return count;
  }, [searchQuery, selectedGroup, dateRange]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedGroup("");
    setDateRange(null);
    setExceptionType('loading');
    fetchAgentPerformance(1, pagination.pageSize, {});
  };

  // Export to CSV
  const exportToCSV = useCallback(async () => {
    const projectFilters = getProjectFilters();
    const currentFilters = buildApiFilters();
    const exportFilters = { 
      ...projectFilters,
      ...currentFilters, 
      format: 'csv' 
    };
    
    console.log('Starting CSV export with filters:', exportFilters);
    
    try {
      const csvContent = await callRoutingApiService.getAgentPerformanceAsCSV(
        1, 
        pagination.pageSize, 
        'agent_id', 
        'asc', 
        exportFilters
      );
      
      console.log('Received CSV content length:', csvContent.length);
      
      if (!csvContent) {
        console.error('No CSV content received from API');
        setError('Failed to export CSV. No data received.');
        return;
      }

      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
      console.log('Created blob:', blob.size, 'bytes');
      
      const url = window.URL.createObjectURL(blob);
      console.log('Created object URL:', url);
      
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = `agent_performance_${new Date().toISOString().split('T')[0]}.csv`;
      
      document.body.appendChild(link);
      console.log('Triggering download...');
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('Download cleanup completed');
      }, 100);
      
    } catch (error) {
      console.error('Error in CSV export:', error);
      setError('Failed to export CSV. Please try again.');
    }
  }, [getProjectFilters, buildApiFilters, pagination.pageSize]);

  const handleViewAgent = (agent: AgentMetric) => {
    setSelectedAgentId(agent.agentID.toString());
    setSelectedTab("agent-insights");
  };

  // Summary stats from API
  const totalAgents = pagination.total;
  const avgFCR = summaryData?.average_fcr_rate || 0;
  const avgKindness = summaryData?.average_kindness || 0;
  const avgEmpathy = summaryData?.average_empathy || 0;

  // Check if a column should be visible based on env config
  const isColVisible = (key: string): boolean => {
    const col = visibleColumns.find(c => c.def === key);
    return col ? col.visible : true; // Default to true if not in config
  };

  // Create columns based on env config
  const allColumns: ColumnsType<AgentMetric> = useMemo(() => {
    const envColumns = visibleColumns;
    
    const baseColumns: ColumnsType<AgentMetric> = envColumns.map(col => {
      const columnKey = col.def;
      
      // Map env column definitions to actual table columns
      switch (columnKey) {
        case 'agent':
          return {
            title: col.label,
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
                  <span className="text-white text-sm font-semibold">{record.agentName?.substring(0, 2).toUpperCase() || 'NA'}</span>
                </div>
                <div>
                  <Text strong>{record.agentName || 'N/A'}</Text>
                  <br />
                  <Text type="secondary" className="text-xs">{record.agentID}</Text>
                </div>
              </Space>
            ),
          };
          
        case 'qualityScore':
          return {
            title: col.label,
            dataIndex: 'qualityScore',
            key: 'qualityScore',
            align: 'center' as const,
            render: (value: string) => (
              <StatusBadge title={value || '0'} color="success" size="xs" />
            ),
          };
          
        case 'totalCalls':
          return {
            title: col.label,
            dataIndex: 'totalCalls',
            key: 'totalCalls',
            align: 'center' as const,
            render: (value: number) => (
              <StatusBadge title={value?.toString() || '0'} color="primary" size="xs" />
            ),
          };
          
        case 'fcrRate':
          return {
            title: col.label,
            dataIndex: 'firstCallResolution',
            key: 'fcrRate',
            align: 'center' as const,
            render: (value: string) => {
              const numValue = parseFloat(value || '0');
              const getColor = (val: number) => {
                if (val >= 90) return 'success';
                if (val >= 80) return 'primary';
                if (val >= 70) return 'amber';
                return 'warn';
              };
              return (
                <StatusBadge title={value || '0%'} color={getColor(numValue)} size="xs" />
              );
            },
          };
          
        case 'sentiment':
          return {
            title: col.label,
            dataIndex: 'overallSentiment',
            key: 'sentiment',
            align: 'center' as const,
            render: (value: string) => {
              const getSentimentIcon = (sentiment: string) => {
                switch (sentiment?.toLowerCase()) {
                  case 'positive':
                    return { icon: <TablerIcon name="mood-smile-beam" className="text-green-500" size={24} />, title: "Positive" };
                  case 'negative':
                    return { icon: <TablerIcon name="mood-sad" className="text-red-500" size={24} />, title: "Negative" };
                  default:
                    return { icon: <TablerIcon name="mood-empty" className="text-yellow-500" size={24} />, title: "Neutral" };
                }
              };

              const sentimentConfig = getSentimentIcon(value);
              return (
                <Tooltip title={sentimentConfig.title}>
                  {sentimentConfig.icon}
                </Tooltip>
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
            render: (_: any, record: AgentMetric) => (
              <Tooltip title="View Details">
                <Button 
                  type="text" 
                  icon={<IconEye />}
                  onClick={() => handleViewAgent(record)}
                  className="rounded-lg transition-all hover:bg-primary/10 hover:text-primary"
                />
              </Tooltip>
            ),
          };
          
        case 'averageSilent':
          return {
            title: col.label,
            dataIndex: 'averageSilent',
            key: 'averageSilent',
            align: 'center' as const,
            render: (value: string) => <Text>{value || '0 sec'}</Text>,
          };
          
        case 'averageWaitingTime':
          return {
            title: col.label,
            dataIndex: 'averageWaitingTime',
            key: 'averageWaitingTime',
            align: 'center' as const,
            render: (value: string) => <Text>{value || '0 sec'}</Text>,
          };
          
        case 'avgHandlingTime':
          return {
            title: col.label,
            dataIndex: 'avgHandlingTime',
            key: 'avgHandlingTime',
            align: 'center' as const,
            render: (value: string) => <Text>{value || '0min 0sec'}</Text>,
          };
          
        case 'openCases':
          return {
            title: col.label,
            dataIndex: 'openCases',
            key: 'openCases',
            align: 'center' as const,
            render: (value: number) => <StatusBadge title={value?.toString() || '0'} color="warn" size="xs" />,
          };
          
        case 'group':
          return {
            title: col.label,
            dataIndex: 'agentGroup',
            key: 'group',
            align: 'center' as const,
            render: (value: string[]) => <Text>{value?.join(', ') || 'N/A'}</Text>,
          };
          
        default:
          return {
            title: col.label,
            dataIndex: columnKey,
            key: columnKey,
            align: 'center' as const,
            render: (text: any) => <StatusBadge title={text?.toString() || 'N/A'} color="basic" size="xs" />,
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
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                label="Total Agents"
                value={totalAgents.toString()}
                icon={<IconUsers />}
                color="#3b82f6"
                gradientColors={["#3b82f6", "#2563eb"] as [string, string]}
                isLoading={isLoading}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                label="Avg Kindness"
                value={`${avgKindness.toFixed(1)}%`}
                icon={<IconUser />}
                color="#10b981"
                gradientColors={["#10b981", "#059669"] as [string, string]}
                isLoading={isLoading}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                label="Avg FCR Rate"
                value={`${avgFCR}%`}
                icon={<IconTarget />}
                color="#f59e0b"
                gradientColors={["#f59e0b", "#d97706"] as [string, string]}
                isLoading={isLoading}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                label="Avg Empathy"
                value={`${avgEmpathy.toFixed(1)}%`}
                icon={<IconStar />}
                color="#8b5cf6"
                gradientColors={["#8b5cf6", "#7c3aed"] as [string, string]}
                isLoading={isLoading}
              />
            </Col>
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
                className="rounded-xl border-slate-200 mb-4"
                styles={{ body: { padding: 16 } }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <IconTrophy className="text-emerald-500 text-lg" />
                  <Text strong>Best Performing Agents</Text>
                </div>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 2 }} />
                ) : (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                    <Text className="text-[13px]">
                      {summaryData?.top_performing_agents 
                        ? summaryData.top_performing_agents.replace(/[\[\]]/g, '') 
                        : 'No data available'}
                    </Text>
                  </div>
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
                className="rounded-xl border-slate-200 mb-4"
                styles={{ body: { padding: 16 } }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <IconTrendingDown className="text-amber-500 text-lg" />
                  <Text strong>Agents Requiring Attention</Text>
                </div>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 2 }} />
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                    <Text className="text-[13px]">
                      {summaryData?.attention_need_agents 
                        ? summaryData.attention_need_agents.replace(/[\[\]]/g, '') 
                        : 'No data available'}
                    </Text>
                  </div>
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
                <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <IconUsers className="text-white text-xl" />
                </div>
                <div>
                  <Title level={5} className="!m-0 !font-semibold">Agent Performance Summary</Title>
                  <Text type="secondary" className="text-[13px]">
                    Monitor and evaluate agent performance metrics
                  </Text>
                </div>
              </div>
            }
            extra={
              <Space>
                <Button icon={<IconDownload />} onClick={exportToCSV}>Export CSV</Button>
                <Badge count={activeFiltersCount} size="small" offset={[-5, 5]}>
                  <Button 
                    type={filtersVisible ? "primary" : "default"}
                    icon={<IconFilter />}
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
                          <Text type="secondary" className="text-xs font-medium">
                            Search Agent
                          </Text>
                          <Input
                            placeholder="Name or ID..."
                            prefix={<IconSearch className="text-slate-400" />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            allowClear
                            className="bg-white"
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">
                            Agent Group
                          </Text>
                          <Select
                            placeholder="Select Group"
                            value={selectedGroup || undefined}
                            onChange={(val) => setSelectedGroup(val || "")}
                            allowClear
                            className="w-full"
                            options={groupOptions.map(g => ({ label: g, value: g }))}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">
                            Date Range
                          </Text>
                          <RangePicker 
                            className="w-full" 
                            value={dateRange}
                            onChange={(dates) => setDateRange(dates as [any, any])}
                          />
                        </div>
                      </Col>
                      <Col xs={24} lg={18} className="flex items-end justify-end">
                        <Space>
                          <Button 
                            icon={<IconClearAll />} 
                            onClick={clearAllFilters}
                          >
                            Clear All
                          </Button>
                          <Button type="primary" onClick={applyFilters}>Apply Filters</Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Data Table */}
            {exceptionType || isLoading ? (
              <ExceptionHandleView
                type={exceptionType || 'loading'}
                content={searchQuery}
                onTryAgain={() => fetchAgentPerformance(1, pagination.pageSize, buildApiFilters())}
              />
            ) : (
              <Table
                columns={columns}
                dataSource={Array.isArray(agentData) ? agentData : []}
                rowKey={(record) => record.agentID?.toString() || Math.random().toString()}
                scroll={{ x: 'max-content' }}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showTotal: (total, range) => (
                    <Text type="secondary">
                      Showing <Text strong>{range[0]}-{range[1]}</Text> of <Text strong>{total}</Text> agents
                    </Text>
                  ),
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                }}
                className="rounded-xl overflow-hidden"
                rowClassName={() => 
                  'transition-all duration-200 hover:shadow-[inset_3px_0_0_0_#6366f1]'
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
