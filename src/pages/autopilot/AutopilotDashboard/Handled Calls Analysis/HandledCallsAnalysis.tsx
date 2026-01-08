import { useState, useCallback } from "react";
import { 
  Card, 
  Typography, 
  Button, 
  Tooltip, 
  Space,
  Skeleton,
  Table,
  Tag
} from "antd";
import { 
  PieChartOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

const { Title, Text } = Typography;

const { Column } = Table;

interface SlideData {
  id: number;
  title: string;
  breadcrumb?: string[];
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface TableDataItem {
  label: string;
  count: number;
}

// Mock data for main chart (Slide 1)
const mainChartData: ChartDataItem[] = [
  { name: "Success Calls", value: 1250, color: "#22c55e" },
  { name: "Failed Calls", value: 340, color: "#ef4444" },
  { name: "Abandoned Calls", value: 180, color: "#eab308" },
];

// Mock data for Slide 2 based on category
const slide2DataMap: Record<string, ChartDataItem[] | TableDataItem[]> = {
  "Success Calls": [
    { name: "Full Fill", value: 890, color: "#22c55e" },
    { name: "Partial Fill", value: 245, color: "#84cc16" },
    { name: "Callback Scheduled", value: 115, color: "#06b6d4" },
  ],
  "Failed Calls": [
    { name: "API Failures", value: 145, color: "#f97316" },
    { name: "System And Intent Recognition Failures", value: 98, color: "#ef4444" },
    { name: "Customer Request Not Completed", value: 97, color: "#dc2626" },
  ],
  "Abandoned Calls": [
    { label: "Customer Hung Up", count: 85 },
    { label: "Long Wait Time", count: 52 },
    { label: "Technical Issues", count: 28 },
    { label: "Other", count: 15 },
  ],
};

// Mock data for Slide 3 (Priority/Reasons table)
const slide3DataMap: Record<string, TableDataItem[]> = {
  "Full Fill": [
    { label: "First Contact Resolution", count: 456 },
    { label: "Issue Documented", count: 234 },
    { label: "Customer Satisfied", count: 200 },
  ],
  "Partial Fill": [
    { label: "Follow-up Required", count: 145 },
    { label: "Escalated", count: 67 },
    { label: "Pending Verification", count: 33 },
  ],
  "API Failures": [
    { label: "Timeout Error", count: 67 },
    { label: "Authentication Failed", count: 45 },
    { label: "Service Unavailable", count: 33 },
  ],
  "System And Intent Recognition Failures": [
    { label: "Speech Recognition Error", count: 52 },
    { label: "Intent Mismatch", count: 30 },
    { label: "Language Not Supported", count: 16 },
  ],
  "Customer Request Not Completed": [
    { label: "Missing Information", count: 45 },
    { label: "System Limitation", count: 32 },
    { label: "Policy Restriction", count: 20 },
  ],
};

// Mock data for Slide 4 (Detailed Analysis)
const slide4Data: ChartDataItem[] = [
  { name: "Resolved", value: 145, color: "#22c55e" },
  { name: "Escalated", value: 89, color: "#eab308" },
  { name: "Transferred", value: 67, color: "#3b82f6" },
  { name: "Callback Scheduled", value: 34, color: "#8b5cf6" },
  { name: "Closed", value: 23, color: "#6b7280" },
];

export function HandledCallsAnalysis() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: "end",
    containScroll: "trimSnaps",
    slidesToScroll: 1
  });
  
  const [slides, setSlides] = useState<SlideData[]>([
    { id: 1, title: "Handled Calls Analysis" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollToSlide = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const getSlide2Title = (category: string) => {
    switch (category) {
      case "Success Calls":
        return "Call Types (Success)";
      case "Failed Calls":
        return "Call Types (Failed)";
      case "Abandoned Calls":
        return "Abandoned Call Reasons";
      default:
        return "Call Types";
    }
  };

  const getSlide3Title = (type: string, category: string) => {
    if (category === "Failed Calls" && type === "API Failures") {
      return "API Failure Reasons";
    }
    if (type === "System And Intent Recognition Failures") {
      return "System & Intent Failures";
    }
    if (type === "Customer Request Not Completed") {
      return "Unfulfilled Request Reasons";
    }
    return "Priority Levels";
  };

  const handleCategorySelected = (category: string) => {
    setSelectedCategory(category);
    setSelectedType("");
    setSelectedPriority("");
    
    const newSlides: SlideData[] = [
      { id: 1, title: "Handled Calls Analysis" },
      { id: 2, title: getSlide2Title(category), breadcrumb: [category] },
    ];
    setSlides(newSlides);
    
    setTimeout(() => scrollToSlide(1), 100);
  };

  const handleTypeSelected = (type: string) => {
    setSelectedType(type);
    setSelectedPriority("");
    
    const newSlides: SlideData[] = [
      { id: 1, title: "Handled Calls Analysis" },
      { id: 2, title: getSlide2Title(selectedCategory), breadcrumb: [selectedCategory] },
      { id: 3, title: getSlide3Title(type, selectedCategory), breadcrumb: [selectedCategory, type] },
    ];
    setSlides(newSlides);
    
    setTimeout(() => scrollToSlide(2), 100);
  };

  const handlePrioritySelected = (priority: string) => {
    setSelectedPriority(priority);
    
    const newSlides: SlideData[] = [
      { id: 1, title: "Handled Calls Analysis" },
      { id: 2, title: getSlide2Title(selectedCategory), breadcrumb: [selectedCategory] },
      { id: 3, title: getSlide3Title(selectedType, selectedCategory), breadcrumb: [selectedCategory, selectedType] },
      { id: 4, title: "Detailed Analysis", breadcrumb: [selectedCategory, selectedType, priority] },
    ];
    setSlides(newSlides);
    
    setTimeout(() => scrollToSlide(3), 100);
  };

  const closeSlide = (slideId: number) => {
    if (slideId === 2) {
      setSelectedCategory("");
      setSelectedType("");
      setSelectedPriority("");
      setSlides([{ id: 1, title: "Handled Calls Analysis" }]);
    } else if (slideId === 3) {
      setSelectedType("");
      setSelectedPriority("");
      setSlides(slides.filter(s => s.id < 3));
    } else if (slideId === 4) {
      setSelectedPriority("");
      setSlides(slides.filter(s => s.id < 4));
    }
    setTimeout(() => scrollToSlide(Math.max(0, slideId - 2)), 100);
  };

  const isTableData = (data: ChartDataItem[] | TableDataItem[]): data is TableDataItem[] => {
    return data.length > 0 && "label" in data[0];
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = mainChartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(0);
      
      return (
        <div 
          style={{ 
            minWidth: 120, 
            borderRadius: 6,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            border: 'none',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              padding: '8px 12px', 
              backgroundColor: data.color, 
              color: 'white' 
            }}
          >
            {data.name}
          </div>
          <div style={{ padding: '8px 12px', backgroundColor: '#f5f5f5' }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>
              Count: <span style={{ fontWeight: 600, color: '#333' }}>{data.value}</span>
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              Percentage: <span style={{ fontWeight: 600, color: '#333' }}>{percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
        style={{ fontSize: '10px', fontWeight: 600 }}
      >
        {value}
      </text>
    );
  };

  const renderPieChart = (
    data: ChartDataItem[], 
    onSelect: (name: string) => void,
    showLegend = true
  ) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          onClick={(entry) => onSelect(entry.name)}
          cursor="pointer"
          label={renderCustomLabel}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip title={<CustomTooltip />} />
        {showLegend && (
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );

  const renderTable = (data: TableDataItem[], onRowClick?: (label: string) => void) => {
    console.log('renderTable called with data:', data);
    console.log('renderTable data length:', data?.length);
    
    return (
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafafa' }}>
              <th style={{ fontWeight: 600, padding: '12px', textAlign: 'left', borderBottom: '1px solid #d9d9d9' }}>Reason</th>
              <th style={{ fontWeight: 600, padding: '12px', textAlign: 'right', borderBottom: '1px solid #d9d9d9' }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={index} 
                style={{ cursor: onRowClick ? 'pointer' : 'default', borderBottom: '1px solid #f0f0f0' }}
                onClick={() => onRowClick?.(item.label)}
              >
                <td style={{ padding: '12px' }}>{item.label}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 500 }}>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSlideContent = (slide: SlideData) => {
    if (isLoading) {
      return <Skeleton className="h-[300px] w-full" />;
    }

    switch (slide.id) {
      case 1:
        return renderPieChart(mainChartData, handleCategorySelected);
      
      case 2: {
        const data = slide2DataMap[selectedCategory];
        if (!data) return null;
        
        if (isTableData(data)) {
          return renderTable(data);
        }
        return renderPieChart(data, handleTypeSelected);
      }
      
      case 3: {
        console.log('Slide 3 - selectedType:', selectedType);
        console.log('Slide 3 - available keys:', Object.keys(slide3DataMap));
        const data = slide3DataMap[selectedType];
        console.log('Slide 3 - found data:', data);
        if (!data) return null;
        return renderTable(data, handlePrioritySelected);
      }
      
      case 4:
        return renderPieChart(slide4Data, () => {});
      
      default:
        return null;
    }
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
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ marginTop: -12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Space align="center" size="middle">
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
                <PieChartOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    Handled Calls Analysis
                  </Title>
                  <Tooltip title="Click on chart segments to drill down into details">
                    <div style={{ marginTop: '-4px' }}>
                      <InfoCircleOutlined 
                        style={{ fontSize: 14, color: '#64748b' }}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Distribution of handled calls by status
                </Text>
              </div>
            </Space>
          </div>
        </div>
        
        {/* Chart Content */}
        <div style={{ marginTop: 30 }}>
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              <AnimatePresence mode="sync">
                {slides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className={`${slides.length === 1 ? 'flex-[0_0_100%]' : 'flex-[0_0_50%]'} min-w-0 px-2`}
                  >
                    <div className="bg-muted/30 rounded-lg p-4">
                      {/* Slide Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className={`font-semibold text-base ${slide.id === 1 ? 'opacity-0 pointer-events-none' : ''}`}>{slide.title}</h5>
                          {slide.breadcrumb && slide.breadcrumb.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {slide.breadcrumb.join(" / ")}
                            </p>
                          )}
                        </div>
                        {slide.id > 1 && (
                          <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={() => closeSlide(slide.id)}
                            style={{ height: 32, width: 32 }}
                          />
                        )}
                      </div>
                      
                      {/* Slide Content */}
                      {renderSlideContent(slide)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Buttons */}
          {slides.length > 1 && (
            <div className="flex justify-between mt-4">
              <Button
                type="default"
                icon={<LeftOutlined />}
                onClick={scrollPrev}
              >
                Prev
              </Button>
              <Button
                type="default"
                icon={<RightOutlined />}
                onClick={scrollNext}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </Space>
    </Card>
  );
}
