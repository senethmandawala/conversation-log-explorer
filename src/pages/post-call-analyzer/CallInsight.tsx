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
  Minus
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
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
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
                      <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Sentiments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Sentiments</SelectItem>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCalls.map((call, index) => (
                      <motion.tr
                        key={call.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/20 cursor-pointer transition-colors"
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
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredCalls.length} of {mockCalls.length} calls
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
