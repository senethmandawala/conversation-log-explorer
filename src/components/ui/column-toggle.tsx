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
    <div style={{ maxHeight: 300, overflowY: 'auto', minWidth: 200 }}>
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-border">
        <Text strong style={{ fontSize: 13 }}>Toggle Columns</Text>
        <Button type="link" size="small" onClick={onReset}>
          Reset
        </Button>
      </div>
      <Space orientation="vertical" style={{ width: '100%' }}>
        {toggleableColumns.map(col => (
          <Checkbox
            key={col.def}
            checked={col.visible}
            onChange={() => onToggle(col.def)}
          >
            <Text style={{ fontSize: 13 }}>{col.label}</Text>
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
        style={{ padding: 4 }}
      />
    </Popover>
  );
};

export default ColumnToggle;
