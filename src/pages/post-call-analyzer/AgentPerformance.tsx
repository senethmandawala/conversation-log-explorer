import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Download, 
  Filter,
  TrendingUp,
  TrendingDown,
  Star,
  Phone,
  Clock,
  Target,
  Award,
  BarChart3
} from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface AgentMetric {
  id: string;
  name: string;
  avatar: string;
  totalCalls: number;
  avgHandleTime: string;
  fcr: number;
  csat: number;
  sentiment: number;
  trend: "up" | "down" | "stable";
  rank: number;
}

const mockAgents: AgentMetric[] = [
  { id: "1", name: "John Smith", avatar: "JS", totalCalls: 245, avgHandleTime: "4:32", fcr: 92, csat: 4.8, sentiment: 85, trend: "up", rank: 1 },
  { id: "2", name: "Sarah Johnson", avatar: "SJ", totalCalls: 230, avgHandleTime: "5:15", fcr: 88, csat: 4.6, sentiment: 78, trend: "up", rank: 2 },
  { id: "3", name: "Mike Wilson", avatar: "MW", totalCalls: 198, avgHandleTime: "4:45", fcr: 85, csat: 4.5, sentiment: 72, trend: "stable", rank: 3 },
  { id: "4", name: "Emily Davis", avatar: "ED", totalCalls: 210, avgHandleTime: "6:10", fcr: 78, csat: 4.2, sentiment: 65, trend: "down", rank: 4 },
  { id: "5", name: "David Brown", avatar: "DB", totalCalls: 175, avgHandleTime: "5:30", fcr: 82, csat: 4.4, sentiment: 70, trend: "up", rank: 5 },
];

const performanceTrend = [
  { month: "Jan", avgFCR: 82, avgCSAT: 4.2 },
  { month: "Feb", avgFCR: 84, avgCSAT: 4.3 },
  { month: "Mar", avgFCR: 83, avgCSAT: 4.4 },
  { month: "Apr", avgFCR: 86, avgCSAT: 4.5 },
  { month: "May", avgFCR: 88, avgCSAT: 4.6 },
  { month: "Jun", avgFCR: 87, avgCSAT: 4.5 },
];

const categoryBreakdown = [
  { category: "Billing", calls: 450 },
  { category: "Technical", calls: 380 },
  { category: "Sales", calls: 290 },
  { category: "Complaints", calls: 180 },
  { category: "General", calls: 220 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ title, value, change, trend, icon: Icon, color }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden"
  >
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className={`flex items-center gap-1 mt-1 text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change}
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function AgentPerformance() {
  const { setShowModuleTabs } = useModule();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setShowModuleTabs(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => {
      setShowModuleTabs(true);
      clearTimeout(timer);
    };
  }, [setShowModuleTabs]);

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Agent Performance Summary
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Monitor and evaluate agent performance metrics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Agents"
            value="24"
            change="+2 this month"
            trend="up"
            icon={Users}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Avg FCR Rate"
            value="85%"
            change="+3.2%"
            trend="up"
            icon={Target}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Avg Handle Time"
            value="5:12"
            change="-0:30"
            trend="up"
            icon={Clock}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Avg CSAT"
            value="4.5"
            change="+0.3"
            trend="up"
            icon={Star}
            color="from-amber-500 to-amber-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trend */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgFCR" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Calls by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Agent Leaderboard */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-medium">Agent Leaderboard</CardTitle>
            </div>
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
                    <TableHead className="font-semibold w-16">Rank</TableHead>
                    <TableHead className="font-semibold">Agent</TableHead>
                    <TableHead className="font-semibold">Total Calls</TableHead>
                    <TableHead className="font-semibold">Avg Handle Time</TableHead>
                    <TableHead className="font-semibold">FCR</TableHead>
                    <TableHead className="font-semibold">CSAT</TableHead>
                    <TableHead className="font-semibold">Sentiment Score</TableHead>
                    <TableHead className="font-semibold">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAgents.map((agent, index) => (
                    <motion.tr
                      key={agent.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-border/30 hover:bg-muted/20 cursor-pointer"
                    >
                      <TableCell>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          agent.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                          agent.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                          agent.rank === 3 ? "bg-amber-600/20 text-amber-600" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {agent.rank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center font-semibold text-sm text-primary">
                            {agent.avatar}
                          </div>
                          <span className="font-medium">{agent.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{agent.totalCalls}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {agent.avgHandleTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={agent.fcr} className="w-16 h-2" />
                          <span className="text-sm">{agent.fcr}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {agent.csat}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={agent.sentiment} 
                            className="w-16 h-2"
                          />
                          <span className="text-sm">{agent.sentiment}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {agent.trend === "up" ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                            <TrendingUp className="h-3 w-3 mr-1" /> Up
                          </Badge>
                        ) : agent.trend === "down" ? (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                            <TrendingDown className="h-3 w-3 mr-1" /> Down
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted">Stable</Badge>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
