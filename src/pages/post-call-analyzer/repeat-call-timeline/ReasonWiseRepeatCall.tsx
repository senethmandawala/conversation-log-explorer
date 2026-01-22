import { useState, useEffect } from "react";
import { Card, Typography, Space, Tooltip } from "antd";
import { IconInfoCircle, IconChartBar } from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import { useProjectSelection } from "@/services/projectSelectionService";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";

const { Title, Text } = Typography;

// Get colors from env.js
const COLORS = (window as any).env_vars?.colors || ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

interface ReasonWiseRepeatCallProps {
  data?: any[];
  loading?: boolean;
  hasError?: boolean;
  dateRangeForDisplay?: string;
  onReload?: () => void;
}

export function ReasonWiseRepeatCall({ data = [], loading = false, hasError = false, dateRangeForDisplay, onReload }: ReasonWiseRepeatCallProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalHasError, setInternalHasError] = useState(false);
  const [internalData, setInternalData] = useState<any[]>([]);

  // Use parent data if provided, otherwise use internal state
  const currentData = data.length > 0 ? data : internalData;
  const currentLoading = loading || internalLoading;
  const currentHasError = hasError || internalHasError;

  const loadData = async () => {
    // Only load if no parent data provided
    if (data.length > 0) return;
    
    setInternalLoading(true);
    setInternalHasError(false);
    try {
      // This would be the original API call logic if needed
      // For now, we'll rely on parent data
    } catch (error) {
      console.error('Error loading reason wise repeat call data:', error);
      setInternalHasError(true);
    } finally {
      setInternalLoading(false);
    }
  };

  // Watch for external reload trigger
  useEffect(() => {
    if (onReload) {
      loadData();
    }
  }, [onReload]);

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4 mt-6">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="flex justify-between items-center w-full">
          <Space align="center" size="middle" orientation="horizontal">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white">
              <IconChartBar className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Title level={5} className="!m-0 !text-base !font-semibold">
                  Reason-wise Repeat Call
                </Title>
                <Tooltip title="Distribution of repeat calls by reason">
                  <div className="-mt-1">
                    <TablerIcon 
                      name="info-circle" 
                      className="wn-tabler-14"
                      size={14}
                    />
                  </div>
                </Tooltip>
              </div>
              <Text type="secondary" className="text-sm">
                {dateRangeForDisplay || 'Select date range'}
              </Text>
            </div>
          </Space>
        </div>

        {currentLoading ? (
          <ExceptionHandleView type="loading" />
        ) : currentHasError ? (
          <ExceptionHandleView 
            type="500" 
            title="Error Loading Data"
            content="reason wise repeat call data"
            onTryAgain={onReload || loadData}
          />
        ) : currentData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
              <XAxis 
                dataKey="reason" 
                style={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                style={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
              />
              <RechartsTooltip content={<BarChartTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ExceptionHandleView 
            type="204" 
            title="No Data Available"
            content="reason wise repeat call data for the selected period"
            onTryAgain={onReload || loadData}
          />
        )}
      </Space>
    </Card>
  );
}
