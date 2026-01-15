import { useState, useRef } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip } from "antd";
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
            
            <DatePicker 
              suffixIcon={<IconCalendar />}
              className="rounded-lg"
            />
          </div>
          
          {hasFilter && (
            <div className="mt-2 inline-flex items-center px-3 py-1.5 bg-blue-500/5 rounded-md text-[13px] font-medium">
              Total Calls 
              <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white rounded">{totalCalls}</span>
            </div>
          )}
        </div>
        
        {/* Carousel Section */}
        <div className="relative">
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
      </div>
    </Card>
  );
};
