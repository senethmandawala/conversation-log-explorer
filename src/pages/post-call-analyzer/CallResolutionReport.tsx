import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, RefreshCw, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const resolutionStatusData = [
  { name: "Resolved", value: 65, fill: "hsl(142, 71%, 45%)" },
  { name: "Pending", value: 20, fill: "hsl(38, 92%, 50%)" },
  { name: "Escalated", value: 10, fill: "hsl(0, 84%, 60%)" },
  { name: "Unresolved", value: 5, fill: "hsl(270, 70%, 55%)" },
];

const avgResolutionTimeData = [
  { date: "Mon", time: 5.2 },
  { date: "Tue", time: 4.8 },
  { date: "Wed", time: 6.1 },
  { date: "Thu", time: 4.5 },
  { date: "Fri", time: 5.5 },
  { date: "Sat", time: 7.2 },
  { date: "Sun", time: 6.8 },
];

const chartConfig = {
  time: { label: "Avg Resolution Time (min)", color: "hsl(226, 70%, 55%)" },
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0" 
            style={{ backgroundColor: data.payload.fill }}
          />
          <span className="text-sm font-medium text-foreground">
            {data.name}: <span className="font-semibold">{data.value}</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomAreaTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0" 
            style={{ backgroundColor: "hsl(226, 70%, 55%)" }}
          />
          <span className="text-sm font-medium text-foreground">
            {data.payload.date}: <span className="font-semibold">{data.value} min</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const statsCards = [
  { title: "Avg Resolution Time", value: "5.6 min", icon: Clock, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { title: "First Call Resolution", value: "72%", icon: CheckCircle, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  { title: "Escalation Rate", value: "10%", icon: AlertCircle, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { title: "Unresolved Rate", value: "5%", icon: XCircle, color: "text-red-500", bgColor: "bg-red-500/10" },
];

export default function CallResolutionReport() {
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
                      Call Resolution
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Track resolution rates and handling times</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Resolution status and average handling time analysis
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resolution Status Pie */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Case Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={resolutionStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {resolutionStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="flex justify-center flex-wrap gap-3 mt-2">
                    {resolutionStatusData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.fill }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Avg Resolution Time Area Chart */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Average Resolution Time Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={avgResolutionTimeData}>
                        <defs>
                          <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(226, 70%, 55%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(226, 70%, 55%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <ChartTooltip content={<CustomAreaTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="time"
                          stroke="hsl(226, 70%, 55%)"
                          fill="url(#colorTime)"
                          strokeWidth={2}
                        />
                      </AreaChart>
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
