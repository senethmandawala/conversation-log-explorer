import React from 'react';
import { Skeleton } from 'antd';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  gradientColors: [string, string];
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon, 
  color, 
  gradientColors, 
  isLoading = false 
}) => {
  if (isLoading) {
    return <Skeleton.Input active block style={{ height: 80 }} />;
  }

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${color}30`,
        background: `${color}08`,
        height: '100%',
        minHeight: 120,
        transition: 'all 0.3s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
      className="hover:shadow-lg d-flex align-items-center justify-content-between p-4"
    >
      <div
        className="d-flex align-items-center justify-content-center rounded-4 me-3"
        style={{
          width: 48,
          height: 48,
          padding: 12,
          background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
          boxShadow: `0 4px 12px ${color}40`,
          flexShrink: 0,
        }}
      >
        <div className="text-white fs-5">
          {icon}
        </div>
      </div>
      <div className="flex-grow-1 text-end">
        <div style={{ 
          fontSize: 14, 
          color: color, 
          fontWeight: 600, 
          marginBottom: 8 
        }}>
          {label}
        </div>
        <div style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          color: color,
          lineHeight: 1,
          whiteSpace: 'nowrap'
        }}>
          {value}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
