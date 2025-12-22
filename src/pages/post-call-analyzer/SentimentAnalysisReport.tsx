import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, RefreshCw, Calendar } from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const userSentimentData = [
  { name: "Positive", value: 45, fill: "hsl(142, 71%, 45%)" },
  { name: "Neutral", value: 35, fill: "hsl(38, 92%, 50%)" },
  { name: "Negative", value: 20, fill: "hsl(0, 84%, 60%)" },
];

const agentSentimentData = [
  { name: "Positive", value: 55, fill: "hsl(142, 71%, 45%)" },
  { name: "Neutral", value: 38, fill: "hsl(38, 92%, 50%)" },
  { name: "Negative", value: 7, fill: "hsl(0, 84%, 60%)" },
];

const sentimentTrendData = [
  { date: "Mon", userPositive: 42, userNegative: 18, agentPositive: 52, agentNegative: 8 },
  { date: "Tue", userPositive: 45, userNegative: 22, agentPositive: 55, agentNegative: 6 },
  { date: "Wed", userPositive: 48, userNegative: 15, agentPositive: 58, agentNegative: 5 },
  { date: "Thu", userPositive: 40, userNegative: 25, agentPositive: 50, agentNegative: 10 },
  { date: "Fri", userPositive: 50, userNegative: 18, agentPositive: 60, agentNegative: 7 },
  { date: "Sat", userPositive: 38, userNegative: 20, agentPositive: 48, agentNegative: 8 },
  { date: "Sun", userPositive: 35, userNegative: 22, agentPositive: 45, agentNegative: 9 },
];

const chartConfig = {
  userPositive: { label: "User Positive", color: "hsl(142, 71%, 45%)" },
  userNegative: { label: "User Negative", color: "hsl(0, 84%, 60%)" },
  agentPositive: { label: "Agent Positive", color: "hsl(199, 89%, 48%)" },
  agentNegative: { label: "Agent Negative", color: "hsl(270, 70%, 55%)" },
};

export default function SentimentAnalysisReport() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();

  useEffect(() => {
    setShowModuleTabs(true);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header Card */}
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
                      Sentiment Analysis
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground/50 hover:text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Analyze user and agent sentiment patterns</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    User and agent sentiment distribution across calls
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Sentiment Pie */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">User Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userSentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {userSentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {userSentimentData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.fill }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Agent Sentiment Pie */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Agent Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={agentSentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {agentSentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {agentSentimentData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.fill }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sentiment Trend */}
            <Card className="border-border/50 mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Sentiment Trend (7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sentimentTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="userPositive" name="User Positive" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="userNegative" name="User Negative" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="agentPositive" name="Agent Positive" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="agentNegative" name="Agent Negative" fill="hsl(270, 70%, 55%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
