import { useState, useEffect } from "react";
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Typography,
  Skeleton,
  Drawer,
  Pagination,
  ConfigProvider
} from "antd";
import { 
  ArrowLeftOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import type { ColumnsType } from "antd/es/table";
import CallDetails from "./CallDetails";

const { Title, Text } = Typography;

interface CallLog {
  callId: string;
  date: string;
  time: string;
  msisdn: string;
  service: string;
  violationType: string[];
}

interface AgentCallLogsProps {
  agentName: string;
  agentId: string;
  onBack: () => void;
}

// Mock data
const mockCallLogs: CallLog[] = [
  {
    callId: "1",
    date: "2024-01-15",
    time: "09:30 AM",
    msisdn: "+1234567890",
    service: "Technical Support",
    violationType: ["Interrupting Customer", "Not Following Script"],
  },
  {
    callId: "2",
    date: "2024-01-15",
    time: "10:45 AM",
    msisdn: "+1234567891",
    service: "Billing",
    violationType: ["Rude Behavior", "Incomplete Information"],
  },
  {
    callId: "3",
    date: "2024-01-15",
    time: "11:20 AM",
    msisdn: "+1234567892",
    service: "Sales",
    violationType: ["Not Following Script"],
  },
  {
    callId: "4",
    date: "2024-01-15",
    time: "02:15 PM",
    msisdn: "+1234567893",
    service: "Customer Service",
    violationType: ["Interrupting Customer", "Incomplete Information", "Rude Behavior"],
  },
  {
    callId: "5",
    date: "2024-01-15",
    time: "03:30 PM",
    msisdn: "+1234567894",
    service: "Technical Support",
    violationType: ["Not Following Script", "Incomplete Information"],
  },
  {
    callId: "6",
    date: "2024-01-16",
    time: "09:00 AM",
    msisdn: "+1234567895",
    service: "Billing",
    violationType: ["Rude Behavior"],
  },
  {
    callId: "7",
    date: "2024-01-16",
    time: "10:30 AM",
    msisdn: "+1234567896",
    service: "Sales",
    violationType: ["Interrupting Customer", "Not Following Script"],
  },
  {
    callId: "8",
    date: "2024-01-16",
    time: "11:45 AM",
    msisdn: "+1234567897",
    service: "Customer Service",
    violationType: ["Incomplete Information"],
  },
];

export default function AgentCallLogs({ agentName, agentId, onBack }: AgentCallLogsProps) {
  const [loading, setLoading] = useState(true);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setCallLogs(mockCallLogs);
      setLoading(false);
    }, 500);
  }, [agentId]);

  // Table columns definition
  const columns: ColumnsType<CallLog> = [
    {
      title: 'Date/Time',
      dataIndex: 'date',
      key: 'datetime',
      width: 150,
      render: (date: string, record: CallLog) => (
        <div>
          <div style={{ fontWeight: 500 }}>{date}</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>{record.time}</div>
        </div>
      ),
    },
    {
      title: 'MSISDN',
      dataIndex: 'msisdn',
      key: 'msisdn',
      width: 150,
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      width: 100,
    },
    {
      title: 'Violation Types',
      dataIndex: 'violationType',
      key: 'violationType',
      render: (violations: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {violations.map((violation, idx) => (
            <Tag key={idx} color="purple" style={{ borderRadius: 6 }}>
              {violation}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_, record: CallLog) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        />
      ),
    },
  ];

  const handleViewDetails = (log: CallLog) => {
    setSelectedCallId(log.callId);
  };

  const handleCloseDetails = () => {
    setSelectedCallId(null);
  };

  const totalPages = Math.ceil(callLogs.length / pageSize);
  const paginatedLogs = callLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
      <>
        {/* Call Details Drawer */}
        <Drawer
          title="Call Details"
          placement="right"
          size="large"
          open={!!selectedCallId}
          closable={false}
          extra={
            <Button
              type="text"
              onClick={handleCloseDetails}
              style={{ 
                border: 'none', 
                background: 'none', 
                fontSize: '20px',
                fontWeight: 'bold',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </Button>
          }
        >
          {selectedCallId && <CallDetails callId={selectedCallId} />}
        </Drawer>

        <div style={{ padding: '0 24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              style={{ borderRadius: 8 }}
            />
            <div>
              <Title level={5} style={{ margin: 0 }}>{agentName} - Call Logs</Title>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <Skeleton.Input active style={{ width: 200 }} />
            </div>
          ) : callLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Text type="secondary">No call logs available</Text>
            </div>
          ) : (
            <>
              {/* Table */}
              <Card
                style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                styles={{ body: { padding: 0 } }}
              >
                <Table
                  columns={columns}
                  dataSource={paginatedLogs}
                  pagination={false}
                  rowKey="callId"
                  style={{ borderRadius: 12 }}
                />
              </Card>

              {/* Pagination - Right aligned */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: '1px solid #e2e8f0'
                  }}
                >
                  <Pagination
                    total={callLogs.length}
                    pageSize={pageSize}
                    current={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                    showTotal={(total, range) => (
                      <Text type="secondary">
                        Showing <Text strong>{range[0]}-{range[1]}</Text> of <Text strong>{total}</Text> results
                      </Text>
                    )}
                    showSizeChanger={true}
                    pageSizeOptions={['5', '8', '10', '20']}
                  />
                </motion.div>
              )}
            </>
          )}
        </div>
      </>
    </ConfigProvider>
  );
}
