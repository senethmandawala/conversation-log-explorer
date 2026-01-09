import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Compass, 
  PhoneCall, 
  Bot, 
  Users, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePostCall } from "@/contexts/PostCallContext";
import { useAutopilot } from "@/contexts/AutopilotContext";
import { useModule } from "@/contexts/ModuleContext";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    label: "Home",
    items: [
      { title: "Get Started", icon: Compass, href: "/get-started" },
    ],
  },
  {
    label: "Module",
    items: [
      { title: "Post Call Analyzer", icon: PhoneCall, href: "/instances?module=pca" },
      { title: "Autopilot", icon: Bot, href: "/instances?module=autopilot" },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "User Management", icon: Users, href: "/user-management" },
    ],
  },
];

export function AppSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useModule();
  const location = useLocation();
  const { setSelectedInstance: setPostCallInstance } = usePostCall();
  const { setSelectedInstance: setAutopilotInstance } = useAutopilot();

  const handleNavClick = (href: string) => {
    // Clear instance when navigating to module root (instances page)
    if (href === "/pca") {
      setPostCallInstance(null);
    } else if (href === "/autopilot") {
      setAutopilotInstance(null);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 60 : 200 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen bg-card border-r border-border/50 flex flex-col relative"
    >
      {/* Logo */}
      <div className="h-12 flex items-center px-3 border-b border-border/30">
        {!sidebarCollapsed && (
          <motion.div
            initial={false}
            animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
            className="flex items-center gap-2"
          >
            <img 
              src="/src/assets/images/sense-ai-logo-transparent.svg" 
              alt="Sense AI Logo" 
              className="h-6 w-auto"
            />
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navigation.map((section) => (
          <div key={section.label} className="mb-4">
            {!sidebarCollapsed && (
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-2 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ fontFamily: 'Geist, sans-serif' }}
              >
                {section.label}
              </motion.h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
                return (
                  <li key={item.title}>
                    <NavLink
                      to={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      style={{ fontFamily: 'Geist, sans-serif' }}
                    >
                      <item.icon className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isActive && "text-primary"
                      )} />
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 -mt-1"
            >
              <span>Powered By</span>
              <img 
                src="/src/assets/images/wn_logo_2019_vector_final.svg" 
                alt="Wavenet Logo" 
                className="h-3 w-auto"
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
