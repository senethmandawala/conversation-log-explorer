import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DateRangeValue } from "@/types/conversation";
import { CustomReport } from "../CustomReports";

// Custom tooltip matching HandledCallsAnalysis style
const CustomTooltip = ({ active, payload, label, color = "#00C853" }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    
    return (
      <div className="overflow-hidden rounded-md shadow-lg border-0" style={{ minWidth: 120 }}>
        <div 
          className="text-sm font-semibold px-3 py-2" 
          style={{ backgroundColor: color, color: "white" }}
        >
          {label}
        </div>
        <div className="bg-muted px-3 py-2 text-sm space-y-0.5">
          <div className="text-muted-foreground">{data.name}: <span className="font-semibold text-foreground">{data.value}</span></div>
        </div>
      </div>
    );
  }
  return null;
};

interface CommonBarChartReportProps {
  customReport: CustomReport;
  selectedDateRange: DateRangeValue | null;
}

// Mock data generator for bar/line/area charts
const generateMockChartData = () => {
  return [
    { x: "Mon", y: 450 },
    { x: "Tue", y: 520 },
    { x: "Wed", y: 480 },
    { x: "Thu", y: 560 },
    { x: "Fri", y: 420 },
    { x: "Sat", y: 280 },
    { x: "Sun", y: 180 },
  ];
};

export function CommonBarChartReport({ customReport, selectedDateRange }: CommonBarChartReportProps) {
  const [loading, setLoading] = useState(true);
  const [failedDataLoading, setFailedDataLoading] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
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
        const mockData = generateMockChartData();
        if (mockData.length === 0) {
          setNoDataFound(true);
        }
        setChartData(mockData);
        setLoading(false);
        setFailedDataLoading(false);
      } catch (error) {
        setLoading(false);
        setFailedDataLoading(true);
      }
    }, 600);
  };

  const getChartType = (): "bar" | "line" | "area" => {
    switch (customReport.reportType) {
      case "lineChart_report":
        return "line";
      case "areaChart_report":
        return "area";
      default:
        return "bar";
    }
  };

  const renderChart = () => {
    const chartType = getChartType();
    const xLabel = customReport.reportFields.X || "X";
    const yLabel = customReport.reportFields.Y || "Y";

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis 
              dataKey="x" 
              className="text-xs"
              label={{ value: xLabel, position: "insideBottom", offset: -5 }}
            />
            <YAxis 
              className="text-xs"
              label={{ value: yLabel, angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip color="#00C853" />} />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#00C853"
              strokeWidth={2}
              dot={{ r: 4 }}
              name={yLabel}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "area") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis 
              dataKey="x" 
              className="text-xs"
              label={{ value: xLabel, position: "insideBottom", offset: -5 }}
            />
            <YAxis 
              className="text-xs"
              label={{ value: yLabel, angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip color="#00C853" />} />
            <Area
              type="monotone"
              dataKey="y"
              stroke="#00C853"
              fill="#00C85333"
              strokeWidth={2}
              name={yLabel}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    // Default: Bar chart
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis 
            dataKey="x" 
            className="text-xs"
            label={{ value: xLabel, position: "insideBottom", offset: -5 }}
          />
          <YAxis 
            className="text-xs"
            label={{ value: yLabel, angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip color="#00C853" />} />
          <Bar
            dataKey="y"
            fill="#00C853"
            radius={[4, 4, 0, 0]}
            name={yLabel}
          />
        </BarChart>
      </ResponsiveContainer>
    );
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
            <Skeleton className="h-[300px] w-full" />
          ) : failedDataLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-center h-[300px]">
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
            <div className="flex flex-col items-center justify-center py-8 text-center h-[300px]">
              <p className="text-sm text-muted-foreground">No data found</p>
            </div>
          ) : (
            renderChart()
          )}
        </CardContent>
      </Card>
    </div>
  );
}
