import { Button, Checkbox, Popover, Space, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { ColumnDefinition } from '@/utils/envConfig';

const { Text } = Typography;

interface ColumnToggleProps {
  columns: ColumnDefinition[];
  onToggle: (def: string) => void;
  onReset: () => void;
}

export const ColumnToggle = ({ columns, onToggle, onReset }: ColumnToggleProps) => {
  const toggleableColumns = columns.filter(col => col.checkboxVisible);

  const content = (
    <div className="max-h-[300px] overflow-y-auto min-w-[200px]">
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-border">
        <Text strong className="text-[13px]">Toggle Columns</Text>
        <Button type="link" size="small" onClick={onReset}>
          Reset
        </Button>
      </div>
      <Space orientation="vertical" className="w-full">
        {toggleableColumns.map(col => (
          <Checkbox
            key={col.def}
            checked={col.visible}
            onChange={() => onToggle(col.def)}
          >
            <Text className="text-[13px]">{col.label}</Text>
          </Checkbox>
        ))}
      </Space>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
    >
      <Button 
        type="text"
        icon={<SettingOutlined />}
        className="p-1"
      />
    </Popover>
  );
};

export default ColumnToggle;
