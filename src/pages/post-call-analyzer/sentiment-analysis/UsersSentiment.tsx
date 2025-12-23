import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface UsersSentimentProps {
  onSentimentSelect: (sentiment: string) => void;
}

const COLORS = {
  Positive: '#66BB6A',
  Neutral: '#FFCA28',
  Negative: '#E57373'
};

export const UsersSentiment = ({ onSentimentSelect }: UsersSentimentProps) => {
  const [loading, setLoading] = useState(true);
  const [sentimentData, setSentimentData] = useState({
    positive: 450,
    neutral: 350,
    negative: 200,
    total: 1000
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const chartData = [
    { name: 'Positive', value: sentimentData.positive, color: COLORS.Positive },
    { name: 'Neutral', value: sentimentData.neutral, color: COLORS.Neutral },
    { name: 'Negative', value: sentimentData.negative, color: COLORS.Negative },
  ];

  const handlePieClick = (data: any, index: number) => {
    onSentimentSelect(data.name);
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
        <h5 className="text-lg font-semibold mb-4">User Sentiment</h5>
        
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                onClick={handlePieClick}
                style={{ cursor: 'pointer' }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="w-full border-t border-border/30 my-4"></div>

          <div className="grid grid-cols-4 gap-4 w-full">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <h3 className="text-2xl font-bold">{sentimentData.total}</h3>
            </div>
            <div className="text-center" style={{ color: COLORS.Positive }}>
              <p className="text-xs text-muted-foreground mb-1">Positive</p>
              <h3 className="text-2xl font-bold">{sentimentData.positive}</h3>
            </div>
            <div className="text-center" style={{ color: COLORS.Neutral }}>
              <p className="text-xs text-muted-foreground mb-1">Neutral</p>
              <h3 className="text-2xl font-bold">{sentimentData.neutral}</h3>
            </div>
            <div className="text-center" style={{ color: COLORS.Negative }}>
              <p className="text-xs text-muted-foreground mb-1">Negative</p>
              <h3 className="text-2xl font-bold">{sentimentData.negative}</h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
