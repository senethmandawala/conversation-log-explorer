import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Typography, Space, Button, Tooltip } from "antd";
import { 
  IconInfoCircle, 
  IconRefresh, 
  IconCalendar, 
  IconList,
  IconPhone,
  IconMessage,
  IconUsers,
  IconX,
  IconChartPie
} from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Label, Treemap } from "recharts";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import { useProjectSelection } from "@/services/projectSelectionService";
import { useDate } from "@/contexts/DateContext";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";

const { Title, Text } = Typography;

// Get colors from env.js
const COLORS = (window as any).env_vars?.colors;

// SimpleSubject for reactive state management (same as OverallPerformanceChart)
class SimpleSubject<T> {
  private observers: ((value: T) => void)[] = [];
  private isDestroyed = false;
  
  next(value: T) {
    if (!this.isDestroyed) {
      this.observers.forEach(observer => observer(value));
    }
  }
  
  subscribe(observer: (value: T) => void) {
    if (!this.isDestroyed) {
      this.observers.push(observer);
    }
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

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0" 
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="text-sm font-medium text-foreground">
            {data.name}: <span className="font-semibold">{data.value}</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTreemapTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0" 
            style={{ backgroundColor: data.fill }}
          />
          <span className="text-sm font-medium text-foreground">
            {data.name}: <span className="font-semibold">{data.value}</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill } = props;
  
  // Skip rendering if there's no valid name (this filters out the root node)
  if (!name) {
    return null;
  }

  // Calculate dynamic font size based on cell dimensions
  const maxFontSize = 14;
  const minFontSize = 8;
  const padding = 8;
  
  // Calculate font size that fits within the cell
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  
  // Estimate characters per line based on available width (approx 0.6 ratio for font width)
  const charWidth = 0.6;
  const estimatedFontSizeByWidth = availableWidth / (name.length * charWidth);
  const estimatedFontSizeByHeight = availableHeight * 0.6;
  
  // Use the smaller of the two to ensure it fits
  let fontSize = Math.min(estimatedFontSizeByWidth, estimatedFontSizeByHeight, maxFontSize);
  fontSize = Math.max(fontSize, minFontSize);
  
  // Only show text if there's enough space
  const showText = width > 40 && height > 20 && fontSize >= minFontSize;
  
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
      {showText && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={fontSize}
          fontWeight={600}
          style={{ pointerEvents: "none" }}
        >
          {name}
        </text>
      )}
    </g>
  );
};


export default function ChannelWiseCategoryReport() {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [channelData, setChannelData] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<Array<{ category: string; percentage: number; count: number; color: string }>>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryDetailsData, setCategoryDetailsData] = useState<any>(null);
  const [categoryDetailsLoading, setCategoryDetailsLoading] = useState(false);
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

  // Debounced refresh function for channel data
  const debouncedRefreshChannelData = useCallback((overrideDateRange?: any) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (selectedProject && !destroyRef.current) {
        loadData(overrideDateRange);
      }
    }, 300);
  }, [selectedProject]);

  // Debounced refresh function for category data
  const debouncedRefreshCategoryData = useCallback((channelName: string, overrideDateRange?: any) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (selectedProject && !destroyRef.current) {
        loadCategoryData(channelName, overrideDateRange);
      }
    }, 300);
  }, [selectedProject]);

  // Extract category data loading logic into separate function
  const loadCategoryData = async (channelName: string, overrideDateRange?: any) => {
    // Use override date range if provided, otherwise use effective date range
    const dateRangeToUse = overrideDateRange || effectiveDateRange;
    
    if (!selectedProject || !dateRangeToUse) {
      setCategoryData([]);
      setCategoryLoading(false);
      return;
    }

    setCategoryLoading(true);
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
        channel: getChannelValue(channelName),
      };

      const response = await callRoutingApiService.ChannelWiseCategoryDetails(filters);
      
      if (response?.data?.callPercentageData && Array.isArray(response.data.callPercentageData)) {
        const transformedData = response.data.callPercentageData.map((item: any, index: number) => ({
          category: item.category || 'Unknown',
          percentage: parseFloat(item.percentage) || 0,
          count: item.count || 0,
          color: COLORS[index % COLORS.length]
        })).sort((a, b) => b.count - a.count);
        
        setCategoryData(transformedData);
      } else {
        setCategoryData([]);
      }
    } catch (error) {
      console.error('Error loading category data:', error);
      setCategoryData([]);
    } finally {
      setCategoryLoading(false);
    }
  };

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

      const response = await callRoutingApiService.ChannelWiseCallCount(filters);
      
      if (response?.data && Array.isArray(response.data)) {
        // Transform API response to chart format
        const transformedData = response.data.map((item: any, index: number) => ({
          name: item.channel ? item.channel.charAt(0).toUpperCase() + item.channel.slice(1) : 'Unknown',
          value: item.record_count || 0,
          color: COLORS[index % COLORS.length],
          icon: getChannelIconName(item.channel)
        })).sort((a, b) => b.value - a.value);
        
        setChannelData(transformedData);
      } else {
        setChannelData([]);
      }
    } catch (error) {
      console.error('Error loading channel wise data:', error);
      setHasError(true);
      setChannelData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dateRange: any) => {
    setLocalDateRange(dateRange);
  };

  const handleReload = () => {
    manualRefreshRef.current.next({ type: 'channel', dateRange: effectiveDateRange });
  };

  // Watch for global date range changes (from ModuleTabs.tsx)
  useEffect(() => {
    if (destroyRef.current) return;

    // If global date range changes, clear local selection to allow global to take precedence
    if (globalDateRange) {
      setLocalDateRange(null); // Clear local selection
      // Trigger refresh with global date range
      manualRefreshRef.current.next({ type: 'channel', dateRange: globalDateRange });
    }
  }, [globalDateRange]);

  // Subscribe to manual refresh events
  useEffect(() => {
    const subscription = manualRefreshRef.current.subscribe((data) => {
      if (data.type === 'channel') {
        debouncedRefreshChannelData(data.dateRange);
      } else if (data.type === 'category') {
        debouncedRefreshCategoryData(data.channelName, data.dateRange);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [debouncedRefreshChannelData, debouncedRefreshCategoryData]);

  // Cleanup
  useEffect(() => {
    return () => {
      destroyRef.current = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Check dependencies and trigger initial data load
  useEffect(() => {
    if (selectedProject && effectiveDateRange) {
      manualRefreshRef.current.next({ type: 'channel', dateRange: effectiveDateRange });
    } else {
      setLoading(true);
    }
  }, [selectedProject, effectiveDateRange]);

  const getChannelIconName = (channel: string) => {
    switch (channel?.toLowerCase()) {
      case "ivr": return "phone";
      case "whatsapp": return "message";
      case "messenger": return "users";
      default: return "message";
    }
  };

  const getChannelValue = (channelName: string) => {
    switch (channelName?.toLowerCase()) {
      case "ivr": return 1;
      case "whatsapp": return 2;
      case "messenger": return 3;
      default: return 1;
    }
  };

  const handleChannelSelect = async (channelName: string) => {
    setSelectedChannel(channelName);
    setCategoryLoading(true);
    
    // Trigger debounced category data loading
    manualRefreshRef.current.next({ type: 'category', channelName, dateRange: effectiveDateRange });
  };

  const handleCloseCategories = () => {
    setSelectedChannel(null);
    setCategoryData([]);
    setCategoryLoading(false);
    setSelectedCategory(null);
    setCategoryDetailsData(null);
    setCategoryDetailsLoading(false);
  };

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    setCategoryDetailsLoading(true);
    
    if (!selectedProject || !effectiveDateRange || !selectedChannel) {
      setCategoryDetailsData(null);
      setCategoryDetailsLoading(false);
      return;
    }

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
        channel: getChannelValue(selectedChannel),
        category: category,
      };

      const response = await callRoutingApiService.ChannelWiseCategoryDetails(filters);
      
      if (response?.data) {
        setCategoryDetailsData(response.data);
      } else {
        setCategoryDetailsData(null);
      }
    } catch (error) {
      console.error('Error loading category details:', error);
      setCategoryDetailsData(null);
    } finally {
      setCategoryDetailsLoading(false);
    }
  };

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case "phone": return <IconPhone className="text-xl" />;
      case "message": return <IconMessage className="text-xl" />;
      case "users": return <IconUsers className="text-xl" />;
      default: return <IconMessage className="text-xl" />;
    }
  };

  // Prepare treemap data for Recharts (we'll use a custom grid layout)
  const firstColumnLegends = categoryData.slice(0, Math.ceil(categoryData.length / 2));
  const secondColumnLegends = categoryData.slice(Math.ceil(categoryData.length / 2));

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle" orientation="horizontal">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconChartPie className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-lg !font-semibold">
                    Channel Wise Category Distribution
                  </Title>
                  <Tooltip title="Call distribution across different channels and categories">
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
                dateInput={dateInputForPicker}
                onSelectedRangeValueChange={handleDateRangeChange}
                toolTipValue="Select date range for channel category data"
                calenderType=""
              />
              <Button 
                type="text" 
                icon={<IconRefresh />}
                onClick={handleReload}
                className="w-9 h-9"
              />
              <Button 
                type="text" 
                icon={<IconList />}
                className="w-9 h-9"
              />
            </Space>
          </div>
        </div>
        <div className="flex gap-6">
          {/* Channels Card */}
          <Card
            style={{
              borderRadius: 12,
              border: '1px solid #e8e8e8',
              background: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: 16,
              flex: selectedChannel ? '0 0 50%' : '1 0 0'
            }}
          >
            <Title level={5} className="!m-0 !mb-4">Channels</Title>
            
            {loading ? (
              <ExceptionHandleView type="loading" />
            ) : hasError ? (
              <ExceptionHandleView 
                type="500" 
                title="Error Loading Data"
                content="channel wise call count data"
                onTryAgain={handleReload}
              />
            ) : channelData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      onClick={(data) => handleChannelSelect(data.name)}
                      style={{ cursor: 'pointer' }}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value, fill }) => {
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
                            style={{ fontSize: 12, fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                          >
                            <tspan x={x} dy="-0.4em">{name}</tspan>
                            <tspan x={x} dy="1.2em" style={{ fontWeight: 700 }}>{value}</tspan>
                          </text>
                        );
                      }}
                      labelLine={false}
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Channel Stats */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    {channelData.map((channel) => (
                      <div key={channel.name} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div 
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              backgroundColor: channel.color
                            }}
                          >
                            {getChannelIcon(channel.icon)}
                          </div>
                          <Text type="secondary" className="text-xs">{channel.name}</Text>
                        </div>
                        <div className="text-2xl font-semibold" style={{ color: channel.color as string }}>
                          {channel.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Text type="secondary" className="text-xs text-center mt-4 block">
                  <span className="font-medium">Note:</span> Click on a section to view category distribution
                </Text>
              </>
            ) : (
              <ExceptionHandleView 
                type="204" 
                title="No Data Available"
                content="channel wise call count data for the selected period"
                onTryAgain={handleReload}
              />
            )}
          </Card>

          {/* Category Distribution Card - Only show when channel is selected */}
          {selectedChannel && (
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #e8e8e8',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: 16,
                flex: '0 0 50%',
                animation: 'slideInFromRight 0.5s ease-out'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Title level={5} className="!m-0">Categories Distribution</Title>
                  <Text type="secondary" className="text-sm">{selectedChannel}</Text>
                </div>
                <Button 
                  type="text" 
                  icon={<IconX />}
                  onClick={handleCloseCategories}
                  className="w-9 h-9"
                />
              </div>

              {categoryLoading ? (
                <div className="flex items-center justify-center h-[380px]">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : categoryData.length > 0 ? (
                <>
                  {/* Recharts Treemap */}
                  <Card className="rounded-lg border-gray-200 bg-white p-2 mb-4">
                    <ResponsiveContainer width="100%" height={280}>
                      <Treemap
                        data={categoryData.map((item, idx) => ({
                          name: item.category,
                          value: item.count,
                          fill: COLORS[idx % COLORS.length],
                        }))}
                        dataKey="value"
                        stroke="white"
                        fill="hsl(226, 70%, 55%)"
                        content={<CustomTreemapContent />}
                        onClick={(data) => handleCategoryClick(data.name)}
                      >
                        <RechartsTooltip content={<CustomTreemapTooltip />} />
                      </Treemap>
                    </ResponsiveContainer>
                  </Card>

                  {/* Category Legends */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                      {firstColumnLegends.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 2,
                              flexShrink: 0,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                          <Text type="secondary" className="text-xs">{item.category}</Text>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      {secondColumnLegends.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 2,
                              flexShrink: 0,
                              backgroundColor: COLORS[(firstColumnLegends.length + index) % COLORS.length]
                            }}
                          />
                          <Text type="secondary" className="text-xs">{item.category}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <ExceptionHandleView 
                  type="204" 
                  title="No Category Data Available"
                  content="category distribution for the selected channel"
                />
              )}
            </Card>
          )}

          {/* Category Details Card - Only show when category is selected */}
          {selectedCategory && (
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #e8e8e8',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: 16,
                flex: '0 0 50%',
                animation: 'slideInFromRight 0.5s ease-out'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Title level={5} className="!m-0">Category Details</Title>
                  <Text type="secondary" className="text-sm">{selectedCategory}</Text>
                </div>
                <Button 
                  type="text" 
                  icon={<IconX />}
                  onClick={() => {
                    setSelectedCategory(null);
                    setCategoryDetailsData(null);
                    setCategoryDetailsLoading(false);
                  }}
                  className="w-9 h-9"
                />
              </div>

              {categoryDetailsLoading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : categoryDetailsData?.callPercentageData ? (
                <>
                  <div className="mb-4">
                    <Text type="secondary" className="text-sm">
                      Total Calls: <span className="font-semibold">{categoryDetailsData.totalCallCount}</span>
                    </Text>
                  </div>
                  
                  <div className="space-y-3">
                    {categoryDetailsData.callPercentageData.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 2,
                              flexShrink: 0,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                          <Text className="text-sm font-medium">{item.category}</Text>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{item.count}</div>
                          <div className="text-xs text-gray-500">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <ExceptionHandleView 
                  type="204" 
                  title="No Details Available"
                  content="category details for the selected category"
                />
              )}
            </Card>
          )}
        </div>
      </Space>
    </Card>
  );
}
