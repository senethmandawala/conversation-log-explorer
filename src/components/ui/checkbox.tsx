import * as React from "react";
import { Checkbox as AntCheckbox } from "antd";

import { cn } from "@/lib/utils";

interface CheckboxProps {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, ...props }, ref) => (
    <AntCheckbox
      ref={ref as any}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
      className={cn(className)}
    />
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
