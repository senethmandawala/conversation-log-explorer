import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Info, RefreshCw, Calendar, Phone, TrendingUp, Users } from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const topCallersData = [
  { id: 1, msisdn: "+1234567890", callCount: 28, avgDuration: "6:45", lastCall: "2024-01-15", category: "Billing Issues", sentiment: "Negative" },
  { id: 2, msisdn: "+1987654321", callCount: 22, avgDuration: "4:30", lastCall: "2024-01-15", category: "Technical Issues", sentiment: "Neutral" },
  { id: 3, msisdn: "+1122334455", callCount: 19, avgDuration: "8:12", lastCall: "2024-01-14", category: "Account Closure", sentiment: "Negative" },
  { id: 4, msisdn: "+1555666777", callCount: 16, avgDuration: "5:20", lastCall: "2024-01-14", category: "Billing Issues", sentiment: "Positive" },
  { id: 5, msisdn: "+1888999000", callCount: 14, avgDuration: "7:05", lastCall: "2024-01-13", category: "Technical Issues", sentiment: "Neutral" },
  { id: 6, msisdn: "+1444555666", callCount: 12, avgDuration: "3:45", lastCall: "2024-01-13", category: "General Inquiry", sentiment: "Positive" },
  { id: 7, msisdn: "+1777888999", callCount: 11, avgDuration: "9:30", lastCall: "2024-01-12", category: "Refund Requests", sentiment: "Negative" },
  { id: 8, msisdn: "+1333444555", callCount: 10, avgDuration: "4:15", lastCall: "2024-01-12", category: "Technical Issues", sentiment: "Neutral" },
];

const callDistributionData = [
  { range: "1-2 calls", count: 450 },
  { range: "3-5 calls", count: 280 },
  { range: "6-10 calls", count: 120 },
  { range: "11-20 calls", count: 45 },
  { range: "20+ calls", count: 15 },
];

const COLORS = ["hsl(226, 70%, 55%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)", "hsl(270, 70%, 55%)"];

const chartConfig = {
  count: { label: "Callers", color: "hsl(226, 70%, 55%)" },
};

const statsCards = [
  { title: "Total Frequent Callers", value: "910", icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { title: "Repeat Call Rate", value: "18%", icon: TrendingUp, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { title: "Avg Calls per Caller", value: "3.2", icon: Phone, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
];

export default function FrequentCallersReport() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();

  useEffect(() => {
    setShowModuleTabs(true);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Positive</Badge>;
      case "negative": return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Negative</Badge>;
      default: return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">Neutral</Badge>;
    }
  };

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
                      Frequent Callers
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Identify top callers and repeat call patterns</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Top callers and call frequency distribution
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Call Distribution Chart */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Call Frequency Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={callDistributionData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis dataKey="range" type="category" width={80} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {callDistributionData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Top Callers Table */}
              <Card className="border-border/50 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Top Callers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto max-h-[340px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">#</TableHead>
                          <TableHead>MSISDN</TableHead>
                          <TableHead className="text-center">Calls</TableHead>
                          <TableHead>Avg Duration</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-center">Sentiment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topCallersData.map((caller) => (
                          <TableRow key={caller.id}>
                            <TableCell className="font-medium">{caller.id}</TableCell>
                            <TableCell className="font-mono text-sm">{caller.msisdn}</TableCell>
                            <TableCell className="text-center font-semibold">{caller.callCount}</TableCell>
                            <TableCell>{caller.avgDuration}</TableCell>
                            <TableCell className="text-sm">{caller.category}</TableCell>
                            <TableCell className="text-center">{getSentimentBadge(caller.sentiment)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
