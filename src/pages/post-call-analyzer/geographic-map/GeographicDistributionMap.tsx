import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ArrowLeft, Filter, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useModule } from "@/contexts/ModuleContext";
import { AIHelper } from "@/components/post-call/AIHelper";

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

const categoryColors: Record<string, string> = {
  "Billing": "#FF5733",
  "Technical": "#33A8FF",
  "Customer Service": "#4CAF50",
  "Network": "#FFC300"
};

export default function GeographicDistributionMap() {
  const navigate = useNavigate();
  const { setShowModuleTabs } = useModule();
  const [loading, setLoading] = useState(false);
  const [panelOpenState, setPanelOpenState] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [selectedCallType, setSelectedCallType] = useState<string>("");
  const [errorLoading, setErrorLoading] = useState(false);
  const [emptyData, setEmptyData] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    setShowModuleTabs(true);
    return () => {
      setShowModuleTabs(true);
      // Cleanup map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [setShowModuleTabs]);

  useEffect(() => {
    let count = 0;
    if (selectedCallType) count++;
    setNumberOfFilters(count);
  }, [selectedCallType]);

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
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
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

  const toggleFilters = () => {
    setPanelOpenState(!panelOpenState);
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
    <>
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
      
      <div className="p-6 space-y-6">
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/post-call-analyzer/reports")}
                  className="h-9 w-9 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Geographic Distribution Map
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Visualize call volume and issue distribution across different geographic locations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={panelOpenState ? "default" : "outline"}
                  size="icon"
                  onClick={toggleFilters}
                  className="relative h-9 w-9"
                >
                  <Filter className="h-4 w-4" />
                  {numberOfFilters > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                      {numberOfFilters}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Collapsible open={panelOpenState} onOpenChange={setPanelOpenState}>
              <CollapsibleContent>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: panelOpenState ? 1 : 0, 
                    height: panelOpenState ? "auto" : 0 
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-6 p-4 border border-border/50 rounded-lg bg-muted/30"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Calendar className="h-4 w-4" />
                        Select dates
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Call Type</label>
                      <Select value={selectedCallType} onValueChange={setSelectedCallType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Call Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Call Types</SelectItem>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        onClick={searchFilterData}
                        className="w-full rounded-full"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>

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
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
          </CardContent>
        </Card>
      </div>
      <AIHelper />
    </>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    L: any;
    d3: any;
  }
}
