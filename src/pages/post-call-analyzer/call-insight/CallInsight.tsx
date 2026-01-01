import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  PhoneCall, 
  Download, 
  Filter, 
  Search, 
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { cn } from "@/lib/utils";
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

interface CallRecord {
  id: string;
  msisdn: string;
  agentName: string;
  category: string;
  sentiment: "positive" | "negative" | "neutral";
  duration: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
}

const mockCalls: CallRecord[] = [
  { id: "1", msisdn: "+1234567890", agentName: "John Smith", category: "Billing", sentiment: "positive", duration: "5:23", date: "2024-01-15", time: "09:30", status: "completed" },
  { id: "2", msisdn: "+1234567891", agentName: "Sarah Johnson", category: "Technical Support", sentiment: "negative", duration: "12:45", date: "2024-01-15", time: "10:15", status: "completed" },
  { id: "3", msisdn: "+1234567892", agentName: "Mike Wilson", category: "Sales", sentiment: "neutral", duration: "8:10", date: "2024-01-15", time: "11:00", status: "completed" },
  { id: "4", msisdn: "+1234567893", agentName: "Emily Davis", category: "Complaints", sentiment: "negative", duration: "15:30", date: "2024-01-15", time: "11:45", status: "pending" },
  { id: "5", msisdn: "+1234567894", agentName: "John Smith", category: "General Inquiry", sentiment: "positive", duration: "3:15", date: "2024-01-15", time: "12:30", status: "completed" },
  { id: "6", msisdn: "+1234567895", agentName: "Sarah Johnson", category: "Billing", sentiment: "neutral", duration: "6:45", date: "2024-01-15", time: "14:00", status: "completed" },
  { id: "7", msisdn: "+1234567896", agentName: "Mike Wilson", category: "Technical Support", sentiment: "positive", duration: "9:20", date: "2024-01-15", time: "14:45", status: "failed" },
  { id: "8", msisdn: "+1234567897", agentName: "Emily Davis", category: "Sales", sentiment: "positive", duration: "7:00", date: "2024-01-15", time: "15:30", status: "completed" },
];

const SentimentIcon = ({ sentiment }: { sentiment: CallRecord["sentiment"] }) => {
  switch (sentiment) {
    case "positive":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "negative":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-yellow-500" />;
  }
};

export default function CallInsight() {
  const { setShowModuleTabs } = useModule();
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("");
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setShowModuleTabs(true);
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => {
      setShowModuleTabs(true);
      clearTimeout(timer);
    };
  }, [setShowModuleTabs]);

  const filteredCalls = mockCalls.filter(call => {
    const matchesSearch = call.msisdn.includes(searchQuery) || 
                         call.agentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || call.category === selectedCategory;
    const matchesSentiment = !selectedSentiment || call.sentiment === selectedSentiment;
    return matchesSearch && matchesCategory && matchesSentiment;
  });

  const activeFiltersCount = [selectedCategory, selectedSentiment].filter(Boolean).length;

  // Pagination
  const totalRecords = filteredCalls.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const paginatedCalls = filteredCalls.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                  <PhoneCall className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Call Insights
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Analyze and explore individual call recordings and transcripts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
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
          <CardContent className="pt-4">
            {/* Filters Panel */}
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <CollapsibleContent>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-muted/30 rounded-lg border border-border/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Search MSISDN / Agent</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search..." 
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Category</label>
                      <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Billing">Billing</SelectItem>
                          <SelectItem value="Technical Support">Technical Support</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Complaints">Complaints</SelectItem>
                          <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sentiment Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Sentiment</label>
                      <Select value={selectedSentiment} onValueChange={(value) => setSelectedSentiment(value === "all" ? "" : value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Sentiments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sentiments</SelectItem>
                          <SelectItem value="positive">Positive</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="negative">Negative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Range - Placeholder */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Calendar className="h-4 w-4" />
                        Select dates
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                        setSelectedSentiment("");
                      }}
                    >
                      Clear All
                    </Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>

            {/* Data Table */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">MSISDN</TableHead>
                      <TableHead className="font-semibold">Agent</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Sentiment</TableHead>
                      <TableHead className="font-semibold">Duration</TableHead>
                      <TableHead className="font-semibold">Date & Time</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCalls.map((call, index) => (
                      <motion.tr
                        key={call.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className={cn(
                          "group border-b border-border/30 transition-all duration-200",
                          "hover:bg-primary/[0.03] hover:shadow-[inset_3px_0_0_0_hsl(var(--primary))]"
                        )}
                      >
                        <TableCell className="font-mono text-sm">{call.msisdn}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            {call.agentName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {call.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <SentimentIcon sentiment={call.sentiment} />
                            <span className="capitalize">{call.sentiment}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {call.duration}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {call.date} {call.time}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              call.status === "completed" ? "default" : 
                              call.status === "pending" ? "secondary" : "destructive"
                            }
                            className="capitalize"
                          >
                            {call.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-9 w-9 rounded-lg transition-all duration-200",
                                "opacity-0 group-hover:opacity-100",
                                "hover:bg-primary hover:text-primary-foreground",
                                "shadow-none hover:shadow-md"
                              )}
                              onClick={() => setSelectedCall(call)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mt-4 pt-4 border-t border-border/30"
            >
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{paginatedCalls.length}</span> of{" "}
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
          </CardContent>
        </Card>
      </div>

      {/* Call Log Details Sheet */}
      <CallLogDetails
        callLog={selectedCall ? {
          id: selectedCall.id,
          date: selectedCall.date,
          time: selectedCall.time,
          msisdn: selectedCall.msisdn,
          agent: selectedCall.agentName,
          callDuration: selectedCall.duration,
          category: selectedCall.category,
          subCategory: "General",
          userSentiment: selectedCall.sentiment,
          agentSentiment: "positive",
          summary: "Customer called regarding " + selectedCall.category.toLowerCase() + " inquiry. Agent " + selectedCall.agentName + " handled the call professionally and addressed all customer concerns.",
          transcription: [
            { speaker: "Agent", text: "Thank you for calling. How may I assist you today?", timestamp: "00:00" },
            { speaker: "Customer", text: "Hi, I need help with my account.", timestamp: "00:05" },
            { speaker: "Agent", text: "I'd be happy to help you with that. Can you please provide your account details?", timestamp: "00:10" },
            { speaker: "Customer", text: "Sure, let me give you that information.", timestamp: "00:18" },
            { speaker: "Agent", text: "Thank you. I can see your account now. How can I assist you further?", timestamp: "00:25" },
          ],
        } : null}
        open={!!selectedCall}
        onClose={() => setSelectedCall(null)}
      />

      <AIHelper />
    </>
  );
}
