import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, X, Search } from "lucide-react";
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
            "w-full justify-between h-10 text-sm font-normal rounded-xl transition-all duration-200",
            "border-border/60 hover:border-primary/50 hover:bg-primary/5",
            hasSelection && "border-primary/50 bg-primary/5 shadow-sm",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="truncate">
            {hasSelection ? (
              <span className="flex items-center gap-1.5">
                <span className="truncate max-w-[100px] font-medium">{selectedValue}</span>
                <AnimatePresence>
                  {plusCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 font-medium"
                    >
                      +{plusCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            ) : (
              <span className="text-muted-foreground">{label}</span>
            )}
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <AnimatePresence>
              {hasSelection && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="h-5 w-5 rounded-full bg-muted hover:bg-destructive/20 hover:text-destructive flex items-center justify-center transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                >
                  <X className="h-3 w-3" />
                </motion.button>
              )}
            </AnimatePresence>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-0 bg-popover/95 backdrop-blur-lg border-border/50 shadow-lg rounded-xl overflow-hidden" 
        align="start"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
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
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 pl-9 pr-9 rounded-lg bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted-foreground/20 hover:bg-destructive/20 hover:text-destructive flex items-center justify-center transition-colors"
            >
              <X className="h-3 w-3" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <Button 
        onClick={onApply} 
        className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md" 
        size="sm"
      >
        Apply Filter
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
    <div className="p-2 max-h-64 overflow-auto custom-scrollbar">
      {options.length === 0 ? (
        <div className="py-6 text-center text-muted-foreground text-sm">
          No options available
        </div>
      ) : (
        options.map((option, index) => {
          const isSelected = selected.includes(option.value);
          return (
            <motion.label
              key={option.value}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                isSelected 
                  ? "bg-primary/10 hover:bg-primary/15" 
                  : "hover:bg-muted"
              )}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleOption(option.value)}
                className={cn(
                  "transition-all duration-200",
                  "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                )}
              />
              <span className={cn(
                "text-sm transition-colors",
                isSelected && "font-medium text-primary"
              )}>
                {option.label}
              </span>
            </motion.label>
          );
        })
      )}
    </div>
  );
}
