import { useState, useEffect, useMemo } from 'react';
import { getColumnDefinitions, getColumnDefinitionsCallInsight, getColumnDefinitionsAutopilot, ColumnDefinition } from '@/utils/envConfig';

export type ColumnConfigType = 'agent' | 'callInsight' | 'autopilot';

export interface UseColumnConfigReturn {
  columns: ColumnDefinition[];
  visibleColumns: ColumnDefinition[];
  toggleColumnVisibility: (def: string) => void;
  isColumnVisible: (def: string) => boolean;
  resetToDefault: () => void;
}

export const useColumnConfig = (type: ColumnConfigType): UseColumnConfigReturn => {
  const getInitialColumns = () => {
    switch (type) {
      case 'agent':
        return getColumnDefinitions();
      case 'callInsight':
        return getColumnDefinitionsCallInsight();
      case 'autopilot':
        return getColumnDefinitionsAutopilot();
      default:
        return [];
    }
  };

  const [columns, setColumns] = useState<ColumnDefinition[]>(getInitialColumns);

  // Update columns when env config changes
  useEffect(() => {
    setColumns(getInitialColumns());
  }, [type]);

  const visibleColumns = useMemo(() => {
    return columns.filter(col => col.visible);
  }, [columns]);

  const toggleColumnVisibility = (def: string) => {
    setColumns(prev => 
      prev.map(col => 
        col.def === def && col.checkboxVisible 
          ? { ...col, visible: !col.visible }
          : col
      )
    );
  };

  const isColumnVisible = (def: string): boolean => {
    const col = columns.find(c => c.def === def);
    return col?.visible ?? false;
  };

  const resetToDefault = () => {
    setColumns(getInitialColumns());
  };

  return {
    columns,
    visibleColumns,
    toggleColumnVisibility,
    isColumnVisible,
    resetToDefault,
  };
};

export default useColumnConfig;
