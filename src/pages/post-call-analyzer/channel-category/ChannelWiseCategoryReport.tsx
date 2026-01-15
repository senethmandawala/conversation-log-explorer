import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip } from "antd";
import { 
  IconInfoCircle, 
  IconRefresh, 
  IconCalendar, 
  IconList,
  IconPhone,
  IconMessage,
  IconUsers,
  IconX,
  IconChartPie
} from "@tabler/icons-react";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Label, Treemap } from "recharts";

const { Title, Text } = Typography;

// Mock data for channels
const generateChannelData = () => [
  { name: "IVR", value: 245, color: "#4CAF50", icon: "phone" },
  { name: "WhatsApp", value: 178, color: "#FFC107", icon: "message" },
  { name: "Others", value: 60, color: "#9E9E9E", icon: "Grid" },
];

const channelDataInitial = generateChannelData();

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0" 
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="text-sm font-medium text-foreground">
            {data.name}: <span className="font-semibold">{data.value}</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTreemapTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0" 
            style={{ backgroundColor: data.fill }}
          />
          <span className="text-sm font-medium text-foreground">
            {data.name}: <span className="font-semibold">{data.value}</span>
          </span>
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

// Mock data for categories by channel
const categoryDataByChannel: Record<string, Array<{ category: string; percentage: number; count: number; color: string }>> = {
  IVR: [
    { category: "Billing Issues", percentage: 28.5, count: 70, color: "#4CAF50" },
    { category: "Technical Support", percentage: 22.3, count: 55, color: "#2196F3" },
    { category: "Account Management", percentage: 18.7, count: 46, color: "#FFC107" },
    { category: "Product Inquiry", percentage: 15.2, count: 37, color: "#9C27B0" },
    { category: "Service Complaint", percentage: 10.1, count: 25, color: "#FF5722" },
    { category: "Refund Request", percentage: 5.2, count: 12, color: "#607D8B" },
  ],
  WhatsApp: [
    { category: "Product Inquiry", percentage: 32.1, count: 57, color: "#4CAF50" },
    { category: "Order Status", percentage: 25.8, count: 46, color: "#2196F3" },
    { category: "Technical Support", percentage: 18.5, count: 33, color: "#FFC107" },
    { category: "Billing Issues", percentage: 12.4, count: 22, color: "#9C27B0" },
    { category: "General Query", percentage: 11.2, count: 20, color: "#FF5722" },
  ],
  Messenger: [
    { category: "General Query", percentage: 35.6, count: 47, color: "#4CAF50" },
    { category: "Product Inquiry", percentage: 28.8, count: 38, color: "#2196F3" },
    { category: "Service Request", percentage: 20.5, count: 27, color: "#FFC107" },
    { category: "Account Management", percentage: 15.1, count: 20, color: "#9C27B0" },
  ],
};

const COLORS = [
  "#4CAF50", "#2196F3", "#FFC107", "#9C27B0", "#FF5722", "#607D8B",
  "#E91E63", "#00BCD4", "#8BC34A", "#FFEB3B", "#795548", "#03A9F4"
];

export default function ChannelWiseCategoryReport() {
  const [loading, setLoading] = useState(false);
  const [channelData, setChannelData] = useState(generateChannelData());
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<Array<{ category: string; percentage: number; count: number; color: string }>>([]);

  const handleReload = () => {
    setLoading(true);
    setSelectedChannel(null);
    setTimeout(() => {
      setChannelData(generateChannelData());
      setLoading(false);
    }, 500);
  };

  const handleChannelSelect = (channelName: string) => {
    setSelectedChannel(channelName);
    setCategoryData(categoryDataByChannel[channelName] || []);
  };

  const handleCloseCategories = () => {
    setSelectedChannel(null);
    setCategoryData([]);
  };

  const handleCategoryClick = (category: string) => {
  };

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case "phone": return <IconPhone className="text-xl" />;
      case "message": return <IconMessage className="text-xl" />;
      case "users": return <IconUsers className="text-xl" />;
      default: return <IconMessage className="text-xl" />;
    }
  };

  // Prepare treemap data for Recharts (we'll use a custom grid layout)
  const firstColumnLegends = categoryData.slice(0, Math.ceil(categoryData.length / 2));
  const secondColumnLegends = categoryData.slice(Math.ceil(categoryData.length / 2));

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle" orientation="horizontal">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconChartPie className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-lg !font-semibold">
                    Channel Wise Category Distribution
                  </Title>
                  <Tooltip title="Call distribution across different channels and categories">
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
                  Call distribution by channel
                </Text>
              </div>
            </Space>
            
            <Space size="small" orientation="horizontal">
              <DatePicker 
                suffixIcon={<IconCalendar />}
                className="rounded-lg"
              />
              <Button 
                type="text" 
                icon={<IconRefresh />}
                onClick={handleReload}
                className="w-9 h-9"
              />
              <Button 
                type="text" 
                icon={<IconList />}
                className="w-9 h-9"
              />
            </Space>
          </div>
        </div>
        <div className="flex gap-6">
          {/* Channels Card */}
          <Card
            style={{
              borderRadius: 12,
              border: '1px solid #e8e8e8',
              background: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: 16,
              flex: selectedChannel ? '0 0 50%' : '1 0 0'
            }}
          >
            <Title level={5} className="!m-0 !mb-4">Channels</Title>
            
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : channelData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      onClick={(data) => handleChannelSelect(data.name)}
                      style={{ cursor: 'pointer' }}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value, fill }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#fff"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{ fontSize: 12, fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                          >
                            <tspan x={x} dy="-0.4em">{name}</tspan>
                            <tspan x={x} dy="1.2em" style={{ fontWeight: 700 }}>{value}</tspan>
                          </text>
                        );
                      }}
                      labelLine={false}
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Channel Stats */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    {channelData.map((channel) => (
                      <div key={channel.name} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div 
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              backgroundColor: channel.color
                            }}
                          >
                            {getChannelIcon(channel.icon)}
                          </div>
                          <Text type="secondary" className="text-xs">{channel.name}</Text>
                        </div>
                        <div className="text-2xl font-semibold" style={{ color: channel.color as string }}>
                          {channel.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Text type="secondary" className="text-xs text-center mt-4 block">
                  <span className="font-medium">Note:</span> Click on a section to view category distribution
                </Text>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No data available
              </div>
            )}
          </Card>

          {/* Category Distribution Card - Only show when channel is selected */}
          {selectedChannel && (
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #e8e8e8',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: 16,
                flex: '0 0 50%',
                animation: 'slideInFromRight 0.5s ease-out'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Title level={5} className="!m-0">Categories Distribution</Title>
                  <Text type="secondary" className="text-sm">{selectedChannel}</Text>
                </div>
                <Button 
                  type="text" 
                  icon={<IconX />}
                  onClick={handleCloseCategories}
                  className="w-9 h-9"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-[380px]">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Recharts Treemap */}
                  <Card className="rounded-lg border-gray-200 bg-white p-2 mb-4">
                    <ResponsiveContainer width="100%" height={280}>
                      <Treemap
                        data={categoryData.map((item, idx) => ({
                          name: item.category,
                          value: item.count,
                          fill: COLORS[idx % COLORS.length],
                        }))}
                        dataKey="value"
                        stroke="white"
                        fill="hsl(226, 70%, 55%)"
                        content={<CustomTreemapContent />}
                        onClick={(data) => handleCategoryClick(data.name)}
                      >
                        <RechartsTooltip content={<CustomTreemapTooltip />} />
                      </Treemap>
                    </ResponsiveContainer>
                  </Card>

                  {/* Category Legends */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                      {firstColumnLegends.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 2,
                              flexShrink: 0,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                          <Text type="secondary" className="text-xs">{item.category}</Text>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      {secondColumnLegends.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 2,
                              flexShrink: 0,
                              backgroundColor: COLORS[(firstColumnLegends.length + index) % COLORS.length]
                            }}
                          />
                          <Text type="secondary" className="text-xs">{item.category}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Card>
          )}
        </div>
      </Space>
    </Card>
  );
}
