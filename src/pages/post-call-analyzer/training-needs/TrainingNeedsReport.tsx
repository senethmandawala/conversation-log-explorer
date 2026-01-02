import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Filter, 
  Calendar,
  AlertTriangle,
  GraduationCap,
  X,
  Search,
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
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock data
const mockTrainingAreasData = [
  { training_type: "Product Knowledge", count: 45 },
  { training_type: "Communication Skills", count: 38 },
  { training_type: "Technical Support", count: 32 },
  { training_type: "Problem Solving", count: 28 },
  { training_type: "Customer Service Excellence", count: 25 },
  { training_type: "Time Management", count: 22 },
  { training_type: "Conflict Resolution", count: 18 },
];

const mockAgentSkillsGap = [
  { 
    agent_name: "John Smith", 
    skills_gap: "Product Knowledge, Technical Support, Communication Skills" 
  },
  { 
    agent_name: "Sarah Johnson", 
    skills_gap: "Problem Solving, Time Management" 
  },
  { 
    agent_name: "Mike Davis", 
    skills_gap: "Customer Service Excellence, Conflict Resolution" 
  },
  { 
    agent_name: "Emily Wilson", 
    skills_gap: "Product Knowledge, Communication Skills" 
  },
  { 
    agent_name: "Chris Brown", 
    skills_gap: "Technical Support, Problem Solving, Time Management" 
  },
  { 
    agent_name: "Lisa Anderson", 
    skills_gap: "Product Knowledge, Customer Service Excellence" 
  },
  { 
    agent_name: "David Martinez", 
    skills_gap: "Communication Skills, Conflict Resolution" 
  },
];

const callTypes = [
  { value: "all", label: "All Call Types" },
  { value: "inbound", label: "Inbound" },
  { value: "outbound", label: "Outbound" },
];

// Compact stat card component matching PCA Dashboard design
interface CompactStatCardProps {
  color: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
}

const CompactStatCard = ({ color, icon, label, value, trend }: CompactStatCardProps) => {
  const colorConfig: Record<string, { gradient: string; iconBg: string; border: string; glow: string }> = {
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
  };

  const config = colorConfig[color] || colorConfig.purple;

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

export default function TrainingNeedsAnalysisReport() {
  const { setSelectedTab } = usePostCall();
  const [loading, setLoading] = useState(false);
  const [panelOpenState, setPanelOpenState] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  
  // Filter states
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");
  const [agentName, setAgentName] = useState("");
  const [selectedCallType, setSelectedCallType] = useState("");

  // Stats
  const [highPriorityAreas, setHighPriorityAreas] = useState(3);
  const [agentsRequiringTraining, setAgentsRequiringTraining] = useState(24);

  useEffect(() => {
    let count = 0;
    if (selectedDateRange) count++;
    if (agentName) count++;
    if (selectedCallType) count++;
    setNumberOfFilters(count);
  }, [selectedDateRange, agentName, selectedCallType]);

  const backToReports = () => {
    setSelectedTab("reports");
  };

  const toggleFilters = () => {
    setPanelOpenState(!panelOpenState);
  };

  const clearSelectedAgentName = () => {
    setAgentName("");
  };

  const clearSelectedCallType = () => {
    setSelectedCallType("");
  };

  const applyAgentName = (value: string) => {
    setAgentName(value);
  };

  const searchFilterData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
                    Training Needs Analysis
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Identify areas where agents require additional training and development
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Date Range Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Calendar className="h-4 w-4" />
                        Select dates
                      </Button>
                    </div>

                    {/* Agent Name Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Search Agent Name</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search agent..."
                          className="pl-9"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Call Type Filter */}
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

                    {/* Search Button */}
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
                  color="amber"
                  icon={<AlertTriangle className="h-5 w-5 text-white" />}
                  label="High Priority Training Areas"
                  value={highPriorityAreas.toString()}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CompactStatCard
                  color="purple"
                  icon={<GraduationCap className="h-5 w-5 text-white" />}
                  label="Agents Requiring Training"
                  value={agentsRequiringTraining.toString()}
                />
              </motion.div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Training Areas Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <h5 className="text-lg font-semibold mb-4">Training Areas</h5>
                  <div className="border border-border/50 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Training Type</TableHead>
                          <TableHead className="text-right">Count</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockTrainingAreasData.map((area, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{area.training_type}</TableCell>
                            <TableCell className="text-right">{area.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>

                {/* Agent Skills Gap Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h5 className="text-lg font-semibold mb-4">Agent Skills Gap</h5>
                  {mockAgentSkillsGap && mockAgentSkillsGap.length > 0 ? (
                    <div className="border border-border/50 rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Agent Name</TableHead>
                            <TableHead>Recommended Trainings</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockAgentSkillsGap.map((agent, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{agent.agent_name}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-2">
                                  {agent.skills_gap.split(", ").map((skill, skillIndex) => (
                                    <Badge
                                      key={skillIndex}
                                      variant="outline"
                                      className="bg-accent/50 text-accent-foreground border-accent"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No data available
                    </div>
                  )}
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
