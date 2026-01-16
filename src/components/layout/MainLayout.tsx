import { useState, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";
import { ModuleTabs } from "./ModuleTabs";
import { Footer } from "./Footer";
import { useModule } from "@/contexts/ModuleContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const location = useLocation();
  const { showModuleTabs, setShowModuleTabs, sidebarCollapsed, setSidebarCollapsed } = useModule();
  const isMobile = useIsMobile();

  useEffect(() => {
    const path = location.pathname;
    
    // Both PCA and Autopilot control their own tabs via context
    // Only reset showModuleTabs for non-module pages
    if (!path.startsWith("/pca") && !path.startsWith("/autopilot")) {
      setShowModuleTabs(false);
    }
  }, [location.pathname, setShowModuleTabs]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay backdrop */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar - hidden on mobile when collapsed, overlay when open */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
        ${isMobile && sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out
      `}>
        <AppSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopHeader />

        {/* Module Tabs - Hidden on instances page */}
        {showModuleTabs && (
          <ModuleTabs activeTab={activeTab} onTabChange={setActiveTab} currentPath={location.pathname} />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="min-h-full flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            {/* Footer - scrolls with content on mobile */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
