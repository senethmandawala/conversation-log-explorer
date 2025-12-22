import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Info, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Treemap, Cell, ResponsiveContainer } from "recharts";

// Custom content component for treemap cells with centered text
const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill, opacity = 1 } = props;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        opacity={opacity}
        stroke="hsl(var(--background))"
        strokeWidth={2}
        style={{ cursor: "pointer" }}
      />
      {width > 50 && height > 25 && (
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
];

const chartConfig = {
  value: { label: "Value", color: "hsl(226, 70%, 55%)" },
};

// Subcategory data for each main category
const subcategoryData: Record<string, { name: string; value: number }[]> = {
  "Billing Issues": [
    { name: "Invoice Issues", value: 120 },
    { name: "Payment Failed", value: 85 },
    { name: "Refund Request", value: 75 },
    { name: "Pricing Questions", value: 70 },
  ],
  "Technical Issues": [
    { name: "Login Issues", value: 95 },
    { name: "App Crashes", value: 72 },
    { name: "Integration", value: 68 },
    { name: "Performance", value: 45 },
  ],
  "Account Closure": [
    { name: "Password Reset", value: 65 },
    { name: "Profile Update", value: 48 },
    { name: "Verification", value: 42 },
    { name: "Deletion", value: 25 },
  ],
  "Refund Requests": [
    { name: "New Inquiry", value: 55 },
    { name: "Upgrade", value: 35 },
    { name: "Demo Request", value: 20 },
    { name: "Pricing", value: 10 },
  ],
  "Others": [
    { name: "Service Quality", value: 40 },
    { name: "Response Time", value: 28 },
    { name: "Agent Behavior", value: 15 },
    { name: "Other", value: 7 },
  ],
  "General": [
    { name: "General Inquiry", value: 30 },
    { name: "Feedback", value: 18 },
    { name: "Partnership", value: 8 },
    { name: "Misc", value: 4 },
  ],
};

// Level 3 data for each subcategory
const level3Data: Record<string, { name: string; value: number }[]> = {
  "Invoice Issues": [
    { name: "Incorrect Amount", value: 45 },
    { name: "Missing Discount", value: 35 },
    { name: "Duplicate Charge", value: 25 },
    { name: "Late Fee", value: 15 },
  ],
  "Payment Failed": [
    { name: "Card Declined", value: 35 },
    { name: "Bank Error", value: 25 },
    { name: "Invalid Details", value: 15 },
    { name: "Expired Card", value: 10 },
  ],
  "Login Issues": [
    { name: "Forgot Password", value: 40 },
    { name: "Account Locked", value: 30 },
    { name: "2FA Issues", value: 15 },
    { name: "Session Expired", value: 10 },
  ],
};

interface CaseClassificationReportProps {
  id: string;
  title: string;
  description: string;
  hasFilter?: boolean;
  chartData: any[];
}

export const CaseClassificationReport = ({ 
  title, 
  description, 
  hasFilter, 
  chartData 
}: CaseClassificationReportProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const mainTreemapData = chartData.map((item, idx) => ({
    ...item,
    fill: COLORS[idx % COLORS.length],
  }));

  const subTreemapData = selectedCategory 
    ? subcategoryData[selectedCategory]?.map((item, idx) => ({
        ...item,
        fill: COLORS[idx % COLORS.length],
      })) || []
    : [];

  const level3TreemapData = selectedSubcategory
    ? level3Data[selectedSubcategory]?.map((item, idx) => ({
        ...item,
        fill: COLORS[idx % COLORS.length],
      })) || []
    : [];

  const handleCategoryClick = (data: any) => {
    if (data && data.name) {
      setSelectedCategory(data.name);
      setSelectedSubcategory(null);
    }
  };

  const handleSubcategoryClick = (data: any) => {
    if (data && data.name) {
      setSelectedSubcategory(data.name);
    }
  };

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(null);
    }
  };

  const handleCloseLevel3 = () => {
    setSelectedSubcategory(null);
  };

  return (
    <AnimatePresence mode="wait">
      {selectedCategory ? (
        <motion.div 
          key="split-view"
          className={`grid gap-4 ${selectedSubcategory ? 'grid-cols-3' : 'grid-cols-2'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "linear" }}
        >
          {/* Card 1: Category Distribution */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "linear" }}
            className="h-full"
          >
            <Card className="overflow-hidden border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader className="pb-2 border-b border-border/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-semibold">Categories</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to change category</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-3">
                <ChartContainer config={chartConfig} className="h-[180px] w-full">
                  <Treemap
                    data={mainTreemapData}
                    dataKey="value"
                    nameKey="name"
                    aspectRatio={1}
                    onClick={handleCategoryClick}
                    isAnimationActive={true}
                    animationDuration={300}
                    animationEasing="linear"
                    content={<CustomTreemapContent />}
                  >
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </Treemap>
                </ChartContainer>
                <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
                  {mainTreemapData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1 text-[10px]">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.fill }} />
                      <span className={`${selectedCategory === entry.name ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Subcategory Distribution */}
          <motion.div
            layout
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: "linear" }}
            className="h-full"
          >
            <Card className="overflow-hidden border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader className="pb-2 border-b border-border/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-semibold">Top Sub Categories</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to drill down further</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedCategory}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={handleBack}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-3">
                <ChartContainer config={chartConfig} className="h-[180px] w-full">
                  <Treemap
                    data={subTreemapData}
                    dataKey="value"
                    nameKey="name"
                    aspectRatio={1}
                    onClick={handleSubcategoryClick}
                    isAnimationActive={true}
                    animationDuration={300}
                    animationEasing="linear"
                    content={<CustomTreemapContent />}
                  >
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </Treemap>
                </ChartContainer>
                <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
                  {subTreemapData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1 text-[10px]">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.fill }} />
                      <span className={`${selectedSubcategory === entry.name ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3: Level 3 Distribution (only when subcategory selected) */}
          {selectedSubcategory && (
            <motion.div
              layout
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="h-full"
            >
              <Card className="overflow-hidden border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                <CardHeader className="pb-2 border-b border-border/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-semibold">Category Level 3</CardTitle>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                                <Info className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Detailed breakdown of {selectedSubcategory}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{selectedCategory} / {selectedSubcategory}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={handleCloseLevel3}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-3">
                  <ChartContainer config={chartConfig} className="h-[180px] w-full">
                    <Treemap
                      data={level3TreemapData}
                      dataKey="value"
                      nameKey="name"
                      aspectRatio={1}
                      isAnimationActive={true}
                      animationDuration={300}
                      animationEasing="linear"
                      content={<CustomTreemapContent />}
                    >
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </Treemap>
                  </ChartContainer>
                  <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
                    {level3TreemapData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1 text-[10px]">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.fill }} />
                        <span className="text-muted-foreground">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="full-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "linear" }}
        >
          <Card className="overflow-hidden border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2 border-b border-border/30">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click on a category to see subcategory distribution</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                    {hasFilter && (
                      <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs font-medium">
                        Total Calls 
                        <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full">307</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Today
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <Treemap
                  data={mainTreemapData}
                  dataKey="value"
                  nameKey="name"
                  aspectRatio={4 / 3}
                  onClick={handleCategoryClick}
                  isAnimationActive={true}
                  animationDuration={300}
                  animationEasing="linear"
                  content={<CustomTreemapContent />}
                >
                  <ChartTooltip content={<ChartTooltipContent />} />
                </Treemap>
              </ChartContainer>
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-3 justify-center">
                {mainTreemapData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-xs">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.fill }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
