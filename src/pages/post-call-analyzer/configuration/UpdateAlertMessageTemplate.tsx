import { useState } from "react";
import { 
  Button, 
  Input, 
  Typography, 
  Card,
  Spin,
  message
} from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const { TextArea } = Input;

interface UpdateAlertMessageTemplateProps {
  messageTemplateHeader?: string;
  messageTemplate?: string;
}

export default function UpdateAlertMessageTemplate({
  messageTemplateHeader: initialHeader = "",
  messageTemplate: initialTemplate = "",
}: UpdateAlertMessageTemplateProps) {
  const [contentLoading, setContentLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [messageTemplateHeader, setMessageTemplateHeader] = useState(initialHeader);
  const [messageTemplate, setMessageTemplate] = useState(initialTemplate);
  const messageTemplateHint = "Available Placeholders: {agent_name}, {current_value}, {threshold}";

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleUpdate = () => {
    setIsEditMode(false);
    message.success("Message template updated successfully");
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setMessageTemplateHeader(initialHeader);
    setMessageTemplate(initialTemplate);
  };

  if (contentLoading) {
    return <Spin size="large" className="flex justify-center items-center h-96" />;
  }

  return (
    <div className="space-y-4">
      {isEditMode ? (
        <>
          <Text className="text-sm text-gray-600 block" style={{ fontFamily: 'Geist, sans-serif' }}>
            Customize the message template for this alert. Use placeholders to insert dynamic values.
          </Text>

          <div className="space-y-2">
            <Text className="text-sm font-medium text-gray-900 block" style={{ fontFamily: 'Geist, sans-serif' }}>Message Header</Text>
            <Input
              placeholder="Enter Message Header"
              value={messageTemplateHeader}
              onChange={(e) => setMessageTemplateHeader(e.target.value)}
              className="font-geist"
              style={{ fontFamily: 'Geist, sans-serif' }}
            />
          </div>

          <div className="space-y-2">
            <Text className="text-sm font-medium text-gray-900 block" style={{ fontFamily: 'Geist, sans-serif' }}>Message Template</Text>
            <TextArea
              placeholder="Enter Message Template"
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              rows={10}
              className="font-geist"
              style={{ fontFamily: 'Geist, sans-serif' }}
            />
            <Text className="text-xs text-gray-500 block" style={{ fontFamily: 'Geist, sans-serif' }}>{messageTemplateHint}</Text>
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleUpdate} icon={<SaveOutlined />}>
              Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Text className="text-sm text-gray-600 block" style={{ fontFamily: 'Geist, sans-serif' }}>Message Header</Text>
            <Title level={5} className="text-base font-semibold m-0" style={{ fontFamily: 'Geist, sans-serif' }}>{messageTemplateHeader}</Title>
          </div>

          <Card 
            className="border border-gray-200"
            styles={{ body: { padding: '12px' } }}
          >
            <Text className="text-sm text-gray-600 block mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>Message Template</Text>
            <Text className="text-sm whitespace-pre-wrap text-gray-700 block" style={{ fontFamily: 'Geist, sans-serif' }}>{messageTemplate}</Text>
          </Card>

          <div className="flex justify-end">
            <Button type="primary" onClick={handleEdit} icon={<EditOutlined />}>
              Edit
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
