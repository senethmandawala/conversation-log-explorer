import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, RefreshCw, Calendar, TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend, Cell } from "recharts";

const hourlyTrafficData = [
  { hour: "00:00", calls: 12 },
  { hour: "02:00", calls: 8 },
  { hour: "04:00", calls: 5 },
  { hour: "06:00", calls: 15 },
  { hour: "08:00", calls: 45 },
  { hour: "09:00", calls: 85 },
  { hour: "10:00", calls: 120 },
  { hour: "11:00", calls: 110 },
  { hour: "12:00", calls: 75 },
  { hour: "13:00", calls: 95 },
  { hour: "14:00", calls: 130 },
  { hour: "15:00", calls: 115 },
  { hour: "16:00", calls: 90 },
  { hour: "17:00", calls: 65 },
  { hour: "18:00", calls: 40 },
  { hour: "20:00", calls: 25 },
  { hour: "22:00", calls: 18 },
];

const weeklyTrendData = [
  { day: "Mon", current: 450, previous: 420 },
  { day: "Tue", current: 520, previous: 480 },
  { day: "Wed", current: 480, previous: 510 },
  { day: "Thu", current: 550, previous: 490 },
  { day: "Fri", current: 620, previous: 580 },
  { day: "Sat", current: 280, previous: 300 },
  { day: "Sun", current: 210, previous: 240 },
];

const categoryTrafficData = [
  { category: "Billing", calls: 320, fill: "hsl(226, 70%, 55%)" },
  { category: "Technical", calls: 280, fill: "hsl(142, 71%, 45%)" },
  { category: "Account", calls: 180, fill: "hsl(38, 92%, 50%)" },
  { category: "Refund", calls: 120, fill: "hsl(0, 84%, 60%)" },
  { category: "General", calls: 90, fill: "hsl(270, 70%, 55%)" },
  { category: "Others", calls: 60, fill: "hsl(199, 89%, 48%)" },
];

const chartConfig = {
  calls: { label: "Calls", color: "hsl(226, 70%, 55%)" },
  current: { label: "This Week", color: "hsl(226, 70%, 55%)" },
  previous: { label: "Last Week", color: "hsl(var(--muted-foreground))" },
};

const statsCards = [
  { title: "Total Calls Today", value: "1,248", icon: Activity, color: "text-blue-500", bgColor: "bg-blue-500/10", change: "+12%" },
  { title: "Peak Hour", value: "2:00 PM", icon: TrendingUp, color: "text-emerald-500", bgColor: "bg-emerald-500/10", change: "130 calls" },
  { title: "Off-Peak Hour", value: "4:00 AM", icon: TrendingDown, color: "text-amber-500", bgColor: "bg-amber-500/10", change: "5 calls" },
  { title: "Week-over-Week", value: "+8.5%", icon: BarChart3, color: "text-violet-500", bgColor: "bg-violet-500/10", change: "vs last week" },
];

export default function TrafficTrendsReport() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();

  useEffect(() => {
    setShowModuleTabs(true);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  return (
    <>
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/post-call-analyzer/reports")}
                  className="h-10 w-10 rounded-lg"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-semibold tracking-tight">
                      Traffic Trends & Patterns
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground/50 hover:text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Visualize traffic trends across time periods</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Hourly, daily, and category-wise traffic analysis
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Today
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statsCards.map((stat, idx) => (
                <Card key={idx} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.title}</p>
                        <p className="text-xl font-semibold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Hourly Traffic Chart */}
            <Card className="border-border/50 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Hourly Traffic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyTrafficData}>
                      <defs>
                        <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(226, 70%, 55%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(226, 70%, 55%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="calls"
                        stroke="hsl(226, 70%, 55%)"
                        fill="url(#colorCalls)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Comparison */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Weekly Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="current" name="This Week" fill="hsl(226, 70%, 55%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="previous" name="Last Week" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.5} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Category Traffic */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Traffic by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryTrafficData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis dataKey="category" type="category" width={80} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="calls" radius={[0, 4, 4, 0]}>
                          {categoryTrafficData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
