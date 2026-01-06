import { useState, useEffect } from "react";
import { Row, Col, Spin, Typography, Space, Tag } from "antd";
import { motion } from "framer-motion";
import { StatCardAntd } from "./StatCardAntd";
import { ReportCardAntd } from "./ReportCardAntd";
import { CaseClassificationReportAntd } from "@/pages/post-call-analyzer/case-classification/CaseClassificationReportAntd";
import SentimentAnalysisReportAntd from "@/pages/post-call-analyzer/sentiment-analysis/SentimentAnalysisReportAntd";
import CallResolutionReportAntd from "@/pages/post-call-analyzer/call-resolution/CallResolutionReportAntd";
import FrequentCallersReportAntd from "@/pages/post-call-analyzer/frequent-callers/FrequentCallersReportAntd";
import CallDurationReportAntd from "@/pages/post-call-analyzer/call-duration/CallDurationReportAntd";
import TrafficTrendsReportAntd from "@/pages/post-call-analyzer/traffic-trends/TrafficTrendsReportAntd";
import RepeatCallTimelineReportAntd from "@/pages/post-call-analyzer/repeat-call-timeline/RepeatCallTimelineReportAntd";
import ChannelWiseCategoryReportAntd from "@/pages/post-call-analyzer/channel-category/ChannelWiseCategoryReportAntd";
import RedAlertMetricsReportAntd from "@/pages/post-call-analyzer/red-alert/RedAlertMetricsReportAntd";
import OverallPerformanceChartAntd from "@/pages/post-call-analyzer/overall-performance/OverallPerformanceChartAntd";
import type { Instance } from "@/pages/PostCallAnalyzer";
import { 
  fetchPostCallStats, 
  fetchRedAlertMetrics,
  fetchCaseClassification,
  fetchSentimentAnalysis,
  fetchAgentPerformance,
  type PostCallStats
} from "@/lib/api";

const { Text } = Typography;

interface PostCallDashboardAntdProps {
  instance: Instance;
  onBack: () => void;
}

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

// Helper to transform API stats to stat cards format
const transformStatsToCards = (stats: PostCallStats['stats']) => [
  { 
    title: "Total Calls", 
    value: stats.totalCalls.value.toLocaleString(), 
    icon: "phone",
    color: "blue" as const,
    trend: { value: stats.totalCalls.changePercentage, isPositive: stats.totalCalls.changePercentage >= 0 }
  },
  { 
    title: "FCR Rate", 
    value: `${stats.fcrRate.value}${stats.fcrRate.unit || '%'}`, 
    icon: "check",
    color: "green" as const,
    trend: { value: stats.fcrRate.changePercentage, isPositive: stats.fcrRate.changePercentage >= 0 }
  },
  { 
    title: "Avg. Handling Time", 
    value: formatTimeValue(String(stats.avgHandlingTime.value)), 
    icon: "clock",
    color: "purple" as const,
    trend: { value: stats.avgHandlingTime.changePercentage, isPositive: stats.avgHandlingTime.changePercentage <= 0 }
  },
  { 
    title: "Open Cases", 
    value: stats.openCases.value.toLocaleString(), 
    icon: "folder",
    color: "red" as const,
    trend: { value: stats.openCases.changePercentage, isPositive: stats.openCases.changePercentage <= 0 }
  },
  { 
    title: "Avg. Waiting Time", 
    value: formatTimeValue(String(stats.avgWaitingTime.value)), 
    icon: "timer",
    color: "amber" as const,
    trend: { value: stats.avgWaitingTime.changePercentage, isPositive: stats.avgWaitingTime.changePercentage <= 0 }
  },
  { 
    title: "Avg. Silence Time", 
    value: formatTimeValue(String(stats.avgSilenceTime.value)), 
    icon: "volume",
    color: "orange" as const,
    trend: { value: stats.avgSilenceTime.changePercentage, isPositive: stats.avgSilenceTime.changePercentage <= 0 }
  },
];

// Stat card type definition
interface StatCardData {
  title: string;
  value: string;
  icon: string;
  color: "blue" | "green" | "purple" | "red" | "amber" | "orange";
  trend?: { value: number; isPositive: boolean };
}

// Default fallback data
const defaultStatCards: StatCardData[] = [
  { title: "Total Calls", value: "—", icon: "phone", color: "blue" },
  { title: "FCR Rate", value: "—", icon: "check", color: "green" },
  { title: "Avg. Handling Time", value: "—", icon: "clock", color: "purple" },
  { title: "Open Cases", value: "—", icon: "folder", color: "red" },
  { title: "Avg. Waiting Time", value: "—", icon: "timer", color: "amber" },
  { title: "Avg. Silence Time", value: "—", icon: "volume", color: "orange" },
];

export function PostCallDashboardAntd({ instance, onBack }: PostCallDashboardAntdProps) {
  const [statCards, setStatCards] = useState(defaultStatCards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const statsResponse = await fetchPostCallStats();

        if (statsResponse?.stats) {
          setStatCards(transformStatsToCards(statsResponse.stats));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Stat Cards Grid */}
      <Row gutter={[16, 16]}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} key={stat.title}>
            <StatCardAntd
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              delay={index * 0.05}
            />
          </Col>
        ))}
      </Row>

      {/* Report Sections */}
      <Space direction="vertical" size="middle" className="w-full">
        {/* Overall Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <OverallPerformanceChartAntd />
        </motion.div>

        {/* Red Alert Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <RedAlertMetricsReportAntd />
        </motion.div>

        {/* Case Classification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <CaseClassificationReportAntd />
        </motion.div>

        {/* Repeat Call Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <RepeatCallTimelineReportAntd />
        </motion.div>

        {/* Channel Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <ChannelWiseCategoryReportAntd />
        </motion.div>

        {/* Sentiment Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <SentimentAnalysisReportAntd />
        </motion.div>

        {/* Call Resolution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <CallResolutionReportAntd />
        </motion.div>

        {/* Frequent Callers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
        >
          <FrequentCallersReportAntd />
        </motion.div>

        {/* Call Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        >
          <CallDurationReportAntd />
        </motion.div>

        {/* Traffic Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          <TrafficTrendsReportAntd />
        </motion.div>
      </Space>
    </div>
  );
}
