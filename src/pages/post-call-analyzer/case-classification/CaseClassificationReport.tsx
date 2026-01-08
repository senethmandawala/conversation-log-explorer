import { useState, useRef } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip } from "antd";
import { 
  LeftOutlined, 
  RightOutlined, 
  CloseOutlined, 
  CalendarOutlined, 
  BarChartOutlined,
  ApartmentOutlined 
} from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { Category } from "./Category";
import { TopSubCategory } from "./TopSubCategory";
import { SubCategoryList } from "./SubCategoryList";
import { CallLogsSummary } from "./CallLogsSummary";

const { Title, Text } = Typography;

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
  chartData: any[];
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
  
  const [slides, setSlides] = useState<Slide[]>([
    { id: 1, type: "category", title: "Categories", breadcrumb: [] }
  ]);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [totalCalls, setTotalCalls] = useState(1080);
  const [selectedCategory, setSelectedCategory] = useState<{ name: string; color: string } | null>(null);

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
        />
      );
    }

    if (slide.type === "subcategory" && selectedCategory) {
      return (
        <TopSubCategory 
          category={selectedCategory}
          onSubCategorySelect={handleSubcategoryClick}
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
            
            <DatePicker 
              suffixIcon={<CalendarOutlined />}
              style={{ 
                borderRadius: 8,
                borderColor: '#d9d9d9'
              }}
            />
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
      </div>
    </Card>
  );
};
