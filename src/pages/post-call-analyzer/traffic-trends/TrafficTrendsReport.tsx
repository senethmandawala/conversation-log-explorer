import { useState, useEffect, useContext } from "react";
import { Card, Typography, Space, DatePicker, Tooltip, Tabs } from "antd";
import { 
  LineChartOutlined, 
  InfoCircleOutlined, 
  ReloadOutlined, 
  CalendarOutlined, 
  UnorderedListOutlined
} from "@ant-design/icons";
import { usePostCall } from "@/contexts/PostCallContext";
import { TablerIcon } from "@/components/ui/tabler-icon";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
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
    console.log(`Category ${categoryIndex}: ${color}`); // Debug log
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
      <div style={{ fontSize: 12, backgroundColor: 'white', padding: 8, borderRadius: 4 }}>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ color: '#666', marginBottom: 2 }}>{hour}</div>
        <div style={{ fontWeight: 700, color: '#1890ff' }}>{value} calls</div>
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
    <Card
      style={{
        borderRadius: 12,
        border: '1px solid #e8e8e8',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '16px 16px 16px 16px'
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
                <LineChartOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    Traffic Trends
                  </Title>
                  <Tooltip title="Visualize traffic trends across time periods">
                    <div style={{ marginTop: '-4px' }}>
                      <TablerIcon 
                        name="info-circle" 
                        className="wn-tabler-14"
                        size={14}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Visualize traffic trends across time periods
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
        </div>
        
        {/* Chart Content */}
        <div style={{ marginTop: 16 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ width: '100%' }}
            size="large"
          >
            <TabPane tab="General" key="general">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading-general"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}
                  >
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      border: '2px solid #1890ff', 
                      borderTop: '2px solid transparent', 
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content-general"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflowX: 'auto' }}
                  >
                    <div style={{ display: 'inline-block', minWidth: '100%' }}>
                      {/* Hour labels */}
                      <div style={{ display: 'flex', marginBottom: 12 }}>
                        <div style={{ width: 96, flexShrink: 0 }}></div>
                        {Array.from({ length: 24 }, (_, i) => (
                          <div key={i} style={{ width: 48, fontSize: 11, textAlign: 'center', fontWeight: 500, color: '#666' }}>
                            {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                          </div>
                        ))}
                      </div>
                      
                      {/* Heatmap grid */}
                      {['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'].map((day, dayIndex) => (
                        <div key={day} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ width: 96, fontSize: 12, fontWeight: 600, textAlign: 'right', paddingRight: 12, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={day}>{day}</div>
                          <div style={{ display: 'flex', gap: 4 }}>
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
            </TabPane>

            <TabPane tab="Categories" key="categories">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading-categories"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}
                  >
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      border: '2px solid #1890ff', 
                      borderTop: '2px solid transparent', 
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content-categories"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflowX: 'auto' }}
                  >
                    <div style={{ display: 'inline-block', minWidth: '100%' }}>
                      {/* Hour labels */}
                      <div style={{ display: 'flex', marginBottom: 12 }}>
                        <div style={{ width: 160, flexShrink: 0 }}></div>
                        {Array.from({ length: 24 }, (_, i) => (
                          <div key={i} style={{ width: 48, fontSize: 11, textAlign: 'center', fontWeight: 500, color: '#666' }}>
                            {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                          </div>
                        ))}
                      </div>
                      
                      {/* Heatmap grid */}
                      {['Billing Issues', 'Technical Support', 'Account Management', 'Product Inquiry', 'Service Complaint', 'Refund Request', 'General Query'].map((category, catIndex) => (
                        <div key={category} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ width: 160, fontSize: 12, fontWeight: 600, textAlign: 'right', paddingRight: 12, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={category}>{category}</div>
                          <div style={{ display: 'flex', gap: 4 }}>
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
            </TabPane>
          </Tabs>
        </div>
      </Space>
    </Card>
  );
}
