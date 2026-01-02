import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Filter, Calendar, Users, AlertTriangle, Zap, Percent, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { cn } from "@/lib/utils";

// Mock data
const mockChurnData = [
  { id: "1", date: "2024-01-15", msisdn: "+1234567890", product: "Premium Plan", reason: "Poor Service Quality", agent: "John Smith", status: "Churned", actionTaken: "Follow-up call scheduled" },
  { id: "2", date: "2024-01-15", msisdn: "+1234567891", product: "Basic Plan", reason: "High Pricing", agent: "Sarah Johnson", status: "Retained", actionTaken: "Discount offered" },
  { id: "3", date: "2024-01-16", msisdn: "+1234567892", product: "Premium Plan", reason: "Technical Issues", agent: "Mike Wilson", status: "Churned", actionTaken: "Technical support provided" },
  { id: "4", date: "2024-01-16", msisdn: "+1234567893", product: "Standard Plan", reason: "Better Competitor Offer", agent: "Emily Davis", status: "At Risk", actionTaken: "Retention offer sent" },
  { id: "5", date: "2024-01-17", msisdn: "+1234567894", product: "Basic Plan", reason: "Poor Service Quality", agent: "John Smith", status: "Retained", actionTaken: "Service upgrade" },
  { id: "6", date: "2024-01-17", msisdn: "+1234567895", product: "Premium Plan", reason: "High Pricing", agent: "Sarah Johnson", status: "Churned", actionTaken: "None" },
  { id: "7", date: "2024-01-18", msisdn: "+1234567896", product: "Standard Plan", reason: "Technical Issues", agent: "Mike Wilson", status: "Retained", actionTaken: "Technical resolution" },
  { id: "8", date: "2024-01-18", msisdn: "+1234567897", product: "Premium Plan", reason: "Poor Service Quality", agent: "Emily Davis", status: "At Risk", actionTaken: "Manager callback" },
];

interface CompactStatCardProps {
  color: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}

const CompactStatCard = ({ color, icon, label, value }: CompactStatCardProps) => {
  const colorConfig: Record<string, { gradient: string; iconBg: string; border: string; glow: string }> = {
    blue: {
      gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30",
      border: "border-blue-500/20",
      glow: "shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]",
    },
    red: {
      gradient: "from-red-500/10 via-red-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30",
      border: "border-red-500/20",
      glow: "shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]",
    },
    green: {
      gradient: "from-green-500/10 via-green-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/30",
      border: "border-green-500/20",
      glow: "shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]",
    },
    purple: {
      gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30",
      border: "border-purple-500/20",
      glow: "shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]",
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <Card className={`relative overflow-hidden bg-card/80 backdrop-blur-xl border ${config.border} ${config.glow} hover:scale-[1.02] transition-all duration-300 h-full`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient}`} />
      <div className="relative p-4">
        <div className="flex items-start gap-4">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${config.iconBg} shadow-lg shrink-0`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="text-xs font-medium text-muted-foreground mb-1 line-clamp-2">{label}</p>
            <p className="text-2xl font-bold text-foreground tracking-tight leading-none">{value}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function ChurnAnalysisReport() {
  const { setSelectedTab } = usePostCall();
  const [loading, setLoading] = useState(false);
  const [panelOpenState, setPanelOpenState] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [selectedCallType, setSelectedCallType] = useState<string>("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [data, setData] = useState(mockChurnData);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let count = 0;
    if (selectedCallType) count++;
    if (selectedAgents.length > 0) count++;
    if (selectedReasons.length > 0) count++;
    if (selectedProducts.length > 0) count++;
    setNumberOfFilters(count);
  }, [selectedCallType, selectedAgents, selectedReasons, selectedProducts]);

  const toggleFilters = () => {
    setPanelOpenState(!panelOpenState);
  };

  const searchFilterData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "churned":
        return "bg-red-500/10 text-red-600 border-red-500/30";
      case "retained":
        return "bg-green-500/10 text-green-600 border-green-500/30";
      case "at risk":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/30";
    }
  };

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                  onClick={() => setSelectedTab("reports")}
                  className="h-9 w-9 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Churn Analysis Report
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Analyze customer churn patterns and retention effectiveness
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
                          placeholder="Search agents..."
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Reason</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Reasons" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Reasons</SelectItem>
                          <SelectItem value="service">Poor Service Quality</SelectItem>
                          <SelectItem value="pricing">High Pricing</SelectItem>
                          <SelectItem value="technical">Technical Issues</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Products</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Products" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          <SelectItem value="premium">Premium Plan</SelectItem>
                          <SelectItem value="standard">Standard Plan</SelectItem>
                          <SelectItem value="basic">Basic Plan</SelectItem>
                        </SelectContent>
                      </Select>
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

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <CompactStatCard
                  color="blue"
                  icon={<Users className="h-5 w-5 text-white" />}
                  label="Total Churn Predictions"
                  value="156"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <CompactStatCard
                  color="red"
                  icon={<AlertTriangle className="h-5 w-5 text-white" />}
                  label="Churned"
                  value="45"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <CompactStatCard
                  color="green"
                  icon={<Zap className="h-5 w-5 text-white" />}
                  label="Successfully Retained"
                  value="89"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <CompactStatCard
                  color="purple"
                  icon={<Percent className="h-5 w-5 text-white" />}
                  label="Retention Rate"
                  value="66.4%"
                />
              </motion.div>
            </div>

            {/* Churn Records Table */}
            <div className="mt-6">
              <h5 className="text-lg font-semibold mb-4">Churn Records</h5>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div className="border border-border/50 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>MSISDN</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Agent</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action Taken</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((record, index) => (
                          <motion.tr
                            key={record.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="border-b border-border/30 hover:bg-muted/20"
                          >
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.msisdn}</TableCell>
                            <TableCell>{record.product}</TableCell>
                            <TableCell>{record.reason}</TableCell>
                            <TableCell>{record.agent}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.actionTaken}</TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between mt-4 pt-4 border-t border-border/30"
                    >
                      <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{paginatedData.length}</span> of{" "}
                        <span className="font-medium text-foreground">{data.length}</span> results
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
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
