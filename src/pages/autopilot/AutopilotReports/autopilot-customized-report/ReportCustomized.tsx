import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Table2, BarChart3, PieChart, TreeDeciduous } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Treemap,
} from "recharts";
import { CustomChartTooltip } from "@/components/ui/custom-chart-tooltip";

type ReportType = "table" | "bar" | "pie" | "treemap";

interface CustomReport {
  id: string;
  reportName: string;
  description: string;
  reportType: ReportType;
  data: any[];
}

// Mock custom reports
const mockCustomReports: CustomReport[] = [
  {
    id: "1",
    reportName: "Daily Call Volume",
    description: "Track daily call volumes across all channels",
    reportType: "bar",
    data: [
      { name: "Mon", value: 450 },
      { name: "Tue", value: 520 },
      { name: "Wed", value: 480 },
      { name: "Thu", value: 560 },
      { name: "Fri", value: 420 },
      { name: "Sat", value: 280 },
      { name: "Sun", value: 180 },
    ],
  },
  {
    id: "2",
    reportName: "Intent Distribution",
    description: "Distribution of customer intents",
    reportType: "pie",
    data: [
      { name: "Balance Check", value: 35 },
      { name: "Transfer", value: 25 },
      { name: "Bill Pay", value: 20 },
      { name: "Support", value: 12 },
      { name: "Other", value: 8 },
    ],
  },
  {
    id: "3",
    reportName: "Agent Performance",
    description: "Top performing agents summary",
    reportType: "table",
    data: [
      { agent: "Agent A", calls: 145, avgTime: "2:30", satisfaction: "95%" },
      { agent: "Agent B", calls: 132, avgTime: "2:45", satisfaction: "92%" },
      { agent: "Agent C", calls: 128, avgTime: "3:00", satisfaction: "89%" },
      { agent: "Agent D", calls: 115, avgTime: "2:15", satisfaction: "94%" },
    ],
  },
  {
    id: "4",
    reportName: "Category Breakdown",
    description: "Hierarchical view of call categories",
    reportType: "treemap",
    data: [
      { name: "Accounts", size: 450, fill: "hsl(var(--chart-1))" },
      { name: "Loans", size: 320, fill: "hsl(var(--chart-2))" },
      { name: "Cards", size: 280, fill: "hsl(var(--chart-3))" },
      { name: "Support", size: 200, fill: "hsl(var(--chart-4))" },
      { name: "Other", size: 150, fill: "hsl(var(--chart-5))" },
    ],
  },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface ReportCustomizedProps {
  onBack: () => void;
}

export default function ReportCustomized({ onBack }: ReportCustomizedProps) {
  const [isLoading, setIsLoading] = useState(false);

  const renderChart = (report: CustomReport) => {
    switch (report.reportType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={report.data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomChartTooltip />} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPie>
              <Pie
                data={report.data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {report.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomChartTooltip />} />
            </RechartsPie>
          </ResponsiveContainer>
        );

      case "table":
        const columns = report.data.length > 0 ? Object.keys(report.data[0]) : [];
        return (
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  {columns.map((col) => (
                    <TableHead key={col} className="capitalize">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.data.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/20">
                    {columns.map((col) => (
                      <TableCell key={col}>{row[col]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      case "treemap":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <Treemap
              data={report.data}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="hsl(var(--background))"
            />
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getTypeIcon = (type: ReportType) => {
    switch (type) {
      case "table":
        return <Table2 className="h-4 w-4" />;
      case "bar":
        return <BarChart3 className="h-4 w-4" />;
      case "pie":
        return <PieChart className="h-4 w-4" />;
      case "treemap":
        return <TreeDeciduous className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border/30">
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
                Customized Reports
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                View and manage your custom autopilot reports
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[350px] w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockCustomReports.map((report) => (
                <Card key={report.id} className="border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-muted">
                        {getTypeIcon(report.reportType)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{report.reportName}</CardTitle>
                        <p className="text-xs text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>{renderChart(report)}</CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
