import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  BarChart3,
  Search,
  X,
  Calendar,
  ChevronDown,
  Eye
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

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

interface PerformingAgent {
  name: string;
  score: number;
}

const topPerformingAgents: PerformingAgent[] = [
  { name: "John Smith", score: 9.2 },
  { name: "Sarah Johnson", score: 8.8 },
  { name: "Mike Wilson", score: 8.5 },
  { name: "David Brown", score: 8.2 },
];

const agentsNeedAttention: PerformingAgent[] = [
  { name: "Emily Davis", score: 6.5 },
  { name: "Robert Taylor", score: 6.2 },
  { name: "Lisa Anderson", score: 5.8 },
  { name: "James Martinez", score: 5.5 },
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

const groups = ["Sales Team", "Support Team", "Technical Team", "Billing Team"];
const categories = ["Billing", "Technical Support", "Sales", "Complaints", "General Inquiry"];
const caseStates = ["Open", "Closed", "Pending", "Escalated"];
const callTypes = ["Inbound", "Outbound"];
const sentiments = ["Positive", "Neutral", "Negative"];

export default function AgentPerformance() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filter states
  const [agentName, setAgentName] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCaseState, setSelectedCaseState] = useState("");
  const [selectedCallType, setSelectedCallType] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    setShowModuleTabs(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => {
      setShowModuleTabs(true);
      clearTimeout(timer);
    };
  }, [setShowModuleTabs]);

  const activeFiltersCount = [
    agentName,
    selectedGroups.length > 0,
    selectedCategory,
    selectedCaseState,
    selectedCallType,
    selectedSentiment,
    dateRange?.from,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setAgentName("");
    setSelectedGroups([]);
    setSelectedCategory("");
    setSelectedCaseState("");
    setSelectedCallType("");
    setSelectedSentiment("");
    setDateRange(undefined);
  };

  const handleSearch = () => {
    // Implement search logic here
    console.log("Searching with filters:", {
      agentName,
      selectedGroups,
      selectedCategory,
      selectedCaseState,
      selectedCallType,
      selectedSentiment,
      dateRange,
    });
  };

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
                <Button 
                  variant={filtersOpen ? "default" : "outline"} 
                  size="sm" 
                  className="gap-2 relative"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Filters Panel */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border-t border-border/30 bg-muted/20"
              >
                <div className="flex flex-wrap items-center gap-4">
                  {/* Agent Name */}
                  <div className="relative">
                    <Input
                      placeholder="Agent Name"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      className="h-10 w-44 pr-8"
                    />
                    {agentName && (
                      <button
                        onClick={() => setAgentName("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Group */}
                  <Select value={selectedGroups[0] || ""} onValueChange={(val) => setSelectedGroups(val ? [val] : [])}>
                    <SelectTrigger className="h-10 w-40">
                      <SelectValue placeholder="Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Category */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-10 w-44">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Case Status */}
                  <Select value={selectedCaseState} onValueChange={setSelectedCaseState}>
                    <SelectTrigger className="h-10 w-40">
                      <SelectValue placeholder="Case Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {caseStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Call Type */}
                  <Select value={selectedCallType} onValueChange={setSelectedCallType}>
                    <SelectTrigger className="h-10 w-36">
                      <SelectValue placeholder="Call Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {callTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* User Sentiment */}
                  <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                    <SelectTrigger className="h-10 w-40">
                      <SelectValue placeholder="Sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                      {sentiments.map((sentiment) => (
                        <SelectItem key={sentiment} value={sentiment}>{sentiment}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Date Range */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-10 w-48 justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <span className="truncate">
                              {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                            </span>
                          ) : (
                            format(dateRange.from, "MMM d, yyyy")
                          )
                        ) : (
                          <span className="text-muted-foreground">Date Range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Search & Clear Buttons */}
                  <Button className="h-10" onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-1" />
                    Search
                  </Button>
                  {activeFiltersCount > 0 && (
                    <Button variant="outline" className="h-10" onClick={clearAllFilters}>
                      Clear
                    </Button>
                  )}
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
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

        {/* Agent Performance Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best Performing Agents */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-col">
                <CardTitle className="text-base font-medium">Best Performing Agents</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Top agents based on overall performance score
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[120px] w-full" />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                  {topPerformingAgents.map((agent, index) => (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold truncate mr-2">{agent.name}</span>
                        <span className="font-bold text-sm text-green-500" title="Agent Performance">
                          {agent.score * 10}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agents Requiring Attention */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-col">
                <CardTitle className="text-base font-medium">Agents Requiring Attention</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Agents who may need additional support or training
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[120px] w-full" />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                  {agentsNeedAttention.map((agent, index) => (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold truncate mr-2">{agent.name}</span>
                        <span className="font-bold text-sm text-amber-500" title="Agent Performance">
                          {agent.score * 10}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
                    <TableHead className="font-semibold w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAgents.map((agent, index) => (
                    <motion.tr
                      key={agent.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group border-b border-border/30 hover:bg-muted/20 cursor-pointer"
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
                      <TableCell className="text-right">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground shadow-none hover:shadow-md"
                            onClick={() => navigate(`/post-call-analyzer/agent-performance/${agent.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </motion.div>
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
