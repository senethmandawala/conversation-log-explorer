import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CallDetails from "./CallDetails";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CallLog {
  callId: string;
  date: string;
  time: string;
  msisdn: string;
  service: string;
  violationType: string[];
}

interface AgentCallLogsProps {
  agentName: string;
  agentId: string;
  onBack: () => void;
}

// Mock data
const mockCallLogs: CallLog[] = [
  {
    callId: "1",
    date: "2024-01-15",
    time: "09:30 AM",
    msisdn: "+1234567890",
    service: "Technical Support",
    violationType: ["Interrupting Customer", "Not Following Script"],
  },
  {
    callId: "2",
    date: "2024-01-15",
    time: "10:45 AM",
    msisdn: "+1234567891",
    service: "Billing",
    violationType: ["Rude Behavior", "Incomplete Information"],
  },
  {
    callId: "3",
    date: "2024-01-15",
    time: "11:20 AM",
    msisdn: "+1234567892",
    service: "Sales",
    violationType: ["Not Following Script"],
  },
  {
    callId: "4",
    date: "2024-01-15",
    time: "02:15 PM",
    msisdn: "+1234567893",
    service: "Customer Service",
    violationType: ["Interrupting Customer", "Incomplete Information", "Rude Behavior"],
  },
  {
    callId: "5",
    date: "2024-01-15",
    time: "03:30 PM",
    msisdn: "+1234567894",
    service: "Technical Support",
    violationType: ["Not Following Script", "Incomplete Information"],
  },
  {
    callId: "6",
    date: "2024-01-16",
    time: "09:00 AM",
    msisdn: "+1234567895",
    service: "Billing",
    violationType: ["Rude Behavior"],
  },
  {
    callId: "7",
    date: "2024-01-16",
    time: "10:30 AM",
    msisdn: "+1234567896",
    service: "Sales",
    violationType: ["Interrupting Customer", "Not Following Script"],
  },
  {
    callId: "8",
    date: "2024-01-16",
    time: "11:45 AM",
    msisdn: "+1234567897",
    service: "Customer Service",
    violationType: ["Incomplete Information"],
  },
];

export default function AgentCallLogs({ agentName, agentId, onBack }: AgentCallLogsProps) {
  const [loading, setLoading] = useState(true);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setCallLogs(mockCallLogs);
      setLoading(false);
    }, 500);
  }, [agentId]);

  const totalPages = Math.ceil(callLogs.length / pageSize);
  const paginatedLogs = callLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleViewDetails = (log: CallLog) => {
    setSelectedCallId(log.callId);
  };

  const handleCloseDetails = () => {
    setSelectedCallId(null);
  };

  return (
    <>
      {/* Call Details Side Panel */}
      <Sheet open={!!selectedCallId} onOpenChange={(open) => !open && handleCloseDetails()}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Call Details</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedCallId && <CallDetails callId={selectedCallId} />}
          </div>
        </SheetContent>
      </Sheet>

      <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="h-9 w-9 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h5 className="text-lg font-semibold">{agentName} - Call Logs</h5>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : callLogs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No call logs available
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Date/Time</TableHead>
                  <TableHead className="w-[150px]">MSISDN</TableHead>
                  <TableHead className="w-[100px]">Service</TableHead>
                  <TableHead>Violation Types</TableHead>
                  <TableHead className="text-center w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log, index) => (
                  <motion.tr
                    key={log.callId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/30 hover:bg-muted/20"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.date}</div>
                        <div className="text-sm text-muted-foreground">{log.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>{log.msisdn}</TableCell>
                    <TableCell>{log.service}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {log.violationType.map((violation, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-accent/50 text-accent-foreground border-accent"
                          >
                            {violation}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(log)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
                Showing <span className="font-medium text-foreground">{paginatedLogs.length}</span> of{" "}
                <span className="font-medium text-foreground">{callLogs.length}</span> results
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
    </>
  );
}
