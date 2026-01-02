import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Search, X, FileBarChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState<DocumentAccessData[]>(mockDocumentData);

  const maxAccessCount = Math.max(...mockDocumentData.map((d) => d.accessCount));

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = mockDocumentData.filter(
        (item) =>
          item.documentName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.category.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredData(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setSearchKeyword("");
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
    <div className="p-6 space-y-6">
      <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border/30">
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
                Document Access Frequency Report
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track document access patterns and frequency in autopilot conversations
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Search Section */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by document name..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
    </div>
  );
}
