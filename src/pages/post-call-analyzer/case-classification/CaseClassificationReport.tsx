import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Button, Tooltip, Space, DatePicker, Typography } from "antd";
import { 
  LeftOutlined, 
  RightOutlined, 
  CloseOutlined, 
  CalendarOutlined, 
  BarChartOutlined,
  ApartmentOutlined,
  ReloadOutlined,
  EyeOutlined 
} from "@ant-design/icons";
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
        />
      );
    }

    if (slide.type === "callLogs") {
      return <CallLogsSummary breadcrumb={slide.breadcrumb} />;
    }

    return null;
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
      <div>
        {/* Header Section */}
        <div style={{ marginTop: -12, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Space align="center" size="middle" orientation="horizontal">
              {!hideAccentLine && (
                <div
                  style={{
                    width: 4,
                    height: 32,
                    background: 'linear-gradient(to bottom, #1890ff, rgba(24, 144, 255, 0.5))',
                    borderRadius: 2
                  }}
                />
              )}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    {title}
                  </Title>
                  <Tooltip title="Drill down into case categories to analyze call distribution">
                    <div style={{ marginTop: '-4px' }}>
                      <TablerIcon 
                        name="info-circle" 
                        className="wn-tabler-14"
                        size={14}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" style={{ fontSize: 14, marginBottom: 8 }}>
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
            <div style={{ 
              marginTop: 8, 
              display: 'inline-flex', 
              alignItems: 'center', 
              padding: '6px 12px', 
              backgroundColor: 'rgba(24, 144, 255, 0.05)', 
              border: '1px solid rgba(24, 144, 255, 0.2)', 
              borderRadius: 16, 
              fontSize: 12, 
              fontWeight: 500 
            }}>
              Total Calls 
              <span style={{ 
                marginLeft: 8, 
                padding: '2px 8px', 
                backgroundColor: '#1890ff', 
                color: 'white', 
                borderRadius: 12 
              }}>
                {totalCalls}
              </span>
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
                icon={<LeftOutlined />}
                onClick={scrollPrev}
                disabled={visibleStartIndex === 0}
                style={{
                  position: 'absolute',
                  left: -16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              />
              <Button
                type="default"
                icon={<RightOutlined />}
                onClick={scrollNext}
                disabled={visibleStartIndex >= slides.length - 2}
                style={{
                  position: 'absolute',
                  right: -16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              />
            </>
          )}

          {/* Slides */}
          <div 
            ref={carouselRef}
            style={{ overflow: 'hidden', width: '100%' }}
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
                          <Title level={5} style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                            {slide.title}
                          </Title>
                          {slide.breadcrumb.length > 0 && (
                            <Text 
                              type="secondary" 
                              style={{ fontSize: 12, marginTop: 4, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                              title={slide.breadcrumb.join(" / ")}
                            >
                              {slide.breadcrumb.join(" / ")}
                            </Text>
                          )}
                        </div>
                        {slide.id > 1 && (
                          <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={() => closeSlide(slide.id)}
                            style={{ width: 28, height: 28 }}
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
