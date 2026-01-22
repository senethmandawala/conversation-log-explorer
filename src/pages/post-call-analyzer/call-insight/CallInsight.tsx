import { useEffect, useState, useMemo, useCallback } from "react";
import { 
  Card, 
  Table, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  Row, 
  Col, 
  Typography, 
  Badge,
  Tooltip,
  ConfigProvider
} from "antd";
import { 
  IconFilter, 
  IconDownload,
  IconEye,
  IconPhone,
  IconClock,
  IconMinus,
  IconTrendingDown,
  IconTrendingUp
} from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { StatusBadge } from "@/components/ui/status-badge";
import "@/components/ui/status-badge.css";
import { motion, AnimatePresence } from "framer-motion";
import { AIHelper } from "@/components/post-call/AIHelper";
import { CallLogDetails } from "./CallLogDetails";
import { useColumnConfig } from "@/hooks/useColumnConfig";
import { ColumnToggle } from "@/components/ui/column-toggle";
import { ExceptionHandleView } from "@/components/ui/ExceptionHandleView";
import { callRoutingApiService, type Filters } from "@/services/callRoutingApiService";
import { useProjectSelection } from "@/services/projectSelectionService";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface CallRecord {
  id?: string;
  msisdn?: string;
  agentName?: string;
  category?: string;
  subCategory?: string;
  sentiment?: "positive" | "negative" | "neutral";
  duration?: string;
  date?: string;
  time?: string;
  status?: "completed" | "pending" | "failed";
  callDisposition?: string;
  userSentiment?: string;
  agentSentiment?: string;
  summary?: string;
  transcription?: Array<{
    speaker: string;
    text: string;
    timestamp: string;
  }>;
  [key: string]: any; // Allow for dynamic custom fields
}

interface CustomField {
  fieldName: string;
  fieldType: string;
  displayName: string;
  isVisible: boolean;
  isFilterable: boolean;
  isSortable: boolean;
}

interface DynamicFilter {
  category?: string[];
  subCategory?: string[];
  agent?: string[];
  sentiment?: string[];
  status?: string[];
  [key: string]: any[]; // Allow for dynamic filter options
}

export default function CallInsight() {
  const { columns: columnConfig, visibleColumns, toggleColumnVisibility, resetToDefault } = useColumnConfig('callInsight');
  const { selectedProject } = useProjectSelection();
  const [isLoading, setIsLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Filter states matching Angular version
  const [msisdn, setMsisdn] = useState("");
  const [agentName, setAgentName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[][]>([[], [], [], [], []]); // Multi-level categories
  const [selectedCaseStatus, setSelectedCaseStatus] = useState<string>("");
  const [selectedUserSentiments, setSelectedUserSentiments] = useState<string[]>([]);
  const [selectedAgentSentiments, setSelectedAgentSentiments] = useState<string[]>([]);
  const [selectedCallType, setSelectedCallType] = useState<string>("");
  const [selectedDroppedCall, setSelectedDroppedCall] = useState<string>("");
  const [selectedRepeatCall, setSelectedRepeatCall] = useState<string>("");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [callData, setCallData] = useState<CallRecord[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter>({});
  const [categorySubCategoryLevels, setCategorySubCategoryLevels] = useState<Record<string, any>>({}); // Nested category structure from API
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [exceptionType, setExceptionType] = useState<'loading' | '200' | '204' | '500' | '503' | 'no-records' | ''>('loading');

  // Static filter options
  const caseStatusOptions = [
    { label: 'Open', value: '0' },
    { label: 'Resolved', value: '1' },
    { label: 'Pending', value: '2' },
  ];
  
  const sentimentOptions = [
    { label: 'Positive', value: '2' },
    { label: 'Neutral', value: '1' },
    { label: 'Negative', value: '0' },
  ];
  
  const callTypeOptions = [
    { label: 'Inbound', value: 'inbound' },
    { label: 'Outbound', value: 'outbound' },
  ];
  
  const yesNoOptions = [
    { label: 'Yes', value: '1' },
    { label: 'No', value: '0' },
  ];

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

  // Fetch custom fields configuration
  const fetchCustomFields = useCallback(async () => {
    const projectFilters = getProjectFilters();
    if (!selectedProject) return;
    
    try {
      const response = await callRoutingApiService.CallInsightCustomFields(projectFilters);
      if (response.status === 'success') {
        setCustomFields(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch custom fields:', err);
    }
  }, [getProjectFilters, selectedProject]);

  // Fetch dynamic filter options
  const fetchDynamicFilters = useCallback(async () => {
    const projectFilters = getProjectFilters();
    if (!selectedProject) return;
    
    try {
      const response = await callRoutingApiService.CallInsightDynamicLevelsFilter(projectFilters);
      if (response.status === 'SUCCESS' || response.status === 'success') {
        const data = response.data || {};
        setCategorySubCategoryLevels(data.categorySubCategoryLevels || {});
      }
    } catch (err) {
      console.error('Failed to fetch dynamic filters:', err);
    }
  }, [getProjectFilters, selectedProject]);

  // Get category options from the nested structure
  const categoryOptions = useMemo(() => {
    return Object.keys(categorySubCategoryLevels).map(cat => ({ label: cat, value: cat }));
  }, [categorySubCategoryLevels]);

  // Get sub-category level 1 options based on selected category
  const subCategoryLevel1Options = useMemo(() => {
    if (selectedCategories[0].length === 0) return [];
    
    const options: { label: string; value: string }[] = [];
    selectedCategories[0].forEach(cat => {
      const subCats = categorySubCategoryLevels[cat];
      if (subCats) {
        Object.keys(subCats).forEach(subCat => {
          if (!options.find(o => o.value === subCat)) {
            options.push({ label: subCat, value: subCat });
          }
        });
      }
    });
    return options;
  }, [selectedCategories, categorySubCategoryLevels]);

  // Get sub-category level 2 options based on selected category and level 1
  const subCategoryLevel2Options = useMemo(() => {
    if (selectedCategories[0].length === 0 || selectedCategories[1].length === 0) return [];
    
    const options: { label: string; value: string }[] = [];
    selectedCategories[0].forEach(cat => {
      const level1 = categorySubCategoryLevels[cat];
      if (level1) {
        selectedCategories[1].forEach(subCat1 => {
          const level2 = level1[subCat1];
          if (level2) {
            Object.keys(level2).forEach(subCat2 => {
              if (!options.find(o => o.value === subCat2)) {
                options.push({ label: subCat2, value: subCat2 });
              }
            });
          }
        });
      }
    });
    return options;
  }, [selectedCategories, categorySubCategoryLevels]);

  // Fetch call logs data
  const fetchCallLogs = useCallback(async (page = 1, pageSize = 10, filters: Filters = {}) => {
    const projectFilters = getProjectFilters();
    if (!selectedProject) return;
    
    setIsLoading(true);
    setError(null);
    setExceptionType('loading');
    
    try {
      const response = await callRoutingApiService.CallInsight({
        page: page,
        size: pageSize,
        sort: 'call_at',
        sortOrder: 'asc',
        ...projectFilters,
        ...filters
      });

      if (response.status === 'SUCCESS' || response.status === 'success' || response.data) {
        const data = response.data;
        const content = Array.isArray(data?.content) ? data.content : [];
        const totalElements = data?.totalElements || 0;
        
        if (!content || content.length === 0) {
          if (Object.keys(filters).length > 0) {
            setExceptionType('200'); // No results for search/filters
          } else {
            setExceptionType('no-records'); // No records at all
          }
        } else {
          setExceptionType(''); // Success - no exception
        }
        
        setCallData(content);
        setPagination(prev => ({
          ...prev,
          total: totalElements,
          current: page,
          pageSize: pageSize
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch call logs');
      }
    } catch (err) {
      console.error('Failed to fetch call logs:', err);
      setError('Failed to load call logs. Please try again.');
      setExceptionType('500'); // Server error
      setCallData([]);
    } finally {
      setIsLoading(false);
    }
  }, [getProjectFilters, selectedProject]);

  // Initialize data on component mount and when project changes
  useEffect(() => {
    if (!selectedProject) return;
    
    const initializeData = async () => {
      await Promise.all([
        fetchCustomFields(),
        fetchDynamicFilters(),
        fetchCallLogs(1, pagination.pageSize, {})
      ]);
    };
    
    initializeData();
  }, [selectedProject]);

  // Build filters object for API calls
  const buildApiFilters = useCallback((): Filters => {
    const filters: Filters = {};
    
    if (msisdn) filters.msisdn = msisdn;
    if (agentName) filters.agentName = agentName;
    if (keyword) filters.keyword = keyword;
    if (selectedCaseStatus) filters.caseStatus = selectedCaseStatus;
    if (selectedUserSentiments.length > 0) filters.userSentiment = selectedUserSentiments.join(',');
    if (selectedAgentSentiments.length > 0) filters.agentSentiment = selectedAgentSentiments.join(',');
    if (selectedCallType) filters.callType = selectedCallType;
    if (selectedDroppedCall) filters.droppedCall = selectedDroppedCall;
    if (selectedRepeatCall) filters.repeatCall = selectedRepeatCall;
    
    // Add category levels
    selectedCategories.forEach((cats, index) => {
      if (cats.length > 0) {
        if (index === 0) filters.category = cats.join(',');
        else filters[`subCategoryLevel${index}`] = cats.join(',');
      }
    });
    
    // Add date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      filters.fromTime = dateRange[0].format('YYYY-MM-DD');
      filters.toTime = dateRange[1].format('YYYY-MM-DD');
    }
    
    // Add custom field values
    Object.entries(customFieldValues).forEach(([key, value]) => {
      if (value) filters[key] = value;
    });
    
    return filters;
  }, [msisdn, agentName, keyword, selectedCaseStatus, selectedUserSentiments, selectedAgentSentiments, selectedCallType, selectedDroppedCall, selectedRepeatCall, selectedCategories, dateRange, customFieldValues]);

  // Handle filter application
  const applyFilters = useCallback(() => {
    setExceptionType('loading');
    fetchCallLogs(1, pagination.pageSize, buildApiFilters());
  }, [fetchCallLogs, pagination.pageSize, buildApiFilters]);

  // Handle pagination change
  const handleTableChange = useCallback((paginationInfo: any) => {
    fetchCallLogs(paginationInfo.current, paginationInfo.pageSize, buildApiFilters());
  }, [fetchCallLogs, buildApiFilters]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (msisdn) count++;
    if (agentName) count++;
    if (keyword) count++;
    if (selectedCaseStatus) count++;
    if (selectedUserSentiments.length > 0) count++;
    if (selectedAgentSentiments.length > 0) count++;
    if (selectedCallType) count++;
    if (selectedDroppedCall) count++;
    if (selectedRepeatCall) count++;
    if (dateRange) count++;
    selectedCategories.forEach(cats => { if (cats.length > 0) count++; });
    Object.values(customFieldValues).forEach(v => { if (v) count++; });
    return count;
  }, [msisdn, agentName, keyword, selectedCaseStatus, selectedUserSentiments, selectedAgentSentiments, selectedCallType, selectedDroppedCall, selectedRepeatCall, dateRange, selectedCategories, customFieldValues]);

  const clearAllFilters = () => {
    setMsisdn("");
    setAgentName("");
    setKeyword("");
    setSelectedCategories([[], [], [], [], []]);
    setSelectedCaseStatus("");
    setSelectedUserSentiments([]);
    setSelectedAgentSentiments([]);
    setSelectedCallType("");
    setSelectedDroppedCall("");
    setSelectedRepeatCall("");
    setDateRange(null);
    setCustomFieldValues({});
    setExceptionType('loading');
    fetchCallLogs(1, pagination.pageSize, {});
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
        
    try {
      const csvContent = await callRoutingApiService.getCallInsightsCSV(
        1, 
        pagination.pageSize, 
        'call_at', 
        'asc', 
        exportFilters
      );
      
      
      if (!csvContent) {
        console.error('No CSV content received from API');
        setError('Failed to export CSV. No data received.');
        return;
      }

      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
      
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = `call_insights_${new Date().toISOString().split('T')[0]}.csv`;
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('Error in CSV export:', error);
      setError('Failed to export CSV. Please try again.');
    }
  }, [getProjectFilters, buildApiFilters, pagination.pageSize]);

  // Helper functions
  const SentimentIcon = ({ sentiment }: { sentiment?: CallRecord["sentiment"] }) => {
    switch (sentiment) {
      case "positive":
        return <IconTrendingUp className="text-emerald-500 text-sm" />;
      case "negative":
        return <IconTrendingDown className="text-red-500 text-sm" />;
      default:
        return <IconMinus className="text-amber-500 text-sm" />;
    }
  };

  const getSentimentColor = (sentiment?: CallRecord["sentiment"]) => {
    switch (sentiment) {
      case "positive": return { bg: '#10b98115', border: '#10b981', text: '#10b981' };
      case "negative": return { bg: '#ef444415', border: '#ef4444', text: '#ef4444' };
      default: return { bg: '#f59e0b15', border: '#f59e0b', text: '#f59e0b' };
    }
  };

  const getStatusConfig = (status?: CallRecord["status"]) => {
    switch (status) {
      case "completed": return { color: 'success' as const, text: 'Completed' };
      case "pending": return { color: 'processing' as const, text: 'Pending' };
      case "failed": return { color: 'error' as const, text: 'Failed' };
      default: return { color: 'basic' as const, text: status || 'Unknown' };
    }
  };

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
      
      // Map env column definitions to actual table columns using API field names
      switch (columnKey) {
        case 'msisdn':
          return {
            title: col.label,
            dataIndex: 'mobile_no',
            key: 'msisdn',
            align: 'center' as const,
            render: (text: string) => (
              <StatusBadge title={text || 'N/A'} color="primary" size="xs" />
            ),
          };
          
        case 'agent':
          return {
            title: col.label,
            dataIndex: 'agent_name',
            key: 'agent',
            align: 'center' as const,
            render: (text: string) => (
              <Text strong className="font-sans">{text || 'N/A'}</Text>
            ),
          };
          
        case 'catSubCat':
          return {
            title: col.label,
            key: 'catSubCat',
            align: 'center' as const,
            render: (_: any, record: any) => (
              <div className="flex flex-col gap-1">
                <StatusBadge title={record.category || 'N/A'} color="basic" size="xs" />
                {record.subcategory && (
                  <Text type="secondary" className="text-xs">{record.subcategory}</Text>
                )}
              </div>
            ),
          };
          
        case 'userSentiment':
          return {
            title: col.label,
            dataIndex: 'user_sentiment',
            key: 'userSentiment',
            align: 'center' as const,
            render: (sentiment: number) => {
              // API returns 0, 1, 2 for sentiment (0=negative, 1=neutral, 2=positive)
              const getSentimentIcon = (val: number) => {
                switch (val) {
                  case 2:
                    return { icon: <TablerIcon name="mood-smile-beam" className="text-green-500" size={24} />, title: "Positive" };
                  case 0:
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
            dataIndex: 'call_duration',
            key: 'callDuration',
            align: 'center' as const,
            render: (seconds: number) => {
              // Convert seconds to mm:ss format
              const mins = Math.floor((seconds || 0) / 60);
              const secs = (seconds || 0) % 60;
              const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;
              return (
                <Space size={4}>
                  <IconClock className="text-slate-400 text-xs" />
                  <Text type="secondary">{formatted}</Text>
                </Space>
              );
            },
          };
          
        case 'dateTime':
          return {
            title: col.label,
            dataIndex: 'call_at',
            key: 'dateTime',
            align: 'center' as const,
            render: (callAt: string) => {
              if (!callAt) return <Text type="secondary">N/A</Text>;
              const date = new Date(callAt);
              const dateStr = date.toLocaleDateString();
              const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div>
                  <Text className="block">{dateStr}</Text>
                  <Text type="secondary" className="text-xs">{timeStr}</Text>
                </div>
              );
            },
          };
          
        case 'caseStatus':
          return {
            title: col.label,
            dataIndex: 'case_status',
            key: 'caseStatus',
            align: 'center' as const,
            render: (status: number) => {
              // API returns 0, 1, 2 for case_status
              const getStatusColor = (val: number): "success" | "basic" | "warn" => {
                switch (val) {
                  case 1:
                    return 'success';
                  case 2:
                    return 'warn';
                  default:
                    return 'basic';
                }
              };
              
              const getStatusText = (val: number): string => {
                switch (val) {
                  case 1:
                    return 'Resolved';
                  case 2:
                    return 'Pending';
                  default:
                    return 'Open';
                }
              };
              
              return (
                <StatusBadge 
                  title={getStatusText(status)} 
                  color={getStatusColor(status)} 
                  size="xs" 
                />
              );
            },
          };
          
        case 'calldisposition':
          return {
            title: col.label,
            dataIndex: 'dropped_call',
            key: 'calldisposition',
            align: 'center' as const,
            render: (droppedCall: number) => {
              const isDropped = droppedCall === 1;
              return (
                <StatusBadge 
                  title={isDropped ? 'Dropped' : 'Completed'} 
                  color={isDropped ? 'warn' : 'success'} 
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
            render: (_: any, record: any) => (
              <Tooltip title="View Details">
                <Button 
                  type="text" 
                  icon={<IconEye />}
                  onClick={() => setSelectedCall(record)}
                  className="rounded-lg transition-all hover:bg-primary/10 hover:text-primary"
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
                <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <IconPhone className="text-white text-xl" />
                </div>
                <div>
                  <Title level={5} className="!m-0 !font-semibold">Call Insights</Title>
                  <Text type="secondary" className="text-[13px]">
                    Analyze and explore individual call recordings and transcripts
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
                    <Row gutter={[12, 12]}>
                      {/* MSISDN */}
                      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">MSISDN</Text>
                          <Input
                            placeholder="Enter MSISDN"
                            value={msisdn}
                            onChange={(e) => setMsisdn(e.target.value)}
                            allowClear
                            className="bg-white"
                          />
                        </div>
                      </Col>

                      {/* Agent Name */}
                      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Agent Name</Text>
                          <Input
                            placeholder="Enter Agent Name"
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            allowClear
                            className="bg-white"
                          />
                        </div>
                      </Col>

                      {/* Category */}
                      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Category</Text>
                          <Select
                            mode="multiple"
                            placeholder="Select Category"
                            value={selectedCategories[0]}
                            onChange={(val) => {
                              const newCats = [...selectedCategories];
                              newCats[0] = val;
                              // Clear sub-categories when parent changes
                              for (let i = 1; i < newCats.length; i++) newCats[i] = [];
                              setSelectedCategories(newCats);
                            }}
                            allowClear
                            className="w-full"
                            maxTagCount={1}
                            options={categoryOptions}
                          />
                        </div>
                      </Col>

                      {/* Sub Category Level 1 - Shows when Category is selected */}
                      {selectedCategories[0].length > 0 && subCategoryLevel1Options.length > 0 && (
                        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                          <div className="space-y-1.5">
                            <Text type="secondary" className="text-xs font-medium">Sub Category Level 1</Text>
                            <Select
                              mode="multiple"
                              placeholder="Select Sub Category"
                              value={selectedCategories[1]}
                              onChange={(val) => {
                                const newCats = [...selectedCategories];
                                newCats[1] = val;
                                // Clear level 2 when level 1 changes
                                newCats[2] = [];
                                setSelectedCategories(newCats);
                              }}
                              allowClear
                              className="w-full"
                              maxTagCount={1}
                              options={subCategoryLevel1Options}
                            />
                          </div>
                        </Col>
                      )}

                      {/* Sub Category Level 2 - Shows when Level 1 is selected */}
                      {selectedCategories[1].length > 0 && subCategoryLevel2Options.length > 0 && (
                        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                          <div className="space-y-1.5">
                            <Text type="secondary" className="text-xs font-medium">Sub Category Level 2</Text>
                            <Select
                              mode="multiple"
                              placeholder="Select Sub Category"
                              value={selectedCategories[2]}
                              onChange={(val) => {
                                const newCats = [...selectedCategories];
                                newCats[2] = val;
                                setSelectedCategories(newCats);
                              }}
                              allowClear
                              className="w-full"
                              maxTagCount={1}
                              options={subCategoryLevel2Options}
                            />
                          </div>
                        </Col>
                      )}

                      {/* Case Status */}
                      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Case Status</Text>
                          <Select
                            placeholder="Select Status"
                            value={selectedCaseStatus || undefined}
                            onChange={(val) => setSelectedCaseStatus(val || "")}
                            allowClear
                            className="w-full"
                            options={caseStatusOptions}
                          />
                        </div>
                      </Col>

                      {/* User Sentiment */}
                      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">User Sentiment</Text>
                          <Select
                            mode="multiple"
                            placeholder="Select Sentiment"
                            value={selectedUserSentiments}
                            onChange={setSelectedUserSentiments}
                            allowClear
                            className="w-full"
                            maxTagCount={1}
                            options={sentimentOptions}
                          />
                        </div>
                      </Col>

                      {/* Agent Sentiment */}
                      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Agent Sentiment</Text>
                          <Select
                            mode="multiple"
                            placeholder="Select Sentiment"
                            value={selectedAgentSentiments}
                            onChange={setSelectedAgentSentiments}
                            allowClear
                            className="w-full"
                            maxTagCount={1}
                            options={sentimentOptions}
                          />
                        </div>
                      </Col>

                      {/* Date Range */}
                      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Date Range</Text>
                          <RangePicker 
                            className="w-full" 
                            value={dateRange}
                            onChange={(dates) => setDateRange(dates as [any, any])}
                          />
                        </div>
                      </Col>

                      {/* Search Keyword */}
                      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Search Keyword</Text>
                          <Input
                            placeholder="Enter keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            allowClear
                            className="bg-white"
                          />
                        </div>
                      </Col>

                      {/* Call Type */}
                      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Call Type</Text>
                          <Select
                            placeholder="Select Type"
                            value={selectedCallType || undefined}
                            onChange={(val) => setSelectedCallType(val || "")}
                            allowClear
                            className="w-full"
                            options={callTypeOptions}
                          />
                        </div>
                      </Col>

                      {/* Dropped Call */}
                      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Dropped Call</Text>
                          <Select
                            placeholder="Select"
                            value={selectedDroppedCall || undefined}
                            onChange={(val) => setSelectedDroppedCall(val || "")}
                            allowClear
                            className="w-full"
                            options={yesNoOptions}
                          />
                        </div>
                      </Col>

                      {/* Repeat Call */}
                      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Repeat Call</Text>
                          <Select
                            placeholder="Select"
                            value={selectedRepeatCall || undefined}
                            onChange={(val) => setSelectedRepeatCall(val || "")}
                            allowClear
                            className="w-full"
                            options={yesNoOptions}
                          />
                        </div>
                      </Col>

                      {/* Custom Fields - Dynamic */}
                      {customFields.filter(f => f.isFilterable).map((field) => (
                        <Col key={field.fieldName} xs={24} sm={12} md={8} lg={6} xl={4}>
                          <div className="space-y-1.5">
                            <Text type="secondary" className="text-xs font-medium">{field.displayName}</Text>
                            <Input
                              placeholder={`Enter ${field.displayName}`}
                              value={customFieldValues[field.fieldName] || ""}
                              onChange={(e) => setCustomFieldValues(prev => ({
                                ...prev,
                                [field.fieldName]: e.target.value
                              }))}
                              allowClear
                            />
                          </div>
                        </Col>
                      ))}

                      {/* Action Buttons */}
                      <Col xs={24} className="flex items-end justify-end gap-2 mt-2">
                        <Button type="primary" onClick={applyFilters}>
                          Search
                        </Button>
                        {activeFiltersCount > 0 && (
                          <Button onClick={clearAllFilters}>
                            Clear
                          </Button>
                        )}
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
                content={keyword}
                onTryAgain={() => fetchCallLogs(1, pagination.pageSize, buildApiFilters())}
              />
            ) : (
              <Table
                columns={columns}
                dataSource={Array.isArray(callData) ? callData : []}
                rowKey={(record) => record.id || Math.random().toString()}
                scroll={{ x: 'max-content' }}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showTotal: (total, range) => (
                    <Text type="secondary">
                      Showing <Text strong>{range[0]}-{range[1]}</Text> of <Text strong>{total}</Text> results
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
