import React from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CategoryProps {
  onCategorySelect: (category: { name: string; color: string }) => void;
  onTotalCallsChange: (count: number) => void;
  data: any[];
}

// Get colors from env.js
const categoryColors = (window as any).env_vars?.colors;

// Custom tooltip using RedAlert style
const TreemapTooltipContent = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="z-50 overflow-hidden rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm text-card-foreground backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 justify-start">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: data.fill }}
            />
            <p className="font-medium m-0">{data.name}</p>
          </div>
          <div className="text-sm ml-5">
            Value: {data.value}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

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

export function Category({ onCategorySelect, onTotalCallsChange, data }: CategoryProps) {
  const chartData = data.map((item, idx) => ({
    name: item.category,
    value: item.count,
    fill: categoryColors?.[idx % categoryColors.length] || `hsl(${idx * 30}, 70%, 50%)`,
  }));

  const totalCalls = data.reduce((sum, item) => sum + item.count, 0);
  
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
            <Tooltip content={<TreemapTooltipContent />} />
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
