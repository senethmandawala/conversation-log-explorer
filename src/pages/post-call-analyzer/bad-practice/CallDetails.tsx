import { useState, useEffect } from "react";
import { 
  Card, 
  Tag, 
  Typography,
  Skeleton,
  Table,
  ConfigProvider
} from "antd";
import { 
  ExclamationCircleOutlined,
  UserOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface TranscriptEntry {
  speaker: string;
  timestamp: string;
  message: string;
  isHighlighted?: boolean;
  highlightedTerms?: { text: string; isImportant: boolean }[];
}

interface MetadataComparison {
  field: string;
  metadataValue: string;
  conversationValue: string;
  hasMismatch: boolean;
}

interface CallDetailsProps {
  callId: string;
}

// Mock data
const mockViolationTypes = [
  "Interrupting Customer",
  "Not Following Script",
  "Rude Behavior"
];

const mockMetadataComparison: MetadataComparison[] = [
  {
    field: "Customer Name",
    metadataValue: "John Doe",
    conversationValue: "John Doe",
    hasMismatch: false,
  },
  {
    field: "Account Number",
    metadataValue: "ACC-12345",
    conversationValue: "ACC-12345",
    hasMismatch: false,
  },
  {
    field: "Issue Type",
    metadataValue: "Billing",
    conversationValue: "Technical Support",
    hasMismatch: true,
  },
  {
    field: "Priority",
    metadataValue: "High",
    conversationValue: "Medium",
    hasMismatch: true,
  },
];

const mockTranscript: TranscriptEntry[] = [
  {
    speaker: "Agent",
    timestamp: "00:00:05",
    message: "Hello, thank you for calling. How can I help you today?",
    isHighlighted: false,
  },
  {
    speaker: "Customer",
    timestamp: "00:00:12",
    message: "Hi, I'm having issues with my billing statement.",
    isHighlighted: false,
  },
  {
    speaker: "Agent",
    timestamp: "00:00:18",
    message: "I understand. Let me look into that for you right away.",
    isHighlighted: false,
  },
  {
    speaker: "Customer",
    timestamp: "00:00:25",
    message: "I was charged twice for the same service last month.",
    isHighlighted: false,
  },
  {
    speaker: "Agent",
    timestamp: "00:00:30",
    message: "Look, I don't have time for this. You need to check your account properly.",
    isHighlighted: true,
    highlightedTerms: [
      { text: "I don't have time for this", isImportant: true },
    ],
  },
  {
    speaker: "Customer",
    timestamp: "00:00:38",
    message: "Excuse me? I'm just trying to resolve this issue.",
    isHighlighted: false,
  },
  {
    speaker: "Agent",
    timestamp: "00:00:42",
    message: "Fine, what's your account number?",
    isHighlighted: true,
    highlightedTerms: [
      { text: "Fine", isImportant: true },
    ],
  },
  {
    speaker: "Customer",
    timestamp: "00:00:48",
    message: "It's ACC-12345.",
    isHighlighted: false,
  },
  {
    speaker: "Agent",
    timestamp: "00:00:52",
    message: "Okay, I see the issue. You'll get a refund in 5-7 business days.",
    isHighlighted: false,
  },
  {
    speaker: "Customer",
    timestamp: "00:01:00",
    message: "Thank you. Can I get a confirmation email?",
    isHighlighted: false,
  },
  {
    speaker: "Agent",
    timestamp: "00:01:05",
    message: "Yeah, whatever. Is there anything else?",
    isHighlighted: true,
    highlightedTerms: [
      { text: "Yeah, whatever", isImportant: true },
    ],
  },
];

  // Table columns for metadata comparison
  const metadataColumns: ColumnsType<MetadataComparison> = [
    {
      title: 'Data Field',
      dataIndex: 'field',
      key: 'field',
      render: (text: string) => <Text style={{ fontSize: 14 }}>{text}</Text>,
    },
    {
      title: 'Metadata Value',
      dataIndex: 'metadataValue',
      key: 'metadataValue',
      render: (text: string) => <Text style={{ fontSize: 14 }}>{text}</Text>,
    },
    {
      title: 'Conversation Value',
      dataIndex: 'conversationValue',
      key: 'conversationValue',
      render: (text: string, record: MetadataComparison) => (
        <Text 
          style={{ 
            fontSize: 14, 
            color: record.hasMismatch ? '#dc2626' : 'inherit',
            fontWeight: record.hasMismatch ? 600 : 'normal'
          }}
        >
          {text}
        </Text>
      ),
    },
  ];

export default function CallDetails({ callId }: CallDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [violationTypes, setViolationTypes] = useState<string[]>([]);
  const [metadataComparison, setMetadataComparison] = useState<MetadataComparison[]>([]);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setViolationTypes(mockViolationTypes);
      setMetadataComparison(mockMetadataComparison);
      setTranscript(mockTranscript);
      setLoading(false);
    }, 500);
  }, [callId]);

  const highlightText = (entry: TranscriptEntry) => {
    if (!entry.isHighlighted || !entry.highlightedTerms || entry.highlightedTerms.length === 0) {
      return <span>{entry.message}</span>;
    }

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    entry.highlightedTerms.forEach((term, idx) => {
      const termIndex = entry.message.indexOf(term.text, lastIndex);
      
      if (termIndex > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>
            {entry.message.substring(lastIndex, termIndex)}
          </span>
        );
      }

      parts.push(
        <strong
          key={`term-${idx}`}
          style={{ 
            color: term.isImportant ? '#dc2626' : 'inherit',
            fontWeight: term.isImportant ? 700 : 600
          }}
        >
          {term.text}
        </strong>
      );

      lastIndex = termIndex + term.text.length;
    });

    if (lastIndex < entry.message.length) {
      parts.push(
        <span key="text-end">{entry.message.substring(lastIndex)}</span>
      );
    }

    return <>{parts}</>;
  };

if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
        <Skeleton.Input active style={{ width: 200 }} />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#475569',
            headerSortActiveBg: '#f1f5f9',
            rowHoverBg: '#f8fafc',
            borderColor: '#e2e8f0',
          },
          Card: {
            headerBg: 'transparent',
          },
        },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Violation Types */}
        {violationTypes.length > 0 && (
          <Card
            style={{ 
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8
            }}
            styles={{ body: { padding: 16 } }}
          >
            <Text type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>Violation Types</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {violationTypes.map((type, index) => (
                <Tag key={index} color="red" style={{ borderRadius: 6 }}>
                  {type}
                </Tag>
              ))}
            </div>
          </Card>
        )}

        {/* Metadata Comparison */}
        {metadataComparison.length > 0 && (
          <div>
            <Title level={5} style={{ marginBottom: 12 }}>Metadata Comparison</Title>
            <Card
              style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}
              styles={{ body: { padding: 0 } }}
            >
              <Table
                columns={metadataColumns}
                dataSource={metadataComparison}
                pagination={false}
                size="small"
                rowKey="field"
              />
            </Card>
          </div>
        )}

        {/* Call Transcript */}
        {transcript.length > 0 && (
          <div>
            <Title level={5} style={{ marginBottom: 12 }}>Call Transcript</Title>
            <Card
              style={{ 
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                maxHeight: 500,
                overflow: 'auto'
              }}
              styles={{ body: { padding: 16 } }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {transcript.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      borderLeft: `4px solid ${entry.speaker.toLowerCase() === "agent" ? "#3b82f6" : "#10b981"}`,
                      backgroundColor: entry.speaker.toLowerCase() === "agent" ? "#dbeafe" : "#d1fae5",
                      boxShadow: entry.isHighlighted ? "0 0 0 2px rgba(245, 158, 11, 0.3)" : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {entry.speaker.toLowerCase() === "agent" ? (
                          <UserOutlined style={{ color: '#3b82f6', fontSize: 14 }} />
                        ) : (
                          <ExclamationCircleOutlined style={{ color: '#10b981', fontSize: 14 }} />
                        )}
                        <Text strong style={{ fontSize: 14 }}>{entry.speaker}</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>{entry.timestamp}</Text>
                      </div>
                    </div>
                    <div style={{ fontSize: 14 }}>
                      {highlightText(entry)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {transcript.length === 0 && metadataComparison.length === 0 && violationTypes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Text type="secondary">No call details available</Text>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}
