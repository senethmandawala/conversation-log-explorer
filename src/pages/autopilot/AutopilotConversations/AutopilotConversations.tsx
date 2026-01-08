import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  Input, 
  Select, 
  Button, 
  Badge, 
  Space, 
  Typography,
  ConfigProvider,
  Row,
  Col,
  Table,
  Tooltip,
  Tag,
  DatePicker
} from "antd";
import { 
  SearchOutlined, 
  DownloadOutlined, 
  FilterOutlined,
  CalendarOutlined,
  MessageOutlined,
  SettingOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined
} from "@ant-design/icons";
import { AutopilotSingleChatHistoryView } from "./autopilot-single-chat-history-view/AutopilotSingleChatHistoryView";
import { mockConversations, filterOptions } from "@/data/mockConversations";
import { ConversationRecord } from "@/types/conversation";
import { useColumnConfig } from "@/hooks/useColumnConfig";
import { ColumnToggle } from "@/components/ui/column-toggle";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function AutopilotConversations() {
  const { columns: columnConfig, visibleColumns, toggleColumnVisibility, resetToDefault } = useColumnConfig('autopilot');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<ConversationRecord | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedVdnSource, setSelectedVdnSource] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedResolution, setSelectedResolution] = useState<string>("");
  const [selectedVdn, setSelectedVdn] = useState<string>("");
  const [selectedMsisdn, setSelectedMsisdn] = useState<string>("");
  const [selectedUniqueId, setSelectedUniqueId] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  const filteredData = mockConversations.filter((record) => {
    const matchesSearch =
      searchQuery === "" ||
      record.msisdn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.uniqueID.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVdnSource = !selectedVdnSource || record.vdnSource === selectedVdnSource;
    const matchesCategory = !selectedCategory || record.category === selectedCategory;
    const matchesResolution = !selectedResolution || record.resolution === selectedResolution;
    const matchesVdn = !selectedVdn || record.vdn === selectedVdn;
    const matchesMsisdn = !selectedMsisdn || record.msisdn.includes(selectedMsisdn);
    const matchesUniqueId = !selectedUniqueId || record.uniqueID.includes(selectedUniqueId);
    const matchesSubCategory = !selectedSubCategory || record.subCategory === selectedSubCategory;

    return matchesSearch && matchesVdnSource && matchesCategory && matchesResolution && matchesVdn && matchesMsisdn && matchesUniqueId && matchesSubCategory;
  });

  // Check if a column should be visible based on env config
  const isColVisible = (key: string): boolean => {
    const col = visibleColumns.find(c => c.def === key);
    return col ? col.visible : true;
  };

  // Create columns based on env config
  const allColumns: ColumnsType<ConversationRecord> = useMemo(() => {
    const envColumns = visibleColumns;
    
    const baseColumns: ColumnsType<ConversationRecord> = envColumns.map(col => {
      const columnKey = col.def;
      
      // Map env column definitions to actual table columns
      switch (columnKey) {
        case 'date':
          return {
            title: col.label,
            key: 'date',
            align: 'center' as const,
            render: (_, record) => (
              <div>
                <Text style={{ display: 'block' }}>{record.date}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{record.time}</Text>
              </div>
            ),
          };
          
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
          
        case 'category':
          return {
            title: col.label,
            dataIndex: 'category',
            key: 'category',
            align: 'center' as const,
            render: (text: string) => (
              <Text style={{ fontFamily: 'Geist, sans-serif', color: 'black' }}>{text}</Text>
            ),
          };
          
        case 'subCategory':
          return {
            title: col.label,
            dataIndex: 'subCategory',
            key: 'subCategory',
            align: 'center' as const,
            render: (text: string) => (
              <Text style={{ fontFamily: 'Geist, sans-serif', color: 'black' }}>{text || 'N/A'}</Text>
            ),
          };
          
        case 'resolution':
          return {
            title: col.label,
            dataIndex: 'resolution',
            key: 'resolution',
            align: 'center' as const,
            render: (text: string) => (
              <StatusBadge 
                title={text}
                color={text === 'Resolved' ? 'success' : text === 'Pending' ? 'amber' : 'basic'}
                size="xs"
              />
            ),
          };
          
        case 'vdnSource':
          return {
            title: col.label,
            dataIndex: 'vdnSource',
            key: 'vdnSource',
            align: 'center' as const,
            render: (text: string) => (
              <StatusBadge 
                title={text || 'N/A'}
                color={text === 'IVR' ? 'primary' : 'basic'}
                size="xs"
              />
            ),
          };
          
        case 'duration':
          return {
            title: col.label,
            dataIndex: 'duration',
            key: 'duration',
            align: 'center' as const,
            render: (text: string) => (
              <Space size={4}>
                <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
                <Text type="secondary">{text}</Text>
              </Space>
            ),
          };
          
        case 'channel':
          return {
            title: col.label,
            dataIndex: 'channel',
            key: 'channel',
            align: 'center' as const,
            render: (text: string) => (
              <Tag color="purple">{text}</Tag>
            ),
          };
          
        case 'vdn':
          return {
            title: col.label,
            dataIndex: 'vdn',
            key: 'vdn',
            align: 'center' as const,
            render: (text: string) => (
              <Text style={{ fontFamily: 'Geist, sans-serif', color: 'black' }}>{text || 'N/A'}</Text>
            ),
          };
          
        case 'uniqueID':
          return {
            title: col.label,
            dataIndex: 'uniqueID',
            key: 'uniqueID',
            align: 'center' as const,
            render: (text: string) => (
              <Text style={{ fontFamily: 'Geist, sans-serif', color: 'black' }}>{text}</Text>
            ),
          };
          
        case 'summary':
          return {
            title: col.label,
            dataIndex: 'summary',
            key: 'summary',
            render: (text: string) => (
              <Tooltip title={text}>
                <Text 
                  ellipsis 
                  style={{ 
                    maxWidth: 200,
                    fontFamily: 'Geist, sans-serif', 
                    color: 'black' 
                  }}
                >
                  {text || 'N/A'}
                </Text>
              </Tooltip>
            ),
          };
          
        case 'sttDuration':
          return {
            title: col.label,
            dataIndex: 'sttDuration',
            key: 'sttDuration',
            align: 'center' as const,
            render: (text: string) => (
              <Text style={{ fontFamily: 'Geist, sans-serif', color: 'black' }}>{text || 'N/A'}</Text>
            ),
          };
          
        case 'ttsCharCount':
          return {
            title: col.label,
            dataIndex: 'ttsCharCount',
            key: 'ttsCharCount',
            align: 'center' as const,
            render: (text: string) => (
              <Text style={{ fontFamily: 'Geist, sans-serif', color: 'black' }}>{text || 'N/A'}</Text>
            ),
          };
          
        case 'department':
          return {
            title: col.label,
            dataIndex: 'department',
            key: 'department',
            align: 'center' as const,
            render: (text: string) => (
              <Text style={{ fontFamily: 'Geist, sans-serif', color: 'black' }}>{text || 'N/A'}</Text>
            ),
          };
          
        case 'city':
          return {
            title: col.label,
            dataIndex: 'city',
            key: 'city',
            align: 'center' as const,
            render: (text: string) => (
              <Text style={{ fontFamily: 'Geist, sans-serif', color: 'black' }}>{text || 'N/A'}</Text>
            ),
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
                  onClick={() => handleView(record)}
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

  const handleView = (record: ConversationRecord) => {
    setSelectedRecord(record);
    setSheetOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedVdnSource("");
    setSelectedCategory("");
    setSelectedResolution("");
    setSelectedVdn("");
    setSelectedMsisdn("");
    setSelectedUniqueId("");
    setSelectedSubCategory("");
    setDateRange(null);
  };

  const activeFiltersCount = [selectedVdnSource, selectedCategory, selectedResolution, selectedVdn, selectedMsisdn, selectedUniqueId, selectedSubCategory].filter(Boolean).length;

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
                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <MessageOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Conversation History</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    View and analyze all autopilot conversations
                  </Text>
                </div>
              </div>
            }
            extra={
              <Space>
                <Button icon={<DownloadOutlined />}>Export CSV</Button>
                <Badge count={activeFiltersCount} size="small" offset={[-5, 5]}>
                  <Button 
                    type={filtersOpen ? "primary" : "default"}
                    icon={<FilterOutlined />}
                    onClick={() => setFiltersOpen(!filtersOpen)}
                  >
                    Filters
                  </Button>
                </Badge>
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
                          Search MSISDN / ID
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
                          VDN Source
                        </Text>
                        <Select
                          placeholder="All Sources"
                          value={selectedVdnSource || undefined}
                          onChange={(value) => setSelectedVdnSource(value || "")}
                          allowClear
                          style={{ width: '100%' }}
                          options={filterOptions.vdnSources.map((source) => ({
                            label: source.label,
                            value: source.value
                          }))}
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
                          value={selectedCategory || undefined}
                          onChange={(value) => setSelectedCategory(value || "")}
                          allowClear
                          style={{ width: '100%' }}
                          options={filterOptions.categories.map((cat) => ({
                            label: cat.label,
                            value: cat.value
                          }))}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <div className="space-y-1.5">
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                          VDN
                        </Text>
                        <Input
                          placeholder="All VDNs"
                          value={selectedVdn}
                          onChange={(e) => setSelectedVdn(e.target.value)}
                          allowClear
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col xs={24} sm={12} lg={6}>
                      <div className="space-y-1">
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                          MSISDN
                        </Text>
                        <Input
                          placeholder="All MSISDNs"
                          value={selectedMsisdn}
                          onChange={(e) => setSelectedMsisdn(e.target.value)}
                          allowClear
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <div className="space-y-1">
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                          Unique ID
                        </Text>
                        <Input
                          placeholder="All Unique IDs"
                          value={selectedUniqueId}
                          onChange={(e) => setSelectedUniqueId(e.target.value)}
                          allowClear
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <div className="space-y-1">
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                          Sub Category
                        </Text>
                        <Input
                          placeholder="All Sub Categories"
                          value={selectedSubCategory}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          allowClear
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <div className="space-y-1">
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                          Resolution
                        </Text>
                        <Select
                          placeholder="All Resolutions"
                          value={selectedResolution || undefined}
                          onChange={(value) => setSelectedResolution(value || "")}
                          allowClear
                          style={{ width: '100%' }}
                          options={[
                            { label: 'Resolved', value: 'Resolved' },
                            { label: 'Pending', value: 'Pending' },
                            { label: 'Failed', value: 'Failed' },
                          ]}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <div className="space-y-">
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                          Date Range
                        </Text>
                        <Space size="small" style={{ width: '100%' }}>
                          <RangePicker 
                            style={{ flex: 1 }} 
                            value={dateRange}
                            onChange={(dates) => setDateRange(dates)}
                          />
                          <Button 
                            onClick={clearFilters}
                          >
                            Clear All
                          </Button>
                          <Button type="primary">Apply Filters</Button>
                        </Space>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginBottom: 16 }}
          >
            <Text type="secondary">
              Showing <Text strong>{filteredData.length}</Text> conversations
            </Text>
          </motion.div>

          {/* Data Table */}
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{
              total: filteredData.length,
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
              'transition-all duration-200 hover:shadow-[inset_3px_0_0_0_#3b82f6]'
            }
          />
          </Card>
        </motion.div>
      </div>

      {/* Detail Sheet */}
      <AutopilotSingleChatHistoryView
        record={selectedRecord}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </ConfigProvider>
  );
}
