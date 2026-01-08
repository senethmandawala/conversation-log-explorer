import { useState, useEffect } from "react";
import { Card, List, Button, Typography, ConfigProvider, Empty } from "antd";
import { ArrowLeftOutlined, AudioMutedOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";

const { Title, Text } = Typography;

const mockSilenceReasons = [
  "Customer put the call on hold to check information",
  "Agent searching for customer account details in the system",
  "Technical issue causing audio delay or interruption",
  "Customer consulting with another person before responding",
  "Agent reviewing policy or procedure documentation",
  "Network latency causing communication gaps",
  "Customer reading terms and conditions or documentation",
  "Agent waiting for system response or loading",
  "Customer calculating or verifying payment information",
  "Transfer or call routing process in progress",
  "Agent consulting with supervisor or colleague",
  "Customer experiencing emotional distress requiring pause",
  "System authentication or verification process",
  "Customer multitasking during the call",
  "Agent documenting call notes or updating records"
];

export default function SilenceReport() {
  const { setSelectedTab } = usePostCall();
  const [loading, setLoading] = useState(true);
  const [silenceReasons, setSilenceReasons] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => { setSilenceReasons(mockSilenceReasons); setLoading(false); }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ConfigProvider theme={{ components: { Card: { headerBg: 'transparent' }, Button: { borderRadius: 8 } } }}>
      <div className="p-6 space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }, body: { padding: 24 } }}
            title={
              <div className="flex items-center gap-3">
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setSelectedTab("reports")} style={{ marginRight: 8 }} />
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(100, 116, 139, 0.3)' }}>
                  <AudioMutedOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Silence Reasons Report</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>Analyze and visualize the reasons for silence detected in calls</Text>
                </div>
              </div>
            }
          >
            {loading ? (
              <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
            ) : silenceReasons.length === 0 ? (
              <Empty image={<AudioMutedOutlined style={{ fontSize: 48, opacity: 0.3 }} />} description="No silence reasons available" />
            ) : (
              <Card size="small" style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <List dataSource={silenceReasons} renderItem={(reason, index) => (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
                    <List.Item style={{ padding: '12px 0', borderBottom: index < silenceReasons.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div className="flex items-center gap-4">
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 13 }}>{index + 1}</div>
                        <Text>{reason}</Text>
                      </div>
                    </List.Item>
                  </motion.div>
                )} />
              </Card>
            )}
          </Card>
        </motion.div>
      </div>
      <AIHelper />
    </ConfigProvider>
  );
}
