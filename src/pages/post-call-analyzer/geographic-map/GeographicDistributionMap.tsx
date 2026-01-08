import { useState, useEffect, useRef } from "react";
import { 
  Card, 
  Table, 
  Button, 
  Select, 
  DatePicker, 
  Tag, 
  Space, 
  Row, 
  Col, 
  Typography,
  Skeleton,
  ConfigProvider
} from "antd";
import { 
  ArrowLeftOutlined,
  FilterOutlined,
  CalendarOutlined,
  GlobalOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { StatCard } from "@/components/ui/stat-card";

// Mock data for map locations
const mockMapData = [
  {
    name: "New York",
    coordinates: [40.7128, -74.0060],
    issues: [
      { type: "Billing", count: 145 },
      { type: "Technical", count: 98 },
      { type: "Customer Service", count: 67 },
      { type: "Network", count: 43 }
    ]
  },
  {
    name: "Los Angeles",
    coordinates: [34.0522, -118.2437],
    issues: [
      { type: "Billing", count: 132 },
      { type: "Technical", count: 112 },
      { type: "Customer Service", count: 89 },
      { type: "Network", count: 56 }
    ]
  },
  {
    name: "Chicago",
    coordinates: [41.8781, -87.6298],
    issues: [
      { type: "Billing", count: 98 },
      { type: "Technical", count: 76 },
      { type: "Customer Service", count: 54 },
      { type: "Network", count: 38 }
    ]
  },
  {
    name: "Houston",
    coordinates: [29.7604, -95.3698],
    issues: [
      { type: "Billing", count: 87 },
      { type: "Technical", count: 65 },
      { type: "Customer Service", count: 48 },
      { type: "Network", count: 32 }
    ]
  },
  {
    name: "Miami",
    coordinates: [25.7617, -80.1918],
    issues: [
      { type: "Billing", count: 76 },
      { type: "Technical", count: 54 },
      { type: "Customer Service", count: 41 },
      { type: "Network", count: 28 }
    ]
  }
];

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const callTypes = [
  { value: "all", label: "All Call Types" },
  { value: "home", label: "Home" },
  { value: "mobile", label: "Mobile" },
  { value: "unknown", label: "Unknown" },
];

const categoryColors = {
  "Billing": "#FF5733",
  "Technical": "#33A8FF", 
  "Customer Service": "#4CAF50",
  "Network": "#FFC300"
};

export default function GeographicDistributionMap() {
  const { setSelectedTab } = usePostCall();
  const [loading, setLoading] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedCallType, setSelectedCallType] = useState<string | undefined>(undefined);
  const [errorLoading, setErrorLoading] = useState(false);
  const [emptyData, setEmptyData] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const activeFiltersCount = [selectedCallType].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCallType(undefined);
  };

  useEffect(() => {
    return () => {
      // Cleanup map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);


  useEffect(() => {
    // Load Leaflet and D3 from CDN
    const loadScripts = async () => {
      // Check if already loaded
      if (window.L && window.d3) {
        initializeMap();
        return;
      }

      // Load Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const leafletCSS = document.createElement('link');
        leafletCSS.id = 'leaflet-css';
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);
      }

      // Load Leaflet JS
      if (!window.L) {
        await new Promise((resolve) => {
          const leafletScript = document.createElement('script');
          leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          leafletScript.onload = resolve;
          document.head.appendChild(leafletScript);
        });
      }

      // Load D3 JS
      if (!window.d3) {
        await new Promise((resolve) => {
          const d3Script = document.createElement('script');
          d3Script.src = 'https://d3js.org/d3.v7.min.js';
          d3Script.onload = resolve;
          document.head.appendChild(d3Script);
        });
      }

      initializeMap();
    };

    loadScripts();
  }, []);

  const initializeMap = () => {
    if (!mapContainerRef.current || !window.L || !window.d3) return;

    // Clear existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create map
    const map = window.L.map(mapContainerRef.current, {
      center: [37.0902, -95.7129], // Center of USA
      zoom: 4,
      zoomControl: true,
      attributionControl: false,
      worldCopyJump: false,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0
    });

    // Add tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
      noWrap: true
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add markers with pie charts
    addPieChartMarkers(map, mockMapData);
  };

  const addPieChartMarkers = (map: any, data: typeof mockMapData) => {
    const getRadius = (zoom: number) => {
      const baseRadius = 15;
      return baseRadius * Math.pow(1.2, zoom - 4);
    };

    data.forEach(location => {
      const totalIssues = location.issues.reduce((sum, issue) => sum + issue.count, 0);
      
      const createPieChart = (radius: number) => {
        const svg = window.d3.create('svg')
          .attr('width', radius * 2)
          .attr('height', radius * 2);

        const pie = window.d3.pie()
          .value((d: any) => d.count)
          .sort(null);

        const arc = window.d3.arc()
          .innerRadius(0)
          .outerRadius(radius);

        const g = svg.append('g')
          .attr('transform', `translate(${radius},${radius})`);

        g.selectAll('path')
          .data(pie(location.issues))
          .enter()
          .append('path')
          .attr('d', arc as any)
          .attr('fill', (d: any) => categoryColors[d.data.type] || '#999')
          .attr('stroke', 'white')
          .style('stroke-width', '2px')
          .style('opacity', 0.85);

        return svg.node()?.outerHTML || '';
      };

      const initialRadius = getRadius(map.getZoom());
      const icon = window.L.divIcon({
        className: 'pie-chart-marker',
        html: createPieChart(initialRadius),
        iconSize: [initialRadius * 2, initialRadius * 2],
        iconAnchor: [initialRadius, initialRadius]
      });

      const marker = window.L.marker(location.coordinates, { icon }).addTo(map);

      // Popup content
      const popupContent = `
        <div style="font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; min-width: 200px;">
          <div style="font-weight: 600; font-size: 15px; margin-bottom: 10px; color: #1a1a1a;">
            ${location.name}
          </div>
          <div style="margin-bottom: 8px;">
            ${location.issues.map(issue => `
              <div style="display: flex; align-items: center; margin-bottom: 6px; font-size: 13px;">
                <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${categoryColors[issue.type]}; margin-right: 8px;"></span>
                <span style="color: #4a4a4a;">${issue.type}: <strong>${issue.count}</strong></span>
              </div>
            `).join('')}
          </div>
          <div style="border-top: 1px solid #e0e0e0; padding-top: 8px; margin-top: 8px; font-size: 13px; color: #1a1a1a;">
            <strong>Total: ${totalIssues}</strong>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      // Update marker on zoom
      map.on('zoomend', () => {
        const newRadius = getRadius(map.getZoom());
        const newIcon = window.L.divIcon({
          className: 'pie-chart-marker',
          html: createPieChart(newRadius),
          iconSize: [newRadius * 2, newRadius * 2],
          iconAnchor: [newRadius, newRadius]
        });
        marker.setIcon(newIcon);
      });
    });
  };

  const searchFilterData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      initializeMap();
    }, 1000);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#475569',
            headerSortActiveBg: '#f1f5f9',
            rowHoverBg: '#f8fafc',
            borderColor: '#e2e8f0',
          },
          Card: {
            headerBg: 'transparent',
          },
          Select: {
            borderRadius: 8,
          },
          Button: {
            borderRadius: 8,
          },
        },
      }}
    >
      <div className="p-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
            styles={{
              header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' },
              body: { padding: 24 }
            }}
            title={
              <div className="flex items-center gap-3">
                <Button 
                  type="text" 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => setSelectedTab("reports")}
                  style={{ marginRight: 8 }}
                />
                <div 
                  style={{ 
                    width: 42, 
                    height: 42, 
                    borderRadius: 12, 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <GlobalOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Geographic Distribution Map</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Visualize call volume and issue distribution across different geographic locations
                  </Text>
                </div>
              </div>
            }
            extra={
              <Space>
                <Button 
                  type={filtersVisible ? "primary" : "default"}
                  icon={<FilterOutlined />}
                  onClick={() => setFiltersVisible(!filtersVisible)}
                >
                  Filters
                  {activeFiltersCount > 0 && (
                    <Tag color="red" style={{ marginLeft: 8, borderRadius: 10 }}>{activeFiltersCount}</Tag>
                  )}
                </Button>
              </Space>
            }
          >
            {/* Filters Panel */}
            <AnimatePresence>
              {filtersVisible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <Card
                    size="small"
                    style={{ 
                      marginBottom: 20, 
                      background: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      borderRadius: 12
                    }}
                    styles={{ body: { padding: 16 } }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} lg={8}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Date Range</Text>
                          <RangePicker style={{ width: '100%' }} />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={8}>
                        <div className="space-y-1.5">
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Call Type</Text>
                          <Select
                            placeholder="All Call Types"
                            style={{ width: '100%' }}
                            allowClear
                            value={selectedCallType}
                            onChange={setSelectedCallType}
                            options={callTypes}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={8} className="flex items-end">
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                          <Button onClick={clearAllFilters}>Clear</Button>
                          <Button type="primary" onClick={searchFilterData}>Search</Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <style>{`
              .pie-chart-marker {
                background: transparent !important;
                border: none !important;
              }
              .leaflet-popup-content-wrapper {
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              }
              .leaflet-popup-tip {
                background: white;
              }
            `}</style>

            {/* Map Container */}
            <div className="mt-6">
              {loading ? (
                <div className="flex items-center justify-center h-[600px] border border-border/50 rounded-lg bg-muted/20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : errorLoading ? (
                <div className="flex items-center justify-center h-[600px] border border-border/50 rounded-lg bg-muted/20">
                  <div className="text-center text-muted-foreground">
                    <p className="text-lg font-medium mb-2">Error loading map</p>
                    <p className="text-sm">There was an error loading the map data. Please try again later.</p>
                  </div>
                </div>
              ) : emptyData ? (
                <div className="flex items-center justify-center h-[600px] border border-border/50 rounded-lg bg-muted/20">
                  <div className="text-center text-muted-foreground">
                    <GlobalOutlined className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ fontSize: 48, color: '#94a3b8' }} />
                    <p className="text-lg font-medium mb-2">No data available</p>
                    <p className="text-sm">There is no geographic data available for the selected filters.</p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="border border-border/50 rounded-lg overflow-hidden"
                >
                  <div 
                    ref={mapContainerRef} 
                    className="w-full h-[600px] bg-muted/10"
                  />
                </motion.div>
              )}
            </div>

            {/* Legend */}
            {!loading && !errorLoading && !emptyData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-4 border border-border/50 rounded-lg bg-muted/20"
              >
                <div className="flex flex-wrap gap-4 justify-center">
                  {Object.entries(categoryColors).map(([category, color]) => (
                    <div key={category} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-muted-foreground">{category}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
      <AIHelper />
    </ConfigProvider>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    L: any;
    d3: any;
  }
}
