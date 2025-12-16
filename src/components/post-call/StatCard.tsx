import { Card } from "@/components/ui/card";
import { Phone, CheckCircle, Clock, FolderOpen, Timer, VolumeX, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  iconColor: string;
  borderColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const iconMap: Record<string, React.ElementType> = {
  phone: Phone,
  check: CheckCircle,
  clock: Clock,
  folder: FolderOpen,
  timer: Timer,
  volume: VolumeX,
};

const colorVariants: Record<string, { bg: string; icon: string; glow: string }> = {
  blue: {
    bg: "from-blue-500/10 to-blue-600/5",
    icon: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    glow: "group-hover:shadow-blue-500/10",
  },
  green: {
    bg: "from-emerald-500/10 to-emerald-600/5",
    icon: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    glow: "group-hover:shadow-emerald-500/10",
  },
  purple: {
    bg: "from-purple-500/10 to-purple-600/5",
    icon: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    glow: "group-hover:shadow-purple-500/10",
  },
  red: {
    bg: "from-red-500/10 to-red-600/5",
    icon: "bg-red-500/15 text-red-600 dark:text-red-400",
    glow: "group-hover:shadow-red-500/10",
  },
  amber: {
    bg: "from-amber-500/10 to-amber-600/5",
    icon: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    glow: "group-hover:shadow-amber-500/10",
  },
  orange: {
    bg: "from-orange-500/10 to-orange-600/5",
    icon: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    glow: "group-hover:shadow-orange-500/10",
  },
};

const getColorKey = (iconColor: string): string => {
  if (iconColor.includes("blue")) return "blue";
  if (iconColor.includes("green")) return "green";
  if (iconColor.includes("purple")) return "purple";
  if (iconColor.includes("red")) return "red";
  if (iconColor.includes("amber")) return "amber";
  if (iconColor.includes("orange")) return "orange";
  return "blue";
};

export const StatCard = ({ title, value, icon, iconColor, trend }: StatCardProps) => {
  const Icon = iconMap[icon] || Phone;
  const colorKey = getColorKey(iconColor);
  const colors = colorVariants[colorKey];

  return (
    <Card className={`group relative overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 ${colors.glow}`}>
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50`} />
      
      {/* Content */}
      <div className="relative p-3">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg ${colors.icon} transition-transform group-hover:scale-110 duration-300`}>
            <Icon className="h-4 w-4" />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend.value}%
            </div>
          )}
        </div>
        
        <div className="mt-2 space-y-0.5">
          <motion.p 
            className="text-2xl font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {value}
          </motion.p>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
        </div>
      </div>
    </Card>
  );
};
