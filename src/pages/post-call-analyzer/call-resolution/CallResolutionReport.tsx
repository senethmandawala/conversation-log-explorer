import { useState, useEffect } from "react";
import { Card, Typography, Space, DatePicker, Button, Tooltip, Tabs } from "antd";
import { 
  IconArrowLeft, 
  IconInfoCircle, 
  IconRefresh, 
  IconCalendar, 
  IconList,
  IconPhone
} from "@tabler/icons-react";
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
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle" orientation="horizontal">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconPhone className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-xl !font-semibold">
                    Call Resolution
                  </Title>
                  <Tooltip title="Track resolution rates and handling times">
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
                  Resolution status and average handling time analysis
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

        
        <div className="mt-4">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="w-full"
          size="large"
          items={[
            {
              key: "resolution-status",
              label: "Resolution Status",
              children: (
                <div className="mt-6">
                  <div className="grid grid-cols-12 gap-4">
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
              )
            },
            {
              key: "average-time",
              label: "Average Resolution Time",
              children: (
                <div className="mt-6">
                  <div className="mb-4">
                    <Card className="rounded-xl border-gray-200 bg-gradient-to-br from-blue-500 to-blue-600 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm mb-1">Average Resolution Time</p>
                          <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-bold text-white m-0">{averageTime}</h2>
                            <span className="text-white/80 text-sm">from {callCount} calls</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-12 gap-4">
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
              )
            }
          ]}
        />
        </div>
      </Space>
    </Card>
  );
}
