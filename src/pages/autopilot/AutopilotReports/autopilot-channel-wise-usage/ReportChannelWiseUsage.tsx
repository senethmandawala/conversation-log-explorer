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
import { ArrowLeft, Search, X, PieChart, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChannelUsageData {
  id: string;
  date: string;
  time: string;
  customerId: string;
  customerName: string;
  channel: string;
  queries: number;
}

// Mock data
const mockChannelData: ChannelUsageData[] = [
  { id: "1", date: "2024-01-15", time: "09:15:22", customerId: "CUST001", customerName: "John Smith", channel: "Web Chat", queries: 5 },
  { id: "2", date: "2024-01-15", time: "10:30:45", customerId: "CUST002", customerName: "Jane Doe", channel: "Voice", queries: 3 },
  { id: "3", date: "2024-01-15", time: "11:22:33", customerId: "CUST003", customerName: "Robert Johnson", channel: "WhatsApp", queries: 8 },
  { id: "4", date: "2024-01-15", time: "13:45:12", customerId: "CUST004", customerName: "Emily Brown", channel: "Mobile App", queries: 4 },
  { id: "5", date: "2024-01-15", time: "14:55:28", customerId: "CUST005", customerName: "Michael Wilson", channel: "Web Chat", queries: 6 },
  { id: "6", date: "2024-01-16", time: "08:30:15", customerId: "CUST006", customerName: "Sarah Davis", channel: "Voice", queries: 2 },
  { id: "7", date: "2024-01-16", time: "09:45:40", customerId: "CUST007", customerName: "David Martinez", channel: "WhatsApp", queries: 7 },
  { id: "8", date: "2024-01-16", time: "11:15:55", customerId: "CUST008", customerName: "Lisa Anderson", channel: "SMS", queries: 1 },
];

interface ReportChannelWiseUsageProps {
  onBack: () => void;
}

export default function ReportChannelWiseUsage({ onBack }: ReportChannelWiseUsageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState<ChannelUsageData[]>(mockChannelData);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = mockChannelData.filter(
        (item) =>
          item.customerId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.customerName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.channel.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredData(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setSearchKeyword("");
    setFilteredData(mockChannelData);
  };

  const getChannelColor = (channel: string) => {
    const colors: Record<string, string> = {
      "Web Chat": "bg-blue-500/20 text-blue-600",
      "Voice": "bg-green-500/20 text-green-600",
      "WhatsApp": "bg-emerald-500/20 text-emerald-600",
      "Mobile App": "bg-purple-500/20 text-purple-600",
      "SMS": "bg-amber-500/20 text-amber-600",
    };
    return colors[channel] || "bg-gray-500/20 text-gray-600";
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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/20 flex items-center justify-center">
              <PieChart className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight">
                Channel Wise Usage Report
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Analyze customer interactions across different channels
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Search Section */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by keyword..."
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
              <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No data matching the filter</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>No. of Queries</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/20">
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.time}</TableCell>
                      <TableCell className="font-mono text-sm">{row.customerId}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChannelColor(row.channel)}`}>
                          {row.channel}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">{row.queries}</TableCell>
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
