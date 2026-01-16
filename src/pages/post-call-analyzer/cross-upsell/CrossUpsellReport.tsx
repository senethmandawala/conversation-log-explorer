import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  IconArrowLeft,
  IconDownload,
  IconFilter,
  IconSearch,
  IconCalendar,
  IconTrendingUp,
  IconTarget,
  IconAward,
  IconChevronDown,
  IconChevronUp,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight
} from "@tabler/icons-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AgentPerformance {
  id: string;
  agentName: string;
  effortScore: number;
  successRate: number;
  successful: number;
  failed: number;
  category: string;
}

interface AcceptedProduct {
  id: string;
  productName: string;
  acceptedCount: number;
  acceptanceRatio: number;
}

const mockAgentPerformance: AgentPerformance[] = [
  { id: "1", agentName: "John Smith", effortScore: 85, successRate: 72, successful: 45, failed: 18, category: "Premium" },
  { id: "2", agentName: "Sarah Johnson", effortScore: 92, successRate: 88, successful: 62, failed: 8, category: "Standard" },
  { id: "3", agentName: "Mike Wilson", effortScore: 78, successRate: 65, successful: 38, failed: 20, category: "Premium" },
  { id: "4", agentName: "Emily Davis", effortScore: 88, successRate: 79, successful: 51, failed: 14, category: "Basic" },
  { id: "5", agentName: "David Brown", effortScore: 95, successRate: 91, successful: 73, failed: 7, category: "Premium" },
  { id: "6", agentName: "Lisa Anderson", effortScore: 82, successRate: 68, successful: 42, failed: 20, category: "Standard" },
  { id: "7", agentName: "James Taylor", effortScore: 90, successRate: 84, successful: 58, failed: 11, category: "Premium" },
  { id: "8", agentName: "Jennifer Martinez", effortScore: 76, successRate: 62, successful: 35, failed: 22, category: "Basic" },
  { id: "9", agentName: "Robert Garcia", effortScore: 87, successRate: 75, successful: 48, failed: 16, category: "Standard" },
  { id: "10", agentName: "Amanda White", effortScore: 93, successRate: 89, successful: 67, failed: 8, category: "Premium" },
];

const mockAcceptedProducts: AcceptedProduct[] = [
  { id: "1", productName: "Premium Data Bundle", acceptedCount: 245, acceptanceRatio: 78 },
  { id: "2", productName: "Family Plan Upgrade", acceptedCount: 198, acceptanceRatio: 72 },
  { id: "3", productName: "International Roaming", acceptedCount: 156, acceptanceRatio: 65 },
  { id: "4", productName: "Device Insurance", acceptedCount: 142, acceptanceRatio: 58 },
  { id: "5", productName: "Streaming Bundle", acceptedCount: 134, acceptanceRatio: 55 },
  { id: "6", productName: "Cloud Storage Plus", acceptedCount: 118, acceptanceRatio: 52 },
  { id: "7", productName: "Smart Home Package", acceptedCount: 95, acceptanceRatio: 48 },
  { id: "8", productName: "Business Line Add-on", acceptedCount: 87, acceptanceRatio: 45 },
  { id: "9", productName: "VIP Support Tier", acceptedCount: 76, acceptanceRatio: 42 },
  { id: "10", productName: "Loyalty Rewards Program", acceptedCount: 68, acceptanceRatio: 38 },
];

export default function CrossUpsellReport() {
  const { setSelectedTab } = usePostCall();
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCallType, setSelectedCallType] = useState<string>("");

  const totalSuccessfulUpsells = mockAgentPerformance.reduce((sum, a) => sum + a.successful, 0);
  const averageSuccessRate = Math.round(mockAgentPerformance.reduce((sum, a) => sum + a.successRate, 0) / mockAgentPerformance.length);
  const totalOpportunities = mockAgentPerformance.reduce((sum, a) => sum + a.successful + a.failed, 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const activeFiltersCount = [selectedCallType].filter(Boolean).length;

  return (
    <>
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9"
                  onClick={() => setSelectedTab("reports")}
                >
                  <IconArrowLeft className="h-5 w-5" />
                </Button>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/20 flex items-center justify-center">
                  <IconTrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Cross/Up-Sell Analysis
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Track opportunities and conversion rates for cross-selling and up-selling
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <IconDownload className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button 
                  variant={filtersOpen ? "default" : "outline"} 
                  size="sm" 
                  className="gap-2 relative"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <IconFilter className="h-4 w-4" />
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
                        <IconCalendar className="h-4 w-4" />
                        Select dates
                      </Button>
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

                  <div className="flex justify-end mt-4 gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedCallType("");
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>

            {isLoading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full" />
                  ))}
                </div>
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <IconTrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-sm text-muted-foreground">Total Successful Upsells</span>
                    </div>
                    <p className="text-3xl font-bold text-green-500">{totalSuccessfulUpsells}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <IconAward className="h-5 w-5 text-blue-500" />
                      </div>
                      <span className="text-sm text-muted-foreground">Average Success Rate</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-500">{averageSuccessRate}%</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <IconTarget className="h-5 w-5 text-purple-500" />
                      </div>
                      <span className="text-sm text-muted-foreground">Total Opportunities</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-500">{totalOpportunities}</p>
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Top 10 Agent Performance</h3>
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableHead className="font-semibold">Agent</TableHead>
                          <TableHead className="font-semibold text-center">Effort Score</TableHead>
                          <TableHead className="font-semibold text-center">Success Rate</TableHead>
                          <TableHead className="font-semibold text-center">Successful</TableHead>
                          <TableHead className="font-semibold text-center">Failed</TableHead>
                          <TableHead className="font-semibold">Category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockAgentPerformance.map((agent, index) => (
                          <motion.tr
                            key={agent.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="border-b border-border/30 hover:bg-muted/20"
                          >
                            <TableCell className="font-medium">{agent.agentName}</TableCell>
                            <TableCell className="text-center">{agent.effortScore}%</TableCell>
                            <TableCell className="text-center">{agent.successRate}%</TableCell>
                            <TableCell className="text-center text-green-500 font-medium">{agent.successful}</TableCell>
                            <TableCell className="text-center text-red-500 font-medium">{agent.failed}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                                {agent.category}
                              </Badge>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Top 10 Accepted Products</h3>
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableHead className="font-semibold">Product Name</TableHead>
                          <TableHead className="font-semibold text-center">Accepted Count</TableHead>
                          <TableHead className="font-semibold text-center">Acceptance Ratio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockAcceptedProducts.map((product, index) => (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="border-b border-border/30 hover:bg-muted/20"
                          >
                            <TableCell className="font-medium">{product.productName}</TableCell>
                            <TableCell className="text-center text-green-500 font-medium">{product.acceptedCount}</TableCell>
                            <TableCell className="text-center">{product.acceptanceRatio}%</TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
