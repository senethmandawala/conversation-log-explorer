import { useState, useEffect } from "react";
import { Card, Tabs, Typography, Tooltip, Spin, Button, Space } from "antd";
import { 
  InfoCircleOutlined, 
  CalendarOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const { Title, Text } = Typography;

// Generate mock heatmap data for General tab (Date x Hour)
const generateGeneralHeatmapData = () => {
  const days = ['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'];
  const data: any[] = [];
  
  days.forEach((day, dayIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0') + ':00';
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

const getHeatmapColor = (value: number, maxValue: number) => {
  if (value === 0) return 'hsl(var(--muted))';
  const intensity = value / maxValue;
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
}

const HeatmapCell = ({ value, maxValue, label, hour }: HeatmapCellProps) => {
  return (
    <Tooltip
      title={
        <div className="text-xs space-y-0.5">
          <p className="font-semibold">{label}</p>
          <p>{hour}</p>
          <p className="font-bold" style={{ color: "#3b82f6" }}>{value} calls</p>
        </div>
      }
    >
      <div
        className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md hover:z-10"
        style={{ 
          width: 48, 
          height: 40, 
          borderRadius: 4,
          border: "1px solid hsl(var(--border))",
          backgroundColor: getHeatmapColor(value, maxValue)
        }}
      />
    </Tooltip>
  );
};

export default function TrafficTrendsReportAntd() {
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

  const renderHeatmap = (
    data: any[], 
    maxValue: number, 
    labels: string[], 
    labelKey: string,
    labelWidth: number
  ) => (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Hour labels */}
        <div className="flex mb-3">
          <div style={{ width: labelWidth, flexShrink: 0 }}></div>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} style={{ width: 48, textAlign: "center", fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
              {i % 2 === 0 ? `${i.toString().padStart(2, '0')}` : ''}
            </div>
          ))}
        </div>
        
        {/* Heatmap grid */}
        {labels.map((label, labelIndex) => (
          <div key={label} className="flex items-center mb-2 group">
            <div 
              style={{ width: labelWidth, fontSize: 12, fontWeight: 600, textAlign: "right", paddingRight: 12, flexShrink: 0 }}
              className="text-foreground group-hover:text-primary transition-colors truncate"
              title={label}
            >
              {label}
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 24 }, (_, hour) => {
                const dataPoint = data.find(d => d.y === labelIndex && d.x === hour);
                return (
                  <HeatmapCell
                    key={hour}
                    value={dataPoint?.value || 0}
                    maxValue={maxValue}
                    label={label}
                    hour={`${hour.toString().padStart(2, '0')}:00`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabItems = [
    {
      key: "general",
      label: "General",
      children: (
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-general"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[400px]"
            >
              <Spin size="large" />
            </motion.div>
          ) : (
            <motion.div
              key="content-general"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderHeatmap(
                generalData, 
                maxGeneralValue, 
                ['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'],
                'day',
                96
              )}
            </motion.div>
          )}
        </AnimatePresence>
      ),
    },
    {
      key: "categories",
      label: "Categories",
      children: (
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[400px]"
            >
              <Spin size="large" />
            </motion.div>
          ) : (
            <motion.div
              key="content-categories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderHeatmap(
                categoryData, 
                maxCategoryValue, 
                ['Billing Issues', 'Technical Support', 'Account Management', 'Product Inquiry', 'Service Complaint', 'Refund Request', 'General Query'],
                'category',
                160
              )}
            </motion.div>
          )}
        </AnimatePresence>
      ),
    },
  ];

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
          <div>
            <div className="flex items-center gap-2">
              <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                Traffic Trends
              </Title>
              <Tooltip title="Visualize traffic trends across time periods">
                <InfoCircleOutlined style={{ color: "hsl(var(--muted-foreground))", cursor: "help" }} />
              </Tooltip>
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Jun 19 - Jun 25, 2025
            </Text>
          </div>
        }
        extra={
          <Space>
            <Button type="text" icon={<CalendarOutlined />}>Week</Button>
            <Button type="text" icon={<ReloadOutlined />} onClick={handleReload} />
          </Space>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </motion.div>
  );
}
