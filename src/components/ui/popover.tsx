import * as React from "react";
import { Popover as AntPopover } from "antd";

import { cn } from "@/lib/utils";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

const Popover = ({ children, open: controlledOpen, onOpenChange }: { 
  children: React.ReactNode; 
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [content, setContent] = React.useState<React.ReactNode>(null);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  
  return (
    <PopoverContext.Provider value={{ open, setOpen, content, setContent }}>
      {children}
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild, ...props }, ref) => {
    const context = React.useContext(PopoverContext);
    
    const trigger = asChild && React.isValidElement(children) 
      ? React.cloneElement(children as React.ReactElement<any>, { ref, ...props })
      : <span ref={ref as any} {...props}>{children}</span>;
    
    if (context?.content) {
      return (
        <AntPopover 
          content={context.content} 
          open={context.open}
          onOpenChange={context.setOpen}
          trigger="click"
        >
          {trigger}
        </AntPopover>
      );
    }
    
    return trigger;
  }
);
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = ({ className, children, align, sideOffset, ...props }: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" | "end"; sideOffset?: number }) => {
  const context = React.useContext(PopoverContext);
  
  React.useEffect(() => {
    if (context) {
      context.setContent(
        <div className={cn("w-72 p-4", className)} {...props}>
          {children}
        </div>
      );
    }
  }, [children, className, context]);
  
  return null;
};

export { Popover, PopoverTrigger, PopoverContent };
