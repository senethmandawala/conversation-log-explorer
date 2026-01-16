import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "antd";
import { IconRefresh } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { DateRangeValue } from "@/types/conversation";
import { CustomReport } from "../CustomReports";

interface CommonTreemapChartReportProps {
  customReport: CustomReport;
  selectedDateRange: DateRangeValue | null;
}

const COLORS = [
  "#0C3DBE",
  "#E57373",
  "#66BB6A",
  "#FFCA28",
  "#42A5F5",
  "#AB47BC",
  "#26A69A",
  "#FF7043",
];

// Mock data generator for treemap
const generateMockTreemapData = () => {
  return [
    { name: "Accounts", size: 450, percentage: 30.5 },
    { name: "Loans", size: 320, percentage: 21.7 },
    { name: "Cards", size: 280, percentage: 19.0 },
    { name: "Support", size: 200, percentage: 13.6 },
    { name: "Other", size: 150, percentage: 10.2 },
    { name: "Transfers", size: 75, percentage: 5.0 },
  ];
};

// Custom content renderer for treemap cells
const CustomizedContent = (props: any) => {
  const { x, y, width, height, index, name, percentage } = props;
  
  if (width < 50 || height < 30) return null;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[index % COLORS.length],
          stroke: "#fff",
          strokeWidth: 2,
        }}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize={12}
        fontWeight={600}
      >
        {percentage?.toFixed(1)}%
      </text>
    </g>
  );
};

export function CommonTreemapChartReport({ customReport, selectedDateRange }: CommonTreemapChartReportProps) {
  const [loading, setLoading] = useState(true);
  const [failedDataLoading, setFailedDataLoading] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [legendColors, setLegendColors] = useState<{ name: string; color: string }[]>([]);

  useEffect(() => {
    loadData();
  }, [customReport]);

  useEffect(() => {
    if (selectedDateRange) {
      loadData();
    }
  }, [selectedDateRange]);

  const loadData = () => {
    setLoading(true);
    setFailedDataLoading(false);
    setNoDataFound(false);

    // Simulate API call
    setTimeout(() => {
      try {
        const mockData = generateMockTreemapData();
        if (mockData.length === 0) {
          setNoDataFound(true);
        } else {
          // Create legend colors
          const colors = mockData.map((item, index) => ({
            name: item.name,
            color: COLORS[index % COLORS.length],
          }));
          setLegendColors(colors);
        }
        setChartData(mockData);
        setLoading(false);
        setFailedDataLoading(false);
      } catch (error) {
        setLoading(false);
        setFailedDataLoading(true);
      }
    }, 600);
  };

  const colSize = customReport.colSize === "12" ? "col-span-12" : "col-span-12 lg:col-span-6";

  return (
    <div className={colSize}>
      <Card className="h-full border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                {customReport.report_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {customReport.description}
              </p>
            </div>
            <Button
              type="text"
                            onClick={loadData}
              className="h-8 w-8"
              title="Reload section"
            >
              <IconRefresh className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : failedDataLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-center h-[300px]">
              <div className="text-red-500 mb-2">
                <svg className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Error loading data</p>
              <Button size="small" onClick={loadData} className="gap-1">
                <IconRefresh className="h-3 w-3" />
                Try Again
              </Button>
            </div>
          ) : noDataFound ? (
            <div className="flex flex-col items-center justify-center py-8 text-center h-[300px]">
              <p className="text-sm text-muted-foreground">No data found</p>
            </div>
          ) : (
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <Treemap
                  data={chartData}
                  dataKey="size"
                  aspectRatio={4 / 3}
                  stroke="#fff"
                  content={<CustomizedContent />}
                >
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload.length > 0) {
                        const data = payload[0].payload;
                        const colorIndex = chartData.findIndex(item => item.name === data.name);
                        const color = COLORS[colorIndex % COLORS.length];
                        return (
                          <div className="overflow-hidden rounded-md shadow-lg border-0" style={{ minWidth: 120 }}>
                            <div 
                              className="text-sm font-semibold px-3 py-2" 
                              style={{ backgroundColor: color, color: "white" }}
                            >
                              {data.name}
                            </div>
                            <div className="bg-muted px-3 py-2 text-sm space-y-0.5">
                              <div className="text-muted-foreground">Count: <span className="font-semibold text-foreground">{data.size}</span></div>
                              <div className="text-muted-foreground">Percentage: <span className="font-semibold text-foreground">{data.percentage?.toFixed(1)}%</span></div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </Treemap>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-3">
                <div className="flex flex-wrap gap-3">
                  {legendColors.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
