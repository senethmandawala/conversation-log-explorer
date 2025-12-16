import { motion } from "framer-motion";
import { ArrowLeft, Filter, Calendar, BarChart3, FileText, Lightbulb, Headphones, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "./StatCard";
import { ReportSection } from "./ReportSection";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Instance } from "@/pages/PostCallAnalyzer";

interface PostCallDashboardProps {
  instance: Instance;
  onBack: () => void;
}

const statCards = [
  { 
    title: "Total Calls", 
    value: "0", 
    icon: "phone",
    color: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-l-blue-500"
  },
  { 
    title: "FCR Rate", 
    value: "0%", 
    icon: "check",
    color: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    borderColor: "border-l-green-500"
  },
  { 
    title: "Avg. Handling Time", 
    value: "0sec", 
    icon: "clock",
    color: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-l-purple-500"
  },
  { 
    title: "Open Cases", 
    value: "0", 
    icon: "folder",
    color: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    borderColor: "border-l-red-500"
  },
  { 
    title: "Avg. Waiting Time", 
    value: "0sec", 
    icon: "timer",
    color: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-l-amber-500"
  },
  { 
    title: "Avg. Silence Time", 
    value: "0sec", 
    icon: "volume",
    color: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-l-orange-500"
  },
];

// Mock data for charts
const performanceData = [
  { name: "Mon", calls: 120, resolved: 95 },
  { name: "Tue", calls: 150, resolved: 130 },
  { name: "Wed", calls: 180, resolved: 160 },
  { name: "Thu", calls: 140, resolved: 120 },
  { name: "Fri", calls: 200, resolved: 175 },
  { name: "Sat", calls: 90, resolved: 80 },
  { name: "Sun", calls: 60, resolved: 55 },
];

const redAlertData = [
  { name: "Long Wait", value: 45 },
  { name: "Escalations", value: 32 },
  { name: "Dropped Calls", value: 28 },
  { name: "Low CSAT", value: 18 },
  { name: "Repeat Calls", value: 25 },
];

const caseClassificationData = [
  { name: "Billing", value: 350 },
  { name: "Technical", value: 280 },
  { name: "Account", value: 180 },
  { name: "Sales", value: 120 },
  { name: "Complaints", value: 90 },
  { name: "Other", value: 60 },
];

const sentimentData = [
  { name: "Positive", value: 45 },
  { name: "Neutral", value: 35 },
  { name: "Negative", value: 20 },
];

const agentPerformanceData = [
  { name: "John D.", value: 156 },
  { name: "Sarah M.", value: 142 },
  { name: "Mike R.", value: 128 },
  { name: "Emily K.", value: 115 },
  { name: "David L.", value: 98 },
  { name: "Lisa P.", value: 87 },
];

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

export const PostCallDashboard = ({ instance, onBack }: PostCallDashboardProps) => {
  return (
    <div className="space-y-6">
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
            <ReportSection {...report} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
