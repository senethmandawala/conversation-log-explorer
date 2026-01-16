import { useState, useEffect } from "react";
import { 
  Card, 
  Typography, 
  ConfigProvider,
  Button, 
  Input, 
  Table, 
  Badge,
  Space,
  Skeleton,
  DatePicker,
  Progress
} from "antd";
import { 
  IconArrowLeft, 
  IconChartBar, 
  IconSearch, 
  IconRefresh, 
  IconFilter
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface DateRangeValue {
  startDate: string | null;
  endDate: string | null;
}

interface DocumentAccessData {
  id: string;
  documentName: string;
  accessCount: number;
  lastAccessed: string;
  category: string;
}

// Mock data
const mockDocumentData: DocumentAccessData[] = [
  { id: "1", documentName: "Account Opening Procedures", accessCount: 1245, lastAccessed: "2024-01-15 14:32:00", category: "Accounts" },
  { id: "2", documentName: "Loan Application Guidelines", accessCount: 892, lastAccessed: "2024-01-15 13:45:00", category: "Loans" },
  { id: "3", documentName: "Credit Card FAQ", accessCount: 756, lastAccessed: "2024-01-15 12:22:00", category: "Cards" },
  { id: "4", documentName: "Mobile Banking Setup Guide", accessCount: 654, lastAccessed: "2024-01-15 11:15:00", category: "Digital Banking" },
  { id: "5", documentName: "Fund Transfer Limits", accessCount: 543, lastAccessed: "2024-01-15 10:45:00", category: "Transactions" },
  { id: "6", documentName: "Interest Rate Schedule", accessCount: 432, lastAccessed: "2024-01-14 16:30:00", category: "General" },
  { id: "7", documentName: "KYC Requirements", accessCount: 321, lastAccessed: "2024-01-14 15:20:00", category: "Compliance" },
  { id: "8", documentName: "Dispute Resolution Process", accessCount: 234, lastAccessed: "2024-01-14 14:10:00", category: "Support" },
];

interface ReportDocumentAccessFrequencyProps {
  onBack: () => void;
}

export default function ReportDocumentAccessFrequency({ onBack }: ReportDocumentAccessFrequencyProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    // Update filter count
    const filterCount = (dateRange ? 1 : 0) + (searchTerm ? 1 : 0);
    setNumberOfFilters(filterCount);
  }, [dateRange, searchTerm]);

  const [filteredData, setFilteredData] = useState<DocumentAccessData[]>(mockDocumentData);

  const maxAccessCount = Math.max(...mockDocumentData.map((d) => d.accessCount));

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = mockDocumentData.filter(
        (item) =>
          item.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredData(mockDocumentData);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { color: string; backgroundColor: string; borderColor: string }> = {
      "Accounts": { color: '#3b82f6', backgroundColor: '#dbeafe', borderColor: '#3b82f6' },
      "Loans": { color: '#22c55e', backgroundColor: '#dcfce7', borderColor: '#22c55e' },
      "Cards": { color: '#8b5cf6', backgroundColor: '#f3e8ff', borderColor: '#8b5cf6' },
      "Digital Banking": { color: '#06b6d4', backgroundColor: '#cffafe', borderColor: '#06b6d4' },
      "Transactions": { color: '#f59e0b', backgroundColor: '#fef3c7', borderColor: '#f59e0b' },
      "General": { color: '#6b7280', backgroundColor: '#f3f4f6', borderColor: '#6b7280' },
      "Compliance": { color: '#ef4444', backgroundColor: '#fee2e2', borderColor: '#ef4444' },
      "Support": { color: '#ec4899', backgroundColor: '#fce7f3', borderColor: '#ec4899' },
    };
    return colors[category] || { color: '#6b7280', backgroundColor: '#f3f4f6', borderColor: '#6b7280' };
  };

  // Table columns definition
  const columns: ColumnsType<DocumentAccessData> = [
    {
      title: 'Document Name',
      dataIndex: 'documentName',
      key: 'documentName',
      render: (text: string) => (
        <Text strong style={{ fontFamily: 'Geist, sans-serif' }}>{text}</Text>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const categoryConfig = getCategoryColor(category);
        return (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 500,
              color: categoryConfig.color,
              backgroundColor: categoryConfig.backgroundColor,
              border: `1px solid ${categoryConfig.borderColor}`,
            }}
          >
            {category}
          </span>
        );
      },
    },
    {
      title: 'Access Count',
      dataIndex: 'accessCount',
      key: 'accessCount',
      render: (count: number) => (
        <Text strong style={{ fontFamily: 'Geist, sans-serif' }}>
          {count.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Frequency',
      key: 'frequency',
      width: 200,
      render: (_, record) => (
        <Progress
          percent={(record.accessCount / maxAccessCount) * 100}
          showInfo={false}
          strokeColor={{
            '0%': '#22c55e',
            '100%': '#16a34a',
          }}
          style={{ margin: 0 }}
        />
      ),
    },
    {
      title: 'Last Accessed',
      dataIndex: 'lastAccessed',
      key: 'lastAccessed',
      render: (text: string) => (
        <Text type="secondary" style={{ fontSize: 12, fontFamily: 'Geist, sans-serif' }}>
          {text}
        </Text>
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
        },
      }}
    >
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            style={{ 
              borderRadius: 12, 
              border: '1px solid #e2e8f0',
            }}
            styles={{ 
              header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' },
              body: { padding: 24 }
            }}
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    type="text"
                    icon={<IconArrowLeft />}
                    onClick={onBack}
                    style={{ 
                      borderRadius: 8,
                      height: 40,
                      width: 40
                    }}
                  />
                  <div 
                    style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 8, 
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconChartBar style={{ color: 'white', fontSize: 20 }} />
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Document Access Frequency</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Track document access patterns and frequency in autopilot conversations
                    </Text>
                  </div>
                </div>
                <Badge count={numberOfFilters} size="small" offset={[-5, 5]}>
                  <Button 
                    type={filtersOpen ? "primary" : "default"}
                    icon={<IconFilter />}
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    style={{ borderRadius: 8 }}
                  />
                </Badge>
              </div>
            }
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Collapsible Filters */}
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
                        background: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: 12
                      }}
                      styles={{ body: { padding: 16 } }}
                    >
                      <Space wrap size="middle" style={{ width: '100%' }}>
                        <RangePicker 
                          style={{ minWidth: 200 }}
                          value={dateRange}
                          onChange={(dates) => setDateRange(dates)}
                        />
                        <Input
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          prefix={<IconSearch style={{ color: '#94a3b8' }} />}
                          allowClear
                          style={{ width: 200 }}
                        />
                        <Button onClick={handleSearch} icon={<IconSearch />}>
                          Search
                        </Button>
                        {searchTerm && (
                          <Button 
                            onClick={handleClear} 
                            icon={<IconRefresh />}
                          >
                            Clear
                          </Button>
                        )}
                      </Space>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Table */}
              {isLoading ? (
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton.Input key={i} active block style={{ height: 48 }} />
                  ))}
                </Space>
              ) : filteredData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <BarChartOutlined style={{ fontSize: 48, color: '#94a3b8', marginBottom: 16 }} />
                  <Text type="secondary">No matching data found</Text>
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  rowKey="id"
                  scroll={{ x: 'max-content' }}
                  pagination={{
                    total: filteredData.length,
                    pageSize: 10,
                    showTotal: (total, range) => (
                      <Text type="secondary">
                        Showing <Text strong>{range[0]}-{range[1]}</Text> of <Text strong>{total}</Text> results
                      </Text>
                    ),
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                  }}
                  style={{ borderRadius: 12, overflow: 'hidden' }}
                  rowClassName={() => 
                    'transition-all duration-200 hover:shadow-[inset_3px_0_0_0_#22c55e]'
                  }
                />
              )}
            </Space>
          </Card>
        </motion.div>
      </div>
    </ConfigProvider>
  );
}
