import * as React from "react";
import { Collapse } from "antd";
import { IconChevronDown } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface AccordionContextValue {
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  type: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

interface AccordionProps {
  children: React.ReactNode;
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  className?: string;
}

const Accordion = ({ children, type = "single", value: controlledValue, defaultValue, onValueChange, className }: AccordionProps) => {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(defaultValue || (type === "multiple" ? [] : ""));
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const handleValueChange = onValueChange || setInternalValue;
  
  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange, type }}>
      <div className={cn(className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => (
    <div ref={ref} className={cn("border-b", className)} data-value={value} {...props}>
      {children}
    </div>
  )
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    const itemValue = (props as any)["data-value"];
    
    const isOpen = context?.type === "multiple" 
      ? (context.value as string[]).includes(itemValue)
      : context?.value === itemValue;
    
    const handleClick = () => {
      if (!context) return;
      if (context.type === "multiple") {
        const currentValues = context.value as string[];
        if (currentValues.includes(itemValue)) {
          context.onValueChange(currentValues.filter(v => v !== itemValue));
        } else {
          context.onValueChange([...currentValues, itemValue]);
        }
      } else {
        context.onValueChange(context.value === itemValue ? "" : itemValue);
      }
    };
    
    return (
      <div className="flex">
        <button
          ref={ref}
          type="button"
          onClick={handleClick}
          className={cn(
            "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
            className,
          )}
          {...props}
        >
          {children}
          <IconChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
      </div>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    const itemValue = (props as any)["data-value"];
    
    const isOpen = context?.type === "multiple" 
      ? (context.value as string[]).includes(itemValue)
      : context?.value === itemValue;
    
    if (!isOpen) return null;
    
    return (
      <div ref={ref} className="overflow-hidden text-sm" {...props}>
        <div className={cn("pb-4 pt-0", className)}>{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
