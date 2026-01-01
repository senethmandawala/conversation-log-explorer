import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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
          className={term.isImportant ? "text-red-600 font-bold" : "font-semibold"}
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Violation Types */}
      {violationTypes.length > 0 && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-2">Violation Types</div>
            <div className="flex flex-wrap gap-2">
              {violationTypes.map((type, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-accent/50 text-accent-foreground border-accent"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata Comparison */}
      {metadataComparison.length > 0 && (
        <div>
          <h5 className="text-lg font-semibold mb-3">Metadata Comparison</h5>
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-3 font-semibold text-sm">Data Field</th>
                  <th className="text-left p-3 font-semibold text-sm">Metadata Value</th>
                  <th className="text-left p-3 font-semibold text-sm">Conversation Value</th>
                </tr>
              </thead>
              <tbody>
                {metadataComparison.map((item, index) => (
                  <tr key={index} className="border-t border-border/30">
                    <td className="p-3 text-sm">{item.field}</td>
                    <td className="p-3 text-sm">{item.metadataValue}</td>
                    <td className={`p-3 text-sm ${item.hasMismatch ? "text-red-600 font-medium" : ""}`}>
                      {item.conversationValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Call Transcript */}
      {transcript.length > 0 && (
        <div>
          <h5 className="text-lg font-semibold mb-3">Call Transcript</h5>
          <div className="space-y-3 max-h-[500px] overflow-y-auto border border-border/50 rounded-lg p-4">
            {transcript.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg ${
                  entry.speaker.toLowerCase() === "agent"
                    ? "bg-blue-500/10 border-l-4 border-blue-500"
                    : "bg-green-500/10 border-l-4 border-green-500"
                } ${entry.isHighlighted ? "ring-2 ring-amber-500/50" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{entry.speaker}</span>
                  <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                </div>
                <div className="text-sm">
                  {highlightText(entry)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {transcript.length === 0 && metadataComparison.length === 0 && violationTypes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No call details available
        </div>
      )}
    </div>
  );
}
