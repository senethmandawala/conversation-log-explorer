import * as React from "react";
import { Popover } from "antd";

import { cn } from "@/lib/utils";

interface HoverCardContextValue {
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(null);

const HoverCard = ({ children, open, onOpenChange }: { 
  children: React.ReactNode; 
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
}) => {
  const [content, setContent] = React.useState<React.ReactNode>(null);
  
  return (
    <HoverCardContext.Provider value={{ content, setContent }}>
      {children}
    </HoverCardContext.Provider>
  );
};

const HoverCardTrigger = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild, ...props }, ref) => {
    const context = React.useContext(HoverCardContext);
    
    const trigger = asChild && React.isValidElement(children) 
      ? React.cloneElement(children as React.ReactElement<any>, { ref, ...props })
      : <span ref={ref as any} {...props}>{children}</span>;
    
    return (
      <Popover content={context?.content} trigger="hover">
        {trigger}
      </Popover>
    );
  }
);
HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { align?: string; sideOffset?: number }>(
  ({ className, children, align, sideOffset, ...props }, ref) => {
    const context = React.useContext(HoverCardContext);
    
    React.useEffect(() => {
      if (context) {
        context.setContent(
          <div ref={ref} className={cn("w-64 p-4", className)} {...props}>
            {children}
          </div>
        );
      }
    }, [children, className, context, ref, props]);
    
    return null;
  }
);
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
