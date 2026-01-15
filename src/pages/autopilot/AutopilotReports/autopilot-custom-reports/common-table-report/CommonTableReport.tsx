import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateRangeValue } from "@/types/conversation";
import { CustomReport } from "../CustomReports";

interface CommonTableReportProps {
  customReport: CustomReport;
  selectedDateRange: DateRangeValue | null;
}

// Mock data generator for table
const generateMockTableData = (columns: string[]) => {
  const mockData = [
    { Agent: "Agent A", Calls: "145", "Avg Time": "2:30", Satisfaction: "95%" },
    { Agent: "Agent B", Calls: "132", "Avg Time": "2:45", Satisfaction: "92%" },
    { Agent: "Agent C", Calls: "128", "Avg Time": "3:00", Satisfaction: "89%" },
    { Agent: "Agent D", Calls: "115", "Avg Time": "2:15", Satisfaction: "94%" },
    { Agent: "Agent E", Calls: "98", "Avg Time": "2:50", Satisfaction: "91%" },
  ];
  return mockData;
};

export function CommonTableReport({ customReport, selectedDateRange }: CommonTableReportProps) {
  const [loading, setLoading] = useState(true);
  const [failedDataLoading, setFailedDataLoading] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [displayedColumns, setDisplayedColumns] = useState<string[]>([]);

  useEffect(() => {
    if (customReport.reportFields.columns) {
      setDisplayedColumns(customReport.reportFields.columns.map(col => col.trim()));
    }
    loadData();
  }, [customReport]);

  useEffect(() => {
    if (selectedDateRange) {
      loadData();
    }
  }, [selectedDateRange]);

  const loadData = () => {
    setLoading(true);
    setFailedDataLoading(false);
    setNoDataFound(false);

    // Simulate API call
    setTimeout(() => {
      try {
        const mockData = generateMockTableData(displayedColumns);
        if (mockData.length === 0) {
          setNoDataFound(true);
        }
        setData(mockData);
        setLoading(false);
        setFailedDataLoading(false);
      } catch (error) {
        setLoading(false);
        setFailedDataLoading(true);
      }
    }, 600);
  };

  const colSize = customReport.colSize === "12" ? "col-span-12" : "col-span-12 lg:col-span-6";

  return (
    <div className={colSize}>
      <Card className="h-full border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                {customReport.report_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {customReport.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={loadData}
              className="h-8 w-8"
              title="Reload section"
            >
              <IconRefresh className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : failedDataLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-red-500 mb-2">
                <svg className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Error loading data</p>
              <Button size="sm" onClick={loadData} className="gap-1">
                <IconRefresh className="h-3 w-3" />
                Try Again
              </Button>
            </div>
          ) : noDataFound ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">No data found</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    {displayedColumns.map((column) => (
                      <TableHead key={column} className="font-medium">
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/20">
                      {displayedColumns.map((column) => (
                        <TableCell key={column}>
                          {row[column] || "-"}
                        </TableCell>
                      ))}
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
