import { useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { InstanceSelector } from "@/components/post-call/InstanceSelector";
import { useModule } from "@/contexts/ModuleContext";
import { Card, Typography } from "antd";
import { IconMessage } from "@tabler/icons-react";

const { Title, Text } = Typography;

const Copilot = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { setShowModuleTabs } = useModule();

  // Get departmentId and module from URL params
  const departmentId = searchParams.get("departmentId");
  const selectedProject = location.state?.selectedProject;

  useEffect(() => {
    // If we have a selected project from navigation state, we could set it here
    // For now, just show ModuleTabs when departmentId is present
    setShowModuleTabs(!!departmentId || !!selectedProject);
    return () => setShowModuleTabs(false);
  }, [setShowModuleTabs, departmentId, selectedProject]);

  // If no departmentId in URL and no selected project, show coming soon message
  if (!departmentId && !selectedProject) {
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
              <Card className="rounded-xl border-slate-200 p-6 text-center">
                <IconMessage className="text-5xl text-emerald-500 mb-4" />
                <Title level={3} className="!text-emerald-500 !mb-2">
                  Copilot
                </Title>
                <Text type="secondary" className="text-base">
                  Real-time AI assistance for agents during live calls
                </Text>
                <div className="mt-4">
                  <Text type="secondary">
                    Please select an instance from the instances page to continue.
                  </Text>
                </div>
              </Card>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key="copilot-main"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Card className="rounded-xl border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <IconMessage className="text-white text-xl" />
                </div>
                <div>
                  <Title level={3} className="!m-0 !text-xl !font-semibold">
                    Copilot Dashboard
                  </Title>
                  <Text type="secondary" className="text-sm">
                    {selectedProject ? 
                      `Department: ${selectedProject.department_name || selectedProject.name}` : 
                      `Department ID: ${departmentId}`
                    }
                  </Text>
                </div>
              </div>
              
              <div className="text-center py-10">
                <IconMessage className="text-6xl text-emerald-500 mb-4" />
                <Title level={2} className="!text-emerald-500 !mb-2">
                  Coming Soon
                </Title>
                <Text type="secondary" className="text-base">
                  Copilot features are currently under development.
                </Text>
              </div>
            </Card>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Copilot;
