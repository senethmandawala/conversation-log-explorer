import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Typography, Space, Button, Tooltip } from "antd";
import { ReloadOutlined, CloseOutlined, EyeOutlined, ApartmentOutlined } from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import { useReportDataFetch, type ReportFilters } from "@/hooks/useReportDataFetch";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import { useNavigate } from "react-router-dom";
import { Treemap, ResponsiveContainer, Tooltip as RechartTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { RedAlertCallLogs } from "./RedAlertCallLogs";

const { Title, Text } = Typography;

// Custom Tooltip Components
const TreemapTooltipContent = ({ active, payload }: any) => {
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

// Transform function for red alert data
const transformRedAlertData = (response: any) => {
  if (!response?.data?.alert_elements) {
    return [];
  }
  
  const alertElements = response.data.alert_elements;
  
  // Transform the alert_elements array into the expected format
  const transformedData = alertElements.map((item: any) => {
    const [name, value] = Object.entries(item)[0]; // Get the key-value pair
    return {
      name: name,
      value: typeof value === 'string' ? parseInt(value as string) || 0 : (value || 0),
      percentage: 0 // Will be calculated below
    };
  }).filter((item: any) => item.value > 0); // Only include items with values > 0

  // Calculate percentages
  const totalValue = transformedData.reduce((sum: number, item: any) => sum + item.value, 0);
  const dataWithPercentages = transformedData.map((item: any) => ({
    ...item,
    percentage: totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0
  }));

  return dataWithPercentages;
};

// Fetch function for red alert metrics
const fetchRedAlertMetrics = async (filters: ReportFilters) => {
  return callRoutingApiService.redAlertMMetric(filters);
};

interface RedAlertMetricsReportProps {
  initialData?: any[];
  isLoading?: boolean;
}

export default function RedAlertMetricsReport({ 
  initialData, 
  isLoading: propIsLoading 
}: RedAlertMetricsReportProps = {}) {
  const navigate = useNavigate();
  
  // Use centralized hook for main data fetching
  const {
    data: redAlertData,
    isLoading: hookIsLoading,
    hasData,
    hasError,
    effectiveDateRange,
    dateInputForPicker,
    handleDateRangeChange,
    handleReload: baseHandleReload,
    selectedProject,
  } = useReportDataFetch({
    fetchFn: fetchRedAlertMetrics,
    transformFn: transformRedAlertData,
    initialData,
  });

  // Use prop loading state if provided, otherwise use hook state
  const loading = propIsLoading !== undefined ? propIsLoading : hookIsLoading;

  // Second chart state (drill-down)
  const [secondChartLoading, setSecondChartLoading] = useState(false);
  const [thirdChartLoading, setThirdChartLoading] = useState(false);
  const [secondChartError, setSecondChartError] = useState(false);
  const [hasSecondChartData, setHasSecondChartData] = useState(false);
  
  const [showSecondChart, setShowSecondChart] = useState(false);
  const [showThirdChart, setShowThirdChart] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  
  const [barChartData, setBarChartData] = useState<any[]>([]);

  // Handle reload - reset drill-down state
  const handleReload = useCallback(() => {
    setShowSecondChart(false);
    setShowThirdChart(false);
    setSelectedCategory("");
    setSelectedSubCategory("");
    baseHandleReload();
  }, [baseHandleReload]);

  // Handle go to insights
  const handleGoToInsights = () => {
    navigate('/pca/call-insight');
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
      if (!selectedProject || !effectiveDateRange) {
        setBarChartData([]);
        setSecondChartLoading(false);
        return;
      }

      // Get IDs from selected project
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
        alert: category,
      };

      const response = await callRoutingApiService.redAlertReasons(filters);

      // Check if response has data and transform it for the bar chart
      if (response?.data?.reasons_elements && Array.isArray(response.data.reasons_elements)) {
        const transformedData = response.data.reasons_elements.map((item: any) => ({
          name: item.reason,
          value: typeof item.call_count === 'string' ? parseInt(item.call_count) || 0 : (item.call_count || 0),
        })).filter((item: any) => item.value > 0);

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

  // Generate shades for bar chart
  const getBarChartColors = () => {
    const categoryIndex = redAlertData.findIndex(item => item.name === selectedCategory);
    const baseColor = COLORS[categoryIndex % COLORS.length];
    return barChartData.map((_, idx) => {
      const factor = 1 - (idx * 0.08);
      return baseColor + Math.round(Math.max(0.5, factor) * 255).toString(16).padStart(2, '0');
    });
  };

  // Bar Chart Tooltip Component
  const BarChartTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const barChartColors = getBarChartColors();
      
      // Remove duplicate entries by name
      const uniquePayload = payload.reduce((acc: any[], entry: any) => {
        const existingIndex = acc.findIndex((item: any) => item.name === entry.name);
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
    <Card
      style={{
        borderRadius: 12,
        border: '1px solid #e8e8e8',
        background: '#ffffff',
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
                      {effectiveDateRange?.dateRangeForDisplay || ''}
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
              <Tooltip title="Reload data">
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
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
              <div className={showThirdChart ? "col-span-4" : "col-span-6"}>
                <div className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{selectedCategory}</p>
                      <h3 className="text-base font-semibold leading-tight">
                        {selectedCategory === 'Open Cases' && 'Top Agents Handling Open Cases'}
                        {selectedCategory === 'Drop calls' && 'Top Agents Handling Dropped Calls'}
                        {selectedCategory === 'Bad Practices' && 'Violation Breakdown'}
                        {selectedCategory !== 'Open Cases' && selectedCategory !== 'Drop calls' && selectedCategory !== 'Bad Practices' && `Reasons for ${selectedCategory}`}
                      </h3>
                    </div>
                    <Button 
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={closeSecondChart}
                      className="rounded-lg"
                    />
                  </div>

                  {secondChartLoading ? (
                    <ExceptionHandleView type="loading" />
                  ) : secondChartError ? (
                    <ExceptionHandleView 
                      type="500" 
                      title="Error Loading Data"
                      content="reasons for red alert"
                      onTryAgain={() => loadSecondChartData(selectedCategory)}
                    />
                  ) : !hasSecondChartData ? (
                    <ExceptionHandleView 
                      type="204" 
                      title="No Data Available"
                      content={`reasons for ${selectedCategory}`}
                      onTryAgain={() => loadSecondChartData(selectedCategory)}
                    />
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
              <div className="col-span-4">
                <div className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{selectedCategory} / {selectedSubCategory}</p>
                      <h3 className="text-base font-semibold leading-tight">Call Logs</h3>
                    </div>
                    <Button 
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={closeThirdChart}
                      className="rounded-lg"
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
