import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "antd";
import { IconX } from "@tabler/icons-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import { useProjectSelection } from "@/services/projectSelectionService";
import { callRoutingApiService } from "@/services/callRoutingApiService";

// Get colors from environment config
const COLORS = window.env_vars?.colors || ['#4285F4', '#34A853', '#FBBC04', '#EA4335', '#9C27B0', '#FF6F00', '#00ACC1', '#7CB342'];

interface AverageTimeTopAgentsProps {
  selectedCategory: { name: string; color: string };
  onClose: () => void;
  dateRange?: any;
  hasError?: boolean;
  onRetry?: () => void;
}

// Custom tooltip for agent time charts
const AgentTimeTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl min-w-[140px]">
      <div className="space-y-1.5">
        {payload.map((item: any, index: number) => {
          const color = item.payload?.color || item.color || item.fill || "hsl(var(--primary))";
          const name = item.payload?.name || item.name || "Agent";
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
                {value ?? 0} calls
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AverageTimeTopAgents = ({ 
  selectedCategory,
  onClose,
  dateRange,
  hasError = false,
  onRetry
}: AverageTimeTopAgentsProps) => {
  const { selectedProject } = useProjectSelection();
  
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState<any[]>([]);
  const [error, setError] = useState(false);
  
  const effectiveDateRange = dateRange;

  useEffect(() => {
    const loadAgentData = async () => {
      if (!selectedProject || !effectiveDateRange || !selectedCategory) {
        setAgentData([]);
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
          toTime: effectiveDateRange.toDate,
          category: selectedCategory.name,
          limit: 10
        };

        const response = await callRoutingApiService.CallResolutionTimeTopAgents(filters);
        
        if (response?.data && Array.isArray(response.data)) {
          const transformedData = response.data.map((item: any, index: number) => ({
            name: item.AgentName || 'Unknown',
            count: item.callCount || 0,
            color: COLORS[index % COLORS.length]
          })).sort((a, b) => b.count - a.count);
          
          setAgentData(transformedData);
        } else {
          setAgentData([]);
        }
      } catch (error) {
        console.error('Error loading agent time data:', error);
        setError(true);
        setAgentData([]);
      } finally {
        setLoading(false);
      }
    };

    loadAgentData();
  }, [selectedProject, effectiveDateRange, selectedCategory]);

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
              title="Error Loading Agents"
              content="agent time data"
              onTryAgain={onRetry}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!agentData.length) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[400px]">
            <ExceptionHandleView 
              type="204" 
              title="No Agents Found"
              content={`agents for ${selectedCategory.name}`}
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
            <small className="text-muted-foreground">{selectedCategory.name}</small>
            <h5 className="text-lg font-semibold">Top Agents</h5>
          </div>
          <Button
            type="text"
                        className="h-8 w-8"
            onClick={onClose}
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={agentData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number"
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={11}
              width={100}
            />
            <Tooltip 
              content={<AgentTimeTooltip />}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Bar 
              dataKey="count" 
              radius={[0, 4, 4, 0]}
            >
              {agentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};