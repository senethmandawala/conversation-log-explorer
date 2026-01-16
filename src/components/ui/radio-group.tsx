import * as React from "react";
import { Radio } from "antd";

import { cn } from "@/lib/utils";

interface RadioGroupProps {
  className?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, defaultValue, onValueChange, disabled, children, ...props }, ref) => (
    <Radio.Group
      ref={ref as any}
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => onValueChange?.(e.target.value)}
      disabled={disabled}
      className={cn("grid gap-2", className)}
    >
      {children}
    </Radio.Group>
  )
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps {
  className?: string;
  value: string;
  disabled?: boolean;
  id?: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, disabled, ...props }, ref) => (
    <Radio
      ref={ref as any}
      value={value}
      disabled={disabled}
      className={cn(className)}
    />
  )
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
