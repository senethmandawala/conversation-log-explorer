import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip, Tabs } from "antd";
import { 
  LeftOutlined, 
  InfoCircleOutlined, 
  ReloadOutlined, 
  CalendarOutlined, 
  UnorderedListOutlined,
  HeartOutlined
} from "@ant-design/icons";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { TablerIcon } from "@/components/ui/tabler-icon";

const { Title, Text } = Typography;
import { UsersSentiment } from "./UsersSentiment";
import { SentimentTopCategories } from "./SentimentTopCategories";
import { SentimentTopAgents } from "./SentimentTopAgents";
import { AgentsSentiment } from "./AgentsSentiment";
import { AgentsSentimentTopCategory } from "./AgentsSentimentTopCategory";
import { AgentsSentimentTopAgents } from "./AgentsSentimentTopAgents";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedCategory {
  name: string;
  color: string;
}

export default function SentimentAnalysisReport() {
  const { setSelectedTab } = usePostCall();
  const [activeTab, setActiveTab] = useState("callers");
  
  const [selectedSentiment, setSelectedSentiment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  
  const [col1Visible, setCol1Visible] = useState(true);
  const [col2Visible, setCol2Visible] = useState(false);
  const [col3Visible, setCol3Visible] = useState(false);
  
  const [col1Class, setCol1Class] = useState("col-span-12");
  const [col2Class, setCol2Class] = useState("col-span-6");
  const [col3Class, setCol3Class] = useState("col-span-5");

  const handleUserSentimentSelect = (sentiment: string) => {
    setSelectedSentiment(sentiment);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleAgentSentimentSelect = (sentiment: string) => {
    setSelectedSentiment(sentiment);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(true);
    setCol1Class("col-span-3");
    setCol2Class("col-span-4");
    setCol3Class("col-span-5");
  };

  const handleCloseCategoryChart = () => {
    setSelectedSentiment("");
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleCloseAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setSelectedSentiment("");
    setSelectedCategory(null);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-5");
  };

  const handleReload = () => {
    handleCloseCategoryChart();
  };

  const getColSpan = (colClass: string) => {
    if (colClass === "col-span-12") return 12;
    if (colClass === "col-span-6") return 6;
    if (colClass === "col-span-5") return 5;
    if (colClass === "col-span-3") return 3;
    if (colClass === "col-span-4") return 4;
    return 12;
  };

  return (
    <Card
      style={{
        borderRadius: 12,
        border: '1px solid #e8e8e8',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '16px 16px 16px 16px'
      }}
    >
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ marginTop: -12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Space align="center" size="middle" orientation="horizontal">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <HeartOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                    Sentiment Analysis
                  </Title>
                  <Tooltip title="Analyze user and agent sentiment patterns">
                    <div style={{ marginTop: '-4px' }}>
                      <TablerIcon 
                        name="info-circle" 
                        className="wn-tabler-14"
                        size={14}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  User and agent sentiment distribution across calls
                </Text>
              </div>
            </Space>
            
            <Space size="small" orientation="horizontal">
              <DatePicker 
                suffixIcon={<CalendarOutlined />}
                style={{ 
                  borderRadius: 8,
                  borderColor: '#d9d9d9'
                }}
                placeholder="Select date"
              />
              <Button 
                type="text" 
                icon={<ReloadOutlined />}
                onClick={handleReload}
                style={{ width: 36, height: 36 }}
              />
              <Button 
                type="text" 
                icon={<UnorderedListOutlined />}
                style={{ width: 36, height: 36 }}
              />
            </Space>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          style={{ width: '100%' }}
          size="large"
          items={[
            {
              key: "callers",
              label: "Callers",
              children: (
                <div style={{ marginTop: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
                    <AnimatePresence mode="sync">
                      {col1Visible && (
                        <motion.div
                          key="col1-callers"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col1Class)}` }}
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
                          style={{ gridColumn: `span ${getColSpan(col2Class)}` }}
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
                          style={{ gridColumn: `span ${getColSpan(col3Class)}` }}
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
                </div>
              )
            },
            {
              key: "agents",
              label: "Agents",
              children: (
                <div style={{ marginTop: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
                    <AnimatePresence mode="sync">
                      {col1Visible && (
                        <motion.div
                          key="col1-agents"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          style={{ gridColumn: `span ${getColSpan(col1Class)}` }}
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
                          style={{ gridColumn: `span ${getColSpan(col2Class)}` }}
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
                          style={{ gridColumn: `span ${getColSpan(col3Class)}` }}
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
                </div>
              )
            }
          ]}
        />
      </Space>
    </Card>
  );
}
