import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconArrowLeft, IconInfoCircle, IconRefresh, IconCalendar, IconList, IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Treemap, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { DurationCallLogs } from "./DurationCallLogs.tsx";
import { LongCallLogs } from "./LongCallLogs.tsx";
import { Typography, DatePicker, Tabs as AntTabs, Table as AntTable, Badge as AntBadge, Space, Tooltip as AntTooltip } from "antd";
import { IconPhone, IconCalendar as IconCalendarAnt, IconRefresh as IconRefreshAnt, IconList as IconListAnt, IconClock } from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import { useProjectSelection } from "@/services/projectSelectionService";
import { useDate } from "@/contexts/DateContext";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import type { DateRangeObject } from "@/components/common/DatePicker/DatePicker";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const { Title, Text } = Typography;

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

interface CallDurationData {
  category: string;
  callCount: number;
  callDuration: string;
  call_duration_sec: number;
  avgCallDuration: string;
  avg_call_duration_sec: number;
}

interface CallDurationResponse {
  data: {
    callDurationData: CallDurationData[];
    totalCallCount: number;
    totalCallDurationInSeconds: number;
    totalCallDuration: string;
    averageTotalCallDuration: string;
  };
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0" 
            style={{ backgroundColor: data.fill }}
          />
          <span className="text-sm font-semibold text-foreground">{data.category}</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>Call Count: <span className="font-medium text-foreground">{data.callCount}</span></p>
          <p>Avg Duration: <span className="font-medium text-foreground">{data.avgCallDuration}</span></p>
          <p>Total Duration: <span className="font-medium text-foreground">{data.callDuration}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, category, fill } = props;
  
  if (!category) {
    return null;
  }

  const maxFontSize = 14;
  const minFontSize = 8;
  const padding = 8;
  
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  
  const charWidth = 0.6;
  const estimatedFontSizeByWidth = availableWidth / (category.length * charWidth);
  const estimatedFontSizeByHeight = availableHeight * 0.6;
  
  let fontSize = Math.min(estimatedFontSizeByWidth, estimatedFontSizeByHeight, maxFontSize);
  fontSize = Math.max(fontSize, minFontSize);
  
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
          {category}
        </text>
      )}
    </g>
  );
};

export default function CallDurationReport() {
  const { setSelectedTab } = usePostCall();
  const { selectedProject } = useProjectSelection();
  const { globalDateRange } = useDate();

  const [activeTab, setActiveTab] = useState("duration");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [callDurationData, setCallDurationData] = useState<CallDurationData[]>([]);
  const [summaryData, setSummaryData] = useState<CallDurationResponse['data'] | null>(null);
  const [longCallData, setLongCallData] = useState<any>(null);
  const [localDateRange, setLocalDateRange] = useState<DateRangeObject | null>(null);

  const effectiveDateRange = localDateRange || globalDateRange;
  const dateInputForPicker = effectiveDateRange ? { ...effectiveDateRange } : null;

  const destroyRef = useRef(false);
  const manualRefreshRef = useRef<SimpleSubject<any>>(new SimpleSubject<any>());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedRefresh = useCallback((overrideDateRange?: DateRangeObject) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (selectedProject && !destroyRef.current) {
        loadData(overrideDateRange);
      }
    }, 300);
  }, [selectedProject]);

  useEffect(() => {
    if (destroyRef.current) return;

    if (globalDateRange) {
      setLocalDateRange(null);
      manualRefreshRef.current.next(globalDateRange);
    }
  }, [globalDateRange]);

  useEffect(() => {
    if (destroyRef.current) return;

    if (effectiveDateRange && selectedProject) {
      manualRefreshRef.current.next(effectiveDateRange);
    }
  }, [effectiveDateRange, selectedProject]);

  useEffect(() => {
    const subscription = manualRefreshRef.current.subscribe((dateRange) => {
      debouncedRefresh(dateRange);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [debouncedRefresh]);

  useEffect(() => {
    if (destroyRef.current) return;

    if (selectedProject && effectiveDateRange) {
      manualRefreshRef.current.next(effectiveDateRange);
    } else {
      if (!selectedProject || !effectiveDateRange) {
        setLoading(true);
      }
    }
  }, [selectedProject, effectiveDateRange]);

  useEffect(() => {
    if (destroyRef.current) return;

    if (activeTab === "long-calls" && selectedProject && effectiveDateRange) {
      loadLongCallData();
    }
  }, [activeTab]);

  useEffect(() => {
    return () => {
      destroyRef.current = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const loadData = async (range?: DateRangeObject) => {
    const dateRangeToUse = range || effectiveDateRange;
    if (!selectedProject || !dateRangeToUse) return;

    setLoading(true);
    setHasError(false);

    try {
      const filters = {
        tenantId: Number(selectedProject.tenant_id),
        subtenantId: Number(selectedProject.sub_tenant_id),
        companyId: Number(selectedProject.company_id),
        departmentId: Number(selectedProject.department_id),
        fromTime: dateRangeToUse.fromDate,
        toTime: dateRangeToUse.toDate,
        limit: 100,
      };

      const [durationResponse, longCallResponse] = await Promise.all([
        callRoutingApiService.TopCategoryCallDuration(filters),
        callRoutingApiService.LongCallDuration(filters)
      ]);

      if (durationResponse?.data) {
        setCallDurationData(durationResponse.data.callDurationData || []);
        setSummaryData(durationResponse.data);
      } else {
        setCallDurationData([]);
        setSummaryData(null);
      }

      if (longCallResponse?.data) {
        setLongCallData(longCallResponse.data);
      } else {
        setLongCallData(null);
      }
      
      setLoading(false);
    } catch (error) {
      setHasError(true);
      setCallDurationData([]);
      setSummaryData(null);
      setLongCallData(null);
      setLoading(false);
    }
  };

  const loadLongCallData = async () => {
    if (!selectedProject || !effectiveDateRange) return;

    try {
      const filters = {
        tenantId: Number(selectedProject.tenant_id),
        subtenantId: Number(selectedProject.sub_tenant_id),
        companyId: Number(selectedProject.company_id),
        departmentId: Number(selectedProject.department_id),
        fromTime: effectiveDateRange.fromDate,
        toTime: effectiveDateRange.toDate,
      };

      const response = await callRoutingApiService.LongCallDuration(filters);

      if (response?.data) {
        setLongCallData(response.data);
      } else {
        setLongCallData(null);
      }
    } catch (error) {
      console.error('Error loading long call data:', error);
      setLongCallData(null);
    }
  };

  const handleDateRangeChange = (range: DateRangeObject) => {
    setLocalDateRange(range);
  };

  const handleReload = () => {
    if (effectiveDateRange && selectedProject) {
      manualRefreshRef.current.next(effectiveDateRange);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [col1Visible, setCol1Visible] = useState(true);
  const [col2Visible, setCol2Visible] = useState(false);
  const [col1Class, setCol1Class] = useState("col-span-12");
  const [col2Class, setCol2Class] = useState("col-span-6");

  const handleCategoryClick = (data: any) => {
    if (data?.category) {
      setSelectedCategory(data.category);
      setCol1Visible(true);
      setCol2Visible(true);
      setCol1Class("col-span-6");
      setCol2Class("col-span-6");
    }
  };

  const handleCloseCallLogs = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
  };

  const getColSpan = (colClass: string) => {
    if (colClass === "col-span-12") return 12;
    if (colClass === "col-span-6") return 6;
    return 12;
  };

  const transformDataForTreemap = (data: CallDurationData[]) => {
    const colors = ["#4285F4", "#34A853", "#FBBC04", "#EA4335", "#9C27B0", "#FF6B6B", "#4ECDC4", "#45B7D1"];
    return data.map((item, index) => ({
      name: item.category,
      value: item.call_duration_sec,
      fill: colors[index % colors.length],
      category: item.category,
      callCount: item.callCount,
      avgCallDuration: item.avgCallDuration,
      callDuration: item.callDuration,
    }));
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <IconPhone className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Title level={4} className="!m-0 !text-xl !font-semibold">
                  Call Duration Analysis
                </Title>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <div className="-mt-1">
                        <TablerIcon 
                          name="info-circle" 
                          className="wn-tabler-14"
                          size={14}
                        />
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Analyze call duration patterns by category</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Text type="secondary" className="text-sm">
                {effectiveDateRange?.dateRangeForDisplay || "Select a date range"}
              </Text>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DatePickerComponent
              onSelectedRangeValueChange={handleDateRangeChange}
              toolTipValue="Select date range for call duration analysis"
              calenderType=""
              dateInput={dateInputForPicker}
            />
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleReload} disabled={loading || !effectiveDateRange}>
              <IconRefresh className={cn(loading && "animate-spin")} />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <IconList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <AntTabs
          activeKey={activeTab}
          onChange={(value) => setActiveTab(value)}
          className="w-full"
          size="large"
          items={[
            {
              key: "duration",
              label: "Call Duration",
              children: (
                <>
                  {summaryData && (
                    <div className="mb-4">
                      <Card className="rounded-xl border-gray-200 bg-gradient-to-br from-blue-500 to-blue-600 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/80 text-sm mb-1">Average Call Time</p>
                            <div className="flex items-baseline gap-2">
                              <h2 className="text-3xl font-bold text-white m-0">{summaryData.averageTotalCallDuration}</h2>
                              <span className="text-white/80 text-sm">from {summaryData.totalCallCount} Calls</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {loading ? (
                    <ExceptionHandleView type="loading" />
                  ) : hasError ? (
                    <ExceptionHandleView 
                      type="500" 
                      title="Error Loading Data"
                      content="call duration data"
                      onTryAgain={handleReload}
                    />
                  ) : callDurationData.length === 0 ? (
                    <ExceptionHandleView 
                      type="204" 
                      title="No Call Duration Data"
                      content="call duration analysis"
                    />
                  ) : (
                    <div className="relative">
                      <div className="grid grid-cols-12 gap-4">
                        <AnimatePresence mode="sync">
                          {col1Visible && (
                            <motion.div
                              key="col1-treemap"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3 }}
                              style={{ gridColumn: `span ${getColSpan(col1Class)}` }}
                            >
                              <div className="overflow-hidden w-full">
                                <div className="flex">
                                  <div className="flex-shrink-0 pr-4" style={{ width: '100%' }}>
                                    <Card className="h-[450px] p-4 border-border/50 bg-background/50">
                                      <div className="h-full flex flex-col">
                                        <div className="flex items-center justify-between mb-3">
                                          <h5 className="text-base font-semibold text-foreground">Call Duration by Categories</h5>
                                        </div>
                                        <div className="flex-1 min-h-0">
                                          <ResponsiveContainer width="100%" height="100%">
                                            <Treemap
                                              data={transformDataForTreemap(callDurationData)}
                                              dataKey="value"
                                              stroke="white"
                                              fill="hsl(226, 70%, 55%)"
                                              content={<CustomTreemapContent />}
                                              onClick={handleCategoryClick}
                                            >
                                              <RechartsTooltip content={<CustomTooltip />} />
                                            </Treemap>
                                          </ResponsiveContainer>
                                        </div>
                                      </div>
                                    </Card>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {col2Visible && selectedCategory && (
                            <motion.div
                              key="col2-calllogs"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                              style={{ gridColumn: `span ${getColSpan(col2Class)}` }}
                            >
                              <Card className="border-border/50 bg-background/50 h-[450px]">
                                <div className="p-4 h-full flex flex-col">
                                  <div className="flex items-center justify-between mb-3">
                                    <h5 className="text-base font-semibold text-foreground">
                                      Call Logs - {selectedCategory}
                                    </h5>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6" 
                                      onClick={handleCloseCallLogs}
                                    >
                                      <IconX className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="flex-1 min-h-0 overflow-hidden">
                                    <DurationCallLogs 
                                      category={selectedCategory} 
                                      fromTime={effectiveDateRange?.fromDate || ''} 
                                      toTime={effectiveDateRange?.toDate || ''} 
                                    />
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </>
              )
            },
            {
              key: "long-calls",
              label: "Long Calls",
              children: (
                <>
                  {loading ? (
                    <ExceptionHandleView type="loading" />
                  ) : hasError ? (
                    <ExceptionHandleView 
                      type="500" 
                      title="Error Loading Data"
                      content="long calls data"
                      onTryAgain={handleReload}
                    />
                  ) : (
                    <Card className="border-gray-200 rounded-xl">
                      <div className="p-6">
                        <h5 className="text-lg font-semibold mb-4">Long Calls Overview</h5>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div>
                            <h3 className="text-2xl font-bold">{longCallData?.longCallsThreshold || '15:00'}</h3>
                            <p className="text-sm text-muted-foreground">Threshold for Long Call</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Total Calls</p>
                            <h3 className="text-2xl font-bold">{longCallData?.totalCallCount || 0}</h3>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Long Calls</p>
                            <h3 className="text-2xl font-bold text-primary">{longCallData?.totalLongCalls || 0}</h3>
                          </div>
                        </div>

                        <div className="mb-6">
                          <div className="relative">
                            <div className="absolute -top-6 text-sm font-semibold text-primary" style={{ left: `${longCallData?.longCallsPercentage || 0}%` }}>
                              {longCallData?.longCallsPercentage || 0}%
                            </div>
                            <Progress value={longCallData?.longCallsPercentage || 0} className="h-3" />
                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                              <span>0</span>
                              <span>{longCallData?.totalCallCount || 0}</span>
                            </div>
                          </div>
                        </div>

                        <LongCallLogs 
                          fromTime={effectiveDateRange?.fromDate || ''} 
                          toTime={effectiveDateRange?.toDate || ''} 
                        />
                      </div>
                    </Card>
                  )}
                </>
              )
            }
          ]}
        />
      </CardContent>
    </Card>
  );
}
