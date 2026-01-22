import * as React from "react";
import { Switch as AntSwitch } from "antd";

import { cn } from "@/lib/utils";

interface SwitchProps {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, value, name, required, ...props }, ref) => (
    <AntSwitch
      ref={ref as any}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onCheckedChange}
      disabled={disabled}
      className={cn(className)}
    />
  )
);
Switch.displayName = "Switch";

export { Switch };
