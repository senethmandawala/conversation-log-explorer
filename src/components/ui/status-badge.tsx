import React from 'react';
import { TablerIcon } from './tabler-icon';

interface StatusBadgeProps {
  title: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'accent' | 'success' | 'amber' | 'warn' | 'basic';
  fullWidth?: boolean;
  icon?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  title, 
  size = 'xs', 
  color = 'primary', 
  fullWidth = false, 
  icon 
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'xs': return { fontSize: '0.7rem' };
      case 'sm': return { fontSize: '0.875rem' };
      case 'md': return { fontSize: '1rem' };
      case 'lg': return { fontSize: '1.125rem' };
      case 'xl': return { fontSize: '1.25rem' };
      default: return { fontSize: '0.7rem' };
    }
  };

  const getColorStyle = () => {
    switch (color) {
      case 'primary': 
        return { backgroundColor: '#dbeafe', color: '#3b82f6', border: '1px solid #3b82f6' };
      case 'accent': 
        return { backgroundColor: '#f3e8ff', color: '#a855f7', border: '1px solid #a855f7' };
      case 'success': 
        return { backgroundColor: '#dcfce7', color: '#22c55e', border: '1px solid #22c55e' };
      case 'amber': 
        return { backgroundColor: '#fef3c7', color: '#f59e0b', border: '1px solid #f59e0b' };
      case 'warn': 
        return { backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #ef4444' };
      case 'basic': 
        return { backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' };
      default: 
        return { backgroundColor: '#dbeafe', color: '#3b82f6', border: '1px solid #3b82f6' };
    }
  };

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.25rem 0.625rem',
        borderRadius: '0.5rem',
        fontWeight: 600,
        fontSize: '0.75rem',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        minWidth: 'fit-content',
        width: fullWidth ? '100%' : 'auto',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
        ...getColorStyle()
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
        {icon && (
          <TablerIcon name={icon} size={16} />
        )}
        <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
          {title}
        </span>
      </span>
    </span>
  );
};

export default StatusBadge;
