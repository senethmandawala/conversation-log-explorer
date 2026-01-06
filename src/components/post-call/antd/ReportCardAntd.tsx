import { Card, Button, Tooltip, Space, Typography, Spin, Empty } from "antd";
import { 
  CalendarOutlined, 
  InfoCircleOutlined,
  ReloadOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const { Title, Text } = Typography;

interface ReportCardAntdProps {
  title: string;
  description?: string;
  subtitle?: string;
  loading?: boolean;
  children?: ReactNode;
  onRefresh?: () => void;
  showDateFilter?: boolean;
  dateFilterLabel?: string;
  extra?: ReactNode;
  accentColor?: string;
  showAccentLine?: boolean;
  bodyStyle?: React.CSSProperties;
  delay?: number;
}

export function ReportCardAntd({
  title,
  description,
  subtitle,
  loading = false,
  children,
  onRefresh,
  showDateFilter = true,
  dateFilterLabel = "Today",
  extra,
  accentColor = "hsl(226, 70%, 55%)",
  showAccentLine = false,
  bodyStyle,
  delay = 0,
}: ReportCardAntdProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
        bordered={false}
        className="overflow-hidden"
        style={{
          borderRadius: 16,
          border: "1px solid hsl(var(--border))",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
        styles={{
          header: {
            borderBottom: "1px solid hsl(var(--border))",
            padding: "16px 20px",
          },
          body: {
            padding: "20px",
            ...bodyStyle,
          },
        }}
        title={
          <div className="flex items-start gap-3">
            {showAccentLine && (
              <div
                style={{
                  width: 4,
                  height: 32,
                  borderRadius: 4,
                  background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}80 100%)`,
                }}
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                  {title}
                </Title>
                {description && (
                  <Tooltip title={description}>
                    <InfoCircleOutlined 
                      style={{ 
                        color: "hsl(var(--muted-foreground))",
                        fontSize: 14,
                        cursor: "help",
                      }} 
                    />
                  </Tooltip>
                )}
              </div>
              {subtitle && (
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {subtitle}
                </Text>
              )}
            </div>
          </div>
        }
        extra={
          <Space size="small">
            {showDateFilter && (
              <Button
                type="text"
                size="small"
                icon={<CalendarOutlined />}
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {dateFilterLabel}
              </Button>
            )}
            {onRefresh && (
              <Tooltip title="Refresh">
                <Button
                  type="text"
                  size="small"
                  icon={<ReloadOutlined spin={loading} />}
                  onClick={onRefresh}
                  style={{ color: "hsl(var(--muted-foreground))" }}
                />
              </Tooltip>
            )}
            {extra}
          </Space>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spin size="large" />
          </div>
        ) : children ? (
          children
        ) : (
          <Empty 
            description="No data available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </motion.div>
  );
}
