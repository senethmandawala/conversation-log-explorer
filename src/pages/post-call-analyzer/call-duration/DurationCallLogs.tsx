import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Typography, Table as AntTable, Badge as AntBadge, Space, Tooltip as AntTooltip } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { StatusBadge } from "@/components/ui/status-badge";
import "@/components/ui/status-badge.css";

const { Title, Text } = Typography;

const mockCallLogs = [
  { id: 1, date: "2024-01-15", time: "10:30 AM", msisdn: "+94771234567", duration: "25:30", category: "Technical Issues", agent: "John Smith", sentiment: "Negative", status: "Resolved" },
  { id: 2, date: "2024-01-15", time: "11:45 AM", msisdn: "+94772345678", duration: "22:15", category: "Account Closure", agent: "Jane Doe", sentiment: "Neutral", status: "Pending" },
  { id: 3, date: "2024-01-14", time: "02:15 PM", msisdn: "+94773456789", duration: "19:45", category: "Billing Issues", agent: "Mike Johnson", sentiment: "Positive", status: "Resolved" },
  { id: 4, date: "2024-01-14", time: "03:30 PM", msisdn: "+94774567890", duration: "18:20", category: "Refund Requests", agent: "Sarah Wilson", sentiment: "Negative", status: "Escalated" },
  { id: 5, date: "2024-01-13", time: "09:20 AM", msisdn: "+94775678901", duration: "17:50", category: "Technical Issues", agent: "Chris Brown", sentiment: "Neutral", status: "Resolved" },
  { id: 6, date: "2024-01-13", time: "01:10 PM", msisdn: "+94776789012", duration: "16:40", category: "Service Request", agent: "Emily Davis", sentiment: "Positive", status: "Resolved" },
  { id: 7, date: "2024-01-12", time: "04:25 PM", msisdn: "+94777890123", duration: "15:55", category: "Product Inquiry", agent: "David Lee", sentiment: "Neutral", status: "Resolved" },
  { id: 8, date: "2024-01-12", time: "11:00 AM", msisdn: "+94778901234", duration: "15:30", category: "Billing Issues", agent: "Lisa Wang", sentiment: "Negative", status: "Pending" },
];

export function DurationCallLogs() {
  const [loading, setLoading] = useState(false);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleCallClick = (call: typeof mockCallLogs[0]) => {
    console.log("Call clicked:", call);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return { icon: <TablerIcon name="mood-smile-beam" className="text-green-500" size={24} />, title: "Positive" };
      case "negative":
        return { icon: <TablerIcon name="mood-sad" className="text-red-500" size={24} />, title: "Negative" };
      default:
        return { icon: <TablerIcon name="mood-empty" className="text-yellow-500" size={24} />, title: "Neutral" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'success';
      case 'pending':
        return 'amber';
      case 'escalated':
        return 'warn';
      default:
        return 'basic';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Text type="secondary">Showing {mockCallLogs.length} calls</Text>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          onClick={handleReload}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AntTable
          dataSource={mockCallLogs}
          rowKey="id"
          pagination={{
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
          columns={[
            {
              title: 'Date & Time',
              key: 'dateTime',
              align: 'center',
              render: (_, record) => (
                <div>
                  <Text style={{ display: 'block' }}>{record.date}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{record.time}</Text>
                </div>
              ),
            },
            {
              title: 'MSISDN',
              dataIndex: 'msisdn',
              key: 'msisdn',
              align: 'center',
              render: (text: string) => (
                <StatusBadge title={text} color="primary" size="xs" />
              ),
            },
            {
              title: 'Category',
              dataIndex: 'category',
              key: 'category',
              align: 'center',
              render: (text: string) => (
                <StatusBadge title={text} color="basic" size="xs" />
              ),
            },
            {
              title: 'Agent',
              dataIndex: 'agent',
              key: 'agent',
              render: (text: string) => (
                <Space>
                  <div 
                    style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <UserOutlined style={{ color: 'white', fontSize: 14 }} />
                  </div>
                  <Text strong>{text}</Text>
                </Space>
              ),
            },
            {
              title: 'Sentiment',
              dataIndex: 'sentiment',
              key: 'sentiment',
              align: 'center',
              render: (sentiment: string) => {
                const sentimentConfig = getSentimentIcon(sentiment);
                return (
                  <AntTooltip title={sentimentConfig.title}>
                    {sentimentConfig.icon}
                  </AntTooltip>
                );
              },
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              align: 'center',
              render: (status: string) => (
                <StatusBadge 
                  title={status} 
                  color={getStatusColor(status)} 
                  size="xs" 
                />
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
