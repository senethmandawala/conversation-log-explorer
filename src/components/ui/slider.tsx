import * as React from "react";
import { Slider as AntSlider } from "antd";

import { cn } from "@/lib/utils";

interface SliderProps {
  className?: string;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, disabled, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)}>
      <AntSlider
        value={value?.[0]}
        defaultValue={defaultValue?.[0]}
        onChange={(val) => onValueChange?.([val])}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
    </div>
  )
);
Slider.displayName = "Slider";

export { Slider };
