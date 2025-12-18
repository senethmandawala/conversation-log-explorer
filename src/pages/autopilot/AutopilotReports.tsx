import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAutopilot } from "@/contexts/AutopilotContext";
import {
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  FileBarChart,
  Coins,
  ArrowLeft,
  Calendar,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

interface ReportItem {
  name: string;
  desc: string;
  icon: React.ReactNode;
  option: string;
  color: string;
}

const reports: ReportItem[] = [
  {
    name: "Transaction Summary",
    desc: "View detailed transaction summaries and patterns",
    icon: <FileText className="h-5 w-5" />,
    option: "transaction",
    color: "purple",
  },
  {
    name: "Document Access Frequency",
    desc: "Track document access patterns and frequency",
    icon: <FileBarChart className="h-5 w-5" />,
    option: "document",
    color: "blue",
  },
  {
    name: "Weekly Traffic Trends",
    desc: "Analyze weekly traffic patterns and trends",
    icon: <TrendingUp className="h-5 w-5" />,
    option: "weekly-trends",
    color: "green",
  },
  {
    name: "Success/Failure Rate",
    desc: "Monitor success and failure rates over time",
    icon: <BarChart3 className="h-5 w-5" />,
    option: "success-failure",
    color: "amber",
  },
  {
    name: "Token Usage Report",
    desc: "Track AI token consumption and costs",
    icon: <Coins className="h-5 w-5" />,
    option: "token-usage",
    color: "pink",
  },
  {
    name: "Average Call Duration",
    desc: "Analyze call duration statistics and trends",
    icon: <Clock className="h-5 w-5" />,
    option: "average-call-duration",
    color: "cyan",
  },
];

const colorClasses: Record<string, string> = {
  purple: "bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20",
  blue: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20",
  pink: "bg-pink-500/10 text-pink-500 group-hover:bg-pink-500/20",
  cyan: "bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/20",
};

// Sample data for reports
const transactionData = [
  { date: "Mon", success: 450, failed: 23 },
  { date: "Tue", success: 520, failed: 30 },
  { date: "Wed", success: 480, failed: 18 },
  { date: "Thu", success: 590, failed: 25 },
  { date: "Fri", success: 620, failed: 35 },
  { date: "Sat", success: 380, failed: 12 },
  { date: "Sun", success: 290, failed: 8 },
];

const tokenUsageData = [
  { name: "GPT-4", value: 45, color: "#8b5cf6" },
  { name: "GPT-3.5", value: 35, color: "#3b82f6" },
  { name: "Whisper", value: 15, color: "#10b981" },
  { name: "Embeddings", value: 5, color: "#f59e0b" },
];

const weeklyTrendsData = [
  { week: "W1", calls: 2400, resolved: 2100, transferred: 300 },
  { week: "W2", calls: 2800, resolved: 2500, transferred: 300 },
  { week: "W3", calls: 2600, resolved: 2300, transferred: 300 },
  { week: "W4", calls: 3200, resolved: 2900, transferred: 300 },
];

export default function AutopilotReports() {
  const navigate = useNavigate();
  const { selectedInstance } = useAutopilot();
  const [activeReport, setActiveReport] = useState<string>("landing");

  useEffect(() => {
    if (!selectedInstance) {
      navigate("/autopilot");
    }
  }, [selectedInstance, navigate]);

  if (!selectedInstance) {
    return null;
  }

  const renderReportContent = () => {
    switch (activeReport) {
      case "transaction":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-emerald-500/10 border-emerald-500/20">
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold text-emerald-600">3,330</p>
              </Card>
              <Card className="p-4 bg-purple-500/10 border-purple-500/20">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">95.4%</p>
              </Card>
              <Card className="p-4 bg-red-500/10 border-red-500/20">
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">151</p>
              </Card>
            </div>
            <Card className="p-6 border-border/50 bg-card/80">
              <h4 className="text-md font-semibold mb-4">Transaction Trends</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="success" name="Success" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        );
      case "token-usage":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-purple-500/10 border-purple-500/20">
                <p className="text-sm text-muted-foreground">Total Tokens</p>
                <p className="text-2xl font-bold text-purple-600">1.2M</p>
              </Card>
              <Card className="p-4 bg-blue-500/10 border-blue-500/20">
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-2xl font-bold text-blue-600">$45.80</p>
              </Card>
              <Card className="p-4 bg-emerald-500/10 border-emerald-500/20">
                <p className="text-sm text-muted-foreground">Avg per Call</p>
                <p className="text-2xl font-bold text-emerald-600">850</p>
              </Card>
              <Card className="p-4 bg-amber-500/10 border-amber-500/20">
                <p className="text-sm text-muted-foreground">Peak Usage</p>
                <p className="text-2xl font-bold text-amber-600">2.1K</p>
              </Card>
            </div>
            <Card className="p-6 border-border/50 bg-card/80">
              <h4 className="text-md font-semibold mb-4">Token Distribution by Model</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={tokenUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {tokenUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        );
      case "weekly-trends":
        return (
          <div className="space-y-6">
            <Card className="p-6 border-border/50 bg-card/80">
              <h4 className="text-md font-semibold mb-4">Weekly Call Volume Trends</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="calls" name="Total Calls" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="transferred" name="Transferred" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        );
      default:
        return (
          <Card className="p-6 border-border/50 bg-card/80">
            <p className="text-muted-foreground text-center py-8">
              Report visualization coming soon...
            </p>
          </Card>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {activeReport === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Reports</h2>
                <p className="text-sm text-muted-foreground">
                  Access detailed analytics and reports for your Autopilot instance
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report, index) => (
                  <motion.div
                    key={report.option}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      onClick={() => setActiveReport(report.option)}
                      className="p-5 border-border/50 bg-card/80 cursor-pointer group hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${colorClasses[report.color]}`}
                        >
                          {report.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {report.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{report.desc}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={activeReport}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setActiveReport("landing")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Reports
              </Button>

              <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {reports.find((r) => r.option === activeReport)?.name}
                </h2>
                {renderReportContent()}
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
