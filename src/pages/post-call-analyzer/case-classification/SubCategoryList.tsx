import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import { useProjectSelection } from "@/services/projectSelectionService";
import { useDate } from "@/contexts/DateContext";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";

interface SubCategoryListProps {
  category: { name: string; color: string };
  level: 3 | 4 | 5;
  breadcrumb: string[];
  onSubCategorySelect: (subCategory: string) => void;
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

export function SubCategoryList({ category, level, breadcrumb, onSubCategorySelect }: SubCategoryListProps) {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { selectedProject } = useProjectSelection();
  const { globalDateRange } = useDate();
  const lastItem = breadcrumb[breadcrumb.length - 1];

  useEffect(() => {
    const loadData = async () => {
      if (!selectedProject || !globalDateRange || !lastItem) {
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
          fromTime: globalDateRange.fromDate,
          toTime: globalDateRange.toDate,
          category: category.name,
          subcategory: lastItem,
          limit: 10,
        };

        const response = await callRoutingApiService.CaseClassificationSubCategoryList(filters);

        // Handle the correct response structure
        if (response?.data?.limitedSubCategoryData && Array.isArray(response.data.limitedSubCategoryData)) {
          const transformedData = response.data.limitedSubCategoryData.map((item: any) => ({
            name: item.subcategoryData || item.name || 'Unknown',
            value: typeof item.count === 'string' ? parseInt(item.count) || 0 : (item.count || 0),
          })).filter((item: any) => item.value > 0);
          
          setData(transformedData);
        } else {
          setData([]);
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
  }, [category, level, breadcrumb, selectedProject, globalDateRange]);
  
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
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
            onClick={handleClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis 
              dataKey="name" 
              stroke="#666" 
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#666" 
              fontSize={11}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} cursor="pointer">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-xs text-center text-gray-500 mt-2 pt-2 border-t border-gray-100"></div>
    </div>
  );
}
