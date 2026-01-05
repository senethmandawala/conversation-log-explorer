import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileBarChart, Search, RotateCcw, Filter } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { DateRangeFilter } from "@/components/conversation/DateRangeFilter";
import { DateRangeValue } from "@/types/conversation";

interface DocumentAccessData {
  id: string;
  documentName: string;
  accessCount: number;
  lastAccessed: string;
  category: string;
}

// Mock data
const mockDocumentData: DocumentAccessData[] = [
  { id: "1", documentName: "Account Opening Procedures", accessCount: 1245, lastAccessed: "2024-01-15 14:32:00", category: "Accounts" },
  { id: "2", documentName: "Loan Application Guidelines", accessCount: 892, lastAccessed: "2024-01-15 13:45:00", category: "Loans" },
  { id: "3", documentName: "Credit Card FAQ", accessCount: 756, lastAccessed: "2024-01-15 12:22:00", category: "Cards" },
  { id: "4", documentName: "Mobile Banking Setup Guide", accessCount: 654, lastAccessed: "2024-01-15 11:15:00", category: "Digital Banking" },
  { id: "5", documentName: "Fund Transfer Limits", accessCount: 543, lastAccessed: "2024-01-15 10:45:00", category: "Transactions" },
  { id: "6", documentName: "Interest Rate Schedule", accessCount: 432, lastAccessed: "2024-01-14 16:30:00", category: "General" },
  { id: "7", documentName: "KYC Requirements", accessCount: 321, lastAccessed: "2024-01-14 15:20:00", category: "Compliance" },
  { id: "8", documentName: "Dispute Resolution Process", accessCount: 234, lastAccessed: "2024-01-14 14:10:00", category: "Support" },
];

interface ReportDocumentAccessFrequencyProps {
  onBack: () => void;
}

export default function ReportDocumentAccessFrequency({ onBack }: ReportDocumentAccessFrequencyProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

  useEffect(() => {
    // Update filter count
    const filterCount = (dateRange ? 1 : 0) + (searchTerm ? 1 : 0);
    setNumberOfFilters(filterCount);
  }, [dateRange, searchTerm]);

  const [filteredData, setFilteredData] = useState<DocumentAccessData[]>(mockDocumentData);

  const maxAccessCount = Math.max(...mockDocumentData.map((d) => d.accessCount));

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = mockDocumentData.filter(
        (item) =>
          item.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredData(mockDocumentData);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Accounts": "bg-blue-500/20 text-blue-600",
      "Loans": "bg-green-500/20 text-green-600",
      "Cards": "bg-purple-500/20 text-purple-600",
      "Digital Banking": "bg-cyan-500/20 text-cyan-600",
      "Transactions": "bg-amber-500/20 text-amber-600",
      "General": "bg-gray-500/20 text-gray-600",
      "Compliance": "bg-red-500/20 text-red-600",
      "Support": "bg-pink-500/20 text-pink-600",
    };
    return colors[category] || "bg-gray-500/20 text-gray-600";
  };

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
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/20 flex items-center justify-center">
                <FileBarChart className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Document Access Frequency
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Track document access patterns and frequency in autopilot conversations
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
        <CardContent className="pt-6 space-y-6">
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <Button onClick={handleSearch} className="gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                {searchTerm && (
                  <Button variant="outline" onClick={handleClear} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileBarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No matching data found</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Document Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Access Count</TableHead>
                    <TableHead className="w-[200px]">Frequency</TableHead>
                    <TableHead>Last Accessed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/20">
                      <TableCell className="font-medium">{row.documentName}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(row.category)}`}>
                          {row.category}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">{row.accessCount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Progress
                          value={(row.accessCount / maxAccessCount) * 100}
                          className="h-2"
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {row.lastAccessed}
                      </TableCell>
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
