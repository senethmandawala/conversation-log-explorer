import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";

interface AgentsSentimentTopAgentsProps {
  selectedSentiment: string;
  selectedCategory: { name: string; color: string };
  onClose: () => void;
}

const mockAgentData = [
  { name: 'John Smith', count: 42 },
  { name: 'Sarah Johnson', count: 36 },
  { name: 'Mike Wilson', count: 30 },
  { name: 'Emily Davis', count: 26 },
  { name: 'David Brown', count: 22 },
  { name: 'Lisa Anderson', count: 19 },
  { name: 'James Taylor', count: 16 },
  { name: 'Maria Garcia', count: 13 },
];

const generateShades = (baseColor: string, count: number) => {
  const shades = [];
  for (let i = 0; i < count; i++) {
    const opacity = 1 - (i * 0.08);
    shades.push(`${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`);
  }
  return shades;
};

export const AgentsSentimentTopAgents = ({ 
  selectedSentiment, 
  selectedCategory,
  onClose 
}: AgentsSentimentTopAgentsProps) => {
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState(mockAgentData);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setAgentData(mockAgentData);
      setColors(generateShades(selectedCategory.color, mockAgentData.length));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedSentiment, selectedCategory]);

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <small className="text-muted-foreground">
              {selectedSentiment} / {selectedCategory.name}
            </small>
            <h5 className="text-lg font-semibold">Top Agents</h5>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={agentData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number"
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={11}
              width={100}
            />
            <Tooltip 
              content={<BarChartTooltip />}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Bar 
              dataKey="count" 
              radius={[0, 4, 4, 0]}
            >
              {agentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
