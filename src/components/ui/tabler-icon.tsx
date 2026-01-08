import React from 'react';

interface TablerIconProps {
  name: string;
  className?: string;
  size?: number;
  title?: string;
}

export const TablerIcon: React.FC<TablerIconProps> = ({ name, className = '', size = 18, title }) => {
  return (
    <i 
      className={`ti ti-${name} ${className}`}
      style={{ 
        fontSize: `${size}px`
      }}
      title={title}
    />
  );
};

export default TablerIcon;
