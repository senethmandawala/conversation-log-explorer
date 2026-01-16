import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { 
  IconPhone,
  IconCircleCheck,
  IconClock,
  IconArrowUp,
  IconArrowDown
} from '@tabler/icons-react';

const { Title, Text } = Typography;

interface WideStatCardProps {
  color: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  rightItems?: { label: string; value: string; tooltip?: string }[];
}

const WideStatCard: React.FC<WideStatCardProps> = ({ 
  color, 
  icon, 
  label, 
  value, 
  trend, 
  rightItems 
}) => {
  const colorConfig: Record<string, { gradient: string; iconBg: string; border: string; glow: string; textColor: string; gradientColors: [string, string] }> = {
    blue: {
      gradient: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.05) 50%, transparent 100%)",
      iconBg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      border: "1px solid rgba(59,130,246,0.2)",
      glow: "0 0 30px -5px rgba(59,130,246,0.3)",
      textColor: "#3b82f6",
      gradientColors: ["#3b82f6", "#2563eb"]
    },
    green: {
      gradient: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.05) 50%, transparent 100%)",
      iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      border: "1px solid rgba(16,185,129,0.2)",
      glow: "0 0 30px -5px rgba(16,185,129,0.3)",
      textColor: "#10b981",
      gradientColors: ["#10b981", "#059669"]
    },
    red: {
      gradient: "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 50%, transparent 100%)",
      iconBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      border: "1px solid rgba(239,68,68,0.2)",
      glow: "0 0 30px -5px rgba(239,68,68,0.3)",
      textColor: "#ef4444",
      gradientColors: ["#ef4444", "#dc2626"]
    },
    amber: {
      gradient: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 50%, transparent 100%)",
      iconBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      border: "1px solid rgba(245,158,11,0.2)",
      glow: "0 0 30px -5px rgba(245,158,11,0.3)",
      textColor: "#f59e0b",
      gradientColors: ["#f59e0b", "#d97706"]
    },
    purple: {
      gradient: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0.05) 50%, transparent 100%)",
      iconBg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      border: "1px solid rgba(139,92,246,0.2)",
      glow: "0 0 30px -5px rgba(139,92,246,0.3)",
      textColor: "#8b5cf6",
      gradientColors: ["#8b5cf6", "#7c3aed"]
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <Card
      className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-black/[0.08] shadow-lg transition-all duration-300"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.01)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{ background: config.gradient }} 
      />
      
      <div className="relative p-4">
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} lg={12}>
            <Row gutter={[12, 12]} align="middle">
              <Col>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: config.iconBg }}
                >
                  <div className="text-white text-xl">
                    {icon}
                  </div>
                </div>
              </Col>
              <Col flex="auto">
                <div className="text-sm font-semibold mb-1" style={{ color: config.textColor }}>
                  {label}
                </div>
                <div className="text-[28px] font-bold leading-none" style={{ color: config.textColor }}>
                  {value}
                </div>
              </Col>
            </Row>
          </Col>
          {rightItems && (
            <Col xs={24} lg={12}>
              <Row gutter={[12, 12]} justify="end">
                {rightItems.map((item, index) => (
                  <Col key={index}>
                    <div className="text-center py-1.5 px-3 rounded-lg bg-white/60 backdrop-blur-sm border border-black/10">
                      <Title level={5} className="!m-0 !text-lg !font-bold">{item.value}</Title>
                      <Text type="secondary" className="text-[10px] font-medium mt-0.5 block">{item.label}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          )}
        </Row>
      </div>
    </Card>
  );
};

export default WideStatCard;
