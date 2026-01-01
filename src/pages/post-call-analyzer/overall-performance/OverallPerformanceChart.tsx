import { useState, useEffect } from "react";
import { ReportSection } from "@/components/post-call/ReportSection";
import { 
  fetchOverallPerformance, 
  type OverallPerformanceResponse 
} from "@/lib/api";

// Helper to transform API performance data to chart format (same as in PostCallDashboard)
const transformPerformanceData = (performance: OverallPerformanceResponse['overallPerformance']) => {
  const resolvedSeries = performance.series.find(s => s.name === 'Resolved');
  const failedSeries = performance.series.find(s => s.name === 'Fail Calls');
  const fulfilledSeries = performance.series.find(s => s.name === 'Fulfilled');
  
  if (!resolvedSeries) return [];
  
  return resolvedSeries.data.map((point, index) => {
    const date = new Date(point.x);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      name: dayName,
      calls: failedSeries?.data[index]?.y || 0,
      resolved: point.y,
      fulfilled: fulfilledSeries?.data[index]?.y || 0,
    };
  });
};

// Default fallback data (same as in PostCallDashboard)
const defaultPerformanceData = [
  { name: "Mon", calls: 0, resolved: 0 },
  { name: "Tue", calls: 0, resolved: 0 },
  { name: "Wed", calls: 0, resolved: 0 },
  { name: "Thu", calls: 0, resolved: 0 },
  { name: "Fri", calls: 0, resolved: 0 },
  { name: "Sat", calls: 0, resolved: 0 },
  { name: "Sun", calls: 0, resolved: 0 },
];

export default function OverallPerformanceChart() {
  const [performanceData, setPerformanceData] = useState(defaultPerformanceData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const performanceResponse = await fetchOverallPerformance();

        // Transform and set performance data (same logic as PostCallDashboard)
        if (performanceResponse?.overallPerformance) {
          const transformedData = transformPerformanceData(performanceResponse.overallPerformance);
          if (transformedData.length > 0) {
            setPerformanceData(transformedData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ReportSection
      id="performance"
      title="Overall Performance Chart"
      description="Weekly performance trends and metrics"
      hasChart={true}
      chartType="line"
      chartData={performanceData}
      hideAccentLine={true}
    />
  );
}
