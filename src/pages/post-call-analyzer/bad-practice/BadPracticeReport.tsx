import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Download,
  Filter,
  Search,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion, AnimatePresence } from "framer-motion";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import AgentCallLogs from "./AgentCallLogs";
import ViolationWiseAnalysis from "./ViolationWiseAnalysis";

interface ViolationBreakdown {
  type: string;
  count: number;
  percentage: number;
  isSubType?: boolean;
  suggestions?: { text: string }[];
}

interface BadPracticeRecord {
  id: string;
  agent: string;
  agentId: string;
  totalCalls: number;
  violationType: string;
  totalViolations: number;
  score: string;
  scoreValue: number;
  expanded?: boolean;
  violationBreakdown: ViolationBreakdown[];
}

const mockBadPracticeData: BadPracticeRecord[] = [
  {
    id: "1",
    agent: "John Smith",
    agentId: "agent-1",
    totalCalls: 145,
    violationType: "Script Deviation",
    totalViolations: 23,
    score: "72%",
    scoreValue: 72,
    violationBreakdown: [
      { type: "Script Deviation", count: 12, percentage: 52, suggestions: [{ text: "Follow the approved script structure for better compliance" }] },
      { type: "Greeting Issues", count: 5, percentage: 22, isSubType: true },
      { type: "Closing Issues", count: 7, percentage: 30, isSubType: true },
      { type: "Hold Time Exceeded", count: 8, percentage: 35, suggestions: [{ text: "Reduce hold times by having resources readily available" }] },
      { type: "Tone Issues", count: 3, percentage: 13, suggestions: [{ text: "Maintain professional and empathetic tone throughout calls" }] },
    ],
  },
  {
    id: "2",
    agent: "Sarah Johnson",
    agentId: "agent-2",
    totalCalls: 198,
    violationType: "Hold Time Exceeded",
    totalViolations: 15,
    score: "45%",
    scoreValue: 45,
    violationBreakdown: [
      { type: "Hold Time Exceeded", count: 10, percentage: 67, suggestions: [{ text: "Prepare resources before placing customer on hold" }] },
      { type: "Script Deviation", count: 5, percentage: 33, suggestions: [{ text: "Review script guidelines regularly" }] },
    ],
  },
  {
    id: "3",
    agent: "Mike Wilson",
    agentId: "agent-3",
    totalCalls: 167,
    violationType: "Tone Issues",
    totalViolations: 28,
    score: "78%",
    scoreValue: 78,
    violationBreakdown: [
      { type: "Tone Issues", count: 15, percentage: 54, suggestions: [{ text: "Practice active listening and empathy techniques" }] },
      { type: "Interruptions", count: 8, percentage: 29, isSubType: true },
      { type: "Rushed Speech", count: 7, percentage: 25, isSubType: true },
      { type: "Script Deviation", count: 13, percentage: 46, suggestions: [{ text: "Balance personalization with script adherence" }] },
    ],
  },
  {
    id: "4",
    agent: "Emily Davis",
    agentId: "agent-4",
    totalCalls: 134,
    violationType: "Compliance Issues",
    totalViolations: 12,
    score: "38%",
    scoreValue: 38,
    violationBreakdown: [
      { type: "Compliance Issues", count: 8, percentage: 67, suggestions: [{ text: "Complete mandatory compliance training refresher" }] },
      { type: "Missing Disclosures", count: 5, percentage: 42, isSubType: true },
      { type: "Verification Skipped", count: 3, percentage: 25, isSubType: true },
      { type: "Hold Time Exceeded", count: 4, percentage: 33, suggestions: [{ text: "Improve knowledge base navigation skills" }] },
    ],
  },
  {
    id: "5",
    agent: "David Brown",
    agentId: "agent-5",
    totalCalls: 212,
    violationType: "Script Deviation",
    totalViolations: 31,
    score: "82%",
    scoreValue: 82,
    violationBreakdown: [
      { type: "Script Deviation", count: 18, percentage: 58, suggestions: [{ text: "Focus on key script elements while maintaining natural flow" }] },
      { type: "Tone Issues", count: 8, percentage: 26, suggestions: [{ text: "Monitor voice modulation during peak hours" }] },
      { type: "Hold Time Exceeded", count: 5, percentage: 16, suggestions: [{ text: "Use quick reference guides for common issues" }] },
    ],
  },
];

export default function BadPracticeReport() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCallType, setSelectedCallType] = useState<string>("");
  const [agentName, setAgentName] = useState<string>("");
  const [data, setData] = useState<BadPracticeRecord[]>(mockBadPracticeData);
  
  // Call logs view state
  const [showAgentCallLogs, setShowAgentCallLogs] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<{ name: string; id: string } | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setShowModuleTabs(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => {
      setShowModuleTabs(true);
      clearTimeout(timer);
    };
  }, [setShowModuleTabs]);

  const toggleRowExpand = (id: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 70) return "bg-red-500/10 text-red-500 border-red-500/30";
    if (scoreValue >= 50) return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    return "bg-green-500/10 text-green-500 border-green-500/30";
  };

  const activeFiltersCount = [selectedCallType, agentName].filter(Boolean).length;

  const handleViewCallLogs = (agent: string, agentId: string) => {
    setSelectedAgent({ name: agent, id: agentId });
    setShowAgentCallLogs(true);
  };

  const handleBackToReport = () => {
    setShowAgentCallLogs(false);
    setSelectedAgent(null);
  };

  // Show call logs view if selected
  if (showAgentCallLogs && selectedAgent) {
    return (
      <>
        <div className="p-6">
          <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <AgentCallLogs
                agentName={selectedAgent.name}
                agentId={selectedAgent.id}
                onBack={handleBackToReport}
              />
            </CardContent>
          </Card>
        </div>
        <AIHelper />
      </>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9"
                  onClick={() => navigate("/post-call-analyzer/reports")}
                >
                  <ArrowLeft className="h-9 w-9 shrink-0" />
                </Button>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/5 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Bad Practice Analysis
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Identify and analyze agent behaviors that deviate from best practices
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
          <CardContent className="pt-6">
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <CollapsibleContent>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Calendar className="h-4 w-4" />
                        Select dates
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Agent Name</label>
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

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Call Type</label>
                      <Select value={selectedCallType} onValueChange={(value) => setSelectedCallType(value === "all" ? "" : value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Call Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Call Types</SelectItem>
                          <SelectItem value="inbound">Inbound</SelectItem>
                          <SelectItem value="outbound">Outbound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button className="w-full">Search</Button>
                    </div>
                  </div>

                  {/* <div className="flex justify-end mt-4 gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedCallType("");
                        setAgentName("");
                      }}
                    >
                      Clear All
                    </Button>
                  </div> */}
                </motion.div>
              </CollapsibleContent>
            </Collapsible>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Agent Wise Analysis</h3>
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableHead className="font-semibold">Agent</TableHead>
                          <TableHead className="font-semibold text-center">Total Calls</TableHead>
                          <TableHead className="font-semibold">Most Violation Type</TableHead>
                          <TableHead className="font-semibold text-center">Total Violations</TableHead>
                          <TableHead className="font-semibold text-center">Bad Practice Score</TableHead>
                          <TableHead className="font-semibold text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((record, index) => (
                          <>
                            <motion.tr
                              key={record.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className={cn(
                                "border-b border-border/30 hover:bg-muted/20",
                                record.expanded && "bg-muted/10"
                              )}
                            >
                              <TableCell className="font-medium">{record.agent}</TableCell>
                              <TableCell className="text-center">{record.totalCalls}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
                                  {record.violationType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">{record.totalViolations}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className={getScoreColor(record.scoreValue)}>
                                  {record.score}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => toggleRowExpand(record.id)}
                                  >
                                    {record.expanded ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleViewCallLogs(record.agent, record.agentId)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                            
                            <AnimatePresence>
                              {record.expanded && (
                                <motion.tr
                                  key={`${record.id}-expanded`}
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                >
                                  <TableCell colSpan={6} className="p-0">
                                    <div className="p-4 bg-muted/20 border-t border-border/30">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                          <div className="flex items-center gap-2 mb-4">
                                            <BarChart3 className="h-4 w-4 text-amber-500" />
                                            <h4 className="font-semibold text-sm">Violation Breakdown</h4>
                                          </div>
                                          <div className="space-y-3">
                                            {record.violationBreakdown.map((violation, vIndex) => (
                                              <div key={vIndex} className={cn(violation.isSubType && "ml-4")}>
                                                <div className="flex justify-between items-center mb-1">
                                                  <span className={cn(
                                                    "text-sm",
                                                    violation.isSubType ? "text-muted-foreground" : "font-medium"
                                                  )}>
                                                    {violation.isSubType ? `└ ${violation.type}` : violation.type}
                                                  </span>
                                                  <span className={cn(
                                                    "text-sm",
                                                    violation.isSubType && "text-muted-foreground"
                                                  )}>
                                                    {violation.count} ({violation.percentage}%)
                                                  </span>
                                                </div>
                                                <Progress 
                                                  value={violation.percentage} 
                                                  className={cn(
                                                    violation.isSubType ? "h-1" : "h-1.5"
                                                  )}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        <div>
                                          <div className="flex items-center gap-2 mb-4">
                                            <Lightbulb className="h-4 w-4 text-primary" />
                                            <h4 className="font-semibold text-sm">Agent Recommendations</h4>
                                          </div>
                                          <div className="space-y-2">
                                            {record.violationBreakdown
                                              .filter(v => v.suggestions && v.suggestions.length > 0)
                                              .flatMap(v => v.suggestions || [])
                                              .map((suggestion, sIndex) => (
                                                <div key={sIndex} className="flex gap-2 text-sm">
                                                  <span className="text-muted-foreground">•</span>
                                                  <span>{suggestion.text}</span>
                                                </div>
                                              ))
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between mt-4 pt-4 border-t border-border/30"
                  >
                    <p className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">{paginatedData.length}</span> of{" "}
                      <span className="font-medium text-foreground">{totalRecords}</span> results
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0 rounded-lg"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0 rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-1 mx-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className={cn(
                                "h-9 w-9 p-0 rounded-lg transition-all duration-200",
                                currentPage === pageNum && "shadow-md"
                              )}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="h-9 w-9 p-0 rounded-lg"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="h-9 w-9 p-0 rounded-lg"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                </div>

                {/* Violation-wise Analysis Section */}
                <ViolationWiseAnalysis />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
