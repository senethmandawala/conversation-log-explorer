import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface AverageTimeTopAgentsProps {
  selectedCategory: { name: string; color: string };
  onClose: () => void;
}

const mockAgentData = [
  { name: 'John Smith', avgTime: 14.2 },
  { name: 'Sarah Johnson', avgTime: 12.8 },
  { name: 'Mike Wilson', avgTime: 11.5 },
  { name: 'Emily Davis', avgTime: 10.3 },
  { name: 'David Brown', avgTime: 9.7 },
  { name: 'Lisa Anderson', avgTime: 8.9 },
  { name: 'James Taylor', avgTime: 7.6 },
  { name: 'Maria Garcia', avgTime: 6.4 },
];

const generateShades = (baseColor: string, count: number) => {
  const shades = [];
  for (let i = 0; i < count; i++) {
    const opacity = 1 - (i * 0.08);
    shades.push(`${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`);
  }
  return shades;
};

export const AverageTimeTopAgents = ({ 
  selectedCategory,
  onClose 
}: AverageTimeTopAgentsProps) => {
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
  }, [selectedCategory]);

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
            <small className="text-muted-foreground">{selectedCategory.name}</small>
            <h5 className="text-lg font-semibold">Top Agents</h5>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={agentData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number"
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              label={{ value: 'Avg Time (min)', position: 'insideBottom', offset: -5, style: { fontWeight: 700 } }}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={11}
              width={120}
              label={{ value: 'Agents', angle: -90, position: 'insideLeft', style: { fontWeight: 700 } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              cursor={{ fill: 'hsl(var(--muted))' }}
              formatter={(value: number) => [`${value.toFixed(1)} min`, 'Avg Time']}
            />
            <Bar 
              dataKey="avgTime" 
              radius={[0, 4, 4, 0]}
              barSize={20}
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
