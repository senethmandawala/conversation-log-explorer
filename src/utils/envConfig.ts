// Type definitions for env configuration
export interface ColumnDefinition {
  def: string;
  label: string;
  visible: boolean;
  checkboxVisible: boolean;
}

export interface EnvConfig {
  baseUrl: string;
  websocketBaseUrl: string;
  AlternateUrl: string;
  camUrl: string;
  AutopilotSocketURL: string;
  maximumUploadedFileCount: number;
  maximumUploadedFileSize: number;
  nullWordingCategory: string;
  nullWordingOther: string;
  colors: string[];
  defaultDateRange: {
    startDate: string;
    endDate: string;
    type: string;
    dateRangeForDisplay: string;
  };
  columnHeadingsMap: Record<string, string>;
  columnDefinitions: ColumnDefinition[];
  permissions: Record<string, string>;
  languages: Array<{ code: string; name: string }>;
  columnHeadingsMapCallInsight: Record<string, string>;
  columnDefinitionsCallInsight: ColumnDefinition[];
  columnDefinitionsAutopilotConversationHistory: ColumnDefinition[];
  defaultDateRangeType: string;
  categoryTypeOptions: string[];
  subCategoryTypeOptions: string[];
  composeUrl: string;
}

// Extend Window interface
declare global {
  interface Window {
    env_vars: EnvConfig;
  }
}

// Get the environment configuration
export const getEnvConfig = (): EnvConfig => {
  return window.env_vars;
};

// Get colors from config
export const getColors = (): string[] => {
  return window.env_vars?.colors || [
    '#FB6767', '#5766BC', '#62B766', '#FBA322', '#E83B76', 
    '#3EA1F0', '#98C861', '#FB6C3E', '#24B1F1', '#D0DD52'
  ];
};

// Get column definitions for agent evaluation
export const getColumnDefinitions = (): ColumnDefinition[] => {
  return window.env_vars?.columnDefinitions || [];
};

// Get visible columns for agent evaluation
export const getVisibleColumns = (): ColumnDefinition[] => {
  return getColumnDefinitions().filter(col => col.visible);
};

// Get column definitions for call insight
export const getColumnDefinitionsCallInsight = (): ColumnDefinition[] => {
  return window.env_vars?.columnDefinitionsCallInsight || [];
};

// Get visible columns for call insight
export const getVisibleColumnsCallInsight = (): ColumnDefinition[] => {
  return getColumnDefinitionsCallInsight().filter(col => col.visible);
};

// Get column definitions for autopilot conversation history
export const getColumnDefinitionsAutopilot = (): ColumnDefinition[] => {
  return window.env_vars?.columnDefinitionsAutopilotConversationHistory || [];
};

// Get visible columns for autopilot
export const getVisibleColumnsAutopilot = (): ColumnDefinition[] => {
  return getColumnDefinitionsAutopilot().filter(col => col.visible);
};

// Get column heading map
export const getColumnHeadingsMap = (): Record<string, string> => {
  return window.env_vars?.columnHeadingsMap || {};
};

// Get column heading map for call insight
export const getColumnHeadingsMapCallInsight = (): Record<string, string> => {
  return window.env_vars?.columnHeadingsMapCallInsight || {};
};

// Get default date range
export const getDefaultDateRange = () => {
  return window.env_vars?.defaultDateRange || {
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    type: 'Today',
    dateRangeForDisplay: 'Today'
  };
};

// Get permissions
export const getPermissions = (): Record<string, string> => {
  return window.env_vars?.permissions || {};
};

// Check if user has permission
export const hasPermission = (permissionKey: string): boolean => {
  const permissions = getPermissions();
  // For now, return true - implement actual permission check when auth is integrated
  return !!permissions[permissionKey];
};

// Get languages
export const getLanguages = () => {
  return window.env_vars?.languages || [];
};

// Get base URL
export const getBaseUrl = (): string => {
  return window.env_vars?.baseUrl || 'http://localhost:3009';
};

// Get websocket URL
export const getWebsocketUrl = (): string => {
  return window.env_vars?.websocketBaseUrl || 'ws://localhost:3009';
};
