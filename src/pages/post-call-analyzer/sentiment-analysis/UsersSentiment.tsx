import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChartTooltip } from "@/components/ui/custom-chart-tooltip";

interface UsersSentimentProps {
  onSentimentSelect: (sentiment: string) => void;
  data: any;
}

const COLORS = {
  Positive: '#66BB6A',
  Neutral: '#FFCA28',
  Negative: '#E57373'
};

export const UsersSentiment = ({ onSentimentSelect, data }: UsersSentimentProps) => {
  // Transform API data to expected format
  const getSentimentData = () => {
    if (data) {
      return {
        positive: data.positiveCount || 0,
        neutral: data.neutralCount || 0,
        negative: data.negativeCount || 0,
        total: data.totalCount || 0
      };
    }
    // Should never reach here since parent handles loading/error states
    return {
      positive: 0,
      neutral: 0,
      negative: 0,
      total: 0
    };
  };
  
  const sentimentData = getSentimentData();

  const chartData = [
    { name: 'Positive', value: sentimentData.positive, color: COLORS.Positive },
    { name: 'Neutral', value: sentimentData.neutral, color: COLORS.Neutral },
    { name: 'Negative', value: sentimentData.negative, color: COLORS.Negative },
  ];

  const handlePieClick = (data: any, index: number) => {
    onSentimentSelect(data.name);
  };

  // Custom tooltip for sentiment charts with colors
  const SentimentTooltip = ({ active, payload }: any) => {
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
              <Tooltip content={<SentimentTooltip />} />
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
