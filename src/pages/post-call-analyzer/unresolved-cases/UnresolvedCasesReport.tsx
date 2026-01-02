import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Filter, 
  Calendar,
  AlertTriangle,
  PhoneOff,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { usePostCall } from "@/contexts/PostCallContext";
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
} from "@/components/ui/collapsible";

// Mock data
const mockAgentWiseData = [
  { agent: "John Smith", category: "Technical Support", total_calls: 145, total_unresolved_calls: 23, unresolved_rate: "15.9%", total_repeat_calls: 12 },
  { agent: "Sarah Johnson", category: "Billing Issues", total_calls: 132, total_unresolved_calls: 28, unresolved_rate: "21.2%", total_repeat_calls: 15 },
  { agent: "Mike Davis", category: "Account Management", total_calls: 98, total_unresolved_calls: 18, unresolved_rate: "18.4%", total_repeat_calls: 9 },
  { agent: "Emily Wilson", category: "Product Inquiry", total_calls: 87, total_unresolved_calls: 15, unresolved_rate: "17.2%", total_repeat_calls: 8 },
  { agent: "Chris Brown", category: "Service Complaint", total_calls: 76, total_unresolved_calls: 22, unresolved_rate: "28.9%", total_repeat_calls: 14 },
];

const mockCategoryWiseData = [
  { category: "Technical Support", total_calls: 245, total_unresolved_calls: 52, total_repeat_calls: 28 },
  { category: "Billing Issues", total_calls: 198, total_unresolved_calls: 45, total_repeat_calls: 24 },
  { category: "Account Management", total_calls: 156, total_unresolved_calls: 38, total_repeat_calls: 19 },
  { category: "Product Inquiry", total_calls: 134, total_unresolved_calls: 28, total_repeat_calls: 15 },
  { category: "Service Complaint", total_calls: 112, total_unresolved_calls: 35, total_repeat_calls: 18 },
];

const callTypes = [
  { value: "all", label: "All Call Types" },
  { value: "inbound", label: "Inbound" },
  { value: "outbound", label: "Outbound" },
];

// Compact stat card component
interface CompactStatCardProps {
  color: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
}

const CompactStatCard = ({ color, icon, label, value, trend }: CompactStatCardProps) => {
  const colorConfig: Record<string, { gradient: string; iconBg: string; border: string; glow: string }> = {
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
  };

  const config = colorConfig[color] || colorConfig.red;

  return (
    <Card className={`relative overflow-hidden bg-card/80 backdrop-blur-xl border ${config.border} ${config.glow} hover:scale-[1.02] transition-all duration-300`}>
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

export default function UnresolvedCasesReport() {
  const { setSelectedTab } = usePostCall();
  const [loading, setLoading] = useState(false);
  const [panelOpenState, setPanelOpenState] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");
  const [selectedCallType, setSelectedCallType] = useState("");

  const [totalUnresolvedCalls, setTotalUnresolvedCalls] = useState(198);
  const [totalRepeatCalls, setTotalRepeatCalls] = useState(104);

  useEffect(() => {
    let count = 0;
    if (selectedDateRange) count++;
    if (selectedCallType) count++;
    setNumberOfFilters(count);
  }, [selectedDateRange, selectedCallType]);

  const backToReports = () => {
    setSelectedTab("reports");
  };

  const toggleFilters = () => {
    setPanelOpenState(!panelOpenState);
  };

  const searchFilterData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getColorForRate = (rate: string) => {
    const numRate = parseFloat(rate.replace('%', ''));
    if (numRate >= 25) return "destructive";
    if (numRate >= 15) return "default";
    return "secondary";
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={backToReports}
                  className="h-9 w-9 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Unresolved Cases Analysis
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monitor and analyze calls requiring escalation or remaining unresolved
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={panelOpenState ? "default" : "outline"}
                  size="icon"
                  onClick={toggleFilters}
                  className="relative h-9 w-9"
                >
                  <Filter className="h-4 w-4" />
                  {numberOfFilters > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                      {numberOfFilters}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Filters Section */}
            <Collapsible open={panelOpenState} onOpenChange={setPanelOpenState}>
              <CollapsibleContent>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: panelOpenState ? 1 : 0, 
                    height: panelOpenState ? "auto" : 0 
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-6 p-4 border border-border/50 rounded-lg bg-muted/30"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Calendar className="h-4 w-4" />
                        Select dates
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Call Type</label>
                      <Select value={selectedCallType} onValueChange={setSelectedCallType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Call Types" />
                        </SelectTrigger>
                        <SelectContent>
                          {callTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        onClick={searchFilterData}
                        className="w-full rounded-full"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CompactStatCard
                  color="red"
                  icon={<AlertTriangle className="h-5 w-5 text-white" />}
                  label="Total Unresolved Calls"
                  value={totalUnresolvedCalls.toString()}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CompactStatCard
                  color="amber"
                  icon={<PhoneOff className="h-5 w-5 text-white" />}
                  label="Repeat Calls"
                  value={totalRepeatCalls.toString()}
                />
              </motion.div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Agent-wise Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <h5 className="text-lg font-semibold mb-4">Agent-wise Unresolved Cases</h5>
                  <div className="border border-border/50 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Agent</TableHead>
                          <TableHead className="text-center">Category</TableHead>
                          <TableHead className="text-center">Total Calls</TableHead>
                          <TableHead className="text-center">Unresolved Calls</TableHead>
                          <TableHead className="text-center">Unresolved Rate</TableHead>
                          <TableHead className="text-center">Repeat Calls</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockAgentWiseData.map((agent, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{agent.agent}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                                {agent.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{agent.total_calls}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                                {agent.total_unresolved_calls}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={getColorForRate(agent.unresolved_rate)}>
                                {agent.unresolved_rate}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                                {agent.total_repeat_calls}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>

                {/* Category-wise Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h5 className="text-lg font-semibold mb-4">Category-wise Unresolved Cases</h5>
                  <div className="border border-border/50 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-center">Total Calls</TableHead>
                          <TableHead className="text-center">Unresolved Calls</TableHead>
                          <TableHead className="text-center">Repeat Calls</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockCategoryWiseData.map((category, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                                {category.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{category.total_calls}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                                {category.total_unresolved_calls}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                                {category.total_repeat_calls}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
