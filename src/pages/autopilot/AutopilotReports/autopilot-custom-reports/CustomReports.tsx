import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  Typography, 
  ConfigProvider,
  Button, 
  Badge,
  Space,
  Skeleton,
  DatePicker
} from "antd";
import { 
  ArrowLeftOutlined, 
  SettingOutlined, 
  FilterOutlined, 
  ReloadOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

import { CommonTableReport } from "./common-table-report/CommonTableReport";
import { CommonBarChartReport } from "./common-bar-chart-report/CommonBarChartReport";
import { CommonPieChartReport } from "./common-pie-chart-report/CommonPieChartReport";
import { CommonTreemapChartReport } from "./common-treemap-chart-report/CommonTreemapChartReport";

interface DateRangeValue {
  type: string;
  from: Date | null;
  to: Date | null;
  displayValue: string;
}

// Types
export interface CustomReport {
  id: string;
  report_name: string;
  description: string;
  colSize: string;
  reportType: "table_report" | "barChart_report" | "lineChart_report" | "areaChart_report" | "pieChart_report" | "donutChart_report" | "treeChart_report";
  reportFields: {
    columns?: string[];
    X?: string;
    Y?: string;
  };
}

// Mock data - simulating API response
const mockCustomReports: CustomReport[] = [
  {
    id: "1",
    report_name: "Daily Call Volume",
    description: "Track daily call volumes across all channels",
    colSize: "6",
    reportType: "barChart_report",
    reportFields: {
      X: "Date",
      Y: "Call Count"
    }
  },
  {
    id: "2",
    report_name: "Intent Distribution",
    description: "Distribution of customer intents",
    colSize: "6",
    reportType: "pieChart_report",
    reportFields: {
      X: "Intent",
      Y: "Count"
    }
  },
  {
    id: "3",
    report_name: "Agent Performance",
    description: "Top performing agents summary",
    colSize: "12",
    reportType: "table_report",
    reportFields: {
      columns: ["Agent", "Calls", "Avg Time", "Satisfaction"]
    }
  },
  {
    id: "4",
    report_name: "Category Breakdown",
    description: "Hierarchical view of call categories",
    colSize: "6",
    reportType: "treeChart_report",
    reportFields: {
      X: "Category",
      Y: "Count"
    }
  },
  {
    id: "5",
    report_name: "Weekly Trends",
    description: "Call volume trends over the week",
    colSize: "6",
    reportType: "lineChart_report",
    reportFields: {
      X: "Day",
      Y: "Calls"
    }
  },
  {
    id: "6",
    report_name: "Resolution Rate",
    description: "Donut chart showing resolution rates",
    colSize: "6",
    reportType: "donutChart_report",
    reportFields: {
      X: "Status",
      Y: "Count"
    }
  }
];

interface CustomReportsProps {
  onBack: () => void;
}

export default function CustomReports({ onBack }: CustomReportsProps) {
  const [dataLoading, setDataLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [noRecordFound, setNoRecordFound] = useState(false);
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    setNumberOfFilters(dateRange ? 1 : 0);
  }, [dateRange]);

  useEffect(() => {
    loadCustomizedReport();
  }, []);

  const loadCustomizedReport = () => {
    setDataLoading(true);
    setErrorLoading(false);
    setNoRecordFound(false);

    // Simulate API call
    setTimeout(() => {
      try {
        if (mockCustomReports.length === 0) {
          setNoRecordFound(true);
        }
        setCustomReports(mockCustomReports);
        setDataLoading(false);
        setErrorLoading(false);
      } catch (error) {
        setDataLoading(false);
        setErrorLoading(true);
        setNoRecordFound(false);
      }
    }, 800);
  };

  const gotoConfig = () => {
    // Navigate to configuration page
  };

  const renderReport = (report: CustomReport) => {
    // Convert Ant Design date range to DateRangeValue for child components
    const convertedDateRange: DateRangeValue | null = dateRange ? {
      type: 'custom',
      from: dateRange[0] ? dateRange[0].toDate() : null,
      to: dateRange[1] ? dateRange[1].toDate() : null,
      displayValue: dateRange[0] && dateRange[1] 
        ? `${dateRange[0].format('YYYY-MM-DD')} - ${dateRange[1].format('YYYY-MM-DD')}`
        : dateRange[0] 
        ? dateRange[0].format('YYYY-MM-DD')
        : ''
    } : null;

    switch (report.reportType) {
      case "table_report":
        return (
          <CommonTableReport
            key={report.id}
            customReport={report}
            selectedDateRange={convertedDateRange}
          />
        );
      case "barChart_report":
      case "lineChart_report":
      case "areaChart_report":
        return (
          <CommonBarChartReport
            key={report.id}
            customReport={report}
            selectedDateRange={convertedDateRange}
          />
        );
      case "pieChart_report":
      case "donutChart_report":
        return (
          <CommonPieChartReport
            key={report.id}
            customReport={report}
            selectedDateRange={convertedDateRange}
          />
        );
      case "treeChart_report":
        return (
          <CommonTreemapChartReport
            key={report.id}
            customReport={report}
            selectedDateRange={convertedDateRange}
          />
        );
      default:
        return null;
    }
  };

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
          transition={{ duration: 0.5 }}
        >
          <Card
            style={{ 
              borderRadius: 12, 
              border: '1px solid #e2e8f0'
            }}
            styles={{ 
              header: { borderBottom: '1px solid #e2e8f0', padding: '16px 24px' },
              body: { padding: 24 }
            }}
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={onBack}
                    style={{ 
                      borderRadius: 8,
                      height: 40,
                      width: 40
                    }}
                  />
                  <div 
                    style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 8, 
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <SettingOutlined style={{ color: 'white', fontSize: 20 }} />
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Custom Reports</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      View and manage your custom autopilot reports
                    </Text>
                  </div>
                </div>
                <Space>
                  <Badge count={numberOfFilters} size="small" offset={[-5, 5]}>
                    <Button 
                      type={filtersOpen ? "primary" : "default"}
                      icon={<FilterOutlined />}
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      style={{ borderRadius: 8 }}
                    />
                  </Badge>
                  <Button
                    type="default"
                    icon={<SettingOutlined />}
                    onClick={gotoConfig}
                    style={{ borderRadius: 8 }}
                    title="Report Configurations"
                  />
                </Space>
              </div>
            }
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Collapsible Filters */}
              <AnimatePresence>
                {filtersOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <Card
                      size="small"
                      style={{ 
                        background: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: 12
                      }}
                      styles={{ body: { padding: 16 } }}
                    >
                      <RangePicker 
                        style={{ minWidth: 200 }}
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates)}
                      />
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content */}
              {dataLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 16, marginTop: 12 }}>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton.Input key={i} active block style={{ height: 300, borderRadius: 12 }} />
                  ))}
                </div>
              ) : errorLoading ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ color: '#ef4444', marginBottom: 16 }}>
                    <SettingOutlined style={{ fontSize: 64 }} />
                  </div>
                  <Title level={3} style={{ marginBottom: 8, color: '#ef4444' }}>Error Loading Reports</Title>
                  <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>Something went wrong while loading the reports.</Text>
                  <Button 
                    onClick={loadCustomizedReport} 
                    icon={<ReloadOutlined />}
                    type="primary"
                  >
                    Try Again
                  </Button>
                </div>
              ) : noRecordFound ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ color: '#94a3b8', marginBottom: 16 }}>
                    <SettingOutlined style={{ fontSize: 64 }} />
                  </div>
                  <Title level={3} style={{ marginBottom: 8 }}>No Custom Reports Found</Title>
                  <Text type="secondary" style={{ display: 'block' }}>Configure custom reports in the settings to see them here.</Text>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16, marginTop: 12 }}>
                  {customReports.map((report) => renderReport(report))}
                </div>
              )}
            </Space>
          </Card>
        </motion.div>
      </div>
    </ConfigProvider>
  );
}
