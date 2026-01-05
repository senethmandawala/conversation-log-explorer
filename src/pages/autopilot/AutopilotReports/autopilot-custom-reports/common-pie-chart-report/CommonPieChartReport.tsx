import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DateRangeValue } from "@/types/conversation";
import { CustomReport } from "../CustomReports";

interface CommonPieChartReportProps {
  customReport: CustomReport;
  selectedDateRange: DateRangeValue | null;
}

const COLORS = [
  "#0C3DBE",
  "#E57373",
  "#66BB6A",
  "#FFCA28",
  "#42A5F5",
  "#AB47BC",
  "#26A69A",
  "#FF7043",
];

// Mock data generator for pie/donut charts
const generateMockPieData = () => {
  return [
    { name: "Balance Check", value: 35, color: COLORS[0] },
    { name: "Transfer", value: 25, color: COLORS[1] },
    { name: "Bill Pay", value: 20, color: COLORS[2] },
    { name: "Support", value: 12, color: COLORS[3] },
    { name: "Other", value: 8, color: COLORS[4] },
  ];
};

// Custom tooltip matching HandledCallsAnalysis style
const CustomTooltip = ({ active, payload, chartData }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = chartData.reduce((sum: number, item: any) => sum + item.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(0);
    
    return (
      <div className="overflow-hidden rounded-md shadow-lg border-0" style={{ minWidth: 120 }}>
        <div 
          className="text-sm font-semibold px-3 py-2" 
          style={{ backgroundColor: data.color, color: "white" }}
        >
          {data.name}
        </div>
        <div className="bg-muted px-3 py-2 text-sm space-y-0.5">
          <div className="text-muted-foreground">Count: <span className="font-semibold text-foreground">{data.value}</span></div>
          <div className="text-muted-foreground">Percentage: <span className="font-semibold text-foreground">{percentage}%</span></div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom label renderer to show value inside pie/donut slices
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
      style={{ fontSize: '10px', fontWeight: 600 }}
    >
      {value}
    </text>
  );
};

export function CommonPieChartReport({ customReport, selectedDateRange }: CommonPieChartReportProps) {
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
        const mockData = generateMockPieData();
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

  const isDonut = customReport.reportType === "donutChart_report";

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
              <RefreshCw className="h-4 w-4" />
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
                <RefreshCw className="h-3 w-3" />
                Try Again
              </Button>
            </div>
          ) : noDataFound ? (
            <div className="flex flex-col items-center justify-center py-8 text-center h-[300px]">
              <p className="text-sm text-muted-foreground">No data found</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={isDonut ? 60 : 0}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip chartData={chartData} />} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
