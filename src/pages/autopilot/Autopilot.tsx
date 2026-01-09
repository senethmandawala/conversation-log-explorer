import { useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AutopilotInstanceSelector from "./AutopilotInstanceSelector/AutopilotInstanceSelector";
import { useAutopilot, AutopilotInstance } from "@/contexts/AutopilotContext";
import { useModule } from "@/contexts/ModuleContext";
import AutopilotDashboard from "./AutopilotDashboard/AutopilotDashboard";
import AutopilotConversations from "./AutopilotConversations/AutopilotConversations";
import AutopilotReports from "./AutopilotReports/AutopilotReports";
import AutopilotSettings from "./AutopilotSettings/AutopilotSettings";

export default function Autopilot() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { selectedInstance, setSelectedInstance, selectedTab, setSelectedTab } = useAutopilot();
  const { setShowModuleTabs } = useModule();

  // Get project_id from URL params
  const projectId = searchParams.get("project_id");
  const selectedProject = location.state?.selectedProject;

  useEffect(() => {
    // If we have a project_id from URL params, find and set the selected instance
    if (projectId && !selectedInstance) {
      let userString = localStorage.getItem('user');
      if (userString) {
        let user = JSON.parse(userString);
        if (user && user.autopilotProjectList) {
          let project = user.autopilotProjectList.find((p: any) => p.project_id === projectId);
          if (project) {
            const instance: AutopilotInstance = {
              id: project.project_id,
              name: project.project_name,
              description: project.description,
              channels: project.channels
            };
            setSelectedInstance(instance);
            setSelectedTab("dashboard");
          }
        }
      }
    }
    
    // Always show tabs for Autopilot when we're on this route
    setShowModuleTabs(true);
    return () => setShowModuleTabs(false);
  }, [setShowModuleTabs, projectId, selectedInstance, setSelectedInstance, setSelectedTab]);

  // Render the selected tab content
  const renderTabContent = () => {
    switch (selectedTab) {
      case "dashboard":
        return <AutopilotDashboard />;
      case "conversations":
        return <AutopilotConversations />;
      case "reports":
        return <AutopilotReports />;
      case "settings":
        return <AutopilotSettings />;
      default:
        return <AutopilotDashboard />;
    }
  };

  return (
    <div className="min-h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

