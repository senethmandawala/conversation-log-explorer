import * as React from "react";
import { Tooltip as AntTooltip } from "antd";

import { cn } from "@/lib/utils";

interface TooltipContextValue {
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
  side: "top" | "right" | "bottom" | "left";
  setSide: (side: "top" | "right" | "bottom" | "left") => void;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const Tooltip = ({ children }: { children: React.ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const [content, setContent] = React.useState<React.ReactNode>(null);
  const [side, setSide] = React.useState<"top" | "right" | "bottom" | "left">("top");
  
  return (
    <TooltipContext.Provider value={{ content, setContent, side, setSide }}>
      {children}
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild, ...props }, ref) => {
    const context = React.useContext(TooltipContext);
    
    const trigger = asChild && React.isValidElement(children) 
      ? React.cloneElement(children as React.ReactElement<any>, { ref, ...props })
      : <span ref={ref as any} {...props}>{children}</span>;
    
    if (context?.content) {
      return (
        <AntTooltip title={context.content} placement={context.side}>
          {trigger}
        </AntTooltip>
      );
    }
    
    return trigger;
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = ({ className, children, side = "top", ...props }: React.HTMLAttributes<HTMLDivElement> & { side?: "top" | "right" | "bottom" | "left"; sideOffset?: number }) => {
  const context = React.useContext(TooltipContext);
  
  React.useEffect(() => {
    if (context) {
      context.setContent(<div className={cn("text-sm", className)} {...props}>{children}</div>);
      context.setSide(side);
    }
  }, [children, className, side, context]);
  
  return null;
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
