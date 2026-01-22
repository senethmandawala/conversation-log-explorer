import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "antd";
import { IconX } from "@tabler/icons-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import { useProjectSelection } from "@/services/projectSelectionService";
import { callRoutingApiService } from "@/services/callRoutingApiService";

interface AgentsSentimentTopCategoryProps {
  selectedSentiment: string;
  onCategorySelect: (category: { name: string; color: string }) => void;
  onClose: () => void;
  dateRange?: any;
  hasError?: boolean;
  onRetry?: () => void;
}

// Get colors from environment config
const COLORS = window.env_vars?.colors;

// Custom tooltip for category charts with correct colors
const CategoryTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl min-w-[140px]">
      <div className="space-y-1.5">
        {payload.map((item: any, index: number) => {
          const color = item.payload?.color || item.color || item.fill || "hsl(var(--primary))";
          const name = item.payload?.name || item.name || "Category";
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

export const AgentsSentimentTopCategory = ({ 
  selectedSentiment, 
  onCategorySelect,
  onClose,
  dateRange,
  hasError = false,
  onRetry
}: AgentsSentimentTopCategoryProps) => {
  const { selectedProject } = useProjectSelection();
  
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [error, setError] = useState(false);
  
  // Use the passed dateRange directly
  const effectiveDateRange = dateRange;

  useEffect(() => {
    const loadCategoryData = async () => {
      if (!selectedProject || !effectiveDateRange || !selectedSentiment) {
        setCategoryData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);
      
      try {
        const tenantId = parseInt(selectedProject.tenant_id);
        const subtenantId = parseInt(selectedProject.sub_tenant_id);
        const companyId = parseInt(selectedProject.company_id);
        const departmentId = parseInt(selectedProject.department_id);

        const filters = {
          tenantId,
          subtenantId,
          companyId,
          departmentId,
          fromTime: effectiveDateRange.fromDate,
          limit: 10,
          toTime: effectiveDateRange.toDate,
          sentiment: 'agent', 
          sentiment_type: selectedSentiment
        };

        const response = await callRoutingApiService.AgentSentimentCategory(filters);
        
        if (response?.data?.callPercentageData && Array.isArray(response.data.callPercentageData)) {
          const transformedData = response.data.callPercentageData.map((item: any, index: number) => ({
            name: item.category || 'Unknown',
            count: item.count || 0,
            percentage: parseFloat(item.percentage) || 0,
            originalIndex: index // Keep original index for color assignment
          })).sort((a, b) => b.count - a.count);
          
          // Assign colors after sorting based on original index
          const dataWithColors = transformedData.map((item, index) => ({
            ...item,
            color: COLORS[item.originalIndex % COLORS.length]
          }));
          
          setCategoryData(dataWithColors);
        } else {
          setCategoryData([]);
        }
      } catch (error) {
        console.error('Error loading agent sentiment categories:', error);
        setError(true);
        setCategoryData([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [selectedProject, effectiveDateRange, selectedSentiment]);

  const handleBarClick = (data: any, index: number) => {
    onCategorySelect({
      name: data.name,
      color: data.color // Use the data's color property
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
  
  if (error || hasError) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[400px]">
            <ExceptionHandleView 
              type="500" 
              title="Error Loading Categories"
              content="agent sentiment category data"
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
              content={`${selectedSentiment} agent sentiment categories for the selected period`}
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <small className="text-muted-foreground">{selectedSentiment}</small>
            <h5 className="text-lg font-semibold">Top Categories</h5>
          </div>
          <Button
            type="text"
                        className="h-8 w-8"
            onClick={onClose}
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>

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
              label={{ value: 'Call Count', angle: -90, position: 'insideLeft', style: { fontWeight: 700 } }}
            />
            <Tooltip 
              content={<CategoryTooltip />}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Bar 
              dataKey="count" 
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
