import { useState } from "react";
import { X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RedAlertCallLogsProps {
  category: string;
  subCategory: string;
}

// Mock call logs data matching Angular implementation
const generateMockCallLogs = (category: string, subCategory: string) => {
  const baseData = [
    { date: "2025-12-23", time: "09:15:30", msisdn: "+1234567890", sentiment: "positive", status: "Resolved", statusType: "success" },
    { date: "2025-12-23", time: "09:30:45", msisdn: "+1234567891", sentiment: "negative", status: "Pending", statusType: "warning" },
    { date: "2025-12-23", time: "10:00:12", msisdn: "+1234567892", sentiment: "neutral", status: "Resolved", statusType: "success" },
    { date: "2025-12-23", time: "10:15:33", msisdn: "+1234567893", sentiment: "negative", status: "Escalated", statusType: "danger" },
    { date: "2025-12-23", time: "10:45:21", msisdn: "+1234567894", sentiment: "positive", status: "Pending", statusType: "warning" },
    { date: "2025-12-23", time: "11:00:54", msisdn: "+1234567895", sentiment: "neutral", status: "Resolved", statusType: "success" },
    { date: "2025-12-23", time: "11:30:18", msisdn: "+1234567896", sentiment: "negative", status: "Escalated", statusType: "danger" },
    { date: "2025-12-23", time: "12:00:42", msisdn: "+1234567897", sentiment: "positive", status: "Pending", statusType: "warning" },
  ];

  return baseData;
};

export function RedAlertCallLogs({ category, subCategory }: RedAlertCallLogsProps) {
  const [loading, setLoading] = useState(false);
  const [callLogs, setCallLogs] = useState(generateMockCallLogs(category, subCategory));

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setCallLogs(generateMockCallLogs(category, subCategory));
      setLoading(false);
    }, 500);
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Positive</Badge>;
      case "negative":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Negative</Badge>;
      case "neutral":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/30">Neutral</Badge>;
      default:
        return <Badge variant="outline">{sentiment}</Badge>;
    }
  };

  const getStatusBadge = (statusType: string, status: string) => {
    switch (statusType.toLowerCase()) {
      case "success":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">{status}</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">{status}</Badge>;
      case "danger":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">Showing {callLogs.length} calls</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleReload}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : callLogs.length > 0 ? (
        <div className="border border-border/50 rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                <TableRow>
                  <TableHead className="font-semibold">Date/Time</TableHead>
                  <TableHead className="font-semibold">MSISDN</TableHead>
                  <TableHead className="font-semibold text-center">Sentiment</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callLogs.map((call, index) => (
                  <TableRow 
                    key={index} 
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{call.date}</span>
                        <span className="text-xs text-muted-foreground">{call.time}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{call.msisdn}</TableCell>
                    <TableCell className="text-center">{getSentimentBadge(call.sentiment)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(call.statusType, call.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
}
