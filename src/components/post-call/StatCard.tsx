import { Card } from "@/components/ui/card";
import { Phone, CheckCircle, Clock, FolderOpen, Timer, VolumeX, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  iconColor: string;
  borderColor: string;
}

const iconMap: Record<string, React.ReactNode> = {
  phone: <Phone className="h-4 w-4" />,
  check: <CheckCircle className="h-4 w-4" />,
  clock: <Clock className="h-4 w-4" />,
  folder: <FolderOpen className="h-4 w-4" />,
  timer: <Timer className="h-4 w-4" />,
  volume: <VolumeX className="h-4 w-4" />,
};

export const StatCard = ({ title, value, icon, color, iconColor, borderColor }: StatCardProps) => {
  return (
    <Card className={`p-4 ${color} border-l-4 ${borderColor} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-full ${color} ${iconColor}`}>
          {iconMap[icon]}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>More info about {title}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="mt-3">
        <p className={`text-sm font-medium ${iconColor}`}>{title}</p>
        <p className={`text-2xl font-bold ${iconColor}`}>{value}</p>
      </div>
    </Card>
  );
};
