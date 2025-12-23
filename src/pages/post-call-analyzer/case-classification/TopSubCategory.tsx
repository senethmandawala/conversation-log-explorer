import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";

interface TopSubCategoryProps {
  category: { name: string; color: string };
  onSubCategorySelect: (subCategory: string) => void;
}

const subcategoryData: Record<string, { name: string; value: number }[]> = {
  "Billing Issues": [
    { name: "Invoice Disputes", value: 120 },
    { name: "Payment Failed", value: 95 },
    { name: "Refund Processing", value: 75 },
    { name: "Pricing Questions", value: 60 },
  ],
  "Technical Issues": [
    { name: "Login Problems", value: 95 },
    { name: "App Crashes", value: 72 },
    { name: "Integration Issues", value: 68 },
    { name: "Performance Lag", value: 45 },
  ],
  "Account Closure": [
    { name: "Voluntary Closure", value: 85 },
    { name: "Inactive Account", value: 48 },
    { name: "Fraud Prevention", value: 32 },
    { name: "Duplicate Account", value: 15 },
  ],
  "Refund Requests": [
    { name: "Service Issues", value: 55 },
    { name: "Billing Errors", value: 35 },
    { name: "Unused Credits", value: 20 },
    { name: "Cancellation", value: 10 },
  ],
  "General Inquiry": [
    { name: "Product Info", value: 40 },
    { name: "Pricing Plans", value: 28 },
    { name: "Feature Requests", value: 15 },
    { name: "Partnership", value: 7 },
  ],
  "Others": [
    { name: "Feedback", value: 30 },
    { name: "Complaints", value: 18 },
    { name: "Suggestions", value: 8 },
    { name: "Misc", value: 4 },
  ],
};

function generateShades(baseColor: string, count: number): string[] {
  const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!hslMatch) return Array(count).fill(baseColor);
  
  const [, h, s, l] = hslMatch;
  const lightness = parseInt(l);
  
  return Array.from({ length: count }, (_, i) => {
    const newLightness = lightness - (i * 8);
    return `hsl(${h}, ${s}%, ${Math.max(20, newLightness)}%)`;
  });
}

export function TopSubCategory({ category, onSubCategorySelect }: TopSubCategoryProps) {
  const data = subcategoryData[category.name] || [];
  const colors = generateShades(category.color, data.length);
  
  const chartData = data.map((item, idx) => ({
    ...item,
    fill: colors[idx],
  }));

  const handleClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload?.name) {
      onSubCategorySelect(data.activePayload[0].payload.name);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
            onClick={handleClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={11}
            />
            <Tooltip content={<BarChartTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} cursor="pointer">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-2">
        Click on a bar to drill down further
      </p>
    </div>
  );
}
