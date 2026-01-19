import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";

// Get colors from environment config
const COLORS = window.env_vars?.colors || ['#4285F4', '#34A853', '#FBBC04', '#EA4335', '#9C27B0', '#FF6F00', '#00ACC1', '#7CB342'];

interface AverageTimeTopCategoriesProps {
  onCategorySelect: (category: { name: string; color: string }) => void;
  data: any[];
  loading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

// Custom tooltip for category time charts
const CategoryTimeTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl min-w-[180px]">
      <div className="space-y-1.5">
        {payload.map((item: any, index: number) => {
          const color = item.payload?.color || item.color || item.fill || "hsl(var(--primary))";
          const name = item.payload?.name || item.name || "Category";
          const avgDuration = item.payload?.averageCallDuration || '--';
          const callCount = item.payload?.callCount || 0;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-foreground">{name}</span>
              </div>
              <div className="pl-4 space-y-0.5">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/70">Avg Time:</span>
                  <span className="font-medium">{avgDuration}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/70">Calls:</span>
                  <span className="font-medium">{callCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AverageTimeTopCategories = ({ 
  onCategorySelect,
  data,
  loading = false,
  hasError = false,
  onRetry
}: AverageTimeTopCategoriesProps) => {
  // Transform API data to chart format
  const categoryData = data.map((item: any, index: number) => ({
    name: item.category || 'Unknown',
    avgTime: item.averageCallDurationInSec ? item.averageCallDurationInSec / 60 : 0, // Convert to minutes
    averageCallDuration: item.averageCallDuration || '--',
    callCount: item.callCount || 0,
    callDuration: item.callDuration || '--',
    color: COLORS[index % COLORS.length]
  })).sort((a, b) => b.avgTime - a.avgTime);

  const handleBarClick = (data: any, index: number) => {
    onCategorySelect({
      name: data.name,
      color: data.color
    });
  };

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[400px]">
            <ExceptionHandleView type="loading" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (hasError) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[400px]">
            <ExceptionHandleView 
              type="500" 
              title="Error Loading Categories"
              content="category time data"
              onTryAgain={onRetry}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!categoryData.length) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[400px]">
            <ExceptionHandleView 
              type="204" 
              title="No Categories Found"
              content="category time data for the selected period"
              onTryAgain={onRetry}
            />
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
              content={<CategoryTimeTooltip />}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Bar 
              dataKey="avgTime" 
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {categoryData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};