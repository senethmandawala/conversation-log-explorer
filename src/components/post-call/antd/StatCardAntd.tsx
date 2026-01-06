import { Card, Statistic, Typography } from "antd";
import { 
  PhoneOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FolderOpenOutlined,
  FieldTimeOutlined,
  AudioMutedOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Text } = Typography;

interface StatCardAntdProps {
  title: string;
  value: string | number;
  icon: string;
  color: "blue" | "green" | "purple" | "red" | "amber" | "orange";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  phone: <PhoneOutlined />,
  check: <CheckCircleOutlined />,
  clock: <ClockCircleOutlined />,
  folder: <FolderOpenOutlined />,
  timer: <FieldTimeOutlined />,
  volume: <AudioMutedOutlined />,
};

const colorConfig: Record<string, { 
  gradient: string; 
  iconBg: string; 
  iconColor: string;
  border: string;
  glow: string;
}> = {
  blue: {
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)",
    iconBg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    iconColor: "#fff",
    border: "rgba(59,130,246,0.2)",
    glow: "0 0 20px -5px rgba(59,130,246,0.3)",
  },
  green: {
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)",
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    iconColor: "#fff",
    border: "rgba(16,185,129,0.2)",
    glow: "0 0 20px -5px rgba(16,185,129,0.3)",
  },
  purple: {
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 100%)",
    iconBg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    iconColor: "#fff",
    border: "rgba(139,92,246,0.2)",
    glow: "0 0 20px -5px rgba(139,92,246,0.3)",
  },
  red: {
    gradient: "linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.04) 100%)",
    iconBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    iconColor: "#fff",
    border: "rgba(239,68,68,0.2)",
    glow: "0 0 20px -5px rgba(239,68,68,0.3)",
  },
  amber: {
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%)",
    iconBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    iconColor: "#fff",
    border: "rgba(245,158,11,0.2)",
    glow: "0 0 20px -5px rgba(245,158,11,0.3)",
  },
  orange: {
    gradient: "linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.04) 100%)",
    iconBg: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    iconColor: "#fff",
    border: "rgba(249,115,22,0.2)",
    glow: "0 0 20px -5px rgba(249,115,22,0.3)",
  },
};

export function StatCardAntd({ title, value, icon, color, trend, delay = 0 }: StatCardAntdProps) {
  const config = colorConfig[color] || colorConfig.blue;
  const IconComponent = iconMap[icon] || <PhoneOutlined />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
        bordered={false}
        className="h-full overflow-hidden"
        style={{
          background: config.gradient,
          borderRadius: 16,
          border: `1px solid ${config.border}`,
          boxShadow: config.glow,
          transition: "all 0.3s ease",
        }}
        styles={{
          body: { padding: 16 }
        }}
        hoverable
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center text-xl"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: config.iconBg,
              color: config.iconColor,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {IconComponent}
          </div>
          <div className="flex-1 min-w-0">
            <Text
              type="secondary"
              style={{
                fontSize: 12,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {title}
            </Text>
            <div className="flex items-baseline gap-2 mt-1">
              <Statistic
                value={value}
                valueStyle={{
                  fontSize: 24,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              />
              {trend && (
                <span
                  className="flex items-center gap-0.5 text-xs font-medium"
                  style={{
                    color: trend.isPositive ? "#10b981" : "#ef4444",
                  }}
                >
                  {trend.isPositive ? (
                    <ArrowUpOutlined style={{ fontSize: 10 }} />
                  ) : (
                    <ArrowDownOutlined style={{ fontSize: 10 }} />
                  )}
                  {trend.value}%
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
