import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";

interface AgentsSentimentTopCategoryProps {
  selectedSentiment: string;
  onCategorySelect: (category: { name: string; color: string }) => void;
  onClose: () => void;
}

const COLORS = ['#4285F4', '#34A853', '#FBBC04', '#EA4335', '#9C27B0', '#FF6F00', '#00ACC1', '#7CB342'];

const mockCategoryData = [
  { name: 'Billing Issues', count: 125 },
  { name: 'Technical Support', count: 108 },
  { name: 'Account Management', count: 88 },
  { name: 'Product Inquiry', count: 77 },
  { name: 'Service Complaint', count: 66 },
  { name: 'Refund Request', count: 55 },
  { name: 'General Query', count: 44 },
  { name: 'Feature Request', count: 33 },
];

export const AgentsSentimentTopCategory = ({ 
  selectedSentiment, 
  onCategorySelect,
  onClose 
}: AgentsSentimentTopCategoryProps) => {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(mockCategoryData);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setCategoryData(mockCategoryData);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedSentiment]);

  const handleBarClick = (data: any, index: number) => {
    onCategorySelect({
      name: data.name,
      color: COLORS[index % COLORS.length]
    });
  };

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
            <small className="text-muted-foreground">{selectedSentiment}</small>
            <h5 className="text-lg font-semibold">Top Categories</h5>
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

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={80}
              hide
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              label={{ value: 'Call Count', angle: -90, position: 'insideLeft', style: { fontWeight: 700 } }}
            />
            <Tooltip 
              content={<BarChartTooltip />}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {categoryData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-muted-foreground truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
