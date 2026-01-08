import { useState } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip } from "antd";
import { 
  ReloadOutlined, 
  CloseOutlined, 
  BarChartOutlined,
  CalendarOutlined, 
  ApartmentOutlined
} from "@ant-design/icons";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { Treemap, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

const { Title, Text } = Typography;

// Custom Tooltip Components
const TreemapTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #d9d9d9',
        borderRadius: 8,
        padding: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>{data.name}</div>
        <div style={{ fontSize: 12, color: '#666' }}>Value: {data.value}</div>
        <div style={{ fontSize: 12, color: '#666' }}>Percentage: {data.percentage}%</div>
      </div>
    );
  }
  return null;
};

const BarChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #d9d9d9',
        borderRadius: 8,
        padding: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>{data.name}</div>
        <div style={{ fontSize: 12, color: '#666' }}>Value: {data.value}</div>
      </div>
    );
  }
  return null;
};

// Mock Call Logs Component
const RedAlertCallLogs = ({ category, subCategory }: { category: string; subCategory: string }) => {
  const mockLogs = [
    { id: 1, time: "10:30 AM", duration: "5:23", status: "Completed" },
    { id: 2, time: "11:15 AM", duration: "3:45", status: "Dropped" },
    { id: 3, time: "02:00 PM", duration: "8:12", status: "Completed" },
    { id: 4, time: "03:30 PM", duration: "2:56", status: "Completed" },
  ];

  return (
    <div className="space-y-2" style={{ maxHeight: 300, overflowY: 'auto' }}>
      {mockLogs.map((log) => (
        <div key={log.id} style={{
          padding: 8,
          backgroundColor: '#fafafa',
          borderRadius: 8,
          fontSize: 14
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>{log.time}</span>
            <span style={{ color: '#666' }}>{log.duration}</span>
          </div>
          <div style={{ color: '#666' }}>{log.status}</div>
        </div>
      ))}
    </div>
  );
};

// Colors matching Angular environment.colors
const COLORS = [
  "#4285F4", "#34A853", "#FBBC04", "#EA4335", "#9C27B0",
  "#FF5722", "#00BCD4", "#8BC34A", "#FFC107", "#E91E63"
];

// Mock data for red alert treemap
const mockRedAlertData = [
  { name: "Drop calls", value: 145, percentage: 28 },
  { name: "Repeat Calls", value: 128, percentage: 25 },
  { name: "Open Cases", value: 98, percentage: 19 },
  { name: "Package Churn", value: 87, percentage: 17 },
  { name: "Bad Practices", value: 55, percentage: 11 },
];

// Custom Treemap Content Component
const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill, percentage } = props;
  
  // Skip rendering if there's no valid name (this filters out the root node)
  if (!name) {
    return null;
  }
  
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
      {width > 60 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={14}
          fontWeight={600}
          style={{ pointerEvents: "none" }}
        >
          {percentage}%
        </text>
      )}
    </g>
  );
};

export default function RedAlertMetricsReport() {
  const [loading, setLoading] = useState(false);
  const [secondChartLoading, setSecondChartLoading] = useState(false);
  const [thirdChartLoading, setThirdChartLoading] = useState(false);
  
  const [showSecondChart, setShowSecondChart] = useState(false);
  const [showThirdChart, setShowThirdChart] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  
  const [redAlertData] = useState(mockRedAlertData);
  const [barChartData, setBarChartData] = useState<any[]>([]);

  const handleReload = () => {
    setLoading(true);
    setShowSecondChart(false);
    setShowThirdChart(false);
    setSelectedCategory("");
    setSelectedSubCategory("");
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleTreemapClick = (data: any) => {
    if (data?.name) {
      setSelectedCategory(data.name);
      setShowSecondChart(true);
      setShowThirdChart(false);
      setSelectedSubCategory("");
      loadSecondChartData(data.name);
    }
  };

  const loadSecondChartData = (category: string) => {
    setSecondChartLoading(true);
    
    // Mock data for bar chart based on category
    setTimeout(() => {
      const mockBarData = [
        { name: "Agent A", value: 45 },
        { name: "Agent B", value: 38 },
        { name: "Agent C", value: 32 },
        { name: "Agent D", value: 28 },
        { name: "Agent E", value: 22 },
        { name: "Agent F", value: 18 },
        { name: "Agent G", value: 15 },
        { name: "Agent H", value: 12 },
      ];
      setBarChartData(mockBarData);
      setSecondChartLoading(false);
    }, 300);
  };

  const handleBarClick = (data: any) => {
    if (data?.name) {
      setSelectedSubCategory(data.name);
      setShowThirdChart(true);
      setThirdChartLoading(false);
    }
  };

  const closeSecondChart = () => {
    setShowSecondChart(false);
    setShowThirdChart(false);
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  const closeThirdChart = () => {
    setShowThirdChart(false);
    setSelectedSubCategory("");
  };

  // Prepare treemap data with colors
  const treemapData = redAlertData.map((item, idx) => ({
    ...item,
    fill: COLORS[idx % COLORS.length],
  }));

  // Get column classes based on drill-down state
  const getFirstChartCol = () => {
    if (showThirdChart) return "col-12 md:col-span-4";
    if (showSecondChart) return "col-12 md:col-span-6";
    return "col-12";
  };

  const getSecondChartCol = () => {
    if (showThirdChart) return "col-12 md:col-span-4";
    return "col-12 md:col-span-6";
  };

  // Generate shades for bar chart
  const getBarChartColors = () => {
    const categoryIndex = redAlertData.findIndex(item => item.name === selectedCategory);
    const baseColor = COLORS[categoryIndex % COLORS.length];
    return barChartData.map((_, idx) => {
      const factor = 1 - (idx * 0.08);
      return baseColor + Math.round(Math.max(0.5, factor) * 255).toString(16).padStart(2, '0');
    });
  };

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
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ marginTop: -12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
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
                <ApartmentOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                        Red Alert Metrics
                      </Title>
                      <Tooltip title="Highlighting key areas that require immediate attention">
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
                      Highlighting key areas that require immediate attention
                    </Text>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DatePicker 
                suffixIcon={<CalendarOutlined />}
                style={{ 
                  borderRadius: 8,
                  borderColor: '#d9d9d9'
                }}
              />
              <Button 
                type="text"
                icon={<ReloadOutlined className={loading ? 'animate-spin' : ''} />}
                onClick={handleReload}
                style={{ borderRadius: 8 }}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 350 
          }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
            {/* Treemap Chart - First Level */}
            <div style={{ 
              gridColumn: showThirdChart ? 'span 4' : showSecondChart ? 'span 6' : 'span 12'
            }}>
              <Card
                style={{
                  borderRadius: 12,
                  border: '1px solid #e8e8e8',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  padding: 16
                }}
              >
                <ResponsiveContainer width="100%" height={350}>
                  <Treemap
                    data={treemapData}
                    dataKey="value"
                    stroke="white"
                    fill="hsl(226, 70%, 55%)"
                    content={<CustomTreemapContent />}
                    onClick={handleTreemapClick}
                  >
                    <RechartsTooltip content={<TreemapTooltip />} />
                  </Treemap>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {treemapData.filter(item => item.value > 0).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div 
                        style={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: 2, 
                          flexShrink: 0,
                          backgroundColor: item.fill 
                        }}
                      />
                      <span style={{ fontSize: 12, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ 
                  fontSize: 14, 
                  color: '#666', 
                  textAlign: 'center', 
                  marginTop: 12, 
                  padding: 8, 
                  backgroundColor: '#fafafa', 
                  borderRadius: 8 
                }}>
                  <span style={{ fontWeight: 500, color: '#1890ff' }}>Note:</span> Data is based on the selected date range
                </div>
              </Card>
            </div>

            {/* Bar Chart - Second Level */}
            {showSecondChart && (
              <div style={{ 
                gridColumn: showThirdChart ? 'span 4' : 'span 6'
              }}>
                <div style={{ 
                  border: '1px solid #e8e8e8', 
                  borderRadius: 8, 
                  padding: 16 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 14 }}>{selectedCategory}</Text>
                      <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                        {selectedCategory === 'Open Cases' || selectedCategory === 'Drop calls' 
                          ? 'Top Agents' 
                          : 'Reasons for ' + selectedCategory}
                      </Title>
                    </div>
                    <Button 
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={closeSecondChart}
                      style={{ borderRadius: 8 }}
                    />
                  </div>

                  {secondChartLoading ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: 300 
                    }}>
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
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            className="text-xs" 
                            axisLine={false} 
                            tickLine={false}
                            hide
                          />
                          <YAxis 
                            className="text-xs" 
                            axisLine={false} 
                            tickLine={false}
                          />
                          <RechartsTooltip content={<BarChartTooltip />} />
                          <Bar 
                            dataKey="value" 
                            radius={[6, 6, 0, 0]}
                            onClick={handleBarClick}
                            style={{ cursor: 'pointer' }}
                          >
                            {barChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getBarChartColors()[index]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div style={{ 
                        fontSize: 14, 
                        color: '#666', 
                        textAlign: 'center', 
                        marginTop: 8, 
                        padding: 8, 
                        backgroundColor: '#fafafa', 
                        borderRadius: 8 
                      }}>
                        <span style={{ fontWeight: 500, color: '#1890ff' }}>Note:</span> Data is based on the selected date range
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Call Logs - Third Level */}
            {showThirdChart && (
              <div style={{ gridColumn: 'span 4' }}>
                <div style={{ 
                  border: '1px solid #e8e8e8', 
                  borderRadius: 8, 
                  padding: 16 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 14 }}>{selectedCategory} / {selectedSubCategory}</Text>
                      <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Call Logs</Title>
                    </div>
                    <Button 
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={closeThirdChart}
                      style={{ borderRadius: 8 }}
                    />
                  </div>

                  {thirdChartLoading ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: 300 
                    }}>
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
                    <RedAlertCallLogs 
                      category={selectedCategory}
                      subCategory={selectedSubCategory}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Space>
    </Card>
  );
}
