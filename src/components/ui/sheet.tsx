import * as React from "react";
import { Drawer } from "antd";
import { cva, type VariantProps } from "class-variance-authority";
import { IconX } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

type SheetWidthVariant = "default" | "tabs";

const MIN_DRAWER_WIDTH_PX = 320;

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

const Sheet = ({ children, open: controlledOpen, onOpenChange }: { 
  children: React.ReactNode; 
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

const SheetTrigger = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild, onClick, ...props }, ref) => {
    const context = React.useContext(SheetContext);
    
    const handleClick = (e: React.MouseEvent) => {
      context?.setOpen(true);
      onClick?.(e as any);
    };
    
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, { 
        ref, 
        onClick: handleClick,
        ...props 
      });
    }
    
    return <button ref={ref as any} onClick={handleClick} {...props}>{children}</button>;
  }
);
SheetTrigger.displayName = "SheetTrigger";

const SheetClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
  ({ children, asChild, onClick, ...props }, ref) => {
    const context = React.useContext(SheetContext);
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      context?.setOpen(false);
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
SheetClose.displayName = "SheetClose";

const SheetPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const SheetOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => null
);
SheetOverlay.displayName = "SheetOverlay";

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b",
        bottom: "inset-x-0 bottom-0 border-t",
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof sheetVariants> {
  widthVariant?: SheetWidthVariant;
  title?: React.ReactNode;
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "right", widthVariant = "default", title, className, children, ...props }, ref) => {
    const context = React.useContext(SheetContext);
    
    const placement = side === "left" ? "left" : side === "top" ? "top" : side === "bottom" ? "bottom" : "right";

    const [viewportWidth, setViewportWidth] = React.useState<number>(() => {
      if (typeof window === "undefined") return 0;
      return window.innerWidth;
    });

    React.useEffect(() => {
      const handleResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getDrawerWidth = () => {
      if (side !== "left" && side !== "right") return undefined;
      if (!viewportWidth) return MIN_DRAWER_WIDTH_PX;

      const isDesktop = viewportWidth >= 1024;
      if (!isDesktop) return viewportWidth;

      const ratio = widthVariant === "tabs" ? 0.5 : 1 / 3;
      return Math.max(MIN_DRAWER_WIDTH_PX, Math.round(viewportWidth * ratio));
    };

    const getDrawerHeight = () => {
      if (side !== "top" && side !== "bottom") return undefined;
      return 378;
    };
    
    return (
      <Drawer
        open={context?.open}
        onClose={() => context?.setOpen(false)}
        placement={placement}
        title={
          <div className="w-full flex items-center justify-between gap-3">
            <div className="min-w-0">{title}</div>
            <button
              type="button"
              onClick={() => context?.setOpen(false)}
              className="h-8 w-8 rounded-md flex items-center justify-center"
              aria-label="Close"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        }
        closable={false}
        width={getDrawerWidth()}
        height={getDrawerHeight()}
        styles={{ body: { padding: 24 } }}
        className={cn(className)}
      >
        {children}
      </Drawer>
    );
  }
);
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
  )
);
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
