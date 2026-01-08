import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { 
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

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
      style={{ 
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        border: config.border,
        boxShadow: config.glow,
        transition: 'all 0.3s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.01)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Background gradient */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: config.gradient
        }} 
      />
      
      <div style={{ position: 'relative', padding: 16 }}>
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} lg={12}>
            <Row gutter={[12, 12]} align="middle">
              <Col>
                <div 
                  style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 12, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: config.iconBg,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ color: 'white', fontSize: 20 }}>
                    {icon}
                  </div>
                </div>
              </Col>
              <Col flex="auto">
                <div style={{ 
                  fontSize: 14, 
                  color: config.textColor, 
                  fontWeight: 600, 
                  marginBottom: 8 
                }}>
                  {label}
                </div>
                <div style={{ 
                  fontSize: 28, 
                  fontWeight: 700, 
                  color: config.textColor,
                  lineHeight: 1,
                  whiteSpace: 'nowrap'
                }}>
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
                    <div 
                      style={{ 
                        textAlign: 'center', 
                        padding: '6px 12px', 
                        borderRadius: 8, 
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <Title level={5} style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{item.value}</Title>
                      <Text type="secondary" style={{ fontSize: 10, fontWeight: 500, marginTop: 2, display: 'block' }}>{item.label}</Text>
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
