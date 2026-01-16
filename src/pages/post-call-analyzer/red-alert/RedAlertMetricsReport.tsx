import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip } from "antd";
import { IconRefresh, IconX, IconChartBar, IconCalendar, IconBuildingCommunity, IconEye } from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { callRoutingApiService, type CommonResponse } from "@/services/callRoutingApiService";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import { useDate } from "@/contexts/DateContext";
import { useProjectSelection } from "@/services/projectSelectionService";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Treemap, ResponsiveContainer, Tooltip as RechartTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { RedAlertCallLogs } from "./RedAlertCallLogs";

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

const { Title, Text } = Typography;

// Custom Tooltip Components with mouse position tracking
interface TooltipProps {
  active?: boolean;
  payload?: any[];
  mousePosition?: { x: number; y: number };
}

const TreemapTooltipContent = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="z-50 overflow-hidden rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm text-card-foreground backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 justify-start">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: data.fill }}
            />
            <p className="font-medium m-0">{data.name}</p>
          </div>
          <div className="text-sm ml-5">
            Value: {data.value}
          </div>
          <div className="text-sm ml-5">
            Percentage: {data.percentage}%
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const BarChartTooltipContent = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="z-50 overflow-hidden rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm text-card-foreground shadow-xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 justify-start">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: data.fill }}
            />
            <p className="font-medium m-0">{data.name}</p>
          </div>
          <div className="text-sm ml-5">
            Value: {data.value}
          </div>
        </div>
      </div>
    );
  }
  return null;
};


// Colors from env.js
const COLORS = (window as any).env_vars?.colors || [
  "#FB6767", "#5766BC", "#62B766", "#FBA322", "#E83B76", "#3EA1F0", 
  "#98C861", "#FB6C3E", "#24B1F1", "#D0DD52", "#896A5F", "#22C2D6"
];

// Custom Treemap Content Component
const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill, percentage } = props;
  
  // Skip rendering if there's no valid name (this filters out the root node)
  if (!name) {
    return null;
  }
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="white"
        strokeWidth={2}
        style={{ cursor: "pointer" }}
        className="hover:opacity-80 transition-opacity"
      />
      {width > 60 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={14}
          fontWeight={400}
          style={{ pointerEvents: "none" }}
        >
          {percentage}%
        </text>
      )}
    </g>
  );
};

interface RedAlertMetricsReportProps {
  initialData?: any[];
  isLoading?: boolean;
}

export default function RedAlertMetricsReport({ 
  initialData, 
  isLoading: propIsLoading 
}: RedAlertMetricsReportProps = {}) {
  const [loading, setLoading] = useState(propIsLoading !== undefined ? propIsLoading : false);
  const [secondChartLoading, setSecondChartLoading] = useState(false);
  const [thirdChartLoading, setThirdChartLoading] = useState(false);
  const [secondChartError, setSecondChartError] = useState(false);
  const [hasSecondChartData, setHasSecondChartData] = useState(false);
  const [hasData, setHasData] = useState(!!initialData);
  const [hasError, setHasError] = useState(false);
  
  const [showSecondChart, setShowSecondChart] = useState(false);
  const [showThirdChart, setShowThirdChart] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  
  const [redAlertData, setRedAlertData] = useState<any[]>(initialData || []);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [localDateRange, setLocalDateRange] = useState<any>(null);
  const [treemapMousePos, setTreemapMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [barChartMousePos, setBarChartMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const treemapContainerRef = useRef<HTMLDivElement>(null);
  const barChartContainerRef = useRef<HTMLDivElement>(null);
  const { globalDateRange } = useDate();
  const { selectedProject } = useProjectSelection();
  const navigate = useNavigate();

  // Use local date range if user has set it, otherwise use global
  const effectiveDateRange = localDateRange || globalDateRange;
  
  // Force new reference when global date range changes to trigger DatePickerComponent update
  const dateInputForPicker = effectiveDateRange ? { ...effectiveDateRange } : null;

  // Reactive state management
  const destroyRef = useRef(false);
  const manualRefreshRef = useRef<SimpleSubject<any>>(new SimpleSubject<any>());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Initial data handling
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setRedAlertData(initialData);
      setHasData(true);
      setLoading(false);
    }
  }, [initialData]);

  // Initial API call when component mounts with project and date range
  useEffect(() => {
    if (destroyRef.current) return;

    // Trigger initial API call if we have project and date range but no actual initial data
    if (selectedProject && effectiveDateRange && (!initialData || initialData.length === 0)) {
      manualRefreshRef.current.next(effectiveDateRange);
    }
  }, [selectedProject, effectiveDateRange, initialData]);

  // Cleanup
  useEffect(() => {
    return () => {
      destroyRef.current = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle date range change
  const handleDateRangeChange = (dateRange: any) => {
    setLocalDateRange(dateRange);
    // Close all tabs/charts when date range changes
    setShowSecondChart(false);
    setShowThirdChart(false);
    setSelectedCategory("");
    setSelectedSubCategory("");
    // The combineLatest effect will trigger automatically
  };

  // Handle reload
  const handleReload = () => {
    setShowSecondChart(false);
    setShowThirdChart(false);
    setSelectedCategory("");
    setSelectedSubCategory("");
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
    
    if (!selectedProject || !dateRangeToUse) {
      return;
    }

    setLoading(true);
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

      const response = await callRoutingApiService.redAlertMMetric(filters);

      // Check if response has data
      if (response?.data && response.data.alert_elements) {
        const alertElements = response.data.alert_elements;
        
        // Transform the alert_elements array into the expected format
        const transformedData = alertElements.map(item => {
          const [name, value] = Object.entries(item)[0]; // Get the key-value pair
          return {
            name: name,
            value: typeof value === 'string' ? parseInt(value) || 0 : (value || 0),
            percentage: 0 // Will be calculated below
          };
        }).filter(item => item.value > 0); // Only include items with values > 0

        // Calculate percentages
        const totalValue = transformedData.reduce((sum, item) => sum + item.value, 0);
        const dataWithPercentages = transformedData.map(item => ({
          ...item,
          percentage: totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0
        }));

        if (dataWithPercentages.length > 0) {
          setRedAlertData(dataWithPercentages);
          setHasData(true);
        } else {
          // Handle empty data array (all values are 0)
          setRedAlertData([]);
          setHasData(false);
        }
      } else {
        // Handle empty response
        setRedAlertData([]);
        setHasData(false);
      }
    } catch (error) {
      setHasError(true);
      setRedAlertData([]);
    }
    
    setLoading(false);
  };

  const handleTreemapClick = (data: any) => {
    if (data?.name) {
      setSelectedCategory(data.name);
      setShowSecondChart(true);
      setShowThirdChart(false);
      setSelectedSubCategory("");
      loadSecondChartData(data.name);
    }
  };

  const loadSecondChartData = async (category: string) => {
    setSecondChartLoading(true);
    setSecondChartError(false);
    setHasSecondChartData(false);
    
    try {
      // Use the same filters as the first API call
      const dateRangeToUse = effectiveDateRange;
      
      if (!selectedProject || !dateRangeToUse) {
        setBarChartData([]);
        setSecondChartLoading(false);
        return;
      }

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
        alert: category, // Add the selected category as alert parameter
      };

      const response = await callRoutingApiService.redAlertReasons(filters);

      // Check if response has data and transform it for the bar chart
      if (response?.data?.reasons_elements && Array.isArray(response.data.reasons_elements)) {
        const transformedData = response.data.reasons_elements.map(item => ({
          name: item.reason,
          value: typeof item.call_count === 'string' ? parseInt(item.call_count) || 0 : (item.call_count || 0),
        })).filter(item => item.value > 0); // Only include items with values > 0

        if (transformedData.length > 0) {
          setBarChartData(transformedData);
          setHasSecondChartData(true);
        } else {
          setBarChartData([]);
          setHasSecondChartData(false);
        }
      } else {
        setBarChartData([]);
        setHasSecondChartData(false);
      }
    } catch (error) {
      console.error('Error loading second chart data:', error);
      setSecondChartError(true);
      setBarChartData([]);
      setHasSecondChartData(false);
    }
    
    setSecondChartLoading(false);
  };

  const handleBarClick = (data: any) => {
    if (data?.name) {
      setSelectedSubCategory(data.name);
      setShowThirdChart(true);
      setThirdChartLoading(false);
    }
  };

  const closeSecondChart = () => {
    setShowSecondChart(false);
    setShowThirdChart(false);
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  const closeThirdChart = () => {
    setShowThirdChart(false);
    setSelectedSubCategory("");
  };

  // Prepare treemap data with colors
  const treemapData = redAlertData.map((item, idx) => ({
    ...item,
    fill: COLORS[idx % COLORS.length],
  }));

  // Get column classes based on drill-down state
  const getFirstChartCol = () => {
    if (showThirdChart) return "col-12 md:col-span-4";
    if (showSecondChart) return "col-12 md:col-span-6";
    return "col-12";
  };

  const getSecondChartCol = () => {
    if (showThirdChart) return "col-12 md:col-span-4";
    return "col-12 md:col-span-6";
  };

  // Generate shades for bar chart
  const getBarChartColors = () => {
    const categoryIndex = redAlertData.findIndex(item => item.name === selectedCategory);
    const baseColor = COLORS[categoryIndex % COLORS.length];
    return barChartData.map((_, idx) => {
      const factor = 1 - (idx * 0.08);
      return baseColor + Math.round(Math.max(0.5, factor) * 255).toString(16).padStart(2, '0');
    });
  };

  // Bar Chart Tooltip Component with access to component state
  const BarChartTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const barChartColors = getBarChartColors();
      
      // Remove duplicate entries by name
      const uniquePayload = payload.reduce((acc: any[], entry: any) => {
        const existingIndex = acc.findIndex(item => item.name === entry.name);
        if (existingIndex === -1) {
          acc.push(entry);
        }
        return acc;
      }, []);
      
      return (
        <div className="z-50 overflow-hidden rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm text-card-foreground backdrop-blur-sm">
          <div className="space-y-1">
            <p className="font-medium">{label}</p>
            {uniquePayload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: barChartColors[index] }}
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

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-start w-full">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconBuildingCommunity className="text-xl" />
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1">
                      <Title level={4} className="!m-0 !text-lg !font-semibold">
                        Red Alert Metrics
                      </Title>
                      <Tooltip title="Highlighting key areas that require immediate attention">
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
                      Highlighting key areas that require immediate attention
                    </Text>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DatePickerComponent
                onSelectedRangeValueChange={handleDateRangeChange}
                toolTipValue="Select date range for red alert metrics"
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
              <Tooltip title="Go to Insights">
                <Button
                  type="default"
                  icon={<IconEye />}
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
        {loading ? (
          <ExceptionHandleView type="loading" />
        ) : hasError ? (
          <ExceptionHandleView 
            type="500" 
            title="Error Loading Data"
            content="red alert metrics"
            onTryAgain={handleReload}
          />
        ) : !hasData ? (
          <ExceptionHandleView 
            type="204" 
            title="No Red Alert Data"
            content="red alert metrics for the selected period"
            onTryAgain={handleReload}
          />
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {/* Treemap Chart - First Level */}
            <div className={showThirdChart ? "col-span-4" : showSecondChart ? "col-span-6" : "col-span-12"}>
              <Card
                className="rounded-xl border border-border bg-card p-4"
              >
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={treemapData}
                    dataKey="value"
                    stroke="white"
                    fill="hsl(226, 70%, 55%)"
                    content={<CustomTreemapContent />}
                    onClick={handleTreemapClick}
                  >
                    <RechartTooltip 
                      content={<TreemapTooltipContent />} 
                      cursor={{ fill: 'transparent' }}
                      wrapperStyle={{ pointerEvents: 'none' }}
                    />
                  </Treemap>
                </ResponsiveContainer>
              </div>
                
                {/* Legend */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {treemapData.filter(item => item.value > 0).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div 
                        style={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          flexShrink: 0,
                          backgroundColor: item.fill 
                        }}
                      />
                      <span className="text-xs text-gray-500 font-normal truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-gray-500 text-center mt-3 p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium text-blue-500">Note:</span> Data is based on the selected date range
                </div>
              </Card>
            </div>

            {/* Bar Chart - Second Level */}
            {showSecondChart && (
              <div style={{ 
                gridColumn: showThirdChart ? 'span 4' : 'span 6'
              }}>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Text type="secondary" className="text-sm">{selectedCategory}</Text>
                      <Title level={5} className="!m-0 !text-base !font-semibold">
                        {selectedCategory === 'Open Cases' || selectedCategory === 'Drop calls' 
                          ? 'Top Agents' 
                          : 'Reasons for ' + selectedCategory}
                      </Title>
                    </div>
                    <Button 
                      type="text"
                      icon={<IconX />}
                      onClick={closeSecondChart}
                      className="rounded-lg"
                    />
                  </div>

                  {secondChartLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              className="text-xs" 
                              axisLine={false} 
                              tickLine={false}
                              hide
                            />
                            <YAxis 
                              className="text-xs" 
                              axisLine={false} 
                              tickLine={false}
                              tickFormatter={(value) => Math.round(value).toString()}
                              domain={[0, 'dataMax']}
                              ticks={barChartData.length > 0 ? [0, Math.max(...barChartData.map(d => d.value))] : [0, 1]}
                              allowDecimals={false}
                            />
                            <RechartTooltip 
                              content={<BarChartTooltipContent />} 
                              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                              wrapperStyle={{ pointerEvents: 'none' }}
                            />
                            <Bar 
                              dataKey="value" 
                              radius={[6, 6, 0, 0]}
                              onClick={handleBarClick}
                              style={{ cursor: 'pointer' }}
                            >
                              {barChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarChartColors()[index]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-sm text-gray-500 text-center mt-2 p-2 bg-slate-50 rounded-lg">
                        <span className="font-medium text-blue-500">Note:</span> Data is based on the selected date range
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Call Logs - Third Level */}
            {showThirdChart && (
              <div className="col-span-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Text type="secondary" className="text-sm">{selectedCategory} / {selectedSubCategory}</Text>
                      <Title level={5} className="!m-0 !text-base !font-semibold">Call Logs</Title>
                    </div>
                    <Button 
                      type="text"
                      icon={<IconX />}
                      onClick={closeThirdChart}
                      className="rounded-lg"
                    />
                  </div>

                  {thirdChartLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <RedAlertCallLogs 
                      category={selectedCategory}
                      subCategory={selectedSubCategory}
                      fromTime={effectiveDateRange?.fromDate || ''}
                      toTime={effectiveDateRange?.toDate || ''}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Space>
    </Card>
  );
}
