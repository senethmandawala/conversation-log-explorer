import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DateRangeObject } from '@/components/common/DatePicker/DatePicker';

interface DateContextType {
  globalDateRange: DateRangeObject | null;
  setGlobalDateRange: (dateRange: DateRangeObject | null) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

interface DateProviderProps {
  children: ReactNode;
}

export function DateProvider({ children }: DateProviderProps) {
  const [globalDateRange, setGlobalDateRange] = useState<DateRangeObject | null>(null);

  return (
    <DateContext.Provider value={{ globalDateRange, setGlobalDateRange }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDate(): DateContextType {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
}
