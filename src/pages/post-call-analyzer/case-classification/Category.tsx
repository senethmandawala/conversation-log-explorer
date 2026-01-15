import React from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { TreemapTooltip } from "@/components/ui/custom-chart-tooltip";

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

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill } = props;
  
  // Skip rendering if there's no valid name (this filters out the root node)
  if (!name) {
    return null;
  }

  // Simplified text rendering for treemap cells
  const padding = 10;
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  
  // Simple font size calculation
  let fontSize = Math.min(availableWidth / (name.length * 0.7), availableHeight / 1.5, 12);
  fontSize = Math.max(fontSize, 6); // Minimum readable size
  
  // Truncate if too long
  let displayText = name;
  const maxChars = Math.floor(availableWidth / (fontSize * 0.7));
  if (name.length > maxChars && maxChars > 3) {
    displayText = name.substring(0, maxChars - 2) + '..';
  }
  
  // Show text if box is reasonably sized
  const showText = width > 40 && height > 25 && fontSize >= 6;
  
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
      {showText && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={fontSize}
          fontWeight={400}
          style={{ pointerEvents: "none" }}
        >
          {displayText}
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
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 bg-white rounded-lg p-8">
        <ResponsiveContainer width="100%" height={250}>
          <Treemap
            data={chartData}
            dataKey="value"
            stroke="white"
            fill="hsl(226, 70%, 55%)"
            content={<CustomTreemapContent />}
            onClick={handleClick}
          >
            <Tooltip content={<TreemapTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-1 py-1">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 min-h-[20px]">
            <div 
              className="w-3 h-3 rounded-sm flex-shrink-0 border border-gray-200"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-xs text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-center text-gray-500 mt-2 pt-2 border-t border-gray-100">
        Click on a category to drill down
      </div>
    </div>
  );
}
