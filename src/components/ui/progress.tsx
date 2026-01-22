import * as React from "react";
import { Progress as AntProgress } from "antd";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      <AntProgress 
        percent={value} 
        showInfo={false}
        strokeColor="hsl(var(--primary))"
        trailColor="hsl(var(--secondary))"
        size={{ height: 16 }}
      />
    </div>
  )
);
Progress.displayName = "Progress";

export { Progress };
