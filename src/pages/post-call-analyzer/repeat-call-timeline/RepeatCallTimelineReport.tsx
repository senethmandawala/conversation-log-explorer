import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw, Calendar, List } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";
import { ReasonWiseRepeatCall } from "./ReasonWiseRepeatCall.tsx";
import { CategoryWiseRepeatCall } from "./CategoryWiseRepeatCall.tsx";
import { AgentRepeatCallHandling } from "./AgentRepeatCallHandling.tsx";

// Mock data for the main timeline chart
const generateTimelineData = () => {
  const days = ['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'];
  return days.map(day => ({
    date: day,
    totalCalls: Math.floor(Math.random() * 50) + 70,
    repeatCalls: Math.floor(Math.random() * 20) + 15,
    uniqueCustomers: Math.floor(Math.random() * 40) + 50,
  }));
};

const CustomLineTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-lg space-y-1">
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm flex-shrink-0" 
              style={{ backgroundColor: item.stroke }}
            />
            <span className="text-sm font-medium text-foreground">
              {item.name}: <span className="font-semibold">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RepeatCallTimelineReport() {
  const [loading, setLoading] = useState(false);
  const [timelineData, setTimelineData] = useState(generateTimelineData());
  const [dailyRepeatRate, setDailyRepeatRate] = useState("23.5");
  const [mostAffectedCategory, setMostAffectedCategory] = useState("Billing Issues");

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setTimelineData(generateTimelineData());
      setDailyRepeatRate((Math.random() * 30 + 15).toFixed(1));
      setLoading(false);
    }, 500);
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">7 Day Repeat Call Timeline</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Track repeat callers over the past 7 days</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm text-muted-foreground">Jun 19 - Jun 25, 2025</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Calendar className="h-4 w-4" />
              Week
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleReload}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Daily Repeat Rate</p>
                  <p className="text-2xl font-bold text-foreground">{dailyRepeatRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Info className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Most Affected Category</p>
                  <p className="text-lg font-bold text-foreground">{mostAffectedCategory}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Timeline Chart */}
        <div className="mb-6">
          {loading ? (
            <div className="flex items-center justify-center h-[350px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  className="text-xs" 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  className="text-xs" 
                  axisLine={false} 
                  tickLine={false}
                />
                <RechartsTooltip content={<CustomLineTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalCalls" 
                  stroke="#737FC4" 
                  strokeWidth={3}
                  dot={{ fill: "#737FC4", strokeWidth: 0, r: 4 }}
                  name="Total Calls"
                />
                <Line 
                  type="monotone" 
                  dataKey="repeatCalls" 
                  stroke="#83C180" 
                  strokeWidth={3}
                  dot={{ fill: "#83C180", strokeWidth: 0, r: 4 }}
                  name="Repeat Calls"
                />
                <Line 
                  type="monotone" 
                  dataKey="uniqueCustomers" 
                  stroke="#F5AF4E" 
                  strokeWidth={3}
                  dot={{ fill: "#F5AF4E", strokeWidth: 0, r: 4 }}
                  name="Unique Customers"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sub-reports */}
        <div className="space-y-6 mt-8">
          <ReasonWiseRepeatCall />
          <CategoryWiseRepeatCall />
          <AgentRepeatCallHandling />
        </div>
      </CardContent>
    </Card>
  );
}
