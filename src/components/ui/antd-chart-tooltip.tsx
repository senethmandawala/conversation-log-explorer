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

interface AntdChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  showLabel?: boolean;
  valueFormatter?: (value: number | string) => string;
  labelFormatter?: (label: string) => string;
}

/**
 * Ant Design styled tooltip component for Recharts
 * Provides consistent styling across all charts in the Post Call Analyzer
 */
export const AntdChartTooltip = ({ 
  active, 
  payload,
  label,
  showLabel = false,
  valueFormatter = (v) => String(v),
  labelFormatter = (l) => l
}: AntdChartTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white/[0.98] backdrop-blur-sm border border-slate-200 rounded-lg py-3 px-4 shadow-lg min-w-[140px]">
      {showLabel && label && (
        <p className="text-xs font-medium text-slate-500 mb-2 pb-2 border-b border-slate-200">
          {labelFormatter(label)}
        </p>
      )}
      <div className="flex flex-col gap-1.5">
        {payload.map((item, index) => {
          const color = item.color || item.fill || item.stroke || '#6366f1';
          const name = item.name || item.dataKey || 'Value';
          const value = item.value;

          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}40` }}
                />
                <span className="text-[13px] text-slate-600">{name}</span>
              </div>
              <span className="text-[13px] font-semibold text-slate-800">
                {valueFormatter(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Pre-configured tooltip for pie/donut charts
 */
export const AntdPieChartTooltip = (props: AntdChartTooltipProps) => (
  <AntdChartTooltip {...props} />
);

/**
 * Pre-configured tooltip for bar charts with label display
 */
export const AntdBarChartTooltip = (props: AntdChartTooltipProps) => (
  <AntdChartTooltip {...props} showLabel />
);

/**
 * Pre-configured tooltip for line charts with label display
 */
export const AntdLineChartTooltip = (props: AntdChartTooltipProps) => (
  <AntdChartTooltip {...props} showLabel />
);

/**
 * Pre-configured tooltip for area charts with label display
 */
export const AntdAreaChartTooltip = (props: AntdChartTooltipProps) => (
  <AntdChartTooltip {...props} showLabel />
);

/**
 * Pre-configured tooltip for treemap charts
 */
export const AntdTreemapTooltip = ({ active, payload }: AntdChartTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        minWidth: '160px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{ 
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              flexShrink: 0,
              backgroundColor: data.fill,
              boxShadow: `0 0 4px ${data.fill}40`,
            }}
          />
          <span style={{ fontSize: '13px', color: '#475569' }}>{data.name}</span>
        </div>
        <span 
          style={{ 
            fontSize: '13px',
            fontWeight: 600,
            color: '#1e293b',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {data.value}
        </span>
      </div>
    </div>
  );
};

/**
 * Customizable tooltip with full control over rendering
 */
export interface CustomTooltipRenderProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export const createAntdTooltip = (
  renderContent: (props: CustomTooltipRenderProps) => React.ReactNode
) => {
  return ({ active, payload, label }: CustomTooltipRenderProps) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div 
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
          minWidth: '160px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {renderContent({ active, payload, label })}
      </div>
    );
  };
};
