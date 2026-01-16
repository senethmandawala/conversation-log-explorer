import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconInfoCircle, IconRefresh, IconCalendar, IconList, IconCalendarEvent } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card as AntCard, 
  Typography, 
  Space, 
  Tooltip as AntTooltip,
  Tabs as AntTabs
} from "antd";
import { IconInfoCircle as InfoIcon } from "@tabler/icons-react";

const { Title, Text } = Typography;

// Generate mock heatmap data for General tab (Date x Hour)
const generateGeneralHeatmapData = () => {
  const days = ['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'];
  const data: any[] = [];
  
  days.forEach((day, dayIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0') + ':00';
      // Generate random call counts with peak hours (9-17)
      const isPeakHour = hour >= 9 && hour <= 17;
      const baseValue = isPeakHour ? 50 : 10;
      const callCount = Math.floor(Math.random() * baseValue) + (isPeakHour ? 30 : 0);
      
      data.push({
        x: hour,
        y: dayIndex,
        value: callCount,
        hour: hourStr,
        day: day
      });
    }
  });
  
  return data;
};

// Generate mock heatmap data for Categories tab (Category x Hour)
const generateCategoryHeatmapData = () => {
  const categories = ['Billing Issues', 'Technical Support', 'Account Management', 'Product Inquiry', 'Service Complaint', 'Refund Request', 'General Query'];
  const data: any[] = [];
  
  categories.forEach((category, catIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0') + ':00';
      const isPeakHour = hour >= 9 && hour <= 17;
      const baseValue = isPeakHour ? 30 : 5;
      const callCount = Math.floor(Math.random() * baseValue) + (isPeakHour ? 10 : 0);
      
      data.push({
        x: hour,
        y: catIndex,
        value: callCount,
        hour: hourStr,
        category: category
      });
    }
  });
  
  return data;
};

const getHeatmapColor = (value: number, maxValue: number, categoryIndex?: number) => {
  if (value === 0) return 'hsl(var(--muted))';
  const intensity = value / maxValue;
  
  // For categories tab, use different base colors for each category
  if (categoryIndex !== undefined) {
    const categoryColors = [
      { hue: 220, saturation: 70 }, // Blue - Billing Issues
      { hue: 140, saturation: 70 }, // Green - Technical Support  
      { hue: 45, saturation: 85 },  // Yellow - Account Management
      { hue: 0, saturation: 75 },   // Red - Product Inquiry
      { hue: 280, saturation: 70 }, // Purple - Service Complaint
      { hue: 25, saturation: 85 },  // Orange - Refund Request
      { hue: 200, saturation: 70 }  // Cyan - General Query
    ];
    
    const color = categoryColors[categoryIndex % categoryColors.length];
    const lightness = 85 - (50 * intensity);
    return `hsl(${color.hue}, ${color.saturation}%, ${lightness}%)`;
  }
  
  // For general tab, use blue gradient
  const hue = 220;
  const saturation = 70 + (20 * intensity);
  const lightness = 85 - (50 * intensity);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

interface HeatmapCellProps {
  value: number;
  maxValue: number;
  label: string;
  hour: string;
  categoryIndex?: number;
}

const HeatmapCell = ({ value, maxValue, label, hour, categoryIndex }: HeatmapCellProps) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger>
        <div
          className="w-12 h-10 rounded border border-border/30 cursor-pointer transition-all duration-200 hover:border-primary hover:scale-105 hover:shadow-md hover:z-10"
          style={{ backgroundColor: getHeatmapColor(value, maxValue, categoryIndex) }}
        />
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-popover border-border">
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-muted-foreground">{hour}</p>
          <p className="font-bold text-primary">{value} calls</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export function WeeklyTrendsAndPatterns() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [generalData, setGeneralData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGeneralData(generateGeneralHeatmapData());
      setCategoryData(generateCategoryHeatmapData());
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setGeneralData(generateGeneralHeatmapData());
      setCategoryData(generateCategoryHeatmapData());
      setLoading(false);
    }, 500);
  };

  const maxGeneralValue = Math.max(...generalData.map(d => d.value), 1);
  const maxCategoryValue = Math.max(...categoryData.map(d => d.value), 1);

  return (
    <AntCard
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
                <IconCalendarEvent style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    Weekly Trends & Patterns
                  </Title>
                  <AntTooltip title="Visualize traffic trends across time periods">
                    <div style={{ marginTop: '-4px' }}>
                      <InfoIcon 
                        style={{ fontSize: 14, color: '#64748b' }}
                      />
                    </div>
                  </AntTooltip>
                </div>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Jun 19 - Jun 25, 2025
                </Text>
              </div>
            </Space>
            
            <Space size="small">
              <Button 
                variant="ghost" 
                size="sm"
                className="gap-1.5"
              >
                <IconCalendar className="h-4 w-4" />
                Week
              </Button>
            </Space>
          </div>
        </div>
        
        {/* Chart Content */}
        <div style={{ marginTop: 10 }}>

        <AntTabs
          activeKey={activeTab}
          onChange={(value) => setActiveTab(value)}
          style={{ width: '100%' }}
          size="large"
          items={[
            {
              key: "general",
              label: "General",
              children: (
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading-general"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center h-[400px]"
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content-general"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-x-auto"
                    >
                    <div className="inline-block min-w-full">
                      {/* Hour labels */}
                      <div className="flex mb-3">
                        <div className="w-24 flex-shrink-0"></div>
                        {Array.from({ length: 24 }, (_, i) => (
                          <div key={i} className="w-12 text-[11px] text-center font-medium text-muted-foreground">
                            {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                          </div>
                        ))}
                      </div>
                      
                      {/* Heatmap grid */}
                      {['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'].map((day, dayIndex) => (
                        <div key={day} className="flex items-center mb-2 group">
                          <div className="w-24 text-xs font-semibold text-right pr-3 flex-shrink-0 text-foreground group-hover:text-primary transition-colors">{day}</div>
                          <div className="flex gap-1">
                            {Array.from({ length: 24 }, (_, hour) => {
                              const dataPoint = generalData.find(d => d.y === dayIndex && d.x === hour);
                              return (
                                <HeatmapCell
                                  key={hour}
                                  value={dataPoint?.value || 0}
                                  maxValue={maxGeneralValue}
                                  label={day}
                                  hour={`${hour.toString().padStart(2, '0')}:00`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )
            },
            {
              key: "categories",
              label: "Categories",
              children: (
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading-categories"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center h-[400px]"
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content-categories"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-x-auto"
                    >
                    <div className="inline-block min-w-full">
                      {/* Hour labels */}
                      <div className="flex mb-3">
                        <div className="w-40 flex-shrink-0"></div>
                        {Array.from({ length: 24 }, (_, i) => (
                          <div key={i} className="w-12 text-[11px] text-center font-medium text-muted-foreground">
                            {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                          </div>
                        ))}
                      </div>
                      
                      {/* Heatmap grid */}
                      {['Billing Issues', 'Technical Support', 'Account Management', 'Product Inquiry', 'Service Complaint', 'Refund Request', 'General Query'].map((category, catIndex) => (
                        <div key={category} className="flex items-center mb-2 group">
                          <div className="w-40 text-xs font-semibold text-right pr-3 flex-shrink-0 truncate text-foreground group-hover:text-primary transition-colors" title={category}>{category}</div>
                          <div className="flex gap-1">
                            {Array.from({ length: 24 }, (_, hour) => {
                              const dataPoint = categoryData.find(d => d.y === catIndex && d.x === hour);
                              return (
                                <HeatmapCell
                                  key={hour}
                                  value={dataPoint?.value || 0}
                                  maxValue={maxCategoryValue}
                                  label={category}
                                  hour={`${hour.toString().padStart(2, '0')}:00`}
                                  categoryIndex={catIndex}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )
            }
          ]}
        />
        </div>
      </Space>
    </AntCard>
  );
}
