import { useEffect, useState } from "react";
import { 
  Card, 
  Button, 
  Badge, 
  Table, 
  Space, 
  Typography, 
  Skeleton,
  Tooltip,
  ConfigProvider
} from "antd";
import { 
  IconArrowLeft,
  IconPhone,
  IconClock,
  IconTarget,
  IconStar,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconPlayerPlay,
  IconPlayerPause,
  IconEye,
  IconHeart,
  IconUsers,
  IconPhoneOff
} from "@tabler/icons-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion } from "framer-motion";
import SingleCallView from "./SingleCallView";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";

const { Title, Text } = Typography;

interface CallLog {
  id: string;
  date: string;
  time: string;
  msisdn: string;
  category: string;
  subCategory: string;
  callerSentiment: "positive" | "negative" | "neutral";
  score: number;
  status: string;
  statusColor: string;
  isPlaying?: boolean;
}

interface StatCardData {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  gradientColors: [string, string];
}

const mockStats: StatCardData[] = [
  { label: "Total Calls", value: "245", icon: <IconPhone />, color: "#3b82f6", gradientColors: ["#3b82f6", "#2563eb"] },
  { label: "Avg Handle Time", value: "4:32", icon: <IconClock />, color: "#8b5cf6", gradientColors: ["#8b5cf6", "#7c3aed"] },
  { label: "FCR Rate", value: "92%", icon: <IconTarget />, color: "#10b981", gradientColors: ["#10b981", "#059669"] },
  { label: "CSAT Score", value: "4.8", icon: <IconStar />, color: "#f59e0b", gradientColors: ["#f59e0b", "#d97706"] },
  { label: "Kindness Score", value: "85%", icon: <IconHeart />, color: "#ec4899", gradientColors: ["#ec4899", "#db2777"] },
  { label: "Dropped Calls", value: "3%", icon: <IconPhoneOff />, color: "#ef4444", gradientColors: ["#ef4444", "#dc2626"] },
];

const mockCallLogs: CallLog[] = [
  { id: "1", date: "2024-01-15", time: "09:30", msisdn: "+1234567890", category: "Billing", subCategory: "Payment Issues", callerSentiment: "positive", score: 9.2, status: "Resolved", statusColor: "green" },
  { id: "2", date: "2024-01-15", time: "10:15", msisdn: "+1234567891", category: "Technical", subCategory: "Network Issues", callerSentiment: "negative", score: 7.5, status: "Escalated", statusColor: "amber" },
  { id: "3", date: "2024-01-15", time: "11:00", msisdn: "+1234567892", category: "Sales", subCategory: "New Plans", callerSentiment: "neutral", score: 8.0, status: "Resolved", statusColor: "green" },
  { id: "4", date: "2024-01-15", time: "11:45", msisdn: "+1234567893", category: "Complaints", subCategory: "Service Quality", callerSentiment: "negative", score: 6.5, status: "Pending", statusColor: "blue" },
  { id: "5", date: "2024-01-15", time: "12:30", msisdn: "+1234567894", category: "General", subCategory: "Account Info", callerSentiment: "positive", score: 9.5, status: "Resolved", statusColor: "green" },
];

const categoryData = [
  { name: "Billing", value: 35, color: "#3b82f6" },
  { name: "Technical", value: 25, color: "#8b5cf6" },
  { name: "Sales", value: 20, color: "#10b981" },
  { name: "Complaints", value: 12, color: "#f59e0b" },
  { name: "General", value: 8, color: "#6b7280" },
];

// Custom legend with names only
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="d-flex flex-wrap justify-content-center gap-x-4 gap-y-2 mt-2">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="d-flex align-items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Custom label for pie chart
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
    >
      {value}
    </text>
  );
};

const SentimentIcon = ({ sentiment }: { sentiment: CallLog["callerSentiment"] }) => {
  switch (sentiment) {
    case "positive":
      return <IconTrendingUp className="text-emerald-500 text-base" />;
    case "negative":
      return <IconTrendingDown className="text-red-500 text-base" />;
    default:
      return <IconMinus className="text-amber-500 text-base" />;
  }
};

const getStatusBadgeColor = (color: string) => {
  switch (color) {
    case "green":
      return "success";
    case "amber":
      return "amber";
    case "blue":
      return "primary";
    case "red":
      return "warn";
    default:
      return "basic";
  }
};

export default function AgentInsights() {
  const { selectedAgentId, setSelectedTab } = usePostCall();
  const [isLoading, setIsLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);

  const agentName = "John Smith";
  const agentIdDisplay = selectedAgentId || "AGT-001";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayAudio = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg: 'transparent',
          },
          Button: {
            borderRadius: 8,
          },
        },
      }}
    >
      <div className="container-fluid p-6 space-y-6">
        <Card
          className="rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm"
          title={
            <div className="d-flex align-items-center gap-3">
              <Button
                type="default"
                icon={<IconArrowLeft />}
                onClick={() => setSelectedTab("agent-performance")}
                className="h-10 w-10 rounded-xl flex items-center justify-center"
              />
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-2">
                  <Title level={4} className="!m-0 !text-xl !font-semibold">
                    Agent Insights
                  </Title>
                  <span className="text-xl text-slate-400">-</span>
                  <Badge 
                    count={`${agentName} - ${agentIdDisplay}`}
                    className="bg-slate-100 text-slate-600 font-medium text-sm"
                  />
                </div>
              </div>
            </div>
          }
        >
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center gap-2">
                <Title level={4} className="!m-0 !text-base !font-medium">
                  Agent Insights
                </Title>
                <span className="text-base text-slate-400">-</span>
                <Badge 
                  count={`${agentName} - ${agentIdDisplay}`}
                  className="bg-slate-100 text-slate-600 font-medium text-sm"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="row g-3">
          <div className="col-12 col-xl-6">
            <div className="row g-3">
              {mockStats.map((stat, index) => (
                <div className="col-6" key={stat.label}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <StatCard
                      label={stat.label}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                      gradientColors={stat.gradientColors}
                      isLoading={isLoading}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <Card
              className="rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm"
              title={
                <div>
                  <Title level={5} className="!m-0 !text-lg !font-semibold !mb-0.5">
                    Case Category Report
                  </Title>
                  <Text type="secondary" className="text-[13px] font-medium mt-1 block">
                    Distribution of calls by category
                  </Text>
                </div>
              }
              styles={{
                body: { padding: '14px 24px' },
                header: { 
                  borderBottom: '1px solid #e2e8f0',
                  padding: '14px 24px'
                }
              }}
            >
              {isLoading ? (
                <Skeleton.Input active block className="h-[280px]" />
              ) : (
                <ResponsiveContainer width="100%" height={280} className="mt-3">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="40%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={renderCustomLabel}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value} calls`, 'Count']}
                    />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </div>

        <Card
          className="rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm"
          title={
            <Title level={5} className="!m-0 !text-base !font-medium">
              Call Logs
            </Title>
          }
          styles={{ body: { paddingTop: 16 } }}
        >
          {isLoading ? (
            <div className="d-flex flex-column gap-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton.Input key={i} active block className="h-14" />
              ))}
            </div>
          ) : (
            <Table
              dataSource={mockCallLogs}
              rowKey="id"
              pagination={false}
              scroll={{ x: 'max-content' }}
              columns={[
                {
                  title: 'Date',
                  dataIndex: 'date',
                  key: 'date',
                  render: (_, record) => (
                    <div>
                      <Text strong>{record.date}</Text>
                      <br />
                      <Text type="secondary" className="text-xs">{record.time}</Text>
                    </div>
                  ),
                },
                {
                  title: 'MSISDN',
                  dataIndex: 'msisdn',
                  key: 'msisdn',
                  render: (text: string) => (
                    <StatusBadge title={text} color="primary" size="xs" />
                  ),
                },
                {
                  title: 'Category',
                  dataIndex: 'category',
                  key: 'category',
                  render: (_, record) => (
                    <div>
                      <Text>{record.category}</Text>
                      <br />
                      <Text type="secondary" className="text-xs">{record.subCategory}</Text>
                    </div>
                  ),
                },
                {
                  title: 'Caller Sentiment',
                  dataIndex: 'callerSentiment',
                  key: 'callerSentiment',
                  align: 'center',
                  render: (sentiment: CallLog["callerSentiment"]) => {
                    const getSentimentIcon = (sentiment: CallLog["callerSentiment"]) => {
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
                },
                {
                  title: 'Score',
                  dataIndex: 'score',
                  key: 'score',
                  align: 'center',
                  render: (score: number) => (
                    <div>
                      <Text strong>{score}</Text>
                      <br />
                      <Text type="secondary" className="text-xs">out of 10</Text>
                    </div>
                  ),
                },
                {
                  title: 'Case Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string, record: CallLog) => (
                    <StatusBadge 
                      title={status} 
                      color={getStatusBadgeColor(record.statusColor)} 
                      size="xs" 
                    />
                  ),
                },
                {
                  title: '',
                  key: 'actions',
                  width: 100,
                  align: 'right',
                  render: (_, record: CallLog) => (
                    <Space>
                      <Button
                        type={playingId === record.id ? "primary" : "text"}
                        icon={playingId === record.id ? <IconPlayerPause /> : <IconPlayerPlay />}
                        onClick={() => handlePlayAudio(record.id)}
                        className="rounded-lg"
                      />
                      <Button
                        type="text"
                        icon={<IconEye />}
                        onClick={() => setSelectedCallLog(record)}
                        className="rounded-lg"
                      />
                    </Space>
                  ),
                },
              ]}
            />
          )}
        </Card>
      </div>

      <SingleCallView
        selectedCallLog={selectedCallLog}
        agentName={agentName}
        onClose={() => setSelectedCallLog(null)}
      />

      <AIHelper />
    </ConfigProvider>
  );
}
