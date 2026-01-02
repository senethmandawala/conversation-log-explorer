import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  const { selectedInstance, setSelectedInstance, selectedTab, setSelectedTab } = useAutopilot();
  const { setShowModuleTabs } = useModule();

  // Get project_id from URL params
  const projectId = searchParams.get("project_id");

  useEffect(() => {
    // Show ModuleTabs only when an instance is selected (has project_id)
    setShowModuleTabs(!!projectId && !!selectedInstance);
    return () => setShowModuleTabs(false);
  }, [setShowModuleTabs, projectId, selectedInstance]);

  const handleSelectInstance = (instance: AutopilotInstance) => {
    setSelectedInstance(instance);
    setSelectedTab("dashboard");
    // Navigate with project_id query param
    setSearchParams({ project_id: instance.id });
  };


  // If no project_id in URL, show instance selector
  if (!projectId || !selectedInstance) {
    return (
      <div className="min-h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
              <AutopilotInstanceSelector onSelectInstance={handleSelectInstance} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

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

