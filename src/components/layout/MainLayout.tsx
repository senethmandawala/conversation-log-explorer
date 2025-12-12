import { useState, ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";
import { ModuleTabs } from "./ModuleTabs";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState("conversations");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopHeader />

        {/* Module Tabs */}
        <ModuleTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
