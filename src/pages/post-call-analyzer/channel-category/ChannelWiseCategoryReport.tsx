import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw, Calendar, List, Phone, MessageCircle, Users, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Label, Treemap } from "recharts";

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
      case "phone": return <Phone className="h-5 w-5" />;
      case "message": return <MessageCircle className="h-5 w-5" />;
      case "users": return <Users className="h-5 w-5" />;
      default: return <MessageCircle className="h-5 w-5" />;
    }
  };

  // Prepare treemap data for Recharts (we'll use a custom grid layout)
  const firstColumnLegends = categoryData.slice(0, Math.ceil(categoryData.length / 2));
  const secondColumnLegends = categoryData.slice(Math.ceil(categoryData.length / 2));

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">Channel Wise Category Distribution</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Call distribution across different channels and categories</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm text-muted-foreground">Call distribution by channel</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Calendar className="h-4 w-4" />
              Week
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

      <CardContent className="p-6">
        <div className={`grid ${selectedChannel ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {/* Channels Pie Chart */}
          <div>
            <h5 className="text-base font-semibold mb-4">Channels</h5>
            
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                            className="text-xs font-medium"
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                          >
                            <tspan x={x} dy="-0.4em">{name}</tspan>
                            <tspan x={x} dy="1.2em" className="font-bold">{value}</tspan>
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
                <div className="border-t border-border/30 pt-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    {channelData.map((channel) => (
                      <div key={channel.name} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div 
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: channel.color }}
                          >
                            {getChannelIcon(channel.icon)}
                          </div>
                          <p className="text-sm text-muted-foreground">{channel.name}</p>
                        </div>
                        <h3 className="text-2xl font-bold" style={{ color: channel.color }}>
                          {channel.value}
                        </h3>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-center text-muted-foreground mt-4">
                  <span className="font-medium">Note:</span> Click on a section to view category distribution
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available
              </div>
            )}
          </div>

          {/* Categories Treemap - Right Side */}
          {selectedChannel && (
            <div className="border-l border-border/30 pl-6 animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="text-base font-semibold">Categories Distribution</h5>
                  <span className="text-sm text-muted-foreground">{selectedChannel}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9"
                  onClick={handleCloseCategories}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-[380px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* Recharts Treemap */}
                  <div className="bg-card rounded-md p-2 mb-4">
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
                  </div>

                  {/* Category Legends */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="space-y-2">
                      {firstColumnLegends.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-xs text-muted-foreground">{item.category}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {secondColumnLegends.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: COLORS[(firstColumnLegends.length + index) % COLORS.length] }}
                          />
                          <span className="text-xs text-muted-foreground">{item.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
