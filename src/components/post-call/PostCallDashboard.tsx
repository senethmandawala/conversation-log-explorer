import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, Calendar, BarChart3, FileText, Lightbulb, Headphones, Table, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "./StatCard";
import { ReportSection } from "./ReportSection";
import { CaseClassificationReport } from "./CaseClassificationReport";
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

// Default fallback data
const defaultStatCards = [
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
      title: "Overall Performance", 
      description: "14 December 2025",
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
      id: "sentiment-analysis", 
      title: "Sentiment Analysis", 
      description: "Customer sentiment breakdown",
      chartType: "pie" as const,
      chartData: sentimentData
    },
    { 
      id: "agent-performance", 
      title: "Agent Performance", 
      description: "Individual agent metrics",
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
            <StatCard {...stat} />
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
            ) : (
              <ReportSection {...report} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
