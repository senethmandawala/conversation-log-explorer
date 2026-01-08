import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Card, Row, Col, Typography, Space, Badge, Tooltip } from "antd";
import { 
  ArrowLeftOutlined, 
  FilterOutlined, 
  CalendarOutlined, 
  BarChartOutlined, 
  FileTextOutlined, 
  BulbOutlined, 
  PhoneOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FolderOpenOutlined, 
  FieldTimeOutlined, 
  MinusCircleOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined 
} from "@ant-design/icons";
import { ReportSection } from "./ReportSection";
import { CaseClassificationReport } from "@/pages/post-call-analyzer/case-classification/CaseClassificationReport";
import SentimentAnalysisReport from "@/pages/post-call-analyzer/sentiment-analysis/SentimentAnalysisReport";
import CallResolutionReport from "@/pages/post-call-analyzer/call-resolution/CallResolutionReport";
import FrequentCallersReport from "@/pages/post-call-analyzer/frequent-callers/FrequentCallersReport";
import CallDurationReport from "@/pages/post-call-analyzer/call-duration/CallDurationReport";
import TrafficTrendsReport from "@/pages/post-call-analyzer/traffic-trends/TrafficTrendsReport";
import RepeatCallTimelineReport from "@/pages/post-call-analyzer/repeat-call-timeline/RepeatCallTimelineReport";
import ChannelWiseCategoryReport from "@/pages/post-call-analyzer/channel-category/ChannelWiseCategoryReport";
import RedAlertMetricsReport from "@/pages/post-call-analyzer/red-alert/RedAlertMetricsReport";
import OverallPerformanceChart from "@/pages/post-call-analyzer/overall-performance/OverallPerformanceChart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/stat-card";
import type { Instance } from "@/pages/PostCallAnalyzer";
import { 
  fetchPostCallStats, 
  fetchRedAlertMetrics,
  fetchCaseClassification,
  fetchSentimentAnalysis,
  fetchAgentPerformance,
  type PostCallStats
} from "@/lib/api";

interface PostCallDashboardProps {
  instance: Instance;
  onBack: () => void;
}

const { Title, Text } = Typography;

// Helper to format time string (HH:MM:SS) to readable format
const formatTimeValue = (timeStr: string): string => {
  const parts = timeStr.split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }
  return timeStr;
};

// Helper to transform API stats to StatCard format
const transformStatsToCards = (stats: PostCallStats['stats']) => [
  { 
    label: "Total Calls", 
    value: stats.totalCalls.value.toLocaleString(), 
    icon: <PhoneOutlined />,
    color: "#3b82f6",
    gradientColors: ["#3b82f6", "#2563eb"] as [string, string],
  },
  { 
    label: "FCR Rate", 
    value: `${stats.fcrRate.value}${stats.fcrRate.unit || '%'}`, 
    icon: <CheckCircleOutlined />,
    color: "#10b981",
    gradientColors: ["#10b981", "#059669"] as [string, string],
  },
  { 
    label: "Avg. Handling Time", 
    value: formatTimeValue(String(stats.avgHandlingTime.value)), 
    icon: <ClockCircleOutlined />,
    color: "#8b5cf6",
    gradientColors: ["#8b5cf6", "#7c3aed"] as [string, string],
  },
  { 
    label: "Open Cases", 
    value: stats.openCases.value.toLocaleString(), 
    icon: <FolderOpenOutlined />,
    color: "#ef4444",
    gradientColors: ["#ef4444", "#dc2626"] as [string, string],
  },
  { 
    label: "Avg. Waiting Time", 
    value: formatTimeValue(String(stats.avgWaitingTime.value)), 
    icon: <FieldTimeOutlined />,
    color: "#f59e0b",
    gradientColors: ["#f59e0b", "#d97706"] as [string, string],
  },
  { 
    label: "Avg. Silence Time", 
    value: formatTimeValue(String(stats.avgSilenceTime.value)), 
    icon: <MinusCircleOutlined />,
    color: "#f97316",
    gradientColors: ["#f97316", "#ea580c"] as [string, string],
  },
];

// Default fallback data for StatCard
const defaultStatCards = [
  { label: "Total Calls", value: "—", icon: <PhoneOutlined />, color: "#3b82f6", gradientColors: ["#3b82f6", "#2563eb"] as [string, string] },
  { label: "FCR Rate", value: "—", icon: <CheckCircleOutlined />, color: "#10b981", gradientColors: ["#10b981", "#059669"] as [string, string] },
  { label: "Avg. Handling Time", value: "—", icon: <ClockCircleOutlined />, color: "#8b5cf6", gradientColors: ["#8b5cf6", "#7c3aed"] as [string, string] },
  { label: "Open Cases", value: "—", icon: <FolderOpenOutlined />, color: "#ef4444", gradientColors: ["#ef4444", "#dc2626"] as [string, string] },
  { label: "Avg. Waiting Time", value: "—", icon: <FieldTimeOutlined />, color: "#f59e0b", gradientColors: ["#f59e0b", "#d97706"] as [string, string] },
  { label: "Avg. Silence Time", value: "—", icon: <MinusCircleOutlined />, color: "#f97316", gradientColors: ["#f97316", "#ea580c"] as [string, string] },
];

// Default fallback data
const defaultRedAlertData: { name: string; value: number }[] = [];
const defaultCaseClassificationData: { name: string; value: number }[] = [];
const defaultSentimentData: { name: string; value: number }[] = [];
const defaultAgentPerformanceData: { name: string; value: number }[] = [];

export const PostCallDashboard = ({ instance, onBack }: PostCallDashboardProps) => {
  const [statCards, setStatCards] = useState(defaultStatCards);
  const [redAlertData, setRedAlertData] = useState(defaultRedAlertData);
  const [caseClassificationData, setCaseClassificationData] = useState(defaultCaseClassificationData);
  const [sentimentData, setSentimentData] = useState(defaultSentimentData);
  const [agentPerformanceData, setAgentPerformanceData] = useState(defaultAgentPerformanceData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [
          statsResponse, 
          redAlertResponse,
          caseClassificationResponse,
          sentimentResponse,
          agentPerformanceResponse
        ] = await Promise.all([
          fetchPostCallStats(),
          fetchRedAlertMetrics(),
          fetchCaseClassification(),
          fetchSentimentAnalysis(),
          fetchAgentPerformance()
        ]);

        // Transform and set stat cards
        if (statsResponse?.stats) {
          setStatCards(transformStatsToCards(statsResponse.stats));
        }

        // Transform and set red alert data
        if (redAlertResponse?.redAlertMetrics?.data) {
          setRedAlertData(redAlertResponse.redAlertMetrics.data.map(item => ({
            name: item.category,
            value: item.count
          })));
        }

        // Transform and set case classification data
        if (caseClassificationResponse?.caseClassification?.data) {
          setCaseClassificationData(caseClassificationResponse.caseClassification.data.map(item => ({
            name: item.category,
            value: item.count
          })));
        }

        // Transform and set sentiment data
        if (sentimentResponse?.sentimentAnalysis?.data) {
          const sentData = sentimentResponse.sentimentAnalysis.data;
          setSentimentData([
            { name: "Positive", value: sentData.positive },
            { name: "Neutral", value: sentData.neutral },
            { name: "Negative", value: sentData.negative }
          ]);
        }

        // Transform and set agent performance data
        if (agentPerformanceResponse?.agentPerformance?.data) {
          setAgentPerformanceData(agentPerformanceResponse.agentPerformance.data.map(item => ({
            name: item.agent,
            value: item.value
          })));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const reports = [
    { 
      id: "red-alerts", 
      title: "Red Alert Metrics", 
      description: "Highlighting key areas that require immediate attention",
      note: "Note: Data is based on the selected date range",
      chartType: "bar" as const,
      chartData: redAlertData
    },
    { 
      id: "case-classification", 
      title: "Case Classification", 
      description: "14 December 2025",
      hasFilter: true,
      chartType: "treemap" as const,
      chartData: caseClassificationData
    },
    { 
      id: "repeat-call-timeline", 
      title: "7 Day Repeat Call Timeline", 
      description: "Track repeat callers over the past 7 days",
      chartType: "line" as const,
      chartData: agentPerformanceData
    },
    { 
      id: "channel-category", 
      title: "Channel Wise Category Distribution", 
      description: "Call distribution across different channels",
      chartType: "bar" as const,
      chartData: agentPerformanceData
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Stat Cards Grid */}
      <Row gutter={[16, 16]}>
        {statCards.map((stat, index) => (
          <Col key={stat.label} xs={24} sm={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
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
          </Col>
        ))}
      </Row>

      {/* Report Sections */}
      <div style={{ marginTop: 24 }}>
        {/* Overall Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <OverallPerformanceChart />
        </motion.div>

        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            style={{ marginTop: 16 }}
          >
            {report.id === "case-classification" ? (
              <CaseClassificationReport {...report} hideAccentLine={true} />
            ) : report.id === "red-alerts" ? (
              <RedAlertMetricsReport />
            ) : report.id === "repeat-call-timeline" ? (
              <RepeatCallTimelineReport />
            ) : report.id === "channel-category" ? (
              <ChannelWiseCategoryReport />
            ) : (
              <ReportSection {...report} />
            )}
          </motion.div>
        ))}

        {/* Additional Report Components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          style={{ marginTop: 16 }}
        >
          <SentimentAnalysisReport />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          style={{ marginTop: 16 }}
        >
          <CallResolutionReport />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
          style={{ marginTop: 16 }}
        >
          <FrequentCallersReport />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
          style={{ marginTop: 16 }}
        >
          <CallDurationReport />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          style={{ marginTop: 16 }}
        >
          <TrafficTrendsReport />
        </motion.div>
      </div>
    </div>
  );
};
