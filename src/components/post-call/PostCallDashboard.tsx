import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, Calendar, BarChart3, FileText, Lightbulb, Headphones, Table, PhoneCall, Phone, CheckCircle, Clock, FolderOpen, Timer, VolumeX, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReportSection } from "./ReportSection";
import { CaseClassificationReport } from "@/pages/post-call-analyzer/case-classification/CaseClassificationReport";
import SentimentAnalysisReport from "@/pages/post-call-analyzer/sentiment-analysis/SentimentAnalysisReport";
import CallResolutionReport from "@/pages/post-call-analyzer/call-resolution/CallResolutionReport";
import FrequentCallersReport from "@/pages/post-call-analyzer/frequent-callers/FrequentCallersReport";
import CallDurationReport from "@/pages/post-call-analyzer/call-duration/CallDurationReport";
import TrafficTrendsReport from "@/pages/post-call-analyzer/traffic-trends/TrafficTrendsReport";
import RepeatCallTimelineReport from "@/pages/post-call-analyzer/repeat-call-timeline/RepeatCallTimelineReport";
import ChannelWiseCategoryReport from "@/pages/post-call-analyzer/channel-category/ChannelWiseCategoryReport";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Instance } from "@/pages/PostCallAnalyzer";
import { 
  fetchPostCallStats, 
  fetchOverallPerformance, 
  fetchRedAlertMetrics,
  fetchCaseClassification,
  fetchSentimentAnalysis,
  fetchAgentPerformance,
  type PostCallStats, 
  type OverallPerformanceResponse 
} from "@/lib/api";

interface PostCallDashboardProps {
  instance: Instance;
  onBack: () => void;
}

// Compact stat card component with Autopilot design (sized for grid layout)
interface CompactStatCardProps {
  color: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
}

const CompactStatCard = ({ color, icon, label, value, trend }: CompactStatCardProps) => {
  const colorConfig: Record<string, { gradient: string; iconBg: string; border: string; glow: string }> = {
    blue: {
      gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30",
      border: "border-blue-500/20",
      glow: "shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]",
    },
    green: {
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30",
      border: "border-emerald-500/20",
      glow: "shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]",
    },
    red: {
      gradient: "from-red-500/10 via-red-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30",
      border: "border-red-500/20",
      glow: "shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]",
    },
    amber: {
      gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/30",
      border: "border-amber-500/20",
      glow: "shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]",
    },
    purple: {
      gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30",
      border: "border-purple-500/20",
      glow: "shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]",
    },
    orange: {
      gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30",
      border: "border-orange-500/20",
      glow: "shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]",
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <Card className={`relative overflow-hidden bg-card/80 backdrop-blur-xl border ${config.border} ${config.glow} hover:scale-[1.02] transition-all duration-300`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient}`} />
      
      <div className="relative p-4">
        <div className="flex items-center gap-4">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${config.iconBg} shadow-lg`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
              {trend && (
                <span className={`flex items-center gap-0.5 text-xs font-medium ${trend.isPositive ? "text-emerald-500" : "text-red-500"}`}>
                  {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {trend.value}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Icon mapping for stat cards
const iconMap: Record<string, React.ReactNode> = {
  phone: <Phone className="h-5 w-5 text-white" />,
  check: <CheckCircle className="h-5 w-5 text-white" />,
  clock: <Clock className="h-5 w-5 text-white" />,
  folder: <FolderOpen className="h-5 w-5 text-white" />,
  timer: <Timer className="h-5 w-5 text-white" />,
  volume: <VolumeX className="h-5 w-5 text-white" />,
};

// Color mapping for stat cards
const getColorFromIconColor = (iconColor: string): string => {
  if (iconColor.includes("blue")) return "blue";
  if (iconColor.includes("green")) return "green";
  if (iconColor.includes("purple")) return "purple";
  if (iconColor.includes("red")) return "red";
  if (iconColor.includes("amber")) return "amber";
  if (iconColor.includes("orange")) return "orange";
  return "blue";
};

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
    color: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-l-blue-500",
    trend: { value: stats.totalCalls.changePercentage, isPositive: stats.totalCalls.changePercentage >= 0 }
  },
  { 
    title: "FCR Rate", 
    value: `${stats.fcrRate.value}${stats.fcrRate.unit || '%'}`, 
    icon: "check",
    color: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    borderColor: "border-l-green-500",
    trend: { value: stats.fcrRate.changePercentage, isPositive: stats.fcrRate.changePercentage >= 0 }
  },
  { 
    title: "Avg. Handling Time", 
    value: formatTimeValue(String(stats.avgHandlingTime.value)), 
    icon: "clock",
    color: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-l-purple-500",
    trend: { value: stats.avgHandlingTime.changePercentage, isPositive: stats.avgHandlingTime.changePercentage <= 0 }
  },
  { 
    title: "Open Cases", 
    value: stats.openCases.value.toLocaleString(), 
    icon: "folder",
    color: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    borderColor: "border-l-red-500",
    trend: { value: stats.openCases.changePercentage, isPositive: stats.openCases.changePercentage <= 0 }
  },
  { 
    title: "Avg. Waiting Time", 
    value: formatTimeValue(String(stats.avgWaitingTime.value)), 
    icon: "timer",
    color: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-l-amber-500",
    trend: { value: stats.avgWaitingTime.changePercentage, isPositive: stats.avgWaitingTime.changePercentage <= 0 }
  },
  { 
    title: "Avg. Silence Time", 
    value: formatTimeValue(String(stats.avgSilenceTime.value)), 
    icon: "volume",
    color: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-l-orange-500",
    trend: { value: stats.avgSilenceTime.changePercentage, isPositive: stats.avgSilenceTime.changePercentage <= 0 }
  },
];

// Helper to transform API performance data to chart format
const transformPerformanceData = (performance: OverallPerformanceResponse['overallPerformance']) => {
  const resolvedSeries = performance.series.find(s => s.name === 'Resolved');
  const failedSeries = performance.series.find(s => s.name === 'Fail Calls');
  const fulfilledSeries = performance.series.find(s => s.name === 'Fulfilled');
  
  if (!resolvedSeries) return [];
  
  return resolvedSeries.data.map((point, index) => {
    const date = new Date(point.x);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      name: dayName,
      calls: failedSeries?.data[index]?.y || 0,
      resolved: point.y,
      fulfilled: fulfilledSeries?.data[index]?.y || 0,
    };
  });
};

// Stat card type definition
interface StatCardData {
  title: string;
  value: string;
  icon: string;
  color: string;
  iconColor: string;
  borderColor: string;
  trend?: { value: number; isPositive: boolean };
}

// Default fallback data
const defaultStatCards: StatCardData[] = [
  { title: "Total Calls", value: "—", icon: "phone", color: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400", borderColor: "border-l-blue-500" },
  { title: "FCR Rate", value: "—", icon: "check", color: "bg-green-100 dark:bg-green-900/30", iconColor: "text-green-600 dark:text-green-400", borderColor: "border-l-green-500" },
  { title: "Avg. Handling Time", value: "—", icon: "clock", color: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400", borderColor: "border-l-purple-500" },
  { title: "Open Cases", value: "—", icon: "folder", color: "bg-red-100 dark:bg-red-900/30", iconColor: "text-red-600 dark:text-red-400", borderColor: "border-l-red-500" },
  { title: "Avg. Waiting Time", value: "—", icon: "timer", color: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400", borderColor: "border-l-amber-500" },
  { title: "Avg. Silence Time", value: "—", icon: "volume", color: "bg-orange-100 dark:bg-orange-900/30", iconColor: "text-orange-600 dark:text-orange-400", borderColor: "border-l-orange-500" },
];

const defaultPerformanceData = [
  { name: "Mon", calls: 0, resolved: 0 },
  { name: "Tue", calls: 0, resolved: 0 },
  { name: "Wed", calls: 0, resolved: 0 },
  { name: "Thu", calls: 0, resolved: 0 },
  { name: "Fri", calls: 0, resolved: 0 },
  { name: "Sat", calls: 0, resolved: 0 },
  { name: "Sun", calls: 0, resolved: 0 },
];

// Default fallback data for reports
const defaultRedAlertData: { name: string; value: number }[] = [];
const defaultCaseClassificationData: { name: string; value: number }[] = [];
const defaultSentimentData: { name: string; value: number }[] = [];
const defaultAgentPerformanceData: { name: string; value: number }[] = [];

export const PostCallDashboard = ({ instance, onBack }: PostCallDashboardProps) => {
  const [statCards, setStatCards] = useState(defaultStatCards);
  const [performanceData, setPerformanceData] = useState(defaultPerformanceData);
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
          performanceResponse,
          redAlertResponse,
          caseClassificationResponse,
          sentimentResponse,
          agentPerformanceResponse
        ] = await Promise.all([
          fetchPostCallStats(),
          fetchOverallPerformance(),
          fetchRedAlertMetrics(),
          fetchCaseClassification(),
          fetchSentimentAnalysis(),
          fetchAgentPerformance()
        ]);

        // Transform and set stat cards
        if (statsResponse?.stats) {
          setStatCards(transformStatsToCards(statsResponse.stats));
        }

        // Transform and set performance data
        if (performanceResponse?.overallPerformance) {
          const transformedData = transformPerformanceData(performanceResponse.overallPerformance);
          if (transformedData.length > 0) {
            setPerformanceData(transformedData);
          }
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
      id: "performance", 
      title: "Overall Performance Chart", 
      description: "Weekly performance trends and metrics",
      hasChart: true,
      chartType: "line" as const,
      chartData: performanceData
    },
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
      chartData: performanceData
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
    <div className="space-y-6 p-6">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <CompactStatCard
              color={getColorFromIconColor(stat.iconColor)}
              icon={iconMap[stat.icon]}
              label={stat.title}
              value={stat.value}
              trend={stat.trend}
            />
          </motion.div>
        ))}
      </div>

      {/* Report Sections */}
      <div className="space-y-4">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
          >
            {report.id === "case-classification" ? (
              <CaseClassificationReport {...report} />
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
        >
          <SentimentAnalysisReport />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <CallResolutionReport />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
        >
          <FrequentCallersReport />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        >
          <CallDurationReport />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          <TrafficTrendsReport />
        </motion.div>
      </div>
    </div>
  );
};
