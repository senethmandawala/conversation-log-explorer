import { useState } from "react";
import { Card, Tabs, Typography, Tooltip, Button, Space, Statistic } from "antd";
import { 
  InfoCircleOutlined, 
  CalendarOutlined, 
  ReloadOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { usePostCall } from "@/contexts/PostCallContext";
import { CaseStatusOverall } from "./CaseStatusOverall";
import { CaseStatusTopCategories } from "./CaseStatusTopCategories";
import { CaseStatusTopAgents } from "./CaseStatusTopAgents";
import { AverageTimeTopCategories } from "./AverageTimeTopCategories";
import { AverageTimeTopAgents } from "./AverageTimeTopAgents";

const { Title, Text } = Typography;

interface SelectedCategory {
  name: string;
  color: string;
}

export default function CallResolutionReportAntd() {
  const { setSelectedTab } = usePostCall();
  const [activeTab, setActiveTab] = useState("resolution-status");
  
  const [selectedCaseType, setSelectedCaseType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  
  const [col1Visible, setCol1Visible] = useState(true);
  const [col2Visible, setCol2Visible] = useState(false);
  const [col3Visible, setCol3Visible] = useState(false);
  
  const [col1Flex, setCol1Flex] = useState(24);
  const [col2Flex, setCol2Flex] = useState(12);
  const [col3Flex, setCol3Flex] = useState(12);

  const [averageTime] = useState("8.5 min");
  const [callCount] = useState("1,234");

  const handleCaseSelect = (caseType: string) => {
    setSelectedCaseType(caseType);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Flex(12);
    setCol2Flex(12);
    setCol3Flex(12);
  };

  const handleCaseStatusCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(true);
    setCol1Flex(6);
    setCol2Flex(8);
    setCol3Flex(10);
  };

  const handleAverageTimeCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol1Flex(12);
    setCol2Flex(12);
  };

  const handleCloseCategoryChart = () => {
    setSelectedCaseType("");
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setCol1Flex(24);
    setCol2Flex(12);
    setCol3Flex(12);
  };

  const handleCloseAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Flex(12);
    setCol2Flex(12);
    setCol3Flex(12);
  };

  const handleCloseAverageTimeAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol1Flex(24);
    setCol2Flex(12);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setSelectedCaseType("");
    setSelectedCategory(null);
    setCol1Flex(24);
    setCol2Flex(12);
    setCol3Flex(12);
  };

  const tabItems = [
    {
      key: "resolution-status",
      label: "Resolution Status",
      children: (
        <div style={{ display: "flex", gap: 16 }}>
          <AnimatePresence mode="sync">
            {col1Visible && (
              <motion.div
                key="col1-status"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ flex: col1Flex }}
              >
                <CaseStatusOverall onCaseSelect={handleCaseSelect} />
              </motion.div>
            )}

            {col2Visible && selectedCaseType && (
              <motion.div
                key="col2-status"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{ flex: col2Flex }}
              >
                <CaseStatusTopCategories
                  selectedCaseType={selectedCaseType}
                  onCategorySelect={handleCaseStatusCategorySelect}
                  onClose={handleCloseCategoryChart}
                />
              </motion.div>
            )}

            {col3Visible && selectedCategory && (
              <motion.div
                key="col3-status"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{ flex: col3Flex }}
              >
                <CaseStatusTopAgents
                  selectedCaseType={selectedCaseType}
                  selectedCategory={selectedCategory}
                  onClose={handleCloseAgentChart}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ),
    },
    {
      key: "average-time",
      label: "Average Resolution Time",
      children: (
        <>
          <Card
            size="small"
            style={{
              marginBottom: 16,
              borderRadius: 12,
              background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Average Resolution Time</Text>
                <div className="flex items-baseline gap-2 mt-1">
                  <Statistic
                    value={averageTime}
                    valueStyle={{ fontSize: 28, fontWeight: 700 }}
                  />
                  <Text type="secondary">from {callCount} calls</Text>
                </div>
              </div>
            </div>
          </Card>

          <div style={{ display: "flex", gap: 16 }}>
            <AnimatePresence mode="sync">
              {col1Visible && (
                <motion.div
                  key="col1-avgtime"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ flex: col1Flex }}
                >
                  <AverageTimeTopCategories onCategorySelect={handleAverageTimeCategorySelect} />
                </motion.div>
              )}

              {col2Visible && selectedCategory && (
                <motion.div
                  key="col2-avgtime"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  style={{ flex: col2Flex }}
                >
                  <AverageTimeTopAgents
                    selectedCategory={selectedCategory}
                    onClose={handleCloseAverageTimeAgentChart}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      ),
    },
  ];

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 16,
        border: "1px solid hsl(var(--border))",
      }}
      styles={{
        header: {
          borderBottom: "1px solid hsl(var(--border))",
          padding: "16px 20px",
        },
        body: { padding: "20px" },
      }}
      title={
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setSelectedTab("reports")}
            style={{ marginRight: 8 }}
          />
          <div>
            <div className="flex items-center gap-2">
              <Title level={5} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                Call Resolution
              </Title>
              <Tooltip title="Track resolution rates and handling times">
                <InfoCircleOutlined style={{ color: "hsl(var(--muted-foreground))", cursor: "help" }} />
              </Tooltip>
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Resolution status and average handling time analysis
            </Text>
          </div>
        </div>
      }
      extra={
        <Space>
          <Button type="text" icon={<CalendarOutlined />}>Today</Button>
          <Button type="text" icon={<ReloadOutlined />} onClick={handleCloseCategoryChart} />
        </Space>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        style={{ marginTop: -8 }}
      />
    </Card>
  );
}
