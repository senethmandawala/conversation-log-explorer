export interface DateRangeObject {
  fromDate: string;
  toDate: string;
  type: string;
  fromDateWithoutTransform: Date;
  toDateWithoutTransform: Date;
  dateRangeForDisplay: string;
  selectedRangeValue: any;
  fromDateForDisplay: string;
  toDateForDisplay: string;
}

export interface DatePickerProps {
  selectedOption?: string | null;
  toolTipValue?: string | null;
  calenderType?: string;
  limitCalender?: string;
  selectedRangeValue?: any;
  dateInput?: DateRangeObject;
  onSelectedRangeValueChange?: (dateRange: DateRangeObject) => void;
  size?: 'small' | 'middle' | 'large';
}
