import { useState, useEffect } from "react";
import { Card, List, Button, Typography, ConfigProvider, Empty } from "antd";
import { IconArrowLeft, IconVolume3 } from "@tabler/icons-react";
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
          <Card className="rounded-xl border-slate-200" styles={{ header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }, body: { padding: 24 } }}
            title={
              <div className="flex items-center gap-3">
                <Button type="text" icon={<IconArrowLeft />} onClick={() => setSelectedTab("reports")} className="mr-2" />
                <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg shadow-slate-500/30">
                  <IconVolume3 className="text-white text-xl" />
                </div>
                <div>
                  <Title level={5} className="!m-0 !font-semibold">Silence Reasons Report</Title>
                  <Text type="secondary" className="text-[13px]">Analyze and visualize the reasons for silence detected in calls</Text>
                </div>
              </div>
            }
          >
            {loading ? (
              <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
            ) : silenceReasons.length === 0 ? (
              <Empty image={<IconVolume3 className="text-5xl opacity-30" />} description="No silence reasons available" />
            ) : (
              <Card size="small" className="rounded-xl border-slate-200">
                <List dataSource={silenceReasons} renderItem={(reason, index) => (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
                    <List.Item className="!py-3" style={{ borderBottom: index < silenceReasons.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold text-[13px]">{index + 1}</div>
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
