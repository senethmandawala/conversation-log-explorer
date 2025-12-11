import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
  label: string;
  selectedValue?: string;
  plusCount?: number;
  onClear: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function FilterDropdown({
  label,
  selectedValue,
  plusCount = 0,
  onClear,
  children,
  disabled = false,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const hasSelection = !!selectedValue;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-9 text-sm font-normal",
            hasSelection && "border-primary/50 bg-primary/5"
          )}
        >
          <span className="truncate">
            {hasSelection ? (
              <span className="flex items-center gap-1">
                <span className="truncate max-w-[100px]">{selectedValue}</span>
                {plusCount > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground rounded px-1">
                    +{plusCount}
                  </span>
                )}
              </span>
            ) : (
              label
            )}
          </span>
          <div className="flex items-center gap-1 ml-2">
            {hasSelection && (
              <X
                className="h-3 w-3 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
              />
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 bg-popover" align="start">
        {children}
      </PopoverContent>
    </Popover>
  );
}

interface TextFilterContentProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function TextFilterContent({
  label,
  value,
  onChange,
  onApply,
  onClear,
}: TextFilterContentProps) {
  return (
    <div className="p-3 space-y-3">
      <div className="relative">
        <Input
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 pr-8"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button onClick={onApply} className="w-full h-8" size="sm">
        Apply
      </Button>
    </div>
  );
}

interface MultiSelectContentProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiSelectContent({
  options,
  selected,
  onChange,
}: MultiSelectContentProps) {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="p-2 max-h-60 overflow-auto">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
        >
          <Checkbox
            checked={selected.includes(option.value)}
            onCheckedChange={() => toggleOption(option.value)}
          />
          <span className="text-sm">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
