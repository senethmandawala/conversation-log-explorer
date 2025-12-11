import { cn } from "@/lib/utils";

type BadgeVariant = 'success' | 'warning' | 'destructive' | 'info' | 'default';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-info/10 text-info border-info/20',
  default: 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ label, variant = 'default', size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantStyles[variant]
      )}
    >
      {label}
    </span>
  );
}

export function getResolutionVariant(resolution: string): BadgeVariant {
  switch (resolution) {
    case 'Resolved':
      return 'success';
    case 'Unresolved':
      return 'destructive';
    case 'Pending':
      return 'warning';
    case 'Transferred':
      return 'info';
    default:
      return 'default';
  }
}

export function getVdnSourceVariant(source: string | null): BadgeVariant {
  switch (source) {
    case 'Inbound':
      return 'info';
    case 'Outbound':
      return 'success';
    case 'Callback':
      return 'warning';
    default:
      return 'default';
  }
}
