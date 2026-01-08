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
  DownOutlined,
  UpOutlined,
  BarChartOutlined,
  UserOutlined
} from "@ant-design/icons";
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
        <Tag color="purple" style={{ borderRadius: 6 }}>{text}</Tag>
      ),
    },
    {
      title: 'Violation Proportion',
      dataIndex: 'distribution',
      key: 'distribution',
      render: (text: string, record: ViolationData) => (
        <Tag color={getDistributionColor(record.distributionValue)} style={{ borderRadius: 12, fontWeight: 600 }}>
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
          icon={record.expanded ? <UpOutlined /> : <DownOutlined />}
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
        <Title level={5} style={{ marginBottom: 16 }}>Violation-wise Analysis</Title>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Skeleton.Input active style={{ width: 200 }} />
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Text type="secondary">No violation data available</Text>
          </div>
        ) : (
          <>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              {/* Table Header */}
              <div style={{ display: 'flex', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ flex: 3, padding: '12px 16px', fontWeight: 600, color: '#475569' }}>Violation Type</div>
                <div style={{ flex: 2, padding: '12px 16px', fontWeight: 600, color: '#475569' }}>Violation Proportion</div>
                <div style={{ flex: 2, padding: '12px 16px', fontWeight: 600, color: '#475569' }}>Affected Agents</div>
                <div style={{ flex: 1, padding: '12px 16px', fontWeight: 600, color: '#475569', textAlign: 'center' }}>Actions</div>
              </div>
              
              {/* Table Body with Expanded Rows */}
              {paginatedData.map((violation, index) => (
                <div key={violation.violationType}>
                  {/* Main Row */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ 
                      display: 'flex',
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: violation.expanded ? '#fafafa' : 'transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = violation.expanded ? '#fafafa' : '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = violation.expanded ? '#fafafa' : 'transparent'}
                  >
                    <div style={{ flex: 3, padding: '12px 16px' }}>
                      <Tag color="purple" style={{ borderRadius: 6 }}>{violation.violationType}</Tag>
                    </div>
                    <div style={{ flex: 2, padding: '12px 16px' }}>
                      <Tag color={getDistributionColor(violation.distributionValue)} style={{ borderRadius: 12, fontWeight: 600 }}>
                        {violation.distribution}
                      </Tag>
                    </div>
                    <div style={{ flex: 2, padding: '12px 16px' }}>
                      {violation.affectedAgents}
                    </div>
                    <div style={{ flex: 1, padding: '12px 16px', textAlign: 'center' }}>
                      <Button
                        type="text"
                        icon={violation.expanded ? <UpOutlined /> : <DownOutlined />}
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
                        style={{ 
                          borderBottom: '1px solid #e2e8f0',
                          backgroundColor: '#fafafa'
                        }}
                      >
                        <div style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <UserOutlined style={{ color: '#6366f1' }} />
                            <Text strong style={{ fontSize: 14 }}>Agents with {violation.violationType}</Text>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {violation.agents.map((agent, agentIndex) => (
                              <div key={agentIndex} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Text strong style={{ fontSize: 14 }}>{agent.name}</Text>
                                  <Text type="secondary" style={{ fontSize: 14 }}>{agent.percentage}%</Text>
                                </div>
                                <Progress 
                                  percent={agent.progressPercentage} 
                                  size="small"
                                  style={{ margin: 0 }}
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
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
