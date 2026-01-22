import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Typography, Space, Button, Tooltip, Tabs } from "antd";
import { 
  IconArrowLeft, 
  IconInfoCircle, 
  IconRefresh, 
  IconCalendar, 
  IconList,
  IconPhone,
  IconX
} from "@tabler/icons-react";
import { usePostCall } from "@/contexts/PostCallContext";
import { useProjectSelection } from "@/services/projectSelectionService";
import { useDate } from "@/contexts/DateContext";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import { AIHelper } from "@/components/post-call/AIHelper";
import { TablerIcon } from "@/components/ui/tabler-icon";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";

// SimpleSubject for reactive state management
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

const { Title, Text } = Typography;
import { CaseStatusOverall } from "./CaseStatusOverall";
import { CaseStatusTopCategories } from "./CaseStatusTopCategories";
import { CaseStatusTopAgents } from "./CaseStatusTopAgents";
import { AverageTimeTopCategories } from "./AverageTimeTopCategories";
import { AverageTimeTopAgents } from "./AverageTimeTopAgents";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedCategory {
  name: string;
  color: string;
}

export default function CallResolutionReport() {
  const { setSelectedTab } = usePostCall();
  const { selectedProject } = useProjectSelection();
  const { globalDateRange } = useDate();
  
  const [activeTab, setActiveTab] = useState("resolution-status");
  const [localDateRange, setLocalDateRange] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Use local date range if user has set it, otherwise use global
  const effectiveDateRange = localDateRange || globalDateRange;
  
  // Force new reference when global date range changes
  const dateInputForPicker = effectiveDateRange ? { ...effectiveDateRange } : null;
  
  // Reactive state management
  const destroyRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const manualRefreshRef = useRef(new SimpleSubject<any>());
  
  const [selectedCaseType, setSelectedCaseType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  
  const [col1Visible, setCol1Visible] = useState(true);
  const [col2Visible, setCol2Visible] = useState(false);
  const [col3Visible, setCol3Visible] = useState(false);
  
  const [col1Class, setCol1Class] = useState("col-span-12");
  const [col2Class, setCol2Class] = useState("col-span-6");
  const [col3Class, setCol3Class] = useState("col-span-6");

  // Data states for Resolution Status tab
  const [caseStatusData, setCaseStatusData] = useState<any>(null);
  const [caseStatusLoading, setCaseStatusLoading] = useState(false);
  
  // Data states for Average Resolution Time tab
  const [avgTimeData, setAvgTimeData] = useState<any>(null);
  const [avgTimeLoading, setAvgTimeLoading] = useState(false);
  const [categoryTimeData, setCategoryTimeData] = useState<any[]>([]);
  const [categoryTimeLoading, setCategoryTimeLoading] = useState(false);

  // Debounced refresh function for case status data
  const debouncedRefreshCaseStatus = useCallback((overrideDateRange?: any) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (selectedProject && !destroyRef.current) {
        loadCaseStatusData(overrideDateRange);
      }
    }, 300);
  }, [selectedProject]);

  // Debounced refresh function for avg time data
  const debouncedRefreshAvgTime = useCallback((overrideDateRange?: any) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (selectedProject && !destroyRef.current) {
        loadAvgTimeData(overrideDateRange);
        loadCategoryTimeData(overrideDateRange);
      }
    }, 300);
  }, [selectedProject]);

  // Load case status data (Resolution Status tab)
  const loadCaseStatusData = async (overrideDateRange?: any) => {
    const dateRangeToUse = overrideDateRange || effectiveDateRange;
    
    if (!selectedProject || !dateRangeToUse) {
      return;
    }

    setCaseStatusLoading(true);
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

      const response = await callRoutingApiService.CallResolutionStatus(filters);
      
      if (response?.data) {
        setCaseStatusData(response.data);
      } else {
        setCaseStatusData(null);
      }
    } catch (error) {
      console.error('Error loading case status data:', error);
      setCaseStatusData(null);
    } finally {
      setCaseStatusLoading(false);
    }
  };

  // Load average resolution time data
  const loadAvgTimeData = async (overrideDateRange?: any) => {
    const dateRangeToUse = overrideDateRange || effectiveDateRange;
    
    if (!selectedProject || !dateRangeToUse) {
      return;
    }

    setAvgTimeLoading(true);
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

      const response = await callRoutingApiService.CallResolutionAverageResoltuionTime(filters);
      
      if (response?.data) {
        setAvgTimeData(response.data);
      } else {
        setAvgTimeData(null);
      }
    } catch (error) {
      console.error('Error loading avg time data:', error);
      setAvgTimeData(null);
    } finally {
      setAvgTimeLoading(false);
    }
  };

  // Load category time data for Average Resolution Time tab
  const loadCategoryTimeData = async (overrideDateRange?: any) => {
    const dateRangeToUse = overrideDateRange || effectiveDateRange;
    
    if (!selectedProject || !dateRangeToUse) {
      return;
    }

    setCategoryTimeLoading(true);
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
        limit: 10,
      };

      const response = await callRoutingApiService.CallResolutionTime(filters);
      
      if (response?.data && Array.isArray(response.data)) {
        setCategoryTimeData(response.data);
      } else {
        setCategoryTimeData([]);
      }
    } catch (error) {
      console.error('Error loading category time data:', error);
      setCategoryTimeData([]);
    } finally {
      setCategoryTimeLoading(false);
    }
  };

  const handleCaseSelect = (caseType: string) => {
    setSelectedCaseType(caseType);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
  };

  const handleCaseStatusCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(true);
    setCol1Class("col-span-3");
    setCol2Class("col-span-4");
    setCol3Class("col-span-5");
  };

  const handleAverageTimeCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
  };

  const handleCloseCategoryChart = () => {
    setSelectedCaseType("");
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
  };

  const handleCloseAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
  };

  const handleCloseAverageTimeAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setSelectedCaseType("");
    setSelectedCategory(null);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
  };

  const handleDateRangeChange = (dateRange: any) => {
    setLocalDateRange(dateRange);
  };

  const handleReload = () => {
    if (activeTab === "resolution-status") {
      manualRefreshRef.current.next({ type: 'status', dateRange: effectiveDateRange });
    } else {
      manualRefreshRef.current.next({ type: 'avgtime', dateRange: effectiveDateRange });
    }
  };

  // Watch for global date range changes
  useEffect(() => {
    if (destroyRef.current) return;

    if (globalDateRange) {
      setLocalDateRange(null);
      if (activeTab === "resolution-status") {
        manualRefreshRef.current.next({ type: 'status', dateRange: globalDateRange });
      } else {
        manualRefreshRef.current.next({ type: 'avgtime', dateRange: globalDateRange });
      }
    }
  }, [globalDateRange]);

  // Subscribe to manual refresh events
  useEffect(() => {
    const subscription = manualRefreshRef.current.subscribe((data) => {
      if (data.type === 'status') {
        debouncedRefreshCaseStatus(data.dateRange);
      } else if (data.type === 'avgtime') {
        debouncedRefreshAvgTime(data.dateRange);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [debouncedRefreshCaseStatus, debouncedRefreshAvgTime]);

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
      if (activeTab === "resolution-status") {
        manualRefreshRef.current.next({ type: 'status', dateRange: effectiveDateRange });
      } else {
        manualRefreshRef.current.next({ type: 'avgtime', dateRange: effectiveDateRange });
      }
    } else {
      setLoading(true);
    }
  }, [selectedProject, effectiveDateRange]);

  // Handle tab changes separately
  useEffect(() => {
    if (selectedProject && effectiveDateRange) {
      if (activeTab === "resolution-status") {
        manualRefreshRef.current.next({ type: 'status', dateRange: effectiveDateRange });
      } else {
        manualRefreshRef.current.next({ type: 'avgtime', dateRange: effectiveDateRange });
      }
    }
  }, [activeTab]);

  const getColSpan = (colClass: string) => {
    if (colClass === "col-span-12") return 12;
    if (colClass === "col-span-6") return 6;
    if (colClass === "col-span-5") return 5;
    if (colClass === "col-span-3") return 3;
    if (colClass === "col-span-4") return 4;
    return 12;
  };

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle" orientation="horizontal">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconPhone className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-xl !font-semibold">
                    Call Resolution
                  </Title>
                  <Tooltip title="Track resolution rates and handling times">
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
                toolTipValue="Select date range for call resolution"
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

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="w-full"
          size="large"
          items={[
            {
              key: "resolution-status",
              label: "Resolution Status",
              children: (
                <div className="mt-6">
                  <div className="grid grid-cols-12 gap-4">
                    <AnimatePresence mode="sync">
                      {col1Visible && (
                        <motion.div
                          key="col1-status"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col1Class)}` }}
                        >
                          {caseStatusLoading ? (
                            <ExceptionHandleView type="loading" />
                          ) : hasError ? (
                            <ExceptionHandleView 
                              type="500" 
                              title="Error Loading Data"
                              content="case status data"
                              onTryAgain={() => manualRefreshRef.current.next({ type: 'status', dateRange: effectiveDateRange })}
                            />
                          ) : !caseStatusData ? (
                            <ExceptionHandleView 
                              type="204" 
                              title="No Case Status Data"
                              content="case status data for the selected period"
                              onTryAgain={() => manualRefreshRef.current.next({ type: 'status', dateRange: effectiveDateRange })}
                            />
                          ) : caseStatusData.totalCasesCount === 0 ? (
                            <ExceptionHandleView 
                              type="204" 
                              title="No Content Found"
                              content="case status data for the selected period"
                              onTryAgain={() => manualRefreshRef.current.next({ type: 'status', dateRange: effectiveDateRange })}
                            />
                          ) : (
                            <CaseStatusOverall 
                              onCaseSelect={handleCaseSelect} 
                              data={caseStatusData}
                            />
                          )}
                        </motion.div>
                      )}

                      {col2Visible && selectedCaseType && (
                        <motion.div
                          key="col2-status"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col2Class)}` }}
                        >
                          <CaseStatusTopCategories
                            selectedCaseType={selectedCaseType}
                            onCategorySelect={handleCaseStatusCategorySelect}
                            onClose={handleCloseCategoryChart}
                            dateRange={effectiveDateRange}
                            onRetry={() => manualRefreshRef.current.next({ type: 'status', dateRange: effectiveDateRange })}
                          />
                        </motion.div>
                      )}

                      {col3Visible && selectedCategory && (
                        <motion.div
                          key="col3-status"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col3Class)}` }}
                        >
                          <CaseStatusTopAgents
                            selectedCaseType={selectedCaseType}
                            selectedCategory={selectedCategory}
                            onClose={handleCloseAgentChart}
                            dateRange={effectiveDateRange}
                            onRetry={() => manualRefreshRef.current.next({ type: 'status', dateRange: effectiveDateRange })}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            },
            {
              key: "average-time",
              label: "Average Resolution Time",
              children: (
                <div className="mt-6">
                  {/* Summary Card */}
                  <div className="mb-4">
                    {avgTimeLoading ? (
                      <Card className="rounded-xl border-gray-200 bg-gradient-to-br from-blue-500 to-blue-600 p-4">
                        <div className="flex items-center justify-center h-16">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      </Card>
                    ) : avgTimeData ? (
                      <Card className="rounded-xl border-gray-200 bg-gradient-to-br from-blue-500 to-blue-600 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/80 text-sm mb-1">Average Resolution Time</p>
                            <div className="flex items-baseline gap-2">
                              <h2 className="text-3xl font-bold text-white m-0">{avgTimeData.averageTotalCallDuration || '0 min'}</h2>
                              <span className="text-white/80 text-sm">from {avgTimeData.totalCallCount || 0} calls</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white/80 text-sm mb-1">Total Duration</p>
                            <h3 className="text-xl font-semibold text-white m-0">{avgTimeData.totalCallDuration || '0 min'}</h3>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card className="rounded-xl border-gray-200 bg-gradient-to-br from-blue-500 to-blue-600 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/80 text-sm mb-1">Average Resolution Time</p>
                            <div className="flex items-baseline gap-2">
                              <h2 className="text-3xl font-bold text-white m-0">--</h2>
                              <span className="text-white/80 text-sm">No data available</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    <AnimatePresence mode="sync">
                      {col1Visible && (
                        <motion.div
                          key="col1-avgtime"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col1Class)}` }}
                        >
                          <AverageTimeTopCategories 
                            onCategorySelect={handleAverageTimeCategorySelect}
                            data={categoryTimeData}
                            loading={categoryTimeLoading}
                            onRetry={() => manualRefreshRef.current.next({ type: 'avgtime', dateRange: effectiveDateRange })}
                          />
                        </motion.div>
                      )}

                      {col2Visible && selectedCategory && (
                        <motion.div
                          key="col2-avgtime"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col2Class)}` }}
                        >
                          <AverageTimeTopAgents
                            selectedCategory={selectedCategory}
                            onClose={handleCloseAverageTimeAgentChart}
                            dateRange={effectiveDateRange}
                            onRetry={() => manualRefreshRef.current.next({ type: 'avgtime', dateRange: effectiveDateRange })}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            }
          ]}
        />
      </Space>
    </Card>
  );
}