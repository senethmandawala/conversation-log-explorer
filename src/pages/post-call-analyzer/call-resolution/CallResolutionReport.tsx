import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip, Tabs } from "antd";
import { 
  LeftOutlined, 
  InfoCircleOutlined, 
  ReloadOutlined, 
  CalendarOutlined, 
  UnorderedListOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { TablerIcon } from "@/components/ui/tabler-icon";
import { CaseStatusOverall } from "./CaseStatusOverall";
import { CaseStatusTopCategories } from "./CaseStatusTopCategories";
import { CaseStatusTopAgents } from "./CaseStatusTopAgents";
import { AverageTimeTopCategories } from "./AverageTimeTopCategories";
import { AverageTimeTopAgents } from "./AverageTimeTopAgents";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedCategory {
  name: string;
  color: string;
}

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function CallResolutionReport() {
  const { setSelectedTab } = usePostCall();
  const [activeTab, setActiveTab] = useState("resolution-status");
  
  const [selectedCaseType, setSelectedCaseType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  
  const [col1Visible, setCol1Visible] = useState(true);
  const [col2Visible, setCol2Visible] = useState(false);
  const [col3Visible, setCol3Visible] = useState(false);
  
  const [col1Class, setCol1Class] = useState("col-span-12");
  const [col2Class, setCol2Class] = useState("col-span-6");
  const [col3Class, setCol3Class] = useState("col-span-6");

  const [averageTime, setAverageTime] = useState("8.5 min");
  const [callCount, setCallCount] = useState("1,234");

  const handleCaseSelect = (caseType: string) => {
    setSelectedCaseType(caseType);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
  };

  const handleCaseStatusCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(true);
    setCol1Class("col-span-3");
    setCol2Class("col-span-4");
    setCol3Class("col-span-5");
  };

  const handleAverageTimeCategorySelect = (category: SelectedCategory) => {
    setSelectedCategory(category);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
  };

  const handleCloseCategoryChart = () => {
    setSelectedCaseType("");
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
  };

  const handleCloseAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(true);
    setCol3Visible(false);
    setCol1Class("col-span-6");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
  };

  const handleCloseAverageTimeAgentChart = () => {
    setSelectedCategory(null);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCol1Visible(true);
    setCol2Visible(false);
    setCol3Visible(false);
    setSelectedCaseType("");
    setSelectedCategory(null);
    setCol1Class("col-span-12");
    setCol2Class("col-span-6");
    setCol3Class("col-span-6");
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
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
                <PhoneOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                    Call Resolution
                  </Title>
                  <Tooltip title="Track resolution rates and handling times">
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
                  Resolution status and average handling time analysis
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

        
        <div style={{ marginTop: 16 }}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          style={{ width: '100%' }}
          size="large"
        >
          <TabPane tab="Resolution Status" key="resolution-status">
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
                <AnimatePresence mode="sync">
                  {col1Visible && (
                    <motion.div
                      key="col1-status"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      style={{ gridColumn: `span ${getColSpan(col1Class)}` }}
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
                      style={{ gridColumn: `span ${getColSpan(col2Class)}` }}
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
                      style={{ gridColumn: `span ${getColSpan(col3Class)}` }}
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
            </div>
          </TabPane>

          <TabPane tab="Average Resolution Time" key="average-time">
            <div style={{ marginTop: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <Card
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e8e8e8',
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, marginBottom: 4 }}>Average Resolution Time</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <h2 style={{ fontSize: 32, fontWeight: 'bold', color: 'white', margin: 0 }}>{averageTime}</h2>
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>from {callCount} calls</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
                <AnimatePresence mode="sync">
                  {col1Visible && (
                    <motion.div
                      key="col1-avgtime"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      style={{ gridColumn: `span ${getColSpan(col1Class)}` }}
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
                      style={{ gridColumn: `span ${getColSpan(col2Class)}` }}
                    >
                      <AverageTimeTopAgents
                        selectedCategory={selectedCategory}
                        onClose={handleCloseAverageTimeAgentChart}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </TabPane>
        </Tabs>
        </div>
      </Space>
    </Card>
  );
}
