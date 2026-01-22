import { useState, useEffect, useRef, useCallback } from "react";
import { IconPhone, IconRefresh, IconEye, IconInfoCircle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import ExceptionHandleView from "@/components/ui/ExceptionHandleView";
import type { DateRangeObject } from "@/components/common/DatePicker/DatePicker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import { Typography } from "antd";
import { callRoutingApiService } from "@/services/callRoutingApiService";
import { useProjectSelection } from "@/services/projectSelectionService";
import { useDate } from "@/contexts/DateContext";

const { Title } = Typography;

interface FrequentCallerData {
  msisdn: string;
  callCount: number;
}

const PURPLE_GRADIENT_COLORS = [
  "#311B92",
  "#4527A0",
  "#512DA8",
  "#5E35B1",
  "#673AB7",
  "#7E57C2",
  "#9575CD",
  "#B39DDB",
  "#D1C4E9",
  "#EDE7F6",
];

const getAdjustedColors = (data: FrequentCallerData[]) => {
  let colorIndex = 0;

  return data.map((item, index) => {
    if (index === 0) return PURPLE_GRADIENT_COLORS[0];

    if (item.callCount !== data[index - 1].callCount) {
      colorIndex++;
    }

    return PURPLE_GRADIENT_COLORS[
      Math.min(colorIndex, PURPLE_GRADIENT_COLORS.length - 1)
    ];
  });
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="z-50 rounded-lg border bg-card px-4 py-2.5 text-sm shadow-xl">
      <p className="font-medium mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: payload[0].color }}
        />
        <span>Call Count: {payload[0].value}</span>
      </div>
    </div>
  );
};

export default function FrequentCallersReport() {
  const { selectedProject } = useProjectSelection();
  const { globalDateRange } = useDate();

  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [chartData, setChartData] = useState<FrequentCallerData[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeObject | null>(null);
  const [localDateRange, setLocalDateRange] = useState<DateRangeObject | null>(null);

  // Use local date range if user has set it, otherwise use global
  const effectiveDateRange = localDateRange || globalDateRange || dateRange;
  
  // Force new reference when global date range changes to trigger DatePickerComponent update
  const dateInputForPicker = effectiveDateRange ? { ...effectiveDateRange } : null;

  // Reactive state management
  const destroyRef = useRef(false);
  const manualRefreshRef = useRef<SimpleSubject<any>>(new SimpleSubject<any>());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced refresh function
  const debouncedRefresh = useCallback((overrideDateRange?: DateRangeObject) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (selectedProject && !destroyRef.current) {
        loadData(overrideDateRange);
      }
    }, 300);
  }, [selectedProject]);

  // Watch for global date range changes (from ModuleTabs.tsx)
  useEffect(() => {
    if (destroyRef.current) return;

    // If global date range changes, clear local selection to allow global to take precedence
    if (globalDateRange) {
      setLocalDateRange(null); // Clear local selection
      // Trigger refresh with global date range
      manualRefreshRef.current.next(globalDateRange);
    }
  }, [globalDateRange]);

  // Combine date and project changes
  useEffect(() => {
    if (destroyRef.current) return;

    if (effectiveDateRange && selectedProject) {
      // Trigger refresh through the unified debounced stream
      manualRefreshRef.current.next(effectiveDateRange);
    }
  }, [effectiveDateRange, selectedProject]);

  // Single debounced stream for ALL refresh triggers
  useEffect(() => {
    const subscription = manualRefreshRef.current.subscribe((dateRange) => {
      // Use the date range passed through the Subject
      debouncedRefresh(dateRange);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [debouncedRefresh]);

  // Initial data and API trigger effect
  useEffect(() => {
    if (destroyRef.current) return;

    // Always set loading state when component mounts or dependencies change
    if (selectedProject && effectiveDateRange) {
      // Trigger API call for fresh data
      manualRefreshRef.current.next(effectiveDateRange);
    } else {
      // Set loading to true while waiting for dependencies
      if (!selectedProject || !effectiveDateRange) {
        setLoading(true);
      }
    }
  }, [selectedProject, effectiveDateRange]);

  // Cleanup
  useEffect(() => {
    return () => {
      destroyRef.current = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const loadData = async (range?: DateRangeObject) => {
    const dateRangeToUse = range || effectiveDateRange;
    if (!selectedProject || !dateRangeToUse) return;

    setLoading(true);
    setHasError(false);

    try {
      const filters = {
        tenantId: Number(selectedProject.tenant_id),
        subtenantId: Number(selectedProject.sub_tenant_id),
        companyId: Number(selectedProject.company_id),
        departmentId: Number(selectedProject.department_id),
        fromTime: dateRangeToUse.fromDate,
        toTime: dateRangeToUse.toDate,
      };

      const response = await callRoutingApiService.FrequentCallers(filters);

      const apiData = response?.data;

      if (Array.isArray(apiData) && apiData.length > 0) {
        setChartData(apiData);
        setColors(getAdjustedColors(apiData));
      } else {
        setChartData([]);
      }

      setLoading(false);
    } catch (error) {
      setHasError(true);
      setChartData([]);
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range: DateRangeObject) => {
    setLocalDateRange(range);
  };

  const handleReload = () => {
    // Only reload if we have a date range and project
    if (effectiveDateRange && selectedProject) {
      manualRefreshRef.current.next(effectiveDateRange);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 ml-5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <IconPhone />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Title level={4} className="!m-0">
                  Frequent Callers
                </Title>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconInfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Top callers by call frequency
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">
                {effectiveDateRange?.dateRangeForDisplay || "Select a date range"}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <DatePickerComponent
              onSelectedRangeValueChange={handleDateRangeChange}
              toolTipValue="Select date range for frequent callers"
              calenderType=""
              dateInput={dateInputForPicker}
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReload}
                    disabled={loading || !effectiveDateRange}
                    className="h-10 w-10 rounded-xl"
                  >
                    <IconRefresh className={cn(loading && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reload data</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
                    <IconEye />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View list</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* CHART */}
        {loading ? (
          <ExceptionHandleView type="loading" />
        ) : hasError ? (
          <ExceptionHandleView
            type="500"
            title="Error Loading Data"
            content="frequent callers"
            onTryAgain={handleReload}
          />
        ) : chartData.length === 0 ? (
          <ExceptionHandleView
            type="204"
            title="No Frequent Callers"
            content="frequent callers"
          />
        ) : (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="msisdn"
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <RechartsTooltip content={<CustomBarTooltip />} />
              <Bar dataKey="callCount" radius={[0, 6, 6, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// Simple Subject implementation for reactive pattern
class SimpleSubject<T> {
  private observers: ((value: T) => void)[] = [];
  
  next(value: T) {
    this.observers.forEach(observer => observer(value));
  }
  
  subscribe(observer: (value: T) => void) {
    this.observers.push(observer);
    return {
      unsubscribe: () => {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
          this.observers.splice(index, 1);
        }
      }
    };
  }
}
