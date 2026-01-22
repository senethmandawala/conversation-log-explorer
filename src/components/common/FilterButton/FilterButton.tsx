import React, { useState } from 'react';
import { Button, Dropdown, Checkbox, Divider } from 'antd';
import { IconFilter, IconX } from '@tabler/icons-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterButtonProps {
  filterGroups: FilterGroup[];
  appliedFilters: Record<string, string[]>;
  onApplyFilters: (filters: Record<string, string[]>) => void;
  size?: 'small' | 'middle' | 'large';
}

const FilterButton: React.FC<FilterButtonProps> = ({
  filterGroups,
  appliedFilters,
  onApplyFilters,
  size = 'small'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Record<string, string[]>>(appliedFilters);

  // Count total applied filters
  const appliedFilterCount = Object.values(appliedFilters).reduce(
    (count, values) => count + values.length,
    0
  );

  const handleOpen = (open: boolean) => {
    if (open) {
      // Reset temp filters to current applied filters when opening
      setTempFilters({ ...appliedFilters });
    }
    setIsOpen(open);
  };

  const handleCheckboxChange = (groupId: string, value: string, checked: boolean) => {
    setTempFilters(prev => {
      const currentValues = prev[groupId] || [];
      if (checked) {
        return { ...prev, [groupId]: [...currentValues, value] };
      } else {
        return { ...prev, [groupId]: currentValues.filter(v => v !== value) };
      }
    });
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempFilters({ ...appliedFilters });
    setIsOpen(false);
  };

  const handleClearAll = () => {
    const clearedFilters: Record<string, string[]> = {};
    filterGroups.forEach(group => {
      clearedFilters[group.id] = [];
    });
    setTempFilters(clearedFilters);
  };

  const filterPanel = (
    <div className="bg-card border border-border rounded-lg shadow-lg p-4 min-w-[280px] max-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        <button
          onClick={handleClearAll}
          className="text-xs text-primary hover:text-primary/80 transition-colors"
        >
          Clear All
        </button>
      </div>

      <Divider className="my-3" />

      {/* Filter Groups */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {filterGroups.map((group) => (
          <div key={group.id}>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {group.label}
            </h4>
            <div className="space-y-2">
              {group.options.map((option) => (
                <Checkbox
                  key={option.value}
                  checked={(tempFilters[group.id] || []).includes(option.value)}
                  onChange={(e) => handleCheckboxChange(group.id, option.value, e.target.checked)}
                  className="text-sm"
                >
                  {option.label}
                </Checkbox>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Divider className="my-3" />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button
          size="small"
          onClick={handleCancel}
          className="rounded-md"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={handleApply}
          className="rounded-md"
        >
          Apply
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => filterPanel}
      trigger={['click']}
      placement="bottomRight"
      open={isOpen}
      onOpenChange={handleOpen}
    >
      <Button
        type="default"
        size={size}
        icon={<IconFilter className={size === 'small' ? 'h-4 w-4' : 'h-5 w-5'} />}
        className={`${size === 'small' ? 'h-8 text-xs rounded-sm' : 'h-10 rounded-md'} border-2 hover:border-primary/50 transition-all duration-200 relative`}
      >
        <span className="font-medium">Filters</span>
        {appliedFilterCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
            {appliedFilterCount}
          </span>
        )}
      </Button>
    </Dropdown>
  );
};

export default FilterButton;
