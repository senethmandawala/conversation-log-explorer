import { useState } from "react";
import { 
  Card, 
  Tabs, 
  DatePicker, 
  Button, 
  Typography,
  ConfigProvider,
  List
} from "antd";
import { 
  FilterOutlined, 
  ArrowLeftOutlined,
  UserOutlined,
  SettingOutlined,
  RiseOutlined,
  DollarOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

// Mock data for recommendations
const mockAgentPerformanceRecommendations = [
  { id: "1", title: "Improve Authentication Process", description: "68% of agents struggle with the authentication process, leading to extended call times and customer frustration.", severity: "high", recommendations: ["Develop specialized training modules for authentication procedures", "Create simplified authentication scripts with clear talking points", "Implement role-playing exercises for common authentication scenarios", "Schedule refresher training on security protocols quarterly"] },
  { id: "2", title: "Enhance Product Knowledge", description: "52% of agents need training on effectively explaining promotions, which affects conversion rates.", severity: "medium", recommendations: ["Create comprehensive product knowledge base", "Develop quick reference guides for promotions", "Implement weekly product update sessions", "Establish mentorship program for new agents"] }
];

const mockOperationalLevelRecommendations = [
  { id: "1", title: "Address Intentional Call Dropping", description: "63% of dropped calls are deliberately terminated by agents, particularly during complex inquiries or when call queues are high.", severity: "high", recommendations: ["Implement stricter call monitoring for premature disconnections", "Create clear escalation paths for complex inquiries", "Develop better queue management strategies during peak hours", "Establish consequences for intentional call dropping"] },
  { id: "2", title: "Optimize Staffing Levels", description: "Peak hours show 40% understaffing leading to increased wait times and agent stress.", severity: "medium", recommendations: ["Analyze call volume patterns to optimize shift scheduling", "Implement flexible staffing during peak periods", "Cross-train agents to handle multiple call types", "Consider hiring additional staff for high-volume periods"] }
];

const mockSpecificIssuesRecommendations = [
  { id: "1", title: "Reduce Repeat Calls", description: "86% increase in repeat calls compared to previous quarter indicates unresolved issues on first contact.", severity: "high", recommendations: ["Implement better case tracking to ensure proper follow up", "Develop more thorough first-call resolution procedures", "Create specialized teams for handling complex issues", "Improve knowledge base access for agents to provide better answers"] }
];

const mockBusinessImpactRecommendations = [
  { id: "1", title: "Improve Customer Retention", description: "Customer churn rate increased by 15% due to poor service quality and unresolved issues.", severity: "high", recommendations: ["Implement proactive customer outreach program", "Develop customer satisfaction recovery procedures", "Create loyalty incentives for at-risk customers", "Establish executive escalation path for critical issues"] }
];

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case "high": return { icon: <WarningOutlined />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
    case "medium": return { icon: <InfoCircleOutlined />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
    default: return { icon: <CheckCircleOutlined />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
  }
};

const RecommendationCard = ({ recommendation, index }: { recommendation: any; index: number }) => {
  const config = getSeverityConfig(recommendation.severity);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card size="small" style={{ marginBottom: 16, borderRadius: 12, border: `1px solid ${config.color}30`, background: config.bg }}>
        <div className="flex items-start gap-4">
          <div style={{ width: 40, height: 40, borderRadius: 8, background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.color, fontSize: 20 }}>{config.icon}</div>
          <div className="flex-1">
            <Title level={5} style={{ margin: 0, marginBottom: 4 }}>{recommendation.title}</Title>
            <Paragraph type="secondary" style={{ marginBottom: 16, fontSize: 13 }}>{recommendation.description}</Paragraph>
            <Title level={5} style={{ fontSize: 13, marginBottom: 8 }}>Recommendations:</Title>
            <List size="small" dataSource={recommendation.recommendations} renderItem={(item: string) => (
              <List.Item style={{ padding: '4px 0', border: 'none' }}>
                <ArrowRightOutlined style={{ color: '#6366f1', marginRight: 8, fontSize: 12 }} />
                <Text style={{ fontSize: 13 }}>{item}</Text>
              </List.Item>
            )} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function OverallRecommendations() {
  const { setSelectedTab } = usePostCall();
  const [filtersVisible, setFiltersVisible] = useState(false);

  const tabItems = [
    { key: 'agent-performance', label: <><UserOutlined /> Agent Performance</>, children: mockAgentPerformanceRecommendations.map((r, i) => <RecommendationCard key={r.id} recommendation={r} index={i} />) },
    { key: 'operational-level', label: <><SettingOutlined /> Operational Level</>, children: mockOperationalLevelRecommendations.map((r, i) => <RecommendationCard key={r.id} recommendation={r} index={i} />) },
    { key: 'specific-issues', label: <><RiseOutlined /> Specific Issues</>, children: mockSpecificIssuesRecommendations.map((r, i) => <RecommendationCard key={r.id} recommendation={r} index={i} />) },
    { key: 'business-impact', label: <><DollarOutlined /> Business Impact</>, children: mockBusinessImpactRecommendations.map((r, i) => <RecommendationCard key={r.id} recommendation={r} index={i} />) },
  ];

  return (
    <ConfigProvider theme={{ components: { Card: { headerBg: 'transparent' }, Button: { borderRadius: 8 } } }}>
      <div className="p-6 space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }, body: { padding: 24 } }}
            title={
              <div className="flex items-center gap-3">
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setSelectedTab("reports")} style={{ marginRight: 8 }} />
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                  <RiseOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Overall Recommendations Report</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>Comprehensive analysis with actionable recommendations</Text>
                </div>
              </div>
            }
            extra={<Button type={filtersVisible ? "primary" : "default"} icon={<FilterOutlined />} onClick={() => setFiltersVisible(!filtersVisible)}>Filters</Button>}
          >
            <AnimatePresence>
              {filtersVisible && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <Card size="small" style={{ marginBottom: 20, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1"><Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Date Range</Text><RangePicker style={{ width: '100%' }} /></div>
                      <Button type="primary">Search</Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            <Tabs items={tabItems} />
          </Card>
        </motion.div>
      </div>
      <AIHelper />
    </ConfigProvider>
  );
}
