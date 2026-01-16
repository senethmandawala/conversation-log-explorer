import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  Typography, 
  ConfigProvider,
  Button, 
  Badge,
  Space,
  Skeleton,
  DatePicker,
  Tabs,
  Tooltip
} from "antd";
import { 
  IconArrowLeft, 
  IconCalendar, 
  IconFilter, 
  IconInfoCircle
} from "@tabler/icons-react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface DateRangeValue {
  type: string;
  from: Date | null;
  to: Date | null;
  displayValue: string;
}

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
    <Tooltip title={
      <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
        <div style={{ fontWeight: 600, marginBottom: '2px' }}>{label}</div>
        <div style={{ color: '#6b7280', marginBottom: '2px' }}>{hour}</div>
        <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>{value} calls</div>
      </div>
    }>
      <div
        style={{
          width: '48px',
          height: '40px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backgroundColor: getHeatmapColor(value, maxValue, categoryIndex)
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
          e.currentTarget.style.zIndex = '10';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.zIndex = '1';
        }}
      />
    </Tooltip>
  );
};

interface ReportWeeklyTrendsProps {
  onBack: () => void;
}

export default function ReportWeeklyTrends({ onBack }: ReportWeeklyTrendsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [generalData, setGeneralData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setGeneralData(generateGeneralHeatmapData());
      setCategoryData(generateCategoryHeatmapData());
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [dateRange]); // Reload data when date range changes

  useEffect(() => {
    // Update filter count
    setNumberOfFilters(dateRange ? 1 : 0);
  }, [dateRange]);

  const maxGeneralValue = Math.max(...generalData.map(d => d.value), 1);
  const maxCategoryValue = Math.max(...categoryData.map(d => d.value), 1);

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg: 'transparent',
          },
        },
      }}
    >
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="rounded-xl border-slate-200"
            styles={{ 
              header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' },
              body: { padding: 24 }
            }}
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    type="text"
                    icon={<IconArrowLeft />}
                    onClick={onBack}
                    className="rounded-lg h-10 w-10"
                  />
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    <IconCalendar className="text-white text-xl" />
                  </div>
                  <div>
                    <Title level={5} className="!m-0 !font-semibold">Weekly Traffic Trends</Title>
                    <Text type="secondary" className="text-[13px]">
                      Analyze weekly traffic patterns and trends
                    </Text>
                  </div>
                </div>
                <Badge count={numberOfFilters} size="small" offset={[-5, 5]}>
                  <Button 
                    type={filtersOpen ? "primary" : "default"}
                    icon={<IconFilter />}
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="rounded-lg"
                  />
                </Badge>
              </div>
            }
          >
            <Space direction="vertical" size="large" className="w-full">
              {/* Collapsible Filters */}
              <AnimatePresence>
                {filtersOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <Card
                      size="small"
                      className="bg-slate-50 border-slate-200 rounded-xl"
                      styles={{ body: { padding: 16 } }}
                    >
                      <RangePicker 
                        className="min-w-[200px]"
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates)}
                      />
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tabs */}
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="w-full"
                size="large"
              >
                <TabPane 
                  tab={
                    <Space>
                      <span>General</span>
                      <Tooltip title="Overall traffic trends for the week">
                        <IconInfoCircle className="text-sm text-gray-500" />
                      </Tooltip>
                    </Space>
                  } 
                  key="general"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading-general"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          height: '400px' 
                        }}
                      >
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          border: '3px solid #f3f4f6', 
                          borderTop: '3px solid #3b82f6', 
                          borderRadius: '50%', 
                          animation: 'spin 1s linear infinite' 
                        }} />
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
                          <div style={{ display: 'flex', marginBottom: '12px' }}>
                            <div style={{ width: '96px', flexShrink: 0 }}></div>
                            {Array.from({ length: 24 }, (_, i) => (
                              <div key={i} style={{ 
                                width: '48px', 
                                fontSize: '11px', 
                                textAlign: 'center', 
                                fontWeight: 500, 
                                color: '#6b7280' 
                              }}>
                                {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                              </div>
                            ))}
                          </div>
                          
                          {/* Heatmap grid */}
                          {['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'].map((day, dayIndex) => (
                            <div key={day} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                              <div style={{ 
                                width: '96px', 
                                fontSize: '12px', 
                                fontWeight: 600, 
                                textAlign: 'right', 
                                paddingRight: '12px', 
                                flexShrink: 0,
                                color: '#1f2937',
                                transition: 'color 0.2s'
                              }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#f59e0b'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
                              >
                                {day}
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
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

                <TabPane 
                  tab={
                    <Space>
                      <span>Categories</span>
                      <Tooltip title="Traffic breakdown by category">
                        <IconInfoCircle className="text-sm text-gray-500" />
                      </Tooltip>
                    </Space>
                  } 
                  key="categories"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading-categories"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          height: '400px' 
                        }}
                      >
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          border: '3px solid #f3f4f6', 
                          borderTop: '3px solid #3b82f6', 
                          borderRadius: '50%', 
                          animation: 'spin 1s linear infinite' 
                        }} />
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
                          <div style={{ display: 'flex', marginBottom: '12px' }}>
                            <div style={{ width: '160px', flexShrink: 0 }}></div>
                            {Array.from({ length: 24 }, (_, i) => (
                              <div key={i} style={{ 
                                width: '48px', 
                                fontSize: '11px', 
                                textAlign: 'center', 
                                fontWeight: 500, 
                                color: '#6b7280' 
                              }}>
                                {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
                              </div>
                            ))}
                          </div>
                          
                          {/* Heatmap grid */}
                          {['Billing Issues', 'Technical Support', 'Account Management', 'Product Inquiry', 'Service Complaint', 'Refund Request', 'General Query'].map((category, catIndex) => (
                            <div key={category} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                              <div 
                                style={{ 
                                  width: '160px', 
                                  fontSize: '12px', 
                                  fontWeight: 600, 
                                  textAlign: 'right', 
                                  paddingRight: '12px', 
                                  flexShrink: 0,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  color: '#1f2937',
                                  transition: 'color 0.2s'
                                }}
                                title={category}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#f59e0b'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
                              >
                                {category}
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
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
            </Space>
          </Card>
        </motion.div>
      </div>
    </ConfigProvider>
  );
}
