import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for performance trend
const generateMockTrendData = (metric: string) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    let value = 0;
    if (metric === "dropped_calls") {
      value = Math.floor(Math.random() * 20) + 30;
    } else if (metric === "package_churn") {
      value = Math.random() * 10 + 5;
    } else if (metric === "open_calls") {
      value = Math.floor(Math.random() * 15) + 10;
    } else if (metric === "avg_silent_time") {
      value = Math.random() * 5 + 3;
    } else if (metric === "avg_waiting_time") {
      value = Math.random() * 8 + 8;
    }
    
    dates.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: parseFloat(value.toFixed(2))
    });
  }
  
  return dates;
};

interface PerformanceTrendProps {
  selectedAgent: string;
  selectedAgentId: number;
  selectedMetric: string;
}

export default function PerformanceTrend({ selectedAgent, selectedAgentId, selectedMetric }: PerformanceTrendProps) {
  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    setErrorLoading(false);
    
    // Simulate loading
    setTimeout(() => {
      const data = generateMockTrendData(selectedMetric);
      setTrendData(data);
      setLoading(false);
    }, 800);
  }, [selectedAgent, selectedAgentId, selectedMetric]);

  const formatValue = (value: number) => {
    if (selectedMetric === "package_churn") {
      return `${value.toFixed(2)}%`;
    } else if (selectedMetric.includes("time")) {
      return `${value.toFixed(2)}s`;
    }
    return value.toString();
  };

  const getMetricLabel = () => {
    const labels: Record<string, string> = {
      dropped_calls: "Dropped Calls",
      package_churn: "Package Churn",
      open_calls: "Open Calls",
      avg_silent_time: "Avg. Silence Time",
      avg_waiting_time: "Avg. Waiting Time",
    };
    return labels[selectedMetric] || selectedMetric;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorLoading) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Error loading trend data</p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  if (trendData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No data available</p>
          <p className="text-sm">No trend data found for this agent</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            label={{
              value: getMetricLabel(),
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fontWeight: 600, fill: "hsl(var(--foreground))" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            formatter={(value: number) => [formatValue(value), getMetricLabel()]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 0, fill: "#8b5cf6" }}
            activeDot={{ r: 6 }}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
