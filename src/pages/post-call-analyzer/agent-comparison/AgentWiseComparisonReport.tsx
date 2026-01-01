import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Filter, Calendar, PhoneOff, RefreshCw, AlertTriangle, Clock, Hourglass, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import PerformanceTrend from "./PerformanceTrend";

// Mock data for agent performance
const mockAgentData = [
  { agent_id: 1, agent_name: "John Smith", dropped_calls: 45, package_churn: 12.5, open_calls: 23, avg_silent_time: 8.3, avg_waiting_time: 15.2 },
  { agent_id: 2, agent_name: "Sarah Johnson", dropped_calls: 38, package_churn: 9.8, open_calls: 18, avg_silent_time: 6.5, avg_waiting_time: 12.8 },
  { agent_id: 3, agent_name: "Mike Davis", dropped_calls: 52, package_churn: 15.2, open_calls: 31, avg_silent_time: 10.1, avg_waiting_time: 18.5 },
  { agent_id: 4, agent_name: "Emily Wilson", dropped_calls: 29, package_churn: 7.3, open_calls: 15, avg_silent_time: 5.2, avg_waiting_time: 10.3 },
  { agent_id: 5, agent_name: "Chris Brown", dropped_calls: 41, package_churn: 11.2, open_calls: 20, avg_silent_time: 7.8, avg_waiting_time: 14.1 },
  { agent_id: 6, agent_name: "Lisa Anderson", dropped_calls: 35, package_churn: 8.9, open_calls: 17, avg_silent_time: 6.1, avg_waiting_time: 11.9 },
  { agent_id: 7, agent_name: "David Martinez", dropped_calls: 48, package_churn: 13.7, open_calls: 27, avg_silent_time: 9.2, avg_waiting_time: 16.8 },
  { agent_id: 8, agent_name: "Jennifer Lee", dropped_calls: 32, package_churn: 8.1, open_calls: 16, avg_silent_time: 5.8, avg_waiting_time: 11.2 },
];

const metrics = [
  { id: "dropped_calls", icon: PhoneOff, color: "#e53935", label: "Dropped Calls" },
  { id: "package_churn", icon: RefreshCw, color: "#43a047", label: "Package Churn" },
  { id: "open_calls", icon: AlertTriangle, color: "#fb8c00", label: "Open Calls" },
  { id: "avg_silent_time", icon: Clock, color: "#1e88e5", label: "Avg. Silence Time" },
  { id: "avg_waiting_time", icon: Hourglass, color: "#8e24aa", label: "Avg. Waiting Time" },
];

const CHART_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#f97316"];

export default function AgentWiseComparisonReport() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();
  const [loading, setLoading] = useState(false);
  const [panelOpenState, setPanelOpenState] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [selectedCallType, setSelectedCallType] = useState<string>("");
  const [selectedMetric, setSelectedMetric] = useState("dropped_calls");
  const [agentData, setAgentData] = useState(mockAgentData);
  const [showPerformanceTrend, setShowPerformanceTrend] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedAgentId, setSelectedAgentId] = useState<number>(0);

  useEffect(() => {
    setShowModuleTabs(true);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  useEffect(() => {
    let count = 0;
    if (selectedCallType) count++;
    setNumberOfFilters(count);
  }, [selectedCallType]);

  const toggleFilters = () => {
    setPanelOpenState(!panelOpenState);
  };

  const searchFilterData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleBarClick = (data: any) => {
    if (data && data.agent_name) {
      setSelectedAgent(data.agent_name);
      setSelectedAgentId(data.agent_id);
      setShowPerformanceTrend(true);
    }
  };

  const getChartData = () => {
    const metricKey = selectedMetric as keyof typeof mockAgentData[0];
    return [...agentData]
      .sort((a, b) => (b[metricKey] as number) - (a[metricKey] as number))
      .map(agent => ({
        ...agent,
        name: agent.agent_name,
        value: agent[metricKey]
      }));
  };

  const getMetricLabel = () => {
    const metric = metrics.find(m => m.id === selectedMetric);
    return metric?.label || selectedMetric;
  };

  const formatValue = (value: number) => {
    if (selectedMetric === "package_churn") {
      return `${value.toFixed(2)}%`;
    } else if (selectedMetric.includes("time")) {
      return `${value.toFixed(2)}s`;
    }
    return value.toString();
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
                  onClick={() => navigate("/post-call-analyzer/reports")}
                  className="h-9 w-9 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Agent-wise Comparison Report
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Compare performance metrics across agents
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
                          <SelectItem value="all">All Call Types</SelectItem>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
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

            {/* Metric Tabs */}
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <Button
                      key={metric.id}
                      variant={selectedMetric === metric.id ? "default" : "outline"}
                      onClick={() => {
                        setSelectedMetric(metric.id);
                        setShowPerformanceTrend(false);
                      }}
                      className="h-auto py-3 flex flex-col items-center gap-2"
                    >
                      <Icon className="h-5 w-5" style={{ color: selectedMetric === metric.id ? "currentColor" : metric.color }} />
                      <span className="text-xs text-center leading-tight">{metric.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Charts Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Chart */}
              <div className={showPerformanceTrend ? "lg:col-span-6" : "lg:col-span-12"}>
                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    {loading ? (
                      <div className="flex items-center justify-center h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis 
                              dataKey="name" 
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={12}
                              tickLine={false}
                            />
                            <YAxis 
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={12}
                              tickLine={false}
                              label={{
                                value: getMetricLabel(),
                                angle: -90,
                                position: "insideLeft",
                                style: { fontSize: 14, fontWeight: 600, fill: "hsl(var(--foreground))" },
                              }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              }}
                              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                              formatter={(value: number) => [formatValue(value), getMetricLabel()]}
                            />
                            <Bar 
                              dataKey="value" 
                              radius={[8, 8, 0, 0]}
                              onClick={handleBarClick}
                              cursor="pointer"
                            >
                              {getChartData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                        <p className="text-sm text-center text-muted-foreground mt-4">
                          Click on any bar to see agent details
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Performance Trend Panel */}
              <AnimatePresence>
                {showPerformanceTrend && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-6"
                  >
                    <Card className="border-border/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">{selectedAgent}</p>
                            <h3 className="text-lg font-semibold">Performance Trend</h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPerformanceTrend(false)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <PerformanceTrend
                          selectedAgent={selectedAgent}
                          selectedAgentId={selectedAgentId}
                          selectedMetric={selectedMetric}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
