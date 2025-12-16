import { motion } from "framer-motion";
import { 
  LayoutGrid, 
  MessageSquare, 
  UserCheck, 
  Settings,
  Info,
  BarChart3,
  FileText,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Tab {
  id: string;
  icon: React.ElementType;
  label: string;
}

const autopilotTabs: Tab[] = [
  { id: "dashboard", icon: LayoutGrid, label: "Dashboard" },
  { id: "conversations", icon: MessageSquare, label: "Conversation History" },
  { id: "agent-performance", icon: UserCheck, label: "Agent Performance" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const postCallAnalyzerTabs: Tab[] = [
  { id: "overview", icon: BarChart3, label: "Overview" },
  { id: "analytics", icon: Activity, label: "Analytics" },
  { id: "reports", icon: FileText, label: "Reports" },
  { id: "settings", icon: Settings, label: "Settings" },
];

interface ModuleTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  currentPath: string;
}

export function ModuleTabs({ activeTab, onTabChange, currentPath }: ModuleTabsProps) {
  const tabs = currentPath === "/post-call-analyzer" ? postCallAnalyzerTabs : autopilotTabs;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="px-6 py-4 bg-card border-b border-border/30"
    >
      <div className="flex items-center justify-center">
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
