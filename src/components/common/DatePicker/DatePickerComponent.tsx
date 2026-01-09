import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Radio, Space, Typography, Divider, Tag, Tooltip } from 'antd';
import { CalendarOutlined, LeftOutlined, RightOutlined, ClockCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { DatePickerProps, DateRangeObject } from './DatePicker';
import dayjs from 'dayjs';

const { Text } = Typography;

// Enhanced Custom Calendar Component
const CustomCalendar: React.FC<{
  fromDate: dayjs.Dayjs | null;
  toDate: dayjs.Dayjs | null;
  onFromDateSelect: (date: dayjs.Dayjs) => void;
  onToDateSelect: (date: dayjs.Dayjs) => void;
  disabledDate?: (date: dayjs.Dayjs) => boolean;
  selectionMode: 'from' | 'to';
}> = ({ fromDate, toDate, onFromDateSelect, onToDateSelect, disabledDate, selectionMode }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  
  const getDaysInMonth = (date: dayjs.Dayjs) => {
    return date.daysInMonth();
  };
  
  const getFirstDayOfMonth = (date: dayjs.Dayjs) => {
    return date.startOf('month').day();
  };
  
  const isDateInRange = (date: dayjs.Dayjs) => {
    if (!fromDate || !toDate) return false;
    const start = fromDate.isBefore(toDate) ? fromDate : toDate;
    const end = fromDate.isBefore(toDate) ? toDate : fromDate;
    return date.isAfter(start) && date.isBefore(end);
  };

  const isFromDate = (date: dayjs.Dayjs) => fromDate?.isSame(date, 'day');
  const isToDate = (date: dayjs.Dayjs) => toDate?.isSame(date, 'day');
  const isToday = (date: dayjs.Dayjs) => date.isSame(dayjs(), 'day');
  
  const handleDateClick = (date: dayjs.Dayjs) => {
    if (selectionMode === 'from') {
      onFromDateSelect(date);
    } else {
      onToDateSelect(date);
    }
  };
  
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-9 w-9" />
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = currentMonth.date(day);
      const isFrom = isFromDate(date);
      const isTo = isToDate(date);
      const inRange = isDateInRange(date);
      const isDisabled = disabledDate?.(date);
      const isTodayDate = isToday(date);
      
      days.push(
        <div
          key={day}
          className={`
            h-6 w-6 flex items-center justify-center text-xs cursor-pointer rounded transition-all duration-200
            ${isFrom || isTo ? 'bg-primary text-white font-semibold shadow-sm' : ''}
            ${inRange && !isFrom && !isTo ? 'bg-primary/15 text-primary' : ''}
            ${!isFrom && !isTo && !inRange && isTodayDate ? 'ring-1 ring-primary/30 font-medium' : ''}
            ${isDisabled ? 'text-muted-foreground/40 cursor-not-allowed' : ''}
            ${!isFrom && !isTo && !inRange && !isDisabled ? 'hover:bg-accent hover:text-accent-foreground' : ''}
          `}
          onClick={() => !isDisabled && handleDateClick(date)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => prev.add(direction === 'prev' ? -1 : 1, 'month'));
  };
  
  return (
    <div className="w-full" style={{ fontFamily: 'Geist, sans-serif' }}>
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-2 px-1">
        <button 
          className="h-6 w-6 flex items-center justify-center rounded hover:bg-accent transition-colors"
          onClick={() => changeMonth('prev')}
        >
          <LeftOutlined className="text-xs text-muted-foreground" />
        </button>
        <Text className="font-medium text-sm">{currentMonth.format('MMM YYYY')}</Text>
        <button 
          className="h-6 w-6 flex items-center justify-center rounded hover:bg-accent transition-colors"
          onClick={() => changeMonth('next')}
        >
          <RightOutlined className="text-xs text-muted-foreground" />
        </button>
      </div>
      
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div 
            key={day} 
            className="h-6 w-6 flex items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {generateCalendarDays()}
      </div>
    </div>
  );
};

// Date Selection Card Component
const DateSelectionCard: React.FC<{
  label: string;
  date: dayjs.Dayjs | null;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, date, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`
      flex-1 p-2 rounded-lg cursor-pointer transition-all duration-200 border
      ${isActive 
        ? 'border-primary bg-primary/5 shadow-sm' 
        : 'border-border hover:border-primary/50 bg-card'
      }
    `}
    style={{ fontFamily: 'Geist, sans-serif' }}
  >
    <div className="flex items-center gap-1 mb-1">
      <CalendarOutlined className={`text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
      <Text className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
        {label}
      </Text>
    </div>
    <Text className={`text-xs font-semibold ${date ? '' : 'text-muted-foreground'}`}>
      {date ? date.format('MMM DD') : 'Select date'}
    </Text>
  </div>
);

const DatePicker: React.FC<DatePickerProps> = ({
  selectedOption: initialSelectedOption = null,
  toolTipValue = null,
  calenderType = '',
  limitCalender = '',
  selectedRangeValue: initialSelectedRangeValue,
  dateInput,
  onSelectedRangeValueChange
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(initialSelectedOption || 'Today');
  const [customCalendar, setCustomCalendar] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);
  const [selectionMode, setSelectionMode] = useState<'from' | 'to'>('from');
  const [dateOutput, setDateOutput] = useState<DateRangeObject | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize with Today range on first run
  useEffect(() => {
    if (!dateInput && !dateOutput) {
      handlePresetSelection('Today');
    }
  }, []);

  // Utility functions
  const formatDateToString = (date: Date): string => {
    return dayjs(date).format('YYYY-MM-DD');
  };

  const isAfterNinetyDaysAgo = (dateToCheck: Date): boolean => {
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    threeMonthsAgo.setHours(0, 0, 0, 0);
    const candidate = new Date(dateToCheck);
    candidate.setHours(0, 0, 0, 0);
    return candidate >= threeMonthsAgo && candidate <= today;
  };

  const createDateRange = (startDate: Date, endDate: Date, type: string): DateRangeObject => {
    const formattedStartDate = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndDate = dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss');
    const dateRangeForDisplay = formatDateToString(startDate) === formatDateToString(endDate) 
      ? formatDateToString(startDate) 
      : `${formatDateToString(startDate)} - ${formatDateToString(endDate)}`;

    return {
      fromDate: formattedStartDate,
      toDate: formattedEndDate,
      type,
      fromDateWithoutTransform: startDate,
      toDateWithoutTransform: endDate,
      dateRangeForDisplay,
      selectedRangeValue: { start: startDate, end: endDate },
      fromDateForDisplay: formatDateToString(startDate),
      toDateForDisplay: formatDateToString(endDate),
    };
  };

  // Initialize based on calendar type
  useEffect(() => {
    if (calenderType === 'week') {
      setSelectedOption('This Week');
      const currentDate = new Date();
      const dayOfWeek = currentDate.getDay();
      const startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
      endDate.setHours(23, 59, 59, 999);

      const dateRange = createDateRange(startDate, endDate, 'This Week');
      setDateOutput(dateRange);
      onSelectedRangeValueChange?.(dateRange);
    } else if (calenderType === 'month') {
      setSelectedOption('This Month');
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const dateRange = createDateRange(startDate, endDate, 'This Month');
      setDateOutput(dateRange);
      onSelectedRangeValueChange?.(dateRange);
    } else {
      // Default to Today
      setSelectedOption('Today');
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(currentDate);
      endDate.setHours(23, 59, 59, 999);

      const dateRange = createDateRange(startDate, endDate, 'Today');
      setDateOutput(dateRange);
      onSelectedRangeValueChange?.(dateRange);
    }
  }, [calenderType]);

  // Handle date input changes
  useEffect(() => {
    if (dateInput) {
      setSelectedOption(dateInput.type);
      if (dateInput.fromDateWithoutTransform && dateInput.toDateWithoutTransform) {
        setFromDate(dayjs(dateInput.fromDateWithoutTransform));
        setToDate(dayjs(dateInput.toDateWithoutTransform));
      }
      setDateOutput(dateInput);
    }
  }, [dateInput]);

  const toggleCalendar = (value: string) => {
    setSelectedOption(value);
    if (value === 'Custom') {
      setCustomCalendar(true);
      setFromDate(null);
      setToDate(null);
      setSelectionMode('from');
    } else {
      setCustomCalendar(false);
      handlePresetSelection(value);
    }
  };

  const handlePresetSelection = (value: string) => {
    const currentDate = new Date();
    let startDate: Date = new Date();
    let endDate: Date = new Date();

    switch (value) {
      case 'Today':
        startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'This Week':
        const dayOfWeek = currentDate.getDay();
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - dayOfWeek);
        endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'Last Week':
        const lastWeekDay = currentDate.getDay();
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - (lastWeekDay + 7));
        endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() - (lastWeekDay + 1));
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'This Month':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'Last Month':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    const dateRange = createDateRange(startDate, endDate, value);
    setDateOutput(dateRange);
    setFromDate(dayjs(startDate));
    setToDate(dayjs(endDate));
    onSelectedRangeValueChange?.(dateRange);
    setIsOpen(false);
  };

  const handleFromDateSelect = (date: dayjs.Dayjs) => {
    const startOfDay = date.startOf('day');
    setFromDate(startOfDay);
    
    // Auto-switch to "to" selection mode
    setSelectionMode('to');
    
    // If toDate is before new fromDate, clear it
    if (toDate && startOfDay.isAfter(toDate)) {
      setToDate(null);
    }
  };

  const handleToDateSelect = (date: dayjs.Dayjs) => {
    const endOfDay = date.endOf('day');
    
    // If selected date is before fromDate, swap them
    if (fromDate && date.isBefore(fromDate)) {
      setToDate(fromDate.endOf('day'));
      setFromDate(date.startOf('day'));
    } else {
      setToDate(endOfDay);
    }
  };

  const applyCustomDate = () => {
    if (!fromDate || !toDate) {
      return;
    }

    const startDate = fromDate.toDate();
    const endDate = toDate.toDate();
    
    // Validate date range for limitCalender
    if (limitCalender === 'limitMonth') {
      const dayDifference = Math.abs((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDifference > 31) {
        console.error('Date range cannot exceed 31 days');
        return;
      }
    }

    const dateRange = createDateRange(startDate, endDate, 'Custom');
    setDateOutput(dateRange);
    onSelectedRangeValueChange?.(dateRange);
    setIsOpen(false);
  };

  const presetOptions = () => {
    if (calenderType === 'week') {
      return [
        { value: 'This Week', label: 'This Week' },
        { value: 'Last Week', label: 'Last Week' },
        { value: 'Custom', label: 'Custom' },
      ];
    } else if (calenderType === 'month') {
      return [
        { value: 'This Month', label: 'This Month' },
        { value: 'Last Month', label: 'Last Month' },
        { value: 'Custom', label: 'Custom' },
      ];
    } else {
      return [
        { value: 'Today', label: 'Today' },
        { value: 'This Week', label: 'This Week' },
        { value: 'This Month', label: 'This Month' },
        { value: 'Last Month', label: 'Last Month' },
        { value: 'Custom', label: 'Custom' },
      ];
    }
  };

  const dropdownContent = (
    <div 
      className="bg-popover border border-border rounded-xl shadow-lg overflow-hidden"
      style={{ 
        minWidth: customCalendar ? '420px' : '180px',
        fontFamily: 'Geist, sans-serif'
      }}
    >
      <div className="flex">
        {/* Preset Options Panel */}
        <div className="p-3 bg-card min-w-[160px]">
          <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Quick Select
          </Text>
          <div className="space-y-1">
            {presetOptions().map((option) => (
              <div
                key={option.value}
                onClick={() => toggleCalendar(option.value)}
                className={`
                  px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between
                  ${selectedOption === option.value 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'hover:bg-accent text-foreground'
                  }
                `}
              >
                <span className="text-xs font-medium">{option.label}</span>
                {selectedOption === option.value && (
                  <CheckOutlined className="text-xs" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Calendar Panel */}
        {customCalendar && (
          <div className="p-3 bg-background overflow-hidden">
            {/* Date Selection Cards */}
            <div className="flex gap-2 mb-3">
              <DateSelectionCard
                label="From"
                date={fromDate}
                isActive={selectionMode === 'from'}
                onClick={() => setSelectionMode('from')}
              />
              <DateSelectionCard
                label="To"
                date={toDate}
                isActive={selectionMode === 'to'}
                onClick={() => setSelectionMode('to')}
              />
            </div>

            {/* Calendar */}
            <div className="mb-3">
              <CustomCalendar
                fromDate={fromDate}
                toDate={toDate}
                onFromDateSelect={handleFromDateSelect}
                onToDateSelect={handleToDateSelect}
                selectionMode={selectionMode}
                disabledDate={(current) => !isAfterNinetyDaysAgo(current?.toDate() || new Date())}
              />
            </div>

            {/* Apply Button */}
            <Button 
              type="primary" 
              onClick={applyCustomDate}
              disabled={!fromDate || !toDate}
              block
              size="small"
              className="rounded-lg h-8 font-medium shadow-sm"
            >
              Apply Date Range
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomLeft"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Tooltip title={dateOutput?.dateRangeForDisplay || toolTipValue || 'Select date range'}>
        <div>
          <Button
            type="default"
            icon={<CalendarOutlined />}
            title={toolTipValue || dateOutput?.dateRangeForDisplay}
            className="h-10 rounded-xl border-2 hover:border-primary/50 transition-all duration-200"
          >
            <span className="ml-2 font-medium">
              {selectedOption === 'Custom' ? 'Custom' : selectedOption}
            </span>
          </Button>
        </div>
      </Tooltip>
    </Dropdown>
  );
};

export default DatePicker;
