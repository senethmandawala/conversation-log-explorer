import React from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryProps {
  onCategorySelect: (category: { name: string; color: string }) => void;
  onTotalCallsChange: (count: number) => void;
}

const COLORS = [
  "hsl(226, 70%, 55%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
  "hsl(270, 70%, 55%)",
  "hsl(199, 89%, 48%)",
  "hsl(330, 70%, 55%)",
  "hsl(180, 70%, 45%)",
];

const categoryData = [
  { name: "Billing Issues", value: 350 },
  { name: "Technical Issues", value: 280 },
  { name: "Account Closure", value: 180 },
  { name: "Refund Requests", value: 120 },
  { name: "General Inquiry", value: 90 },
  { name: "Others", value: 60 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0" 
            style={{ backgroundColor: data.fill }}
          />
          <span className="text-sm font-medium text-foreground">
            {data.name}: <span className="font-semibold">{data.value}</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill } = props;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="white"
        strokeWidth={2}
        style={{ cursor: "pointer" }}
        className="hover:opacity-80 transition-opacity"
      />
      {width > 60 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={12}
          fontWeight={500}
          style={{ pointerEvents: "none" }}
        >
          {name}
        </text>
      )}
    </g>
  );
};

export function Category({ onCategorySelect, onTotalCallsChange }: CategoryProps) {
  const chartData = categoryData.map((item, idx) => ({
    ...item,
    fill: COLORS[idx % COLORS.length],
  }));

  const totalCalls = categoryData.reduce((sum, item) => sum + item.value, 0);
  
  React.useEffect(() => {
    onTotalCallsChange(totalCalls);
  }, [totalCalls, onTotalCallsChange]);

  const handleClick = (data: any) => {
    if (data?.name) {
      const category = chartData.find(c => c.name === data.name);
      if (category) {
        onCategorySelect({ name: category.name, color: category.fill });
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 bg-white rounded-md p-2">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={chartData}
            dataKey="value"
            stroke="white"
            fill="hsl(226, 70%, 55%)"
            content={<CustomTreemapContent />}
            onClick={handleClick}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm flex-shrink-0" 
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-xs text-muted-foreground truncate">{item.name}</span>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-3">
        Click on a category to drill down
      </p>
    </div>
  );
}
