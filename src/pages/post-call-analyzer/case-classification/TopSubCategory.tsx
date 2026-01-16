import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Tooltip as AntTooltip } from "antd";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import { useDate } from "@/contexts/DateContext";
import { useProjectSelection } from "@/services/projectSelectionService";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";

interface TopSubCategoryProps {
  category: { name: string; color: string };
  onSubCategorySelect: (subCategory: string) => void;
  fromTime?: string;
  toTime?: string;
  onClose?: () => void; // Add close callback for slide
  onReload?: () => void; // Add reload callback for parent to trigger reload
}


function generateShades(baseColor: string, count: number): string[] {
  const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!hslMatch) return Array(count).fill(baseColor);
  
  const [, h, s, l] = hslMatch;
  const lightness = parseInt(l);
  
  return Array.from({ length: count }, (_, i) => {
    const newLightness = lightness - (i * 8);
    return `hsl(${h}, ${s}%, ${Math.max(20, newLightness)}%)`;
  });
}

export function TopSubCategory({ category, onSubCategorySelect, fromTime, toTime, onClose, onReload }: TopSubCategoryProps) {
  console.log('Category object:', category); // Debug log
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [initialDates, setInitialDates] = useState<{ from: string; to: string } | null>(null);
  const { selectedProject } = useProjectSelection();

  // Store initial dates on mount
  useEffect(() => {
    if (fromTime && toTime && !initialDates) {
      setInitialDates({ from: fromTime, to: toTime });
    }
  }, [fromTime, toTime, initialDates]);

  // Close slide when dates change (but not on initial mount)
  useEffect(() => {
    if (initialDates && fromTime && toTime) {
      if (initialDates.from !== fromTime || initialDates.to !== toTime) {
        if (onClose) {
          onClose();
        }
      }
    }
  }, [fromTime, toTime, onClose, initialDates]);

  // Handle reload - close slide and notify parent
  const handleReload = () => {
    if (onClose) {
      onClose();
    }
    if (onReload) {
      onReload();
    }
  };

  // Load subcategory data
  const loadSubCategoryData = async () => {
    // Only fetch if we have explicit fromTime and toTime from parent
    if (!selectedProject || !fromTime || !toTime || !category.name) {
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {

      const filters = {
        tenantId: parseInt(selectedProject.tenant_id),
        subtenantId: parseInt(selectedProject.sub_tenant_id),
        companyId: parseInt(selectedProject.company_id),
        departmentId: parseInt(selectedProject.department_id),
        fromTime: fromTime, // Use only the passed fromTime
        toTime: toTime,     // Use only the passed toTime
        category: category.name,
        limit: 10, // Add limit parameter as requested
      };


      const response = await callRoutingApiService.CaseClassificationTopSubCategory(filters);

      // Handle the correct response structure
      if (response?.data && Array.isArray(response.data)) {
        const transformedData = response.data.map((item: any) => ({
          name: item.subcategory || item.name || 'Unknown', // Ensure name is set correctly
          value: typeof item.count === 'string' ? parseInt(item.count) || 0 : (item.count || 0),
        })).filter((item: any) => item.value > 0);

        setData(transformedData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error loading subcategory data:', error);
      setHasError(true);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data only when category or project changes (NOT when dates change)
  useEffect(() => {
    loadSubCategoryData();
  }, [selectedProject, category.name, fromTime, toTime]); // Add fromTime and toTime back for initial load

  const colors = generateShades(category.color, data.length);
  const chartData = data.map((item, idx) => ({
    name: item.name, // Keep the original name for legend
    value: item.value,
    fill: colors[idx],
  }));

  const handleClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload?.name) {
      onSubCategorySelect(data.activePayload[0].payload.name);
    }
  };

  // Copy the exact tooltip from Category.tsx
  const TreemapTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="z-50 overflow-hidden rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm text-card-foreground backdrop-blur-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-start">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: data.fill }}
              />
              <p className="font-medium m-0">{data.name}</p>
            </div>
            <div className="text-sm ml-5">
              Value: {data.value}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ 
        flex: 1, 
        minHeight: 0, 
        backgroundColor: 'white', 
        borderRadius: 6, 
        padding: 8 
      }}>
        {isLoading ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 250 
          }}>
            <ExceptionHandleView type="loading" />
          </div>
        ) : hasError ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 250 
          }}>
            <ExceptionHandleView 
              type="500" 
              title="Error Loading Data"
              content="subcategory data"
              onTryAgain={handleReload}
            />
          </div>
        ) : data.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 250 
          }}>
            <ExceptionHandleView 
              type="204" 
              title="No Subcategory Data"
              content="for this category"
              onTryAgain={handleReload}
            />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
              onClick={handleClick}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
              <XAxis 
                dataKey="name" 
                stroke="#666" 
                fontSize={10}
                tick={false} // Disable X-axis labels
                height={60}
              />
              <YAxis 
                stroke="#666" 
                fontSize={11}
              />
              <Tooltip content={<TreemapTooltipContent />} />
              <Legend 
                verticalAlign="bottom"
                wrapperStyle={{ marginTop: '-8px' }}
                content={() => (
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '4px 0'
                  }}>
                    {chartData.map((item, idx) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        fontSize: '12px',
                        color: '#666'
                      }}>
                        <div 
                          style={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: item.fill,
                            borderRadius: '2px',
                            border: '1px solid #e8e8e8'
                          }}
                        />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Bar dataKey="value" name={category.name || 'Subcategories'} fill={category.color} radius={[4, 4, 0, 0]} cursor="pointer">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div style={{ 
        fontSize: 12, 
        textAlign: 'center', 
        color: '#666', 
        marginTop: 8 
      }}>
        Click on a bar to drill down further
      </div>
    </div>
  );
}
