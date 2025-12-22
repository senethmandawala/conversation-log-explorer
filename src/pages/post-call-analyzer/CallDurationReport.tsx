import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Info, RefreshCw, Calendar, Clock, TrendingDown, TrendingUp, Timer } from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LineChart, Line } from "recharts";

const durationDistributionData = [
  { range: "0-2 min", count: 180, fill: "hsl(142, 71%, 45%)" },
  { range: "2-5 min", count: 320, fill: "hsl(199, 89%, 48%)" },
  { range: "5-10 min", count: 280, fill: "hsl(226, 70%, 55%)" },
  { range: "10-15 min", count: 120, fill: "hsl(38, 92%, 50%)" },
  { range: "15+ min", count: 60, fill: "hsl(0, 84%, 60%)" },
];

const avgDurationTrendData = [
  { date: "Mon", duration: 5.2 },
  { date: "Tue", duration: 4.8 },
  { date: "Wed", duration: 6.1 },
  { date: "Thu", duration: 5.5 },
  { date: "Fri", duration: 4.9 },
  { date: "Sat", duration: 7.2 },
  { date: "Sun", duration: 6.5 },
];

const longCallsData = [
  { id: 1, msisdn: "+1234567890", duration: "25:30", category: "Technical Issues", agent: "John Smith", date: "2024-01-15" },
  { id: 2, msisdn: "+1987654321", duration: "22:15", category: "Account Closure", agent: "Jane Doe", date: "2024-01-15" },
  { id: 3, msisdn: "+1122334455", duration: "19:45", category: "Billing Issues", agent: "Mike Johnson", date: "2024-01-14" },
  { id: 4, msisdn: "+1555666777", duration: "18:20", category: "Refund Requests", agent: "Sarah Wilson", date: "2024-01-14" },
  { id: 5, msisdn: "+1888999000", duration: "17:50", category: "Technical Issues", agent: "Chris Brown", date: "2024-01-13" },
];

const chartConfig = {
  count: { label: "Calls", color: "hsl(226, 70%, 55%)" },
  duration: { label: "Avg Duration (min)", color: "hsl(142, 71%, 45%)" },
};

const statsCards = [
  { title: "Avg Call Duration", value: "5.6 min", icon: Clock, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { title: "Shortest Call", value: "0:32", icon: TrendingDown, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  { title: "Longest Call", value: "25:30", icon: TrendingUp, color: "text-red-500", bgColor: "bg-red-500/10" },
  { title: "Long Calls (15+ min)", value: "60", icon: Timer, color: "text-amber-500", bgColor: "bg-amber-500/10" },
];

export default function CallDurationReport() {
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
                      Call Duration Analysis
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground/50 hover:text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Analyze call duration patterns and identify long calls</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Duration distribution and long call analysis
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
              {/* Duration Distribution */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Call Duration Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={durationDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {durationDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Duration Trend */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Average Duration Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={avgDurationTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="duration"
                          stroke="hsl(142, 71%, 45%)"
                          strokeWidth={2}
                          dot={{ fill: "hsl(142, 71%, 45%)", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Long Calls Table */}
            <Card className="border-border/50 mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Long Calls (15+ minutes)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>MSISDN</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {longCallsData.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell className="font-medium">{call.id}</TableCell>
                        <TableCell className="font-mono text-sm">{call.msisdn}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                            {call.duration}
                          </Badge>
                        </TableCell>
                        <TableCell>{call.category}</TableCell>
                        <TableCell>{call.agent}</TableCell>
                        <TableCell className="text-muted-foreground">{call.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
