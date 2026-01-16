import { useEffect, useState } from "react";
import { IconX, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import { useProjectSelection } from "@/services/projectSelectionService";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";

interface RedAlertCallLogsProps {
  category: string;
  subCategory: string;
  fromTime: string;
  toTime: string;
}

export function RedAlertCallLogs({ category, subCategory, fromTime, toTime }: RedAlertCallLogsProps) {
  const [loading, setLoading] = useState(false);
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 5,
    totalElements: 0,
    totalPages: 0,
    last: true,
    first: true
  });
  const { selectedProject } = useProjectSelection();

  const loadCallLogs = async (page: number = 1, size: number = 5) => {
    if (!selectedProject || !fromTime || !toTime) {
      return;
    }

    setLoading(true);
    setError(false);

    try {
      // Get IDs from selected project
      const tenantId = parseInt(selectedProject.tenant_id);
      const subtenantId = parseInt(selectedProject.sub_tenant_id);
      const companyId = parseInt(selectedProject.company_id);
      const departmentId = parseInt(selectedProject.department_id);

      const filters = {
        tenantId,
        subtenantId,
        companyId,
        departmentId,
        fromTime,
        toTime,
        alert: category,
        alert_reason: subCategory,
        page,
        size,
        sort: 'id',
        sortOrder: 'DESC'
      };

      const response = await callRoutingApiService.redalertCallLogs(filters);

      // Check if response has paginated data and transform it
      if (response?.data?.content && Array.isArray(response.data.content)) {
        setCallLogs(response.data.content);
        setPagination({
          page: (response.data.number || 0) + 1, // Convert 0-based to 1-based
          size: response.data.size || size,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0,
          last: response.data.last || true,
          first: response.data.first || true
        });
      } else {
        setCallLogs([]);
        setPagination({
          page: 1,
          size: 5,
          totalElements: 0,
          totalPages: 0,
          last: true,
          first: true
        });
      }
    } catch (error) {
      console.error('Error loading call logs:', error);
      setError(true);
      setCallLogs([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadCallLogs();
  }, [category, subCategory, fromTime, toTime, selectedProject]);

  const handleReload = () => {
    loadCallLogs(pagination.page, pagination.size);
  };

  const handlePageChange = (newPage: number) => {
    loadCallLogs(newPage, pagination.size);
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

  const getSentimentIcon = (sentiment: number) => {
    switch (sentiment) {
      case 2: // Positive
        return { icon: <TablerIcon name="mood-smile-beam" className="text-green-500" size={20} />, title: "Positive" };
      case 1: // Neutral
        return { icon: <TablerIcon name="mood-empty" className="text-yellow-500" size={20} />, title: "Neutral" };
      case 0: // Negative
        return { icon: <TablerIcon name="mood-sad" className="text-red-500" size={20} />, title: "Negative" };
      default:
        return { icon: <TablerIcon name="mood-empty" className="text-yellow-500" size={20} />, title: "Neutral" };
    }
  };

  const getGenderBadge = (gender: number) => {
    switch (gender) {
      case 1:
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">Male</Badge>;
      case 2:
        return <Badge variant="outline" className="bg-pink-500/10 text-pink-600 border-pink-500/30">Female</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {callLogs.length} of {pagination.totalElements} calls
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleReload}
          disabled={loading}
        >
          <IconRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <ExceptionHandleView 
          type="loading" 
          justLoading={false}
          className="!p-0"
        />
      ) : error ? (
        <ExceptionHandleView 
          type="500" 
          title="Error loading call logs"
          content="red alert call logs"
          onTryAgain={handleReload}
          className="!p-0"
        />
      ) : callLogs.length > 0 ? (
        <div className="border border-border/50 rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                <TableRow>
                  <TableHead className="font-semibold">Date/Time</TableHead>
                  <TableHead className="font-semibold">MSISDN</TableHead>
                  <TableHead className="font-semibold text-center">Agent Sentiment</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callLogs.map((call) => (
                  <TableRow 
                    key={call.id} 
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {new Date(call.call_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(call.call_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{call.mobile_no}</TableCell>
                    <TableCell className="text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex cursor-help">
                            {getSentimentIcon(call.agent_sentiment).icon}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getSentimentIcon(call.agent_sentiment).title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(call.case_status === 0 ? 'warning' : call.case_status === 1 ? 'success' : 'danger', 
                        call.case_status === 0 ? 'Pending' : call.case_status === 1 ? 'Resolved' : 'Escalated')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border/50">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.first || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.last || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ExceptionHandleView 
          type="204" 
          title="No Red Alert Data"
          content="red alert call logs"
          onTryAgain={handleReload}
          className="!p-0"
        />
      )}
    </div>
  );
}
