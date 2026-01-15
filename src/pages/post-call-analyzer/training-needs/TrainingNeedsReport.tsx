import { useState, useEffect } from "react";
import { 
  Card, 
  Table, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Tag, 
  Space, 
  Row, 
  Col, 
  Typography,
  Skeleton,
  ConfigProvider
} from "antd";
import { 
  IconSearch, 
  IconFilter, 
  IconArrowLeft,
  IconAlertTriangle,
  IconBook,
  IconTrendingUp,
  IconTrendingDown
} from "@tabler/icons-react";
import { usePostCall } from "@/contexts/PostCallContext";
import { AIHelper } from "@/components/post-call/AIHelper";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock data
const mockTrainingAreasData = [
  { key: "1", training_type: "Product Knowledge", count: 45 },
  { key: "2", training_type: "Communication Skills", count: 38 },
  { key: "3", training_type: "Technical Support", count: 32 },
  { key: "4", training_type: "Problem Solving", count: 28 },
  { key: "5", training_type: "Customer Service Excellence", count: 25 },
  { key: "6", training_type: "Time Management", count: 22 },
  { key: "7", training_type: "Conflict Resolution", count: 18 },
];

const mockAgentSkillsGap = [
  { key: "1", agent_name: "John Smith", skills_gap: "Product Knowledge, Technical Support, Communication Skills" },
  { key: "2", agent_name: "Sarah Johnson", skills_gap: "Problem Solving, Time Management" },
  { key: "3", agent_name: "Mike Davis", skills_gap: "Customer Service Excellence, Conflict Resolution" },
  { key: "4", agent_name: "Emily Wilson", skills_gap: "Product Knowledge, Communication Skills" },
  { key: "5", agent_name: "Chris Brown", skills_gap: "Technical Support, Problem Solving, Time Management" },
  { key: "6", agent_name: "Lisa Anderson", skills_gap: "Product Knowledge, Customer Service Excellence" },
  { key: "7", agent_name: "David Martinez", skills_gap: "Communication Skills, Conflict Resolution" },
];

const callTypes = [
  { value: "all", label: "All Call Types" },
  { value: "inbound", label: "Inbound" },
  { value: "outbound", label: "Outbound" },
];

export default function TrainingNeedsAnalysisReport() {
  const { setSelectedTab } = usePostCall();
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [selectedCallType, setSelectedCallType] = useState<string | undefined>(undefined);

  // Stats
  const highPriorityAreas = 3;
  const agentsRequiringTraining = 24;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const activeFiltersCount = [agentName, selectedCallType].filter(Boolean).length;

  const clearAllFilters = () => {
    setAgentName("");
    setSelectedCallType(undefined);
  };

  const trainingAreasColumns: ColumnsType<typeof mockTrainingAreasData[0]> = [
    {
      title: 'Training Type',
      dataIndex: 'training_type',
      key: 'training_type',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      align: 'right' as const,
      render: (count: number) => (
        <Tag color="blue" className="rounded-full font-semibold">{count}</Tag>
      ),
    },
  ];

  const agentSkillsColumns: ColumnsType<typeof mockAgentSkillsGap[0]> = [
    {
      title: 'Agent Name',
      dataIndex: 'agent_name',
      key: 'agent_name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Recommended Trainings',
      dataIndex: 'skills_gap',
      key: 'skills_gap',
      render: (skills: string) => (
        <Space wrap>
          {skills.split(", ").map((skill, index) => (
            <Tag 
              key={index} 
              style={{ 
                background: '#f0f5ff', 
                border: '1px solid #adc6ff', 
                color: '#2f54eb',
                borderRadius: 6,
              }}
            >
              {skill}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#475569',
            headerSortActiveBg: '#f1f5f9',
            rowHoverBg: '#f8fafc',
            borderColor: '#e2e8f0',
          },
          Card: {
            headerBg: 'transparent',
          },
          Select: {
            borderRadius: 8,
          },
          Input: {
            borderRadius: 8,
          },
          Button: {
            borderRadius: 8,
          },
        },
      }}
    >
      <div className="p-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className="rounded-xl border-slate-200"
            styles={{
              header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' },
              body: { padding: 24 }
            }}
            title={
              <div className="flex items-center gap-3">
                <Button 
                  type="text" 
                  icon={<IconArrowLeft />} 
                  onClick={() => setSelectedTab("reports")}
                  className="mr-2"
                />
                <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <IconBook className="text-white text-xl" />
                </div>
                <div>
                  <Title level={5} className="!m-0 !font-semibold">Training Needs Analysis</Title>
                  <Text type="secondary" className="text-[13px]">
                    Identify areas where agents require additional training and development
                  </Text>
                </div>
              </div>
            }
            extra={
              <Space>
                <Button 
                  type={filtersVisible ? "primary" : "default"}
                  icon={<IconFilter />}
                  onClick={() => setFiltersVisible(!filtersVisible)}
                >
                  Filters
                  {activeFiltersCount > 0 && (
                    <Tag color="red" className="ml-2 rounded-full">{activeFiltersCount}</Tag>
                  )}
                </Button>
              </Space>
            }
          >
            {/* Filters Panel */}
            <AnimatePresence>
              {filtersVisible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Card
                    size="small"
                    className="mb-5 bg-slate-50 border-slate-200 rounded-xl"
                    styles={{ body: { padding: 16 } }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Date Range</Text>
                          <RangePicker className="w-full" />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Search Agent</Text>
                          <Input
                            placeholder="Search agent..."
                            prefix={<IconSearch className="text-slate-400" />}
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div className="space-y-1.5">
                          <Text type="secondary" className="text-xs font-medium">Call Type</Text>
                          <Select
                            placeholder="All Call Types"
                            className="w-full"
                            allowClear
                            value={selectedCallType}
                            onChange={setSelectedCallType}
                            options={callTypes}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6} className="flex items-end">
                        <Space className="w-full justify-end">
                          <Button onClick={clearAllFilters}>Clear</Button>
                          <Button type="primary">Search</Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Cards */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24} sm={12}>
                <StatCard
                  label="High Priority Training Areas"
                  value={highPriorityAreas.toString()}
                  icon={<IconAlertTriangle />}
                  color="#f59e0b"
                  gradientColors={["#f59e0b", "#d97706"] as [string, string]}
                  isLoading={loading}
                />
              </Col>
              <Col xs={24} sm={12}>
                <StatCard
                  label="Agents Requiring Training"
                  value={agentsRequiringTraining.toString()}
                  icon={<IconBook />}
                  color="#8b5cf6"
                  gradientColors={["#8b5cf6", "#7c3aed"] as [string, string]}
                  isLoading={loading}
                />
              </Col>
            </Row>

            {/* Training Areas Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Title level={5} className="mb-4">Training Areas</Title>
              <Table
                columns={trainingAreasColumns}
                dataSource={mockTrainingAreasData}
                loading={loading}
                pagination={false}
                className="rounded-xl overflow-hidden"
              />
            </motion.div>

            {/* Agent Skills Gap Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Title level={5} className="mb-4">Agent Skills Gap</Title>
              <Table
                columns={agentSkillsColumns}
                dataSource={mockAgentSkillsGap}
                loading={loading}
                pagination={{ pageSize: 5, showSizeChanger: false }}
                className="rounded-xl overflow-hidden"
              />
            </motion.div>
          </Card>
        </motion.div>
      </div>
      <AIHelper />
    </ConfigProvider>
  );
}
