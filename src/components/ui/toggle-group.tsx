import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

interface ToggleGroupContextValue extends VariantProps<typeof toggleVariants> {
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  type: "single" | "multiple";
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
  value: "",
  onValueChange: () => {},
  type: "single",
});

interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toggleVariants> {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, variant, size, type = "single", value: controlledValue, defaultValue, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(defaultValue || (type === "multiple" ? [] : ""));
    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const handleValueChange = onValueChange || setInternalValue;
    
    return (
      <div ref={ref} className={cn("flex items-center justify-center gap-1", className)} {...props}>
        <ToggleGroupContext.Provider value={{ variant, size, value, onValueChange: handleValueChange, type }}>
          {children}
        </ToggleGroupContext.Provider>
      </div>
    );
  }
);

ToggleGroup.displayName = "ToggleGroup";

interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof toggleVariants> {
  value: string;
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, children, variant, size, value, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    
    const isPressed = context.type === "multiple"
      ? (context.value as string[]).includes(value)
      : context.value === value;
    
    const handleClick = () => {
      if (context.type === "multiple") {
        const currentValues = context.value as string[];
        if (currentValues.includes(value)) {
          context.onValueChange(currentValues.filter(v => v !== value));
        } else {
          context.onValueChange([...currentValues, value]);
        }
      } else {
        context.onValueChange(context.value === value ? "" : value);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        data-state={isPressed ? "on" : "off"}
        onClick={handleClick}
        className={cn(
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
          isPressed && "bg-accent text-accent-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
