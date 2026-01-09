import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Radio, TimePicker, Space, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { DatePickerProps, DateRangeObject } from './DatePicker';
import dayjs from 'dayjs';

const { Text } = Typography;

// Custom calendar component
const CustomCalendar: React.FC<{
  selectedRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  onRangeSelect: (range: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
  disabledDate?: (date: dayjs.Dayjs) => boolean;
}> = ({ selectedRange, onRangeSelect, disabledDate }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectingStart, setSelectingStart] = useState(true);
  
  const getDaysInMonth = (date: dayjs.Dayjs) => {
    return date.daysInMonth();
  };
  
  const getFirstDayOfMonth = (date: dayjs.Dayjs) => {
    return date.startOf('month').day();
  };
  
  const isDateInRange = (date: dayjs.Dayjs) => {
    if (!selectedRange || !selectedRange[0] || !selectedRange[1]) return false;
    const start = selectedRange[0].isBefore(selectedRange[1]) ? selectedRange[0] : selectedRange[1];
    const end = selectedRange[0].isBefore(selectedRange[1]) ? selectedRange[1] : selectedRange[0];
    return date.isAfter(start) && date.isBefore(end);
  };
  
  const isDateSelected = (date: dayjs.Dayjs) => {
    if (!selectedRange) return false;
    return selectedRange[0]?.isSame(date, 'day') || selectedRange[1]?.isSame(date, 'day');
  };
  
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = currentMonth.date(day);
      const isSelected = isDateSelected(date);
      const isInRange = isDateInRange(date);
      const isDisabled = disabledDate?.(date);
      
      days.push(
        <div
          key={day}
          style={{
            padding: '8px',
            textAlign: 'center',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
            backgroundColor: isSelected ? '#1677ff' : isInRange ? '#e6f7ff' : 'transparent',
            color: isSelected ? 'white' : isDisabled ? '#bfbfbf' : 'inherit',
            userSelect: 'none'
          }}
          onClick={() => !isDisabled && handleDateClick(date)}
          onMouseEnter={(e) => !isDisabled && !isSelected && !isInRange && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => !isDisabled && !isSelected && !isInRange && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  const handleDateClick = (date: dayjs.Dayjs) => {
    if (!selectedRange || !selectedRange[0]) {
      // First selection - set start date
      onRangeSelect([date, null]);
      setSelectingStart(false);
    } else if (!selectedRange[1]) {
      // Second selection - set end date
      onRangeSelect([selectedRange[0], date]);
      setSelectingStart(true);
    } else {
      // Start new range
      onRangeSelect([date, null]);
      setSelectingStart(false);
    }
  };
  
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => prev.add(direction === 'prev' ? -1 : 1, 'month'));
  };
  
  return (
    <div className="w-100">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Button 
          type="text" 
          size="small"
          onClick={() => changeMonth('prev')}
        >
          ‹
        </Button>
        <Text strong>{currentMonth.format('MMMM YYYY')}</Text>
        <Button 
          type="text" 
          size="small"
          onClick={() => changeMonth('next')}
        >
          ›
        </Button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', marginBottom: '4px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ padding: '4px', color: '#6c757d', fontSize: '12px', fontWeight: 'bold' }}>
            {day}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {generateCalendarDays()}
      </div>
      
      <div className="text-muted small mt-2">
        {selectingStart ? 'Select start date' : 'Select end date'}
      </div>
    </div>
  );
};

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
  const [selectedRange, setSelectedRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedFromTime, setSelectedFromTime] = useState<dayjs.Dayjs>(dayjs().hour(0).minute(0));
  const [selectedToTime, setSelectedToTime] = useState<dayjs.Dayjs>(dayjs().hour(23).minute(59));
  const [dateOutput, setDateOutput] = useState<DateRangeObject | null>(null);
  const [pickerContainerControl, setPickerContainerControl] = useState<'datepicker' | 'timepicker'>('datepicker');

  const maxDate = dayjs();

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
        setSelectedRange([dayjs(dateInput.fromDateWithoutTransform), dayjs(dateInput.toDateWithoutTransform)]);
        setSelectedFromTime(dayjs(dateInput.fromDateWithoutTransform));
        setSelectedToTime(dayjs(dateInput.toDateWithoutTransform));
      }
      setDateOutput(dateInput);
    }
  }, [dateInput]);

  const toggleCalendar = (value: string) => {
    setSelectedOption(value);
    if (value === 'Custom') {
      setCustomCalendar(true);
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
    onSelectedRangeValueChange?.(dateRange);
  };

  const handleDateChange = (range: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    if (!range || !range[0]) return;

    const m = range[0].toDate();
    
    if (!isAfterNinetyDaysAgo(m)) {
      return;
    }

    let newRange: [dayjs.Dayjs, dayjs.Dayjs] | null = null;

    if (calenderType && calenderType === "week") {
      let sevenDaysLater = new Date(m);
      sevenDaysLater.setDate(m.getDate() + 6);
      sevenDaysLater = new Date(sevenDaysLater.getFullYear(), sevenDaysLater.getMonth(), sevenDaysLater.getDate(), 23, 59, 59);
      newRange = [dayjs(m), dayjs(sevenDaysLater)];
    } else if (calenderType && calenderType === "month") {
      let thirtyDaysLater = new Date(m);
      thirtyDaysLater.setDate(m.getDate() + 30);
      thirtyDaysLater = new Date(thirtyDaysLater.getFullYear(), thirtyDaysLater.getMonth(), thirtyDaysLater.getDate(), 23, 59, 59);
      newRange = [dayjs(m), dayjs(thirtyDaysLater)];
    } else {
      if (!selectedRange || !selectedRange[0] || selectedRange[1]) {
        newRange = [dayjs(m), null];
      } else {
        let end = m;
        let start = selectedRange[0].toDate();
        
        if (end < start) {
          if (limitCalender && limitCalender === "limitMonth") {
            start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), selectedToTime.hour(), selectedToTime.minute(), 0);
            end = new Date(end.getFullYear(), end.getMonth(), end.getDate(), selectedFromTime.hour(), selectedFromTime.minute(), 0);

            // Calculate the difference in days
            const dayDifference = Math.abs((start.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDifference <= 30) {
              newRange = [dayjs(end), dayjs(start)];
            }
          } else {
            start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), selectedToTime.hour(), selectedToTime.minute(), 0);
            end = new Date(end.getFullYear(), end.getMonth(), end.getDate(), selectedFromTime.hour(), selectedFromTime.minute(), 0);
            newRange = [dayjs(end), dayjs(start)];
          }
        } else {
          if (limitCalender && limitCalender === "limitMonth") {
            start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), selectedFromTime.hour(), selectedFromTime.minute(), 0);
            end = new Date(end.getFullYear(), end.getMonth(), end.getDate(), selectedToTime.hour(), selectedToTime.minute(), 0);
            const dayDifference = Math.abs((start.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDifference <= 31) {
              newRange = [dayjs(start), dayjs(end)];
            }
          } else {
            start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), selectedFromTime.hour(), selectedFromTime.minute(), 0);
            end = new Date(end.getFullYear(), end.getMonth(), end.getDate(), selectedToTime.hour(), selectedToTime.minute(), 0);
            newRange = [dayjs(start), dayjs(end)];
          }
        }
      }
    }

    // Update selectedRange
    setSelectedRange(newRange);

    if (newRange && newRange[0]) {
      let endDate = newRange[1] ? dayjs(newRange[1]).format('YYYY-MM-DDTHH:mm:ss') : null;
      let startDate = dayjs(newRange[0]).format('YYYY-MM-DDTHH:mm:ss');

      let endTime = newRange[1] ? newRange[1].toDate() : newRange[0].toDate();
      let startTime = newRange[0].toDate();
      
      if (endDate == null && startDate != null) {
        startTime = new Date(m.getFullYear(), m.getMonth(), m.getDate(), selectedFromTime.hour(), selectedFromTime.minute(), 0);
        startDate = startDate.slice(0, -8) + dayjs(startTime).format('HH:mm') + ':00';

        endTime = new Date(m.getFullYear(), m.getMonth(), m.getDate(), selectedToTime.hour(), selectedToTime.minute(), 0);
        endDate = startDate.slice(0, -8) + dayjs(endTime).format('HH:mm') + ':09';
      }
      
      let fromDateDisplay = formatDateToString(startTime);
      let toDateDisplay = formatDateToString(endTime);
      let displayDate = "";
      if (fromDateDisplay == toDateDisplay) {
        displayDate = fromDateDisplay;
      } else {
        displayDate = fromDateDisplay + " - " + toDateDisplay;
      }

      let dateRange: DateRangeObject = {
        fromDate: startDate,
        toDate: endDate || startDate,
        type: "Custom",
        fromDateWithoutTransform: startTime,
        toDateWithoutTransform: endTime,
        dateRangeForDisplay: displayDate,
        selectedRangeValue: { start: startTime, end: endTime },
        fromDateForDisplay: formatDateToString(startTime),
        toDateForDisplay: formatDateToString(endTime),
      };
      setDateOutput(dateRange);
    }
  };

  const handleTimeChange = () => {
    if (dateOutput && dateOutput.fromDateWithoutTransform && dateOutput.toDateWithoutTransform) {
      const start = new Date(dateOutput.fromDateWithoutTransform);
      const end = new Date(dateOutput.toDateWithoutTransform);
      
      start.setHours(selectedFromTime.hour(), selectedFromTime.minute(), 0, 0);
      end.setHours(selectedToTime.hour(), selectedToTime.minute(), 0, 0);

      const updatedDateRange = createDateRange(start, end, 'Custom');
      setDateOutput(updatedDateRange);
    }
  };

  const applyDate = () => {
    if (dateOutput && dateOutput.fromDate && dateOutput.toDate && new Date(dateOutput.fromDate) > new Date(dateOutput.toDate)) {
      // Show error - in real app, you'd use a toast notification
      console.error('To time should be after From time.');
      return;
    }
    
    if (dateOutput) {
      onSelectedRangeValueChange?.(dateOutput);
    }
  };

  const renderRadioOptions = () => {
    if (calenderType === 'week') {
      return (
        <Radio.Group 
          value={selectedOption} 
          onChange={(e) => toggleCalendar(e.target.value)} 
          className="d-flex flex-column"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          <Radio value="This Week" className="mb-2">This Week</Radio>
          <Radio value="Last Week" className="mb-2">Last Week</Radio>
          <Radio value="Custom" className="mb-2">Custom</Radio>
        </Radio.Group>
      );
    } else if (calenderType === 'month') {
      return (
        <Radio.Group 
          value={selectedOption} 
          onChange={(e) => toggleCalendar(e.target.value)} 
          className="d-flex flex-column"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          <Radio value="This Month" className="mb-2">This Month</Radio>
          <Radio value="Last Month" className="mb-2">Last Month</Radio>
          <Radio value="Custom" className="mb-2">Custom</Radio>
        </Radio.Group>
      );
    } else {
      return (
        <Radio.Group 
          value={selectedOption} 
          onChange={(e) => toggleCalendar(e.target.value)} 
          className="d-flex flex-column"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          <Radio value="Today" className="mb-2">Today</Radio>
          <Radio value="This Week" className="mb-2">This Week</Radio>
          <Radio value="This Month" className="mb-2">This Month</Radio>
          <Radio value="Last Month" className="mb-2">Last Month</Radio>
          <Radio value="Custom" className="mb-2">Custom</Radio>
        </Radio.Group>
      );
    }
  };

  const dropdownContent = (
    <div className="shadow" style={{ 
      padding: '0px', 
      minWidth: '200px',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily: 'Geist, sans-serif'
    }}>
      <div className="d-flex flex-row" style={{ backgroundColor: '#fff' }}>
        <div className="p-3" style={{ minWidth: '200px' }}>
          {renderRadioOptions()}
        </div>

        {customCalendar && (
          <div className="flex-grow-1 p-3" style={{ backgroundColor: '#fafafa', borderLeft: '1px solid #f0f0f0' }}>
            <div className="w-100 mb-2">
              <CustomCalendar
                selectedRange={selectedRange}
                onRangeSelect={handleDateChange}
                disabledDate={(current) => !isAfterNinetyDaysAgo(current?.toDate() || new Date())}
              />
            </div>
            <div className="text-muted small mb-2">
              {calenderType === 'week' && '*Note: When a date is selected, the date range will automatically be extended to 7 days after the selected date.'}
              {calenderType === 'month' && '*Note: When a date is selected, the date range will automatically be extended to 30 days after the selected date.'}
              {calenderType !== 'week' && calenderType !== 'month' && '*Tip: Select two dates to create a range'}
            </div>

            {dateOutput && (
              <div className="mb-2">
                <Text strong>Selected Range</Text>
                <div>
                  <Text type="secondary">From: </Text>
                  {dateOutput.fromDateForDisplay} {selectedFromTime.format('hh:mm A')}
                  <br />
                  <Text type="secondary">To: </Text>
                  {dateOutput.toDateForDisplay} {selectedToTime.format('hh:mm A')}
                </div>
              </div>
            )}

            <Button type="primary" onClick={applyDate} className="w-100">
              Apply
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
    >
      <Button
        type="default"
        icon={<CalendarOutlined />}
        title={toolTipValue || dateOutput?.dateRangeForDisplay}
      >
        <span style={{ marginLeft: '8px' }}>{selectedOption}</span>
      </Button>
    </Dropdown>
  );
};

export default DatePicker;
