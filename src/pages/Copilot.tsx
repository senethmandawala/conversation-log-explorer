import { useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { InstanceSelector } from "@/components/post-call/InstanceSelector";
import { useModule } from "@/contexts/ModuleContext";
import { Card, Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";

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
              <Card
                style={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  textAlign: 'center'
                }}
              >
                <MessageOutlined style={{ fontSize: 48, color: '#10b981', marginBottom: 16 }} />
                <Title level={3} style={{ color: '#10b981', marginBottom: 8 }}>
                  Copilot
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Real-time AI assistance for agents during live calls
                </Text>
                <div style={{ marginTop: 16 }}>
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
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                padding: '24px'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 8, 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MessageOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={3} style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
                    Copilot Dashboard
                  </Title>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    {selectedProject ? 
                      `Department: ${selectedProject.department_name || selectedProject.name}` : 
                      `Department ID: ${departmentId}`
                    }
                  </Text>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <MessageOutlined style={{ fontSize: 64, color: '#10b981', marginBottom: 16 }} />
                <Title level={2} style={{ color: '#10b981', marginBottom: 8 }}>
                  Coming Soon
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
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
