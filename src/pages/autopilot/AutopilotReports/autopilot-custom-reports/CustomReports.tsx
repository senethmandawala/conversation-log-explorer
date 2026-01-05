import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Filter, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { DateRangeFilter } from "@/components/conversation/DateRangeFilter";
import { DateRangeValue } from "@/types/conversation";

import { CommonTableReport } from "./common-table-report/CommonTableReport";
import { CommonBarChartReport } from "./common-bar-chart-report/CommonBarChartReport";
import { CommonPieChartReport } from "./common-pie-chart-report/CommonPieChartReport";
import { CommonTreemapChartReport } from "./common-treemap-chart-report/CommonTreemapChartReport";

// Types
export interface CustomReport {
  id: string;
  report_name: string;
  description: string;
  colSize: string;
  reportType: "table_report" | "barChart_report" | "lineChart_report" | "areaChart_report" | "pieChart_report" | "donutChart_report" | "treeChart_report";
  reportFields: {
    columns?: string[];
    X?: string;
    Y?: string;
  };
}

// Mock data - simulating API response
const mockCustomReports: CustomReport[] = [
  {
    id: "1",
    report_name: "Daily Call Volume",
    description: "Track daily call volumes across all channels",
    colSize: "6",
    reportType: "barChart_report",
    reportFields: {
      X: "Date",
      Y: "Call Count"
    }
  },
  {
    id: "2",
    report_name: "Intent Distribution",
    description: "Distribution of customer intents",
    colSize: "6",
    reportType: "pieChart_report",
    reportFields: {
      X: "Intent",
      Y: "Count"
    }
  },
  {
    id: "3",
    report_name: "Agent Performance",
    description: "Top performing agents summary",
    colSize: "12",
    reportType: "table_report",
    reportFields: {
      columns: ["Agent", "Calls", "Avg Time", "Satisfaction"]
    }
  },
  {
    id: "4",
    report_name: "Category Breakdown",
    description: "Hierarchical view of call categories",
    colSize: "6",
    reportType: "treeChart_report",
    reportFields: {
      X: "Category",
      Y: "Count"
    }
  },
  {
    id: "5",
    report_name: "Weekly Trends",
    description: "Call volume trends over the week",
    colSize: "6",
    reportType: "lineChart_report",
    reportFields: {
      X: "Day",
      Y: "Calls"
    }
  },
  {
    id: "6",
    report_name: "Resolution Rate",
    description: "Donut chart showing resolution rates",
    colSize: "6",
    reportType: "donutChart_report",
    reportFields: {
      X: "Status",
      Y: "Count"
    }
  }
];

interface CustomReportsProps {
  onBack: () => void;
}

export default function CustomReports({ onBack }: CustomReportsProps) {
  const [dataLoading, setDataLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [noRecordFound, setNoRecordFound] = useState(false);
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

  useEffect(() => {
    setNumberOfFilters(dateRange ? 1 : 0);
  }, [dateRange]);

  useEffect(() => {
    loadCustomizedReport();
  }, []);

  const loadCustomizedReport = () => {
    setDataLoading(true);
    setErrorLoading(false);
    setNoRecordFound(false);

    // Simulate API call
    setTimeout(() => {
      try {
        if (mockCustomReports.length === 0) {
          setNoRecordFound(true);
        }
        setCustomReports(mockCustomReports);
        setDataLoading(false);
        setErrorLoading(false);
      } catch (error) {
        setDataLoading(false);
        setErrorLoading(true);
        setNoRecordFound(false);
      }
    }, 800);
  };

  const gotoConfig = () => {
    // Navigate to configuration page
    console.log("Navigate to configuration");
  };

  const renderReport = (report: CustomReport) => {
    switch (report.reportType) {
      case "table_report":
        return (
          <CommonTableReport
            key={report.id}
            customReport={report}
            selectedDateRange={dateRange}
          />
        );
      case "barChart_report":
      case "lineChart_report":
      case "areaChart_report":
        return (
          <CommonBarChartReport
            key={report.id}
            customReport={report}
            selectedDateRange={dateRange}
          />
        );
      case "pieChart_report":
      case "donutChart_report":
        return (
          <CommonPieChartReport
            key={report.id}
            customReport={report}
            selectedDateRange={dateRange}
          />
        );
      case "treeChart_report":
        return (
          <CommonTreemapChartReport
            key={report.id}
            customReport={report}
            selectedDateRange={dateRange}
          />
        );
      default:
        return null;
    }
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
               <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/20 flex items-center justify-center">
                <Settings className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Custom Reports
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  View and manage your custom autopilot reports
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
              <Button
                variant="outline"
                size="icon"
                onClick={gotoConfig}
                className="h-9 w-9"
                title="Report Configurations"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-3 space-y-3">
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
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Content */}
          {dataLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
              ))}
            </div>
          ) : errorLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-red-500 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Reports</h3>
              <p className="text-muted-foreground mb-4">Something went wrong while loading the reports.</p>
              <Button onClick={loadCustomizedReport} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : noRecordFound ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-muted-foreground mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Custom Reports Found</h3>
              <p className="text-muted-foreground">Configure custom reports in the settings to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 mt-3">
              {customReports.map((report) => renderReport(report))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
