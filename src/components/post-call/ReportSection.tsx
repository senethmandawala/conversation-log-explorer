import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Maximize2, Info } from "lucide-react";
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

const COLORS = [
  "hsl(226, 70%, 55%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
  "hsl(270, 70%, 55%)",
  "hsl(199, 89%, 48%)",
];

const chartConfig = {
  value: { label: "Value", color: "hsl(226, 70%, 55%)" },
  calls: { label: "Calls", color: "hsl(226, 70%, 55%)" },
  resolved: { label: "Resolved", color: "hsl(142, 71%, 45%)" },
  pending: { label: "Pending", color: "hsl(38, 92%, 50%)" },
  escalated: { label: "Escalated", color: "hsl(0, 84%, 60%)" },
};

export const ReportSection = ({ title, description, hasChart, hasFilter, note, chartType, chartData }: ReportSectionProps) => {
  const renderChart = () => {
    if (!chartData || chartData.length === 0) return null;

    switch (chartType) {
      case "line":
        return (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(226, 70%, 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(226, 70%, 55%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
              <XAxis dataKey="name" className="text-xs" axisLine={false} tickLine={false} />
              <YAxis className="text-xs" axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="hsl(226, 70%, 55%)" 
                strokeWidth={2.5} 
                dot={{ fill: "hsl(226, 70%, 55%)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                name="Calls"
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="hsl(142, 71%, 45%)" 
                strokeWidth={2.5}
                dot={{ fill: "hsl(142, 71%, 45%)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                name="Resolved"
              />
            </LineChart>
          </ChartContainer>
        );

      case "bar":
        return (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(226, 70%, 55%)" />
                  <stop offset="100%" stopColor="hsl(250, 70%, 60%)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
              <XAxis dataKey="name" className="text-xs" axisLine={false} tickLine={false} />
              <YAxis className="text-xs" axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} name="Value" />
            </BarChart>
          </ChartContainer>
        );

      case "pie":
        const pieDataWithNames = chartData.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length],
        }));
        return (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={pieDataWithNames}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                strokeWidth={0}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieDataWithNames.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#pieGradient${index % COLORS.length})`} name={entry.name} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        );

      case "treemap":
        const treemapData = chartData.map((item, idx) => ({
          ...item,
          fill: COLORS[idx % COLORS.length],
        }));
        return (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <Treemap
              data={treemapData}
              dataKey="value"
              nameKey="name"
              aspectRatio={4 / 3}
              stroke="hsl(var(--background))"
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
    <Card className="overflow-hidden border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2 border-b border-border/30">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Information about {title}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
              {hasFilter && (
                <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs font-medium">
                  Total Calls 
                  <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full">307</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Today
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {chartType && chartData ? (
          <div className="py-2">
            {renderChart()}
          </div>
        ) : null}

        {note && (
          <p className="text-sm text-muted-foreground text-center mt-4 py-3 bg-muted/30 rounded-lg">
            <span className="font-medium text-primary">Note:</span> {note.replace("Note: ", "")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
