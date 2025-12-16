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

const reports = [
  { 
    id: "performance", 
    title: "Overall Performance", 
    description: "14 December 2025",
    hasChart: true 
  },
  { 
    id: "red-alerts", 
    title: "Red Alert Metrics", 
    description: "Highlighting key areas that require immediate attention",
    note: "Note: Data is based on the selected date range"
  },
  { 
    id: "case-classification", 
    title: "Case Classification", 
    description: "14 December 2025",
    hasFilter: true
  },
  { 
    id: "sentiment-analysis", 
    title: "Sentiment Analysis", 
    description: "Customer sentiment breakdown"
  },
  { 
    id: "agent-performance", 
    title: "Agent Performance", 
    description: "Individual agent metrics"
  },
];

export const PostCallDashboard = ({ instance, onBack }: PostCallDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Instances
          </Button>
          <span className="text-sm text-muted-foreground">
            Instance: <span className="font-medium text-foreground">{instance.name}</span>
          </span>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue="dashboard" className="hidden md:block">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2">
              <FileText className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Lightbulb className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="calls" className="gap-2">
              <Headphones className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <Table className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Today
          </Button>
        </div>
      </div>

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
