import { useState } from "react";
import { Card, Tabs, Typography, Tooltip, Button, Space } from "antd";
import { 
  InfoCircleOutlined, 
  CalendarOutlined, 
  ReloadOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { usePostCall } from "@/contexts/PostCallContext";
import { UsersSentiment } from "./UsersSentiment";
import { SentimentTopCategories } from "./SentimentTopCategories";
import { SentimentTopAgents } from "./SentimentTopAgents";
import { AgentsSentiment } from "./AgentsSentiment";
import { AgentsSentimentTopCategory } from "./AgentsSentimentTopCategory";
import { AgentsSentimentTopAgents } from "./AgentsSentimentTopAgents";

const { Title, Text } = Typography;

interface SelectedCategory {
  name: string;
  color: string;
}

export default function SentimentAnalysisReportAntd() {
  const { setSelectedTab } = usePostCall();
  const [activeTab, setActiveTab] = useState("callers");
  
  const [selectedSentiment, setSelectedSentiment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  
  const [col1Visible, setCol1Visible] = useState(true);
  const [col2Visible, setCol2Visible] = useState(false);
  const [col3Visible, setCol3Visible] = useState(false);
  
  const [col1Class, setCol1Class] = useState(24);
  const [col2Class, setCol2Class] = useState(12);
  const [col3Class, setCol3Class] = useState(10);

  const handleUserSentimentSelect = (sentiment: string) => {
    setSelectedSentiment(sentiment);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class(12);
    setCol2Class(12);
    setCol3Class(10);
  };

  const handleAgentSentimentSelect = (sentiment: string) => {
    setSelectedSentiment(sentiment);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class(12);
    setCol2Class(12);
    setCol3Class(10);
  };

  const handleCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(true);
    setCol1Class(6);
    setCol2Class(8);
    setCol3Class(10);
  };

  const handleCloseCategoryChart = () => {
    setSelectedSentiment("");
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setCol1Class(24);
    setCol2Class(12);
    setCol3Class(10);
  };

  const handleCloseAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class(12);
    setCol2Class(12);
    setCol3Class(10);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setSelectedSentiment("");
    setSelectedCategory(null);
    setCol1Class(24);
    setCol2Class(12);
    setCol3Class(10);
  };

  const tabItems = [
    {
      key: "callers",
      label: "Callers",
      children: (
        <div className="grid grid-cols-24 gap-4" style={{ display: "flex", gap: 16 }}>
          <AnimatePresence mode="sync">
            {col1Visible && (
              <motion.div
                key="col1-callers"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ flex: col1Class }}
              >
                <UsersSentiment onSentimentSelect={handleUserSentimentSelect} />
              </motion.div>
            )}

            {col2Visible && selectedSentiment && (
              <motion.div
                key="col2-callers"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{ flex: col2Class }}
              >
                <SentimentTopCategories
                  selectedSentiment={selectedSentiment}
                  onCategorySelect={handleCategorySelect}
                  onClose={handleCloseCategoryChart}
                />
              </motion.div>
            )}

            {col3Visible && selectedCategory && (
              <motion.div
                key="col3-callers"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{ flex: col3Class }}
              >
                <SentimentTopAgents
                  selectedSentiment={selectedSentiment}
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
      key: "agents",
      label: "Agents",
      children: (
        <div className="grid grid-cols-24 gap-4" style={{ display: "flex", gap: 16 }}>
          <AnimatePresence mode="sync">
            {col1Visible && (
              <motion.div
                key="col1-agents"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ flex: col1Class }}
              >
                <AgentsSentiment onSentimentSelect={handleAgentSentimentSelect} />
              </motion.div>
            )}

            {col2Visible && selectedSentiment && (
              <motion.div
                key="col2-agents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{ flex: col2Class }}
              >
                <AgentsSentimentTopCategory
                  selectedSentiment={selectedSentiment}
                  onCategorySelect={handleCategorySelect}
                  onClose={handleCloseCategoryChart}
                />
              </motion.div>
            )}

            {col3Visible && selectedCategory && (
              <motion.div
                key="col3-agents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{ flex: col3Class }}
              >
                <AgentsSentimentTopAgents
                  selectedSentiment={selectedSentiment}
                  selectedCategory={selectedCategory}
                  onClose={handleCloseAgentChart}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
                Sentiment Analysis
              </Title>
              <Tooltip title="Analyze user and agent sentiment patterns">
                <InfoCircleOutlined style={{ color: "hsl(var(--muted-foreground))", cursor: "help" }} />
              </Tooltip>
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              User and agent sentiment distribution across calls
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
