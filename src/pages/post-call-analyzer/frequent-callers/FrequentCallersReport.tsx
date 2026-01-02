import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, RefreshCw, Calendar, List } from "lucide-react";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip as RechartsTooltip } from "recharts";

const mockFrequentCallersData = [
  { msisdn: "+94771234567", callCount: 28 },
  { msisdn: "+94772345678", callCount: 22 },
  { msisdn: "+94773456789", callCount: 22 },
  { msisdn: "+94774567890", callCount: 19 },
  { msisdn: "+94775678901", callCount: 16 },
  { msisdn: "+94776789012", callCount: 14 },
  { msisdn: "+94777890123", callCount: 12 },
  { msisdn: "+94778901234", callCount: 11 },
  { msisdn: "+94779012345", callCount: 10 },
  { msisdn: "+94770123456", callCount: 10 },
];

const PURPLE_GRADIENT_COLORS = [
  '#311B92',
  '#4527A0',
  '#512DA8',
  '#5E35B1',
  '#673AB7',
  '#7E57C2',
  '#9575CD',
  '#B39DDB',
  '#D1C4E9',
  '#EDE7F6',
];

const getAdjustedColors = (data: { callCount: number }[]) => {
  const adjustedColors: string[] = [];
  let colorIndex = 0;
  
  data.forEach((item, index) => {
    if (index === 0) {
      adjustedColors.push(PURPLE_GRADIENT_COLORS[0]);
    } else {
      if (data[index].callCount === data[index - 1].callCount) {
        adjustedColors.push(PURPLE_GRADIENT_COLORS[colorIndex]);
      } else {
        colorIndex++;
        adjustedColors.push(PURPLE_GRADIENT_COLORS[colorIndex]);
      }
    }
  });
  
  return adjustedColors;
};

export default function FrequentCallersReport() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(mockFrequentCallersData);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartData(mockFrequentCallersData);
      setColors(getAdjustedColors(mockFrequentCallersData));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleReload = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setChartData(mockFrequentCallersData);
      setColors(getAdjustedColors(mockFrequentCallersData));
      setLoading(false);
    }, 500);
  };

  return (
    <Card className="h-full border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">Frequent Callers</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Top callers by call frequency</p>
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
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <p className="text-lg font-medium">No Data Available</p>
            <p className="text-sm">No frequent callers found for the selected period</p>
          </div>
        ) : (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={450}>
              <BarChart 
                data={chartData} 
                layout="vertical" 
                margin={{ top: 5, right: 30, left: 100, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(value) => Math.floor(value).toString()}
                />
                <YAxis 
                  type="category"
                  dataKey="msisdn" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  width={100}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value, 'Call Count']}
                />
                <Bar 
                  dataKey="callCount" 
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
