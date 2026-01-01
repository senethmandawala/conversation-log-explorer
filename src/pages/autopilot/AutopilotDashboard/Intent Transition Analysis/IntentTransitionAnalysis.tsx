import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface IntentTransition {
  combination: string[];
  count: number;
}

// Mock data for intent transitions
const intentTransitions: IntentTransition[] = [
  { combination: ["Billing Inquiry", "Payment Support", "Balance Check"], count: 145 },
  { combination: ["Technical Support", "Troubleshooting"], count: 128 },
  { combination: ["Account Info", "Plan Upgrade", "Billing"], count: 112 },
  { combination: ["General Query", "Technical Support"], count: 98 },
  { combination: ["Sales", "Product Info", "Pricing"], count: 87 },
  { combination: ["Complaint", "Escalation", "Manager Request"], count: 76 },
  { combination: ["Service Status", "Outage Info"], count: 65 },
  { combination: ["Appointment", "Reschedule"], count: 54 },
];

const totalMultiCategoryCalls = intentTransitions.reduce((sum, item) => sum + item.count, 0);

export function IntentTransitionAnalysis() {
  const [isLoading, setIsLoading] = useState(false);

  const formatCombination = (combination: string[]): string => {
    return combination.join(" → ");
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Intent Transition Analysis</CardTitle>
          <UITooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Shows how callers transition between different intents during a single call</p>
            </TooltipContent>
          </UITooltip>
        </div>
        <p className="text-sm text-muted-foreground">Analysis of intent transitions during calls</p>
      </CardHeader>
      
      <CardContent>
        {/* Total Calls Section */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
            <span className="text-sm text-muted-foreground">Total Multi-Category Calls</span>
            <Badge variant="secondary" className="text-lg font-bold">
              {totalMultiCategoryCalls.toLocaleString()}
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : intentTransitions.length > 0 ? (
          <div className="max-h-[400px] overflow-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Intent Change</TableHead>
                  <TableHead className="font-semibold text-center w-[120px]">Call Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {intentTransitions.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="py-3">
                      <div className="flex flex-wrap items-center gap-1">
                        {item.combination.map((intent, i) => (
                          <span key={i} className="flex items-center">
                            <Badge variant="outline" className="text-xs">
                              {intent}
                            </Badge>
                            {i < item.combination.length - 1 && (
                              <span className="mx-1 text-muted-foreground">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {item.count.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
