import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface AverageTimeTopCategoriesProps {
  onCategorySelect: (category: { name: string; color: string }) => void;
}

const COLORS = ['#4285F4', '#34A853', '#FBBC04', '#EA4335', '#9C27B0', '#FF6F00', '#00ACC1', '#7CB342'];

const mockCategoryData = [
  { name: 'Billing Issues', avgTime: 12.5 },
  { name: 'Technical Support', avgTime: 18.3 },
  { name: 'Account Management', avgTime: 8.7 },
  { name: 'Product Inquiry', avgTime: 6.2 },
  { name: 'Service Complaint', avgTime: 15.8 },
  { name: 'Refund Request', avgTime: 10.4 },
  { name: 'General Query', avgTime: 5.1 },
  { name: 'Feature Request', avgTime: 14.6 },
];

export const AverageTimeTopCategories = ({ 
  onCategorySelect
}: AverageTimeTopCategoriesProps) => {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(mockCategoryData);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setCategoryData(mockCategoryData);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
        <h5 className="text-lg font-semibold mb-4">Top Categories by Average Time</h5>

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
              label={{ value: 'Avg Time (min)', angle: -90, position: 'insideLeft', style: { fontWeight: 700 } }}
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
