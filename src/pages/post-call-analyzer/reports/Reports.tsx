import { useState } from "react";
import { 
  Card, 
  Typography, 
  ConfigProvider,
  Badge
} from "antd";
import { 
  FileTextOutlined, 
  FallOutlined,
  WarningOutlined,
  BookOutlined,
  InfoCircleOutlined,
  PieChartOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  AudioMutedOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  available: boolean;
}

const reportCards: ReportCard[] = [
  {
    id: "training-needs",
    title: "Training Needs Analysis Report",
    description: "Identify areas where agents require additional training and development",
    icon: <BookOutlined style={{ fontSize: 24 }} />,
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.1)",
    available: true,
  },
  {
    id: "unresolved-cases",
    title: "Unresolved Cases Analysis Report",
    description: "Monitor and analyze calls requiring escalation or remaining unresolved",
    icon: <InfoCircleOutlined style={{ fontSize: 24 }} />,
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
    available: true,
  },
  {
    id: "bad-practice",
    title: "Bad Practice Analysis",
    description: "Identify non-compliance with standard procedures and quality guidelines",
    icon: <WarningOutlined style={{ fontSize: 24 }} />,
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    available: true,
  },
  {
    id: "category-trend",
    title: "Category Trend Analysis",
    description: "Track how customer inquiry categories change over time. This report helps spot trends in call volumes.",
    icon: <PieChartOutlined style={{ fontSize: 24 }} />,
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
    available: true,
  },
  {
    id: "churn-analysis",
    title: "Churn Analysis",
    description: "Track how customer inquiry categories change over time. This report helps spot trends in call volumes.",
    icon: <FallOutlined style={{ fontSize: 24 }} />,
    color: "#f43f5e",
    bgColor: "rgba(244, 63, 94, 0.1)",
    available: true,
  },
  {
    id: "overall-recommendations",
    title: "Overall Recommendations",
    description: "Our comprehensive analysis of call center operations has identified critical performance gaps affecting customer experience and operational efficiency.",
    icon: <BarChartOutlined style={{ fontSize: 24 }} />,
    color: "#6366f1",
    bgColor: "rgba(99, 102, 241, 0.1)",
    available: true,
  },
  {
    id: "geographic-distribution",
    title: "Geographic Distribution Map",
    description: "Visualize customer care issues across different locations with interactive pie charts",
    icon: <EnvironmentOutlined style={{ fontSize: 24 }} />,
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    available: true,
  },
  {
    id: "silence-reason",
    title: "Silence Reason Report",
    description: "Analyze and view reasons for silence detected in calls",
    icon: <AudioMutedOutlined style={{ fontSize: 24 }} />,
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.1)",
    available: true,
  },
  {
    id: "agent-comparison",
    title: "Agent wise comparison Report",
    description: "Compare performance metrics across different agents",
    icon: <TeamOutlined style={{ fontSize: 24 }} />,
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.1)",
    available: true,
  },
];

export default function Reports() {
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const { setSelectedTab, setSelectedReportId } = usePostCall();

  const handleReportClick = (reportId: string) => {
    setSelectedReportId(reportId);
    setSelectedTab("report-detail");
  };

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
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            style={{ 
              borderRadius: 12, 
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
            styles={{ 
              header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' },
              body: { padding: 24 }
            }}
            title={
              <div className="flex items-center gap-3">
                <div 
                  style={{ 
                    width: 42, 
                    height: 42, 
                    borderRadius: 12, 
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <FileTextOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Reports</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Generate and view detailed analytics reports
                  </Text>
                </div>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportCards.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setIsHovering(report.id)}
                  onMouseLeave={() => setIsHovering(null)}
                  onClick={() => report.available && handleReportClick(report.id)}
                  style={{
                    position: 'relative',
                    cursor: report.available ? 'pointer' : 'not-allowed',
                    opacity: report.available ? 1 : 0.5,
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    background: `linear-gradient(135deg, ${report.bgColor} 0%, transparent 100%)`,
                    padding: 20,
                    transition: 'all 0.3s ease',
                    transform: isHovering === report.id && report.available ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isHovering === report.id && report.available 
                      ? `0 12px 24px -8px ${report.color}30` 
                      : '0 1px 3px rgba(0, 0, 0, 0.05)',
                    borderColor: isHovering === report.id && report.available ? `${report.color}50` : '#e2e8f0',
                  }}
                >
                  {/* Icon */}
                  <div 
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                      transition: 'all 0.3s ease',
                      transform: isHovering === report.id ? 'scale(1.1)' : 'scale(1)',
                      borderColor: isHovering === report.id ? `${report.color}30` : '#e2e8f0',
                    }}
                  >
                    <span style={{ color: report.color }}>{report.icon}</span>
                  </div>

                  {/* Title */}
                  <Title 
                    level={5} 
                    style={{ 
                      margin: '0 0 8px 0', 
                      fontWeight: 600,
                      transition: 'color 0.3s ease',
                      color: isHovering === report.id ? report.color : '#1e293b',
                    }}
                  >
                    {report.title}
                  </Title>

                  {/* Description */}
                  <Text 
                    type="secondary" 
                    style={{ 
                      fontSize: 13,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {report.description}
                  </Text>

                  {/* Arrow indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: isHovering === report.id ? 1 : 0, 
                      x: isHovering === report.id ? 0 : -10 
                    }}
                    style={{
                      position: 'absolute',
                      bottom: 20,
                      right: 20,
                    }}
                  >
                    <ArrowRightOutlined style={{ color: report.color, fontSize: 18 }} />
                  </motion.div>

                  {/* Not available badge */}
                  {!report.available && (
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <SafetyOutlined style={{ color: '#94a3b8', fontSize: 16 }} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
      <AIHelper />
    </ConfigProvider>
  );
}
