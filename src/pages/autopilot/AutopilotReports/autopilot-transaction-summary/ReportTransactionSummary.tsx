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
  DatePicker
} from "antd";
import { 
  ArrowLeftOutlined, 
  SearchOutlined, 
  CloseOutlined, 
  FileTextOutlined, 
  LoadingOutlined, 
  FilterOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface DateRangeValue {
  startDate: string | null;
  endDate: string | null;
}

interface TransactionData {
  id: string;
  date: string;
  time: string;
  customerId: string;
  customerName: string;
  transactionType: string;
  status: string;
  amount: string;
}

// Mock data
const mockTransactions: TransactionData[] = [
  { id: "1", date: "2024-01-15", time: "09:32:15", customerId: "CUST001", customerName: "John Smith", transactionType: "Balance Inquiry", status: "Completed", amount: "$0.00" },
  { id: "2", date: "2024-01-15", time: "10:15:42", customerId: "CUST002", customerName: "Jane Doe", transactionType: "Fund Transfer", status: "Completed", amount: "$500.00" },
  { id: "3", date: "2024-01-15", time: "11:05:33", customerId: "CUST003", customerName: "Robert Johnson", transactionType: "Bill Payment", status: "Pending", amount: "$125.50" },
  { id: "4", date: "2024-01-15", time: "12:22:18", customerId: "CUST004", customerName: "Emily Brown", transactionType: "Account Statement", status: "Completed", amount: "$0.00" },
  { id: "5", date: "2024-01-15", time: "14:45:55", customerId: "CUST005", customerName: "Michael Wilson", transactionType: "Fund Transfer", status: "Failed", amount: "$1,000.00" },
  { id: "6", date: "2024-01-16", time: "08:12:30", customerId: "CUST006", customerName: "Sarah Davis", transactionType: "Balance Inquiry", status: "Completed", amount: "$0.00" },
  { id: "7", date: "2024-01-16", time: "09:55:22", customerId: "CUST007", customerName: "David Martinez", transactionType: "Card Activation", status: "Completed", amount: "$0.00" },
  { id: "8", date: "2024-01-16", time: "11:30:45", customerId: "CUST008", customerName: "Lisa Anderson", transactionType: "Bill Payment", status: "Completed", amount: "$89.99" },
];

interface ReportTransactionSummaryProps {
  onBack: () => void;
}

export default function ReportTransactionSummary({ onBack }: ReportTransactionSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    // Update filter count
    const filterCount = (dateRange ? 1 : 0) + (searchKeyword ? 1 : 0);
    setNumberOfFilters(filterCount);
  }, [dateRange, searchKeyword]);

  const [filteredData, setFilteredData] = useState<TransactionData[]>(mockTransactions);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = mockTransactions.filter(
        (item) =>
          item.customerId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.customerName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.transactionType.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredData(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setSearchKeyword("");
    setFilteredData(mockTransactions);
  };

  const totalTransactions = filteredData.length;

  // Table columns definition
  const columns: ColumnsType<TransactionData> = [
    {
      title: 'Date & Time',
      key: 'dateTime',
      render: (_, record) => (
        <div>
          <Text style={{ display: 'block' }}>{record.date}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.time}</Text>
        </div>
      ),
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      render: (text: string) => (
        <Text style={{ fontFamily: 'Geist, sans-serif', color: 'black' }}>{text}</Text>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Transaction Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'Completed':
              return { color: '#22c55e', backgroundColor: '#dcfce7', borderColor: '#22c55e' };
            case 'Pending':
              return { color: '#f59e0b', backgroundColor: '#fef3c7', borderColor: '#f59e0b' };
            case 'Failed':
              return { color: '#ef4444', backgroundColor: '#fee2e2', borderColor: '#ef4444' };
            default:
              return { color: '#6b7280', backgroundColor: '#f3f4f6', borderColor: '#d1d5db' };
          }
        };
        
        const statusConfig = getStatusColor(status);
        
        return (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 500,
              color: statusConfig.color,
              backgroundColor: statusConfig.backgroundColor,
              border: `1px solid ${statusConfig.borderColor}`,
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: string) => (
        <Text strong>{text}</Text>
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
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
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
                    icon={<ArrowLeftOutlined />}
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
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <FileTextOutlined style={{ color: 'white', fontSize: 20 }} />
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Transaction Summary Report</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      View detailed transaction summaries and patterns across autopilot interactions
                    </Text>
                  </div>
                </div>
                <Badge count={numberOfFilters} size="small" offset={[-5, 5]}>
                  <Button 
                    type={filtersOpen ? "primary" : "default"}
                    icon={<FilterOutlined />}
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
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                          allowClear
                          style={{ width: 200 }}
                        />
                        <Button onClick={handleSearch} icon={<SearchOutlined />}>
                          Search
                        </Button>
                        {searchKeyword && (
                          <Button 
                            onClick={handleClear} 
                            icon={<CloseOutlined />}
                          >
                            Clear
                          </Button>
                        )}
                      </Space>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Total Count */}
              <div>
                <Text type="secondary">
                  Total Transactions: <Text strong>{totalTransactions}</Text>
                </Text>
              </div>

              {/* Table */}
              {isLoading ? (
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton.Input key={i} active block style={{ height: 48 }} />
                  ))}
                </Space>
              ) : filteredData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <FileTextOutlined style={{ fontSize: 48, color: '#94a3b8', marginBottom: 16 }} />
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
                    'transition-all duration-200 hover:shadow-[inset_3px_0_0_0_#8b5cf6]'
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
