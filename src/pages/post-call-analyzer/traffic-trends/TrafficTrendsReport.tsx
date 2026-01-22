import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Typography, Space, DatePicker, Tooltip, Tabs, Button } from "antd";
import { 
  IconChartLine, 
  IconInfoCircle, 
  IconRefresh, 
  IconCalendar, 
  IconList
} from "@tabler/icons-react";
import { usePostCall } from "@/contexts/PostCallContext";
import { useProjectSelection } from "@/services/projectSelectionService";
import { useDate } from "@/contexts/DateContext";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import { TablerIcon } from "@/components/ui/tabler-icon";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import type { DateRangeObject } from "@/components/common/DatePicker/DatePicker";
import { cn } from "@/lib/utils";

const { Title, Text } = Typography;
import { motion, AnimatePresence } from "framer-motion";

// SimpleSubject for reactive state management
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

// Generate mock heatmap data for General tab (Date x Hour)
const generateGeneralHeatmapData = () => {
  const days = ['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'];
  const data: any[] = [];
  
  days.forEach((day, dayIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0') + ':00';
      // Generate random call counts with peak hours (9-17)
      const isPeakHour = hour >= 9 && hour <= 17;
      const baseValue = isPeakHour ? 50 : 10;
      const callCount = Math.floor(Math.random() * baseValue) + (isPeakHour ? 30 : 0);
      
      data.push({
        x: hour,
        y: dayIndex,
        value: callCount,
        hour: hourStr,
        day: day
      });
    }
  });
  
  return data;
};

// Generate mock heatmap data for Categories tab (Category x Hour)
const generateCategoryHeatmapData = () => {
  const categories = ['Billing Issues', 'Technical Support', 'Account Management', 'Product Inquiry', 'Service Complaint', 'Refund Request', 'General Query'];
  const data: any[] = [];
  
  categories.forEach((category, catIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0') + ':00';
      const isPeakHour = hour >= 9 && hour <= 17;
      const baseValue = isPeakHour ? 30 : 5;
      const callCount = Math.floor(Math.random() * baseValue) + (isPeakHour ? 10 : 0);
      
      data.push({
        x: hour,
        y: catIndex,
        value: callCount,
        hour: hourStr,
        category: category
      });
    }
  });
  
  return data;
};

const getHeatmapColor = (value: number, maxValue: number, categoryIndex?: number) => {
  if (value === 0) return 'hsl(var(--muted))';
  const intensity = value / maxValue;
  
  if (categoryIndex !== undefined && window.env_vars.colors && window.env_vars.colors[categoryIndex]) {
    const color = window.env_vars.colors[categoryIndex];
    // Convert hex to HSL properly
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const s = max === min ? 0 : (max - min) / (1 - Math.abs(max + min - 1));
    
    let h = 0;
    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    // Convert to degrees and apply reduced intensity
    const hue = Math.round(h * 360);
    const saturation = 50 + (15 * s) * (0.5 + 0.5 * intensity);
    const lightness = 90 - (30 * intensity);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  // Original blue gradient for general tab
  const hue = 220;
  const saturation = 70 + (20 * intensity);
  const lightness = 85 - (50 * intensity);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

interface HeatmapCellProps {
  value: number;
  maxValue: number;
  label: string;
  hour: string;
  categoryIndex?: number;
}

const HeatmapCell = ({ value, maxValue, label, hour, categoryIndex }: HeatmapCellProps) => {
  return (
    <Tooltip title={
      <div className="text-xs bg-white p-2 rounded">
        <div className="font-semibold mb-0.5">{label}</div>
        <div className="text-gray-500 mb-0.5">{hour}</div>
        <div className="font-bold text-blue-500">{value} calls</div>
      </div>
    }>
      <div
        style={{
          width: 48,
          height: 40,
          borderRadius: 4,
          border: '1px solid #e8e8e8',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: getHeatmapColor(value, maxValue, categoryIndex)
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#1890ff';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.zIndex = '10';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e8e8e8';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.zIndex = '1';
        }}
      />
    </Tooltip>
  );
};

export default function TrafficTrendsReport() {
  const { setSelectedTab } = usePostCall();
  const { selectedProject } = useProjectSelection();
  const { globalDateRange } = useDate();

  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [generalData, setGeneralData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [localDateRange, setLocalDateRange] = useState<DateRangeObject | null>(null);

  const effectiveDateRange = localDateRange || globalDateRange;
  const dateInputForPicker = effectiveDateRange ? { ...effectiveDateRange } : null;

  const destroyRef = useRef(false);
  const manualRefreshRef = useRef<SimpleSubject<any>>(new SimpleSubject<any>());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedRefresh = useCallback((overrideDateRange?: DateRangeObject, tabType?: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (selectedProject && !destroyRef.current) {
        loadData(overrideDateRange, tabType);
      }
    }, 300);
  }, [selectedProject]);

  useEffect(() => {
    if (destroyRef.current) return;

    if (globalDateRange) {
      setLocalDateRange(null);
      manualRefreshRef.current.next({ dateRange: globalDateRange, tabType: activeTab });
    }
  }, [globalDateRange]);

  useEffect(() => {
    if (destroyRef.current) return;

    if (selectedProject && effectiveDateRange) {
      manualRefreshRef.current.next({ dateRange: effectiveDateRange, tabType: activeTab });
    } else {
      if (!selectedProject || !effectiveDateRange) {
        setLoading(true);
      }
    }
  }, [selectedProject, effectiveDateRange]);

  useEffect(() => {
    if (destroyRef.current) return;

    if ((activeTab === "general" || activeTab === "categories") && selectedProject && effectiveDateRange) {
      setLoading(true);
      manualRefreshRef.current.next({ dateRange: effectiveDateRange, tabType: activeTab });
    }
  }, [activeTab]);

  useEffect(() => {
    const subscription = manualRefreshRef.current.subscribe((data: any) => {
      debouncedRefresh(data.dateRange, data.tabType);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [debouncedRefresh]);

  useEffect(() => {
    return () => {
      destroyRef.current = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const loadData = async (range?: DateRangeObject, tabType?: string) => {
    const dateRangeToUse = range || effectiveDateRange;
    if (!selectedProject || !dateRangeToUse) return;

    setLoading(true);
    setHasError(false);

    // Use tabType parameter or fallback to activeTab
    const currentTab = tabType || activeTab;

    // Reset the appropriate data based on active tab
    if (currentTab === "general") {
      setGeneralData([]);
    } else if (currentTab === "categories") {
      setCategoryData([]);
    }

    try {
      const filters = {
        tenantId: Number(selectedProject.tenant_id),
        subtenantId: Number(selectedProject.sub_tenant_id),
        companyId: Number(selectedProject.company_id),
        departmentId: Number(selectedProject.department_id),
        fromTime: dateRangeToUse.fromDate,
        toTime: dateRangeToUse.toDate,
      };

      if (currentTab === "general") {
        const response = await callRoutingApiService.TrafficTrendsGeneral(filters);

        if (response?.data && Array.isArray(response.data)) {
          // Transform API data to heatmap format
          const transformedData: any[] = [];
          response.data.forEach((dayData: any, dayIndex: number) => {
            dayData.hourlyCallCounts.forEach((hourData: any, hourIndex: number) => {
              transformedData.push({
                x: hourIndex,
                y: dayIndex,
                value: hourData.callCount,
                hour: hourData.hour,
                day: new Date(dayData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
              });
            });
          });
          setGeneralData(transformedData);
        } else {
          setGeneralData([]);
        }
      } else if (currentTab === "categories") {
        const response = await callRoutingApiService.TrafficTrendsCategories(filters);

        if (response?.data && Array.isArray(response.data)) {
          // Transform API data to heatmap format
          const transformedData: any[] = [];
          response.data.forEach((categoryData: any, catIndex: number) => {
            categoryData.hourCounts.forEach((hourData: any, hourIndex: number) => {
              transformedData.push({
                x: hourIndex,
                y: catIndex,
                value: hourData.callCount,
                hour: hourData.hour,
                category: categoryData.categoryName
              });
            });
          });
          setCategoryData(transformedData);
        } else {
          setCategoryData([]);
        }
      }
      
      setLoading(false);
    } catch (error) {
      setHasError(true);
      if (currentTab === "general") {
        setGeneralData([]);
      } else {
        setCategoryData([]);
      }
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range: DateRangeObject) => {
    setLocalDateRange(range);
  };

  const handleReload = () => {
    if (effectiveDateRange && selectedProject) {
      manualRefreshRef.current.next({ dateRange: effectiveDateRange, tabType: activeTab });
    }
  };

  const maxGeneralValue = Math.max(...generalData.map(d => d.value), 1);
  const maxCategoryValue = Math.max(...categoryData.map(d => d.value), 1);

  // Get unique days from data for labels
  const uniqueDays = [...new Set(generalData.map(d => d.day))].sort();

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconChartLine className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-lg !font-semibold">
                    Traffic Trends
                  </Title>
                  <Tooltip title="Visualize traffic trends across time periods">
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
                  {effectiveDateRange?.dateRangeForDisplay || "Select a date range"}
                </Text>
              </div>
            </Space>
            
            <Space size="small" orientation="horizontal">
              <DatePickerComponent
                dateInput={dateInputForPicker}
                onSelectedRangeValueChange={handleDateRangeChange}
                toolTipValue="Select date range for traffic trends"
                calenderType=""
              />
              <Button 
                type="text" 
                icon={<IconRefresh />}
                onClick={handleReload}
                className="w-9 h-9"
                disabled={loading || !effectiveDateRange}
              />
              <Button 
                type="text" 
                icon={<IconList />}
                className="w-9 h-9"
              />
            </Space>
          </div>
        </div>
        
        {/* Chart Content */}
        <div className="mt-4">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="w-full"
            size="large"
            items={[
              {
                key: "general",
                label: "General",
                children: (
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <ExceptionHandleView type="loading" />
                    ) : hasError ? (
                      <motion.div
                        key="error-general"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center h-[400px]"
                      >
                        <ExceptionHandleView 
                          type="500" 
                          title="Error Loading Data"
                          content="traffic trends data"
                          onTryAgain={handleReload}
                        />
                      </motion.div>
                    ) : generalData.length === 0 ? (
                      <motion.div
                        key="no-data-general"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center h-[400px]"
                      >
                        <ExceptionHandleView 
                          type="204" 
                          title="No Traffic Data"
                          content="traffic trends for the selected period"
                          onTryAgain={handleReload}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="content-general"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-x-auto"
                      >
                        <div className="inline-block min-w-full">
                          {/* Hour labels */}
                          <div className="flex mb-3">
                            <div className="w-24 shrink-0"></div>
                            {Array.from({ length: 24 }, (_, i) => (
                              <div key={i} className="w-12 text-[11px] text-center font-medium text-gray-500">
                                {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                              </div>
                            ))}
                          </div>
                          
                          {/* Heatmap grid */}
                          {uniqueDays.map((day, dayIndex) => (
                            <div key={day} className="flex items-center mb-2">
                              <div className="w-24 text-xs font-semibold text-right pr-3 shrink-0 truncate" title={day}>{day}</div>
                              <div className="flex gap-1">
                                {Array.from({ length: 24 }, (_, hour) => {
                                  const dataPoint = generalData.find(d => d.y === dayIndex && d.x === hour);
                                  return (
                                    <HeatmapCell
                                      key={hour}
                                      value={dataPoint?.value || 0}
                                      maxValue={maxGeneralValue}
                                      label={day}
                                      hour={`${hour.toString().padStart(2, '0')}:00`}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )
              },
              {
                key: "categories",
                label: "Categories",
                children: (
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <ExceptionHandleView type="loading" />
                    ) : hasError ? (
                      <motion.div
                        key="error-categories"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center h-[400px]"
                      >
                        <ExceptionHandleView 
                          type="500" 
                          title="Error Loading Data"
                          content="category traffic trends data"
                          onTryAgain={handleReload}
                        />
                      </motion.div>
                    ) : categoryData.length === 0 ? (
                      <motion.div
                        key="no-data-categories"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center h-[400px]"
                      >
                        <ExceptionHandleView 
                          type="204" 
                          title="No Category Data"
                          content="category traffic trends for the selected period"
                          onTryAgain={handleReload}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="content-categories"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-x-auto"
                      >
                        <div className="inline-block min-w-full">
                          {/* Hour labels */}
                          <div className="flex mb-3">
                            <div className="w-40 shrink-0"></div>
                            {Array.from({ length: 24 }, (_, i) => (
                              <div key={i} className="w-12 text-[11px] text-center font-medium text-gray-500">
                                {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                              </div>
                            ))}
                          </div>
                          
                          {/* Heatmap grid */}
                          {[...new Set(categoryData.map(d => d.category))].sort().map((category, catIndex) => (
                            <div key={category} className="flex items-center mb-2">
                              <div className="w-40 text-xs font-semibold text-right pr-3 shrink-0 truncate" title={category}>{category}</div>
                              <div className="flex gap-1">
                                {Array.from({ length: 24 }, (_, hour) => {
                                  const dataPoint = categoryData.find(d => d.y === catIndex && d.x === hour);
                                  return (
                                    <HeatmapCell
                                      key={hour}
                                      value={dataPoint?.value || 0}
                                      maxValue={maxCategoryValue}
                                      label={category}
                                      hour={`${hour.toString().padStart(2, '0')}:00`}
                                      categoryIndex={catIndex}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )
              }
            ]}
          />
        </div>
      </Space>
    </Card>
  );
}
