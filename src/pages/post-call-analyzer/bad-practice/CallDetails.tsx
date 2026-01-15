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
  IconAlertCircle,
  IconUser,
  IconClock
} from "@tabler/icons-react";
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
      render: (text: string) => <Text className="text-sm">{text}</Text>,
    },
    {
      title: 'Metadata Value',
      dataIndex: 'metadataValue',
      key: 'metadataValue',
      render: (text: string) => <Text className="text-sm">{text}</Text>,
    },
    {
      title: 'Conversation Value',
      dataIndex: 'conversationValue',
      key: 'conversationValue',
      render: (text: string, record: MetadataComparison) => (
        <Text 
          className={`text-sm ${record.hasMismatch ? 'text-red-600 font-semibold' : ''}`}
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
          className={term.isImportant ? 'text-red-600 font-bold' : 'font-semibold'}
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
      <div className="flex justify-center py-12">
        <Skeleton.Input active className="w-[200px]" />
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
      <div className="flex flex-col gap-4">
        {/* Violation Types */}
        {violationTypes.length > 0 && (
          <Card
            className="bg-slate-50 border-slate-200 rounded-lg"
            styles={{ body: { padding: 16 } }}
          >
            <Text type="secondary" className="text-xs mb-2 block">Violation Types</Text>
            <div className="flex flex-wrap gap-2">
              {violationTypes.map((type, index) => (
                <Tag key={index} color="red" className="rounded-md">
                  {type}
                </Tag>
              ))}
            </div>
          </Card>
        )}

        {/* Metadata Comparison */}
        {metadataComparison.length > 0 && (
          <div>
            <Title level={5} className="mb-3">Metadata Comparison</Title>
            <Card
              className="border-slate-200 rounded-lg"
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
            <Title level={5} className="mb-3">Call Transcript</Title>
            <Card
              className="border-slate-200 rounded-lg max-h-[500px] overflow-auto"
              styles={{ body: { padding: 16 } }}
            >
              <div className="flex flex-col gap-3">
                {transcript.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg border-l-4 ${entry.speaker.toLowerCase() === "agent" ? "border-l-blue-500 bg-blue-100" : "border-l-emerald-500 bg-emerald-100"} ${entry.isHighlighted ? "ring-2 ring-amber-500/30" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        {entry.speaker.toLowerCase() === "agent" ? (
                          <IconUser className="text-blue-500 text-sm" />
                        ) : (
                          <IconAlertCircle className="text-emerald-500 text-sm" />
                        )}
                        <Text strong className="text-sm">{entry.speaker}</Text>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconClock className="text-slate-400 text-xs" />
                        <Text type="secondary" className="text-xs">{entry.timestamp}</Text>
                      </div>
                    </div>
                    <div className="text-sm">
                      {highlightText(entry)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {transcript.length === 0 && metadataComparison.length === 0 && violationTypes.length === 0 && (
          <div className="text-center py-12">
            <Text type="secondary">No call details available</Text>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}
