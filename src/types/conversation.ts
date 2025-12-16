export interface ConversationRecord {
  id: string;
  date: string;
  time: string;
  msisdn: string;
  category: string;
  subCategory: string | null;
  resolution: string;
  callDisReason: string;
  uniqueID: string;
  summary: string;
  channel: string;
  department: string | null;
  city: string | null;
  vdn: string | null;
  vdnSource: string | null;
  duration: string;
  agentId?: string;
  agentName?: string;
  status?: string;
}

export interface FilterState {
  searchKey: string;
  vdnKey: string;
  msisdnKey: string;
  uniqueIdKey: string;
  selectedVdnSources: string[];
  selectedCallTypes: string[];
  selectedCategories: string[];
  selectedSubCategories: string[];
  dateRange: DateRangeValue | null;
}

export interface DateRangeValue {
  type: string;
  from: Date | null;
  to: Date | null;
  displayValue: string;
}

export interface ColumnDefinition {
  id: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
}
