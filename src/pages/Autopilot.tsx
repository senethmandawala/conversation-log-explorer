import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AutopilotInstanceSelector from "./autopilot/AutopilotInstanceSelector/AutopilotInstanceSelector";
import { useAutopilot, AutopilotInstance } from "@/contexts/AutopilotContext";
import { useModule } from "@/contexts/ModuleContext";

export default function Autopilot() {
  const navigate = useNavigate();
  const { selectedInstance, setSelectedInstance } = useAutopilot();
  const { setShowModuleTabs } = useModule();

  useEffect(() => {
    // Hide ModuleTabs on instances page
    setShowModuleTabs(false);
    return () => setShowModuleTabs(true);
  }, [setShowModuleTabs]);

  const handleSelectInstance = (instance: AutopilotInstance) => {
    setSelectedInstance(instance);
    navigate("/autopilot/dashboard");
  };

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
