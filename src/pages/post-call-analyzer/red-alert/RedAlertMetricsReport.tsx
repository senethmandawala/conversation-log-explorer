import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip } from "antd";
import { ReloadOutlined, CloseOutlined, BarChartOutlined, CalendarOutlined, ApartmentOutlined } from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { callRoutingApiService, type CommonResponse } from "@/services/callRoutingApiService";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import { useDate } from "@/contexts/DateContext";
import { useProjectSelection } from "@/services/projectSelectionService";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import dayjs from "dayjs";
import { Treemap, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
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

const { Title, Text } = Typography;

// Custom Tooltip Components
const TreemapTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="z-50 overflow-hidden rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm text-card-foreground shadow-xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.fill }}
            />
            <p className="font-medium">{data.name}</p>
          </div>
          <div className="text-sm">
            Value: {data.value}
          </div>
          <div className="text-sm">
            Percentage: {data.percentage}%
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const BarChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="z-50 overflow-hidden rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm text-card-foreground shadow-xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.fill }}
            />
            <p className="font-medium">{data.name}</p>
          </div>
          <div className="text-sm">
            Value: {data.value}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Call Logs Component - will be populated with real data
const RedAlertCallLogs = ({ category, subCategory }: { category: string; subCategory: string }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real call logs based on category and subCategory
    setLoading(false);
  }, [category, subCategory]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 300 
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '2px solid #1890ff',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 300,
        color: '#666'
      }}>
        No call logs available
      </div>
    );
  }

  return (
    <div className="space-y-2" style={{ maxHeight: 300, overflowY: 'auto' }}>
      {logs.map((log) => (
        <div key={log.id} style={{
          padding: 8,
          backgroundColor: '#fafafa',
          borderRadius: 8,
          fontSize: 14
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>{log.time}</span>
            <span style={{ color: '#666' }}>{log.duration}</span>
          </div>
          <div style={{ color: '#666' }}>{log.status}</div>
        </div>
      ))}
    </div>
  );
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
  const [hasData, setHasData] = useState(!!initialData);
  const [hasError, setHasError] = useState(false);
  
  const [showSecondChart, setShowSecondChart] = useState(false);
  const [showThirdChart, setShowThirdChart] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  
  const [redAlertData, setRedAlertData] = useState<any[]>(initialData || []);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [localDateRange, setLocalDateRange] = useState<any>(null);
  const { globalDateRange } = useDate();
  const { selectedProject } = useProjectSelection();

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

  const loadSecondChartData = (category: string) => {
    setSecondChartLoading(true);
    
    // TODO: Fetch real bar chart data based on category
    setTimeout(() => {
      // Placeholder for real API call
      setBarChartData([]);
      setSecondChartLoading(false);
    }, 300);
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

  return (
    <Card
      style={{
        borderRadius: 12,
        border: '1px solid #e8e8e8',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '16px 16px 16px 16px'
      }}
    >
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ marginTop: -12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
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
                <ApartmentOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                        Red Alert Metrics
                      </Title>
                      <Tooltip title="Highlighting key areas that require immediate attention">
                        <div style={{ marginTop: '-4px' }}>
                          <TablerIcon 
                            name="info-circle" 
                            className="wn-tabler-14"
                            size={14}
                          />
                        </div>
                      </Tooltip>
                    </div>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Highlighting key areas that require immediate attention
                    </Text>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DatePickerComponent
                onSelectedRangeValueChange={handleDateRangeChange}
                toolTipValue="Select date range for red alert metrics"
                calenderType=""
                dateInput={dateInputForPicker}
              />
              <Button 
                type="text"
                icon={<ReloadOutlined className={loading ? 'animate-spin' : ''} />}
                onClick={handleReload}
                loading={loading}
                style={{ borderRadius: 8 }}
              />
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
            {/* Treemap Chart - First Level */}
            <div style={{ 
              gridColumn: showThirdChart ? 'span 4' : showSecondChart ? 'span 6' : 'span 12'
            }}>
              <Card
                style={{
                  borderRadius: 12,
                  border: '1px solid #e8e8e8',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  padding: 16
                }}
              >
                <ResponsiveContainer width="100%" height={350}>
                  <Treemap
                    data={treemapData}
                    dataKey="value"
                    stroke="white"
                    fill="hsl(226, 70%, 55%)"
                    content={<CustomTreemapContent />}
                    onClick={handleTreemapClick}
                  >
                    <RechartsTooltip content={<TreemapTooltip />} />
                  </Treemap>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {treemapData.filter(item => item.value > 0).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div 
                        style={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          flexShrink: 0,
                          backgroundColor: item.fill 
                        }}
                      />
                      <span style={{ fontSize: 12, color: '#666', fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ 
                  fontSize: 14, 
                  color: '#666', 
                  textAlign: 'center', 
                  marginTop: 12, 
                  padding: 8, 
                  backgroundColor: '#fafafa', 
                  borderRadius: 8 
                }}>
                  <span style={{ fontWeight: 500, color: '#1890ff' }}>Note:</span> Data is based on the selected date range
                </div>
              </Card>
            </div>

            {/* Bar Chart - Second Level */}
            {showSecondChart && (
              <div style={{ 
                gridColumn: showThirdChart ? 'span 4' : 'span 6'
              }}>
                <div style={{ 
                  border: '1px solid #e8e8e8', 
                  borderRadius: 8, 
                  padding: 16 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 14 }}>{selectedCategory}</Text>
                      <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                        {selectedCategory === 'Open Cases' || selectedCategory === 'Drop calls' 
                          ? 'Top Agents' 
                          : 'Reasons for ' + selectedCategory}
                      </Title>
                    </div>
                    <Button 
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={closeSecondChart}
                      style={{ borderRadius: 8 }}
                    />
                  </div>

                  {secondChartLoading ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: 300 
                    }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        border: '2px solid #1890ff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
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
                          />
                          <RechartsTooltip content={<BarChartTooltip />} />
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
                      <div style={{ 
                        fontSize: 14, 
                        color: '#666', 
                        textAlign: 'center', 
                        marginTop: 8, 
                        padding: 8, 
                        backgroundColor: '#fafafa', 
                        borderRadius: 8 
                      }}>
                        <span style={{ fontWeight: 500, color: '#1890ff' }}>Note:</span> Data is based on the selected date range
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Call Logs - Third Level */}
            {showThirdChart && (
              <div style={{ gridColumn: 'span 4' }}>
                <div style={{ 
                  border: '1px solid #e8e8e8', 
                  borderRadius: 8, 
                  padding: 16 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 14 }}>{selectedCategory} / {selectedSubCategory}</Text>
                      <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Call Logs</Title>
                    </div>
                    <Button 
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={closeThirdChart}
                      style={{ borderRadius: 8 }}
                    />
                  </div>

                  {thirdChartLoading ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: 300 
                    }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        border: '2px solid #1890ff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    </div>
                  ) : (
                    <RedAlertCallLogs 
                      category={selectedCategory}
                      subCategory={selectedSubCategory}
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
