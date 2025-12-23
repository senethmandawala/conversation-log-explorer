import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CallLogsSummaryProps {
  breadcrumb: string[];
}

const callLogsData = [
  { date: "2024-01-15", time: "09:23 AM", msisdn: "+1234567890", sentiment: "Positive", status: "Resolved" },
  { date: "2024-01-15", time: "10:45 AM", msisdn: "+1987654321", sentiment: "Negative", status: "Pending" },
  { date: "2024-01-14", time: "02:30 PM", msisdn: "+1122334455", sentiment: "Neutral", status: "Resolved" },
  { date: "2024-01-14", time: "04:15 PM", msisdn: "+1555666777", sentiment: "Positive", status: "Escalated" },
  { date: "2024-01-13", time: "11:00 AM", msisdn: "+1888999000", sentiment: "Negative", status: "Resolved" },
  { date: "2024-01-13", time: "03:45 PM", msisdn: "+1777888999", sentiment: "Positive", status: "Resolved" },
  { date: "2024-01-12", time: "08:15 AM", msisdn: "+1666777888", sentiment: "Neutral", status: "Pending" },
];

const getSentimentColor = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case "positive": return "text-emerald-500";
    case "negative": return "text-red-500";
    default: return "text-amber-500";
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

export function CallLogsSummary({ breadcrumb }: CallLogsSummaryProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date/Time</TableHead>
              <TableHead>MSISDN</TableHead>
              <TableHead className="text-center">Sentiment</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {callLogsData.map((log, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="text-sm">{log.date}</div>
                  <div className="text-xs text-muted-foreground">{log.time}</div>
                </TableCell>
                <TableCell className="font-mono text-sm">{log.msisdn}</TableCell>
                <TableCell className={`text-center font-medium ${getSentimentColor(log.sentiment)}`}>
                  {log.sentiment}
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(log.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
