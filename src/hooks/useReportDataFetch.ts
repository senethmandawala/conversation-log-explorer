import { useState, useEffect, useRef, useCallback } from "react";
import { useDate } from "@/contexts/DateContext";
import { useProjectSelection } from "@/services/projectSelectionService";

interface UseReportDataFetchOptions {
  fetchFn: (filters: ReportFilters) => Promise<any>;
  transformFn?: (data: any) => any;
  initialData?: any[];
  debounceMs?: number;
}

export interface ReportFilters {
  tenantId: number;
  subtenantId: number;
  companyId: number;
  departmentId: number;
  fromTime: string;
  toTime: string;
}

interface UseReportDataFetchReturn<T> {
  data: T[];
  isLoading: boolean;
  hasData: boolean;
  hasError: boolean;
  effectiveDateRange: any;
  dateInputForPicker: any;
  handleDateRangeChange: (dateRange: any) => void;
  handleReload: () => void;
  selectedProject: any;
}

export function useReportDataFetch<T = any>({
  fetchFn,
  transformFn,
  initialData = [],
  debounceMs = 300,
}: UseReportDataFetchOptions): UseReportDataFetchReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(!!initialData.length);
  const [hasError, setHasError] = useState(false);
  const [localDateRange, setLocalDateRange] = useState<any>(null);
  
  const { globalDateRange } = useDate();
  const { selectedProject } = useProjectSelection();

  // Use local date range if user has set it, otherwise use global
  const effectiveDateRange = localDateRange || globalDateRange;
  
  // Force new reference when global date range changes to trigger DatePickerComponent update
  const dateInputForPicker = effectiveDateRange ? { ...effectiveDateRange } : null;

  // Refs for tracking state
  const isMountedRef = useRef(true);
  const hasInitialLoadRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchKeyRef = useRef<string>("");

  // Generate a unique key for this fetch to prevent duplicates
  const getFetchKey = useCallback((project: any, dateRange: any) => {
    if (!project || !dateRange) return "";
    return `${project.department_id}-${dateRange.fromDate}-${dateRange.toDate}`;
  }, []);

  // Core fetch function
  const fetchData = useCallback(async (project: any, dateRange: any, force = false) => {
    if (!isMountedRef.current || !project || !dateRange) {
      return;
    }

    const fetchKey = getFetchKey(project, dateRange);
    
    // Skip if this exact fetch was just made (prevents duplicates)
    if (!force && fetchKey === lastFetchKeyRef.current && hasInitialLoadRef.current) {
      return;
    }

    lastFetchKeyRef.current = fetchKey;
    hasInitialLoadRef.current = true;

    setIsLoading(true);
    setHasError(false);

    try {
      const tenantId = parseInt(project.tenant_id);
      const subtenantId = parseInt(project.sub_tenant_id);
      const companyId = parseInt(project.company_id);
      const departmentId = parseInt(project.department_id);

      const filters: ReportFilters = {
        tenantId,
        subtenantId,
        companyId,
        departmentId,
        fromTime: dateRange.fromDate,
        toTime: dateRange.toDate,
      };

      const response = await fetchFn(filters);

      if (!isMountedRef.current) return;

      // Transform data if a transform function is provided
      const processedData = transformFn ? transformFn(response) : response;
      
      if (Array.isArray(processedData) && processedData.length > 0) {
        setData(processedData);
        setHasData(true);
      } else {
        setData([]);
        setHasData(false);
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error('Error fetching report data:', error);
      setHasError(true);
      setData([]);
      setHasData(false);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchFn, transformFn, getFetchKey]);

  // Debounced fetch
  const debouncedFetch = useCallback((project: any, dateRange: any, force = false) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchData(project, dateRange, force);
    }, debounceMs);
  }, [fetchData, debounceMs]);

  // Handle global date range changes - clear local and trigger fetch
  useEffect(() => {
    if (!isMountedRef.current) return;

    if (globalDateRange) {
      // Clear local selection when global changes
      setLocalDateRange(null);
    }
  }, [globalDateRange]);

  // Main effect for triggering fetches - single source of truth
  useEffect(() => {
    if (!isMountedRef.current) return;

    if (selectedProject && effectiveDateRange) {
      debouncedFetch(selectedProject, effectiveDateRange);
    }
  }, [selectedProject, effectiveDateRange, debouncedFetch]);

  // Handle initial data
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData as T[]);
      setHasData(true);
      setIsLoading(false);
      hasInitialLoadRef.current = true;
    }
  }, [initialData]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handlers
  const handleDateRangeChange = useCallback((dateRange: any) => {
    setLocalDateRange(dateRange);
  }, []);

  const handleReload = useCallback(() => {
    // Force reload by clearing the last fetch key
    lastFetchKeyRef.current = "";
    if (selectedProject && effectiveDateRange) {
      fetchData(selectedProject, effectiveDateRange, true);
    }
  }, [selectedProject, effectiveDateRange, fetchData]);

  return {
    data,
    isLoading,
    hasData,
    hasError,
    effectiveDateRange,
    dateInputForPicker,
    handleDateRangeChange,
    handleReload,
    selectedProject,
  };
}
