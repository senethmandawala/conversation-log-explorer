import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type BadgeVariant = "success" | "warning" | "destructive" | "info" | "default" | "primary";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
  default: "bg-muted text-muted-foreground border-border/50",
  primary: "bg-blue-100 text-blue-700 border-blue-300",
};

export function StatusBadge({ label, variant = "default" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200",
        variantStyles[variant]
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        variant === "success" && "bg-success",
        variant === "warning" && "bg-warning",
        variant === "destructive" && "bg-destructive",
        variant === "info" && "bg-info",
        variant === "primary" && "bg-blue-500",
        variant === "default" && "bg-muted-foreground"
      )} />
      {label}
    </span>
  );
}

export function getResolutionVariant(resolution: string): BadgeVariant {
  switch (resolution) {
    case "Success Call":
    case "Resolved":
      return "success";
    case "Abandoned Call":
    case "Failed Call":
    case "Unresolved":
      return "destructive";
    case "Transferred to Agent":
    case "Pending":
    case "Transferred":
      return "warning";
    default:
      return "default";
  }
}

export function getVdnSourceVariant(vdnSource?: string | null): BadgeVariant {
  if (!vdnSource || vdnSource === "N/A" || vdnSource.toLowerCase() === "unknown") {
    return "warning";
  }
  if (vdnSource.toLowerCase().includes("default") || vdnSource === "Inbound") {
    return "info";
  }
  if (vdnSource.toLowerCase().includes("specific") || vdnSource === "Outbound") {
    return "success";
  }
  if (vdnSource === "Callback") {
    return "warning";
  }
  return "default";
}
