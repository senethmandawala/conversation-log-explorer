import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, pressed, defaultPressed, onPressedChange, onClick, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(defaultPressed || false);
    const currentPressed = pressed !== undefined ? pressed : isPressed;
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = !currentPressed;
      setIsPressed(newPressed);
      onPressedChange?.(newPressed);
      onClick?.(e);
    };
    
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={currentPressed}
        data-state={currentPressed ? "on" : "off"}
        onClick={handleClick}
        className={cn(toggleVariants({ variant, size }), currentPressed && "bg-accent text-accent-foreground", className)}
        {...props}
      />
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
