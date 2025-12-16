import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InstanceSelector } from "@/components/post-call/InstanceSelector";
import { PostCallDashboard } from "@/components/post-call/PostCallDashboard";
import { AIHelper } from "@/components/post-call/AIHelper";
import { useModule } from "@/contexts/ModuleContext";

export interface Instance {
  id: string;
  name: string;
}

const mockInstances: Instance[] = [
  { id: "1", name: "pca_qa" },
  { id: "2", name: "pca_demo" },
  { id: "3", name: "pca_qa2" },
  { id: "4", name: "pca_qa4" },
  { id: "5", name: "pca_po" },
  { id: "6", name: "pca_qa5" },
  { id: "7", name: "pca_qa7" },
  { id: "8", name: "pca_qa8" },
  { id: "9", name: "Claro Contact Center" },
  { id: "10", name: "pca_qa9" },
  { id: "11", name: "test_department1" },
  { id: "12", name: "TigoBolivia" },
];

const PostCallAnalyzer = () => {
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const { setShowModuleTabs } = useModule();

  useEffect(() => {
    // Hide ModuleTabs on instances page, show on dashboard
    setShowModuleTabs(!!selectedInstance);
    
    // Cleanup: show ModuleTabs when leaving this page
    return () => setShowModuleTabs(true);
  }, [selectedInstance, setShowModuleTabs]);

  return (
    <div className="min-h-full">
      <AnimatePresence mode="wait">
        {!selectedInstance ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <InstanceSelector
              instances={mockInstances}
              onSelectInstance={setSelectedInstance}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PostCallDashboard
              instance={selectedInstance}
              onBack={() => setSelectedInstance(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Helper - Only visible on Post Call Analyzer */}
      <AIHelper />
    </div>
  );
};

export default PostCallAnalyzer;
