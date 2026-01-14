import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Tooltip, Space } from "antd";
import { BarChartOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { callRoutingApiService, type CommonResponse } from "@/services/callRoutingApiService";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import { useDate } from "@/contexts/DateContext";
import { useProjectSelection } from "@/services/projectSelectionService";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Simple Subject implementation for reactive pattern
class SimpleSubject<T> {
  private observers: ((value: T) => void)[] = [];
  
  next(value: T) {
    this.observers.forEach(observer => observer(value));
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
}

// Get colors from env.js
const categoryColors = (window as any).env_vars?.colors;


// Custom legend component with Tailwind styling
const CustomChartLegend = ({ config }: any) => {
  if (!config || Object.keys(config).length === 0) return null;
  
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {Object.entries(config).map(([key, entry]: [string, any]) => (
        <div key={key} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.label}</span>
        </div>
      ))}
    </div>
  );
};
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="z-50 overflow-hidden rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm text-card-foreground shadow-xl backdrop-blur-sm">
        <div className="space-y-1">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
                {entry.name}: {Math.round(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Chart config for the performance chart using env.js colors
const chartConfig = {
};

// Helper to transform API performance data to chart format dynamically
const transformPerformanceData = (apiData: any[]) => {
  if (!apiData || apiData.length === 0) {
    return [];
  }

  // Get all keys except call_date from the first item to determine categories
  const firstItem = apiData[0];
  const categories = Object.keys(firstItem).filter(key => key !== 'call_date');
  
  // Transform the API data to match the expected chart format
  return apiData.map((item) => {
    // Parse the call_date and format for display
    const date = new Date(item.call_date);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const transformedItem: any = {
      name: formattedDate,
    };
    
    // Add all categories dynamically
    categories.forEach(category => {
      const value = item[category];
      transformedItem[category] = value ? Math.round(parseFloat(value)) : 0;
    });
    
    return transformedItem;
  });
};

// Helper to get chart config dynamically based on data
const getChartConfig = (data: any[]) => {
  if (!data || data.length === 0) {
    return {};
  }
  
  // Get all keys except name from the first data item
  const categories = Object.keys(data[0]).filter(key => key !== 'name');
  const config: any = {};
  
  categories.forEach((category, index) => {
    // Use colors from env.js, cycling through if needed
    const colorIndex = index % (categoryColors?.length || 18);
    config[category] = {
      label: category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' '),
      color: categoryColors?.[colorIndex] || `hsl(${index * 30}, 70%, 50%)`
    };
  });
  
  return config;
};

interface OverallPerformanceChartProps {
  initialData?: any[];
  isLoading?: boolean;
}

export default function OverallPerformanceChart({ 
  initialData, 
  isLoading: propIsLoading 
}: OverallPerformanceChartProps = {}) {
  const [performanceData, setPerformanceData] = useState(initialData || []);
  const [isLoading, setIsLoading] = useState(true); // Start with loading = true by default
  const [hasData, setHasData] = useState(!!initialData);
  const [hasError, setHasError] = useState(false);
  const [localDateRange, setLocalDateRange] = useState<any>(null);
  const { globalDateRange } = useDate();
  const { selectedProject, changeSelectedProject } = useProjectSelection();
  const navigate = useNavigate();

  // Use local date range if user has set it, otherwise use global
  const effectiveDateRange = localDateRange || globalDateRange;
  
  // Force new reference when global date range changes to trigger DatePickerComponent update
  const dateInputForPicker = effectiveDateRange ? { ...effectiveDateRange } : null;

  // Reactive state management
  const destroyRef = useRef(false);
  const manualRefreshRef = useRef<SimpleSubject<any>>(new SimpleSubject<any>());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const projectCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Timeout to check if project is available after component mount
  useEffect(() => {
    if (destroyRef.current) return;
    
    projectCheckTimerRef.current = setTimeout(() => {
      if (!selectedProject) {
        console.log('OverallPerformanceChart: Project selection timeout - checking localStorage');
        // Try to get project directly from localStorage as fallback
        const storedProject = localStorage.getItem('selectedProject');
        if (storedProject) {
          try {
            const project = JSON.parse(storedProject);
            console.log('OverallPerformanceChart: Found project in localStorage', project);
            // This will trigger the project selection service to update
            changeSelectedProject(project);
          } catch (error) {
            console.error('OverallPerformanceChart: Error parsing stored project', error);
          }
        } else {
          console.log('OverallPerformanceChart: No project found in localStorage');
        }
      }
    }, 1000); // Check after 1 second

    return () => {
      if (projectCheckTimerRef.current) {
        clearTimeout(projectCheckTimerRef.current);
      }
    };
  }, [selectedProject, changeSelectedProject]);

  // Debounced refresh function
  const debouncedRefresh = useCallback((overrideDateRange?: any) => {
    console.log('OverallPerformanceChart: debouncedRefresh called', {
      hasSelectedProject: !!selectedProject,
      isDestroyed: destroyRef.current,
      overrideDateRange
    });
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      console.log('OverallPerformanceChart: Debounce timer fired', {
        hasSelectedProject: !!selectedProject,
        isDestroyed: destroyRef.current
      });
      
      if (selectedProject && !destroyRef.current) {
        loadData(overrideDateRange);
      } else {
        console.log('OverallPerformanceChart: Debounce callback skipped - no project or destroyed');
      }
    }, 300);
  }, [selectedProject]);

  // Watch for global date range changes (from ModuleTabs.tsx)
  useEffect(() => {
    if (destroyRef.current) return;

    // If global date range changes, clear local selection to allow global to take precedence
    if (globalDateRange) {
      setLocalDateRange(null); // Clear local selection
      // Trigger refresh with global date range
      manualRefreshRef.current.next(globalDateRange);
    }
  }, [globalDateRange]);

  // Combine date and project changes (similar to Angular's combineLatest)
  useEffect(() => {
    if (destroyRef.current) return;

    // Watch for both date and project changes
    if (effectiveDateRange && selectedProject) {
      // Update project details
      const tenantId = parseInt(selectedProject.tenant_id);
      const subtenantId = parseInt(selectedProject.sub_tenant_id);
      const companyId = parseInt(selectedProject.company_id);
      const departmentId = parseInt(selectedProject.department_id);
      
      // Trigger refresh through the unified debounced stream with current date range
      manualRefreshRef.current.next(effectiveDateRange);
    }
  }, [effectiveDateRange, selectedProject]);

  // Single debounced stream for ALL refresh triggers
  useEffect(() => {
    const subscription = manualRefreshRef.current.subscribe((dateRange) => {
      console.log('OverallPerformanceChart: Manual refresh triggered', { dateRange });
      // Use the date range passed through the Subject
      debouncedRefresh(dateRange);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [debouncedRefresh]);

  // Initial data and API trigger effect
  useEffect(() => {
    if (destroyRef.current) return;

    console.log('OverallPerformanceChart: Checking dependencies', {
      selectedProject: !!selectedProject,
      effectiveDateRange: !!effectiveDateRange,
      initialDataLength: initialData?.length || 0,
      isLoading
    });

    // Always set loading state when component mounts or dependencies change
    if (selectedProject && effectiveDateRange) {
      console.log('OverallPerformanceChart: Dependencies ready, checking data...');
      // If we have initial data, use it, otherwise trigger API call
      if (initialData && initialData.length > 0) {
        console.log('OverallPerformanceChart: Using initial data');
        setPerformanceData(initialData);
        setHasData(true);
        setIsLoading(false);
      } else {
        console.log('OverallPerformanceChart: Triggering API call for fresh data');
        // Trigger API call for fresh data
        manualRefreshRef.current.next(effectiveDateRange);
      }
    } else {
      console.log('OverallPerformanceChart: Waiting for dependencies...', {
        hasProject: !!selectedProject,
        hasDateRange: !!effectiveDateRange
      });
      
      // Set loading to true while waiting for dependencies
      if (!selectedProject || !effectiveDateRange) {
        setIsLoading(true);
      }
    }
  }, [selectedProject, effectiveDateRange]);

  // Cleanup
  useEffect(() => {
    return () => {
      destroyRef.current = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (projectCheckTimerRef.current) {
        clearTimeout(projectCheckTimerRef.current);
      }
    };
  }, []);

  // Handle date range change
  const handleDateRangeChange = (dateRange: any) => {
    setLocalDateRange(dateRange);
  };

  // Handle reload
  const handleReload = () => {
    manualRefreshRef.current.next(effectiveDateRange);
  };

  // Handle go to insights
  const handleGoToInsights = () => {
    navigate('/pca/call-insight');
  };

  // Load data function
  const loadData = async (overrideDateRange?: any) => {
    // Use override date range if provided, otherwise use effective date range
    const dateRangeToUse = overrideDateRange || effectiveDateRange;
    
    console.log('OverallPerformanceChart: loadData called', {
      hasSelectedProject: !!selectedProject,
      dateRangeToUse,
      overrideDateRange
    });
    
    if (!selectedProject || !dateRangeToUse) {
      console.log('OverallPerformanceChart: loadData aborted - missing dependencies');
      return;
    }

    console.log('OverallPerformanceChart: Starting API call');
    setIsLoading(true);
    setHasError(false);

    try {
      // Get IDs from selected project
      const tenantId = parseInt(selectedProject.tenant_id);
      const subtenantId = parseInt(selectedProject.sub_tenant_id);
      const companyId = parseInt(selectedProject.company_id);
      const departmentId = parseInt(selectedProject.department_id);

      // Use the date range
      const fromTime = dateRangeToUse.fromDate;
      const toTime = dateRangeToUse.toDate;

      const filters = {
        tenantId,
        subtenantId,
        companyId,
        departmentId,
        fromTime,
        toTime,
      };

      const response = await callRoutingApiService.overallPerformanceTrend(filters);

      // Check if response has data and transform it
      if (response?.data?.data && Array.isArray(response.data.data)) {
        if (response.data.data.length > 0) {
          const transformedData = transformPerformanceData(response.data.data);
          setPerformanceData(transformedData);
          setHasData(true);
        } else {
          // Handle empty data array
          setPerformanceData([]);
          setHasData(false);
        }
      } else {
        // Handle empty response
        setPerformanceData([]);
        setHasData(false);
      }
      
      setIsLoading(false);
    } catch (error) {
      setHasError(true);
      setPerformanceData([]);
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ marginTop: -4 }}>
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 ml-4">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <BarChartOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Overall Performance Chart
                  </h3>
                  <Tooltip title="Weekly performance trends and metrics">
                    <div className="-mt-1">
                      <TablerIcon 
                        name="info-circle" 
                        className="wn-tabler-14"
                        size={14}
                      />
                    </div>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground">
                  {effectiveDateRange?.dateRangeForDisplay || ''}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DatePickerComponent
                onSelectedRangeValueChange={handleDateRangeChange}
                toolTipValue="Select date range for performance data"
                calenderType=""
                dateInput={dateInputForPicker}
              />
              <Tooltip title="Reload data">
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleReload}
                  loading={isLoading}
                  className={cn(
                    "h-10 rounded-xl border-2 transition-all duration-200",
                    "hover:border-primary/50"
                  )}
                />
              </Tooltip>
              <Tooltip title="Go to Insights">
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  onClick={handleGoToInsights}
                  className={cn(
                    "h-10 rounded-xl border-2 transition-all duration-200",
                    "hover:border-primary/50"
                  )}
                />
              </Tooltip>
            </div>
          </div>
        </div>
        
        {/* Chart Section */}
        <div className="mt-12">
          {isLoading ? (
            <ExceptionHandleView type="loading" />
          ) : hasError ? (
            <ExceptionHandleView 
              type="500" 
              title="Error Loading Data"
              content="performance data"
              onTryAgain={() => {
                const loadData = async () => {
                  try {
                    setHasError(false);
                    await loadData();
                  } catch (error) {
                    setHasError(true);
                    setIsLoading(false);
                  }
                };
                loadData();
              }}
            />
          ) : !hasData ? (
            <ExceptionHandleView 
              type="204" 
              title="No Performance Data"
              content="overall performance trends"
              onTryAgain={() => {
                const loadData = async () => {
                  try {
                    setHasError(false);
                    await loadData();
                  } catch (error) {
                    setHasError(true);
                    setIsLoading(false);
                  }
                };
                loadData();
              }}
            />
          ) : (
            <div className="space-y-7">
              <ChartContainer config={getChartConfig(performanceData)} className="h-[300px] w-full">
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  {/* Dynamic gradients for each category */}
                  {Object.keys(getChartConfig(performanceData)).map((category, index) => {
                    const colorIndex = index % (categoryColors?.length || 18);
                    const color = categoryColors?.[colorIndex] || `hsl(${index * 30}, 70%, 50%)`;
                    return (
                      <linearGradient key={`${category}Gradient`} id={`${category}Gradient`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    );
                  })}
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" vertical={false} />
                  <XAxis dataKey="name" className="text-xs" axisLine={false} tickLine={false} />
                  <YAxis 
                    className="text-xs" 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => Math.round(value).toString()}
                  />
                  <ChartTooltip content={<CustomChartTooltip />} />
                  {/* Dynamic lines for each category */}
                  {Object.keys(getChartConfig(performanceData)).map((category, index) => {
                    const colorIndex = index % (categoryColors?.length || 18);
                    const color = categoryColors?.[colorIndex] || `hsl(${index * 30}, 70%, 50%)`;
                    const config = getChartConfig(performanceData)[category];
                    return (
                      <Line 
                        key={category}
                        type="monotone" 
                        dataKey={category} 
                        stroke={color} 
                        strokeWidth={2.5} 
                        dot={{ fill: color, strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                        name={config.label}
                      />
                    );
                  })}
                </LineChart>
              </ChartContainer>
              <CustomChartLegend config={getChartConfig(performanceData)} />
            </div>
          )}
        </div>
      </Space>
    </div>
  );
}
