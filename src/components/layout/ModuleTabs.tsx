import { useState } from "react";
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
import { useAutopilot, AutopilotTab } from "@/contexts/AutopilotContext";
import { usePostCall, PostCallTab } from "@/contexts/PostCallContext";
import { DatePicker, Select } from "antd";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import { DateRangeObject } from "@/components/common/DatePicker/DatePicker";
import dayjs from "dayjs";

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
  const { selectedInstance: autopilotInstance, selectedTab: autopilotSelectedTab, setSelectedTab: setAutopilotTab } = useAutopilot();
  const { selectedInstance: postCallInstance, selectedTab: postCallSelectedTab, setSelectedTab: setPostCallTab } = usePostCall();
  const isPostCallAnalyzer = currentPath.startsWith("/pca");
  const isAutopilot = currentPath.startsWith("/autopilot");
  const tabs = isPostCallAnalyzer ? postCallAnalyzerTabs : autopilotTabs;
  const moduleTitle = isPostCallAnalyzer ? "Post Call Analyzer" : "Autopilot";
  const ModuleIcon = isPostCallAnalyzer ? PhoneCall : Bot;
  
  // Get the selected instance name based on current module
  const instanceName = isPostCallAnalyzer 
    ? postCallInstance?.name 
    : autopilotInstance?.name;

  // Determine active tab from context (URL doesn't change for either module)
  const getActiveTabFromPath = () => {
    if (isPostCallAnalyzer) {
      return postCallSelectedTab;
    } else if (isAutopilot) {
      return autopilotSelectedTab;
    }
    return activeTab;
  };

  const currentActiveTab = getActiveTabFromPath();
  
  // Check if current tab is dashboard
  const isDashboardTab = currentActiveTab === "dashboard";
  
  // Date range picker state
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeObject | null>(null);
  
  // Service type filter state
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  
  // Handle date range change
  const handleDateRangeChange = (dateRange: DateRangeObject) => {
    setSelectedDateRange(dateRange);
    console.log('Date range changed:', dateRange);
  };
  
  // Service type options
  const serviceTypeOptions = [
    { label: 'Home', value: 'home' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Unknown', value: 'unknown' },
  ];

  return (
    <div
      className="px-6 py-4 bg-card border-b border-border/30"
    >
      <div className="flex items-center justify-between">
        {/* Module Title - Left */}
        <div className="flex items-center gap-3">
          <div 
            style={{ 
              padding: '10px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ModuleIcon style={{ color: '#3b82f6', fontSize: 20 }} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">{moduleTitle}</h1>
            <p className="text-xs text-muted-foreground">{instanceName || "Dashboard Overview"}</p>
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
                        // Use context to switch tabs (URL stays the same)
                        setPostCallTab(tab.id as PostCallTab);
                      } else {
                        // For autopilot, use context to switch tabs (URL stays the same)
                        setAutopilotTab(tab.id as AutopilotTab);
                      }
                    }}
                    className={cn(
                      "relative h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
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

        {/* Right Side - Always maintain consistent width */}
        <div className="flex items-center gap-3" style={{ minWidth: '320px', justifyContent: 'flex-end' }}>
          {isDashboardTab ? (
            <>
              <DatePickerComponent
                onSelectedRangeValueChange={handleDateRangeChange}
                toolTipValue="Select date range"
                calenderType=""
              />
              <Select
                mode="multiple"
                placeholder="Service Type"
                value={selectedServiceTypes}
                onChange={setSelectedServiceTypes}
                options={serviceTypeOptions}
                style={{
                  minWidth: '150px',
                  fontFamily: 'Geist, sans-serif',
                }}
                allowClear
              />
            </>
          ) : (
            /* Invisible spacer to maintain layout */
            <div style={{ width: '270px' }} />
          )}
        </div>
      </div>
    </div>
  );
}
