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
    return <Skeleton.Input active block className="h-20" />;
  }

  return (
    <div
      className="rounded-xl h-full min-h-[120px] transition-all duration-300 shadow-sm hover:shadow-lg d-flex align-items-center justify-content-start p-4"
      style={{
        border: `1px solid ${color}30`,
        background: `${color}08`,
      }}
    >
      <div
        className="w-12 h-12 p-3 rounded-2xl d-flex align-items-center justify-content-center me-3 flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
          boxShadow: `0 4px 12px ${color}40`,
        }}
      >
        <div className="text-white fs-5">
          {icon}
        </div>
      </div>
      <div className="flex-grow-1 text-start">
        <div className="text-sm font-semibold mb-2" style={{ color: color }}>
          {label}
        </div>
        <div className="text-[28px] font-bold leading-none whitespace-nowrap" style={{ color: color }}>
          {value}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
