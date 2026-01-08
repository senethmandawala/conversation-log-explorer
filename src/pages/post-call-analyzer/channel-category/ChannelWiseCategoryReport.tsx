import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip } from "antd";
import { 
  InfoCircleOutlined, 
  ReloadOutlined, 
  CalendarOutlined, 
  UnorderedListOutlined,
  PhoneOutlined,
  MessageOutlined,
  TeamOutlined,
  CloseOutlined,
  PieChartOutlined
} from "@ant-design/icons";
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
    console.log("Category clicked:", category);
  };

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case "phone": return <PhoneOutlined style={{ fontSize: 20 }} />;
      case "message": return <MessageOutlined style={{ fontSize: 20 }} />;
      case "users": return <TeamOutlined style={{ fontSize: 20 }} />;
      default: return <MessageOutlined style={{ fontSize: 20 }} />;
    }
  };

  // Prepare treemap data for Recharts (we'll use a custom grid layout)
  const firstColumnLegends = categoryData.slice(0, Math.ceil(categoryData.length / 2));
  const secondColumnLegends = categoryData.slice(Math.ceil(categoryData.length / 2));

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
            <Space align="center" size="middle" orientation="horizontal">
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
                <PieChartOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    Channel Wise Category Distribution
                  </Title>
                  <Tooltip title="Call distribution across different channels and categories">
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
                  Call distribution by channel
                </Text>
              </div>
            </Space>
            
            <Space size="small" orientation="horizontal">
              <DatePicker 
                suffixIcon={<CalendarOutlined />}
                style={{ 
                  borderRadius: 8,
                  borderColor: '#d9d9d9'
                }}
              />
              <Button 
                type="text" 
                icon={<ReloadOutlined />}
                onClick={handleReload}
                style={{ width: 36, height: 36 }}
              />
              <Button 
                type="text" 
                icon={<UnorderedListOutlined />}
                style={{ width: 36, height: 36 }}
              />
            </Space>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
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
            <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Channels</Title>
            
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  border: '2px solid #1890ff', 
                  borderTop: '2px solid transparent', 
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
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
                <div style={{ 
                  borderTop: '1px solid #e8e8e8', 
                  paddingTop: 16, 
                  marginTop: 16 
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {channelData.map((channel) => (
                      <div key={channel.name} style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
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
                          <Text type="secondary" style={{ fontSize: 12 }}>{channel.name}</Text>
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 600, color: channel.color }}>
                          {channel.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Text type="secondary" style={{ fontSize: 12, textAlign: 'center', marginTop: 16 }}>
                  <span style={{ fontWeight: 500 }}>Note:</span> Click on a section to view category distribution
                </Text>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#666' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <Title level={5} style={{ margin: 0 }}>Categories Distribution</Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>{selectedChannel}</Text>
                </div>
                <Button 
                  type="text" 
                  icon={<CloseOutlined />}
                  onClick={handleCloseCategories}
                  style={{ width: 36, height: 36 }}
                />
              </div>

              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 380 }}>
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    border: '2px solid #1890ff', 
                    borderTop: '2px solid transparent', 
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                </div>
              ) : (
                <>
                  {/* Recharts Treemap */}
                  <Card
                    style={{
                      borderRadius: 8,
                      border: '1px solid #e8e8e8',
                      background: '#ffffff',
                      padding: 8,
                      marginBottom: 16
                    }}
                  >
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {firstColumnLegends.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div 
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 2,
                              flexShrink: 0,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                          <Text type="secondary" style={{ fontSize: 12 }}>{item.category}</Text>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {secondColumnLegends.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div 
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 2,
                              flexShrink: 0,
                              backgroundColor: COLORS[(firstColumnLegends.length + index) % COLORS.length]
                            }}
                          />
                          <Text type="secondary" style={{ fontSize: 12 }}>{item.category}</Text>
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
