import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ZoomIn, Maximize2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Treemap, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

type ChartType = "line" | "bar" | "pie" | "treemap";

interface ReportSectionProps {
  id: string;
  title: string;
  description: string;
  hasChart?: boolean;
  hasFilter?: boolean;
  note?: string;
  chartType?: ChartType;
  chartData?: any[];
}

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const chartConfig = {
  value: { label: "Value", color: "#3b82f6" },
  calls: { label: "Calls", color: "#3b82f6" },
  resolved: { label: "Resolved", color: "#22c55e" },
  pending: { label: "Pending", color: "#f59e0b" },
  escalated: { label: "Escalated", color: "#ef4444" },
};

export const ReportSection = ({ title, description, hasChart, hasFilter, note, chartType, chartData }: ReportSectionProps) => {
  const renderChart = () => {
    if (!chartData || chartData.length === 0) return null;

    switch (chartType) {
      case "line":
        return (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
              <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
            </LineChart>
          </ChartContainer>
        );

      case "bar":
        return (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        );

      case "pie":
        return (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        );

      case "treemap":
        const treemapData = chartData.map((item, idx) => ({
          ...item,
          fill: COLORS[idx % COLORS.length],
        }));
        return (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <Treemap
              data={treemapData}
              dataKey="value"
              nameKey="name"
              aspectRatio={4 / 3}
              stroke="#fff"
            >
              <ChartTooltip content={<ChartTooltipContent />} />
            </Treemap>
          </ChartContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-6">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-start gap-2">
          <div className="w-1 h-6 bg-primary rounded-full mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Information about {title}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            {hasFilter && (
              <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-muted/50 rounded-full text-xs font-medium">
                Total Calls <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full">307</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Today
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {chartType && chartData ? (
          <div className="py-4">
            {renderChart()}
          </div>
        ) : null}

        {note && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            <span className="text-primary">Note:</span> {note.replace("Note: ", "")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
