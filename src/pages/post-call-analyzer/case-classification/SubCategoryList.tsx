import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import { useProjectSelection } from "@/services/projectSelectionService";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import { CallLogsSummary } from "./CallLogsSummary";

interface SubCategoryListProps {
  category: { name: string; color: string };
  level: 3 | 4 | 5;
  breadcrumb: string[];
  onSubCategorySelect: (subCategory: string) => void;
  onShowCallLogs?: () => void;
  fromTime?: string;
  toTime?: string;
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

export function SubCategoryList({ category, level, breadcrumb, onSubCategorySelect, onShowCallLogs, fromTime, toTime }: SubCategoryListProps) {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showCallLogs, setShowCallLogs] = useState(false);
  const { selectedProject } = useProjectSelection();
  const lastItem = breadcrumb[breadcrumb.length - 1];

  useEffect(() => {
    const loadData = async () => {
      if (!selectedProject || !fromTime || !toTime || !lastItem) {
        return;
      }

      setIsLoading(true);
      setHasError(false);

      try {
        const tenantId = parseInt(selectedProject.tenant_id);
        const subtenantId = parseInt(selectedProject.sub_tenant_id);
        const companyId = parseInt(selectedProject.company_id);
        const departmentId = parseInt(selectedProject.department_id);

        const filters = {
          tenantId,
          subtenantId,
          companyId,
          departmentId,
          fromTime,
          toTime,
          category: category.name,
          subcategory: level === 4 ? breadcrumb[breadcrumb.length - 2] : lastItem,
          ...(level === 4 && { second_subcategory: lastItem }),
          ...(level === 5 && { 
            second_subcategory: breadcrumb[breadcrumb.length - 2],
            subCategoryLevel1: lastItem 
          }),
          limit: 10,
        };

        const response = await callRoutingApiService.CaseClassificationSubCategoryList(filters);

        // Check for no_category_level response
        if (response?.data === "no_category_level" || response?.message === "no_category_level") {
          setShowCallLogs(true);
          setData([]);
          if (onShowCallLogs) {
            onShowCallLogs();
          }
          return;
        }

        // Handle the correct response structure
        if (response?.data?.limitedSubCategoryData && Array.isArray(response.data.limitedSubCategoryData)) {
          const transformedData = response.data.limitedSubCategoryData.map((item: any) => ({
            name: item.subcategoryData || item.name || 'Unknown',
            value: typeof item.count === 'string' ? parseInt(item.count) || 0 : (item.count || 0),
          })).filter((item: any) => item.value > 0);
          
          setData(transformedData);
          setShowCallLogs(false);
        } else {
          setData([]);
          setShowCallLogs(false);
        }
      } catch (err) {
        console.error('Error loading subcategory data:', err);
        setHasError(true);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [category, level, breadcrumb, selectedProject, fromTime, toTime]);
  
  const colors = generateShades(category.color, data.length);
  
  const chartData = data.map((item, idx) => ({
    ...item,
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

  if (showCallLogs) {
    return <CallLogsSummary breadcrumb={breadcrumb} fromTime={fromTime} toTime={toTime} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ExceptionHandleView type="loading" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full">
        <ExceptionHandleView 
          type="500" 
          title="Error Loading Data"
          content="subcategory data"
        />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <ExceptionHandleView 
          type="204" 
          title="No Data Available"
          content="subcategory data for the selected category"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 mt-4">
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
              tick={false} 
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
