import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockCallLogs = [
  { id: 1, date: "2024-01-15", time: "10:30 AM", msisdn: "+94771234567", duration: "25:30", category: "Technical Issues", agent: "John Smith", sentiment: "Negative", status: "Resolved" },
  { id: 2, date: "2024-01-15", time: "11:45 AM", msisdn: "+94772345678", duration: "22:15", category: "Account Closure", agent: "Jane Doe", sentiment: "Neutral", status: "Pending" },
  { id: 3, date: "2024-01-14", time: "02:15 PM", msisdn: "+94773456789", duration: "19:45", category: "Billing Issues", agent: "Mike Johnson", sentiment: "Positive", status: "Resolved" },
  { id: 4, date: "2024-01-14", time: "03:30 PM", msisdn: "+94774567890", duration: "18:20", category: "Refund Requests", agent: "Sarah Wilson", sentiment: "Negative", status: "Escalated" },
  { id: 5, date: "2024-01-13", time: "09:20 AM", msisdn: "+94775678901", duration: "17:50", category: "Technical Issues", agent: "Chris Brown", sentiment: "Neutral", status: "Resolved" },
  { id: 6, date: "2024-01-13", time: "01:10 PM", msisdn: "+94776789012", duration: "16:40", category: "Service Request", agent: "Emily Davis", sentiment: "Positive", status: "Resolved" },
  { id: 7, date: "2024-01-12", time: "04:25 PM", msisdn: "+94777890123", duration: "15:55", category: "Product Inquiry", agent: "David Lee", sentiment: "Neutral", status: "Resolved" },
  { id: 8, date: "2024-01-12", time: "11:00 AM", msisdn: "+94778901234", duration: "15:30", category: "Billing Issues", agent: "Lisa Wang", sentiment: "Negative", status: "Pending" },
];

export function DurationCallLogs() {
  const [loading, setLoading] = useState(false);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleCallClick = (call: typeof mockCallLogs[0]) => {
    console.log("Call clicked:", call);
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Positive</Badge>;
      case "negative": return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Negative</Badge>;
      default: return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">Neutral</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Resolved</Badge>;
      case "pending": return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">Pending</Badge>;
      case "escalated": return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Escalated</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-sm text-muted-foreground">Showing {mockCallLogs.length} calls</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          onClick={handleReload}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>MSISDN</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead className="text-center">Sentiment</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCallLogs.length > 0 ? (
                mockCallLogs.map((call) => (
                  <TableRow 
                    key={call.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleCallClick(call)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{call.date}</div>
                        <div className="text-sm text-muted-foreground">{call.time}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{call.msisdn}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                        {call.duration}
                      </Badge>
                    </TableCell>
                    <TableCell>{call.category}</TableCell>
                    <TableCell>{call.agent}</TableCell>
                    <TableCell className="text-center">{getSentimentBadge(call.sentiment)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(call.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No calls found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
