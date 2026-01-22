import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CaseStatusOverallProps {
  onCaseSelect: (caseType: string) => void;
  data: any;
}

const COLORS = {
  Open: '#64B5F6',
  Closed: '#66BB6A'
};

// Custom tooltip for case status charts
const CaseStatusTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl min-w-[140px]">
      <div className="space-y-1.5">
        {payload.map((item: any, index: number) => {
          const color = item.payload?.color || item.color || item.fill || "hsl(var(--primary))";
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
                {value ?? 0}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CaseStatusOverall = ({ onCaseSelect, data }: CaseStatusOverallProps) => {
  // Transform API data to expected format
  const getStatusData = () => {
    if (data) {
      return {
        open: data.openCasesCount || 0,
        closed: data.closedCasesCount || 0,
        total: data.totalCasesCount || 0
      };
    }
    return {
      open: 0,
      closed: 0,
      total: 0
    };
  };
  
  const statusData = getStatusData();

  const chartData = [
    { name: 'Open', value: statusData.open, color: COLORS.Open },
    { name: 'Closed', value: statusData.closed, color: COLORS.Closed },
  ];

  const handlePieClick = (data: any, index: number) => {
    // Map display name to API caseStatus value
    const caseStatusMap: Record<string, string> = {
      'Open': 'open',
      'Closed': 'close'
    };
    onCaseSelect(caseStatusMap[data.name] || data.name.toLowerCase());
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <h5 className="text-lg font-semibold mb-4">Overall Case Status</h5>
        
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
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-sm font-semibold"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {value}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CaseStatusTooltip />} />
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
            <div className="text-center" style={{ color: COLORS.Closed }}>
              <p className="text-xs text-muted-foreground mb-1">Closed</p>
              <h3 className="text-2xl font-bold">{statusData.closed}</h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};