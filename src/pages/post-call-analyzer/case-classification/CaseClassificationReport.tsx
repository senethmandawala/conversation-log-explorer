import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Button, Tooltip, Space, DatePicker, Typography } from "antd";
import { 
  IconArrowLeft, 
  IconArrowRight, 
  IconX, 
  IconCalendar, 
  IconChartBar,
  IconBuildingCommunity 
} from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { Category } from "./Category";
import { TopSubCategory } from "./TopSubCategory";
import { SubCategoryList } from "./SubCategoryList";
import { CallLogsSummary } from "./CallLogsSummary";
import { callRoutingApiService, type CommonResponse } from "@/services/callRoutingApiService";
import { useDate } from "@/contexts/DateContext";
import { useProjectSelection } from "@/services/projectSelectionService";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ReloadOutlined, EyeOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

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

interface Slide {
  id: number;
  type: "category" | "subcategory" | "level3" | "level4" | "level5" | "callLogs";
  title: string;
  breadcrumb: string[];
}

interface CaseClassificationReportProps {
  id: string;
  title: string;
  description: string;
  hasFilter?: boolean;
  chartData?: any[];
  hideAccentLine?: boolean;
}

export const CaseClassificationReport = ({ 
  title, 
  description, 
  hasFilter, 
  chartData,
  hideAccentLine 
}: CaseClassificationReportProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // API Integration State
  const [classificationData, setClassificationData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [localDateRange, setLocalDateRange] = useState<any>(null);
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

  // Original component state
  const [slides, setSlides] = useState<Slide[]>([
    { id: 1, type: "category", title: "Categories", breadcrumb: [] }
  ]);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [totalCalls, setTotalCalls] = useState(1080);
  const [selectedCategory, setSelectedCategory] = useState<{ name: string; color: string } | null>(null);

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
      // Use the date range passed through the Subject
      debouncedRefresh(dateRange);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [debouncedRefresh]);

  // Initial data loading
  useEffect(() => {
    if (destroyRef.current) return;

    // Trigger initial API call if we have project and date range
    if (selectedProject && effectiveDateRange) {
      manualRefreshRef.current.next(effectiveDateRange);
    }
  }, [selectedProject, effectiveDateRange]);

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
    // Close any open slides when date changes
    setSlides(prev => prev.slice(0, 1));
    setVisibleStartIndex(0);
  };

  // Handle reload
  const handleReload = () => {
    // Close any open slides when reload is clicked
    setSlides(prev => prev.slice(0, 1));
    setVisibleStartIndex(0);
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

      const response = await callRoutingApiService.CaseClassification(filters);

      // Check if response has data and transform it
      if (response?.data?.callPercentageData && response.data.callPercentageData.length > 0) {
        setClassificationData(response.data.callPercentageData);
        setTotalCalls(response.data.totalCallCount || 0);
        setHasData(true);
        setHasError(false);
      } else {
        setClassificationData([]);
        setTotalCalls(0);
        setHasData(false);
        setHasError(false);
      }
    } catch (error) {
      console.error('Error loading case classification data:', error);
      setHasError(true);
      setHasData(false);
      setClassificationData([]);
      setTotalCalls(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: { name: string; color: string }) => {
    setSelectedCategory(category);
    const newSlide: Slide = {
      id: 2,
      type: "subcategory",
      title: "Top Sub Categories",
      breadcrumb: [category.name],
    };
    
    setSlides(prev => [...prev.slice(0, 1), newSlide]);
    setVisibleStartIndex(0);
  };

  const handleSubcategoryClick = (subcategoryName: string) => {
    setSlides(prev => {
      const newSlide: Slide = {
        id: 3,
        type: "level3",
        title: "Category Level 3",
        breadcrumb: [...prev[1].breadcrumb, subcategoryName],
      };
      return [...prev.slice(0, 2), newSlide];
    });
    setVisibleStartIndex(1);
  };

  const handleLevel3Click = (itemName: string) => {
    setSlides(prev => {
      const newSlide: Slide = {
        id: 4,
        type: "level4",
        title: "Category Level 4",
        breadcrumb: [...prev[2].breadcrumb, itemName],
      };
      return [...prev.slice(0, 3), newSlide];
    });
    setVisibleStartIndex(2);
  };

  const handleLevel4Click = (itemName: string) => {
    setSlides(prev => {
      const newSlide: Slide = {
        id: 5,
        type: "level5",
        title: "Category Level 5",
        breadcrumb: [...prev[3].breadcrumb, itemName],
      };
      return [...prev.slice(0, 4), newSlide];
    });
    setVisibleStartIndex(3);
  };

  const handleLevel5Click = (itemName: string) => {
    setSlides(prev => {
      const newSlide: Slide = {
        id: 6,
        type: "callLogs",
        title: "Call Logs",
        breadcrumb: [...prev[4].breadcrumb, itemName],
      };
      return [...prev.slice(0, 5), newSlide];
    });
    setVisibleStartIndex(4);
  };

  const handleShowCallLogs = (level: number) => {
    setSlides(prev => {
      const updatedSlides = [...prev];
      updatedSlides[level] = {
        ...updatedSlides[level],
        type: "callLogs",
        title: "Call Logs",
      };
      return updatedSlides;
    });
  };

  const closeSlide = (slideId: number) => {
    const slideIndex = slides.findIndex(s => s.id === slideId);
    if (slideIndex > 0) {
      const newSlides = slides.slice(0, slideIndex);
      setSlides(newSlides);
      setVisibleStartIndex(0);
    }
  };

  const scrollPrev = () => {
    if (visibleStartIndex > 0) {
      setVisibleStartIndex(prev => prev - 1);
    }
  };

  const scrollNext = () => {
    const maxIndex = Math.max(0, slides.length - 2);
    if (visibleStartIndex < maxIndex) {
      setVisibleStartIndex(prev => prev + 1);
    }
  };

  const renderSlideContent = (slide: Slide, index: number) => {
    if (slide.type === "category") {
      return (
        <Category 
          onCategorySelect={handleCategoryClick}
          onTotalCallsChange={setTotalCalls}
          data={classificationData}
        />
      );
    }

    if (slide.type === "subcategory" && selectedCategory) {
      return (
        <TopSubCategory 
          category={selectedCategory}
          onSubCategorySelect={handleSubcategoryClick}
          fromTime={effectiveDateRange?.fromDate}
          toTime={effectiveDateRange?.toDate}
          onClose={() => {
            // Close the subcategory slide
            setSlides(prev => prev.slice(0, 1));
            setVisibleStartIndex(0);
          }}
          onReload={() => {
            // Reload the main data
            loadData();
          }}
        />
      );
    }

    if (slide.type === "level3" && selectedCategory) {
      return (
        <SubCategoryList 
          category={selectedCategory}
          level={3}
          breadcrumb={slide.breadcrumb}
          onSubCategorySelect={handleLevel3Click}
          onShowCallLogs={() => handleShowCallLogs(2)}
          fromTime={effectiveDateRange?.fromDate}
          toTime={effectiveDateRange?.toDate}
        />
      );
    }

    if (slide.type === "level4" && selectedCategory) {
      return (
        <SubCategoryList 
          category={selectedCategory}
          level={4}
          breadcrumb={slide.breadcrumb}
          onSubCategorySelect={handleLevel4Click}
          onShowCallLogs={() => handleShowCallLogs(3)}
          fromTime={effectiveDateRange?.fromDate}
          toTime={effectiveDateRange?.toDate}
        />
      );
    }

    if (slide.type === "level5" && selectedCategory) {
      return (
        <SubCategoryList 
          category={selectedCategory}
          level={5}
          breadcrumb={slide.breadcrumb}
          onSubCategorySelect={handleLevel5Click}
          onShowCallLogs={() => handleShowCallLogs(4)}
          fromTime={effectiveDateRange?.fromDate}
          toTime={effectiveDateRange?.toDate}
        />
      );
    }

    if (slide.type === "callLogs") {
      return <CallLogsSummary breadcrumb={slide.breadcrumb} fromTime={effectiveDateRange?.fromDate} toTime={effectiveDateRange?.toDate} />;
    }

    return null;
  };

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <div>
        {/* Header Section */}
        <div className="-mt-3 mb-4">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle" orientation="horizontal">
              {!hideAccentLine && (
                <div className="w-1 h-8 rounded-sm bg-gradient-to-b from-blue-500 to-blue-500/50" />
              )}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconBuildingCommunity className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-lg !font-semibold">
                    {title}
                  </Title>
                  <Tooltip title="Drill down into case categories to analyze call distribution">
                    <div className="-mt-1">
                      <TablerIcon 
                        name="info-circle" 
                        className="wn-tabler-14"
                        size={14}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" className="text-sm mb-2">
                  {description}
                </Text>
              </div>
            </Space>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DatePickerComponent
                onSelectedRangeValueChange={handleDateRangeChange}
                toolTipValue="Select date range for case classification data"
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
          
          {hasFilter && (
            <div className="mt-2 inline-flex items-center px-3 py-1.5 bg-blue-500/5 rounded-md text-[13px] font-medium">
              Total Calls 
              <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white rounded">{totalCalls}</span>
            </div>
          )}
        </div>
        
        {/* Carousel Section */}
        {isLoading ? (
          <ExceptionHandleView 
            type="loading" 
            justLoading={false}
          />
        ) : hasError ? (
          <ExceptionHandleView 
            type="500" 
            title="Error loading case classification data"
            content="case classification data"
            onTryAgain={handleReload}
          />
        ) : !hasData ? (
          <ExceptionHandleView 
            type="204" 
            title="No Case Classification Data"
            content="case classification data"
            onTryAgain={handleReload}
          />
        ) : (
          <div style={{ position: 'relative' }}>
          {/* Navigation Buttons */}
          {slides.length > 2 && (
            <>
              <Button
                type="default"
                icon={<IconArrowLeft />}
                onClick={scrollPrev}
                disabled={visibleStartIndex === 0}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10"
              />
              <Button
                type="default"
                icon={<IconArrowRight />}
                onClick={scrollNext}
                disabled={visibleStartIndex >= slides.length - 2}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10"
              />
            </>
          )}

          {/* Slides */}
          <div 
            ref={carouselRef}
            className="overflow-hidden w-full"
          >
            <div
              style={{
                display: 'flex',
                transform: `translateX(-${visibleStartIndex * 50}%)`,
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  style={{ 
                    flexShrink: 0,
                    paddingRight: 16,
                    width: slides.length === 1 ? '100%' : '50%',
                    transition: 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <Card
                    style={{
                      borderRadius: 12,
                      border: '1px solid #e8e8e8',
                      background: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      padding: 16,
                      height: 450
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <Title level={5} className="!m-0 !text-sm !font-semibold">
                            {slide.title}
                          </Title>
                          {slide.breadcrumb.length > 0 && (
                            <Text 
                              type="secondary" 
                              className="text-xs mt-1 block overflow-hidden text-ellipsis whitespace-nowrap"
                              title={slide.breadcrumb.join(" / ")}
                            >
                              {slide.breadcrumb.join(" / ")}
                            </Text>
                          )}
                        </div>
                        {slide.id > 1 && (
                          <Button
                            type="text"
                            icon={<IconX />}
                            onClick={() => closeSlide(slide.id)}
                            className="w-7 h-7"
                          />
                        )}
                      </div>
                      <div style={{ flex: 1, minHeight: 0 }}>
                        {renderSlideContent(slide, index)}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </Card>
  );
};
