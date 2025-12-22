import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import {
  ArrowLeft,
  Info,
  RefreshCw,
  ListTree,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Treemap, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Custom content component for treemap cells
const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill } = props;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="hsl(var(--background))"
        strokeWidth={2}
        style={{ cursor: "pointer" }}
        className="hover:opacity-80 transition-opacity"
      />
      {width > 60 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={12}
          fontWeight={500}
          style={{ pointerEvents: "none" }}
        >
          {name}
        </text>
      )}
    </g>
  );
};

const COLORS = [
  "hsl(226, 70%, 55%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
  "hsl(270, 70%, 55%)",
  "hsl(199, 89%, 48%)",
  "hsl(330, 70%, 55%)",
  "hsl(180, 70%, 45%)",
];

const chartConfig = {
  value: { label: "Calls", color: "hsl(226, 70%, 55%)" },
};

// Mock data for categories
const categoryData = [
  { name: "Billing Issues", value: 350 },
  { name: "Technical Issues", value: 280 },
  { name: "Account Closure", value: 180 },
  { name: "Refund Requests", value: 120 },
  { name: "General Inquiry", value: 90 },
  { name: "Others", value: 60 },
];

// Subcategory data for each category
const subcategoryData: Record<string, { name: string; value: number }[]> = {
  "Billing Issues": [
    { name: "Invoice Disputes", value: 120 },
    { name: "Payment Failed", value: 95 },
    { name: "Refund Processing", value: 75 },
    { name: "Pricing Questions", value: 60 },
  ],
  "Technical Issues": [
    { name: "Login Problems", value: 95 },
    { name: "App Crashes", value: 72 },
    { name: "Integration Issues", value: 68 },
    { name: "Performance Lag", value: 45 },
  ],
  "Account Closure": [
    { name: "Voluntary Closure", value: 85 },
    { name: "Inactive Account", value: 48 },
    { name: "Fraud Prevention", value: 32 },
    { name: "Duplicate Account", value: 15 },
  ],
  "Refund Requests": [
    { name: "Service Issues", value: 55 },
    { name: "Billing Errors", value: 35 },
    { name: "Unused Credits", value: 20 },
    { name: "Cancellation", value: 10 },
  ],
  "General Inquiry": [
    { name: "Product Info", value: 40 },
    { name: "Pricing Plans", value: 28 },
    { name: "Feature Requests", value: 15 },
    { name: "Partnership", value: 7 },
  ],
  "Others": [
    { name: "Feedback", value: 30 },
    { name: "Complaints", value: 18 },
    { name: "Suggestions", value: 8 },
    { name: "Misc", value: 4 },
  ],
};

// Level 3 data
const level3Data: Record<string, { name: string; value: number }[]> = {
  "Invoice Disputes": [
    { name: "Incorrect Amount", value: 45 },
    { name: "Missing Discount", value: 35 },
    { name: "Duplicate Charge", value: 25 },
    { name: "Late Fee Issues", value: 15 },
  ],
  "Payment Failed": [
    { name: "Card Declined", value: 40 },
    { name: "Bank Error", value: 30 },
    { name: "Invalid Details", value: 15 },
    { name: "Expired Card", value: 10 },
  ],
  "Login Problems": [
    { name: "Forgot Password", value: 35 },
    { name: "Account Locked", value: 30 },
    { name: "2FA Issues", value: 20 },
    { name: "Session Expired", value: 10 },
  ],
};

// Level 4 data
const level4Data: Record<string, { name: string; value: number }[]> = {
  "Incorrect Amount": [
    { name: "Overcharged", value: 20 },
    { name: "Undercharged", value: 15 },
    { name: "Wrong Rate", value: 10 },
  ],
  "Card Declined": [
    { name: "Insufficient Funds", value: 18 },
    { name: "Card Expired", value: 12 },
    { name: "Bank Block", value: 10 },
  ],
  "Forgot Password": [
    { name: "Email Not Received", value: 15 },
    { name: "Link Expired", value: 12 },
    { name: "Wrong Email", value: 8 },
  ],
};

// Level 5 data
const level5Data: Record<string, { name: string; value: number }[]> = {
  "Overcharged": [
    { name: "Tax Error", value: 10 },
    { name: "Promo Not Applied", value: 7 },
    { name: "System Glitch", value: 3 },
  ],
  "Insufficient Funds": [
    { name: "Account Empty", value: 10 },
    { name: "Hold on Funds", value: 5 },
    { name: "Pending Transactions", value: 3 },
  ],
};

// Call logs for the final level
const callLogsData = [
  { date: "2024-01-15", time: "09:23 AM", msisdn: "+1234567890", sentiment: "Positive", status: "Resolved" },
  { date: "2024-01-15", time: "10:45 AM", msisdn: "+1987654321", sentiment: "Negative", status: "Pending" },
  { date: "2024-01-14", time: "02:30 PM", msisdn: "+1122334455", sentiment: "Neutral", status: "Resolved" },
  { date: "2024-01-14", time: "04:15 PM", msisdn: "+1555666777", sentiment: "Positive", status: "Escalated" },
  { date: "2024-01-13", time: "11:00 AM", msisdn: "+1888999000", sentiment: "Negative", status: "Resolved" },
  { date: "2024-01-13", time: "03:45 PM", msisdn: "+1777888999", sentiment: "Positive", status: "Resolved" },
  { date: "2024-01-12", time: "08:15 AM", msisdn: "+1666777888", sentiment: "Neutral", status: "Pending" },
];

interface Slide {
  id: number;
  type: "category" | "subcategory" | "level3" | "level4" | "level5" | "callLogs";
  title: string;
  breadcrumb: string[];
  data?: any[];
}

export default function CaseClassificationReport() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [slides, setSlides] = useState<Slide[]>([
    { id: 1, type: "category", title: "Categories", breadcrumb: [], data: categoryData }
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [totalCalls, setTotalCalls] = useState(1080);

  useEffect(() => {
    setShowModuleTabs(true);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  const handleCategoryClick = (categoryName: string) => {
    const subcats = subcategoryData[categoryName] || [];
    const newSlide: Slide = {
      id: 2,
      type: "subcategory",
      title: "Top Sub Categories",
      breadcrumb: [categoryName],
      data: subcats,
    };
    
    setSlides(prev => [...prev.slice(0, 1), newSlide]);
    setCurrentSlideIndex(1);
  };

  const handleSubcategoryClick = (subcategoryName: string) => {
    const level3 = level3Data[subcategoryName] || [
      { name: "Type A", value: 30 },
      { name: "Type B", value: 25 },
      { name: "Type C", value: 15 },
    ];
    
    const newSlide: Slide = {
      id: 3,
      type: "level3",
      title: "Category Level 3",
      breadcrumb: [...slides[1].breadcrumb, subcategoryName],
      data: level3,
    };
    
    setSlides(prev => [...prev.slice(0, 2), newSlide]);
    setCurrentSlideIndex(2);
  };

  const handleLevel3Click = (itemName: string) => {
    const level4 = level4Data[itemName] || [
      { name: "Detail A", value: 15 },
      { name: "Detail B", value: 10 },
      { name: "Detail C", value: 5 },
    ];
    
    const newSlide: Slide = {
      id: 4,
      type: "level4",
      title: "Category Level 4",
      breadcrumb: [...slides[2].breadcrumb, itemName],
      data: level4,
    };
    
    setSlides(prev => [...prev.slice(0, 3), newSlide]);
    setCurrentSlideIndex(3);
  };

  const handleLevel4Click = (itemName: string) => {
    const level5 = level5Data[itemName] || [
      { name: "Sub-detail A", value: 8 },
      { name: "Sub-detail B", value: 5 },
      { name: "Sub-detail C", value: 3 },
    ];
    
    const newSlide: Slide = {
      id: 5,
      type: "level5",
      title: "Category Level 5",
      breadcrumb: [...slides[3].breadcrumb, itemName],
      data: level5,
    };
    
    setSlides(prev => [...prev.slice(0, 4), newSlide]);
    setCurrentSlideIndex(4);
  };

  const handleLevel5Click = (itemName: string) => {
    const newSlide: Slide = {
      id: 6,
      type: "callLogs",
      title: "Call Logs",
      breadcrumb: [...slides[4].breadcrumb, itemName],
      data: callLogsData,
    };
    
    setSlides(prev => [...prev.slice(0, 5), newSlide]);
    setCurrentSlideIndex(5);
  };

  const closeSlide = (slideId: number) => {
    const slideIndex = slides.findIndex(s => s.id === slideId);
    if (slideIndex > 0) {
      setSlides(prev => prev.slice(0, slideIndex));
      setCurrentSlideIndex(slideIndex - 1);
    }
  };

  const scrollPrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const scrollNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handleReload = () => {
    setSlides([{ id: 1, type: "category", title: "Categories", breadcrumb: [], data: categoryData }]);
    setCurrentSlideIndex(0);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive": return "text-emerald-500";
      case "negative": return "text-red-500";
      default: return "text-amber-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Resolved</Badge>;
      case "pending": return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">Pending</Badge>;
      case "escalated": return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Escalated</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderSlideContent = (slide: Slide, index: number) => {
    const isActive = index === currentSlideIndex;
    const chartData = (slide.data || []).map((item: any, idx: number) => ({
      ...item,
      fill: COLORS[idx % COLORS.length],
    }));

    if (slide.type === "callLogs") {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h5 className="font-semibold text-foreground">{slide.title}</h5>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {slide.breadcrumb.map((crumb, i) => (
                  <span key={i}>
                    {i > 0 && " / "}
                    {crumb}
                  </span>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => closeSlide(slide.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Date/Time</TableHead>
                  <TableHead>MSISDN</TableHead>
                  <TableHead className="text-center">Sentiment</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callLogsData.map((log, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="text-sm">{log.date}</div>
                      <div className="text-xs text-muted-foreground">{log.time}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.msisdn}</TableCell>
                    <TableCell className={`text-center font-medium ${getSentimentColor(log.sentiment)}`}>
                      {log.sentiment}
                    </TableCell>
                    <TableCell className="text-center">{getStatusBadge(log.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h5 className="font-semibold text-foreground">{slide.title}</h5>
            {slide.breadcrumb.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {slide.breadcrumb.map((crumb, i) => (
                  <span key={i}>
                    {i > 0 && " / "}
                    {crumb}
                  </span>
                ))}
              </div>
            )}
          </div>
          {slide.id > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => closeSlide(slide.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              onClick={(data) => {
                if (data?.activePayload?.[0]?.payload) {
                  const name = data.activePayload[0].payload.name;
                  if (slide.type === "category") handleCategoryClick(name);
                  else if (slide.type === "subcategory") handleSubcategoryClick(name);
                  else if (slide.type === "level3") handleLevel3Click(name);
                  else if (slide.type === "level4") handleLevel4Click(name);
                  else if (slide.type === "level5") handleLevel5Click(name);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11}
                tick={{ cursor: 'pointer' }}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} cursor="pointer">
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-2">
          Click on a bar to drill down further
        </p>
      </div>
    );
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          {/* Header */}
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/post-call-analyzer/reports")}
                  className="h-10 w-10 rounded-lg"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-semibold tracking-tight">
                      Case Classification
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground/50 hover:text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Drill down into case categories to analyze call distribution</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Analyze call distribution across categories and subcategories
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Today
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleReload}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/post-call-analyzer/call-insight")}>
                  <ListTree className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Total Calls Badge */}
            <div className="mb-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary/5 border border-primary/20 rounded-full">
                <span className="text-sm font-medium text-muted-foreground">Total Calls</span>
                <span className="ml-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                  {totalCalls.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Carousel Container */}
            <div className="relative">
              {/* Navigation Buttons */}
              {slides.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-8 w-8 rounded-full shadow-md"
                    onClick={scrollPrev}
                    disabled={currentSlideIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-8 w-8 rounded-full shadow-md"
                    onClick={scrollNext}
                    disabled={currentSlideIndex === slides.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Slides */}
              <div 
                ref={carouselRef}
                className="overflow-hidden"
              >
                <motion.div
                  className="flex gap-4"
                  animate={{ x: `-${currentSlideIndex * (slides.length === 1 ? 0 : 52)}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {slides.map((slide, index) => (
                    <motion.div
                      key={slide.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex-shrink-0 ${slides.length === 1 ? 'w-full' : 'w-[48%]'}`}
                    >
                      <Card className="h-[400px] p-4 border-border/50 bg-background/50">
                        {renderSlideContent(slide, index)}
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Slide Indicators */}
              {slides.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlideIndex ? 'bg-primary' : 'bg-border'
                      }`}
                      onClick={() => setCurrentSlideIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}
