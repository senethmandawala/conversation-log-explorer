import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Info, RefreshCw, Calendar, GraduationCap, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Progress } from "@/components/ui/progress";

const skillGapsData = [
  { skill: "Product Knowledge", gap: 35, fill: "hsl(0, 84%, 60%)" },
  { skill: "Communication", gap: 28, fill: "hsl(38, 92%, 50%)" },
  { skill: "Problem Solving", gap: 22, fill: "hsl(38, 92%, 50%)" },
  { skill: "Empathy", gap: 18, fill: "hsl(142, 71%, 45%)" },
  { skill: "Technical Skills", gap: 42, fill: "hsl(0, 84%, 60%)" },
  { skill: "Time Management", gap: 25, fill: "hsl(38, 92%, 50%)" },
];

const agentPerformanceData = [
  { subject: "Product", A: 65, fullMark: 100 },
  { subject: "Communication", A: 72, fullMark: 100 },
  { subject: "Problem Solving", A: 78, fullMark: 100 },
  { subject: "Empathy", A: 82, fullMark: 100 },
  { subject: "Technical", A: 58, fullMark: 100 },
  { subject: "Efficiency", A: 75, fullMark: 100 },
];

const agentsNeedingTrainingData = [
  { id: 1, name: "John Smith", score: 58, areas: ["Product Knowledge", "Technical Skills"], priority: "High" },
  { id: 2, name: "Jane Doe", score: 65, areas: ["Communication", "Empathy"], priority: "Medium" },
  { id: 3, name: "Mike Johnson", score: 62, areas: ["Problem Solving", "Time Management"], priority: "High" },
  { id: 4, name: "Sarah Wilson", score: 70, areas: ["Product Knowledge"], priority: "Low" },
  { id: 5, name: "Chris Brown", score: 55, areas: ["Technical Skills", "Product Knowledge", "Communication"], priority: "High" },
  { id: 6, name: "Emily Davis", score: 68, areas: ["Empathy", "Problem Solving"], priority: "Medium" },
];

const chartConfig = {
  gap: { label: "Skill Gap %", color: "hsl(0, 84%, 60%)" },
};

const statsCards = [
  { title: "Agents Need Training", value: "24", icon: Users, color: "text-red-500", bgColor: "bg-red-500/10" },
  { title: "High Priority Areas", value: "3", icon: AlertTriangle, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { title: "Avg Skill Score", value: "72%", icon: GraduationCap, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { title: "Improvement Rate", value: "+8%", icon: TrendingUp, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
];

export default function TrainingNeedsReport() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();

  useEffect(() => {
    setShowModuleTabs(true);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">High</Badge>;
      case "medium": return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">Medium</Badge>;
      default: return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Low</Badge>;
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
                      Training Needs Analysis
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Identify skill gaps and training requirements</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Agent skill gaps and training priorities
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Skill Gap Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={skillGapsData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" domain={[0, 50]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis dataKey="skill" type="category" width={120} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="gap" radius={[0, 4, 4, 0]}>
                          {skillGapsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Team Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={agentPerformanceData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                        <Radar
                          name="Team Score"
                          dataKey="A"
                          stroke="hsl(226, 70%, 55%)"
                          fill="hsl(226, 70%, 55%)"
                          fillOpacity={0.3}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Agents Requiring Training</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Agent Name</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead>Training Areas</TableHead>
                      <TableHead className="text-center">Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentsNeedingTrainingData.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">{agent.id}</TableCell>
                        <TableCell>{agent.name}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center gap-2">
                            <Progress value={agent.score} className="w-16 h-2" />
                            <span className="text-sm font-medium">{agent.score}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {agent.areas.map((area, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{getPriorityBadge(agent.priority)}</TableCell>
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
