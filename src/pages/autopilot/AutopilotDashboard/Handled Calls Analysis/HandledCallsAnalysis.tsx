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
  IconChartPie,
  IconInfoCircle,
  IconChevronLeft,
  IconChevronRight,
  IconX
} from "@tabler/icons-react";
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
        <div className="min-w-[120px] rounded-md shadow-lg overflow-hidden bg-white">
          <div 
            className="text-sm font-semibold py-2 px-3 text-white bg-[${data.color}]"
          >
            {data.name}
          </div>
          <div className="py-2 px-3 bg-gray-100">
            <div className="text-xs text-gray-500 mb-0.5">
              Count: <span className="font-semibold text-gray-800">{data.value}</span>
            </div>
            <div className="text-xs text-gray-500">
              Percentage: <span className="font-semibold text-gray-800">{percentage}%</span>
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
    
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="font-semibold p-3 text-left border-b border-gray-300">Reason</th>
              <th className="font-semibold p-3 text-right border-b border-gray-300">Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-100 ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                onClick={() => onRowClick?.(item.label)}
              >
                <td className="p-3">{item.label}</td>
                <td className="p-3 text-right font-medium">{item.count}</td>
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
        const data = slide3DataMap[selectedType];
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
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconChartPie className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-lg !font-semibold">
                    Handled Calls Analysis
                  </Title>
                  <Tooltip title="Click on chart segments to drill down into details">
                    <div className="-mt-1">
                      <IconInfoCircle className="text-sm text-slate-500" />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" className="text-sm">
                  Distribution of handled calls by status
                </Text>
              </div>
            </Space>
          </div>
        </div>
        
        {/* Chart Content */}
        <div className="mt-8">
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
                            icon={<IconX />}
                            onClick={() => closeSlide(slide.id)}
                            className="h-8 w-8"
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
                icon={<IconChevronLeft />}
                onClick={scrollPrev}
              >
                Prev
              </Button>
              <Button
                type="default"
                icon={<IconChevronRight />}
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
