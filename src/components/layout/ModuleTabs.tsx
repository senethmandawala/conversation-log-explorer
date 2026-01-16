import { useState } from "react";
import { 
  IconLayoutGrid, 
  IconMessage, 
  IconUserCheck, 
  IconSettings,
  IconInfoCircle,
  IconChartBar,
  IconFileText,
  IconActivity,
  IconPhone,
  IconRobot,
  IconUpload,
  IconUsers
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAutopilot, AutopilotTab } from "@/contexts/AutopilotContext";
import { usePostCall, PostCallTab } from "@/contexts/PostCallContext";
import { useDate } from "@/contexts/DateContext";
import DatePickerComponent from "@/components/common/DatePicker/DatePickerComponent";
import { DateRangeObject } from "@/components/common/DatePicker/DatePicker";
import FilterButton from "@/components/common/FilterButton/FilterButton";
import dayjs from "dayjs";

interface Tab {
  id: string;
  icon: React.ElementType;
  label: string;
}

const autopilotTabs: Tab[] = [
  { id: "dashboard", icon: IconLayoutGrid, label: "Dashboard" },
  { id: "conversations", icon: IconMessage, label: "Conversation History" },
  { id: "reports", icon: IconFileText, label: "Reports" },
  { id: "settings", icon: IconSettings, label: "Configuration" },
];

const postCallAnalyzerTabs: Tab[] = [
  { id: "dashboard", icon: IconLayoutGrid, label: "Dashboard" },
  { id: "call-insight", icon: IconPhone, label: "Call Insight" },
  { id: "agent-performance", icon: IconUsers, label: "Agent Performance" },
  { id: "content-uploader", icon: IconUpload, label: "Content Uploader" },
  { id: "reports", icon: IconFileText, label: "Reports" },
  { id: "configuration", icon: IconSettings, label: "Configuration" },
];

interface ModuleTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  currentPath: string;
}

export function ModuleTabs({ activeTab, onTabChange, currentPath }: ModuleTabsProps) {
  const { selectedInstance: autopilotInstance, selectedTab: autopilotSelectedTab, setSelectedTab: setAutopilotTab } = useAutopilot();
  const { selectedInstance: postCallInstance, selectedTab: postCallSelectedTab, setSelectedTab: setPostCallTab } = usePostCall();
  const { globalDateRange, setGlobalDateRange } = useDate();
  const isPostCallAnalyzer = currentPath.startsWith("/pca");
  const isAutopilot = currentPath.startsWith("/autopilot");
  const tabs = isPostCallAnalyzer ? postCallAnalyzerTabs : autopilotTabs;
  const moduleTitle = isPostCallAnalyzer ? "Post Call Analyzer" : "Autopilot";
  const ModuleIcon = isPostCallAnalyzer ? IconPhone : IconRobot;
  
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
  
  // Filter state
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});
  
  // Handle date range change - update global context
  const handleDateRangeChange = (dateRange: DateRangeObject) => {
    setGlobalDateRange(dateRange);
  };
  
  // Filter groups configuration
  const filterGroups = [
    {
      id: 'serviceType',
      label: 'Service Type',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Unknown', value: 'unknown' },
      ]
    },
    {
      id: 'callType',
      label: 'Call Type',
      options: [
        { label: 'Inbound', value: 'inbound' },
        { label: 'Outbound', value: 'outbound' },
      ]
    },
    {
      id: 'status',
      label: 'Status',
      options: [
        { label: 'Resolved', value: 'resolved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Escalated', value: 'escalated' },
      ]
    }
  ];

  return (
    <div className="px-2 lg:px-6 py-2 lg:py-4 bg-card border-b border-border/30">
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
        {/* Module Title - Left (fixed width on desktop, full width on mobile/tablet) */}
        <div className="flex items-center gap-2 lg:gap-3 w-full lg:w-[280px] flex-shrink-0">
          <div className="p-2 lg:p-2.5 rounded-lg lg:rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <ModuleIcon className="text-blue-500 text-lg lg:text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base lg:text-lg font-semibold text-foreground tracking-tight truncate">{moduleTitle}</h1>
            <p className="text-xs text-muted-foreground truncate">{instanceName || "Dashboard Overview"}</p>
          </div>
        </div>

        {/* Tab Navigation - Center (scrollable on mobile/tablet, centered on desktop) */}
        <div className="w-full lg:w-auto lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 flex items-center bg-muted/50 rounded-xl lg:rounded-2xl p-1 z-10 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = currentActiveTab === tab.id;
            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      onTabChange(tab.id);
                      if (isPostCallAnalyzer) {
                        setPostCallTab(tab.id as PostCallTab);
                      } else {
                        setAutopilotTab(tab.id as AutopilotTab);
                      }
                    }}
                    className={cn(
                      "relative h-10 w-10 lg:h-12 lg:w-12 rounded-lg lg:rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0",
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

        {/* Right Side - Fixed width container on desktop, full width on mobile/tablet */}
        <div className="flex items-center gap-2 lg:gap-3 justify-end w-full lg:w-[340px] flex-shrink-0">
          {isDashboardTab ? (
            <>
              <FilterButton
                filterGroups={filterGroups}
                appliedFilters={appliedFilters}
                onApplyFilters={setAppliedFilters}
                size="small"
              />
              <DatePickerComponent
                dateInput={globalDateRange}
                onSelectedRangeValueChange={handleDateRangeChange}
                toolTipValue="Select date range"
                calenderType=""
                size="small"
              />
            </>
          ) : (
            <div className="w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
