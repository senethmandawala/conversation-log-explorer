import { useState, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";
import { ModuleTabs } from "./ModuleTabs";
import { Footer } from "./Footer";
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
    
    // Both PCA and Autopilot control their own tabs via context
    // Only reset showModuleTabs for non-module pages
    if (!path.startsWith("/pca") && !path.startsWith("/autopilot")) {
      setShowModuleTabs(false);
    }
  }, [location.pathname, setShowModuleTabs]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />

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
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
