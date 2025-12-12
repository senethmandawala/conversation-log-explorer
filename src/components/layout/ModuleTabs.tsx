import { motion } from "framer-motion";
import { 
  LayoutGrid, 
  MessageSquare, 
  UserCheck, 
  Settings,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Tab {
  id: string;
  icon: React.ElementType;
  label: string;
}

const tabs: Tab[] = [
  { id: "dashboard", icon: LayoutGrid, label: "Dashboard" },
  { id: "conversations", icon: MessageSquare, label: "Conversation History" },
  { id: "agent-performance", icon: UserCheck, label: "Agent Performance" },
  { id: "settings", icon: Settings, label: "Settings" },
];

interface ModuleTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function ModuleTabs({ activeTab, onTabChange }: ModuleTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="px-6 py-4 bg-card border-b border-border/30"
    >
      <div className="flex items-center justify-between">
        {/* Module Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-primary">Autopilot</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Autopilot module for automated call handling</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-muted/50 rounded-2xl p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      "relative h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <tab.icon className={cn(
                      "h-5 w-5 relative z-10",
                      isActive && "text-primary-foreground"
                    )} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tab.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
