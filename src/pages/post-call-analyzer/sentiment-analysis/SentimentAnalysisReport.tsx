import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Typography, Space, Button, Tooltip, Tabs } from "antd";
import { 
  IconArrowLeft, 
  IconInfoCircle, 
  IconRefresh, 
  IconCalendar, 
  IconList,
  IconHeart,
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

const { Title, Text } = Typography;
import { UsersSentiment } from "./UsersSentiment";
import { SentimentTopCategories } from "./SentimentTopCategories";
import { SentimentTopAgents } from "./SentimentTopAgents";
import { AgentsSentiment } from "./AgentsSentiment";
import { AgentsSentimentTopCategory } from "./AgentsSentimentTopCategory";
import { AgentsSentimentTopAgents } from "./AgentsSentimentTopAgents";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedCategory {
  name: string;
  color: string;
}

export default function SentimentAnalysisReport() {
  const { setSelectedTab } = usePostCall();
  const { selectedProject } = useProjectSelection();
  const { globalDateRange } = useDate();
  
  const [activeTab, setActiveTab] = useState("callers");
  const [localDateRange, setLocalDateRange] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Use local date range if user has set it, otherwise use global
  const effectiveDateRange = localDateRange || globalDateRange;
  
  // Force new reference when global date range changes to trigger DatePickerComponent update
  const dateInputForPicker = effectiveDateRange ? { ...effectiveDateRange } : null;
  
  // Reactive state management
  const destroyRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const manualRefreshRef = useRef(new SimpleSubject<any>());
  
  const [selectedSentiment, setSelectedSentiment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  
  const [col1Visible, setCol1Visible] = useState(true);
  const [col2Visible, setCol2Visible] = useState(false);
  const [col3Visible, setCol3Visible] = useState(false);
  
  const [col1Class, setCol1Class] = useState("col-span-12");
  const [col2Class, setCol2Class] = useState("col-span-6");
  const [col3Class, setCol3Class] = useState("col-span-5");
  
  // Data states
  const [userSentimentData, setUserSentimentData] = useState<any>(null);
  const [agentSentimentData, setAgentSentimentData] = useState<any>(null);
  const [userSentimentLoading, setUserSentimentLoading] = useState(false);
  const [agentSentimentLoading, setAgentSentimentLoading] = useState(false);

  // Debounced refresh function for user sentiment data
  const debouncedRefreshUserSentiment = useCallback((overrideDateRange?: any) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (selectedProject && !destroyRef.current) {
        loadUserSentimentData(overrideDateRange);
      }
    }, 300);
  }, [selectedProject]);

  // Debounced refresh function for agent sentiment data
  const debouncedRefreshAgentSentiment = useCallback((overrideDateRange?: any) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (selectedProject && !destroyRef.current) {
        loadAgentSentimentData(overrideDateRange);
      }
    }, 300);
  }, [selectedProject]);

  // Load user sentiment data
  const loadUserSentimentData = async (overrideDateRange?: any) => {
    const dateRangeToUse = overrideDateRange || effectiveDateRange;
    
    if (!selectedProject || !dateRangeToUse) {
      return;
    }

    setUserSentimentLoading(true);
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

      const response = await callRoutingApiService.UserSentiment(filters);
      
      if (response?.data) {
        setUserSentimentData(response.data);
      } else {
        setUserSentimentData(null);
      }
    } catch (error) {
      console.error('Error loading user sentiment data:', error);
      setUserSentimentData(null);
    } finally {
      setUserSentimentLoading(false);
    }
  };

  // Load agent sentiment data
  const loadAgentSentimentData = async (overrideDateRange?: any) => {
    const dateRangeToUse = overrideDateRange || effectiveDateRange;
    
    if (!selectedProject || !dateRangeToUse) {
      return;
    }

    setAgentSentimentLoading(true);
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

      const response = await callRoutingApiService.AgentSentiment(filters);
      
      if (response?.data) {
        setAgentSentimentData(response.data);
      } else {
        setAgentSentimentData(null);
      }
    } catch (error) {
      console.error('Error loading agent sentiment data:', error);
      setAgentSentimentData(null);
    } finally {
      setAgentSentimentLoading(false);
    }
  };

  const handleUserSentimentSelect = (sentiment: string) => {
    setSelectedSentiment(sentiment);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleAgentSentimentSelect = (sentiment: string) => {
    setSelectedSentiment(sentiment);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(true);
    setCol1Class("col-span-3");
    setCol2Class("col-span-4");
    setCol3Class("col-span-5");
  };

  const handleCloseCategoryChart = () => {
    setSelectedSentiment("");
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleCloseAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setSelectedSentiment("");
    setSelectedCategory(null);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleDateRangeChange = (dateRange: any) => {
    setLocalDateRange(dateRange);
  };

  const handleReload = () => {
    if (activeTab === "callers") {
      manualRefreshRef.current.next({ type: 'user', dateRange: effectiveDateRange });
    } else {
      manualRefreshRef.current.next({ type: 'agent', dateRange: effectiveDateRange });
    }
  };

  // Watch for global date range changes (from ModuleTabs.tsx)
  useEffect(() => {
    if (destroyRef.current) return;

    // If global date range changes, clear local selection to allow global to take precedence
    if (globalDateRange) {
      setLocalDateRange(null); // Clear local selection
      // Trigger refresh with global date range based on active tab
      if (activeTab === "callers") {
        manualRefreshRef.current.next({ type: 'user', dateRange: globalDateRange });
      } else {
        manualRefreshRef.current.next({ type: 'agent', dateRange: globalDateRange });
      }
    }
  }, [globalDateRange]); // Remove activeTab from dependencies

  // Subscribe to manual refresh events
  useEffect(() => {
    const subscription = manualRefreshRef.current.subscribe((data) => {
      if (data.type === 'user') {
        debouncedRefreshUserSentiment(data.dateRange);
      } else if (data.type === 'agent') {
        debouncedRefreshAgentSentiment(data.dateRange);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [debouncedRefreshUserSentiment, debouncedRefreshAgentSentiment]);

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
      if (activeTab === "callers") {
        manualRefreshRef.current.next({ type: 'user', dateRange: effectiveDateRange });
      } else {
        manualRefreshRef.current.next({ type: 'agent', dateRange: effectiveDateRange });
      }
    } else {
      setLoading(true);
    }
  }, [selectedProject, effectiveDateRange]); // Remove activeTab from dependencies

  // Handle tab changes separately to load appropriate data
  useEffect(() => {
    if (selectedProject && effectiveDateRange) {
      if (activeTab === "callers") {
        manualRefreshRef.current.next({ type: 'user', dateRange: effectiveDateRange });
      } else {
        manualRefreshRef.current.next({ type: 'agent', dateRange: effectiveDateRange });
      }
    }
  }, [activeTab]); // Only depend on activeTab

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
                <IconHeart className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-xl !font-semibold">
                    Sentiment Analysis
                  </Title>
                  <Tooltip title="Analyze user and agent sentiment patterns">
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
                toolTipValue="Select date range for sentiment analysis"
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
              key: "callers",
              label: "Callers",
              children: (
                <div className="mt-6">
                  <div className="grid grid-cols-12 gap-4">
                    <AnimatePresence mode="sync">
                      {col1Visible && (
                        <motion.div
                          key="col1-callers"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col1Class)}` }}
                        >
                          {userSentimentLoading ? (
                            <ExceptionHandleView type="loading" />
                          ) : hasError ? (
                            <ExceptionHandleView 
                              type="500" 
                              title="Error Loading Data"
                              content="user sentiment data"
                              onTryAgain={() => manualRefreshRef.current.next({ type: 'user', dateRange: effectiveDateRange })}
                            />
                          ) : !userSentimentData ? (
                            <ExceptionHandleView 
                              type="204" 
                              title="No User Sentiment Data"
                              content="user sentiment analysis for the selected period"
                              onTryAgain={() => manualRefreshRef.current.next({ type: 'user', dateRange: effectiveDateRange })}
                            />
                          ) : userSentimentData.positiveCount === 0 && userSentimentData.neutralCount === 0 && userSentimentData.negativeCount === 0 ? (
                            <ExceptionHandleView 
                              type="204" 
                              title="No Content Found"
                              content="user sentiment data for the selected period"
                              onTryAgain={() => manualRefreshRef.current.next({ type: 'user', dateRange: effectiveDateRange })}
                            />
                          ) : (
                            <UsersSentiment 
                              onSentimentSelect={handleUserSentimentSelect} 
                              data={userSentimentData}
                            />
                          )}
                        </motion.div>
                      )}

                      {col2Visible && selectedSentiment && (
                        <motion.div
                          key="col2-callers"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col2Class)}` }}
                        >
                          <SentimentTopCategories
                            selectedSentiment={selectedSentiment}
                            onCategorySelect={handleCategorySelect}
                            onClose={handleCloseCategoryChart}
                            dateRange={effectiveDateRange}
                            onRetry={() => manualRefreshRef.current.next({ type: 'user', dateRange: effectiveDateRange })}
                          />
                        </motion.div>
                      )}

                      {col3Visible && selectedCategory && (
                        <motion.div
                          key="col3-callers"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col3Class)}` }}
                        >
                          <SentimentTopAgents
                            selectedSentiment={selectedSentiment}
                            selectedCategory={selectedCategory}
                            onClose={handleCloseAgentChart}
                            dateRange={effectiveDateRange}
                            onRetry={() => manualRefreshRef.current.next({ type: 'user', dateRange: effectiveDateRange })}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            },
            {
              key: "agents",
              label: "Agents",
              children: (
                <div className="mt-6">
                  <div className="grid grid-cols-12 gap-4">
                    <AnimatePresence mode="sync">
                      {col1Visible && (
                        <motion.div
                          key="col1-agents"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col1Class)}` }}
                        >
                          {agentSentimentLoading ? (
                            <ExceptionHandleView type="loading" />
                          ) : hasError ? (
                            <ExceptionHandleView 
                              type="500" 
                              title="Error Loading Data"
                              content="agent sentiment data"
                              onTryAgain={() => manualRefreshRef.current.next({ type: 'agent', dateRange: effectiveDateRange })}
                            />
                          ) : !agentSentimentData ? (
                            <ExceptionHandleView 
                              type="204" 
                              title="No Agent Sentiment Data"
                              content="agent sentiment analysis for the selected period"
                              onTryAgain={() => manualRefreshRef.current.next({ type: 'agent', dateRange: effectiveDateRange })}
                            />
                          ) : agentSentimentData.positiveCount === 0 && agentSentimentData.neutralCount === 0 && agentSentimentData.negativeCount === 0 ? (
                            <ExceptionHandleView 
                              type="204" 
                              title="No Content Found"
                              content="agent sentiment data for the selected period"
                              onTryAgain={() => manualRefreshRef.current.next({ type: 'agent', dateRange: effectiveDateRange })}
                            />
                          ) : (
                            <AgentsSentiment 
                              onSentimentSelect={handleAgentSentimentSelect} 
                              data={agentSentimentData}
                            />
                          )}
                        </motion.div>
                      )}

                      {col2Visible && selectedSentiment && (
                        <motion.div
                          key="col2-agents"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col2Class)}` }}
                        >
                          <AgentsSentimentTopCategory
                            selectedSentiment={selectedSentiment}
                            onCategorySelect={handleCategorySelect}
                            onClose={handleCloseCategoryChart}
                            dateRange={effectiveDateRange}
                            onRetry={() => manualRefreshRef.current.next({ type: 'agent', dateRange: effectiveDateRange })}
                          />
                        </motion.div>
                      )}

                      {col3Visible && selectedCategory && (
                        <motion.div
                          key="col3-agents"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col3Class)}` }}
                        >
                          <AgentsSentimentTopAgents
                            selectedSentiment={selectedSentiment}
                            selectedCategory={selectedCategory}
                            onClose={handleCloseAgentChart}
                            dateRange={effectiveDateRange}
                            onRetry={() => manualRefreshRef.current.next({ type: 'agent', dateRange: effectiveDateRange })}
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
