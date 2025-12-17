import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Phone,
  Clock,
  Target,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Pause,
  Eye,
  Heart,
  Users,
  PhoneOff
} from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion } from "framer-motion";
import { CallLogDetails } from "@/components/post-call/CallLogDetails";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

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

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  tooltip?: string;
}

const mockStats: StatCard[] = [
  { label: "Total Calls", value: "245", icon: Phone, color: "from-blue-500 to-blue-600" },
  { label: "Avg Handle Time", value: "4:32", icon: Clock, color: "from-purple-500 to-purple-600" },
  { label: "FCR Rate", value: "92%", icon: Target, color: "from-green-500 to-green-600" },
  { label: "CSAT Score", value: "4.8", icon: Star, color: "from-amber-500 to-amber-600" },
  { label: "Kindness Score", value: "85%", icon: Heart, color: "from-pink-500 to-pink-600" },
  { label: "Dropped Calls", value: "3%", icon: PhoneOff, color: "from-red-500 to-red-600" },
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

const SentimentIcon = ({ sentiment }: { sentiment: CallLog["callerSentiment"] }) => {
  switch (sentiment) {
    case "positive":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "negative":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-yellow-500" />;
  }
};

const getStatusBadgeColor = (color: string) => {
  switch (color) {
    case "green":
      return "bg-green-500/10 text-green-500 border-green-500/30";
    case "amber":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    case "blue":
      return "bg-blue-500/10 text-blue-500 border-blue-500/30";
    case "red":
      return "bg-red-500/10 text-red-500 border-red-500/30";
    default:
      return "bg-muted";
  }
};

export default function AgentInsights() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();
  const [isLoading, setIsLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);

  // Mock agent data - in real app, fetch based on agentId
  const agentName = "John Smith";
  const agentIdDisplay = agentId || "AGT-001";

  useEffect(() => {
    setShowModuleTabs(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => {
      setShowModuleTabs(true);
      clearTimeout(timer);
    };
  }, [setShowModuleTabs]);

  const handlePlayAudio = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header with Back Button */}
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl"
                onClick={() => navigate("/post-call-analyzer/agent-performance")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Agent Insights
                  </CardTitle>
                  <span className="text-xl text-muted-foreground">-</span>
                  <Badge variant="secondary" className="text-sm font-medium">
                    {agentName} - {agentIdDisplay}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Overall Performance
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats and Chart Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {mockStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-4">
                    {isLoading ? (
                      <Skeleton className="h-16 w-full" />
                    ) : (
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                          <p className="text-xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                          <stat.icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Category Chart */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Case Category Report</CardTitle>
              <p className="text-sm text-muted-foreground">Distribution of calls by category</p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
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
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Call Logs Table */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <CardTitle className="text-base font-medium">Call Logs</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">MSISDN</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold text-center">Caller Sentiment</TableHead>
                    <TableHead className="font-semibold text-center">Score</TableHead>
                    <TableHead className="font-semibold">Case Status</TableHead>
                    <TableHead className="font-semibold w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCallLogs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group border-b border-border/30 hover:bg-muted/20"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.date}</span>
                          <span className="text-xs text-muted-foreground">{log.time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.msisdn}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{log.category}</span>
                          <span className="text-xs text-muted-foreground">{log.subCategory}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <SentimentIcon sentiment={log.callerSentiment} />
                          <span className="capitalize text-sm">{log.callerSentiment}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{log.score}</span>
                          <span className="text-xs text-muted-foreground">out of 10</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeColor(log.statusColor)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-lg ${
                              playingId === log.id
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => handlePlayAudio(log.id)}
                          >
                            {playingId === log.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-muted"
                            onClick={() => setSelectedCallLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call Log Details Sheet */}
      <CallLogDetails
        callLog={selectedCallLog ? {
          id: selectedCallLog.id,
          date: selectedCallLog.date,
          time: selectedCallLog.time,
          msisdn: selectedCallLog.msisdn,
          agent: agentName,
          callDuration: "5:23",
          category: selectedCallLog.category,
          subCategory: selectedCallLog.subCategory,
          userSentiment: selectedCallLog.callerSentiment,
          agentSentiment: "positive",
          summary: "Customer called regarding billing inquiry. Agent successfully resolved the issue by explaining the charges and offering a promotional discount. Customer expressed satisfaction with the resolution.",
          transcription: [
            { speaker: "Agent", text: "Thank you for calling. How may I assist you today?", timestamp: "00:00" },
            { speaker: "Customer", text: "Hi, I have a question about my recent bill.", timestamp: "00:05" },
            { speaker: "Agent", text: "I'd be happy to help you with that. Can you please provide your account number?", timestamp: "00:10" },
            { speaker: "Customer", text: "Sure, it's 12345678.", timestamp: "00:18" },
            { speaker: "Agent", text: "Thank you. I can see your account. What specific charge would you like me to explain?", timestamp: "00:25" },
          ],
        } : null}
        open={!!selectedCallLog}
        onClose={() => setSelectedCallLog(null)}
      />

      <AIHelper />
    </>
  );
}
