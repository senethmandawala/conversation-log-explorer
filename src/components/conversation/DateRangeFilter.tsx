import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { IconCalendarEvent, IconX } from "@tabler/icons-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subMonths } from "date-fns";
import { DateRangeValue } from "@/types/conversation";
import { cn } from "@/lib/utils";

const DATE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'custom', label: 'Custom Range' },
];

interface DateRangeFilterProps {
  value: DateRangeValue | null;
  onChange: (value: DateRangeValue | null) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value?.type || 'this-week');
  const [customRange, setCustomRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: value?.from || undefined,
    to: value?.to || undefined,
  });

  const getDateRange = (option: string): { from: Date; to: Date } => {
    const today = new Date();
    switch (option) {
      case 'today':
        return { from: today, to: today };
      case 'yesterday':
        const yesterday = subDays(today, 1);
        return { from: yesterday, to: yesterday };
      case 'this-week':
        return { from: startOfWeek(today), to: endOfWeek(today) };
      case 'last-week':
        const lastWeekStart = startOfWeek(subDays(today, 7));
        return { from: lastWeekStart, to: endOfWeek(lastWeekStart) };
      case 'this-month':
        return { from: startOfMonth(today), to: endOfMonth(today) };
      case 'last-month':
        const lastMonth = subMonths(today, 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      default:
        return { from: today, to: today };
    }
  };

  const handleApply = () => {
    if (selectedOption === 'custom' && customRange.from && customRange.to) {
      onChange({
        type: 'custom',
        from: customRange.from,
        to: customRange.to,
        displayValue: `${format(customRange.from, 'MMM d')} - ${format(customRange.to, 'MMM d, yyyy')}`,
      });
    } else if (selectedOption !== 'custom') {
      const range = getDateRange(selectedOption);
      onChange({
        type: selectedOption,
        from: range.from,
        to: range.to,
        displayValue: DATE_OPTIONS.find(o => o.value === selectedOption)?.label || '',
      });
    }
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setSelectedOption('this-week');
    setCustomRange({ from: undefined, to: undefined });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between h-9 text-sm font-normal",
            value && "border-primary/50 bg-primary/5"
          )}
        >
          <span className="flex items-center gap-2">
            <IconCalendarEvent className="h-4 w-4" />
            <span className="truncate">{value?.displayValue || 'Date Range'}</span>
          </span>
          <div className="flex items-center gap-1 ml-2">
            {value && (
              <IconX
                className="h-3 w-3 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-popover" align="start">
        <div className="p-4 space-y-4">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {DATE_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedOption === 'custom' && (
            <div className="border-t pt-4">
              <Calendar
                mode="range"
                selected={{ from: customRange.from, to: customRange.to }}
                onSelect={(range) => setCustomRange({ from: range?.from, to: range?.to })}
                numberOfMonths={1}
                className="rounded-md"
              />
            </div>
          )}

          <Button onClick={handleApply} className="w-full">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
