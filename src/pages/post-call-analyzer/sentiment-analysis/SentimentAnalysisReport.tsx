import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip, Tabs } from "antd";
import { 
  IconArrowLeft, 
  IconInfoCircle, 
  IconRefresh, 
  IconCalendar, 
  IconList,
  IconHeart
} from "@tabler/icons-react";
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
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle" orientation="horizontal">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconHeart className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-xl !font-semibold">
                    Sentiment Analysis
                  </Title>
                  <Tooltip title="Analyze user and agent sentiment patterns">
                    <div className="-mt-1">
                      <TablerIcon 
                        name="info-circle" 
                        className="wn-tabler-14"
                        size={14}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" className="text-sm">
                  User and agent sentiment distribution across calls
                </Text>
              </div>
            </Space>
            
            <Space size="small" orientation="horizontal">
              <DatePicker 
                suffixIcon={<IconCalendar />}
                className="rounded-lg"
              />
              <Button 
                type="text" 
                icon={<IconRefresh />}
                onClick={handleReload}
                className="w-9 h-9"
              />
              <Button 
                type="text" 
                icon={<IconList />}
                className="w-9 h-9"
              />
            </Space>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="w-full"
          size="large"
          items={[
            {
              key: "callers",
              label: "Callers",
              children: (
                <div className="mt-6">
                  <div className="grid grid-cols-12 gap-4">
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
                <div className="mt-6">
                  <div className="grid grid-cols-12 gap-4">
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
