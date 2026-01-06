import { useState, useRef } from "react";
import { Card, Button, Typography, Tooltip, Tag } from "antd";
import { 
  InfoCircleOutlined, 
  CalendarOutlined, 
  LeftOutlined, 
  RightOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
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

export function CaseClassificationReportAntd() {
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

  const renderSlideContent = (slide: Slide) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          border: "1px solid hsl(var(--border))",
        }}
        styles={{
          header: {
            borderBottom: "1px solid hsl(var(--border))",
            padding: "16px 20px",
          },
          body: { padding: "20px" },
        }}
        title={
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 4,
                height: 32,
                borderRadius: 4,
                background: "linear-gradient(180deg, hsl(226, 70%, 55%) 0%, hsl(226, 70%, 55%, 0.5) 100%)",
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                  Case Classification
                </Title>
                <Tooltip title="Drill down into case categories to analyze call distribution">
                  <InfoCircleOutlined style={{ color: "hsl(var(--muted-foreground))", cursor: "help" }} />
                </Tooltip>
                <Tag color="blue">
                  {totalCalls.toLocaleString()} Total Calls
                </Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>
                14 December 2025
              </Text>
            </div>
          </div>
        }
        extra={
          <div className="flex items-center gap-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            <CalendarOutlined />
            <span>Today</span>
          </div>
        }
      >
        <div className="relative">
          {/* Navigation Buttons */}
          {slides.length > 2 && (
            <>
              <Button
                type="default"
                shape="circle"
                icon={<LeftOutlined />}
                onClick={scrollPrev}
                disabled={visibleStartIndex === 0}
                style={{
                  position: "absolute",
                  left: -12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />
              <Button
                type="default"
                shape="circle"
                icon={<RightOutlined />}
                onClick={scrollNext}
                disabled={visibleStartIndex >= slides.length - 2}
                style={{
                  position: "absolute",
                  right: -12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />
            </>
          )}

          {/* Slides */}
          <div ref={carouselRef} className="overflow-hidden w-full">
            <div
              className="flex"
              style={{
                transform: `translateX(-${visibleStartIndex * 50}%)`,
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="flex-shrink-0 pr-4"
                  style={{ 
                    width: slides.length === 1 ? '100%' : '50%',
                    transition: 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <Card
                    size="small"
                    bordered
                    style={{
                      height: 350,
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--background))",
                    }}
                    styles={{ body: { height: "100%", padding: 12 } }}
                  >
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="min-w-0 flex-1">
                          <Text strong style={{ fontSize: 14 }}>{slide.title}</Text>
                          {slide.breadcrumb.length > 0 && (
                            <Text 
                              type="secondary" 
                              style={{ display: "block", fontSize: 12, marginTop: 4 }}
                              ellipsis={{ tooltip: slide.breadcrumb.join(" / ") }}
                            >
                              {slide.breadcrumb.join(" / ")}
                            </Text>
                          )}
                        </div>
                        {slide.id > 1 && (
                          <Button
                            type="text"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => closeSlide(slide.id)}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-h-0">
                        {renderSlideContent(slide)}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
