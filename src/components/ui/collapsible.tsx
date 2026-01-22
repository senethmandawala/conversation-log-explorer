import * as React from "react";
import { Collapse } from "antd";

import { cn } from "@/lib/utils";

interface CollapsibleContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

const Collapsible = ({ children, open: controlledOpen, onOpenChange, defaultOpen, className, ...props }: { 
  children: React.ReactNode; 
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
  disabled?: boolean;
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  
  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
};

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
  ({ children, asChild, onClick, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext);
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      context?.setOpen(!context.open);
      onClick?.(e);
    };
    
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, { 
        ref, 
        onClick: handleClick,
        ...props 
      });
    }
    
    return <button ref={ref} onClick={handleClick} {...props}>{children}</button>;
  }
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext);
    
    if (!context?.open) return null;
    
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    );
  }
);
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
