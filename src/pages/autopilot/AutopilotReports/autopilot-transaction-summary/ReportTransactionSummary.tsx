import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, X, FileText, Loader2, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { DateRangeFilter } from "@/components/conversation/DateRangeFilter";
import { DateRangeValue } from "@/types/conversation";

interface TransactionData {
  id: string;
  date: string;
  time: string;
  customerId: string;
  customerName: string;
  transactionType: string;
  status: string;
  amount: string;
}

// Mock data
const mockTransactions: TransactionData[] = [
  { id: "1", date: "2024-01-15", time: "09:32:15", customerId: "CUST001", customerName: "John Smith", transactionType: "Balance Inquiry", status: "Completed", amount: "$0.00" },
  { id: "2", date: "2024-01-15", time: "10:15:42", customerId: "CUST002", customerName: "Jane Doe", transactionType: "Fund Transfer", status: "Completed", amount: "$500.00" },
  { id: "3", date: "2024-01-15", time: "11:05:33", customerId: "CUST003", customerName: "Robert Johnson", transactionType: "Bill Payment", status: "Pending", amount: "$125.50" },
  { id: "4", date: "2024-01-15", time: "12:22:18", customerId: "CUST004", customerName: "Emily Brown", transactionType: "Account Statement", status: "Completed", amount: "$0.00" },
  { id: "5", date: "2024-01-15", time: "14:45:55", customerId: "CUST005", customerName: "Michael Wilson", transactionType: "Fund Transfer", status: "Failed", amount: "$1,000.00" },
  { id: "6", date: "2024-01-16", time: "08:12:30", customerId: "CUST006", customerName: "Sarah Davis", transactionType: "Balance Inquiry", status: "Completed", amount: "$0.00" },
  { id: "7", date: "2024-01-16", time: "09:55:22", customerId: "CUST007", customerName: "David Martinez", transactionType: "Card Activation", status: "Completed", amount: "$0.00" },
  { id: "8", date: "2024-01-16", time: "11:30:45", customerId: "CUST008", customerName: "Lisa Anderson", transactionType: "Bill Payment", status: "Completed", amount: "$89.99" },
];

interface ReportTransactionSummaryProps {
  onBack: () => void;
}

export default function ReportTransactionSummary({ onBack }: ReportTransactionSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

  useEffect(() => {
    // Update filter count
    const filterCount = (dateRange ? 1 : 0) + (searchKeyword ? 1 : 0);
    setNumberOfFilters(filterCount);
  }, [dateRange, searchKeyword]);

  const [filteredData, setFilteredData] = useState<TransactionData[]>(mockTransactions);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = mockTransactions.filter(
        (item) =>
          item.customerId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.customerName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.transactionType.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredData(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setSearchKeyword("");
    setFilteredData(mockTransactions);
  };

  const totalTransactions = filteredData.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-10 w-10 rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Transaction Summary Report
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  View detailed transaction summaries and patterns across autopilot interactions
                </p>
              </div>
            </div>
            <Button
              variant={filtersOpen ? "default" : "outline"}
              size="icon"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="relative h-9 w-9"
            >
              <Filter className="h-4 w-4" />
              {numberOfFilters > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {numberOfFilters}
                </Badge>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-3 space-y-3">
          {/* Collapsible Filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="min-w-[200px]">
                  <DateRangeFilter
                    value={dateRange}
                    onChange={setDateRange}
                  />
                </div>
                <div className="w-[200px]">
                  <Input
                    placeholder="Search..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <Button onClick={handleSearch} className="gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                {searchKeyword && (
                  <Button variant="outline" onClick={handleClear} className="gap-2">
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Total Count */}
          <div className="text-sm text-muted-foreground mb-3">
            Total Transactions: <span className="font-semibold text-foreground">{totalTransactions}</span>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No matching data found</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div>{row.date}</div>
                        <div className="text-xs text-muted-foreground">{row.time}</div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{row.customerId}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>{row.transactionType}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row.status === "Completed"
                              ? "bg-green-500/20 text-green-600"
                              : row.status === "Pending"
                              ? "bg-amber-500/20 text-amber-600"
                              : "bg-red-500/20 text-red-600"
                          }`}
                        >
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell>{row.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
