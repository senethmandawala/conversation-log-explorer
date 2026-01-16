import * as React from "react";
import { Select as AntSelect } from "antd";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: React.ReactNode; disabled?: boolean }[];
  setOptions: React.Dispatch<React.SetStateAction<{ value: string; label: React.ReactNode; disabled?: boolean }[]>>;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const Select = ({ children, value: controlledValue, defaultValue, onValueChange, disabled }: SelectProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const [options, setOptions] = React.useState<{ value: string; label: React.ReactNode; disabled?: boolean }[]>([]);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const handleValueChange = (val: string) => {
    setInternalValue(val);
    onValueChange?.(val);
  };
  
  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, options, setOptions }}>
      {children}
    </SelectContext.Provider>
  );
};

const SelectGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = React.useContext(SelectContext);
  const selectedOption = context?.options.find(opt => opt.value === context.value);
  return <span>{selectedOption?.label || placeholder}</span>;
};

const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    
    return (
      <AntSelect
        ref={ref as any}
        value={context?.value || undefined}
        onChange={(val) => context?.onValueChange(val as string)}
        options={context?.options}
        className={cn("w-full", className)}
        suffixIcon={<IconChevronDown className="h-4 w-4 opacity-50" />}
      />
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;

const SelectContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <>{children}</>;
};

const SelectLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
  )
);
SelectLabel.displayName = "SelectLabel";

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, disabled, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    
    React.useEffect(() => {
      if (context) {
        context.setOptions(prev => {
          const exists = prev.some(opt => opt.value === value);
          if (!exists) {
            return [...prev, { value, label: children, disabled }];
          }
          return prev;
        });
      }
    }, [value, children, disabled, context]);
    
    return null;
  }
);
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
  )
);
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
