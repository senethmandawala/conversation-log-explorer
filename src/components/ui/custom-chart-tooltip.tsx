import React from "react";

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  fill?: string;
  stroke?: string;
  dataKey?: string;
  payload?: Record<string, any>;
}

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  showLabel?: boolean;
  valueFormatter?: (value: number | string) => string;
  labelFormatter?: (label: string) => string;
}

export const CustomChartTooltip = ({ 
  active, 
  payload,
  label,
  showLabel = false,
  valueFormatter = (v) => String(v),
  labelFormatter = (l) => l
}: CustomChartTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl min-w-[140px]">
      {showLabel && label && (
        <p className="text-xs font-medium text-muted-foreground mb-2 pb-2 border-b border-border/50">
          {labelFormatter(label)}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((item, index) => {
          const color = item.color || item.fill || item.stroke || "hsl(var(--primary))";
          const name = item.name || item.dataKey || "Value";
          const value = item.value;

          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-foreground/80">{name}</span>
              </div>
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {valueFormatter(value ?? 0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Pre-configured tooltip for pie/donut charts
export const PieChartTooltip = (props: CustomChartTooltipProps) => (
  <CustomChartTooltip {...props} />
);

// Pre-configured tooltip for bar charts
export const BarChartTooltip = (props: CustomChartTooltipProps) => (
  <CustomChartTooltip {...props} showLabel />
);

// Pre-configured tooltip for line charts
export const LineChartTooltip = (props: CustomChartTooltipProps) => (
  <CustomChartTooltip {...props} showLabel />
);

// Pre-configured tooltip for treemap charts
export const TreemapTooltip = ({ active, payload }: CustomChartTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl min-w-[140px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" 
            style={{ backgroundColor: data.fill }}
          />
          <span className="text-sm text-foreground/80">{data.name}</span>
        </div>
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {data.value}
        </span>
      </div>
    </div>
  );
};
