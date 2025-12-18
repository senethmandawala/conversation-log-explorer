import { useState, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";
import { ModuleTabs } from "./ModuleTabs";
import { useModule } from "@/contexts/ModuleContext";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const location = useLocation();
  const { showModuleTabs, setShowModuleTabs } = useModule();

  useEffect(() => {
    const path = location.pathname;
    
    // Show tabs on module sub-routes (dashboard, conversations, etc.)
    const isPostCallAnalyzerSubRoute = path.startsWith("/post-call-analyzer/");
    const isAutopilotSubRoute = path.startsWith("/autopilot/") && path !== "/autopilot";
    const shouldShowTabs = isPostCallAnalyzerSubRoute || isAutopilotSubRoute;
    
    setShowModuleTabs(shouldShowTabs);

    if (path.startsWith("/post-call-analyzer")) {
      const segment = path.split("/post-call-analyzer/")[1];
      if (segment) {
        setActiveTab(segment.split("/")[0]);
      } else {
        setActiveTab("dashboard");
      }
    } else if (path.startsWith("/autopilot")) {
      const segment = path.split("/autopilot/")[1];
      if (segment) {
        setActiveTab(segment.split("/")[0]);
      } else {
        setActiveTab("dashboard");
      }
    }
  }, [location.pathname, setShowModuleTabs]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-4">
        {/* Top Header */}
        <TopHeader />

        {/* Module Tabs - Hidden on instances page */}
        {showModuleTabs && (
          <ModuleTabs activeTab={activeTab} onTabChange={setActiveTab} currentPath={location.pathname} />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
