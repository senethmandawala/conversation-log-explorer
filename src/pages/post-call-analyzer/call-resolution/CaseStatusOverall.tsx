import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CaseStatusOverallProps {
  onCaseSelect: (caseType: string) => void;
}

const COLORS = {
  Open: '#64B5F6',
  Close: '#B2BDC1'
};

export const CaseStatusOverall = ({ onCaseSelect }: CaseStatusOverallProps) => {
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState({
    open: 320,
    close: 680,
    total: 1000
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const chartData = [
    { name: 'Open', value: statusData.open, color: COLORS.Open },
    { name: 'Close', value: statusData.close, color: COLORS.Close },
  ];

  const handlePieClick = (data: any, index: number) => {
    onCaseSelect(data.name);
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
        <h5 className="text-lg font-semibold mb-4">Overall</h5>
        
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

          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <h3 className="text-2xl font-bold">{statusData.total}</h3>
            </div>
            <div className="text-center" style={{ color: COLORS.Open }}>
              <p className="text-xs text-muted-foreground mb-1">Open</p>
              <h3 className="text-2xl font-bold">{statusData.open}</h3>
            </div>
            <div className="text-center" style={{ color: COLORS.Close }}>
              <p className="text-xs text-muted-foreground mb-1">Close</p>
              <h3 className="text-2xl font-bold">{statusData.close}</h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
