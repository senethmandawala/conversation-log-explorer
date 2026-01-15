import React, { useState, useEffect } from "react";
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Typography,
  Progress,
  Skeleton,
  Pagination,
  ConfigProvider
} from "antd";
import { 
  IconChevronDown,
  IconChevronUp,
  IconChartBar,
  IconUser
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface Agent {
  name: string;
  percentage: number;
  progressPercentage: number;
}

interface ViolationData {
  violationType: string;
  distribution: string;
  distributionValue: number;
  affectedAgents: number;
  expanded?: boolean;
  agents: Agent[];
}

// Mock data
const mockViolationData: ViolationData[] = [
  {
    violationType: "Script Deviation",
    distribution: "35%",
    distributionValue: 35,
    affectedAgents: 12,
    agents: [
      { name: "John Smith", percentage: 45, progressPercentage: 45 },
      { name: "Sarah Johnson", percentage: 38, progressPercentage: 38 },
      { name: "Mike Wilson", percentage: 32, progressPercentage: 32 },
      { name: "Emily Davis", percentage: 28, progressPercentage: 28 },
    ],
  },
  {
    violationType: "Hold Time Exceeded",
    distribution: "28%",
    distributionValue: 28,
    affectedAgents: 8,
    agents: [
      { name: "David Brown", percentage: 52, progressPercentage: 52 },
      { name: "Lisa Anderson", percentage: 41, progressPercentage: 41 },
      { name: "Chris Martinez", percentage: 35, progressPercentage: 35 },
    ],
  },
  {
    violationType: "Tone Issues",
    distribution: "22%",
    distributionValue: 22,
    affectedAgents: 10,
    agents: [
      { name: "Mike Wilson", percentage: 48, progressPercentage: 48 },
      { name: "Jennifer Lee", percentage: 39, progressPercentage: 39 },
      { name: "Robert Taylor", percentage: 31, progressPercentage: 31 },
    ],
  },
  {
    violationType: "Compliance Issues",
    distribution: "15%",
    distributionValue: 15,
    affectedAgents: 5,
    agents: [
      { name: "Emily Davis", percentage: 55, progressPercentage: 55 },
      { name: "Thomas White", percentage: 42, progressPercentage: 42 },
    ],
  },
];

export default function ViolationWiseAnalysis() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ViolationData[]>(mockViolationData);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const toggleRowExpand = (violationType: string) => {
    setData(prev => prev.map(item =>
      item.violationType === violationType ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const getDistributionColor = (value: number) => {
    if (value >= 30) return "red";
    if (value >= 20) return "orange";
    return "green";
  };

  // Table columns definition
  const columns: ColumnsType<ViolationData> = [
    {
      title: 'Violation Type',
      dataIndex: 'violationType',
      key: 'violationType',
      render: (text: string) => (
        <Tag color="purple" className="rounded-md">{text}</Tag>
      ),
    },
    {
      title: 'Violation Proportion',
      dataIndex: 'distribution',
      key: 'distribution',
      render: (text: string, record: ViolationData) => (
        <Tag color={getDistributionColor(record.distributionValue)} className="rounded-xl font-semibold">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Affected Agents',
      dataIndex: 'affectedAgents',
      key: 'affectedAgents',
      align: 'center' as const,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center' as const,
      render: (_, record: ViolationData) => (
        <Button
          type="text"
          icon={record.expanded ? <IconChevronUp /> : <IconChevronDown />}
          onClick={() => toggleRowExpand(record.violationType)}
        />
      ),
    },
  ];

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
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
        },
      }}
    >
      <div className="mt-6">
        <Title level={5} className="mb-4">Violation-wise Analysis</Title>

        {loading ? (
          <div className="flex justify-center py-12">
            <Skeleton.Input active className="w-[200px]" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <Text type="secondary">No violation data available</Text>
          </div>
        ) : (
          <>
            <div className="rounded-xl overflow-hidden border border-slate-200">
              {/* Table Header */}
              <div className="flex bg-slate-50 border-b border-slate-200">
                <div className="flex-[3] px-4 py-3 font-semibold text-slate-600">Violation Type</div>
                <div className="flex-[2] px-4 py-3 font-semibold text-slate-600">Violation Proportion</div>
                <div className="flex-[2] px-4 py-3 font-semibold text-slate-600">Affected Agents</div>
                <div className="flex-1 px-4 py-3 font-semibold text-slate-600 text-center">Actions</div>
              </div>
              
              {/* Table Body with Expanded Rows */}
              {paginatedData.map((violation, index) => (
                <div key={violation.violationType}>
                  {/* Main Row */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex border-b border-slate-200 hover:bg-slate-50 transition-colors ${violation.expanded ? 'bg-slate-50' : ''}`}
                  >
                    <div className="flex-[3] px-4 py-3">
                      <Tag color="purple" className="rounded-md">{violation.violationType}</Tag>
                    </div>
                    <div className="flex-[2] px-4 py-3">
                      <Tag color={getDistributionColor(violation.distributionValue)} className="rounded-xl font-semibold">
                        {violation.distribution}
                      </Tag>
                    </div>
                    <div className="flex-[2] px-4 py-3">
                      {violation.affectedAgents}
                    </div>
                    <div className="flex-1 px-4 py-3 text-center">
                      <Button
                        type="text"
                        icon={violation.expanded ? <IconChevronUp /> : <IconChevronDown />}
                        onClick={() => toggleRowExpand(violation.violationType)}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Expanded Content */}
                  <AnimatePresence>
                    {violation.expanded && (
                      <motion.div
                        key={`${violation.violationType}-expanded`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-slate-200 bg-slate-50"
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <IconUser className="text-indigo-500" />
                            <Text strong className="text-sm">Agents with {violation.violationType}</Text>
                          </div>
                          <div className="flex flex-col gap-3">
                            {violation.agents.map((agent, agentIndex) => (
                              <div key={agentIndex} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                  <Text strong className="text-sm">{agent.name}</Text>
                                  <Text type="secondary" className="text-sm">{agent.percentage}%</Text>
                                </div>
                                <Progress 
                                  percent={agent.progressPercentage} 
                                  size="small"
                                  className="!m-0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Pagination - Right aligned */}
            {totalPages > 1 && (
              <div className="flex justify-end mt-4">
                <Pagination
                  total={data.length}
                  pageSize={pageSize}
                  current={currentPage}
                  onChange={(page) => setCurrentPage(page)}
                  showTotal={(total, range) => (
                    <Text type="secondary">
                      Showing <Text strong>{range[0]}-{range[1]}</Text> of <Text strong>{total}</Text> results
                    </Text>
                  )}
                  showSizeChanger={true}
                  pageSizeOptions={['5', '8', '10', '20']}
                />
              </div>
            )}
          </>
        )}
      </div>
    </ConfigProvider>
  );
}
