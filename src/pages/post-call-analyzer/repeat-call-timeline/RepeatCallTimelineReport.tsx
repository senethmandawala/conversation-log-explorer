import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Typography, Space, Button, Tooltip, Row, Col } from "antd";
import { 
  IconInfoCircle, 
  IconRefresh, 
  IconCalendar, 
  IconList,
  IconChartLine,
  IconPhone,
  IconClock,
  IconTarget,
  IconUser
} from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";
import { LineChartTooltip } from "@/components/ui/custom-chart-tooltip";
import { ReasonWiseRepeatCall } from "./ReasonWiseRepeatCall.tsx";
import { CategoryWiseRepeatCall } from "./CategoryWiseRepeatCall.tsx";
import { AgentRepeatCallHandling } from "./AgentRepeatCallHandling.tsx";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import { useProjectSelection } from "@/services/projectSelectionService";
import { useDate } from "@/contexts/DateContext";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";

const { Title, Text } = Typography;

// Simple Subject implementation for reactive pattern
class SimpleSubject<T> {
  private observers: ((value: T) => void)[] = [];
  private isDestroyed = false;
  
  next(value: T) {
    if (!this.isDestroyed) {
      this.observers.forEach(observer => observer(value));
    }
  }
  
  subscribe(observer: (value: T) => void) {
    this.observers.push(observer);
    return {
      unsubscribe: () => {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
          this.observers.splice(index, 1);
        }
      }
    };
  }
  
  destroy() {
    this.isDestroyed = true;
    this.observers = [];
  }
}

export default function RepeatCallTimelineReport() {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [dailyRepeatRate, setDailyRepeatRate] = useState("0.0");
  const [mostAffectedCategory, setMostAffectedCategory] = useState("No Data");
  const [reasonWiseData, setReasonWiseData] = useState<any[]>([]);
  const [categoryWiseData, setCategoryWiseData] = useState<any[]>([]);
  const [agentWiseData, setAgentWiseData] = useState<any[]>([]);
  const [localDateRange, setLocalDateRange] = useState<any>(null);
  const { globalDateRange } = useDate();
  const { selectedProject } = useProjectSelection();

  // Use local date range if user has set it, otherwise use global
  const effectiveDateRange = localDateRange || globalDateRange;
  
  // Force new reference when global date range changes to trigger DatePickerComponent update
  const dateInputForPicker = effectiveDateRange ? { ...effectiveDateRange } : null;

  // Reactive state management
  const destroyRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const manualRefreshRef = useRef(new SimpleSubject<any>());

  // Cleanup
  useEffect(() => {
    return () => {
      destroyRef.current = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      manualRefreshRef.current.destroy();
    };
  }, []);

  // Handle date range change
  const handleDateRangeChange = (dateRange: any) => {
    setLocalDateRange(dateRange);
  };

  // Debounced refresh function
  const debouncedRefresh = useCallback((overrideDateRange?: any) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (selectedProject && !destroyRef.current) {
        loadData(overrideDateRange);
      }
    }, 300);
  }, [selectedProject]);

  // Watch for global date range changes
  useEffect(() => {
    if (destroyRef.current) return;

    // If global date range changes, clear local selection to allow global to take precedence
    if (globalDateRange) {
      setLocalDateRange(null);
      // Trigger refresh with global date range
      manualRefreshRef.current.next(globalDateRange);
    }
  }, [globalDateRange]);

  // Combine date and project changes
  useEffect(() => {
    if (destroyRef.current) return;

    // Watch for both date and project changes
    if (effectiveDateRange && selectedProject) {
      // Trigger refresh through the unified debounced stream with current date range
      manualRefreshRef.current.next(effectiveDateRange);
    }
  }, [effectiveDateRange, selectedProject]);

  // Single debounced stream for ALL refresh triggers
  useEffect(() => {
    const subscription = manualRefreshRef.current.subscribe((dateRange) => {
      // Use the date range passed through the Subject
      debouncedRefresh(dateRange);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [debouncedRefresh]);

  // Check dependencies and trigger initial load
  useEffect(() => {
    if (destroyRef.current) return;

    // Always set loading state when component mounts or dependencies change
    if (selectedProject && effectiveDateRange) {
      // Trigger API call for fresh data
      manualRefreshRef.current.next(effectiveDateRange);
    } else {
      // Set loading to true while waiting for dependencies
      if (!selectedProject || !effectiveDateRange) {
        setLoading(true);
      }
    }
  }, [selectedProject, effectiveDateRange]);

  const loadData = async (overrideDateRange?: any) => {
    // Use override date range if provided, otherwise use effective date range
    const dateRangeToUse = overrideDateRange || effectiveDateRange;
    
    if (!selectedProject || !dateRangeToUse) {
      return;
    }

    setLoading(true);
    setHasError(false);
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
        fromTime: dateRangeToUse.fromDate,
        toTime: dateRangeToUse.toDate,
      };

      // Load timeline data
      const timelineResponse = await callRoutingApiService.RepeatCallTimeline(filters);
      if (timelineResponse?.data && Array.isArray(timelineResponse.data)) {
        const transformedData = timelineResponse.data.map((item: any) => ({
          date: new Date(item.call_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          totalCalls: item.total_calls,
          repeatCalls: item.repeat_calls,
          uniqueCustomers: item.unique_visitors,
        }));
        setTimelineData(transformedData);
      }

      // Load stats data
      const statsResponse = await callRoutingApiService.RepeatCallTimelineStats(filters);
      if (statsResponse?.data) {
        setDailyRepeatRate(statsResponse.data.repeat_call_percentage || "0.0");
        setMostAffectedCategory(statsResponse.data.most_affected_category || "No Data");
      }

      // Load reason wise data
      const reasonWiseResponse = await callRoutingApiService.ReasonWiseRepeatCall(filters);
      if (reasonWiseResponse?.data && Array.isArray(reasonWiseResponse.data)) {
        // Get colors from env.js
        const COLORS = (window as any).env_vars?.colors || ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
        const reasonCounts: { [key: string]: number } = {};
        
        reasonWiseResponse.data.forEach((dayData: any) => {
          if (dayData.reasons && typeof dayData.reasons === 'object') {
            Object.entries(dayData.reasons).forEach(([reason, count]: [string, any]) => {
              if (reason && typeof count === 'number') {
                reasonCounts[reason] = (reasonCounts[reason] || 0) + count;
              }
            });
          }
        });

        const transformedReasonData = Object.entries(reasonCounts)
          .map(([reason, count]) => ({
            reason,
            count,
            fill: COLORS[Object.keys(reasonCounts).indexOf(reason) % COLORS.length]
          }))
          .sort((a, b) => b.count - a.count);
        
        setReasonWiseData(transformedReasonData);
      }

      // Load category wise data
      const categoryWiseResponse = await callRoutingApiService.CategoryWiseRepeatCall(filters);
      if (categoryWiseResponse?.data && Array.isArray(categoryWiseResponse.data)) {
        const transformedCategoryData = categoryWiseResponse.data.map((item: any) => ({
          category: item.category || 'Unknown',
          repeatCalls: item.repeat_calls || 0,
        })).sort((a, b) => b.repeatCalls - a.repeatCalls);
        
        setCategoryWiseData(transformedCategoryData);
      }

      // Load agent wise data
      const agentWiseResponse = await callRoutingApiService.AgentWiseRepeatCalls(filters);
      if (agentWiseResponse?.data && Array.isArray(agentWiseResponse.data)) {
        const transformedAgentData = agentWiseResponse.data.map((item: any) => ({
          agentName: item.agent_name || 'Unknown',
          repeatCalls: item.repeat_calls || 0,
        })).sort((a, b) => b.repeatCalls - a.repeatCalls);
        
        setAgentWiseData(transformedAgentData);
      }
    } catch (error) {
      console.error('Error loading repeat call timeline data:', error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    manualRefreshRef.current.next(effectiveDateRange);
  };

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle" orientation="horizontal">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconChartLine className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-lg !font-semibold">
                    7 Day Repeat Call Timeline
                  </Title>
                  <Tooltip title="Track repeat callers over the past 7 days">
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
                  {effectiveDateRange?.dateRangeForDisplay || 'Select date range'}
                </Text>
              </div>
            </Space>
            
            <Space size="small" orientation="horizontal">
              <DatePickerComponent
                onSelectedRangeValueChange={handleDateRangeChange}
                toolTipValue="Select date range for repeat call data"
                calenderType=""
                dateInput={dateInputForPicker}
              />
              <Tooltip title="Reload data">
                <Button
                  type="default"
                  icon={<IconRefresh />}
                  onClick={handleReload}
                  loading={loading}
                  className={cn(
                    "h-10 rounded-xl border-2 transition-all duration-200",
                    "hover:border-primary/50"
                  )}
                />
              </Tooltip>
              <Button 
                type="text" 
                icon={<IconList />}
                className="w-9 h-9"
              />
            </Space>
          </div>
        </div>
        {/* Stat Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={12}>
            <StatCard
              label="Average Daily Repeat Rate"
              value={`${dailyRepeatRate}%`}
              icon={<IconTarget />}
              color="#3b82f6"
              gradientColors={["#3b82f6", "#2563eb"] as [string, string]}
              isLoading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <StatCard
              label="Most Affected Category"
              value={mostAffectedCategory}
              icon={<IconPhone />}
              color="#ef4444"
              gradientColors={["#ef4444", "#dc2626"] as [string, string]}
              isLoading={loading}
            />
          </Col>
        </Row>

        {/* Main Timeline Chart */}
        <div className="mb-6">
          {loading ? (
            <ExceptionHandleView type="loading" />
          ) : hasError ? (
            <ExceptionHandleView 
              type="500" 
              title="Error Loading Data"
              content="repeat call timeline data"
              onTryAgain={handleReload}
            />
          ) : timelineData.length === 0 ? (
            <ExceptionHandleView 
              type="204" 
              title="No Data Available"
              content="repeat call timeline data for the selected period"
              onTryAgain={handleReload}
            />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  style={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  style={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <RechartsTooltip content={<LineChartTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalCalls" 
                  stroke="#737FC4" 
                  strokeWidth={3}
                  dot={{ fill: "#737FC4", strokeWidth: 0, r: 4 }}
                  name="Total Calls"
                />
                <Line 
                  type="monotone" 
                  dataKey="repeatCalls" 
                  stroke="#83C180" 
                  strokeWidth={3}
                  dot={{ fill: "#83C180", strokeWidth: 0, r: 4 }}
                  name="Repeat Calls"
                />
                <Line 
                  type="monotone" 
                  dataKey="uniqueCustomers" 
                  stroke="#F5AF4E" 
                  strokeWidth={3}
                  dot={{ fill: "#F5AF4E", strokeWidth: 0, r: 4 }}
                  name="Unique Customers"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sub-reports */}
        <div className="mt-8">
          <ReasonWiseRepeatCall 
            data={reasonWiseData}
            loading={loading}
            hasError={hasError}
            dateRangeForDisplay={effectiveDateRange?.dateRangeForDisplay}
            onReload={handleReload}
          />
          <CategoryWiseRepeatCall 
            data={categoryWiseData}
            loading={loading}
            hasError={hasError}
            dateRangeForDisplay={effectiveDateRange?.dateRangeForDisplay}
            onReload={handleReload}
          />
          <AgentRepeatCallHandling 
            data={agentWiseData}
            loading={loading}
            hasError={hasError}
            dateRangeForDisplay={effectiveDateRange?.dateRangeForDisplay}
            onReload={handleReload}
          />
        </div>
      </Space>
    </Card>
  );
}
