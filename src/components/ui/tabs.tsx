import * as React from "react";
import { Tabs as AntTabs } from "antd";

import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  items: { key: string; label: React.ReactNode; children: React.ReactNode }[];
  setItems: React.Dispatch<React.SetStateAction<{ key: string; label: React.ReactNode; children: React.ReactNode }[]>>;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const Tabs = ({ children, value: controlledValue, defaultValue, onValueChange, className, orientation }: TabsProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const [items, setItems] = React.useState<{ key: string; label: React.ReactNode; children: React.ReactNode }[]>([]);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const handleValueChange = (val: string) => {
    setInternalValue(val);
    onValueChange?.(val);
  };
  
  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange, items, setItems }}>
      <div className={cn(className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    
    return (
      <AntTabs
        activeKey={context?.value}
        onChange={context?.onValueChange}
        items={context?.items || []}
        className={cn(className)}
      />
    );
  }
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, disabled, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    
    React.useEffect(() => {
      if (context) {
        context.setItems(prev => {
          const exists = prev.some(item => item.key === value);
          if (!exists) {
            return [...prev, { key: value, label: children, children: null }];
          }
          return prev.map(item => item.key === value ? { ...item, label: children } : item);
        });
      }
    }, [value, children, context]);
    
    return null;
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    
    React.useEffect(() => {
      if (context) {
        context.setItems(prev => {
          return prev.map(item => item.key === value ? { ...item, children } : item);
        });
      }
    }, [value, children, context]);
    
    if (context?.value !== value) return null;
    
    return (
      <div ref={ref} className={cn("mt-2", className)} {...props}>
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
