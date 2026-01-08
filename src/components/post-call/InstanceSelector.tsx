import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  Typography, 
  ConfigProvider,
  Input,
  Space,
  Badge
} from "antd";
import { 
  DatabaseOutlined, 
  ArrowRightOutlined, 
  ApiOutlined, 
  ThunderboltOutlined
} from "@ant-design/icons";
import { useState } from "react";
import type { Instance } from "@/pages/PostCallAnalyzer";

const { Title, Text } = Typography;

interface InstanceSelectorProps {
  instances: Instance[];
  onSelectInstance: (instance: Instance) => void;
}

export const InstanceSelector = ({ instances, onSelectInstance }: InstanceSelectorProps) => {
  const [search, setSearch] = useState("");
  
  const filteredInstances = instances.filter(instance =>
    instance.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg: 'transparent',
          },
        },
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            style={{ 
              borderRadius: 12, 
              border: '1px solid #e2e8f0',
              padding: '24px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 8, 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <DatabaseOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={3} style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Instances</Title>
                  <Text type="secondary" style={{ fontSize: '14px' }}>Select an instance to view its analytics and configuration</Text>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ApiOutlined style={{ color: '#3b82f6', fontSize: 16 }} />
                <Text type="secondary" style={{ fontSize: '14px' }}>{instances.length} active</Text>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div style={{ maxWidth: '448px' }}>
            <Input
              placeholder="Search instances..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              prefix={<DatabaseOutlined style={{ color: '#94a3b8' }} />}
              style={{ 
                height: 44,
                borderRadius: 8,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}
            />
          </div>
        </motion.div>

        {/* Instance Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 16 }}>
          <AnimatePresence mode="popLayout">
            {filteredInstances.map((instance, index) => (
              <motion.div
                key={instance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                whileHover={{ y: -4 }}
              >
                <Card
                  style={{ 
                    borderRadius: 12, 
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => onSelectInstance(instance)}
                  bodyStyle={{ padding: '20px' }}
                >
                  {/* Gradient overlay on hover */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  />
                  
                  <div style={{ position: 'relative' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div style={{ position: 'relative' }}>
                          <div 
                            style={{
                              padding: '12px',
                              borderRadius: 8,
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                          >
                            <DatabaseOutlined style={{ color: '#3b82f6', fontSize: 20 }} />
                          </div>
                          {/* Status indicator */}
                          <div 
                            style={{
                              position: 'absolute',
                              top: '-2px',
                              right: '-2px',
                              width: '10px',
                              height: '10px',
                              backgroundColor: '#22c55e',
                              borderRadius: '50%',
                              border: '2px solid white'
                            }}
                          />
                        </div>
                        <div>
                          <Text 
                            strong 
                            style={{ 
                              fontSize: '18px',
                              color: '#1f2937',
                              transition: 'color 0.3s',
                              display: 'block'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
                          >
                            {instance.name}
                          </Text>
                        </div>
                      </div>
                      
                      <ArrowRightOutlined 
                        style={{ 
                          color: '#94a3b8',
                          fontSize: 20,
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#3b82f6';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#94a3b8';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredInstances.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '48px 0' }}
          >
            <DatabaseOutlined style={{ fontSize: 48, color: '#94a3b8', marginBottom: 12 }} />
            <Text type="secondary">No instances found matching "{search}"</Text>
          </motion.div>
        )}
      </div>
    </ConfigProvider>
  );
};
