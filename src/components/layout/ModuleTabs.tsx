import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  LayoutGrid, 
  MessageSquare, 
  UserCheck, 
  Settings,
  Info,
  BarChart3,
  FileText,
  Activity,
  PhoneCall,
  Bot,
  Upload,
  Users
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
  { id: "reports", icon: FileText, label: "Reports" },
  { id: "settings", icon: Settings, label: "Configuration" },
];

const postCallAnalyzerTabs: Tab[] = [
  { id: "dashboard", icon: LayoutGrid, label: "Dashboard" },
  { id: "call-insight", icon: PhoneCall, label: "Call Insight" },
  { id: "agent-performance", icon: Users, label: "Agent Performance" },
  { id: "content-uploader", icon: Upload, label: "Content Uploader" },
  { id: "reports", icon: FileText, label: "Reports" },
  { id: "configuration", icon: Settings, label: "Configuration" },
];

interface ModuleTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  currentPath: string;
}

export function ModuleTabs({ activeTab, onTabChange, currentPath }: ModuleTabsProps) {
  const navigate = useNavigate();
  const isPostCallAnalyzer = currentPath.startsWith("/post-call-analyzer");
  const isAutopilot = currentPath.startsWith("/autopilot");
  const tabs = isPostCallAnalyzer ? postCallAnalyzerTabs : autopilotTabs;
  const moduleTitle = isPostCallAnalyzer ? "Post Call Analyzer" : "Autopilot";
  const ModuleIcon = isPostCallAnalyzer ? PhoneCall : Bot;

  // Determine active tab from URL
  const getActiveTabFromPath = () => {
    if (isPostCallAnalyzer) {
      const subPath = currentPath.replace("/post-call-analyzer", "").replace("/", "");
      return subPath || "dashboard";
    } else if (isAutopilot) {
      const subPath = currentPath.replace("/autopilot", "").replace("/", "");
      return subPath || "dashboard";
    }
    return activeTab;
  };

  const currentActiveTab = getActiveTabFromPath();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="px-6 py-4 bg-card border-b border-border/30"
    >
      <div className="flex items-center justify-between">
        {/* Module Title - Left */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <ModuleIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">{moduleTitle}</h1>
            <p className="text-xs text-muted-foreground">Dashboard Overview</p>
          </div>
        </div>

        {/* Tab Navigation - Center */}
        <div className="flex items-center bg-muted/50 rounded-2xl p-1">
          {tabs.map((tab) => {
            const isActive = currentActiveTab === tab.id;
            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      onTabChange(tab.id);
                      if (isPostCallAnalyzer) {
                        const route = tab.id === "dashboard" 
                          ? "/post-call-analyzer" 
                          : `/post-call-analyzer/${tab.id}`;
                        navigate(route);
                      } else {
                        const route = tab.id === "dashboard" 
                          ? "/autopilot" 
                          : `/autopilot/${tab.id}`;
                        navigate(route);
                      }
                    }}
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

        {/* Spacer for balance */}
        <div className="w-[200px]" />
      </div>
    </motion.div>
  );
}
