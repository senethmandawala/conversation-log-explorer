import { useState, useEffect } from "react";
import { Card, Typography, Space, Tooltip } from "antd";
import { IconInfoCircle, IconChartBar } from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { BarChartTooltip } from "@/components/ui/custom-chart-tooltip";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import { useProjectSelection } from "@/services/projectSelectionService";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";

const { Title, Text } = Typography;

interface CategoryWiseRepeatCallProps {
  data?: any[];
  loading?: boolean;
  hasError?: boolean;
  dateRangeForDisplay?: string;
  onReload?: () => void;
}

export function CategoryWiseRepeatCall({ data = [], loading = false, hasError = false, dateRangeForDisplay, onReload }: CategoryWiseRepeatCallProps) {
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
      console.error('Error loading category wise repeat call data:', error);
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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white">
              <IconChartBar className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Title level={5} className="!m-0 !text-base !font-semibold">
                  Category-wise Repeat Calls
                </Title>
                <Tooltip title="Repeat calls distribution across categories">
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
            content="category wise repeat call data"
            onTryAgain={onReload || loadData}
          />
        ) : currentData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
              <XAxis 
                dataKey="category" 
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
              <Bar dataKey="repeatCalls" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Repeat Calls" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ExceptionHandleView 
            type="204" 
            title="No Data Available"
            content="category wise repeat call data for the selected period"
            onTryAgain={onReload || loadData}
          />
        )}
      </Space>
    </Card>
  );
}
