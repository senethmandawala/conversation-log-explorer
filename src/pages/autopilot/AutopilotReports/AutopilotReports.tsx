import { useState } from "react";
import { 
  Card, 
  Typography, 
  ConfigProvider,
  Badge
} from "antd";
import { 
  FileTextOutlined, 
  BarChartOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ArrowRightOutlined,
  SafetyOutlined,
  SettingOutlined,
  CalendarOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { AIHelper } from "@/components/post-call/AIHelper";
import ReportTransactionSummary from "./autopilot-transaction-summary/ReportTransactionSummary";
import ReportDocumentAccessFrequency from "./autopilot-document-access-frequency/ReportDocumentAccessFrequency";
import ReportAverageCallDuration from "./autopilot-average-call-duration/ReportAverageCallDuration";
import ReportWeeklyTrends from "./autopilot-weekly-trends/ReportWeeklyTrends";
import ReportSuccessFailure from "./autopilot-success-failure/ReportSuccessFailure";
import ReportTokenUsage from "./autopilot-token-usage/ReportTokenUsage";
import ReportCustomized from "./autopilot-custom-reports/CustomReports";

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
    id: "transaction",
    title: "Transaction Summary Report",
    description: "View detailed transaction summaries and patterns across autopilot interactions",
    icon: <FileTextOutlined style={{ fontSize: 24 }} />,
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.1)",
    available: true,
  },
  {
    id: "document",
    title: "Document Access Frequency",
    description: "Track document access patterns and frequency in autopilot conversations",
    icon: <BarChartOutlined style={{ fontSize: 24 }} />,
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.1)",
    available: true,
  },
  {
    id: "customized",
    title: "Customized Reports",
    description: "View and manage your custom autopilot reports",
    icon: <SettingOutlined style={{ fontSize: 24 }} />,
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
    available: true,
  },
  {
    id: "weekly-trends",
    title: "Weekly Traffic Trends",
    description: "Analyze weekly traffic patterns and trends in autopilot usage",
    icon: <CalendarOutlined style={{ fontSize: 24 }} />,
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.1)",
    available: true,
  },
  {
    id: "success-failure",
    title: "Success/Failure Rate Analysis",
    description: "Monitor success and failure rates over time for autopilot interactions",
    icon: <BarChartOutlined style={{ fontSize: 24 }} />,
    color: "#ec4899",
    bgColor: "rgba(236, 72, 153, 0.1)",
    available: true,
  },
  {
    id: "token-usage",
    title: "Token Usage Report",
    description: "Track AI token consumption and costs across autopilot services",
    icon: <DollarOutlined style={{ fontSize: 24 }} />,
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.1)",
    available: true,
  },
  {
    id: "average-call-duration",
    title: "Average Call Duration",
    description: "Analyze call duration statistics and trends for autopilot conversations",
    icon: <ClockCircleOutlined style={{ fontSize: 24 }} />,
    color: "#6366f1",
    bgColor: "rgba(99, 102, 241, 0.1)",
    available: true,
  },
];

const { Title, Text } = Typography;

export default function AutopilotReports() {
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const handleReportClick = (reportId: string) => {
    setActiveReport(reportId);
  };

  const handleBack = () => {
    setActiveReport(null);
  };

  if (activeReport) {
    switch (activeReport) {
      case "transaction":
        return <ReportTransactionSummary onBack={handleBack} />;
      case "document":
        return <ReportDocumentAccessFrequency onBack={handleBack} />;
      case "customized":
        return <ReportCustomized onBack={handleBack} />;
      case "weekly-trends":
        return <ReportWeeklyTrends onBack={handleBack} />;
      case "success-failure":
        return <ReportSuccessFailure onBack={handleBack} />;
      case "token-usage":
        return <ReportTokenUsage onBack={handleBack} />;
      case "average-call-duration":
        return <ReportAverageCallDuration onBack={handleBack} />;
      default:
        return null;
    }
  }

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
                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <FileTextOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Autopilot Reports</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Generate and view detailed autopilot analytics reports
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
