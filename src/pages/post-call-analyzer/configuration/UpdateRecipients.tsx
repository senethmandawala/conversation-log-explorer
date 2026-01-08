import { useState } from "react";
import { 
  Button, 
  Input, 
  Typography, 
  Tag,
  Spin,
  message
} from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Recipient {
  name: string;
}

export default function UpdateRecipients() {
  const [contentLoading, setContentLoading] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [inputValue, setInputValue] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = inputValue.trim();

      if (value) {
        if (!validateEmail(value)) {
          message.error("Please enter a valid email address");
          return;
        }

        if (recipients.some((r) => r.name === value)) {
          message.error("This email is already added");
          return;
        }

        setRecipients([...recipients, { name: value }]);
        setInputValue("");
        message.success("Recipient added");
      }
    }
  };

  const handleRemoveRecipient = (recipient: Recipient) => {
    setRecipients(recipients.filter((r) => r.name !== recipient.name));
    message.success("Recipient removed");
  };

  const handleUpdate = () => {
    message.success("Recipients updated successfully");
  };

  if (contentLoading) {
    return <Spin size="large" className="flex justify-center items-center h-48" />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Text className="text-sm font-medium text-gray-900 block" style={{ fontFamily: 'Geist, sans-serif' }}>Recipients Email Address</Text>
        <div className="space-y-2">
          {recipients.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[60px]">
              {recipients.map((recipient, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveRecipient(recipient)}
                  className="px-3 py-1 flex items-center gap-1"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  {recipient.name}
                </Tag>
              ))}
            </div>
          )}
          <Input
            placeholder="Enter recipient email address (press Enter or comma to add)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddRecipient}
            className="font-geist"
            style={{ fontFamily: 'Geist, sans-serif' }}
          />
          <Text className="text-xs text-gray-500 block" style={{ fontFamily: 'Geist, sans-serif' }}>
            Press Enter or comma to add multiple email addresses
          </Text>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="primary" onClick={handleUpdate}>
          Update
        </Button>
      </div>
    </div>
  );
}
