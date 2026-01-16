import { useState, useEffect, useContext } from "react";
import { Card, Typography, Space, DatePicker, Tooltip, Tabs } from "antd";
import { 
  IconChartLine, 
  IconInfoCircle, 
  IconRefresh, 
  IconCalendar, 
  IconList
} from "@tabler/icons-react";
import { usePostCall } from "@/contexts/PostCallContext";
import { TablerIcon } from "@/components/ui/tabler-icon";

const { Title, Text } = Typography;
import { motion, AnimatePresence } from "framer-motion";

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
  
  if (categoryIndex !== undefined && window.env_vars.colors && window.env_vars.colors[categoryIndex]) {
    const color = window.env_vars.colors[categoryIndex];
    // Convert hex to HSL properly
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const s = max === min ? 0 : (max - min) / (1 - Math.abs(max + min - 1));
    
    let h = 0;
    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    // Convert to degrees and apply reduced intensity
    const hue = Math.round(h * 360);
    const saturation = 50 + (15 * s) * (0.5 + 0.5 * intensity);
    const lightness = 90 - (30 * intensity);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  // Original blue gradient for general tab
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
    <Tooltip title={
      <div className="text-xs bg-white p-2 rounded">
        <div className="font-semibold mb-0.5">{label}</div>
        <div className="text-gray-500 mb-0.5">{hour}</div>
        <div className="font-bold text-blue-500">{value} calls</div>
      </div>
    }>
      <div
        style={{
          width: 48,
          height: 40,
          borderRadius: 4,
          border: '1px solid #e8e8e8',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: getHeatmapColor(value, maxValue, categoryIndex)
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#1890ff';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.zIndex = '10';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e8e8e8';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.zIndex = '1';
        }}
      />
    </Tooltip>
  );
};

export default function TrafficTrendsReport() {
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
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconChartLine className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-lg !font-semibold">
                    Traffic Trends
                  </Title>
                  <Tooltip title="Visualize traffic trends across time periods">
                    <div className="-mt-1">
                      <TablerIcon 
                        name="info-circle" 
                        className="wn-tabler-14"
                        size={14}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" className="text-sm">
                  Visualize traffic trends across time periods
                </Text>
              </div>
            </Space>
            
            <DatePicker 
              suffixIcon={<IconCalendar />}
              className="rounded-lg"
            />
          </div>
        </div>
        
        {/* Chart Content */}
        <div className="mt-4">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="w-full"
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
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
                            <div className="w-24 shrink-0"></div>
                            {Array.from({ length: 24 }, (_, i) => (
                              <div key={i} className="w-12 text-[11px] text-center font-medium text-gray-500">
                                {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                              </div>
                            ))}
                          </div>
                          
                          {/* Heatmap grid */}
                          {['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'].map((day, dayIndex) => (
                            <div key={day} className="flex items-center mb-2">
                              <div className="w-24 text-xs font-semibold text-right pr-3 shrink-0 truncate" title={day}>{day}</div>
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
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
                            <div className="w-40 shrink-0"></div>
                            {Array.from({ length: 24 }, (_, i) => (
                              <div key={i} className="w-12 text-[11px] text-center font-medium text-gray-500">
                                {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                              </div>
                            ))}
                          </div>
                          
                          {/* Heatmap grid */}
                          {['Billing Issues', 'Technical Support', 'Account Management', 'Product Inquiry', 'Service Complaint', 'Refund Request', 'General Query'].map((category, catIndex) => (
                            <div key={category} className="flex items-center mb-2">
                              <div className="w-40 text-xs font-semibold text-right pr-3 shrink-0 truncate" title={category}>{category}</div>
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
    </Card>
  );
}
