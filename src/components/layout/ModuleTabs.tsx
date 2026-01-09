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
import { useDate } from "@/contexts/DateContext";
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
  const { globalDateRange, setGlobalDateRange } = useDate();
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
  
  // Service type filter state
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  
  // Handle date range change - update global context
  const handleDateRangeChange = (dateRange: DateRangeObject) => {
    setGlobalDateRange(dateRange);
  };
  
  // Service type options
  const serviceTypeOptions = [
    { label: 'Home', value: 'home' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Unknown', value: 'unknown' },
  ];

  return (
    <div className="px-6 py-4 bg-card border-b border-border/30">
      <div className="relative flex items-center justify-between">
        {/* Module Title - Left (fixed width) */}
        <div className="flex items-center gap-3" style={{ width: '280px', flexShrink: 0 }}>
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

        {/* Tab Navigation - Center (absolutely positioned for stability) */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center bg-muted/50 rounded-2xl p-1"
          style={{ zIndex: 10 }}
        >
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

        {/* Right Side - Fixed width container */}
        <div 
          className="flex items-center gap-3 justify-end" 
          style={{ width: '340px', flexShrink: 0 }}
        >
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
                maxTagCount={1}
                maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                style={{
                  minWidth: '160px',
                  fontFamily: 'Geist, sans-serif',
                }}
                popupClassName="service-type-dropdown"
                dropdownStyle={{
                  borderRadius: '12px',
                  padding: '4px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                }}
                allowClear
                suffixIcon={
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                }
                tagRender={(props) => {
                  const { label, closable, onClose } = props;
                  return (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 8px',
                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#1e40af',
                        marginRight: 4,
                      }}
                    >
                      {label}
                      {closable && (
                        <span
                          onClick={onClose}
                          style={{ 
                            cursor: 'pointer', 
                            marginLeft: 2,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </span>
                      )}
                    </span>
                  );
                }}
              />
            </>
          ) : (
            <div style={{ width: '100%' }} />
          )}
        </div>
      </div>
    </div>
  );
}
