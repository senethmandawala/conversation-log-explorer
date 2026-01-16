import * as React from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { IconCheck, IconChevronRight, IconCircle } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface ContextMenuContextValue {
  items: MenuProps["items"];
  setItems: React.Dispatch<React.SetStateAction<MenuProps["items"]>>;
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(null);

const ContextMenu = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = React.useState<MenuProps["items"]>([]);
  
  return (
    <ContextMenuContext.Provider value={{ items, setItems }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

const ContextMenuTrigger = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild, ...props }, ref) => {
    const context = React.useContext(ContextMenuContext);
    
    const trigger = asChild && React.isValidElement(children) 
      ? React.cloneElement(children as React.ReactElement<any>, { ref, ...props })
      : <span ref={ref as any} {...props}>{children}</span>;
    
    return (
      <Dropdown menu={{ items: context?.items || [] }} trigger={["contextMenu"]}>
        {trigger}
      </Dropdown>
    );
  }
);
ContextMenuTrigger.displayName = "ContextMenuTrigger";

const ContextMenuGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ContextMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ContextMenuSub = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ContextMenuRadioGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const ContextMenuSubTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <IconChevronRight className="ml-auto h-4 w-4" />
    </div>
  )
);
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

const ContextMenuSubContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        className,
      )}
      {...props}
    />
  )
);
ContextMenuSubContent.displayName = "ContextMenuSubContent";

const ContextMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(ContextMenuContext);
    
    React.useEffect(() => {
      const items: MenuProps["items"] = [];
      React.Children.forEach(children, (child, index) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as any;
          if (child.type === ContextMenuItem) {
            items.push({
              key: index,
              label: childProps.children,
              onClick: childProps.onClick,
              disabled: childProps.disabled,
            });
          } else if (child.type === ContextMenuSeparator) {
            items.push({ type: "divider", key: `divider-${index}` });
          } else if (child.type === ContextMenuLabel) {
            items.push({
              key: `label-${index}`,
              label: childProps.children,
              type: "group",
            });
          }
        }
      });
      context?.setItems(items);
    }, [children, context]);
    
    return null;
  }
);
ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean; disabled?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  )
);
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuCheckboxItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { checked?: boolean }>(
  ({ className, children, checked, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <IconCheck className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
);
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

const ContextMenuRadioItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: string }>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <IconCircle className="h-2 w-2 fill-current" />
      </span>
      {children}
    </div>
  )
);
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

const ContextMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
      {...props}
    />
  )
);
ContextMenuLabel.displayName = "ContextMenuLabel";

const ContextMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
  )
);
ContextMenuSeparator.displayName = "ContextMenuSeparator";

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
