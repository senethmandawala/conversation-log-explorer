import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Info, RefreshCw, Calendar, List, ChevronLeft, ChevronRight, X } from "lucide-react";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Treemap, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { DurationCallLogs } from "./DurationCallLogs.tsx";

const mockCategoryData = [
  { name: "Billing Issues", value: 145, fill: "#4285F4" },
  { name: "Technical Support", value: 128, fill: "#34A853" },
  { name: "Account Management", value: 98, fill: "#FBBC04" },
  { name: "Product Inquiry", value: 87, fill: "#EA4335" },
  { name: "Service Complaint", value: 76, fill: "#9C27B0" },
];

interface Slide {
  id: number;
  type: "categories" | "callLogs";
  title: string;
  categoryName?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0" 
            style={{ backgroundColor: data.fill }}
          />
          <span className="text-sm font-semibold text-foreground">{data.name}</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>Call Count: <span className="font-medium text-foreground">{data.value}</span></p>
          <p>Avg Duration: <span className="font-medium text-foreground">8:45</span></p>
          <p>Total Duration: <span className="font-medium text-foreground">21:15:30</span></p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill } = props;
  
  // Skip rendering if there's no valid name (this filters out the root node)
  if (!name) {
    return null;
  }

  // Calculate dynamic font size based on cell dimensions
  const maxFontSize = 14;
  const minFontSize = 8;
  const padding = 8;
  
  // Calculate font size that fits within the cell
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  
  // Estimate characters per line based on available width (approx 0.6 ratio for font width)
  const charWidth = 0.6;
  const estimatedFontSizeByWidth = availableWidth / (name.length * charWidth);
  const estimatedFontSizeByHeight = availableHeight * 0.6;
  
  // Use the smaller of the two to ensure it fits
  let fontSize = Math.min(estimatedFontSizeByWidth, estimatedFontSizeByHeight, maxFontSize);
  fontSize = Math.max(fontSize, minFontSize);
  
  // Only show text if there's enough space
  const showText = width > 40 && height > 20 && fontSize >= minFontSize;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="white"
        strokeWidth={2}
        style={{ cursor: "pointer" }}
        className="hover:opacity-80 transition-opacity"
      />
      {showText && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={fontSize}
          fontWeight={600}
          style={{ pointerEvents: "none" }}
        >
          {name}
        </text>
      )}
    </g>
  );
};

const mockLongCallsData = [
  { id: 1, date: "2024-01-15", time: "10:30 AM", msisdn: "+94771234567", sentiment: "Negative", status: "Resolved" },
  { id: 2, date: "2024-01-15", time: "11:45 AM", msisdn: "+94772345678", sentiment: "Neutral", status: "Pending" },
  { id: 3, date: "2024-01-14", time: "02:15 PM", msisdn: "+94773456789", sentiment: "Positive", status: "Resolved" },
  { id: 4, date: "2024-01-14", time: "03:30 PM", msisdn: "+94774567890", sentiment: "Negative", status: "Escalated" },
  { id: 5, date: "2024-01-13", time: "09:20 AM", msisdn: "+94775678901", sentiment: "Neutral", status: "Resolved" },
];

export default function CallDurationReport() {
  const { setSelectedTab } = usePostCall();
  const [activeTab, setActiveTab] = useState("duration");
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [averageCallTime, setAverageCallTime] = useState("8:45");
  const [totalCallCount, setTotalCallCount] = useState("1,234");
  
  const [longCallThreshold, setLongCallThreshold] = useState("15:00");
  const [totalCalls, setTotalCalls] = useState("1,234");
  const [totalLongCalls, setTotalLongCalls] = useState("156");
  const [longCallPercentage, setLongCallPercentage] = useState(12.6);

  const [slides, setSlides] = useState<Slide[]>([
    { id: 1, type: "categories", title: "Call Duration by Categories" }
  ]);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleCategoryClick = (data: any) => {
    if (data?.name) {
      console.log("Category clicked:", data.name);
      const newSlide: Slide = {
        id: 2,
        type: "callLogs",
        title: "Duration Call Logs",
        categoryName: data.name,
      };
      
      setSlides(prev => [...prev.slice(0, 1), newSlide]);
      setVisibleStartIndex(0);
    }
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

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Positive</Badge>;
      case "negative": return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Negative</Badge>;
      default: return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">Neutral</Badge>;
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

  return (
    <Card className="border-border/50">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedTab("reports")}
                  className="h-10 w-10 rounded-lg"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-semibold tracking-tight">
                      Call Duration Analysis
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Analyze call duration patterns and identify long calls</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Duration distribution and long call analysis
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
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="duration">Call Duration</TabsTrigger>
                <TabsTrigger value="long-calls">Long Calls</TabsTrigger>
              </TabsList>

              <TabsContent value="duration" className="mt-6">
                <div className="mb-4">
                  <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Average Call Time</p>
                          <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-bold">{averageCallTime}</h2>
                            <span className="text-sm text-muted-foreground">from {totalCallCount} Calls</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Navigation Buttons */}
                    {slides.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-8 w-8 rounded-full shadow-md"
                          onClick={scrollPrev}
                          disabled={visibleStartIndex === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-8 w-8 rounded-full shadow-md"
                          onClick={scrollNext}
                          disabled={visibleStartIndex >= slides.length - 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {/* Slides */}
                    <div ref={carouselRef} className="overflow-hidden w-full">
                      <div
                        className="flex"
                        style={{
                          transform: `translateX(-${visibleStartIndex * 50}%)`,
                          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        {slides.map((slide, index) => (
                          <div
                            key={slide.id}
                            className="flex-shrink-0 pr-4"
                            style={{ 
                              width: slides.length === 1 ? '100%' : '50%',
                              transition: 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                          >
                            <Card className="h-[450px] p-4 border-border/50 bg-background/50">
                              <div className="h-full flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-base font-semibold text-foreground">{slide.title}</h5>
                                  {slide.id > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => closeSlide(slide.id)}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                                <div className="flex-1 min-h-0">
                                  {slide.type === "categories" ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                      <Treemap
                                        data={mockCategoryData}
                                        dataKey="value"
                                        stroke="white"
                                        fill="hsl(226, 70%, 55%)"
                                        content={<CustomTreemapContent />}
                                        onClick={handleCategoryClick}
                                      >
                                        <RechartsTooltip
                                          content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                              const data = payload[0].payload;
                                              const avgDuration = Math.floor(Math.random() * 15) + 5;
                                              const avgSeconds = Math.floor(Math.random() * 60);
                                              const totalMinutes = data.value * avgDuration;
                                              const totalSeconds = Math.floor(Math.random() * 60);
                                              return (
                                                <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <div 
                                                      className="h-4 w-4 rounded-full"
                                                      style={{ backgroundColor: data.fill }}
                                                    />
                                                    <p className="font-semibold">{data.name}</p>
                                                  </div>
                                                  <p className="text-sm"><span className="font-medium">Average Call Duration:</span> {avgDuration}min {avgSeconds}sec</p>
                                                  <p className="text-sm"><span className="font-medium">Call Duration:</span> {totalMinutes}min {totalSeconds}sec</p>
                                                </div>
                                              );
                                            }
                                            return null;
                                          }}
                                        />
                                      </Treemap>
                                    </ResponsiveContainer>
                                  ) : (
                                    <div className="h-full overflow-auto">
                                      <DurationCallLogs />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="long-calls" className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <h5 className="text-lg font-semibold mb-4">Long Calls Overview</h5>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                          <h3 className="text-2xl font-bold">{longCallThreshold}</h3>
                          <p className="text-sm text-muted-foreground">Threshold for Long Call</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Total Calls</p>
                          <h3 className="text-2xl font-bold">{totalCalls}</h3>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Long Calls</p>
                          <h3 className="text-2xl font-bold text-primary">{totalLongCalls}</h3>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="relative">
                          <div className="absolute -top-6 text-sm font-semibold text-primary" style={{ left: `calc(${longCallPercentage}% - 20px)` }}>
                            {longCallPercentage}%
                          </div>
                          <Progress value={longCallPercentage} className="h-3" />
                          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>0</span>
                            <span>{totalCalls}</span>
                          </div>
                        </div>
                      </div>

                      <h6 className="text-base font-semibold mb-3">Long Call Logs Summary</h6>
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date Time</TableHead>
                              <TableHead>MSISDN</TableHead>
                              <TableHead className="text-center">Sentiment</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockLongCallsData.map((call) => (
                              <TableRow key={call.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{call.date}</div>
                                    <div className="text-sm text-muted-foreground">{call.time}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm">{call.msisdn}</TableCell>
                                <TableCell className="text-center">{getSentimentBadge(call.sentiment)}</TableCell>
                                <TableCell className="text-center">{getStatusBadge(call.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <DurationCallLogs />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
    </Card>
  );
}
