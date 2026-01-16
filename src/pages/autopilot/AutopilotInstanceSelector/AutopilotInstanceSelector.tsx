import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  Typography, 
  ConfigProvider,
  Input,
  Space,
  Tag
} from "antd";
import { 
  IconRobot, 
  IconMessage, 
  IconPhone, 
  IconBolt,
  IconSearch
} from "@tabler/icons-react";

const { Title, Text } = Typography;

interface AutopilotInstance {
  id: string;
  name: string;
  description: string;
  channels: string;
}

const mockInstances: AutopilotInstance[] = [
  {
    id: "1",
    name: "Customer Support Bot",
    description: "Handles general customer inquiries and FAQs",
    channels: "Voice, Chat",
  },
  {
    id: "2",
    name: "Sales Assistant",
    description: "Guides customers through product selection",
    channels: "Chat, WhatsApp",
  },
  {
    id: "3",
    name: "Technical Support",
    description: "Provides technical troubleshooting assistance",
    channels: "Voice",
  },
  {
    id: "4",
    name: "Billing Inquiries",
    description: "Handles billing questions and payment issues",
    channels: "Voice, Chat",
  },
  {
    id: "5",
    name: "Onboarding Assistant",
    description: "Helps new users get started with the platform",
    channels: "Chat",
  },
  {
    id: "6",
    name: "Appointment Scheduler",
    description: "Manages appointment bookings and reminders",
    channels: "Voice, SMS",
  },
];

interface AutopilotInstanceSelectorProps {
  onSelectInstance: (instance: AutopilotInstance) => void;
}

export default function AutopilotInstanceSelector({ onSelectInstance }: AutopilotInstanceSelectorProps) {
  const [search, setSearch] = useState("");
  
  const filteredInstances = mockInstances.filter(instance =>
    instance.name.toLowerCase().includes(search.toLowerCase()) ||
    instance.description.toLowerCase().includes(search.toLowerCase()) ||
    instance.channels.toLowerCase().includes(search.toLowerCase())
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
                    background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconRobot style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={3} style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Instances</Title>
                  <Text type="secondary" style={{ fontSize: '14px' }}>Select an instance to view its analytics and configuration</Text>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconBolt style={{ color: '#a855f7', fontSize: 16 }} />
                <Text type="secondary" style={{ fontSize: '14px' }}>{mockInstances.length} active</Text>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Search Bar */}
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
              prefix={<IconSearch style={{ color: '#94a3b8' }} />}
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card
                  style={{ 
                    borderRadius: 12, 
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#a855f7';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(168, 85, 247, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => onSelectInstance(instance)}
                  bodyStyle={{ padding: '20px' }}
                >
                  {/* Icon */}
                  <div 
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'}
                  >
                    <IconRobot style={{ color: '#a855f7', fontSize: 24 }} />
                  </div>

                  {/* Title */}
                  <Title 
                    level={4} 
                    style={{ 
                      margin: 0, 
                      marginBottom: 8,
                      color: '#1f2937',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#a855f7'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
                  >
                    {instance.name}
                  </Title>

                  {/* Description */}
                  <Text 
                    type="secondary" 
                    style={{ 
                      fontSize: '14px',
                      marginBottom: 16,
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {instance.description}
                  </Text>

                  {/* Channels */}
                  <div className="flex items-center gap-2">
                    <IconBolt style={{ color: '#94a3b8', fontSize: 14 }} />
                    <Text type="secondary" style={{ fontSize: '14px' }}>{instance.channels}</Text>
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
            <IconRobot style={{ fontSize: 48, color: '#94a3b8', marginBottom: 12 }} />
            <Text type="secondary">No instances found matching "{search}"</Text>
          </motion.div>
        )}
      </div>
    </ConfigProvider>
  );
}
