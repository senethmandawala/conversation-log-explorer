import * as React from "react";
import { Drawer as AntDrawer } from "antd";

import { cn } from "@/lib/utils";

type DrawerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawerContext(componentName: string): DrawerContextValue {
  const ctx = React.useContext(DrawerContext);
  if (!ctx) {
    throw new Error(`${componentName} must be used within Drawer`);
  }
  return ctx;
}

type DrawerRootProps = React.PropsWithChildren<{
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  shouldScaleBackground?: boolean;
}>;

const Drawer = ({
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
}: DrawerRootProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(!!defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? !!openProp : uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  return <DrawerContext.Provider value={{ open, setOpen }}>{children}</DrawerContext.Provider>;
};
Drawer.displayName = "Drawer";

type DrawerTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { setOpen } = useDrawerContext("DrawerTrigger");
    return (
      <button
        ref={ref}
        type="button"
        className={className}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(true);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);
DrawerTrigger.displayName = "DrawerTrigger";

const DrawerPortal = ({ children }: React.PropsWithChildren) => <>{children}</>;
DrawerPortal.displayName = "DrawerPortal";

type DrawerCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { setOpen } = useDrawerContext("DrawerClose");
    return (
      <button
        ref={ref}
        type="button"
        className={className}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(false);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);
DrawerClose.displayName = "DrawerClose";

type DrawerOverlayProps = React.HTMLAttributes<HTMLDivElement>;

const DrawerOverlay = React.forwardRef<HTMLDivElement, DrawerOverlayProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
));
DrawerOverlay.displayName = "DrawerOverlay";

type DrawerContentProps = Omit<React.ComponentProps<typeof AntDrawer>, "open" | "children"> & {
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, onClose, onOpenChange, maskStyle, ...props }, ref) => {
    const { open, setOpen } = useDrawerContext("DrawerContent");

    return (
      <AntDrawer
        {...props}
        open={open}
        maskStyle={{
          backgroundColor: "transparent",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          ...maskStyle,
        }}
        onClose={(e) => {
          onClose?.(e);
          setOpen(false);
          onOpenChange?.(false);
        }}
        className={cn(className)}
      >
        <div ref={ref}>{children}</div>
      </AntDrawer>
    );
  },
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
